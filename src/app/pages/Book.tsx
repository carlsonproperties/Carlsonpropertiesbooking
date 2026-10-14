import React, { useState, useEffect } from "react";
import { BookingEngine } from "../components/BookingEngine";
import { Link, useNavigate } from "react-router";
import { ChevronLeft, Info, Shield, Star, MapPin, Menu } from "lucide-react";
import { motion } from "motion/react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { MobileMenu } from "../components/MobileMenu";
import { Footer } from "../components/Footer";
import { CarlsonLogo } from "../components/CarlsonLogo";
import { SEO } from "../components/SEO";
import { bookSchema } from "../lib/schemas";

export function Book() {
  const [property, setProperty] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Fetching property data...");
        const res = await fetch(`https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/properties`, {
          headers: { Authorization: `Bearer ${publicAnonKey.trim()}` }
        });
        
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const data = await res.json();
        if (data && data.length > 0) {
          setProperty(data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch property:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F1EA] selection:bg-[#203F3A] selection:text-white pb-20">
      <SEO
        title="Check Availability | One Eleven on the Mile"
        description="Check available dates and book One Eleven on the Mile directly: five bedrooms, four bathrooms, a heated pool, spa, sauna, gym and lake views in Taupō."
        keywords="book accommodation taupo, taupo booking direct, reserve taupo holiday home, book luxury taupo, taupo vacation rental booking, one eleven taupo booking, taupo holiday home rates, book lake view taupo, direct booking taupo, taupo accommodation booking, taupo rental reservation"
        url="/book"
        type="website"
        schemaData={bookSchema}
      />
      {/* Navigation */}
      <nav className="py-6 border-b border-slate-100 bg-white/80 backdrop-blur-xl sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-[#203F3A] transition-colors group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[11px] uppercase tracking-widest font-bold">Back to Home</span>
          </Link>
          
          <Link to="/">
            <CarlsonLogo dark={true} />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <a 
              href="https://g.page/r/CZuTLT-YqNStEAE/review" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Star size={14} className="text-[#203F3A] fill-[#203F3A]" />
              <span className="text-xs font-bold text-slate-700">5.0</span>
              <span className="text-slate-400 text-xs">on Google</span>
            </a>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-[#203F3A]" />
              <span className="text-xs font-bold">Secure Booking</span>
            </div>
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

      <main className="max-w-[1600px] mx-auto px-6 pt-12">
        <div className="mb-16">
          <div className="flex items-center gap-2 text-[#203F3A] mb-4">
            <MapPin size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Taupō, New Zealand</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-slate-900 leading-tight">Plan Your <br /><span className="italic text-[#203F3A]">Taupō Stay</span></h1>
          <p className="mt-5 max-w-xl text-base font-light leading-relaxed text-slate-500">
            Choose your dates below. The whole house is reserved exclusively for your group of up to ten guests.
          </p>
        </div>

        <BookingEngine pricePerNight={1275} />

        {/* Trust Factors */}
        <div className="mt-32 grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg text-[#203F3A]">
              <Shield size={24} />
            </div>
            <h4 className="text-lg font-serif text-slate-900">Book Direct</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Choose your dates and reserve securely through Carlson Properties, with no third-party hand-off.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg text-[#203F3A]">
              <CalendarIcon size={24} />
            </div>
            <h4 className="text-lg font-serif text-slate-900">Clear Cancellation Terms</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Review the cancellation terms before payment so you know exactly what applies to your booking.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg text-[#203F3A]">
              <Info size={24} />
            </div>
            <h4 className="text-lg font-serif text-slate-900">Local Host Support</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Matt and Ashleigh live nearby and are available if you need help during your stay.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function CalendarIcon({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
