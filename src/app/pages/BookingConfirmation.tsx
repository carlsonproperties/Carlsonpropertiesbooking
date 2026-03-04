import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { CheckCircle, Calendar, ArrowRight, Home, Share2, Download, Loader2, Info } from "lucide-react";
import { motion } from "framer-motion";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { SEO } from "../components/SEO";
import { trackBookingConversion } from "../lib/analytics";
import { bookingConfirmationBreadcrumbSchema } from "../lib/schemas";

export function BookingConfirmation() {
  const sessionId = new URLSearchParams(window.location.search).get('session_id');
  const location = useLocation();
  const [loading, setLoading] = useState(sessionId ? true : false);
  const [error, setError] = useState(false);
  const [booking, setBooking] = useState<any>(location.state?.booking || null);
  const isManual = location.state?.manual || false;

  useEffect(() => {
    if (!sessionId || booking) return;

    async function verifyBooking() {
      try {
        const res = await fetch(`https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/verify-checkout?session_id=${sessionId}`, {
          headers: { Authorization: `Bearer ${publicAnonKey.trim()}` }
        });
        const data = await res.json();
        if (data.success) {
          setBooking(data.booking);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    verifyBooking();
  }, [sessionId]);

  // Track conversion when booking is confirmed
  useEffect(() => {
    if (booking && booking.id) {
      const checkInDate = new Date(booking.check_in);
      const checkOutDate = new Date(booking.check_out);
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

      trackBookingConversion({
        bookingId: booking.id,
        checkIn: booking.check_in,
        checkOut: booking.check_out,
        nights,
        totalAmount: parseFloat(booking.amount || 0),
        guests: parseInt(booking.guests || 1)
      });
    }
  }, [booking]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfcf8] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#9DA07E] animate-spin mb-4" />
        <p className="text-slate-500 font-serif text-xl">Confirming your stay...</p>
      </div>
    );
  }

  if (error || (!sessionId && !booking)) {
    return (
      <div className="min-h-screen bg-[#fdfcf8] flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-serif text-slate-900 mb-4 uppercase">Verification Error</h1>
        <p className="text-slate-500 mb-8 max-w-md font-light leading-relaxed">We couldn't verify your booking automatically. If you've completed payment, don't worry—your confirmation email is on its way.</p>
        <Link to="/book" className="bg-[#9DA07E] text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-900 transition-all">
          Return to Booking
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcf8] flex items-center justify-center px-6 py-20">
      <SEO 
        title="Booking Confirmed - Thank You!"
        description="Your booking at One Eleven Taupo has been confirmed. Check your email for booking details and check-in information."
        url="/booking-success"
        schemaData={bookingConfirmationBreadcrumbSchema}
      />
      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white p-12 md:p-20 rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-slate-100 text-center relative overflow-hidden">
          <div className="absolute top-10 right-10 w-24 h-24 opacity-20 hover:opacity-100 transition-opacity">
            <img 
               src="https://hlemnlibokutxjfaviaz.supabase.co/storage/v1/object/public/Media/Black%20White%20Minimalist%20Calligraphy%20Signature%20Logo.png" 
               className="w-full h-full object-contain -rotate-12" 
               alt="Brand Logo" 
            />
          </div>
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[#9DA07E] to-transparent" />
          
          <div className="w-24 h-24 bg-[#9DA07E]/10 text-[#9DA07E] rounded-full flex items-center justify-center mx-auto mb-10">
            <CheckCircle size={48} strokeWidth={1.5} />
          </div>
          
          <span className="text-[12px] uppercase tracking-[0.4em] font-bold text-[#9DA07E] mb-4 block">
            {isManual ? "Booking Request Sent" : "Reservation Confirmed"}
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-slate-900 mb-8 leading-tight">
            {isManual ? "Almost there." : "See you at"} <br /> <span className="italic">One Eleven.</span>
          </h1>
          
          <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto leading-relaxed font-light">
            {isManual 
              ? `Thank you, ${booking?.guest?.split(' ')[0]}. Your dates are being held. Please complete the bank transfer to finalize your stay.`
              : `Thank you, ${booking?.guest?.split(' ')[0]}. Your sanctuary in Taupō is secured for ${booking?.checkIn}. We're thrilled to host you.`
            }
          </p>

          {isManual && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#9DA07E]/5 border border-[#9DA07E]/20 rounded-3xl p-8 mb-12 text-left"
            >
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#9DA07E] mb-6 flex items-center gap-2">
                <Info size={14} /> Payment Instructions
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-[#9DA07E]/10 pb-2">
                  <span className="text-stone-400 font-bold uppercase tracking-tighter text-[10px]">Account Name</span>
                  <span className="font-bold text-slate-900">CARLSON & CO LTD.</span>
                </div>
                <div className="flex justify-between border-b border-[#9DA07E]/10 pb-2">
                  <span className="text-stone-400 font-bold uppercase tracking-tighter text-[10px]">Account Number</span>
                  <span className="font-bold text-slate-900">06-0429-0411603-00</span>
                </div>
                <div className="flex justify-between border-b border-[#9DA07E]/10 pb-2">
                  <span className="text-stone-400 font-bold uppercase tracking-tighter text-[10px]">Reference</span>
                  <span className="font-bold text-slate-900">#{booking?.id?.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-stone-400 font-bold uppercase tracking-tighter text-[10px]">Total Amount</span>
                  <span className="font-bold text-[#9DA07E] text-lg">NZD ${booking?.total?.toLocaleString()}</span>
                </div>
              </div>
              <p className="mt-6 text-[10px] text-stone-400 italic text-center">
                Check your email for these details and further instructions.
              </p>
            </motion.div>
          )}

          <div className="bg-slate-50 rounded-3xl p-6 mb-12 flex flex-col items-center justify-center border border-slate-100">
             <Calendar className="text-[#9DA07E] mb-2" size={24} />
             <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Booking Reference</p>
             <p className="text-lg font-serif text-slate-900">#{booking?.id?.slice(0, 8).toUpperCase()}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <button className="flex items-center justify-center gap-3 bg-slate-50 hover:bg-slate-100 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-100">
              <Download size={18} /> PDF Receipt
            </button>
            <button className="flex items-center justify-center gap-3 bg-slate-50 hover:bg-slate-100 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-100">
              <Share2 size={18} /> Itinerary
            </button>
          </div>

          <div className="space-y-4">
            <Link 
              to="/guest-info" 
              className="flex items-center justify-center gap-3 w-full bg-slate-900 text-white font-black py-6 rounded-2xl hover:scale-[1.02] transition-all shadow-2xl uppercase tracking-[0.2em] text-xs"
            >
              Access Guidebook <ArrowRight size={20} />
            </Link>
            <Link 
              to="/" 
              className="flex items-center justify-center gap-3 w-full text-slate-400 font-bold py-4 hover:text-[#9DA07E] transition-all text-xs uppercase tracking-widest"
            >
              <Home size={18} /> Return Home
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-400 text-[10px] uppercase tracking-[0.3em] font-black">
            Managed with precision by Carlson Properties
          </p>
        </div>
      </motion.div>
    </div>
  );
}