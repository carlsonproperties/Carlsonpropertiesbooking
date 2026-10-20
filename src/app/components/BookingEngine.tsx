import React, { useState, useEffect } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, differenceInDays, isSameDay, startOfDay, addDays, subDays } from "date-fns";
import { motion } from "motion/react";
import { Calendar as CalendarIcon, Users, ArrowRight, CheckCircle, Info } from "lucide-react";
import { useNavigate } from "react-router";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { ScallopedSeal } from './ClubMarks';

interface BookingEngineProps {
  pricePerNight?: number;
}

export function BookingEngine({ pricePerNight = 1275 }: BookingEngineProps) {
  const navigate = useNavigate();
  const [range, setRange] = useState<DateRange | undefined>();
  const [occupiedDates, setOccupiedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState(2);
  const [isBooking, setIsBooking] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isBookingState, setIsBookingState] = useState(false);

  // Constants must be defined before use
  const actualPrice = 1275;
  const MIN_NIGHTS = 2;
  const DISCOUNT_PERCENT = 10;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    async function fetchAvailability() {
      try {
        console.log("Syncing calendar availability...");
        // Ensure we're using the base URL provided in the info.tsx or provided by the user
        const functionBase = `https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798`;
        const res = await fetch(`${functionBase}/calendar-events?t=${Date.now()}`, {
          headers: { 
            'Authorization': `Bearer ${publicAnonKey.trim()}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!res.ok) {
          const errData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
          const detailedMsg = errData.message || errData.error || `HTTP ${res.status}`;
          const debugPath = errData.debug?.requestedPath ? ` (Path: ${errData.debug.requestedPath})` : '';
          throw new Error(`${detailedMsg}${debugPath}`);
        }
        
        const data = await res.json();
        console.log("Calendar sync successful:", data);
        if (data.occupiedDates) {
          const dates = data.occupiedDates.map((d: string) => {
            const [year, month, day] = d.split('-').map(Number);
            return new Date(year, month - 1, day);
          });
          setOccupiedDates(dates);
          setLastSynced(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      } catch (err: any) {
        console.error("Failed to fetch calendar:", err);
        setBookingError(`Calendar Sync Error: ${err.message}. Please refresh the page.`);
      } finally {
        setLoading(false);
      }
    }
    fetchAvailability();
  }, []);

  // `occupiedDates` from the server is a list of occupied NIGHTS: it is built
  // with `while (current < end)`, so a booking's check-out day is not in it.
  // A date being present therefore means "nobody can sleep here that night" —
  // it does NOT mean the date is unusable, because the morning of a booked
  // night is still a perfectly good check-out for the stay before it.
  const occupiedNights = React.useMemo(
    () => new Set(occupiedDates.map((d) => format(startOfDay(d), 'yyyy-MM-dd'))),
    [occupiedDates],
  );
  const isNightBooked = (date: Date) => occupiedNights.has(format(startOfDay(date), 'yyyy-MM-dd'));

  /** The first booked night in [from, to), or null when the whole stay is free. */
  const firstBookedNight = (from: Date, to: Date): Date | null => {
    const end = startOfDay(to);
    for (let night = startOfDay(from); night < end; night = addDays(night, 1)) {
      if (isNightBooked(night)) return night;
    }
    return null;
  };

  const handleRangeSelect = (next: DateRange | undefined) => {
    setBookingError(null);

    if (!next?.from) {
      setRange(next);
      return;
    }

    // The stay must begin on a free night. Check-out-only days are clickable,
    // so this is reachable — both on a first click and when clicking backwards
    // past an existing check-in, which makes the clicked day the new `from`.
    if (isNightBooked(next.from)) {
      setBookingError(
        `The night of ${format(next.from, 'd MMM')} is already booked. That date can only be a check-out day — pick an earlier date to check in.`,
      );
      setRange(undefined);
      return;
    }

    // Clicking the same day twice is not a stay; keep it as the check-in.
    if (!next.to || isSameDay(next.from, next.to)) {
      setRange({ from: next.from, to: undefined });
      return;
    }

    // Every night from check-in up to (not including) check-out must be free.
    // `from` is known free above, so any hit here is genuinely later than it
    // and is therefore a date the guest can legitimately check out on.
    const blocked = firstBookedNight(next.from, next.to);
    if (blocked) {
      setBookingError(
        `Those dates run through the night of ${format(blocked, 'd MMM')}, which is already booked. ` +
        `You can still check out on ${format(blocked, 'd MMM')} — select that as your last day.`,
      );
      // Keep the check-in — it is known free, and the message above tells the
      // guest which end date to pick instead, so only that needs choosing again.
      setRange({ from: next.from, to: undefined });
      return;
    }

    setRange(next);
  };

  const numberOfNights = range?.from && range?.to ? differenceInDays(range.to, range.from) : 0;
  // A complete range of zero nights (check-in and check-out on the same day) is
  // too short as well — guarding on `> 0` let it through to checkout at $0.
  const isTooShort = Boolean(range?.from && range?.to) && numberOfNights < MIN_NIGHTS;

  const subtotal = numberOfNights * actualPrice;
  const discountAmount = subtotal * (DISCOUNT_PERCENT / 100);
  const totalPrice = subtotal - discountAmount;

  const handleBookNow = async () => {
    console.log("Book Now clicked", { range, isTooShort, isBooking });
    if (!range?.from || !range?.to || isTooShort) {
      console.log("Validation failed, aborting checkout");
      return;
    }

    // Safety check against the calendar fetched on load, in case it moved on
    // between selection and checkout. Same half-open rule as the picker: the
    // check-out day itself is never required to be free.
    const blocked = firstBookedNight(range.from, range.to);
    if (blocked) {
      setBookingError(
        `The night of ${format(blocked, 'd MMM')} is no longer available. Please choose different dates.`,
      );
      return;
    }
    
    // Extract dates to simple strings for state
    const checkInStr = format(range.from, 'yyyy-MM-dd');
    const checkOutStr = format(range.to, 'yyyy-MM-dd');

    const bookingPayload = {
      checkIn: checkInStr,
      checkOut: checkOutStr,
      guests: guests,
      totalPrice: totalPrice,
      subtotal: subtotal,
      discountAmount: discountAmount
    };

    console.log("Saving booking payload to localStorage:", bookingPayload);
    localStorage.setItem('active_booking_cart', JSON.stringify(bookingPayload));

    // Redirect to the new Cart page
    navigate("/cart", { state: bookingPayload });
  };

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#203F3A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-[40px] text-center shadow-xl border border-slate-100 relative overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-[0.05] pointer-events-none flex items-center justify-center overflow-hidden">
           <ScallopedSeal size={320} className="rotate-6 text-[#203F3A]" />
        </div>
        <div className="w-20 h-20 bg-[#203F3A]/10 text-[#203F3A] rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
          <CheckCircle size={40} />
        </div>
        <h3 className="text-3xl font-serif text-slate-900 mb-4 relative z-10">Request Sent!</h3>
        <p className="text-slate-500 mb-8 leading-relaxed max-w-md mx-auto relative z-10">
          Your booking for {numberOfNights} nights ({range?.from ? format(range.from, 'MMM d') : ''} - {range?.to ? format(range.to, 'MMM d') : ''}) has been received. We'll be in touch shortly to confirm.
        </p>
        <button 
          onClick={() => {
            setShowConfirmation(false);
            setRange(undefined);
          }}
          className="bg-slate-900 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest relative z-10 hover:bg-[#203F3A] transition-all"
        >
          Book Another Stay
        </button>
      </motion.div>
    );
  }

  return (
    <div className="grid lg:grid-cols-12 gap-12 items-start">
      <style>{`
        .booking-calendar .rdp {
          --rdp-cell-size: 56px;
          --rdp-accent-color: #203F3A;
          --rdp-background-color: #f8fafc;
          margin: 0;
          width: 100%;
        }
        @media (max-width: 1400px) {
          .booking-calendar .rdp {
            --rdp-cell-size: 48px;
          }
        }
        @media (max-width: 1200px) {
          .booking-calendar .rdp {
            --rdp-cell-size: 40px;
          }
        }
        .booking-calendar .rdp-months {
          display: grid !important;
          grid-template-columns: repeat(2, min-content) !important;
          justify-content: center !important;
          gap: 6rem !important;
        }
        @media (max-width: 1024px) {
          .booking-calendar .rdp-months {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
        .booking-calendar .rdp-day_selected, .booking-calendar .rdp-day_selected:hover {
          background-color: var(--rdp-accent-color) !important;
          color: white !important;
          border-radius: 12px;
        }
        .booking-calendar .rdp-day_range_middle {
          background-color: #f1f5f9 !important;
          color: var(--rdp-accent-color) !important;
          border-radius: 0;
        }
        .booking-calendar .rdp-day {
          font-weight: 500;
          transition: all 0.2s;
        }
        .booking-calendar .rdp-day:hover:not(.rdp-day_disabled) {
          background-color: #f1f5f9;
          border-radius: 12px;
        }
        .booking-calendar .rdp-day_disabled {
          opacity: 0.25;
          text-decoration: line-through;
          cursor: not-allowed;
        }
        /* Check-out only: the night is taken, but the stay before it can end
           here. Half-shaded from the lower-right to read as a part day. */
        .booking-calendar .rdp-day_checkout_only:not(.rdp-day_selected) {
          background-image: linear-gradient(135deg, transparent 0 50%, #e2e8f0 50% 100%);
        }
      `}</style>
      
      {/* Calendar Side */}
      <div className="lg:col-span-8 bg-white p-8 md:p-12 rounded-[48px] shadow-2xl border border-slate-100">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h3 className="text-3xl font-serif text-slate-900 mb-1">Select your dates</h3>
            <p className="text-slate-500 text-sm">Pick your nights and we will confirm straight away</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 text-[#203F3A] bg-[#203F3A]/10 px-6 py-3 rounded-full border border-[#203F3A]/20">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Live availability</span>
                </div>
                {lastSynced && <span className="text-[9px] opacity-70 uppercase tracking-tighter">Updated {lastSynced}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="booking-calendar flex justify-center w-full">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleRangeSelect}
            // Weeks run Monday to Sunday, as they do in New Zealand. The
            // default is Sunday-first, which splits the weekend across two
            // rows and makes a Fri–Sun stay hard to read as one block.
            weekStartsOn={1}
            modifiers={{
              // Enabled, but only as the last day of a stay: the night itself
              // belongs to the next booking.
              checkoutOnly: (date) => {
                const day = startOfDay(date);
                return day >= startOfDay(new Date()) && isNightBooked(day) && !isNightBooked(subDays(day, 1));
              },
            }}
            modifiersClassNames={{ checkoutOnly: 'rdp-day_checkout_only' }}
            disabled={[(date) => {
              const day = startOfDay(date);
              if (day < startOfDay(new Date())) return true;
              // A booked night cannot begin or continue a stay. It can still be
              // the check-out morning of the stay before it, so only grey the
              // day out when the night before is taken too — otherwise a guest
              // could not book up to the day someone else arrives.
              return isNightBooked(day) && isNightBooked(subDays(day, 1));
            }]}
            numberOfMonths={isMobile ? 1 : 2}
            styles={{
              caption: { color: '#0f172a', fontWeight: '800', fontSize: '1.1rem', marginBottom: '1.5rem' },
              head_cell: { color: '#94a3b8', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.15em', paddingBottom: '1rem' },
              day_today: { color: '#203F3A', fontWeight: '900', textDecoration: 'underline' },
              nav_button: { color: '#203F3A', padding: '0.5rem' }
            }}
          />
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#203F3A]" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-slate-100" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-slate-200" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic line-through">Occupied</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundImage: 'linear-gradient(135deg, #f1f5f9 0 50%, #e2e8f0 50% 100%)' }} />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Check-out only</span>
          </div>
        </div>
      </div>

      {/* Booking Side */}
      <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
        <div className="bg-[#16302B] text-[#F4F1EA] p-10 rounded-[48px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D7C8B4]/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-10">
              <div>
                <span className="text-[#D7C8B4] text-[10px] font-bold uppercase tracking-[0.3em] block mb-2">Taupō holiday home</span>
                <h4 className="text-3xl font-serif leading-tight">One Eleven <br /><span className="italic">on the Mile</span></h4>
              </div>
              <div className="text-right">
                <p className="text-3xl font-serif text-[#D7C8B4]">${actualPrice}</p>
                <p className="text-[10px] text-[#F4F1EA]/55 uppercase tracking-widest">per night</p>
              </div>
            </div>

            <div className="space-y-4 mb-10">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CalendarIcon size={18} className="text-[#D7C8B4]" />
                  <div>
                    <p className="text-[10px] text-[#F4F1EA]/55 uppercase tracking-widest">Check-in</p>
                    <p className="text-sm font-bold">{range?.from ? format(range.from, 'MMM dd, yyyy') : 'Select date'}</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-white/20" />
                <div className="text-right">
                  <p className="text-[10px] text-[#F4F1EA]/55 uppercase tracking-widest">Check-out</p>
                  <p className="text-sm font-bold">{range?.to ? format(range.to, 'MMM dd, yyyy') : 'Select date'}</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users size={18} className="text-[#D7C8B4]" />
                  <div>
                    <p className="text-[10px] text-[#F4F1EA]/55 uppercase tracking-widest">Guests</p>
                    <p className="text-sm font-bold">{guests} {guests === 1 ? "guest" : "guests"}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">-</button>
                  <button onClick={() => setGuests(Math.min(10, guests + 1))} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">+</button>
                </div>
              </div>
            </div>

            {numberOfNights > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="border-t border-white/10 pt-8 mt-8 space-y-4"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-[#F4F1EA]/70 font-medium">${actualPrice} × {numberOfNights} nights</span>
                  <span className="font-bold">${subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-sm items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[#16302B] font-bold uppercase tracking-widest text-[10px] bg-[#D7C8B4] px-2 py-0.5 rounded">Direct booking · 10% off</span>
                  </div>
                  <span className="font-bold text-[#D7C8B4] flex items-center gap-1">
                    <span className="text-[10px] uppercase font-bold">-</span>
                    ${discountAmount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-[#F4F1EA]/70 font-medium">Cleaning and service fee</span>
                  <span className="font-bold text-[#D7C8B4]">Included</span>
                </div>

                {isTooShort && (
                  <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-3 text-red-200 text-[11px]">
                    <Info size={14} />
                    <span>Minimum stay of {MIN_NIGHTS} nights required.</span>
                  </div>
                )}

                <div className="flex justify-between items-end pt-4 border-t border-white/10">
                  <div className="flex flex-col">
                    <span className="text-lg font-serif">Total amount</span>
                    <span className="text-[10px] text-[#F4F1EA]/55 uppercase tracking-widest italic">Includes all taxes and fees</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white/30 text-xs line-through block font-medium decoration-white/20">${subtotal.toLocaleString()}</span>
                    <span className="text-3xl font-serif text-[#D7C8B4]">${totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {bookingError && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-200 text-xs text-center"
              >
                {bookingError}
              </motion.div>
            )}

            <button 
              type="button"
              disabled={!range?.from || !range?.to || isTooShort}
              onClick={handleBookNow}
              className={`w-full mt-10 py-6 rounded-2xl font-bold uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-2xl ${
                range?.from && range?.to && !isTooShort
                ? "bg-[#F4F1EA] text-[#203F3A] hover:bg-[#D7C8B4] scale-[1.02]" 
                : "bg-[#F4F1EA]/10 text-[#F4F1EA]/55 cursor-not-allowed"
              }`}
            >
              Continue to checkout <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 p-6 rounded-[32px] flex gap-4">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl h-fit">
            <Info size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-1">Instant confirmation</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">Your dates are checked against our live calendar as you book, so you will never arrive to a double booking.</p>
          </div>
        </div>
      </div>
    </div>
  );
}