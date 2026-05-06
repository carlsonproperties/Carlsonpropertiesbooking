import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  LogOut,
  Mail,
  Phone,
  Home,
  Loader2,
  ChevronDown,
  ChevronUp,
  Clock,
  ShoppingBag,
  Sparkles
} from "lucide-react";
import { CarlsonLogo } from "../components/CarlsonLogo";
import { toast } from "sonner";

const AUTHORIZED_EMAILS = ["grantashl1@gmail.com", "donki.bmbr@gmail.com", "bookings@carlsonproperties.co.nz"];

interface Guest {
  id: string;
  guest: string;
  email: string;
  phone?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: string;
  notes?: string;
  createdAt?: string;
  stripeSessionId?: string;
  channel?: string;
  source: 'direct' | 'airtable';
}

interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  occupancyRate: number;
  avgBookingValue: number;
  upcomingBookings: number;
  allGuests: Guest[];
}

export function DashboardNew() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [user, setUser] = useState<any>(null);
  const [expandedGuest, setExpandedGuest] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user?.email || !AUTHORIZED_EMAILS.includes(session.user.email.toLowerCase())) {
        toast.error("Unauthorized Access");
        navigate("/owner-login");
        return;
      }

      setUser(session.user);
      await fetchDashboardData();
    } catch (error) {
      console.error("Auth check failed:", error);
      navigate("/owner-login");
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const url = `https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/dashboard-stats`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey.trim()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

      const data = await res.json();

      // Process guests and mark sources
      const processedGuests = (data.allGuests || []).map((g: any) => ({
        ...g,
        source: g.stripeSessionId || g.createdAt ? 'direct' : 'airtable',
        channel: g.channel || 'Direct Booking (Website)'
      }));

      // Remove duplicates - prefer direct bookings over Airtable
      const uniqueGuests = processedGuests.reduce((acc: Guest[], guest: Guest) => {
        const duplicate = acc.find(g =>
          g.guest === guest.guest &&
          g.checkIn === guest.checkIn &&
          g.checkOut === guest.checkOut
        );

        if (duplicate) {
          // If we found a duplicate, keep the direct booking
          if (guest.source === 'direct' && duplicate.source === 'airtable') {
            return acc.map(g => g.id === duplicate.id ? guest : g);
          }
          return acc;
        }

        return [...acc, guest];
      }, []);

      setStats({
        ...data,
        allGuests: uniqueGuests,
        totalBookings: uniqueGuests.length
      });
    } catch (error: any) {
      console.error("Dashboard fetch error:", error);
      toast.error("Error Loading Dashboard");
      setStats({
        allGuests: [],
        totalBookings: 0,
        totalRevenue: 0,
        occupancyRate: 0,
        avgBookingValue: 0,
        upcomingBookings: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed Out");
    navigate("/owner-login");
  };

  // Sort all guests: upcoming first (soonest first), then past (most recent first)
  const allGuestsSorted = [...(stats?.allGuests || [])].sort((a, b) => {
    const dateA = new Date(a.checkIn);
    const dateB = new Date(b.checkIn);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isAUpcoming = dateA >= today;
    const isBUpcoming = dateB >= today;

    if (isAUpcoming && !isBUpcoming) return -1;
    if (!isAUpcoming && isBUpcoming) return 1;

    if (isAUpcoming && isBUpcoming) {
      return dateA.getTime() - dateB.getTime(); // Soonest first
    }

    return dateB.getTime() - dateA.getTime(); // Most recent first
  });

  // Get only direct bookings sorted by created time (most recent first)
  const directBookings = [...(stats?.allGuests || [])]
    .filter(g => g.source === 'direct' && g.createdAt)
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
    .slice(0, 10);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfcf8] flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#9DA07E] animate-spin mx-auto mb-4" />
          <p className="text-[#2D2D2D] opacity-60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcf8]">
      {/* Header */}
      <div className="bg-white border-b border-[#9DA07E]/20 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12">
                <CarlsonLogo />
              </div>
              <div>
                <h1 className="text-2xl font-serif text-[#2D2D2D]">Owner Dashboard</h1>
                <p className="text-sm text-[#9DA07E] font-medium">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#9DA07E]/30 hover:bg-[#9DA07E]/10 text-[#2D2D2D] transition-all text-sm"
              >
                <Home className="w-4 h-4" />
                <span className="hidden md:inline">Back to Website</span>
              </button>
              <button
                onClick={fetchDashboardData}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#9DA07E]/10 hover:bg-[#9DA07E]/20 text-[#9DA07E] transition-all text-sm font-medium"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="hidden md:inline">Refresh</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-red-200 hover:bg-red-50 text-red-600 transition-all text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#9DA07E]/20 rounded-3xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-[#9DA07E]/10 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#9DA07E]" />
              </div>
              <div>
                <p className="text-[#9DA07E] text-xs font-bold uppercase tracking-widest mb-1">Total Revenue</p>
                <p className="text-[#2D2D2D] text-2xl font-bold">
                  ${stats?.totalRevenue.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-[#9DA07E]/20 rounded-3xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-[#9DA07E]/10 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#9DA07E]" />
              </div>
              <div>
                <p className="text-[#9DA07E] text-xs font-bold uppercase tracking-widest mb-1">Total Bookings</p>
                <p className="text-[#2D2D2D] text-2xl font-bold">
                  {stats?.totalBookings || 0}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-[#9DA07E]/20 rounded-3xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-[#9DA07E]/10 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#9DA07E]" />
              </div>
              <div>
                <p className="text-[#9DA07E] text-xs font-bold uppercase tracking-widest mb-1">Occupancy Rate</p>
                <p className="text-[#2D2D2D] text-2xl font-bold">
                  {stats?.occupancyRate ? Number(stats.occupancyRate).toFixed(1) : '0.0'}%
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-[#9DA07E]/20 rounded-3xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-[#9DA07E]/10 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-[#9DA07E]" />
              </div>
              <div>
                <p className="text-[#9DA07E] text-xs font-bold uppercase tracking-widest mb-1">Avg Booking</p>
                <p className="text-[#2D2D2D] text-2xl font-bold">
                  ${stats?.avgBookingValue ? Number(stats.avgBookingValue).toFixed(0) : '0'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Two Table Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Guest Directory (2/3 width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white border border-[#9DA07E]/20 rounded-3xl p-8 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-serif text-[#2D2D2D] mb-1">Guest Directory</h2>
                <p className="text-sm text-[#9DA07E] font-medium">All bookings and reservations</p>
              </div>
              <div className="bg-[#9DA07E]/10 px-4 py-2 rounded-full">
                <span className="text-[#9DA07E] font-bold text-sm">
                  {allGuestsSorted.length} Total
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {allGuestsSorted.map((guest, index) => (
                <motion.div
                  key={guest.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.02 }}
                  className={`border border-[#9DA07E]/20 rounded-2xl overflow-hidden transition-all ${
                    expandedGuest === guest.id ? 'bg-[#9DA07E]/5' : 'bg-white hover:bg-[#fdfcf8]'
                  }`}
                >
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => setExpandedGuest(expandedGuest === guest.id ? null : guest.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <Users className="w-5 h-5 text-[#9DA07E] flex-shrink-0" />
                          <h3 className="text-[#2D2D2D] font-semibold text-lg truncate">
                            {guest.guest}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex-shrink-0 ${
                            guest.status === 'upcoming'
                              ? 'bg-blue-50 text-blue-600'
                              : guest.status === 'completed'
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-green-50 text-green-600'
                          }`}>
                            {guest.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-[#2D2D2D]/60">
                          <span className="font-medium">{guest.checkIn}</span>
                          <span>→</span>
                          <span className="font-medium">{guest.checkOut}</span>
                          <span className="mx-2">•</span>
                          <span className="text-xs px-2 py-1 bg-[#9DA07E]/10 text-[#9DA07E] rounded-full font-medium">
                            {guest.channel}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <div className="text-right">
                          <p className="text-[#9DA07E] font-bold text-xl">
                            ${guest.total.toLocaleString()}
                          </p>
                        </div>
                        {expandedGuest === guest.id ? (
                          <ChevronUp className="w-5 h-5 text-[#9DA07E]" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[#9DA07E]" />
                        )}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedGuest === guest.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-[#9DA07E]/20 bg-white/50"
                      >
                        <div className="p-5 space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-[#9DA07E] font-bold uppercase tracking-widest mb-2">Contact</p>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-[#9DA07E]" />
                                  <a
                                    href={`mailto:${guest.email}`}
                                    className="text-[#2D2D2D] hover:text-[#9DA07E] transition-colors text-sm underline"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {guest.email}
                                  </a>
                                </div>
                                {guest.phone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-[#9DA07E]" />
                                    <a
                                      href={`tel:${guest.phone}`}
                                      className="text-[#2D2D2D] hover:text-[#9DA07E] transition-colors text-sm"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {guest.phone}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-[#9DA07E] font-bold uppercase tracking-widest mb-2">Details</p>
                              <div className="space-y-1 text-sm text-[#2D2D2D]/80">
                                <p><strong>Guests:</strong> {guest.guests}</p>
                                <p><strong>Source:</strong> {guest.source === 'direct' ? 'Direct Website Booking' : 'Airtable Import'}</p>
                              </div>
                            </div>
                          </div>
                          {guest.notes && (
                            <div>
                              <p className="text-xs text-[#9DA07E] font-bold uppercase tracking-widest mb-2">Guest Notes</p>
                              <p className="text-sm text-[#2D2D2D]/80 leading-relaxed bg-[#9DA07E]/5 p-3 rounded-xl">
                                {guest.notes}
                              </p>
                            </div>
                          )}
                          {guest.createdAt && (
                            <div className="flex items-center gap-2 text-xs text-[#2D2D2D]/50">
                              <Clock className="w-3 h-3" />
                              <span>Booked on {new Date(guest.createdAt).toLocaleDateString('en-NZ', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {allGuestsSorted.length === 0 && (
                <div className="text-center py-16">
                  <Users className="w-16 h-16 text-[#9DA07E]/30 mx-auto mb-4" />
                  <p className="text-[#2D2D2D]/60">No bookings yet</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Latest Direct Bookings (1/3 width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white border border-[#9DA07E]/20 rounded-3xl p-6 shadow-sm h-fit"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#9DA07E]/10 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#9DA07E]" />
              </div>
              <div>
                <h2 className="text-xl font-serif text-[#2D2D2D]">Latest Direct Bookings</h2>
                <p className="text-xs text-[#9DA07E] font-medium">Website payments</p>
              </div>
            </div>

            <div className="space-y-3">
              {directBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="border border-[#9DA07E]/20 rounded-2xl p-4 bg-[#fdfcf8] hover:bg-white transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[#2D2D2D] font-semibold truncate mb-1">
                        {booking.guest}
                      </h4>
                      <p className="text-xs text-[#2D2D2D]/60">
                        {booking.checkIn} → {booking.checkOut}
                      </p>
                    </div>
                    <div className="text-right ml-2">
                      <p className="text-[#9DA07E] font-bold">
                        ${booking.total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {booking.createdAt && (
                    <div className="flex items-center gap-2 text-xs text-[#2D2D2D]/50">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(booking.createdAt).toLocaleDateString('en-NZ', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}
                  <div className="mt-2">
                    <a
                      href={`mailto:${booking.email}`}
                      className="text-xs text-[#9DA07E] hover:underline flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3" />
                      {booking.email}
                    </a>
                  </div>
                </motion.div>
              ))}

              {directBookings.length === 0 && (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-[#9DA07E]/30 mx-auto mb-3" />
                  <p className="text-sm text-[#2D2D2D]/60">No direct bookings yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
