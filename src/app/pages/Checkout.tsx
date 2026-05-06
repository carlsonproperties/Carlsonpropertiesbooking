import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ChevronLeft, CreditCard, Calendar, Users, Info, ShieldCheck, MapPin, ArrowRight, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { toast } from "sonner";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { trackBookingStarted } from "../lib/analytics";
import { checkoutBreadcrumbSchema } from "../lib/schemas";

const PROPERTY_IMAGE = "https://hlemnlibokutxjfaviaz.supabase.co/storage/v1/object/public/Media/032_Open2view_ID584542-111_Jarden_Mile.jpg";

export function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    couponCode: '',
    notes: ''
  });

  useEffect(() => {
    // Priority 1: Navigation State
    if (location.state && location.state.checkIn) {
      console.log("Checkout: Received navigation state", location.state);
      setActiveBooking(location.state);
      localStorage.setItem('active_booking_cart', JSON.stringify(location.state));
    } 
    // Priority 2: Local Storage Recovery
    else {
      const saved = localStorage.getItem('active_booking_cart');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          console.log("Checkout: Recovered from localStorage", parsed);
          setActiveBooking(parsed);
        } catch (e) {
          console.error("Checkout: Failed to parse saved booking", e);
          navigate("/book");
        }
      } else {
        console.log("Checkout: No data found, redirecting");
        navigate("/book");
      }
    }
  }, [location.state, navigate]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBooking) {
      toast.error("Error", { description: "Booking data is missing. Please try again." });
      return;
    }

    const amount = Number(activeBooking.totalPrice);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid Amount", { description: "The total price for this booking is invalid. Please restart your booking." });
      return;
    }
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error("Required Fields", { description: "Please complete all guest details." });
      return;
    }

    setLoading(true);
    setError(null);
    
    // Track booking started (begin_checkout event)
    trackBookingStarted({
      checkIn: activeBooking.checkIn,
      checkOut: activeBooking.checkOut,
      nights,
      estimatedAmount: amount,
      guests: Number(activeBooking.guests)
    });
    
    try {
      if (!projectId || !publicAnonKey) {
        throw new Error("Supabase configuration is missing from the application environment.");
      }

      const endpoint = paymentMethod === 'card' ? 'create-checkout-session' : 'manual-booking';
      const checkoutUrl = `https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/${endpoint}`;
      
      const payload = {
        bookingData: {
          guestName: `${formData.firstName} ${formData.lastName}`,
          guestEmail: formData.email,
          guestPhone: formData.phone,
          guestNotes: formData.notes,
          checkIn: activeBooking.checkIn,
          checkOut: activeBooking.checkOut,
          amount: amount,
          guests: Number(activeBooking.guests)
        },
        couponCode: formData.couponCode || undefined
      };

      console.log(`Initiating ${paymentMethod} request:`, { url: checkoutUrl, payload });
      
      const res = await fetch(checkoutUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey.trim()}` 
        },
        body: JSON.stringify(payload)
      }).catch(fetchErr => {
        console.error("Network Fetch Error:", fetchErr);
        throw new Error("Could not connect to the payment server. Please check your internet connection or try again later.");
      });

      console.log("Response HTTP Status:", res.status);
      
      const responseText = await res.text();
      let responseData;
      
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error("Non-JSON response received:", responseText);
        if (responseText.includes("Edge Function not found")) {
          throw new Error("Checkout service is not reachable. Please contact support.");
        }
        throw new Error(`Connection error (${res.status}). The payment service returned an unexpected response.`);
      }

      if (!res.ok) {
        console.error("Checkout Error Data:", responseData);
        // Special handling for Stripe configuration errors
        if (responseData.error?.includes("Stripe") || responseData.details?.includes("Stripe")) {
          throw new Error(`Payment Configuration Error: ${responseData.error}. Please use Bank Transfer for now or contact the owner.`);
        }
        
        // Detailed 404 message
        if (res.status === 404) {
          const debugInfo = responseData.debug?.requestedPath ? ` (Path: ${responseData.debug.requestedPath})` : ` (URL: ${checkoutUrl})`;
          throw new Error(`Endpoint not found: ${responseData.message || "The server could not find the checkout route."}${debugInfo}. Please ensure the Edge Function is deployed.`);
        }

        throw new Error(responseData.error || responseData.message || "Server error");
      }

      if (paymentMethod === 'card') {
        if (responseData.url) {
          console.log("Redirecting to Stripe:", responseData.url);
          toast.success("Redirecting to secure payment...");
          setTimeout(() => {
            window.location.href = responseData.url;
          }, 800);
        } else {
          throw new Error("The server didn't return a payment URL. Check if Stripe is enabled for this account.");
        }
      } else {
        // Manual booking success
        console.log("Manual booking successful:", responseData.booking);
        toast.success("Booking Request Sent!", { description: "Check your email for bank transfer details." });
        navigate("/booking-success", { state: { booking: responseData.booking, manual: true } });
      }
    } catch (err: any) {
      console.error("Payment flow error:", err);
      setError(err.message || "Failed to initiate payment.");
      toast.error("Checkout Error", { 
        description: err.message,
        duration: 8000 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!activeBooking) return null;

  const { checkIn, checkOut, guests, totalPrice, subtotal, discountAmount } = activeBooking;
  const nights = checkIn && checkOut ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#2D2D2D] font-sans pb-20 relative">
      <SEO 
        title="Checkout - Complete Your Booking"
        description="Complete your booking for One Eleven Taupo luxury accommodation. Secure payment processing with Stripe."
        url="/checkout"
        schemaData={checkoutBreadcrumbSchema}
      />
      <div className="max-w-6xl mx-auto px-6 pt-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to selection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Details */}
          <div className="lg:col-span-7 space-y-10">
            <header>
              <h1 className="text-4xl font-serif text-[#1A1A1A] mb-4">Confirm your stay</h1>
              <p className="text-stone-500">Review your details and complete guest information before proceeding.</p>
            </header>

            <section className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Dates</label>
                    <div className="flex items-center gap-3 text-lg font-medium">
                      <Calendar className="w-5 h-5 text-stone-400" />
                      {checkIn ? format(new Date(checkIn), 'MMM d') : ''} – {checkOut ? format(new Date(checkOut), 'MMM d, yyyy') : ''}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Guests</label>
                    <div className="flex items-center gap-3 text-lg font-medium">
                      <Users className="w-5 h-5 text-stone-400" />
                      {guests} Guest{guests > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-stone-100 space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Info className="w-4 h-4 text-stone-400" />
                    Reservation Details
                  </h3>
                  <div className="flex items-start gap-4 p-4 bg-stone-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-stone-400 mt-0.5" />
                    <div>
                      <p className="font-semibold uppercase tracking-wider">ONE ELEVEN | ON THE MILE</p>
                      <p className="text-sm text-stone-500">111 Jarden Mile, Taupō, NZ</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <form onSubmit={handlePayment} className="space-y-8">
              <section className="space-y-6">
                <h2 className="text-xl font-serif">Select payment method</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-6 rounded-2xl border-2 flex flex-col items-start gap-3 transition-all ${
                      paymentMethod === 'card' 
                      ? "border-[#9DA07E] bg-[#9DA07E]/5" 
                      : "border-stone-100 hover:border-stone-200"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
                      <CreditCard size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">Credit / Debit Card</p>
                      <p className="text-xs text-stone-500">Secure instant payment via Stripe</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-6 rounded-2xl border-2 flex flex-col items-start gap-3 transition-all ${
                      paymentMethod === 'bank' 
                      ? "border-[#9DA07E] bg-[#9DA07E]/5" 
                      : "border-stone-100 hover:border-stone-200"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
                      <Info size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">Bank Transfer</p>
                      <p className="text-xs text-stone-500">Manual payment (Direct Credit)</p>
                    </div>
                  </button>
                </div>

                {paymentMethod === 'bank' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-[#9DA07E]/10 border border-[#9DA07E]/20 rounded-2xl space-y-4"
                  >
                    <h3 className="font-bold text-sm uppercase tracking-wider text-[#9DA07E]">Bank Transfer Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Account Name:</span>
                        <span className="font-bold">CARLSON & CO LTD.</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Account Number:</span>
                        <span className="font-bold">06-0429-0411603-00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Bank:</span>
                        <span className="font-bold">ANZ New Zealand</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-stone-500 leading-relaxed italic border-t border-[#9DA07E]/20 pt-4">
                      * Please use your Name as reference. Your booking will be confirmed once payment is received.
                    </p>
                  </motion.div>
                )}
              </section>

              <section className="space-y-6">
                <h2 className="text-xl font-serif">Guest information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-stone-500">First Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      placeholder="e.g. John"
                      className="w-full p-4 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#9DA07E] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-stone-500">Last Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      placeholder="e.g. Smith"
                      className="w-full p-4 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#9DA07E] outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-500">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john.smith@example.com"
                    className="w-full p-4 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#9DA07E] outline-none transition-all"
                  />
                  <p className="text-[10px] text-stone-400">We'll send your booking confirmation and check-in details here.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-500">Phone Number</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+64 00 000 0000"
                    className="w-full p-4 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#9DA07E] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-500">Coupon Code (Optional)</label>
                  <input
                    type="text"
                    value={formData.couponCode}
                    onChange={(e) => setFormData({...formData, couponCode: e.target.value.toUpperCase()})}
                    placeholder="Enter code (e.g. TEST100)"
                    className="w-full p-4 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#9DA07E] outline-none transition-all uppercase"
                  />
                  <p className="text-[10px] text-stone-400">Have a promo code? Enter it here for a discount.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-500">Message to Host (Optional)</label>
                  <textarea 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Tell us about your trip or any special requirements..."
                    rows={3}
                    className="w-full p-4 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#9DA07E] outline-none transition-all resize-none"
                  />
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-serif">Cancellation policy</h2>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Full refund for cancellations made within 48 hours of booking, if the check-in date is at least 30 days away. If cancelled between 7 and 30 days before, a 50% refund. If cancelled less than 7 days prior, it is non-refundable.
                </p>
              </section>

              <section className="pt-6 border-t border-stone-200">
                <div className="flex items-center gap-4 text-stone-500 mb-8">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                  <span className="text-sm">Secure booking powered by Stripe. Your payment information is encrypted and never stored on our servers.</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-[#1A1A1A] text-white rounded-xl font-semibold text-lg hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group shadow-xl shadow-black/10"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {paymentMethod === 'card' ? 'Preparing Secure Checkout...' : 'Processing Request...'}
                    </>
                  ) : (
                    <>
                      {paymentMethod === 'card' ? <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" /> : <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                      {paymentMethod === 'card' ? `Proceed to Pay NZD $${totalPrice ? Number(totalPrice).toLocaleString() : '0'}` : `Request Booking via Bank Transfer`}
                    </>
                  )}
                </button>

                {error && (
                  <div className="mt-4 p-6 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl space-y-2">
                    <p className="font-bold text-red-800">Checkout Error:</p>
                    <p className="font-medium">{error}</p>
                    <p className="text-[10px] uppercase tracking-widest mt-4">Troubleshooting Info:</p>
                    <ul className="text-[10px] list-disc pl-4 space-y-1 opacity-70">
                      <li>Check if your Stripe Secret Key is active in Supabase Secrets.</li>
                      <li>Ensure your Supabase project is not paused.</li>
                    </ul>
                  </div>
                )}
              </section>
            </form>
          </div>

          {/* Right Column: Summary Card */}
          <div className="lg:col-span-5">
            <div className="sticky top-12 bg-white border border-stone-200 rounded-3xl p-8 shadow-sm space-y-6">
              <div className="flex gap-4">
                <div className="w-32 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100 border border-stone-100">
                  <img 
                    src={PROPERTY_IMAGE} 
                    alt="One Eleven"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Luxury Residence</p>
                  <h3 className="font-serif text-lg leading-tight">One Eleven | On The Mile</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className="text-[#9DA07E] text-xs">★</span>
                    ))}
                    <span className="text-xs text-stone-400 ml-1">5.0 Luxury Experience</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-stone-100 pt-6 space-y-4">
                <h4 className="font-medium text-stone-800">Price Details</h4>
                <div className="flex justify-between text-stone-600">
                  <span>NZD $1,275.00 x {nights} nights</span>
                  <span>${subtotal ? Number(subtotal).toLocaleString() : '0'}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#9DA07E] font-bold">
                    <span>Direct booking discount (10%)</span>
                    <span>-${Number(discountAmount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Cleaning & Service Fee</span>
                  <span className="text-[#9DA07E] font-bold">Included</span>
                </div>
              </div>

              <div className="border-t border-stone-100 pt-6 flex justify-between items-baseline">
                <span className="text-lg font-serif font-bold">Total (NZD)</span>
                <span className="text-3xl font-serif font-bold">${totalPrice ? Number(totalPrice).toLocaleString() : '0'}</span>
              </div>

              <div className="bg-stone-50 rounded-2xl p-4 flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm border border-stone-100">
                  🇳🇿
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Local Payment</p>
                  <p className="text-sm font-medium">Processed in New Zealand Dollars</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}