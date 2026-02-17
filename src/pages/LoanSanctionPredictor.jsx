import React, { useState } from 'react';

const LoanSanctionPredictor = () => {
  const [formData, setFormData] = useState({
    Age: 35,
    AnnualIncome: 720000,
    EmploymentType: 'Salaried',
    EmploymentExperience_Years: 8,
    HouseOwnership: 'Owned',
    CIBIL_Score: 745,
    ExistingLoansCount: 1,
    DebtToIncomeRatio: 0.32,
    LoanAmountRequested: 500000,
    CollateralValue: 800000,
    LatePaymentsCount: 1
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' || type === 'range' ? parseFloat(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch('http://localhost:8000/api/predict-loan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setPrediction(data.predicted_amount);
      } else {
        setError(data.error || "Prediction failed.");
      }
    } catch (err) {
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-700">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-10 text-white text-center">
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">Loan Sanction Engine</h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-2 font-medium opacity-90">Advanced AI Eligibility & Sanction Analysis</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-10">
          {/* Responsive Grid: 1 col on mobile, 3 cols on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            
            {/* Row 1 */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Employment Type</label>
              <select name="EmploymentType" value={formData.EmploymentType} onChange={handleChange} className="bg-slate-700 border border-slate-600 text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                <option value="Salaried">Salaried</option>
                <option value="Government">Government</option>
                <option value="Self-Employed">Self-Employed</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">House Ownership</label>
              <select name="HouseOwnership" value={formData.HouseOwnership} onChange={handleChange} className="bg-slate-700 border border-slate-600 text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                <option value="Owned">Owned</option>
                <option value="Rented">Rented</option>
                <option value="Mortgage">Mortgage</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">CIBIL Score</label>
              <input type="number" name="CIBIL_Score" value={formData.CIBIL_Score} onChange={handleChange} className="bg-slate-700 border border-slate-600 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            {/* Row 2 */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Annual Income (₹)</label>
              <input type="number" name="AnnualIncome" value={formData.AnnualIncome} onChange={handleChange} className="bg-slate-700 border border-slate-600 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Exp (Years)</label>
              <input type="number" name="EmploymentExperience_Years" value={formData.EmploymentExperience_Years} onChange={handleChange} className="bg-slate-700 border border-slate-600 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Existing Loans</label>
              <input type="number" name="ExistingLoansCount" value={formData.ExistingLoansCount} onChange={handleChange} className="bg-slate-700 border border-slate-600 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            {/* Row 3 */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Requested (₹)</label>
              <input type="number" name="LoanAmountRequested" value={formData.LoanAmountRequested} onChange={handleChange} className="bg-slate-700 border border-slate-600 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Collateral (₹)</label>
              <input type="number" name="CollateralValue" value={formData.CollateralValue} onChange={handleChange} className="bg-slate-700 border border-slate-600 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Late Payments</label>
              <input type="number" name="LatePaymentsCount" value={formData.LatePaymentsCount} onChange={handleChange} className="bg-slate-700 border border-slate-600 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            {/* Slider - Full width on all screens */}
            <div className="sm:col-span-2 lg:col-span-3 bg-slate-900/50 p-5 rounded-2xl border border-slate-700 flex flex-col mt-2">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold text-blue-400 uppercase tracking-widest">Debt To Income Ratio</label>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-black shadow-lg">{formData.DebtToIncomeRatio.toFixed(2)}</span>
              </div>
              <input type="range" name="DebtToIncomeRatio" min="0" max="1" step="0.01" value={formData.DebtToIncomeRatio} onChange={handleChange} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all transform active:scale-[0.98] disabled:opacity-50 mt-8 shadow-xl shadow-blue-900/20 uppercase tracking-widest text-sm"
          >
            {loading ? "Analyzing Financial Profile..." : "Calculate Eligibility"}
          </button>
        </form>

        {/* Prediction Results */}
        {prediction !== null && (
          <div className="m-6 sm:m-10 mt-0 p-8 rounded-3xl text-center border border-emerald-500/30 bg-emerald-500/10 animate-in fade-in zoom-in duration-500">
            <p className="text-emerald-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-2">Sanction Approved</p>
            <h2 className="text-3xl sm:text-5xl font-black text-white">₹{prediction.toLocaleString('en-IN')}</h2>
          </div>
        )}

        {/* Error Handling */}
        {error && (
          <div className="m-6 sm:m-10 mt-0 p-4 rounded-2xl bg-red-500/10 border border-red-500/50 text-red-400 text-center text-xs font-bold">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanSanctionPredictor;