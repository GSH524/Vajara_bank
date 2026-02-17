import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userDB } from '../../firebaseUser';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { 
  Person, Envelope, Phone, GeoAlt, ShieldLock, 
  CheckCircle, XCircle, Fingerprint, StarFill
} from 'react-bootstrap-icons';

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: ''
  });
  const [toast, setToast] = useState(null);

  // 1. FETCH FULL DETAILS WITH FALLBACK (users1 -> users)
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.email) return;
      try {
        let activeCollection = "users1";
        let q = query(collection(userDB, "users1"), where("Email", "==", user.email));
        let querySnapshot = await getDocs(q);
        
        // FALLBACK: If not found in users1, check users
        if (querySnapshot.empty) {
          activeCollection = "users";
          q = query(collection(userDB, "users"), where("Email", "==", user.email));
          querySnapshot = await getDocs(q);
        }

        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          const docId = querySnapshot.docs[0].id;
          
          const fullData = {
            docId,
            collectionName: activeCollection, // Store which collection we found them in
            firstName: data["First Name"] || "User",
            lastName: data["Last Name"] || "",
            email: data["Email"],
            phone: data["Contact Number"] || "N/A",
            address: data["Address"] || "Not Set",
            accountNumber: data["Account_Number"] || "Pending",
            balance: data["Account Balance"] || 0,
            rewards: data["Rewards Points"] || 0,
            customerId: data["Customer ID"] || "Pending",
            pan: data["PAN_Card"] || "N/A"
          };

          setProfileData(fullData);
          setFormData({
            email: fullData.email || '',
            phone: fullData.phone || '',
            address: fullData.address || ''
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        showToast("Error loading vault data.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // 2. UPDATE PROFILE IN CORRECT FIRESTORE COLLECTION
  const handleSave = async () => {
    try {
      // Use the specific collection where the user was found
      const userRef = doc(userDB, profileData.collectionName, profileData.docId);
      
      const updatePayload = {
        "Email": formData.email,
        "Contact Number": formData.phone,
        "Address": formData.address
      };

      await updateDoc(userRef, updatePayload);

      setProfileData(prev => ({
        ...prev,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      }));
      
      setIsEditing(false);
      showToast("Vault records synchronized.", "success");
    } catch (error) {
      console.error("Update error:", error);
      showToast("Security update failed.", "error");
    }
  };

  const handleCancel = () => {
    setFormData({
      email: profileData.email,
      phone: profileData.phone,
      address: profileData.address
    });
    setIsEditing(false);
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-400">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-bold uppercase tracking-widest">Accessing Secure Vault...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      {toast && (
        <div className={`fixed top-6 right-6 px-6 py-3 rounded-xl shadow-2xl z-[1000] flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
          toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle /> : <XCircle />}
          <span className="font-bold text-sm">{toast.msg}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Identity Vault</h1>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                Verified: {profileData?.collectionName === 'users1' ? 'Legacy Client' : 'New Account'}
              </p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl flex items-center gap-2 text-amber-500 font-bold text-sm">
              <StarFill size={14}/> {Math.floor(profileData?.rewards)} Points
            </div>
        </header>

        <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="p-8 bg-white/5 border-b border-white/5 flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] flex items-center justify-center text-4xl font-black text-white shadow-xl uppercase">
              {profileData?.firstName?.[0]}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-black text-white uppercase">
                {profileData?.firstName} {profileData?.lastName}
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                <Fingerprint className="text-indigo-400" size={14} />
                <p className="text-slate-500 font-mono text-xs tracking-widest uppercase">
                  A/C: <span className="text-indigo-400 font-bold">{profileData?.accountNumber}</span>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95">
                  Update Info
                </button>
              ) : (
                <>
                  <button onClick={handleCancel} className="px-6 py-3 bg-slate-800 text-slate-400 rounded-2xl font-bold text-xs uppercase tracking-widest">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95">
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Registered Email</label>
              <div className="relative">
                <Envelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  disabled={!isEditing}
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-white/5 rounded-2xl text-white focus:border-indigo-500 outline-none transition disabled:opacity-40"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Phone Link</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  disabled={!isEditing}
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-white/5 rounded-2xl text-white focus:border-indigo-500 outline-none transition disabled:opacity-40"
                />
              </div>
            </div>

            {/* Address Field */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Physical Address</label>
              <div className="relative">
                <GeoAlt className="absolute left-4 top-4 text-slate-500" />
                <textarea
                  disabled={!isEditing}
                  rows="2"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-white/5 rounded-2xl text-white focus:border-indigo-500 outline-none transition resize-none disabled:opacity-40"
                />
              </div>
            </div>

            <div className="h-px bg-white/5 md:col-span-2 my-2"></div>

            {/* PAN (Read-Only) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">PAN Verification</label>
              <div className="px-4 py-4 bg-slate-950/30 border border-white/5 text-indigo-400 font-mono font-bold rounded-2xl tracking-widest">
                {profileData?.pan}
              </div>
            </div>

            {/* Security Status */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Encryption Status</label>
              <div className="px-4 py-4 text-emerald-500 font-black bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex items-center gap-2 text-xs uppercase tracking-widest">
                <ShieldLock size={14} /> Active SSL Protection
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}