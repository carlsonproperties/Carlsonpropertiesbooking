import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { ChevronLeft, Menu, Instagram, Facebook, FileText, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { MobileMenu } from "../components/MobileMenu";
import { Footer } from "../components/Footer";
import { CarlsonLogo } from "../components/CarlsonLogo";
import { SEO } from "../components/SEO";
import { termsBreadcrumbSchema } from "../lib/schemas";

export function Terms() {
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
      content: "Welcome to our direct booking website. By booking a stay at our property, you agree to comply with and be bound by the following terms and conditions. Please read these terms carefully before making a reservation."
    },
    {
      title: "2. Seasonal Pricing and Rate Variations",
      content: "The nightly rate for your stay may vary depending on the time of year, holidays, local events, and demand. Our base rate displayed on the homepage or any other marketing materials is a starting price and may not reflect the actual rate for your selected dates. Rates may increase during peak seasons, public holidays, or special events, and promotional discounts may apply during off-peak times.\n\nOnce you select your booking dates, the applicable nightly rate will be displayed and confirmed at the time of reservation. Please note that the rate quoted at the time of booking is final and will not be adjusted for changes in pricing that may occur after your reservation is confirmed."
    },
    {
      title: "3. Booking and Payment",
      content: "Reservation Confirmation: Your booking is confirmed once the full payment is received. This can be paid in full upon booking or 30 days prior to check-in.\n\nPayment Terms: To secure your dates, a deposit of 50% of the total amount is required upon reservation. The remaining balance must be paid in full 30 days prior to your check-in date. If the balance is not paid by this time, the reservation will be cancelled, and the deposit will be refunded.\n\nPayment Method: Bank Transfer\n\nAccount Name: CARLSON & CO LTD.\n\nAccount Number: 06-0429-0411603-00\n\nTaxes and Fees: All applicable taxes and fees are included in the booking price.\n\nInternational Payments: International bookings are to be made via Airbnb at; www.airbnb.com/h/carlsonandco"
    },
    {
      title: "4. Cancellation Policy",
      content: "Firm Cancellation Policy: Guests may cancel their reservation up to 30 days before the check-in date to receive a full refund.\n\nCancellation 30 Days Before Check-In: Full refund of the booking amount.\n\nCancellation Less Than 30 Days Before Check-In: No refund will be provided.\n\nEarly Departure: No refunds will be given for early departures or no-shows."
    },
    {
      title: "5. Check-In and Check-Out",
      content: "Check-In Time: 3:00 PM\n\nCheck-Out Time: 10:00 AM\n\nEarly Check-In / Late Check-Out: Not available."
    },
    {
      title: "6. House Rules",
      content: "No Smoking: Smoking is strictly prohibited inside the property.\n\nNo Pets: Pets are not allowed.\n\nOccupancy Limit: The maximum occupancy for the property is 10 guests.\n\nNoise Levels: Please respect our neighbours and keep noise to a minimum, especially during nighttime hours (10:00 PM - 8:00 AM).\n\nParties and Events: Parties and events are not allowed."
    },
    {
      title: "7. Damages and Security Deposit",
      content: "Security Deposit: A security deposit of $500 is required to confirm your reservation. This deposit will be refunded within three days following check-out, provided no damages are reported. Should you prefer not to pay the security deposit, please make your reservation through our Airbnb listing at www.airbnb.com/h/carlsonandco\n\nDamages: Guests are responsible for any damages or loss caused during their stay. The cost of repairs or replacements will be deducted from the security deposit. If the cost exceeds the deposit, the guest will be billed for the additional amount."
    },
    {
      title: "8. Responsibilities and Liability",
      content: "Guest Responsibilities: Guests must keep the property and all furnishings in good order and use appliances only for their intended purposes.\n\nLiability: We are not responsible for any accidents, injuries, or illnesses that occur while on the premises or its facilities. We are not responsible for the loss of personal belongings or valuables of the guest."
    },
    {
      title: "9. Cleaning and Maintenance",
      content: "Cleaning Fee: There is no separate cleaning fee, it is included in the total price.\n\nMaintenance: We strive to maintain the property in good working order. If any issues arise, please contact us immediately, and we will make every effort to resolve them as soon as possible."
    },
    {
      title: "10. Governing Law",
      content: "These terms and conditions are governed by and construed in accordance with the laws of New Zealand. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the Small Claims Tribunal."
    },
    {
      title: "11. Amendments",
      content: "We reserve the right to amend these terms and conditions at any time. Any amendments will be posted on our website and will take effect immediately."
    },
    {
      title: "12. Contact Information",
      content: "For any questions or concerns regarding your stay or these terms and conditions, please contact us at:\nEmail: bookings@carlsonproperties.co.nz\n\nPhone: 027 697 7961"
    }
  ];

  return (
    <div className="bg-[#fdfcf8] min-h-screen selection:bg-[#9DA07E] selection:text-white font-sans">
      <SEO 
        title="Terms & Conditions"
        description="Terms and conditions for booking One Eleven Taupo. Read our booking policies, cancellation terms, and house rules."
        url="/terms"
        schemaData={termsBreadcrumbSchema}
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
              <span className="text-[#9DA07E] text-[10px] font-black uppercase tracking-[0.6em]">Legal Information</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif text-slate-900 leading-[0.9] tracking-tighter mb-8 uppercase">
              Terms & <span className="italic text-[#9DA07E]">Conditions.</span>
            </h1>
            <p className="text-xl text-slate-500 font-light max-w-2xl leading-relaxed italic">
              "By proceeding with your booking, you acknowledge that you have read, understood, and agree to abide by these terms."
            </p>
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
                    <FileText size={20} />
                  </div>
                  <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl font-serif text-slate-900 group-hover:text-[#9DA07E] transition-colors duration-500 uppercase tracking-tight">
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

          <div className="mt-32 pt-20 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-[#9DA07E] shadow-sm">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Email Support</p>
                <a href="mailto:bookings@carlsonproperties.co.nz" className="text-sm font-bold text-slate-900 hover:text-[#9DA07E] transition-colors">bookings@carlsonproperties.co.nz</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-[#9DA07E] shadow-sm">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Direct Line</p>
                <a href="tel:0276977961" className="text-sm font-bold text-slate-900 hover:text-[#9DA07E] transition-colors">027 697 7961</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-[#9DA07E] shadow-sm">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Location</p>
                <p className="text-sm font-bold text-slate-900">Taupō, New Zealand</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
