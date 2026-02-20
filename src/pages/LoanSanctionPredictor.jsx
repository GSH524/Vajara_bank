import React, { useState, useEffect } from "react";

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

  const [errors, setErrors] = useState({});
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showVideo, setShowVideo] = useState(true);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkip(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    setShowVideo(false);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" && value !== "" ? parseFloat(value) : value
    }));
    // Clear field error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const rules = {
      Age: {
        required: true,
        min: 18,
        max: 100,
        message: "Age must be at least 18 and at most 100."
      },
      "Employment Type": { required: true, message: "Employment Type is required." },
      "Credit Score": {
        required: true,
        min: 300,
        max: 900,
        message: "Credit Score must be between 300 and 900."
      },
      Tenure: {
        required: true,
        min: 1,
        max: 30,
        message: "Tenure must be between 1 and 30 years."
      },
      "Years in Current City": {
        required: true,
        min: 0,
        max: 50,
        message: "Years in City must be between 0 and 50."
      },
      "Years in Current Job": {
        required: true,
        min: 0,
        max: 50,
        message: "Years in Job must be between 0 and 50."
      },
      "Insurance Premiums": {
        required: true,
        min: 0,
        max: 1000000,
        message: "Insurance Premiums must be between 0 and 1,000,000."
      },
      "Residential Status": { required: true, message: "Residential Status is required." },
      "Residence Type": { required: true, message: "Residence Type is required." },
      "Loan Type": { required: true, message: "Loan Type is required." },
      AnnualIncome: {
        required: true,
        min: 10000,
        max: 100000000,
        message: "Annual Income must be at least ₹10,000."
      },
      requested_amount: {
        required: true,
        min: 1000,
        max: 100000000,
        message: "Requested Amount must be at least ₹1,000."
      },
      years: {
        required: true,
        min: 1,
        max: 30,
        message: "Loan Tenure must be between 1 and 30 years."
      },
      annual_interest_rate: {
        required: true,
        min: 1,
        max: 30,
        message: "Interest Rate must be between 1% and 30%."
      }
    };

    for (const [key, rule] of Object.entries(rules)) {
      const val = formData[key];

      if (rule.required && (val === "" || val === null || val === undefined)) {
        newErrors[key] = `${key} is required.`;
        continue;
      }

      if (typeof val === "number") {
        if (rule.min !== undefined && val < rule.min) {
          newErrors[key] = rule.message;
        } else if (rule.max !== undefined && val > rule.max) {
          newErrors[key] = rule.message;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOffer(null);

    if (!validateForm()) {
      setLoading(false);
      setError(
        "Please fill all required fields correctly: " +
          Object.values(errors)
            .slice(0, 3)
            .join(", ") +
          (Object.values(errors).length > 3 ? "..." : "")
      );
      return;
    }

    const numericData = {};
    for (const [key, val] of Object.entries(formData)) {
      numericData[key] = val === "" ? 0 : val;
    }

    try {
      const response = await fetch("http://localhost:8000/api/predict-loan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(numericData)
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
            reason: `Requested amount exceeds eligibility. You requested ₹${requested_amount.toLocaleString(
              "en-IN"
            )} but are eligible only up to ₹${Math.round(
              eligible_amount
            ).toLocaleString("en-IN")}.`
          });
        } else {
          const P = requested_amount;
          const r = annual_interest_rate / 12 / 100;
          const n = years * 12;

          const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
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
            "Total Payment": Math.round(total_payment * 100) / 100,
            explanation: `You requested ₹${requested_amount.toLocaleString(
              "en-IN"
            )} and are eligible for up to ₹${Math.round(
              eligible_amount
            ).toLocaleString(
              "en-IN"
            )}. Your monthly EMI will be ₹${Math.round(emi * 100) / 100
              .toLocaleString("en-IN")}, payable over ${years} years at ${annual_interest_rate}% per annum.`
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
    <>
      {showVideo ? (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mb-4">
            AI-Powered Loan Sanction Engine Video
          </h1>
          <video controls className="w-full max-w-4xl h-auto">
            <source src="/LoanPredictionvedio.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {showSkip && (
            <button
              onClick={handleSkip}
              className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold text-lg shadow-lg"
            >
              Skip
            </button>
          )}
        </div>
      ) : (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Left Card: Loan Sanction Predictor */}
              <div className="bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-700">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-10 text-white text-center">
                  <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
                    AI-Powered Loan Sanction Engine
                  </h1>
                  <p className="text-blue-100 text-xs sm:text-sm mt-2 font-medium opacity-90">
                    Real‑Time AI Eligibility & EMI Calculation
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {/* Age */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">
                        Age
                      </label>
                      <input
                        type="number"
                        name="Age"
                        value={formData.Age}
                        onChange={handleChange}
                        placeholder="e.g. 45"
                        className={`bg-slate-700 border ${
                          errors.Age ? "border-red-500" : "border-slate-600"
                        } text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none`}
                      />
                      {errors.Age && (
                        <span className="text-xs text-red-400 mt-1">{errors.Age}</span>
                      )}
                    </div>

                    {/* Employment Type */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">
                        Employment Type
                      </label>
                      <select
                        name="Employment Type"
                        value={formData["Employment Type"]}
                        onChange={handleChange}
                        className={`bg-slate-700 border ${
                          errors["Employment Type"] ? "border-red-500" : "border-slate-600"
                        } text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="">Select</option>
                        <option value="Business">Business</option>
                        <option value="Salaried">Salaried</option>
                        <option value="Freelancer">Freelancer</option>
                        <option value="Self-Employed">Self-Employed</option>
                      </select>
                      {errors["Employment Type"] && (
                        <span className="text-xs text-red-400 mt-1">
                          {errors["Employment Type"]}
                        </span>
                      )}
                    </div>

                    {/* Credit Score */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">
                        Credit Score
                      </label>
                      <input
                        type="number"
                        name="Credit Score"
                        value={formData["Credit Score"]}
                        onChange={handleChange}
                        placeholder="e.g. 770"
                        className={`bg-slate-700 border ${
                          errors["Credit Score"] ? "border-red-500" : "border-slate-600"
                        } text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none`}
                      />
                      {errors["Credit Score"] && (
                        <span className="text-xs text-red-400 mt-1">
                          {errors["Credit Score"]}
                        </span>
                      )}
                    </div>

                    {/* Tenure Yrs */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">
                        Tenure (Yrs) – Relationship
                      </label>
                      <input
                        type="number"
                        name="Tenure"
                        value={formData.Tenure}
                        onChange={handleChange}
                        placeholder="e.g. 3"
                        className={`bg-slate-700 border ${
                          errors.Tenure ? "border-red-500" : "border-slate-600"
                        } text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none`}
                      />
                      {errors.Tenure && (
                        <span className="text-xs text-red-400 mt-1">{errors.Tenure}</span>
                      )}
                    </div>

                    {/* Years in City */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">
                        Years in City
                      </label>
                      <input
                        type="number"
                        name="Years in Current City"
                        value={formData["Years in Current City"]}
                        onChange={handleChange}
                        placeholder="e.g. 3"
                        className={`bg-slate-700 border ${
                          errors["Years in Current City"]
                            ? "border-red-500"
                            : "border-slate-600"
                        } text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none`}
                      />
                      {errors["Years in Current City"] && (
                        <span className="text-xs text-red-400 mt-1">
                          {errors["Years in Current City"]}
                        </span>
                      )}
                    </div>

                    {/* Years in Job */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">
                        Years in Job
                      </label>
                      <input
                        type="number"
                        name="Years in Current Job"
                        value={formData["Years in Current Job"]}
                        onChange={handleChange}
                        placeholder="e.g. 12"
                        className={`bg-slate-700 border ${
                          errors["Years in Current Job"]
                            ? "border-red-500"
                            : "border-slate-600"
                        } text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none`}
                      />
                      {errors["Years in Current Job"] && (
                        <span className="text-xs text-red-400 mt-1">
                          {errors["Years in Current Job"]}
                        </span>
                      )}
                    </div>

                    {/* Insurance Premiums */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">
                        Insurance Premiums (₹)
                      </label>
                      <input
                        type="number"
                        name="Insurance Premiums"
                        value={formData["Insurance Premiums"]}
                        onChange={handleChange}
                        placeholder="e.g. 4500"
                        className={`bg-slate-700 border ${
                          errors["Insurance Premiums"] ? "border-red-500" : "border-slate-600"
                        } text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none`}
                      />
                      {errors["Insurance Premiums"] && (
                        <span className="text-xs text-red-400 mt-1">
                          {errors["Insurance Premiums"]}
                        </span>
                      )}
                    </div>

                    {/* Residential Status */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">
                        Residential Status
                      </label>
                      <select
                        name="Residential Status"
                        value={formData["Residential Status"]}
                        onChange={handleChange}
                        className={`bg-slate-700 border ${
                          errors["Residential Status"] ? "border-red-500" : "border-slate-600"
                        } text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="">Select</option>
                        <option value="Owned">Owned</option>
                        <option value="Rented">Rented</option>
                        <option value="Company Provided">Company Provided</option>
                      </select>
                      {errors["Residential Status"] && (
                        <span className="text-xs text-red-400 mt-1">
                          {errors["Residential Status"]}
                        </span>
                      )}
                    </div>

                    {/* Residence Type */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">
                        Residence Type
                      </label>
                      <select
                        name="Residence Type"
                        value={formData["Residence Type"]}
                        onChange={handleChange}
                        className={`bg-slate-700 border ${
                          errors["Residence Type"] ? "border-red-500" : "border-slate-600"
                        } text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="">Select</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Independent House">Independent House</option>
                        <option value="Villa">Villa</option>
                      </select>
                      {errors["Residence Type"] && (
                        <span className="text-xs text-red-400 mt-1">
                          {errors["Residence Type"]}
                        </span>
                      )}
                    </div>

                    {/* Loan Type */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">
                        Loan Type
                      </label>
                      <select
                        name="Loan Type"
                        value={formData["Loan Type"]}
                        onChange={handleChange}
                        className={`bg-slate-700 border ${
                          errors["Loan Type"] ? "border-red-500" : "border-slate-600"
                        } text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="">Select</option>
                        <option value="Personal">Personal</option>
                        <option value="Auto">Auto</option>
                        <option value="Mortgage">Mortgage</option>
                        <option value="other">Other</option>
                      </select>
                      {errors["Loan Type"] && (
                        <span className="text-xs text-red-400 mt-1">{errors["Loan Type"]}</span>
                      )}
                    </div>

                    {/* Annual Income */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">
                        Annual Income (₹)
                      </label>
                      <input
                        type="number"
                        name="AnnualIncome"
                        value={formData.AnnualIncome}
                        onChange={handleChange}
                        placeholder="e.g. 300000"
                        className={`bg-slate-700 border ${
                          errors.AnnualIncome ? "border-red-500" : "border-slate-600"
                        } text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none`}
                      />
                      {errors.AnnualIncome && (
                        <span className="text-xs text-red-400 mt-1">
                          {errors.AnnualIncome}
                        </span>
                      )}
                    </div>

                    {/* Requested Amount */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">
                        Requested (₹)
                      </label>
                      <input
                        type="number"
                        name="requested_amount"
                        value={formData.requested_amount}
                        onChange={handleChange}
                        placeholder="e.g. 500000"
                        className={`bg-slate-700 border ${
                          errors.requested_amount ? "border-red-500" : "border-slate-600"
                        } text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none`}
                      />
                      {errors.requested_amount && (
                        <span className="text-xs text-red-400 mt-1">
                          {errors.requested_amount}
                        </span>
                      )}
                    </div>

                    {/* Loan Tenure */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">
                        Tenure (Years) – Loan
                      </label>
                      <input
                        type="number"
                        name="years"
                        value={formData.years}
                        onChange={handleChange}
                        placeholder="e.g. 5"
                        className={`bg-slate-700 border ${
                          errors.years ? "border-red-500" : "border-slate-600"
                        } text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none`}
                      />
                      {errors.years && (
                        <span className="text-xs text-red-400 mt-1">{errors.years}</span>
                      )}
                    </div>

                    {/* Interest Rate */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">
                        Interest Rate (%)
                      </label>
                      <input
                        type="number"
                        name="annual_interest_rate"
                        value={formData.annual_interest_rate}
                        onChange={handleChange}
                        placeholder="e.g. 11"
                        className={`bg-slate-700 border ${
                          errors.annual_interest_rate ? "border-red-500" : "border-slate-600"
                        } text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none`}
                      />
                      {errors.annual_interest_rate && (
                        <span className="text-xs text-red-400 mt-1">
                          {errors.annual_interest_rate}
                        </span>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-xs font-bold uppercase tracking-widest">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all transform active:scale-[0.98] disabled:opacity-50 mt-8 shadow-xl uppercase tracking-widest text-sm"
                  >
                    {loading ? "Calculating Offer..." : "Calculate Offer"}
                  </button>
                </form>

                {/* Enhanced Prediction Results Section */}
                {offer && (
                  <div
                    className={`m-6 sm:m-10 mt-0 p-1 rounded-3xl transition-all duration-500 ${
                      offer.status === "Eligible"
                        ? "bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30"
                        : "bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/30"
                    }`}
                  >
                    <div className="p-6 bg-slate-800/80 rounded-[calc(1.5rem-1px)]">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                            Application Status
                          </span>
                          <span
                            className={`text-2xl font-black uppercase ${
                              offer.status === "Eligible" ? "text-emerald-400" : "text-red-400"
                            }`}
                          >
                            {offer.status}
                          </span>
                        </div>
                        <div
                          className={`h-12 w-12 rounded-full flex items-center justify-center ${
                            offer.status === "Eligible"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {offer.status === "Eligible" ? (
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          )}
                        </div>
                      </div>

                      {offer.status === "Eligible" ? (
                        <>
                          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                            {offer.explanation}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-slate-700/50 border border-slate-600">
                              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                                Eligible Loan Amount
                              </p>
                              <p className="text-xl font-bold text-white">
                                ₹{offer.eligible_amount.toLocaleString("en-IN")}
                              </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-700/50 border border-slate-600">
                              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                                Monthly EMI
                              </p>
                              <p className="text-xl font-bold text-blue-400">
                                ₹{offer.EMI.toLocaleString("en-IN")}
                              </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-700/50 border border-slate-600">
                              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                                Total Interest
                              </p>
                              <p className="text-xl font-bold text-slate-200">
                                ₹{offer["Total Interest"].toLocaleString("en-IN")}
                              </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-700/50 border border-slate-600">
                              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                                Total Repayment
                              </p>
                              <p className="text-xl font-bold text-slate-200">
                                ₹{offer["Total Payment"].toLocaleString("en-IN")}
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="p-4 rounded-2xl bg-red-900/20 border border-red-500/20">
                          <p className="text-sm font-medium text-red-300">{offer.reason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Card: Video - smaller size */}
              <div className="bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-700 p-6 sm:p-10 flex flex-col min-h-[400px] sticky top-6">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 rounded-xl text-white text-center mb-6 w-full shadow-lg">
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                    Demo Showcase
                  </h2>
                  <p className="text-blue-100 text-xs sm:text-sm mt-1 font-medium opacity-90 tracking-wide">
                    Watch the AI Engine in action
                  </p>
                </div>

                <div className="flex-grow flex items-center justify-center w-full">
                  <div className="relative w-full max-w-sm aspect-video bg-black rounded-xl shadow-xl overflow-hidden border-2 border-slate-700">
                    <video
                      controls
                      className="w-full h-full object-cover"
                      style={{ maxHeight: "240px" }}
                    >
                      <source src="/LoanPredictionvedio.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                  <h4 className="text-blue-400 text-[10px] font-black uppercase mb-2 tracking-widest">
                    System Overview
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Our AI analyzes over 14 distinct parameters to calculate real‑time loan eligibility using trained neural network models.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoanSanctionPredictor;
