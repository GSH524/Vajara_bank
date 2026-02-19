import { useState, useEffect } from 'react';

export const useAdminActions = () => {
    // STATE: Map of customerId -> { isFrozen, flagged, remarks, kycStatus, loanStatus, cardBlocked }
    const [overrides, setOverrides] = useState({});
    const [auditLogs, setAuditLogs] = useState([]);

    // LOAD FROM LOCAL STORAGE ON MOUNT
    useEffect(() => {
        try {
            const savedOverrides = localStorage.getItem('adminOverrides');
            const savedLogs = localStorage.getItem('adminAuditLogs');

            if (savedOverrides) setOverrides(JSON.parse(savedOverrides));
            if (savedLogs) setAuditLogs(JSON.parse(savedLogs));
        } catch (error) {
            console.error("Failed to load admin state:", error);
        }
    }, []);

    // HELPER: Save to Local Storage
    const persist = (newOverrides, newLogs) => {
        setOverrides(newOverrides);
        setAuditLogs(newLogs);
        localStorage.setItem('adminOverrides', JSON.stringify(newOverrides));
        localStorage.setItem('adminAuditLogs', JSON.stringify(newLogs));
    };

    // ACTION: Add Audit Log Entry
    const logAction = (customerId, action, details, currentLogs) => {
        const newLog = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            customerId,
            action,
            details,
            admin: "Mahesh K." // Hardcoded for now
        };
        return [newLog, ...currentLogs];
    };

    // GENERIC UPDATE HELPER
    const updateCustomerState = (customerId, field, value, actionName, logDetails) => {
        const newOverrides = {
            ...overrides,
            [customerId]: {
                ...overrides[customerId],
                [field]: value
            }
        };
        const newLogs = logAction(customerId, actionName, logDetails, auditLogs);
        persist(newOverrides, newLogs);
    };

    // --- CUSTOMER ACTIONS ---
    const toggleFreeze = (customerId, currentStatus) => {
        updateCustomerState(customerId, 'isFrozen', !currentStatus,
            !currentStatus ? "FREEZE_ACCOUNT" : "UNFREEZE_ACCOUNT",
            `Account ${!currentStatus ? 'frozen' : 'unfrozen'} by admin.`
        );
    };

    const toggleFlag = (customerId, currentStatus) => {
        updateCustomerState(customerId, 'flagged', !currentStatus,
            "FLAG_SUSPICIOUS",
            `Account marked as ${!currentStatus ? 'Suspicious' : 'Safe'}.`
        );
    };

    const addRemark = (customerId, text) => {
        // Remarks don't generate audit logs to avoid spam
        const newOverrides = {
            ...overrides,
            [customerId]: {
                ...overrides[customerId],
                remarks: text
            }
        };
        setOverrides(newOverrides);
        localStorage.setItem('adminOverrides', JSON.stringify(newOverrides));
    };

    // --- KYC ACTIONS ---
    const updateKYC = (customerId, status) => {
        // status: 'Verified' | 'Rejected' | 'Pending'
        updateCustomerState(customerId, 'kycStatus', status,
            `KYC_${status.toUpperCase()}`,
            `KYC status updated to ${status}.`
        );
    };

    // --- LOAN ACTIONS ---
    const updateLoan = (customerId, status) => {
        // status: 'Approved' | 'Rejected' | 'Defaulted'
        updateCustomerState(customerId, 'loanStatus', status,
            `LOAN_${status.toUpperCase()}`,
            `Loan application ${status}.`
        );
    };

    // --- CARD ACTIONS ---
    const toggleCardBlock = (customerId, currentStatus) => {
        updateCustomerState(customerId, 'cardBlocked', !currentStatus,
            !currentStatus ? "CARD_BLOCKED" : "CARD_UNBLOCKED",
            `Credit card ${!currentStatus ? 'blocked' : 'unblocked'}.`
        );
    };

    return {
        overrides,
        auditLogs,
        toggleFreeze,
        toggleFlag,
        addRemark,
        updateKYC,
        updateLoan,
        toggleCardBlock
    };
};