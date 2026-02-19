import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { userAuth, userDB } from '../firebaseUser';

export default function SignUp() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    
    const [profileImgBase64, setProfileImgBase64] = useState(null);
    const [idProofBase64, setIdProofBase64] = useState(null);

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', dob: '', gender: '', mobile: '', email: '',
        occupation: '', annualIncome: '', address: '', city: '', state: '', 
        pincode: '', idProofType: '', idProofNumber: '', accountType: 'Savings', 
        initialDeposit: '', nomineeName: '', nomineeRelation: '',
        password: '', confirmPassword: ''
    });

    const calculateAge = (dob) => {
        const birthday = new Date(dob);
        return Math.abs(new Date(Date.now() - birthday.getTime()).getUTCFullYear() - 1970);
    };

    const generateBankingDetails = (data) => {
        const custId = `CUST-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const today = new Date().toLocaleDateString();
        
        return {
            // Unified keys for UI Lists & Analytics
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email.toLowerCase(),
            customerId: custId,
            accountType: data.accountType,
            balance: Number(data.initialDeposit),
            gender: data.gender,
            activeStatus: "Active",

            // Legacy keys for Banking Logic & Historical Reports
            "Customer ID": custId,
            "First Name": data.firstName,
            "Last Name": data.lastName,
            "Email": data.email.toLowerCase(),
            "Gender": data.gender,
            "Account Type": data.accountType,
            "Account Balance": Number(data.initialDeposit),
            "Account Balance After Transaction": Number(data.initialDeposit),
            "ActiveStatus": "Active",
            "Age": calculateAge(data.dob),
            "AnnualIncome": Number(data.annualIncome),
            "CIBIL_Score": 650 + Math.floor(Math.random() * 150),
            "FreezeAccount": false,
            "Anomaly_Flag": 0,
            "Loan Status": "None",
            "Transaction Type": "Deposit",
            "Transaction Amount": Number(data.initialDeposit),
            "Mode_of_Payment": "Digital",
            "Transaction_Reason": "Initial Deposit"
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(userAuth, formData.email, formData.password);
            const bankingDetails = generateBankingDetails(formData);

            const userProfile = { 
                ...bankingDetails,
                uid: userCredential.user.uid,
                status: "pending", 
                createdAt: serverTimestamp() 
            };

            await setDoc(doc(userDB, 'users', userCredential.user.uid), userProfile);

            await addDoc(collection(userDB, 'notifications'), {
                type: 'new_user', 
                message: `New KYC: ${userProfile.email}`,
                userId: userCredential.user.uid, 
                read: false, 
                createdAt: serverTimestamp()
            });

            alert('Registration successful! Awaiting admin approval.');
            navigate('/login');
        } catch (error) {
            setErrors({ general: error.message });
            setSubmitting(false);
        }
    };

    // UI Classes
    const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm";
    const labelClass = "block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider";
    const errorClass = "text-[10px] text-red-500 mt-1 block font-medium";

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans text-white">
            {/* Same JSX structure as provided by you */}
            <div className="max-w-2xl w-full bg-slate-900 rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden">
                <div className="p-8 md:p-12">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black text-white mb-2">Create Your Account</h1>
                        <p className="text-slate-400">Join VajraBank for secure and smart banking</p>
                    </div>

                    {/* Stepper UI */}
                    <div className="relative flex justify-between mb-12 max-w-sm mx-auto">
                        <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-800 z-0" />
                        {[1, 2, 3].map(step => (
                            <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                                    step <= currentStep ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'
                                }`}>
                                    {step}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${
                                    step <= currentStep ? 'text-indigo-400' : 'text-slate-600'
                                }`}>
                                    {step === 1 ? 'Personal' : step === 2 ? 'Identity' : 'Account'}
                                </span>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={currentStep === 3 ? handleSubmit : (e) => e.preventDefault()}>
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="flex flex-col items-center mb-4">
                                    <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden relative">
                                        {previews.profile ? <img src={previews.profile} className="w-full h-full object-cover" alt="Profile" /> : <span className="text-slate-500 text-[10px] text-center font-bold">Upload Photo</span>}
                                        <input type="file" name="profileImg" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                    </div>
                                    {errors.profileImg && <span className={errorClass}>{errors.profileImg}</span>}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label className={labelClass}>First Name *</label><input name="firstName" value={formData.firstName} onChange={handleChange} className={inputClass} placeholder="John" />{errors.firstName && <span className={errorClass}>{errors.firstName}</span>}</div>
                                    <div><label className={labelClass}>Last Name *</label><input name="lastName" value={formData.lastName} onChange={handleChange} className={inputClass} placeholder="Doe" />{errors.lastName && <span className={errorClass}>{errors.lastName}</span>}</div>
                                    <div><label className={labelClass}>Date of Birth *</label><input type="date" name="dob" value={formData.dob} onChange={handleChange} className={inputClass} />{errors.dob && <span className={errorClass}>{errors.dob}</span>}</div>
                                    <div><label className={labelClass}>Gender *</label>
                                        <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div><label className={labelClass}>Occupation *</label>
                                        <select name="occupation" value={formData.occupation} onChange={handleChange} className={inputClass}>
                                            <option value="">Select</option>
                                            <option value="Salaried">Salaried</option>
                                            <option value="Self-Employed">Self-Employed</option>
                                            <option value="Student">Student</option>
                                        </select>
                                    </div>
                                    <div><label className={labelClass}>Annual Income *</label><input type="number" name="annualIncome" value={formData.annualIncome} onChange={handleChange} className={inputClass} placeholder="₹" /></div>
                                    <div><label className={labelClass}>Mobile *</label><input name="mobile" value={formData.mobile} onChange={handleChange} className={inputClass} maxLength={10} /></div>
                                    <div><label className={labelClass}>Email *</label><input name="email" value={formData.email} onChange={handleChange} className={inputClass} /></div>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2"><label className={labelClass}>Residential Address *</label><input name="address" value={formData.address} onChange={handleChange} className={inputClass} /></div>
                                <div><label className={labelClass}>City *</label><input name="city" value={formData.city} onChange={handleChange} className={inputClass} /></div>
                                <div><label className={labelClass}>State *</label><input name="state" value={formData.state} onChange={handleChange} className={inputClass} /></div>
                                <div><label className={labelClass}>Pincode *</label><input name="pincode" value={formData.pincode} onChange={handleChange} className={inputClass} maxLength={6} /></div>
                                <div><label className={labelClass}>ID Proof Type *</label>
                                    <select name="idProofType" value={formData.idProofType} onChange={handleChange} className={inputClass}>
                                        <option value="">Select ID</option>
                                        <option value="Aadhaar">Aadhaar</option>
                                        <option value="PAN">PAN Card</option>
                                    </select>
                                </div>
                                <div><label className={labelClass}>ID Number *</label><input name="idProofNumber" value={formData.idProofNumber} onChange={handleChange} className={inputClass} /></div>
                                <div className="md:col-span-2">
                                    <input type="file" name="idProofFile" onChange={handleFileChange} className="text-sm text-slate-400 file:bg-indigo-600 file:text-white file:rounded-full file:border-0 file:px-4 file:py-1 cursor-pointer" accept=".pdf,.jpg,.jpeg,.png" />
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label className={labelClass}>Account Type</label>
                                    <select name="accountType" value={formData.accountType} onChange={handleChange} className={inputClass}>
                                        <option value="Savings">Savings</option>
                                        <option value="Current">Current</option>
                                    </select>
                                </div>
                                <div><label className={labelClass}>Initial Deposit (₹) *</label><input type="number" name="initialDeposit" value={formData.initialDeposit} onChange={handleChange} className={inputClass} /></div>
                                
                                <div className="md:col-span-2 p-5 bg-slate-800/50 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest">Nominee Details</div>
                                    <div><label className={labelClass}>Nominee Name *</label><input name="nomineeName" value={formData.nomineeName} onChange={handleChange} className={inputClass} /></div>
                                    <div><label className={labelClass}>Relationship *</label><input name="nomineeRelation" value={formData.nomineeRelation} onChange={handleChange} className={inputClass} /></div>
                                </div>

                                <div><label className={labelClass}>Create Password *</label><input type="password" name="password" value={formData.password} onChange={handleChange} className={inputClass} /></div>
                                <div><label className={labelClass}>Confirm Password *</label><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={inputClass} /></div>
                            </div>
                        )}

                        <div className="mt-10 flex gap-4">
                            {currentStep > 1 && (
                                <button type="button" onClick={() => setCurrentStep(prev => prev - 1)} className="flex-1 px-6 py-3 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-colors">Previous</button>
                            )}
                            <button 
                                type={currentStep === 3 ? "submit" : "button"} 
                                onClick={currentStep < 3 ? handleNext : undefined} 
                                disabled={submitting}
                                className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 px-6 rounded-xl shadow-lg transition-all disabled:opacity-50 uppercase tracking-widest text-sm"
                            >
                                {currentStep < 3 ? 'Next Step' : submitting ? 'KYC In Progress...' : 'Submit KYC'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}