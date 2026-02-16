/**
 * Authentication Service - Frontend
 * Handles login, logout, and token management
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

export const authService = {
    /**
     * Login user and store JWT token
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} User data and token
     */
    login: async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store token in localStorage
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }

            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },



    /**
     * Logout user and remove token
     */
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        console.log('✅ Logged out, token removed');
    },

    /**
     * Get stored JWT token
     * @returns {string|null} JWT token or null
     */
    getToken: () => {
        return localStorage.getItem('authToken');
    },

    /**
     * Get stored user data
     * @returns {Object|null} User object or null
     */
    getUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Check if user is authenticated
     * @returns {boolean} True if token exists
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('authToken');
    },

    /**
     * Check if user has specific role
     * @param {string} role - Role to check (admin, partner, user)
     * @returns {boolean} True if user has role
     */
    hasRole: (role) => {
        const user = authService.getUser();
        return user && user.role === role;
    },

    /**
     * Get current user profile from backend
     * @returns {Promise<Object>} User profile
     */
    getProfile: async () => {
        try {
            const token = authService.getToken();

            if (!token) {
                throw new Error('Not authenticated');
            }

            const response = await fetch(`${API_URL}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch profile');
            }

            return data.user;
        } catch (error) {
            console.error('Get profile error:', error);
            throw error;
        }
    }
};

export default authService;
