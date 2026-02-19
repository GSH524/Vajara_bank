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
                // 1. Fetch Firebase "users1" (Legacy Collection)
                const users1Snapshot = await getDocs(collection(userDB, 'users1'));
                const users1Data = users1Snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // 2. Fetch Firebase "users" (New Users Collection)
                const usersSnapshot = await getDocs(collection(userDB, 'users'));
                const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // 3. Combine and Normalize (No local JSON)
                const combinedRaw = [...users1Data, ...usersData];
                
                // Use a Map to ensure unique users by Email
                const uniqueDataMap = new Map();

                combinedRaw.forEach(item => {
                    const email = (item.Email || item.email || "").toLowerCase();
                    if (!email || uniqueDataMap.has(email)) return;

                    const cibil = Number(item['CIBIL_Score'] || item.cibilScore || 0);
                    const delayDays = Number(item['Payment Delay Days'] || item.paymentDelay || 0);
                    const riskLevel = item['RiskLevel'] || item.riskLevel || 'Low';

                    let isHighRisk = riskLevel === 'High' || delayDays > 60 || cibil < 650;

                    const normalized = {
                        customerId: item['Customer ID'] || item.customerId || item.uid || 'NEW',
                        firstName: item['First Name'] || item.firstName || 'User',
                        lastName: item['Last Name'] || item.lastName || '',
                        fullName: item.fullName || `${item['First Name'] || item.firstName || ''} ${item['Last Name'] || item.lastName || ''}`.trim(),
                        age: item['Age'] || item.age || 'N/A',
                        gender: item['Gender'] || item.gender || 'N/A',
                        email: email,
                        accountType: item['Account Type'] || item.accountType || 'Savings',
                        balance: Number(item['Account Balance'] || item.balance || 0),
                        riskLevel: riskLevel,
                        activeStatus: item['ActiveStatus'] || item.status || 'Active',
                        cibilScore: cibil,
                        paymentDelay: delayDays,
                        isHighRisk: isHighRisk,
                        isFrozen: item['FreezeAccount'] === 'True' || item.isFrozen === true,
                        source: item['Customer ID'] ? 'Legacy' : 'Firebase',
                        raw: item
                    };

                    uniqueDataMap.set(email, normalized);
                });

                setData(Array.from(uniqueDataMap.values()));
                setLoading(false);
            } catch (err) {
                console.error("Error fetching bank data:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    return { data, loading, error };
};