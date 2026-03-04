import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import { ChevronLeft, ShoppingBag, Trash2, ArrowRight, Calendar, Users, Info } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { toast } from "sonner";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { cartBreadcrumbSchema } from "../lib/schemas";

const PROPERTY_IMAGE = "https://hlemnlibokutxjfaviaz.supabase.co/storage/v1/object/public/Media/032_Open2view_ID584542-111_Jarden_Mile.jpg";

export function CartPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    // Try to get data from navigation state first
    if (location.state && location.state.checkIn) {
      console.log("Cart: Received state from navigation", location.state);
      setBooking(location.state);
      localStorage.setItem('active_booking_cart', JSON.stringify(location.state));
    } else {
      // Try to recover from localStorage
      const saved = localStorage.getItem('active_booking_cart');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          console.log("Cart: Recovered from localStorage", parsed);
          setBooking(parsed);
        } catch (e) {
          console.error("Cart: Recovery failed", e);
          navigate("/book");
        }
      } else {
        console.log("Cart: No booking found, redirecting");
        navigate("/book");
      }
    }
  }, [location.state, navigate]);

  if (!booking) return null;

  const { checkIn, checkOut, guests, totalPrice, subtotal, discountAmount } = booking;
  const nights = checkIn && checkOut ? differenceInDays(new Date(checkOut), new Date(checkIn)) : 0;

  const handleRemove = () => {
    localStorage.removeItem('active_booking_cart');
    toast.info("Booking removed from cart");
    navigate("/book");
  };

  const proceedToCheckout = () => {
    navigate("/checkout", { state: booking });
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#2D2D2D] font-sans">
      <SEO 
        title="Cart - Review Your Booking"
        description="Review your booking for One Eleven Taupo luxury accommodation. Confirm your dates and proceed to secure checkout."
        url="/cart"
        schemaData={cartBreadcrumbSchema}
      />
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 text-left">
        <Link 
          to="/book"
          className="flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors mb-12 group w-fit"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Continue Exploring
        </Link>

        <header className="mb-12 flex justify-between items-end border-b border-stone-100 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-2 flex items-center gap-4">
              Your Selection
              <ShoppingBag className="w-8 h-8 text-stone-300" />
            </h1>
            <p className="text-stone-500 font-light">Confirm your stay at One Eleven | On The Mile.</p>
          </div>
          <span className="text-sm font-black uppercase tracking-[0.2em] text-stone-400">1 Item</span>
        </header>

        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-stone-200 rounded-[32px] overflow-hidden shadow-sm flex flex-col md:row"
          >
            <div className="grid md:grid-cols-12 w-full">
              <div className="md:col-span-4 h-48 md:h-auto bg-stone-100 overflow-hidden relative">
                <img 
                  src={PROPERTY_IMAGE} 
                  alt="One Eleven Exterior"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-stone-800">
                  Taupō, NZ
                </div>
              </div>

              <div className="md:col-span-8 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-serif mb-1 uppercase tracking-tight">One Eleven | On the Mile</h3>
                      <p className="text-stone-500 text-sm italic font-light">Luxury Residence • Entire Home</p>
                    </div>
                    <button 
                      onClick={handleRemove}
                      className="p-2 text-stone-300 hover:text-red-500 transition-colors"
                      title="Remove booking"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-stone-50 mb-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-[#9DA07E]" />
                      <div>
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Dates</p>
                        <p className="text-sm font-bold">{checkIn ? format(new Date(checkIn), 'MMM d') : ''} - {checkOut ? format(new Date(checkOut), 'MMM d') : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-[#9DA07E]" />
                      <div>
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Guests</p>
                        <p className="text-sm font-bold">{guests} Guests</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mb-1">{nights} nights stay</p>
                    <p className="text-3xl font-serif font-bold text-[#1A1A1A]">${totalPrice ? Number(totalPrice).toLocaleString() : '0'}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[#9DA07E] font-black text-[10px] uppercase tracking-[0.2em] bg-[#9DA07E]/10 px-4 py-2 rounded-full">
                    Direct Discount Applied
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-8">
            <div className="bg-stone-50 rounded-3xl p-8 border border-stone-100 flex gap-4">
              <Info className="w-6 h-6 text-stone-400 flex-shrink-0" />
              <div>
                <h4 className="font-black text-[10px] uppercase tracking-[0.2em] mb-3 text-stone-800">Booking Policy</h4>
                <p className="text-sm text-stone-500 leading-relaxed italic font-light">
                  "By proceeding, you secure your dates and your booking details will be emailed to you immediately after payment."
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-stone-600 font-medium">
                  <span>Subtotal</span>
                  <span>${subtotal ? Number(subtotal).toLocaleString() : '0'}</span>
                </div>
                <div className="flex justify-between text-sm text-[#9DA07E] font-black uppercase tracking-widest text-[10px]">
                  <span>Direct Booking 10% Off</span>
                  <span>-${discountAmount ? Number(discountAmount).toLocaleString() : '0'}</span>
                </div>
                <div className="flex justify-between text-xl font-serif font-bold pt-4 border-t border-stone-200 uppercase tracking-tight">
                  <span>Estimated Total</span>
                  <span>${totalPrice ? Number(totalPrice).toLocaleString() : '0'}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={proceedToCheckout}
                className="w-full py-6 bg-[#1A1A1A] text-white rounded-2xl font-black uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 group text-sm"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
