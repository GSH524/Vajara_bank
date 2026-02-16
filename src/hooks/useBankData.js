import { useState, useEffect } from 'react';

export const useBankData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/bankData.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const rawData = await response.json();

                // DATA NORMALIZATION
                const normalizedData = rawData.map(item => {
                    const cibil = Number(item['CIBIL_Score']);
                    const delayDays = Number(item['Payment Delay Days']);
                    const riskLevel = item['RiskLevel'];

                    // Banking Risk Logic
                    let isHighRisk = false;
                    if (riskLevel === 'High' || delayDays > 60 || cibil < 650) {
                        isHighRisk = true;
                    }

                    return {
                        customerId: item['Customer ID'],
                        firstName: item['First Name'],
                        lastName: item['Last Name'],
                        fullName: `${item['First Name']} ${item['Last Name']}`,
                        age: item['Age'],
                        gender: item['Gender'],
                        email: item['Email'],
                        accountType: item['Account Type'],
                        balance: Number(item['Account Balance']),
                        riskLevel: riskLevel,
                        activeStatus: item['ActiveStatus'],
                        cibilScore: cibil,
                        paymentDelay: delayDays,
                        isHighRisk: isHighRisk,
                        isFrozen: item['FreezeAccount'] === 'True',
                        transactions: [], // Placeholder if we had transaction array
                        raw: item // Keep raw just in case
                    };
                });

                setData(normalizedData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching bank data:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};
