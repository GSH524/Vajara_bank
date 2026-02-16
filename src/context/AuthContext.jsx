import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { userAuth, userDB } from "../firebaseUser";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Restore Admin Session (Sync)
    const savedAdmin = localStorage.getItem("adminUser");
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
    }

    // 2. Firebase Auth Listener
    const unsubscribeUser = onAuthStateChanged(userAuth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // If Firebase has a user, fetch their detailed profile
          const userDoc = await getDoc(doc(userDB, 'users', firebaseUser.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: "user", // Default role
              displayName: `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "User",
              ...userData
            };

            setUser(userProfile);

            // Real-time listener for Balance/Status Overrides
            onSnapshot(doc(userDB, 'overrides', firebaseUser.uid), (snapshot) => {
              if (snapshot.exists()) {
                setUser(prev => ({ ...prev, ...snapshot.data() }));
              }
            });
          }
        } else {
          // If NO Firebase user, check for Legacy user session
          const savedLegacy = localStorage.getItem("legacyUser");
          if (savedLegacy) {
            setUser(JSON.parse(savedLegacy));
          } else {
            setUser(null);
          }
        }
      } catch (e) {
        console.error("Auth Refresh Error:", e);
      } finally {
        // Stop loading ONLY after session checks are complete
        setLoading(false);
      }
    });

    return () => unsubscribeUser();
  }, []);

  // --- ACTIONS ---

  const loginUser = (userData) => {
    setUser(userData);
  };

  const loginLegacyUser = (legacyData) => {
    const mappedUser = {
      uid: legacyData["Customer ID"],
      email: legacyData["Email"],
      role: "user",
      source: "legacy",
      ...legacyData
    };
    setUser(mappedUser);
    localStorage.setItem("legacyUser", JSON.stringify(mappedUser));
  };

  const loginAdmin = (email, password) => {
    if (email === "admin@vajra.com" && password === "Admin123") {
      const adminData = { email, role: "admin", name: "System Admin" };
      setAdmin(adminData);
      localStorage.setItem("adminUser", JSON.stringify(adminData));
      return true;
    }
    return false;
  };

  const logoutUser = async () => {
    await signOut(userAuth);
    localStorage.removeItem("legacyUser");
    setUser(null);
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem("adminUser");
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        user,
        loading,
        loginUser,
        loginLegacyUser,
        logoutUser,
        loginAdmin,
        logoutAdmin,
        isAdminLoggedIn: Boolean(admin),
      }}
    >
      {/* Do not render children until loading is false to prevent false redirects */}
      {!loading ? children : (
        <div className="flex h-screen w-full items-center justify-center bg-[#020617]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Securing Session...</p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);