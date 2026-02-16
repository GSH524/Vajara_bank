/**
 * Utility functions for Credit Card management.
 */

/**
 * Masks a card number, showing only the last 4 digits.
 * @param {string|number} number 
 */
export const maskCardNumber = (number) => {
    if (!number) return "**** **** **** ****";
    const str = number.toString().replace(/\s/g, '');
    return `**** **** **** ${str.slice(-4)}`;
};

/**
 * Generates a random 16-digit card number.
 */
export const generateCardNumber = () => {
    let num = "4242"; // Vajra Prefix
    for (let i = 0; i < 12; i++) {
        num += Math.floor(Math.random() * 10);
    }
    return num.match(/.{1,4}/g).join(' ');
};

/**
 * Generates card expiry and CVV.
 */
export const generateCardSecurity = () => {
    const today = new Date();
    const expiry = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getFullYear() + 5).slice(-2)}`;
    const cvv = Math.floor(100 + Math.random() * 900);
    return { expiry, cvv };
};

/**
 * Returns credit limits and benefits based on Vajra Card types.
 */
export const getCardDetailsByType = (type) => {
    const types = {
        "Vajra Classic": {
            limit: 50000,
            color: "linear-gradient(135deg, #64748b, #334155)",
            benefits: ["1% Cashback", "No Annual Fee"]
        },
        "Vajra Gold": {
            limit: 150000,
            color: "linear-gradient(135deg, #d97706, #92400e)",
            benefits: ["2% Cashback", "Lounge Access", "Purchase Protection"]
        },
        "Vajra Platinum": {
            limit: 500000,
            color: "linear-gradient(135deg, #0f172a, #1e293b)",
            benefits: ["5% Cashback", "Unlimited Lounges", "Golf Benefits", "Concierge"]
        }
    };
    return types[type] || types["Vajra Classic"];
};

/**
 * Maps transaction reasons to UI-friendly categories.
 */
export const mapTransactionCategory = (reason) => {
    if (!reason) return "Other";
    const r = reason.toLowerCase();
    if (r.includes('shop') || r.includes('amazon') || r.includes('flipkart')) return 'Shopping';
    if (r.includes('food') || r.includes('zomato') || r.includes('swiggy') || r.includes('restaurant')) return 'Food';
    if (r.includes('travel') || r.includes('uber') || r.includes('ola') || r.includes('flight')) return 'Travel';
    if (r.includes('fuel') || r.includes('petrol')) return 'Fuel';
    if (r.includes('bill') || r.includes('electricity') || r.includes('water')) return 'Bills';
    if (r.includes('emi') || r.includes('loan')) return 'EMI';
    return 'Other';
};
