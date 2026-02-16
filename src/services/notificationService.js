/**
 * Notification Service - Firebase Firestore
 * Replaces REST API implementation.
 */
import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    doc,
    deleteDoc,
    orderBy,
    writeBatch
} from "firebase/firestore";
import { userDB } from "../firebaseUser";

export const notificationService = {
    /**
     * Get all notifications for the current user/role
     * @param {string} userId - Current User ID
     * @param {string} role - Current User Role
     */
    getNotifications: async (userId, role) => {
        try {
            const notifsRef = collection(userDB, "notifications");
            let q;

            if (role === 'admin') {
                // Admins see notifications targeting 'admin' role
                q = query(
                    notifsRef,
                    where("targetRole", "==", "admin"),
                    orderBy("createdAt", "desc")
                );
            } else {
                // Partners/Users see notifications targeting them specifically 
                // OR targeting their role (if applicable, though usually specific to ID)
                q = query(
                    notifsRef,
                    where("targetUserId", "==", userId),
                    orderBy("createdAt", "desc")
                );
            }

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate()?.toISOString()
            }));

        } catch (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }
    },

    /**
     * Mark a notification as read
     * @param {string} id - Notification ID
     */
    markAsRead: async (id) => {
        try {
            const docRef = doc(userDB, "notifications", id);
            await updateDoc(docRef, { isRead: true });
            return true;
        } catch (error) {
            console.error('Error marking notification read:', error);
            return false;
        }
    },

    /**
     * Mark all notifications as read for a user
     * @param {string} userId
     * @param {string} role
     */
    markAllAsRead: async (userId, role) => {
        try {
            // we need to fetch unread ones first to batch update
            const notifsRef = collection(userDB, "notifications");
            let q;

            if (role === 'admin') {
                q = query(notifsRef, where("targetRole", "==", "admin"), where("isRead", "==", false));
            } else {
                q = query(notifsRef, where("targetUserId", "==", userId), where("isRead", "==", false));
            }

            const snapshot = await getDocs(q);
            const batch = writeBatch(userDB);

            snapshot.docs.forEach((docSnap) => {
                batch.update(docSnap.ref, { isRead: true });
            });

            await batch.commit();
            return true;
        } catch (error) {
            console.error('Error marking all notifications read:', error);
            return false;
        }
    },

    /**
     * Get unread notifications count
     * @param {string} userId
     * @param {string} role
     */
    getUnreadCount: async (userId, role) => {
        try {
            const notifsRef = collection(userDB, "notifications");
            let q;

            if (role === 'admin') {
                q = query(notifsRef, where("targetRole", "==", "admin"), where("isRead", "==", false));
            } else {
                q = query(notifsRef, where("targetUserId", "==", userId), where("isRead", "==", false));
            }

            const snapshot = await getDocs(q);
            return snapshot.size;
        } catch (error) {
            console.error('Error fetching unread count:', error);
            return 0;
        }
    },

    /**
     * Delete a notification
     * @param {string} id - Notification ID
     */
    deleteNotification: async (id) => {
        try {
            await deleteDoc(doc(userDB, "notifications", id));
            return true;
        } catch (error) {
            console.error('Error deleting notification:', error);
            return false;
        }
    }
};
