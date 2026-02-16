/**
 * Advertisement Service - Firebase Firestore
 * 
 * Replaces previous REST API implementation.
 * Firebase is the single source of truth.
 */
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    serverTimestamp,
    orderBy,
    limit,
    getDoc
} from "firebase/firestore";
import { userDB } from "../firebaseUser";

export const adService = {
    /**
     * 1. GET ACTIVE ADS (Public)
     * Fetches currently active advertisements
     */
    getActiveAds: async (page = null) => {
        try {
            const adsRef = collection(userDB, "ads");
            // Simple query: Status APPROVED
            // In a real app, you might check start/end dates too.
            const q = query(adsRef, where("status", "==", "APPROVED"));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Normalize for frontend
                redirectUrl: doc.data().redirectUrl || '#'
            }));
        } catch (error) {
            console.error('Error fetching active ads:', error);
            return [];
        }
    },

    /**
     * 2. CREATE AD (Partner)
     * Creates a new advertisement (PartnerDashboard calls this or uses direct Firestore)
     * But since we have this service, we can use it.
     */
    createAd: async (adData, partnerId, partnerName) => {
        try {
            const docRef = await addDoc(collection(userDB, "ads"), {
                partnerId: partnerId,
                partnerName: partnerName,
                title: adData.title,
                description: adData.description || "",
                imageUrl: adData.image,
                redirectUrl: adData.url || "",
                activeDays: parseInt(adData.duration),
                status: "PENDING",
                createdAt: serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Error creating ad:', error);
            throw error;
        }
    },

    /**
     * 3. GET PARTNER ADS (Partner)
     */
    getPartnerAds: async (partnerId) => {
        try {
            const q = query(
                collection(userDB, "ads"),
                where("partnerId", "==", partnerId),
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching partner ads:', error);
            // Index might be missing for complex queries
            return [];
        }
    },

    /**
     * 4. GET PENDING ADS (Admin)
     */
    getPendingAds: async () => {
        try {
            const q = query(
                collection(userDB, "ads"),
                where("status", "==", "PENDING")
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                durationDays: doc.data().activeDays, // Map for compatibility
                businessName: doc.data().partnerName, // Map for compatibility
                paymentStatus: 'PAID' // Assumed since they are partners
            }));
        } catch (error) {
            console.error('Error fetching pending ads:', error);
            return [];
        }
    },

    /**
     * 5. APPROVE AD (Admin)
     */
    approveAd: async (adId, durationDays) => {
        try {
            // Update Ad
            await updateDoc(doc(userDB, "ads", adId), {
                status: "APPROVED",
                approvedAt: serverTimestamp(),
                // Calculate expiry? Not strictly needed for this demo, usually handled by a scheduled function
            });

            // Get Ad to find partnerId
            const adSnap = await getDoc(doc(userDB, "ads", adId));
            const adData = adSnap.data();

            // Notify Partner
            if (adData && adData.partnerId) {
                await addDoc(collection(userDB, "notifications"), {
                    targetRole: "partner",
                    targetUserId: adData.partnerId,
                    type: "AD_APPROVED",
                    message: `Your ad "${adData.title}" has been approved!`,
                    isRead: false,
                    createdAt: serverTimestamp()
                });
            }

            return { success: true };
        } catch (error) {
            console.error('Error approving ad:', error);
            throw error;
        }
    },

    /**
     * 6. REJECT AD (Admin)
     */
    rejectAd: async (adOrId) => {
        try {
            let id, reason;
            if (typeof adOrId === 'object') {
                id = adOrId.adId;
                reason = adOrId.reason;
            } else {
                id = adOrId;
                reason = "No reason provided";
            }

            // Update Ad
            await updateDoc(doc(userDB, "ads", id), {
                status: "REJECTED",
                rejectionReason: reason,
                rejectedAt: serverTimestamp()
            });

            // Get Ad to find partnerId
            const adSnap = await getDoc(doc(userDB, "ads", id));
            const adData = adSnap.data();

            // Notify Partner
            if (adData && adData.partnerId) {
                await addDoc(collection(userDB, "notifications"), {
                    targetRole: "partner",
                    targetUserId: adData.partnerId,
                    type: "AD_REJECTED",
                    message: `Your ad "${adData.title}" was rejected: ${reason}`,
                    isRead: false,
                    createdAt: serverTimestamp()
                });
            }

            return { success: true };
        } catch (error) {
            console.error('Error rejecting ad:', error);
            throw error;
        }
    },

    /**
     * 7. GET AD STATS (Admin)
     */
    getAdStats: async () => {
        try {
            // In Firestore, counting efficiently requires Aggregation Queries (v9+)
            // For now, we'll just fetch all (assuming small volume for demo) or use status-specific queries
            // A better way is to keep counters in a 'stats' document.
            // Here, we will just do a rudimentary fetch of all ads for the stats.
            const q = query(collection(userDB, "ads"));
            const snapshot = await getDocs(q);

            const stats = {
                PENDING: 0,
                APPROVED: 0,
                REJECTED: 0
            };

            snapshot.forEach(doc => {
                const s = doc.data().status;
                if (stats[s] !== undefined) stats[s]++;
            });

            // Format used by AdminAds.jsx: { statusCounts: [{_id: 'PENDING', count: 5}, ...], activeCount: [] }
            return {
                statusCounts: [
                    { _id: 'PENDING', count: stats.PENDING },
                    { _id: 'APPROVED', count: stats.APPROVED },
                    { _id: 'REJECTED', count: stats.REJECTED }
                ]
            };
        } catch (error) {
            console.error('Error fetching ad stats:', error);
            return { statusCounts: [] };
        }
    },

    /**
     * 8. TRACK CLICK
     */
    trackClick: async (adId) => {
        console.log("Tracking click for", adId);
        // Implement increment logic if needed
        return { success: true };
    }
};

export default adService;
