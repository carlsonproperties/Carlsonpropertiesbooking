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
  Menu,
  X,
  Loader2,
  ChevronRight,
  User,
  Clock,
  CheckCircle2
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
  createdAt: string;
}

interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  occupancyRate: number;
  avgBookingValue: number;
  upcomingBookings: number;
  allGuests: Guest[];
}

export function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.email || !AUTHORIZED_EMAILS.includes(session.user.email.toLowerCase())) {
        toast.error("Unauthorized Access", { 
          description: "Please sign in to access the dashboard." 
        });
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
      console.log('Fetching dashboard data from backend...');
      const url = `https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/dashboard-stats`;
      console.log('Dashboard URL:', url);
      
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey.trim()}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Dashboard response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Dashboard fetch error response:', errorText);
        throw new Error(`Failed to fetch dashboard data: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      console.log('Dashboard data received:', data);
      
      // Ensure all required fields exist with defaults
      const safeData = {
        allGuests: data.allGuests || [],
        totalBookings: data.totalBookings || 0,
        totalRevenue: data.totalRevenue || 0,
        occupancyRate: data.occupancyRate || 0,
        avgBookingValue: data.avgBookingValue || 0,
        upcomingBookings: data.upcomingBookings || 0,
        ...data
      };
      
      console.log('Processed safe data:', safeData);
      setStats(safeData);
    } catch (error: any) {
      console.error("Dashboard fetch error:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      toast.error("Error Loading Dashboard", { 
        description: error.message || "Failed to load dashboard data. Please check console for details." 
      });
      
      // Set empty stats so the UI still renders
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
    try {
      await supabase.auth.signOut();
      toast.success("Signed Out", { description: "You have been signed out successfully." });
      navigate("/owner-login");
    } catch (error) {
      console.error("Sign out failed:", error);
      toast.error("Sign Out Failed", { description: "An error occurred while signing out." });
    }
  };

  const handleSendScheduledEmails = async () => {
    try {
      toast.info("Processing Emails", { description: "Checking for scheduled emails to send..." });
      
      const url = `https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/process-scheduled-emails`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey.trim()}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process emails');
      }

      if (data.emailsSent > 0) {
        toast.success("Emails Sent!", { 
          description: `Successfully sent ${data.emailsSent} scheduled email(s).` 
        });
      } else {
        toast.info("No Emails Due", { 
          description: "No scheduled emails need to be sent today." 
        });
      }

      console.log('Scheduled email results:', data);
    } catch (error: any) {
      console.error("Send scheduled emails failed:", error);
      toast.error("Email Processing Failed", { 
        description: error.message || "An error occurred while processing emails." 
      });
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#9DA07E] animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm md:text-base">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10">
              <CarlsonLogo />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Owner Portal</h1>
              <p className="text-slate-400 text-xs">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-slate-700/50 overflow-hidden"
            >
              <div className="p-4 space-y-2">
                <button
                  onClick={() => {
                    navigate("/");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
                >
                  <Home className="w-5 h-5" />
                  <span>Back to Website</span>
                </button>
                <button
                  onClick={() => {
                    fetchDashboardData();
                    setMobileMenuOpen(false);
                    toast.success("Refreshed", { description: "Dashboard data updated" });
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
                >
                  <TrendingUp className="w-5 h-5" />
                  <span>Refresh Data</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12">
              <CarlsonLogo />
            </div>
            <div>
              <h1 className="text-white font-bold text-2xl">Owner Dashboard</h1>
              <p className="text-slate-400 text-sm">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors text-sm"
            >
              <Home className="w-4 h-4" />
              <span>Back to Website</span>
            </button>
            <button
              onClick={handleSendScheduledEmails}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors text-sm font-medium"
            >
              <Mail className="w-4 h-4" />
              <span>Send Scheduled Emails</span>
            </button>
            <button
              onClick={fetchDashboardData}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#9DA07E]/10 hover:bg-[#9DA07E]/20 text-[#9DA07E] transition-colors text-sm"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Total Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl md:rounded-3xl p-4 md:p-6"
          >
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500/20 rounded-xl md:rounded-2xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
              </div>
            </div>
            <p className="text-slate-400 text-xs md:text-sm mb-1">Total Revenue</p>
            <p className="text-white text-2xl md:text-3xl font-bold">
              ${stats?.totalRevenue.toLocaleString() || 0}
            </p>
          </motion.div>

          {/* Total Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl md:rounded-3xl p-4 md:p-6"
          >
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-xl md:rounded-2xl flex items-center justify-center">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
              </div>
            </div>
            <p className="text-slate-400 text-xs md:text-sm mb-1">Total Bookings</p>
            <p className="text-white text-2xl md:text-3xl font-bold">
              {stats?.totalBookings || 0}
            </p>
          </motion.div>

          {/* Occupancy Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl md:rounded-3xl p-4 md:p-6"
          >
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500/20 rounded-xl md:rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
              </div>
            </div>
            <p className="text-slate-400 text-xs md:text-sm mb-1">Occupancy Rate</p>
            <p className="text-white text-2xl md:text-3xl font-bold">
              {stats?.occupancyRate ? Number(stats.occupancyRate).toFixed(1) : '0.0'}%
            </p>
          </motion.div>

          {/* Avg Booking Value */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl md:rounded-3xl p-4 md:p-6"
          >
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[#9DA07E]/20 rounded-xl md:rounded-2xl flex items-center justify-center">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-[#9DA07E]" />
              </div>
            </div>
            <p className="text-slate-400 text-xs md:text-sm mb-1">Avg Booking</p>
            <p className="text-white text-2xl md:text-3xl font-bold">
              ${stats?.avgBookingValue ? Number(stats.avgBookingValue).toFixed(0) : '0'}
            </p>
          </motion.div>
        </div>

        {/* Guest Directory */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8"
        >
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Guest Directory</h2>
              <p className="text-slate-400 text-xs md:text-sm">All bookings and reservations</p>
            </div>
            <div className="bg-[#9DA07E]/10 px-3 py-1.5 md:px-4 md:py-2 rounded-full">
              <span className="text-[#9DA07E] font-bold text-sm md:text-base">
                {stats?.allGuests?.length || 0} Total
              </span>
            </div>
          </div>

          {/* Guest Cards - Mobile Optimized */}
          <div className="space-y-3 md:space-y-4">
            {stats?.allGuests && stats.allGuests.length > 0 ? (
              stats.allGuests.map((guest, index) => (
                <motion.div
                  key={guest.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="bg-slate-900/50 border border-slate-700/30 rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-[#9DA07E]/30 transition-all cursor-pointer"
                  onClick={() => setSelectedGuest(selectedGuest?.id === guest.id ? null : guest)}
                >
                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 md:w-5 md:h-5 text-[#9DA07E] flex-shrink-0" />
                        <h3 className="text-white font-bold text-base md:text-lg truncate">
                          {guest.guest}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
                        <span className="bg-slate-800 px-2 py-1 rounded-lg text-slate-400">
                          {guest.checkIn}
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-600 hidden sm:block" />
                        <span className="bg-slate-800 px-2 py-1 rounded-lg text-slate-400">
                          {guest.checkOut}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-2">
                      <p className="text-emerald-400 font-bold text-lg md:text-xl">
                        ${guest.total.toLocaleString()}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium mt-1 ${
                        guest.status === 'confirmed' 
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {guest.status}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {selectedGuest?.id === guest.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-slate-700/30 pt-4 mt-4 space-y-3"
                      >
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          <a href={`mailto:${guest.email}`} className="text-slate-300 hover:text-[#9DA07E] transition-colors break-all">
                            {guest.email}
                          </a>
                        </div>
                        {guest.phone && (
                          <div className="flex items-center gap-3 text-sm">
                            <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                            <a href={`tel:${guest.phone}`} className="text-slate-300 hover:text-[#9DA07E] transition-colors">
                              {guest.phone}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-sm">
                          <Users className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          <span className="text-slate-300">{guest.guests} Guest{guest.guests > 1 ? 's' : ''}</span>
                        </div>
                        {guest.notes && (
                          <div className="bg-slate-800/50 rounded-xl p-3 mt-3">
                            <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-medium">Guest Notes</p>
                            <p className="text-slate-300 text-sm leading-relaxed">{guest.notes}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-3">
                          <Clock className="w-3 h-3" />
                          <span>Booked on {new Date(guest.createdAt).toLocaleDateString('en-NZ')}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 md:py-16">
                <Users className="w-12 h-12 md:w-16 md:h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-sm md:text-base">No bookings yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}