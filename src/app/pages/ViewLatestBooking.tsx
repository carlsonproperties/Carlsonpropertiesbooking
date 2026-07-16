import React, { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { getOwnerToken } from "../lib/supabase";
import { motion } from "motion/react";
import { Calendar, User, Mail, Phone, DollarSign, StickyNote, CheckCircle, Clock, Loader2 } from "lucide-react";

export function ViewLatestBooking() {
  const [loading, setLoading] = useState(true);
  const [latestBooking, setLatestBooking] = useState<any>(null);
  const [error, setError] = useState("");
  const [allBookings, setAllBookings] = useState<any[]>([]);

  useEffect(() => {
    fetchLatestBooking();
  }, []);

  const fetchLatestBooking = async () => {
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(
        `https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/dashboard-stats`,
        {
          headers: {
            'Authorization': `Bearer ${await getOwnerToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      const data = await res.json();
      console.log("Dashboard data:", data);
      
      const bookings = data.allGuests || [];
      setAllBookings(bookings);
      
      // Find the most recently created booking
      const sorted = [...bookings].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.checkIn);
        const dateB = new Date(b.createdAt || b.checkIn);
        return dateB.getTime() - dateA.getTime();
      });
      
      if (sorted.length > 0) {
        setLatestBooking(sorted[0]);
      } else {
        setError("No bookings found in the system");
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch booking data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#9DA07E] animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading latest booking data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md">
          <p className="text-red-400 text-center">{error}</p>
          <button 
            onClick={fetchLatestBooking}
            className="mt-4 w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 py-3 rounded-xl transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!latestBooking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-slate-400">No bookings found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-slate-700/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-[#9DA07E]/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#9DA07E]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Latest Booking</h1>
                <p className="text-slate-400 text-sm">Most recent payment received</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <Clock size={14} />
              <span>Total bookings in system: {allBookings.length}</span>
            </div>
          </div>

          {/* Booking Details Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Guest Name */}
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Guest Name</span>
              </div>
              <p className="text-2xl font-bold text-white">{latestBooking.guest || "N/A"}</p>
            </div>

            {/* Email */}
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</span>
              </div>
              <p className="text-lg font-medium text-white break-all">{latestBooking.email || "N/A"}</p>
            </div>

            {/* Phone */}
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</span>
              </div>
              <p className="text-lg font-medium text-white">{latestBooking.phone || "Not provided"}</p>
            </div>

            {/* Total Paid */}
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Paid</span>
              </div>
              <p className="text-2xl font-bold text-emerald-400">
                NZD ${latestBooking.total ? latestBooking.total.toFixed(2) : "0.00"}
              </p>
            </div>
          </div>

          {/* Check-in/Check-out */}
          <div className="bg-gradient-to-br from-[#9DA07E]/20 to-[#9DA07E]/5 rounded-2xl p-6 border border-[#9DA07E]/30 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-[#9DA07E]" />
              <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Stay Dates</span>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Check-In</p>
                <p className="text-2xl font-bold text-white">{latestBooking.checkIn || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Check-Out</p>
                <p className="text-2xl font-bold text-white">{latestBooking.checkOut || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/30">
            <div className="flex items-center gap-3 mb-3">
              <StickyNote className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Guest Notes</span>
            </div>
            <p className="text-white leading-relaxed">
              {latestBooking.notes || "No special notes provided"}
            </p>
          </div>

          {/* Booking Reference */}
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Booking Reference:</span>
              <span className="font-mono text-white bg-slate-900/50 px-4 py-2 rounded-xl">
                #{latestBooking.id?.slice(0, 8).toUpperCase() || "N/A"}
              </span>
            </div>
            {latestBooking.createdAt && (
              <div className="flex items-center justify-between text-sm mt-3">
                <span className="text-slate-500">Created At:</span>
                <span className="text-white">
                  {new Date(latestBooking.createdAt).toLocaleString('en-NZ', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </span>
              </div>
            )}
            {latestBooking.stripeSessionId && (
              <div className="mt-6 bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                <p className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Stripe Payment Details</p>
                <div className="space-y-2">
                  <div className="flex items-start justify-between text-sm">
                    <span className="text-slate-400">Session ID:</span>
                    <span className="font-mono text-purple-300 text-xs break-all max-w-[70%] text-right">
                      {latestBooking.stripeSessionId}
                    </span>
                  </div>
                  <div className="mt-3 p-3 bg-slate-900/50 rounded-lg">
                    <p className="text-xs text-slate-400 mb-1">🔍 Find this transaction in Stripe:</p>
                    <p className="text-xs text-white">
                      1. Log into your <strong>Stripe Dashboard</strong><br/>
                      2. Go to <strong>Payments</strong> → <strong>All Payments</strong><br/>
                      3. Search for: <span className="font-mono text-purple-300">{latestBooking.stripeSessionId}</span><br/>
                      4. Or search by amount: <strong>${latestBooking.total?.toFixed(2)}</strong><br/>
                      5. Or search by customer email: <strong>{latestBooking.email}</strong>
                    </p>
                  </div>
                  <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-xs text-amber-400">
                      <strong>⚠️ Can't find this transaction?</strong><br/>
                      The transaction might be in a different Stripe account than the ones you checked.
                      The booking system is connected to whichever Stripe account has the API key configured in Supabase secrets.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirmation */}
          <div className="mt-8 bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-green-400 font-bold mb-2">✅ Booking Added to Dashboard</p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  This booking has been successfully stored in the system and is visible in the Owner Dashboard.
                  The customer should have received a confirmation email, and you should have received a notification at bookings@carlsonproperties.co.nz.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* All Bookings Count */}
        <div className="mt-6 text-center">
          <button
            onClick={fetchLatestBooking}
            className="text-sm text-slate-500 hover:text-[#9DA07E] transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
}
