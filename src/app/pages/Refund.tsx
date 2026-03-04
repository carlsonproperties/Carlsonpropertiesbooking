import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { ChevronLeft, Menu, Instagram, Facebook, RefreshCcw, Mail, Phone, MapPin, Calendar, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { MobileMenu } from "../components/MobileMenu";
import { Footer } from "../components/Footer";
import { CarlsonLogo } from "../components/CarlsonLogo";
import { SEO } from "../components/SEO";
import { refundBreadcrumbSchema } from "../lib/schemas";

export function RefundPolicy() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sections = [
    {
      title: "Cancellation 30 Days or More Before Check-In",
      icon: <Calendar size={20} />,
      highlight: "Full Refund",
      content: "If you cancel your booking at least 30 days before the check-in date, you will receive a full refund of the booking amount. We believe in providing flexibility for early cancellations to give you peace of mind when planning your stay."
    },
    {
      title: "Cancellation Less Than 30 Days Before Check-In",
      icon: <AlertCircle size={20} />,
      highlight: "No Refund",
      content: "If you cancel less than 30 days before your check-in date, no refund will be provided. Due to the exclusive nature of our property, late cancellations make it difficult for us to rebook the dates."
    },
    {
      title: "Early Departure or No-Show",
      icon: <RefreshCcw size={20} />,
      highlight: "No Refund",
      content: "No refunds will be given for early departures or no-shows. Once your stay has commenced, the full booking period is reserved exclusively for you."
    }
  ];

  return (
    <div className="bg-[#fdfcf8] min-h-screen selection:bg-[#9DA07E] selection:text-white font-sans">
      <SEO 
        title="Refund Policy"
        description="Refund and cancellation policy for One Eleven Taupo bookings. Understand our 30-day cancellation terms."
        url="/refund"
        schemaData={refundBreadcrumbSchema}
      />
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
        isScrolled ? "py-4 bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-100" : "py-8 bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-left">
          <Link to="/" className="hover:scale-105 transition-transform duration-500">
            <CarlsonLogo dark={true} />
          </Link>
          
          <div className="hidden md:flex items-center gap-10">
            <Link to="/about" className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 hover:text-[#9DA07E] transition-all">Property</Link>
            <Link to="/meet-hosts" className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 hover:text-[#9DA07E] transition-all">Meet Hosts</Link>
            <Link to="/guest-info" className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 hover:text-[#9DA07E] transition-all">Guest Info</Link>
            <Link 
              to="/book" 
              className="bg-slate-900 text-white px-10 py-4 rounded-full text-[10px] uppercase tracking-[0.3em] font-black hover:bg-[#9DA07E] hover:shadow-xl hover:shadow-[#9DA07E]/20 transition-all"
            >
              Book Now
            </Link>
          </div>

          <button 
            onClick={() => setIsMenuOpen(true)}
            className={`md:hidden p-2 rounded-full text-slate-900 hover:bg-slate-100 transition-colors`}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main className="pt-48 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="h-[1px] w-12 bg-[#9DA07E]" />
              <span className="text-[#9DA07E] text-[10px] font-black uppercase tracking-[0.6em]">Flexibility & Peace of Mind</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif text-slate-900 leading-[0.9] tracking-tighter mb-8 uppercase">
              Refund <span className="italic text-[#9DA07E]">Policy.</span>
            </h1>
            <p className="text-xl text-slate-500 font-light max-w-2xl leading-relaxed italic">
              "At One Eleven | On the Mile, we understand that plans can change. Please review our cancellation policy below to understand your options."
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {sections.map((section, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-10 rounded-[40px] border border-slate-100 flex flex-col justify-between group transition-all duration-700 hover:shadow-2xl hover:shadow-[#9DA07E]/5 ${index === 0 ? "md:col-span-2 bg-white" : "bg-white"}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-[#9DA07E]/10 text-[#9DA07E] flex items-center justify-center group-hover:bg-[#9DA07E] group-hover:text-white transition-all duration-500">
                      {section.icon}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full ${section.highlight === "Full Refund" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                      {section.highlight}
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif text-slate-900 mb-6 leading-tight uppercase tracking-tight">{section.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-light">{section.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-[#9DA07E]/5 p-12 rounded-[40px] border border-[#9DA07E]/10"
          >
            <h4 className="text-xl font-serif text-slate-900 mb-4 uppercase">Questions regarding your booking?</h4>
            <p className="text-slate-600 font-light leading-relaxed mb-8">
              If you have any questions or concerns regarding our cancellation policy, please don't hesitate to reach out. We're here to help ensure a smooth and enjoyable experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-8">
              <a href="mailto:bookings@carlsonproperties.co.nz" className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#9DA07E] group-hover:bg-[#9DA07E] group-hover:text-white transition-all shadow-sm">
                  <Mail size={18} />
                </div>
                <span className="text-sm font-bold text-slate-900">bookings@carlsonproperties.co.nz</span>
              </a>
              <a href="tel:0276977961" className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#9DA07E] group-hover:bg-[#9DA07E] group-hover:text-white transition-all shadow-sm">
                  <Phone size={18} />
                </div>
                <span className="text-sm font-bold text-slate-900">027 697 7961</span>
              </a>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
