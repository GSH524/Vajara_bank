// src/utils/bankUtils.js

export const normalizeUserData = (data) => {
  return {
    uid: data["Customer ID"], 
    firstName: data["First Name"],
    lastName: data["Last Name"],
    email: data["Email"],
    mobile: data["Contact Number"],
    balance: data["Account Balance"],
    accountNumber: data["Account_Number"],
    accountType: data["Account Type"],
    accountStatus: data["ActiveStatus"],
    kycStatus: "Verified",
    role: "user",
    transactions: [
      {
        id: data["TransactionID"],
        date: data["Transaction Date"],
        amount: data["Transaction Amount"],
        type: data["Transaction Type"] === "Deposit" ? "Credit" : "Debit",
        reason: data["Transaction_Reason"] || "Opening Balance",
        status: "Success",
        balanceAfter: data["Account Balance After Transaction"]
      }
    ]
  };
};

export const getBankData = async () => {
  try {
    // Add timestamp to prevent caching
    const response = await fetch(`/bankData.json?t=${new Date().getTime()}`);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received HTML instead of JSON. Check that dataBank.json is in the public folder.");
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error("CRITICAL: Bank Data Fetch Error.", error);
    return [];
  }
};

export const findUserByEmail = async (email) => {
  const data = await getBankData();
  const list = Array.isArray(data) ? data : [data]; 
  const user = list.find(u => u.Email?.toLowerCase() === email.toLowerCase());
  return user ? normalizeUserData(user) : null;
};

export const findAccountByNumber = async (accNum) => {
  try {
    const data = await getBankData();
    const list = Array.isArray(data) ? data : [data];
    const searchNum = String(accNum).trim();
    
    return list.find(u => {
      const dbAcc = u.Account_Number || u.accountNumber;
      return String(dbAcc).trim() === searchNum;
    });
  } catch (err) {
    console.error("Search Error:", err);
    return null;
  }
};