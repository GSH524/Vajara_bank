import { useState } from "react";
import emailjs from "@emailjs/browser";
import { 
  TelephoneFill, EnvelopeFill, GeoAltFill, ClockFill, 
  ChatDotsFill, BuildingFill, ArrowRight
} from "react-bootstrap-icons";
import { collection, addDoc } from "firebase/firestore";
import { userDB } from "../firebaseUser";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Send Email via EmailJS
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      // 2. Save to Firestore (feedbacks collection) for Admin Dashboard
      await addDoc(collection(userDB, "feedbacks"), {
        userId: 'public_guest',
        userName: form.name,
        userEmail: form.email,
        phone: form.phone,
        subject: `[Public Contact] ${form.subject}`,
        message: form.message,
        category: 'Public Contact',
        status: 'Pending',
        createdAt: new Date().toISOString()
      });

      // 3. Notify Admin
      await addDoc(collection(userDB, "notifications"), {
        role: "admin", 
        type: "NEW_CONTACT",
        title: "Public Contact Form",
        message: `${form.name} reached out regarding: ${form.subject}`,
        isRead: false,
        createdAt: new Date().toISOString()
      });

      alert("Message sent successfully!");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-300 font-sans">
      {/* HERO SECTION */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent -z-10" />
        
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-blue-400 uppercase bg-blue-500/10 border border-blue-500/20 rounded-full">
            Contact Support
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            We're Here to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Help You</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Have questions about our services? Need assistance with your account?
            Our dedicated team is available 24/7 to help you.
          </p>
        </div>
      </section>

      {/* INFO CARDS */}
      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <TelephoneFill />, title: "Phone Support", info: ["1800-VAJRA-BANK", "+91 22 4567 8900"] },
            { icon: <EnvelopeFill />, title: "Email Us", info: ["support@vajrabank.com", "corporate@vajrabank.com"] },
            { icon: <GeoAltFill />, title: "Head Office", info: ["KPHB colony, BKC", "Hyderabad, TS 500001"] },
            { icon: <ClockFill />, title: "Working Hours", info: ["Mon - Sat: 9AM - 6PM", "24/7 Phone Banking"] },
          ].map((card, i) => (
            <div key={i} className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-blue-500/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-4">{card.title}</h3>
              {card.info.map((line, j) => (
                <p key={j} className="text-slate-400 text-sm mb-1">{line}</p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* FORM + SUPPORT SECTION */}
      <section className="pb-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* FORM PANEL */}
          <div className="lg:col-span-2 p-8 md:p-12 rounded-[2.5rem] bg-slate-900 border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10" />
            
            <h2 className="text-3xl font-bold text-white mb-2">Send us a Message</h2>
            <p className="text-slate-400 mb-10">Fill out the form below and we'll get back to you within 24 hours.</p>

            <form onSubmit={sendMessage} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  name="name" type="text" placeholder="Full Name" required
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  value={form.name} onChange={handleChange}
                />
                <input
                  name="email" type="email" placeholder="Email Address" required
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  value={form.email} onChange={handleChange}
                />
                <input
                  name="phone" type="text" placeholder="Phone Number"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  value={form.phone} onChange={handleChange}
                />
                <select
                  name="subject" required
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                  value={form.subject} onChange={handleChange}
                >
                  <option value="" disabled>Select Subject</option>
                  <option>Account Issue</option>
                  <option>Loan Query</option>
                  <option>Card Support</option>
                  <option>General Support</option>
                </select>
              </div>

              <textarea
                name="message" rows="5" placeholder="How can we help you?" required
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                value={form.message} onChange={handleChange}
              />

              <button 
                type="submit" disabled={loading}
                className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 active:scale-[0.98]"
              >
                {loading ? "Sending..." : <>Send Message <ArrowRight /></>}
              </button>
            </form>
          </div>

          {/* QUICK SUPPORT PANEL */}
          <div className="space-y-6">
            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl group cursor-default">
              <TelephoneFill size={32} className="mb-6 opacity-80 group-hover:rotate-12 transition-transform" />
              <h3 className="text-xl font-bold mb-3">24/7 Phone Banking</h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">
                Get instant assistance for account queries, transactions, and blockages.
              </p>
              <div className="text-2xl font-black tracking-tighter">1800-VAJRA-BANK</div>
            </div>

            <div className="p-8 rounded-[2rem] bg-slate-900 border border-white/5 hover:border-emerald-500/30 transition-colors group">
              <ChatDotsFill size={32} className="mb-6 text-emerald-400" />
              <h3 className="text-xl font-bold text-white mb-3">Live Chat Support</h3>
              <p className="text-slate-400 text-sm mb-8">Chat with our support team in real time via WhatsApp.</p>
              <a href="https://wa.me/916300608164?text=Hi%20VajraBank%20Support,%20I%20need%20assistance" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:gap-4 transition-all">
                Start Chat <ArrowRight />
              </a>
            </div>

            <div className="p-8 rounded-[2rem] bg-slate-900 border border-white/5">
              <BuildingFill size={32} className="mb-6 text-slate-400" />
              <h3 className="text-xl font-bold text-white mb-2">Visit a Branch</h3>
              <p className="text-slate-400 text-sm">Find your nearest VajraBank branch or ATM location.</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}