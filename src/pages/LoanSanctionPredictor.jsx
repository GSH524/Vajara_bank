import React, { useState } from 'react';

const LoanSanctionPredictor = () => {
  const [formData, setFormData] = useState({
    Age: "",
    "Employment Type": "",
    "Credit Score": "",
    Tenure: "",
    "Years in Current City": "",
    "Years in Current Job": "",
    "Insurance Premiums": "",
    "Residential Status": "",
    "Residence Type": "",
    "Loan Type": "",
    AnnualIncome: "",
    requested_amount: "",
    years: "",
    annual_interest_rate: ""
  });

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // FIXED: Logic to handle both numbers and strings (dropdowns)
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" && value !== "" ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOffer(null);

    // Prepare data for API (converting empty strings to 0 for numeric safety)
    const numericData = {};
    for (const [key, val] of Object.entries(formData)) {
      numericData[key] = val === "" ? 0 : val;
    }

    try {
      const response = await fetch('http://localhost:8000/api/predict-loan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(numericData),
      });

      const data = await response.json();

      if (data.success) {
        const eligible_amount = data.predictedLoanAmount;
        const requested_amount = numericData.requested_amount;
        const years = numericData.years;
        const annual_interest_rate = numericData.annual_interest_rate;

        if (requested_amount > eligible_amount) {
          setOffer({
            status: "Rejected",
            eligible_amount: Math.round(eligible_amount),
            requested_amount,
            reason: "Requested amount exceeds eligibility"
          });
        } else {
          // EMI Calculation Logic
          const P = requested_amount;
          const r = annual_interest_rate / 12 / 100;
          const n = years * 12;

          const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
          const total_payment = emi * n;
          const total_interest = total_payment - P;

          setOffer({
            status: "Eligible",
            eligible_amount: Math.round(eligible_amount),
            requested_amount,
            tenure_years: years,
            interest_rate: annual_interest_rate,
            EMI: Math.round(emi * 100) / 100,
            "Total Interest": Math.round(total_interest * 100) / 100,
            "Total Payment": Math.round(total_payment * 100) / 100
          });
        }
      } else {
        setError(data.predictedLoanAmount || "Prediction failed.");
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
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-10 text-white text-center">
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
            Loan Sanction Engine
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-2 font-medium opacity-90">
            Real‑Time AI Eligibility & EMI Calculation
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            
            {/* Age */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Age</label>
              <input
                type="number"
                name="Age"
                value={formData.Age}
                onChange={handleChange}
                placeholder="e.g. 45"
                className="bg-slate-700 border border-slate-600 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Employment Type */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Employment Type</label>
              <select
                name="Employment Type"
                value={formData["Employment Type"]}
                onChange={handleChange}
                className="bg-slate-700 border border-slate-600 text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="Business">Business</option>
                <option value="Salaried">Salaried</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Self-Employed">Self-Employed</option>
              </select>
            </div>

            {/* Credit Score */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Credit Score</label>
              <input
                type="number"
                name="Credit Score"
                value={formData["Credit Score"]}
                onChange={handleChange}
                placeholder="e.g. 770"
                className="bg-slate-700 border border-slate-600 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Tenure (Relationship) */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Tenure (Yrs) – Relationship</label>
              <input
                type="number"
                name="Tenure"
                value={formData.Tenure}
                onChange={handleChange}
                placeholder="e.g. 3"
                className="bg-slate-700 border border-slate-600 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Years in City */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Years in City</label>
              <input
                type="number"
                name="Years in Current City"
                value={formData["Years in Current City"]}
                onChange={handleChange}
                placeholder="e.g. 3"
                className="bg-slate-700 border border-slate-600 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Years in Job */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Years in Job</label>
              <input
                type="number"
                name="Years in Current Job"
                value={formData["Years in Current Job"]}
                onChange={handleChange}
                placeholder="e.g. 12"
                className="bg-slate-700 border border-slate-600 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Insurance Premiums */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Insurance Premiums (₹)</label>
              <input
                type="number"
                name="Insurance Premiums"
                value={formData["Insurance Premiums"]}
                onChange={handleChange}
                placeholder="e.g. 4500"
                className="bg-slate-700 border border-slate-600 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Residential Status */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Residential Status</label>
              <select
                name="Residential Status"
                value={formData["Residential Status"]}
                onChange={handleChange}
                className="bg-slate-700 border border-slate-600 text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="Owned">Owned</option>
                <option value="Rented">Rented</option>
                <option value="Company Provided">Company Provided</option>
              </select>
            </div>

            {/* Residence Type */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Residence Type</label>
              <select
                name="Residence Type"
                value={formData["Residence Type"]}
                onChange={handleChange}
                className="bg-slate-700 border border-slate-600 text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="Apartment">Apartment</option>
                <option value="Independent House">Independent House</option>
                <option value="Villa">Villa</option>
              </select>
            </div>

            {/* Loan Type */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Loan Type</label>
              <select
                name="Loan Type"
                value={formData["Loan Type"]}
                onChange={handleChange}
                className="bg-slate-700 border border-slate-600 text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="Personal">Personal</option>
                <option value="Auto">Auto</option>
                <option value="Mortgage">Mortgage</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Annual Income */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Annual Income (₹)</label>
              <input
                type="number"
                name="AnnualIncome"
                value={formData.AnnualIncome}
                onChange={handleChange}
                placeholder="e.g. 300000"
                className="bg-slate-700 border border-slate-600 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Requested Amount */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Requested (₹)</label>
              <input
                type="number"
                name="requested_amount"
                value={formData.requested_amount}
                onChange={handleChange}
                placeholder="e.g. 500000"
                className="bg-slate-700 border border-slate-600 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Tenure (Loan) */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Tenure (Years) – Loan</label>
              <input
                type="number"
                name="years"
                value={formData.years}
                onChange={handleChange}
                placeholder="e.g. 5"
                className="bg-slate-700 border border-slate-600 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Interest Rate */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Interest Rate (%)</label>
              <input
                type="number"
                name="annual_interest_rate"
                value={formData.annual_interest_rate}
                onChange={handleChange}
                placeholder="e.g. 11"
                className="bg-slate-700 border border-slate-600 text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all transform active:scale-[0.98] disabled:opacity-50 mt-8 shadow-xl uppercase tracking-widest text-sm"
          >
            {loading ? "Calculating Offer..." : "Calculate Offer"}
          </button>
        </form>

        {/* Offer Results */}
        {offer && (
          <div className="m-6 sm:m-10 mt-0 p-8 rounded-3xl text-center border border-emerald-500/30 bg-emerald-500/10">
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${offer.status === 'Eligible' ? 'text-emerald-400' : 'text-red-400'}`}>
              {offer.status}
            </p>
            <div className="text-left text-xs text-slate-300 space-y-1">
              <div><strong>Eligible:</strong> ₹{offer.eligible_amount.toLocaleString("en-IN")}</div>
              {offer.status === "Eligible" && (
                <>
                  <div><strong>EMI:</strong> ₹{offer.EMI.toLocaleString("en-IN")}</div>
                  <div><strong>Total Interest:</strong> ₹{offer["Total Interest"].toLocaleString("en-IN")}</div>
                </>
              )}
              {offer.reason && <div className="text-red-400 mt-2">{offer.reason}</div>}
            </div>
          </div>
        )}

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