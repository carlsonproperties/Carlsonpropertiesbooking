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
  ChevronDown,
  User,
  Clock,
  Search,
  Filter
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
  stripeSessionId?: string;
}

interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  occupancyRate: number;
  avgBookingValue: number;
  upcomingBookings: number;
  allGuests: Guest[];
  yearlyEarnings: any;
  yearlyStats: any;
  yearlyOccupancy: any;
}

export function DashboardWithGraphs() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

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
      const url = `https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/dashboard-stats`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey.trim()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch dashboard data: ${res.status}`);
      }

      const data = await res.json();

      const safeData = {
        allGuests: data.allGuests || [],
        totalBookings: data.totalBookings || 0,
        totalRevenue: data.totalRevenue || 0,
        occupancyRate: data.occupancyRate || 0,
        avgBookingValue: data.avgBookingValue || 0,
        upcomingBookings: data.upcomingBookings || 0,
        yearlyEarnings: data.yearlyEarnings || {},
        yearlyStats: data.yearlyStats || {},
        yearlyOccupancy: data.yearlyOccupancy || {},
        ...data
      };

      setStats(safeData);
    } catch (error: any) {
      console.error("Dashboard fetch error:", error);
      toast.error("Error Loading Dashboard", {
        description: error.message
      });

      setStats({
        allGuests: [],
        totalBookings: 0,
        totalRevenue: 0,
        occupancyRate: 0,
        avgBookingValue: 0,
        upcomingBookings: 0,
        yearlyEarnings: {},
        yearlyStats: {},
        yearlyOccupancy: {}
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

  const availableYears = stats?.yearlyEarnings ? Object.keys(stats.yearlyEarnings).sort().reverse() : [];
  const currentYearData = stats?.yearlyEarnings?.[selectedYear] || [];

  // Filter guests
  const filteredGuests = stats?.allGuests?.filter(guest => {
    const matchesSearch = guest.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guest.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || guest.status === filterStatus;
    return matchesSearch && matchesFilter;
  }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#9DA07E] animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12">
                <CarlsonLogo />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg md:text-2xl">Owner Dashboard</h1>
                <p className="text-slate-400 text-xs md:text-sm hidden md:block">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => navigate("/")}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors text-sm"
              >
                <Home className="w-4 h-4" />
                <span>Website</span>
              </button>
              <button
                onClick={fetchDashboardData}
                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-[#9DA07E]/10 hover:bg-[#9DA07E]/20 text-[#9DA07E] transition-colors text-sm"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="hidden md:inline">Refresh</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 md:p-6"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500/20 rounded-xl mb-3 md:mb-4 flex items-center justify-center">
              <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
            </div>
            <p className="text-slate-400 text-xs md:text-sm mb-1">Total Revenue</p>
            <p className="text-white text-xl md:text-3xl font-bold">
              ${stats?.totalRevenue.toLocaleString() || 0}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 md:p-6"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-xl mb-3 md:mb-4 flex items-center justify-center">
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
            </div>
            <p className="text-slate-400 text-xs md:text-sm mb-1">Total Bookings</p>
            <p className="text-white text-xl md:text-3xl font-bold">
              {stats?.totalBookings || 0}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 md:p-6"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500/20 rounded-xl mb-3 md:mb-4 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
            </div>
            <p className="text-slate-400 text-xs md:text-sm mb-1">Occupancy Rate</p>
            <p className="text-white text-xl md:text-3xl font-bold">
              {stats?.occupancyRate ? Number(stats.occupancyRate).toFixed(1) : '0.0'}%
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 md:p-6"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#9DA07E]/20 rounded-xl mb-3 md:mb-4 flex items-center justify-center">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-[#9DA07E]" />
            </div>
            <p className="text-slate-400 text-xs md:text-sm mb-1">Avg Booking</p>
            <p className="text-white text-xl md:text-3xl font-bold">
              ${stats?.avgBookingValue ? Number(stats.avgBookingValue).toFixed(0) : '0'}
            </p>
          </motion.div>
        </div>

        {/* Year Selector and Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 md:p-8 mb-6 md:mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Revenue by Month</h2>
              <p className="text-slate-400 text-sm">Monthly earnings breakdown</p>
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#9DA07E]"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentYearData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '12px'
                }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Legend />
              <Bar dataKey="earnings" fill="#10b981" name="Revenue" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* Year Summary */}
          {stats?.yearlyStats?.[selectedYear] && (
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700/30">
              <div className="text-center">
                <p className="text-slate-400 text-xs mb-1">Total Revenue</p>
                <p className="text-white text-xl font-bold">
                  ${stats.yearlyStats[selectedYear].totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 text-xs mb-1">Total Nights</p>
                <p className="text-white text-xl font-bold">
                  {stats.yearlyStats[selectedYear].totalNights}
                </p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 text-xs mb-1">Bookings</p>
                <p className="text-white text-xl font-bold">
                  {stats.yearlyStats[selectedYear].totalBookings}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* All Bookings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">All Bookings</h2>
              <p className="text-slate-400 text-sm">{filteredGuests.length} booking{filteredGuests.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search guests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#9DA07E]"
                />
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/30">
                  <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider pb-3">Guest</th>
                  <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider pb-3">Email</th>
                  <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider pb-3">Phone</th>
                  <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider pb-3">Check-In</th>
                  <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider pb-3">Check-Out</th>
                  <th className="text-right text-slate-400 text-xs font-medium uppercase tracking-wider pb-3">Total</th>
                  <th className="text-center text-slate-400 text-xs font-medium uppercase tracking-wider pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.map((guest, index) => (
                  <tr key={guest.id} className="border-b border-slate-700/20 hover:bg-slate-700/20 transition-colors">
                    <td className="py-4">
                      <div>
                        <p className="text-white font-medium">{guest.guest}</p>
                        {guest.notes && (
                          <p className="text-slate-500 text-xs mt-1 line-clamp-1">{guest.notes}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4">
                      <a href={`mailto:${guest.email}`} className="text-slate-300 hover:text-[#9DA07E] text-sm">
                        {guest.email}
                      </a>
                    </td>
                    <td className="py-4">
                      <a href={`tel:${guest.phone}`} className="text-slate-300 hover:text-[#9DA07E] text-sm">
                        {guest.phone || '-'}
                      </a>
                    </td>
                    <td className="py-4 text-slate-300 text-sm">{guest.checkIn}</td>
                    <td className="py-4 text-slate-300 text-sm">{guest.checkOut}</td>
                    <td className="py-4 text-right">
                      <span className="text-emerald-400 font-bold">${guest.total.toLocaleString()}</span>
                    </td>
                    <td className="py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${
                        guest.status === 'upcoming'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-slate-700/30 text-slate-400'
                      }`}>
                        {guest.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {filteredGuests.map((guest) => (
              <div key={guest.id} className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-base mb-1">{guest.guest}</p>
                    <p className="text-slate-400 text-sm mb-2">{guest.checkIn} → {guest.checkOut}</p>
                  </div>
                  <span className="text-emerald-400 font-bold text-lg ml-2">${guest.total.toLocaleString()}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <a href={`mailto:${guest.email}`} className="text-slate-300 hover:text-[#9DA07E] truncate">
                      {guest.email}
                    </a>
                  </div>
                  {guest.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <a href={`tel:${guest.phone}`} className="text-slate-300 hover:text-[#9DA07E]">
                        {guest.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredGuests.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No bookings found</p>
            </div>
          )}
        </motion.div>

        {/* Email Notification Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6"
        >
          <div className="flex items-start gap-3">
            <Mail className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-blue-400 font-bold mb-2">📧 Automatic Email Notifications</p>
              <p className="text-sm text-slate-300 leading-relaxed">
                Every new booking automatically sends a notification email to <strong>bookings@carlsonproperties.co.nz</strong> with all guest details, payment amount, and booking dates.
                Guest confirmation emails are also sent automatically.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
