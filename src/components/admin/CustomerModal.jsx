import React, { useState, useEffect, useMemo } from 'react';
import { 
    X, ShieldExclamation, Activity, Wallet2, 
    CreditCard, Snow, PersonBadge, GeoAlt, ClockHistory,
    CashStack, Award, ShieldCheck, House, Bank,
    PencilSquare, Check, XCircle
} from 'react-bootstrap-icons';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { userDB } from '../../firebaseUser';

export default function CustomerModal({ customer, onAction, onClose }) {
    const [firebaseData, setFirebaseData] = useState(null);
    const [riskData, setRiskData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [docRef, setDocRef] = useState(null);

    useEffect(() => {
        const fetchFullProfile = async () => {
            const targetId = customer?.["Customer ID"] || customer?.customerId;
            if (!targetId) return;

            setLoading(true);
            try {
                const [snap1, snap2] = await Promise.all([
                    getDocs(query(collection(userDB, 'users'), where("Customer ID", "==", targetId))),
                    getDocs(query(collection(userDB, 'users1'), where("Customer ID", "==", targetId)))
                ]);

                let foundData = null;
                let foundRef = null;

                if (!snap1.empty) {
                    foundData = snap1.docs[0].data();
                    foundRef = snap1.docs[0].ref;
                }
                else if (!snap2.empty) {
                    foundData = snap2.docs[0].data();
                    foundRef = snap2.docs[0].ref;
                }
                
                setFirebaseData(foundData || customer);
                setDocRef(foundRef);

                const riskRes = await fetch(`http://127.0.0.1:8000/api/predict-risk/${targetId}`);
                if (riskRes.ok) {
                    const rData = await riskRes.json();
                    setRiskData(rData);
                }
            } catch (err) {
                console.error("Data Sync Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFullProfile();
    }, [customer]);

    const toggleEdit = () => {
        if (!isEditing) setEditForm(firebaseData || customer);
        setIsEditing(!isEditing);
    };

    const handleFormChange = (primaryKey, secondaryKey, value) => {
        const targetKey = (editForm[primaryKey] !== undefined) ? primaryKey : (editForm[secondaryKey] !== undefined ? secondaryKey : primaryKey);
        setEditForm(prev => ({ ...prev, [targetKey]: value }));
    };

    const saveChanges = async () => {
        if (!docRef) {
            alert("Cannot update: Customer record is not fully synced.");
            return;
        }
        setLoading(true);
        try {
            const sanitizedData = {};
            Object.keys(editForm).forEach(key => {
                const safeKey = key.replace(/\//g, '_'); 
                sanitizedData[safeKey] = editForm[key];
            });

            await updateDoc(docRef, sanitizedData);
            setFirebaseData(editForm);
            setIsEditing(false);
        } catch (error) {
            console.error("Firebase Update Error:", error);
            alert(`Failed to save: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const c = useMemo(() => {
        const src = isEditing ? editForm : (firebaseData || customer);
        if (!src) return null;

        return {
            id: src["Customer ID"] || src.customerId || "N/A",
            firstName: src["First Name"] || src.firstName || "User",
            lastName: src["Last Name"] || src.lastName || "",
            email: src.Email || src.email || "N/A",
            phone: src["Contact Number"] || src.mobile || "N/A",
            age: src.Age || "—",
            gender: src.Gender || "—",
            address: src.Address || "N/A",
            pan: src.PAN_Card || "—",
            house: src.HouseOwnership || "—",
            nomineeName: src.nomineeName || "—",
            nomineeRelation: src.nomineeRelation || "—",
            status: src.status || src.ActiveStatus || "—",
            residentialStatus: src["Residential Status"] || "—",
            yearsInCity: src.Years_in_Current_City || "—",
            yearsInJob: src.Years_in_Current_Job || "—",
            acctOpenDate: src["Date Of Account Opening"] || "—",
            branchId: src["Branch ID"] || "—",
            txnAmount: Number(src["Transaction Amount"] || 0),
            txnType: src["Transaction Type"] || "—",
            balance: Number(src["Account Balance"] || 0),
            accType: src["Account Type"] || "Savings",
            accNumber: src.Account_Number || "N/A",
            income: Number(src.AnnualIncome || 0),
            cibil: Number(src.CIBIL_Score || 0),
            rewards: src["Rewards Points"] || 0,
            cardType: src["Card Type"] || "—",
            cardLimit: src["Credit Limit"] || 0,
            loanAmount: src["Loan Amount"] || 0,
            interest: src["Interest Rate"] || 0,
            lastTxnDate: src.Last_Transaction_Date || "—",
            paymentDue: src["Payment Due Date"] || "—",
            isFrozen: src.FreezeAccount === true || src.FreezeAccount_Flag === 1,
            profilePic: src.profilePic || "",
            idProof: src.idProofDoc || ""
        };
    }, [firebaseData, customer, isEditing, editForm]);

    if (!customer || !c) return null;

    if (loading) return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-indigo-400 font-mono text-xs uppercase tracking-[0.3em]">Syncing Parameters...</p>
            </div>
        </div>
    );

    const riskLevel = riskData?.riskLevel || "Low";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#0f1218] border border-white/10 w-full max-w-7xl max-h-[95vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col font-sans">
                
                {/* HEADER */}
                <div className="p-8 flex items-center justify-between border-b border-white/5 bg-white/5">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <img src={c.profilePic} alt="Profile" className="w-20 h-20 rounded-2xl object-cover border-2 border-white/10 shadow-xl" 
                                 onError={(e) => e.target.src = "https://via.placeholder.com/150"} />
                            <div className={`absolute -bottom-2 -right-2 p-2 rounded-lg ${c.isFrozen ? 'bg-blue-600' : 'bg-emerald-500'} text-white shadow-lg border-4 border-[#0f1218]`}>
                                {c.isFrozen ? <Snow size={18} /> : <Activity size={18} />}
                            </div>
                        </div>
                        <div>
                            {isEditing ? (
                                <div className="flex gap-2 mb-1">
                                    <input type="text" value={c.firstName} onChange={e => handleFormChange("First Name", "firstName", e.target.value)} className="bg-slate-900 border border-indigo-500/50 rounded p-1 text-2xl font-black text-white w-32 focus:outline-none" />
                                    <input type="text" value={c.lastName} onChange={e => handleFormChange("Last Name", "lastName", e.target.value)} className="bg-slate-900 border border-indigo-500/50 rounded p-1 text-2xl font-black text-indigo-500 w-32 focus:outline-none" />
                                </div>
                            ) : (
                                <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">{c.firstName} <span className="text-indigo-500">{c.lastName}</span></h2>
                            )}
                            <div className="flex gap-4 mt-1">
                                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">A/C: {c.accNumber}</span>
                                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">ID: {c.id}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {isEditing ? (
                            <>
                                <button onClick={saveChanges} className="p-2 px-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white text-xs font-bold transition-all shadow-lg flex items-center gap-2">
                                    <Check size={16} /> Save
                                </button>
                                <button onClick={toggleEdit} className="p-2 px-4 bg-rose-600/20 hover:bg-rose-600 rounded-xl text-rose-500 hover:text-white border border-rose-500/20 text-xs font-bold transition-all flex items-center gap-2">
                                    <XCircle size={16} /> Cancel
                                </button>
                            </>
                        ) : (
                            <button onClick={toggleEdit} className="p-2 px-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white text-xs font-bold transition-all shadow-lg flex items-center gap-2">
                                <PencilSquare size={16} /> Edit Profile
                            </button>
                        )}
                        <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full text-slate-500 transition-all active:scale-90"><X size={32} /></button>
                    </div>
                </div>

                {/* BODY */}
                <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                    {/* UPDATED KPI SECTION: Total Products replaced with Credit Limit */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                        <StatBox label="Ledger Balance" value={`₹${c.balance.toLocaleString()}`} color="text-emerald-400" icon={<Wallet2/>}/>
                        <StatBox label="Neural Risk" value={riskLevel} color={riskLevel === 'High' ? 'text-rose-500' : 'text-indigo-400'} icon={<ShieldExclamation/>}/>
                        <StatBox label="CIBIL Score" value={Math.round(c.cibil)} color="text-amber-400" icon={<Activity/>}/>
                        <StatBox label="Credit Limit" value={`₹${c.cardLimit.toLocaleString()}`} color="text-purple-400" icon={<CreditCard/>}/>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* IDENTITY */}
                        <div className="space-y-8">
                            <Section title="Identity Parameters" icon={<PersonBadge/>}>
                                <InfoRow label="Email Access" value={c.email} isEditing={isEditing} onChange={(v) => handleFormChange("Email", "email", v)} />
                                <InfoRow label="Secure Line" value={c.phone} isEditing={isEditing} onChange={(v) => handleFormChange("Contact Number", "mobile", v)} />
                                <InfoRow label="Gender / Age" value={`${c.gender} / ${c.age} Yrs`} /> 
                                <InfoRow label="PAN Ref" value={c.pan} isEditing={isEditing} onChange={(v) => handleFormChange("PAN_Card", "pan", v)} />
                                <InfoRow label="Res. Status" value={c.residentialStatus} isEditing={isEditing} onChange={(v) => handleFormChange("Residential Status", "residentialStatus", v)} />
                                <InfoRow label="Nominee Name" value={c.nomineeName} isEditing={isEditing} onChange={(v) => handleFormChange("nomineeName", "nomineeName", v)} />
                                <InfoRow label="Nominee Rel." value={c.nomineeRelation} isEditing={isEditing} onChange={(v) => handleFormChange("nomineeRelation", "nomineeRelation", v)} />
                            </Section>
                        </div>

                        {/* FINANCIALS */}
                        <div className="space-y-8">
                            <Section title="Financial Ledger" icon={<CashStack/>}>
                                <InfoRow label="Status" value={c.status.toUpperCase()} isEditing={isEditing} onChange={(v) => handleFormChange("status", "ActiveStatus", v)} />
                                <InfoRow label="Annual Income" value={`₹${c.income.toLocaleString()}`} rawValue={c.income} isEditing={isEditing} onChange={(v) => handleFormChange("AnnualIncome", "AnnualIncome", Number(v))} />
                                <InfoRow label="Account Type" value={c.accType} isEditing={isEditing} onChange={(v) => handleFormChange("Account Type", "accType", v)} />
                            </Section>
                        </div>

                        {/* CARD / DOCS */}
                        <div className="space-y-6">
                            <Section title="Card Intelligence" icon={<CreditCard/>}>
                                <InfoRow label="Network" value={c.cardType} isEditing={isEditing} onChange={(v) => handleFormChange("Card Type", "cardType", v)} />
                                <InfoRow label="Spending Power" value={`₹${c.cardLimit.toLocaleString()}`} />
                            </Section>
                            
                            <div>
                                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2 mb-4">Verification Document</h4>
                                <div className="bg-slate-950 border border-white/10 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center min-h-[200px]">
                                    {c.idProof ? (
                                        <img src={c.idProof} alt="ID Proof" className="w-full h-auto opacity-80" />
                                    ) : (
                                        <span className="text-slate-700 font-bold uppercase tracking-widest text-xs">Imaging Offline</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helpers
function StatBox({ label, value, color, icon }) {
    return (
        <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] shadow-xl">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">{icon} {label}</p>
            <p className={`text-2xl font-black italic tracking-tighter ${color}`}>{value}</p>
        </div>
    );
}

function Section({ title, icon, children }) {
    return (
        <section>
            <h4 className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-4 ml-2">{icon} {title}</h4>
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-2 shadow-inner">{children}</div>
        </section>
    );
}

function InfoRow({ label, value, isDanger, isEditing, onChange, rawValue }) {
    return (
        <div className="flex justify-between items-center p-3.5 rounded-xl hover:bg-white/5 transition-colors group">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-400 transition-colors">{label}</span>
            {isEditing && onChange ? (
                <input 
                    type="text"
                    value={rawValue !== undefined ? rawValue : (value !== "—" && value !== "N/A" ? value : "")}
                    onChange={(e) => onChange(e.target.value)}
                    className="bg-[#0f1218] border border-indigo-500/50 text-[11px] font-black font-mono tracking-tight text-slate-200 px-2 py-1 rounded w-1/2 text-right focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
            ) : (
                <span className={`text-[11px] font-black font-mono tracking-tight ${isDanger ? 'text-rose-500' : 'text-slate-200'}`}>{value || '—'}</span>
            )}
        </div>
    );
}