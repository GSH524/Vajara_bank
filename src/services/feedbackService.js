/**
 * feedbackService.js
 * Handles storage and retrieval of feedback tickets using localStorage.
 * Implements a simple subscription pattern for real-time-like updates.
 */

const STORAGE_KEY = 'vajra_feedback_tickets';

class FeedbackService {
    constructor() {
        this.listeners = [];
        // Initialize storage if empty
        if (!localStorage.getItem(STORAGE_KEY)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        }

        // Listen for cross-tab updates
        window.addEventListener('storage', (e) => {
            if (e.key === STORAGE_KEY) {
                this.notifyListeners();
            }
        });
    }

    // --- Data Access ---

    getAllTickets() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        } catch (e) {
            console.error("Error reading tickets", e);
            return [];
        }
    }

    saveTickets(tickets) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
        this.notifyListeners();
    }

    addTicket(ticket) {
        const tickets = this.getAllTickets();
        const newTicket = {
            id: Date.now().toString(), // Simple ID
            status: 'Pending',
            createdAt: new Date().toISOString(),
            ...ticket
        };
        tickets.unshift(newTicket); // Add to top
        this.saveTickets(tickets);
        return newTicket;
    }

    updateTicketStatus(ticketId, newStatus) {
        const tickets = this.getAllTickets();
        const index = tickets.findIndex(t => t.id === ticketId);
        if (index !== -1) {
            tickets[index].status = newStatus;
            tickets[index].updatedAt = new Date().toISOString();
            this.saveTickets(tickets);
            return true;
        }
        return false;
    }

    getPendingCount() {
        const tickets = this.getAllTickets();
        return tickets.filter(t => t.status === 'Pending').length;
    }

    // --- Subscription (Observer Pattern) ---

    subscribe(callback) {
        this.listeners.push(callback);
        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    notifyListeners() {
        this.listeners.forEach(cb => cb());
    }
}

export const feedbackService = new FeedbackService();
