import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { userDB } from '../firebaseUser';

export const useBankData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [users1Snapshot, usersSnapshot] = await Promise.all([
                    getDocs(collection(userDB, 'users1')),
                    getDocs(collection(userDB, 'users'))
                ]);

                const combinedRaw = [
                    ...users1Snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                    ...usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                ];

                const uniqueDataMap = new Map();

                combinedRaw.forEach(item => {
                    const cId = item['Customer ID'] || item.customerId || item.uid || item.id;
                    if (!cId) return;

                    const cibil = Number(item['CIBIL_Score'] || item.cibilScore || 0);
                    
                    // NORMALIZATION: Mapping disparate keys to a single standard
                    const normalized = {
                        customerId: cId,
                        fullName: item.fullName || `${item['First Name'] || ''} ${item['Last Name'] || ''}`.trim(),
                        firstName: item['First Name'] || item.firstName || 'Unknown',
                        lastName: item['Last Name'] || item.lastName || 'User',
                        email: (item['Email'] || item.email || "N/A").toLowerCase(),
                        gender: item['Gender'] || item.gender || 'Unknown',
                        accountType: item['Account Type'] || item.accountType || 'Savings',
                        balance: Number(item['Account Balance'] || item.balance || 0),
                        activeStatus: item['ActiveStatus'] || item.status || 'Active',
                        cibilScore: cibil,
                        paymentDelay: Number(item['Payment Delay Days'] || item.paymentDelay || 0),
                        isHighRisk: item['RiskLevel'] === 'High' || cibil < 650 || item['Anomaly_Flag'] === 1,
                        isFrozen: item['FreezeAccount'] === true || item['FreezeAccount'] === 'True' || item.isFrozen === true,
                        raw: item 
                    };

                    uniqueDataMap.set(cId, normalized);
                });

                setData(Array.from(uniqueDataMap.values()));
            } catch (err) {
                console.error("Nexus Sync Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    return { data, loading, error };
};