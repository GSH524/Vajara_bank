/**
 * Normalizes legacy data from bankData.json rows.
 * Aggregates transactions and loans for a single customer.
 */
export const normalizeLegacyUser = (rows) => {
    if (!rows || rows.length === 0) return null;

    // Use the first row for profile info
    const profile = rows[0];

    // Sort rows by Date (if possible) to get latest balance
    // The dataset is large, but we assume the latest row has the current state
    const latestRow = rows[rows.length - 1];

    const transactions = rows.map((row, idx) => ({
        id: `legacy-tx-${idx}`,
        date: row["Transaction Date"] || row["Date Of Account Opening"],
        description: row["Transaction Type"] === "Deposit" ? "Deposit" : "Withdrawal",
        type: row["Transaction Type"] === "Deposit" ? "Credit" : "Debit",
        amount: row["Transaction Amount"] || 0,
        balanceAfter: row["Account Balance After Transaction"] || row["Account Balance"],
        status: "Success",
        refId: row["TransactionID"] || `TXN-LEG-${idx}`
    })).filter(tx => tx.amount > 0);

    const loans = rows.map((row, idx) => {
        if (!row["Loan ID"] || row["Loan ID"] === "N/A") return null;
        return {
            id: row["Loan ID"],
            amount: row["Loan Amount"],
            type: row["Loan Type"],
            interestRate: row["Interest Rate"],
            termMonths: row["Loan Term"],
            status: row["Loan Status"] === "Approved" ? "approved" : "pending",
            createdAt: row["Date Of Account Opening"]
        };
    }).filter((loan, index, self) =>
        loan !== null && self.findIndex(l => l?.id === loan.id) === index
    );

    return {
        uid: profile["Customer ID"],
        customerId: profile["Customer ID"],
        firstName: profile["First Name"],
        lastName: profile["Last Name"],
        email: profile["Email"],
        mobile: profile["Contact Number"]?.toString(),
        accountType: profile["Account Type"] || "Savings",
        balance: latestRow["Account Balance After Transaction"] || latestRow["Account Balance"] || 0,
        role: "user",
        source: "legacy",
        status: "approved", // Legacy users are pre-approved
        kycStatus: "Verified",
        accountStatus: "Active",
        transactions: transactions.reverse(), // Show latest first
        loans: loans,
        address: profile["Address"],
        age: profile["Age"],
        // Credit Card specific fields
        cardId: profile["CardID"] !== "N/A" ? profile["CardID"] : null,
        cardType: profile["Card Type"] !== "N/A" ? profile["Card Type"] : null,
        creditLimit: Number(profile["Credit Limit"]) || 0,
        creditBalance: Number(profile["Credit Card Balance"]) || 0,
        minPaymentDue: Number(profile["Minimum Payment Due"]) || 0,
        paymentDueDate: profile["Payment Due Date"],
        creditUtilization: Number(profile["Credit Utilization"]) || 0,
        rewardPoints: Number(profile["Rewards Points"]) || 0,
        cardTransactions: rows.filter(r => r["Transaction_Reason"] !== "N/A").map((r, i) => ({
            id: `card-tx-${i}`,
            date: r["Transaction Date"],
            reason: r["Transaction_Reason"],
            amount: Number(r["Transaction Amount"]),
            category: r["Transaction_Reason"] // Will be mapped in UI
        }))
    };
};
