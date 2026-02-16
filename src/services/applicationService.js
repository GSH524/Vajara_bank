import { userDB } from "../firebaseUser"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// 1. Collection: Banking Schemes
export const applyForBankingScheme = async (userId, data) => {
  return await addDoc(collection(userDB, "banking_apps"), {
    userId,
    ...data,
    status: "Pending",
    appliedAt: serverTimestamp(),
  });
};

// 2. Collection: Investment Products
export const applyForInvestment = async (userId, data) => {
  return await addDoc(collection(userDB, "investment_apps"), {
    userId,
    ...data,
    status: "Pending",
    appliedAt: serverTimestamp(),
  });
};

// 3. Collection: Credit Cards (Stores Risk Profile)
export const applyForCreditCard = async (userId, data) => {
  return await addDoc(collection(userDB, "credit_apps"), {
    userId,
    ...data,
    status: "Pending",
    riskProfileAtTime: data.riskLevel, // Crucial for audit
    appliedAt: serverTimestamp(),
  });
};

// 4. Collection: Debit Cards (Stores Risk Profile)
export const applyForDebitCard = async (userId, data) => {
  return await addDoc(collection(userDB, "debit_apps"), {
    userId,
    ...data,
    status: "Pending",
    appliedAt: serverTimestamp(),
  });
};  