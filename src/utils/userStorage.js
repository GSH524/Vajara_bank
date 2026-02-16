// User Storage Utility for localStorage-based account management
// Matches bankData.json schema for compatibility

const STORAGE_KEY = 'vajrabank_users';

// Generate unique customer ID
export const generateCustomerId = () => {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `CUST-${dateStr}-${random}`;
};

// Generate account number
export const generateAccountNumber = () => {
    return Math.floor(10000000000 + Math.random() * 90000000000);
};

// Get all users from localStorage
export const getAllUsers = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading users from localStorage:', error);
        return [];
    }
};

// Check if email already exists
export const checkEmailExists = (email) => {
    const users = getAllUsers();
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
};

// Save new user
export const saveNewUser = (userData) => {
    try {
        const users = getAllUsers();
        const customerId = generateCustomerId();
        const accountNumber = generateAccountNumber();
        const now = new Date().toISOString();

        const newUser = {
            customerId,
            email: userData.email,
            password: userData.password, // In production, this should be hashed
            firstName: userData.firstName,
            lastName: userData.lastName,
            age: calculateAge(userData.dob),
            gender: userData.gender,
            address: userData.address,
            contactNumber: userData.mobile,
            accountType: userData.accountType,
            accountBalance: userData.initialDeposit,
            accountNumber,
            dateOfAccountOpening: now.split('T')[0],
            lastTransactionDate: now.split('T')[0],
            transactions: [],
            creditLimit: 50000, // Default credit limit
            creditCardBalance: 0,
            minimumPaymentDue: 0,
            paymentDueDate: '',
            kycStatus: 'Pending',
            activeStatus: 'Active',
            riskLevel: 'Low',
            idProofType: userData.idProofType,
            idProofNumber: userData.idProofNumber,
            city: userData.city,
            state: userData.state,
            pincode: userData.pincode,
            username: userData.username || userData.email.split('@')[0],
            createdAt: now,
            raw: {
                'Customer ID': customerId,
                'First Name': userData.firstName,
                'Last Name': userData.lastName,
                'Age': calculateAge(userData.dob),
                'Gender': userData.gender,
                'Address': userData.address,
                'Contact Number': userData.mobile,
                'Email': userData.email,
                'Account Type': userData.accountType,
                'Account Balance': userData.initialDeposit,
                'Account_Number': accountNumber,
                'Date Of Account Opening': now.split('T')[0],
                'Last Transaction Date': now.split('T')[0],
                'Transaction Date': now.split('T')[0],
                'Transaction Type': 'Deposit',
                'Transaction Amount': userData.initialDeposit,
                'Account Balance After Transaction': userData.initialDeposit,
                'Credit Limit': 50000,
                'Credit Card Balance': 0,
                'ActiveStatus': 'Active',
                'RiskLevel': 'Low'
            }
        };

        users.push(newUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        return { success: true, user: newUser };
    } catch (error) {
        console.error('Error saving user:', error);
        return { success: false, error: error.message };
    }
};

// Get user by email and password
export const getUserByEmailPassword = (email, password) => {
    const users = getAllUsers();
    return users.find(
        user => user.email.toLowerCase() === email.toLowerCase() && user.password === password
    );
};

// Calculate age from DOB
const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

// Update user data
export const updateUser = (customerId, updates) => {
    try {
        const users = getAllUsers();
        const index = users.findIndex(u => u.customerId === customerId);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
            return { success: true };
        }
        return { success: false, error: 'User not found' };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
