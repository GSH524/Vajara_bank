/**
 * paymentService.js
 * Handles payment processing for Partner Subscriptions.
 * Support MOCK_PAYMENT mode for demos.
 */

const IS_MOCK = import.meta.env.VITE_MOCK_PAYMENT !== 'false'; // Default to true if not set

export const paymentService = {
    isMockMode: () => IS_MOCK,

    initiatePayment: async (planDetails) => {
        console.log(`[PaymentService] Initiating payment for ${planDetails.name} (${planDetails.price})`);

        if (IS_MOCK) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        paymentId: `pay_mock_${Date.now()}`,
                        orderId: `order_mock_${Date.now()}`,
                        message: "Mock payment successful"
                    });
                }, 1500); // Simulate network delay
            });
        } else {
            // TODO: Real Razorpay integration would go here
            console.warn("Real payment not implemented without API keys.");
            return Promise.reject("Real payment gateway not configured.");
        }
    }
};
