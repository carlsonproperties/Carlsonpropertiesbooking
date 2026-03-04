import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { ChevronLeft, Menu, Instagram, Facebook, ShieldCheck, Mail, Phone, MapPin, Lock, Eye, Database, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { MobileMenu } from "../components/MobileMenu";
import { Footer } from "../components/Footer";
import { CarlsonLogo } from "../components/CarlsonLogo";
import { SEO } from "../components/SEO";
import { privacyBreadcrumbSchema } from "../lib/schemas";

export function PrivacyPolicy() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sections = [
    {
      title: "1. Introduction",
      icon: <ShieldCheck size={20} />,
      content: "Welcome to Carlson Properties. We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you book a stay at our property through our website."
    },
    {
      title: "2. Information We Collect",
      icon: <Database size={20} />,
      content: "When you book a stay through our website, we may collect the following types of information:\n\n• Personal Identification Information: This includes your name, email address, phone number, and any other information you provide during the booking process.\n• Payment Information: We collect payment details necessary to process your booking, such as credit card information. This information is processed securely and not stored on our servers.\n• Booking Details: Information related to your reservation, including check-in/check-out dates, number of guests, and special requests.\n• Communication Records: Any correspondence you have with us, including emails and phone calls."
    },
    {
      title: "3. How We Use Your Information",
      icon: <Eye size={20} />,
      content: "We use the information we collect to:\n\n• Process and confirm your booking.\n• Communicate with you regarding your reservation, including providing updates or responding to inquiries.\n• Improve our services and website.\n• Ensure the security of our website and prevent fraudulent activity.\n• Comply with legal obligations."
    },
    {
      title: "4. Sharing Your Information",
      icon: <Lock size={20} />,
      content: "We do not sell or rent your personal information to third parties. However, we may share your information in the following situations:\n\n• Service Providers: We may share information with third-party service providers who assist us in operating our website or processing payments. These providers are bound by confidentiality agreements and are not allowed to use your information for any other purpose.\n• Legal Requirements: We may disclose your information if required to do so by law, or in response to legal requests or processes."
    },
    {
      title: "5. Data Security",
      icon: <ShieldCheck size={20} />,
      content: "We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. Despite these efforts, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security."
    },
    {
      title: "6. Your Rights",
      icon: <ShieldCheck size={20} />,
      content: "You have the right to:\n\n• Access and correct your personal information.\n• Request the deletion of your personal information, subject to certain exceptions.\n• Opt-out of receiving marketing communications from us.\n\nTo exercise these rights, please contact us at admin@carlsonproperties.co.nz"
    },
    {
      title: "7. Cookies and Tracking Technologies",
      icon: <Database size={20} />,
      content: "We use cookies and other tracking technologies to enhance your experience on our website. Cookies are small data files stored on your device that help us remember your preferences and improve our services. You can manage your cookie preferences through your browser settings."
    },
    {
      title: "8. Changes to This Privacy Policy",
      icon: <FileText size={20} />,
      content: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically to stay informed about how we are protecting your information."
    }
  ];

  return (
    <div className="bg-[#fdfcf8] min-h-screen selection:bg-[#9DA07E] selection:text-white font-sans">
      <SEO 
        title="Privacy Policy"
        description="Privacy policy for Carlson Properties. Learn how we collect, use, and protect your personal information."
        url="/privacy"
        schemaData={privacyBreadcrumbSchema}
      />
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
        isScrolled ? "py-4 bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-100" : "py-8 bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
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
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="h-[1px] w-12 bg-[#9DA07E]" />
              <span className="text-[#9DA07E] text-[10px] font-black uppercase tracking-[0.6em]">Privacy & Security</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif text-slate-900 leading-[0.9] tracking-tighter mb-8">
              Privacy <span className="italic text-[#9DA07E]">Policy.</span>
            </h1>
            <p className="text-xl text-slate-500 font-light max-w-2xl leading-relaxed italic">
              "We are committed to protecting your privacy and ensuring your personal information is handled safely."
            </p>
            <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mt-10">Effective Date: 20.07/2024</p>
          </motion.div>

          <div className="space-y-16">
            {sections.map((section, index) => (
              <motion.section 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="flex items-start gap-8">
                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-2xl bg-[#9DA07E]/10 text-[#9DA07E] flex-shrink-0 group-hover:bg-[#9DA07E] group-hover:text-white transition-all duration-500">
                    {section.icon}
                  </div>
                  <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl font-serif text-slate-900 group-hover:text-[#9DA07E] transition-colors duration-500">
                      {section.title}
                    </h2>
                    <div className="text-slate-600 leading-relaxed space-y-4 whitespace-pre-wrap font-light">
                      {section.content}
                    </div>
                  </div>
                </div>
              </motion.section>
            ))}
          </div>

          <div className="mt-32 pt-20 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-[#9DA07E]">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Email Support</p>
                <a href="mailto:bookings@carlsonproperties.co.nz" className="text-sm font-bold text-slate-900 hover:text-[#9DA07E] transition-colors">bookings@carlsonproperties.co.nz</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-[#9DA07E]">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Direct Line</p>
                <a href="tel:0276977961" className="text-sm font-bold text-slate-900 hover:text-[#9DA07E] transition-colors">027 697 7961</a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
