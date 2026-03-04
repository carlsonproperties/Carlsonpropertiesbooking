import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { 
  DollarSign, Users, Calendar, TrendingUp, ChevronRight, Star,
  Download,
  RefreshCw,
  Filter, ArrowUpRight, LayoutGrid, List, Bell,
  Search, Settings, LogOut, MoreVertical, CreditCard, ExternalLink, MessageSquare,
  Phone, Mail, ArrowDownRight, PieChart as PieIcon, Wallet, ShieldAlert, Loader2,
  ClipboardCheck, Copy, FileText, Check, Info, Menu, X
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router";
import { supabase } from "../lib/supabase";
import { CarlsonLogo } from "../components/CarlsonLogo";

const AUTHORIZED_EMAILS = ["grantashl1@gmail.com", "donki.bmbr@gmail.com"];

export function Dashboard() {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState<'1Y'>('1Y');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showChannelBreakdown, setShowChannelBreakdown] = useState(false);
  const [occupancyYear, setOccupancyYear] = useState(new Date().getFullYear());
  const [isManaging, setIsManaging] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'overview', icon: LayoutGrid, label: 'Overview' },
    { id: 'bookings', icon: Users, label: 'Guest Directory' },
    { id: 'finance', icon: CreditCard, label: 'Financials' },
    { id: 'templates', icon: FileText, label: 'Email Templates' },
  ];

  const handleAction = async (action: 'confirm' | 'delete', bookingId: string) => {
    if (action === 'delete' && !confirm("Are you sure you want to delete this booking? This will reopen the dates on the website calendar immediately.")) {
      return;
    }

    setIsManaging(true);
    try {
      const endpoint = action === 'confirm' ? 'update-booking' : 'delete-booking';
      const payload = action === 'confirm' 
        ? { bookingId, updates: { status: 'confirmed' } }
        : { bookingId };

      const res = await fetch(`https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/${endpoint}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${publicAnonKey.trim()}`,
          'x-user-token': session.access_token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to perform action");
      
      toast.success(action === 'confirm' ? "Booking Confirmed" : "Booking Deleted");
      setSelectedGuest(null);
      // Refresh stats
      window.location.reload(); 
    } catch (err) {
      toast.error("Error", { description: "Failed to update booking. Please try again." });
    } finally {
      setIsManaging(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/owner-login");
        return;
      }

      if (!AUTHORIZED_EMAILS.includes(session.user.email?.toLowerCase() || "")) {
        await supabase.auth.signOut();
        navigate("/owner-login");
        toast.error("Unauthorized Access", { description: "Your email is not on the authorized list." });
        return;
      }

      setSession(session);
      setAuthLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/owner-login");
      } else if (AUTHORIZED_EMAILS.includes(session.user.email?.toLowerCase() || "")) {
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/owner-login");
    toast.success("Signed out successfully");
  };

  useEffect(() => {
    if (authLoading || !session) return;

    async function fetchStats() {
      try {
        const { data: { session: freshSession } } = await supabase.auth.getSession();
        const tokenToUse = freshSession?.access_token || session.access_token;

        const res = await fetch(`https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/dashboard-stats`, {
          headers: { 
            'Authorization': `Bearer ${publicAnonKey.trim()}`,
            'x-user-token': tokenToUse,
            'Content-Type': 'application/json'
          }
        });
        
        if (!res.ok) {
          let errorMsg = `Server returned ${res.status}`;
          try {
            const errorData = await res.json();
            errorMsg = errorData.error || errorMsg;
          } catch (e) { }
          setStats({ error: errorMsg });
          return;
        }

        const data = await res.json();
        if (data.error) {
          setStats({ error: data.error });
          return;
        }
        
        setStats(data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setStats({ error: "Connection Error: The management server is temporarily unavailable." });
      }
    }
    fetchStats();
  }, [authLoading, session]);

  if (authLoading || !stats || (stats && stats.error)) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0a]">
      <div className="text-center px-6">
        {stats?.error ? (
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-8 mx-auto">
              <ShieldAlert size={32} />
            </div>
            <h2 className="text-white font-serif text-2xl mb-4">Dashboard Access Issue</h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              {stats.error}
            </p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-[#9DA07E] text-black font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white transition-all"
              >
                Retry Connection
              </button>
              <button 
                onClick={handleSignOut}
                className="text-slate-500 text-[10px] uppercase tracking-widest hover:text-white transition-all"
              >
                Sign Out and Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-16 h-16 border-2 border-[#9DA07E] rounded-full border-t-transparent mb-8 mx-auto"
            />
            <h2 className="text-white font-serif text-2xl mb-2">
              {authLoading ? "Authenticating Session..." : "Syncing Airtable Records..."}
            </h2>
            <p className="text-slate-500 text-sm tracking-widest uppercase max-w-md mx-auto font-light">
              {authLoading ? "Verifying authorized owner access" : "Aggregating performance metrics for 111 Jarden Mile"}
            </p>
          </>
        )}
      </div>
    </div>
  );

  const availableYears = stats.yearlyStats ? Object.keys(stats.yearlyStats).map(Number).sort((a, b) => b - a) : [2024, 2025, 2026];
  const currentYear = new Date().getFullYear();
  const totalGrossRevenue = stats.totalRevenue || 0;
  const totalFees = stats.totalFees || 0;
  const totalTotalExpenses = stats.totalExpenses || 0;
  const totalNetOperatingIncome = totalGrossRevenue - totalTotalExpenses;

  const renderContent = () => {
    switch(activeTab) {
      case 'finance':
        return (
          <div className="space-y-10 text-left">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-serif text-white mb-2">Financial Analysis</h2>
                <p className="text-slate-500 text-sm tracking-widest uppercase font-light">Performance Analysis • Gross vs Net Operating Income</p>
              </div>
              <div className="flex gap-4">
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-white/5 border border-white/10 text-white text-xs rounded-lg px-4 py-2 outline-none cursor-pointer"
                >
                  {availableYears.map(year => (
                    <option key={year} value={year} className="bg-[#111]">{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/5 p-8 rounded-[32px] border border-white/10">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Lifetime Gross</p>
                <h3 className="text-3xl font-serif text-white">${Math.round(totalGrossRevenue).toLocaleString()}</h3>
                <div className="mt-4 flex items-center gap-1 text-[10px] text-green-400 font-bold uppercase">
                  <ArrowUpRight size={12} /> Total Volume
                </div>
              </div>
              <div className="bg-white/5 p-8 rounded-[32px] border border-white/10">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Est. Fees (15%)</p>
                <h3 className="text-3xl font-serif text-red-400/80">-${Math.round(totalFees).toLocaleString()}</h3>
                <div className="mt-4 text-[10px] text-slate-600 font-bold uppercase tracking-widest">Platform Fees</div>
              </div>
              <div className="bg-white/5 p-8 rounded-[32px] border border-white/10">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Expenses</p>
                <h3 className="text-3xl font-serif text-red-400">-${Math.round(totalTotalExpenses).toLocaleString()}</h3>
                <div className="mt-4 text-[10px] text-slate-600 font-bold uppercase tracking-widest">Airtable Data</div>
              </div>
              <div className="bg-gradient-to-br from-[#9DA07E]/20 to-transparent p-8 rounded-[32px] border border-[#9DA07E]/30">
                <p className="text-[#9DA07E] text-[10px] font-black uppercase tracking-widest mb-1">Net Op. Income</p>
                <h3 className="text-3xl font-serif text-white">${Math.round(totalNetOperatingIncome - totalFees).toLocaleString()}</h3>
                <div className="mt-4 text-[10px] text-[#9DA07E] font-bold uppercase tracking-widest">Final Profit</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                <div className="bg-white/5 p-10 rounded-[40px] border border-white/5">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xl font-serif text-white">Monthly Comparison ({selectedYear})</h3>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                      <div className="flex items-center gap-1.5 text-[#9DA07E]">
                        <div className="w-2 h-2 rounded-full bg-[#9DA07E]" /> Income
                      </div>
                      <div className="flex items-center gap-1.5 text-red-400">
                        <div className="w-2 h-2 rounded-full bg-red-400" /> Expenses
                      </div>
                    </div>
                  </div>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.yearlyEarnings?.[selectedYear] || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#111', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}
                          cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                        />
                        <Bar dataKey="earnings" name="Revenue" fill="#9DA07E" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expenses" name="Expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 p-8 rounded-[32px] border border-white/5">
                  <h4 className="text-white font-serif text-lg mb-6">Yearly Statistics</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white/2 rounded-2xl">
                      <span className="text-xs text-slate-500 font-medium">Bookings</span>
                      <span className="text-sm font-bold text-white">{stats.yearlyStats?.[selectedYear]?.totalBookings || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/2 rounded-2xl">
                      <span className="text-xs text-slate-500 font-medium">Nights Sold</span>
                      <span className="text-sm font-bold text-white">{stats.yearlyStats?.[selectedYear]?.totalNights || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/2 rounded-2xl border border-[#9DA07E]/20 bg-[#9DA07E]/5">
                      <span className="text-xs text-[#9DA07E] font-black uppercase tracking-widest">Occupancy Rate</span>
                      <span className="text-sm font-bold text-white">{stats.yearlyOccupancy?.[selectedYear] || "0%"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'bookings':
        const filteredGuests = (stats.allGuests || []).filter((g: any) => 
          g.guest.toLowerCase().includes(searchQuery.toLowerCase()) || 
          g.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
          <div className="space-y-8 text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                <h2 className="text-3xl font-serif text-white mb-2">Guest Directory</h2>
                <p className="text-slate-500 text-sm tracking-widest uppercase font-light">Contact Management • {stats.totalBookings} Total Stays</p>
              </div>
              <div className="flex flex-wrap gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search guests or emails..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none focus:border-[#9DA07E]/50 transition-all"
                  />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-[#9DA07E] text-black font-black rounded-xl text-xs uppercase tracking-widest transition-all">
                  <Download size={14} /> Export
                </button>
              </div>
            </div>

            <div className="bg-white/5 rounded-[40px] border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/2">
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Guest</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Dates</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Email</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Door Code</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGuests.map((guest: any, idx: number) => (
                      <tr 
                        key={guest.id} 
                        onClick={() => setSelectedGuest(guest)}
                        className="border-b border-white/5 hover:bg-white/5 transition-all group cursor-pointer"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9DA07E] to-[#7A7D5E] flex items-center justify-center text-black font-black text-xs">
                              {guest.guest?.[0]}
                            </div>
                            <span className="text-white font-bold text-sm block">{guest.guest}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            guest.status === 'pending_payment' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                            guest.status === 'confirmed' || guest.status === 'upcoming' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                            'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                          }`}>
                            {guest.status?.replace('_', ' ') || 'Completed'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-slate-300 text-sm">{guest.checkIn}</td>
                        <td className="px-8 py-6 text-slate-300 text-sm lowercase">{guest.email || '—'}</td>
                        <td className="px-8 py-6">
                          {guest.doorCode && guest.doorCode !== 'null' ? (
                            <span className="px-3 py-1 bg-[#9DA07E]/10 border border-[#9DA07E]/20 rounded-lg text-sm font-mono text-[#9DA07E] font-bold">
                              {guest.doorCode}
                            </span>
                          ) : <span className="text-slate-600">—</span>}
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{guest.channel || 'Direct'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <AnimatePresence>
              {selectedGuest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-[#111] border border-white/10 w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl"
                  >
                    <div className="p-10">
                      <div className="flex justify-between items-start mb-10">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-[#9DA07E] flex items-center justify-center text-black font-black text-xl">
                            {selectedGuest.guest?.[0]}
                          </div>
                          <div>
                            <h3 className="text-2xl font-serif text-white">{selectedGuest.guest}</h3>
                            <p className="text-[#9DA07E] text-[10px] uppercase font-black tracking-widest">#{selectedGuest.id.slice(0,8).toUpperCase()}</p>
                          </div>
                        </div>
                        <button onClick={() => setSelectedGuest(null)} className="text-slate-500 hover:text-white">
                          <Settings size={20} />
                        </button>
                      </div>

                      <div className="space-y-6 mb-10">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 p-4 rounded-2xl">
                            <p className="text-slate-500 text-[8px] uppercase font-black tracking-widest mb-1">Check In</p>
                            <p className="text-white text-sm font-bold">{selectedGuest.checkIn}</p>
                          </div>
                          <div className="bg-white/5 p-4 rounded-2xl">
                            <p className="text-slate-500 text-[8px] uppercase font-black tracking-widest mb-1">Check Out</p>
                            <p className="text-white text-sm font-bold">{selectedGuest.checkOut}</p>
                          </div>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl space-y-4">
                           <div className="flex items-center gap-3 text-slate-300 text-sm">
                             <Mail size={16} className="text-[#9DA07E]" /> {selectedGuest.email || 'No email provided'}
                           </div>
                           <div className="flex items-center gap-3 text-slate-300 text-sm">
                             <Phone size={16} className="text-[#9DA07E]" /> {selectedGuest.phone || 'No phone provided'}
                           </div>
                        </div>
                        {selectedGuest.notes && (
                          <div className="bg-white/5 p-6 rounded-2xl">
                            <p className="text-slate-500 text-[8px] uppercase font-black tracking-widest mb-2 flex items-center gap-2">
                              <MessageSquare size={12} /> Notes
                            </p>
                            <p className="text-slate-300 text-sm italic">"{selectedGuest.notes}"</p>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {selectedGuest.status === 'pending_payment' && (
                          <button 
                            disabled={isManaging}
                            onClick={() => handleAction('confirm', selectedGuest.id)}
                            className="w-full py-4 bg-[#9DA07E] text-black font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50"
                          >
                            {isManaging ? "Updating..." : "Confirm Payment"}
                          </button>
                        )}
                        <button 
                          disabled={isManaging}
                          onClick={() => handleAction('delete', selectedGuest.id)}
                          className={`py-4 font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 ${
                            selectedGuest.status === 'pending_payment' 
                              ? "bg-white/5 text-red-400 hover:bg-red-400/10" 
                              : "col-span-2 bg-red-400/10 text-red-400 hover:bg-red-400 hover:text-white"
                          }`}
                        >
                          {isManaging ? "Removing..." : "Delete Booking"}
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-600 text-center mt-6 uppercase tracking-widest">
                        Deleting will immediately reopen {selectedGuest.checkIn} to {selectedGuest.checkOut}
                      </p>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        );
      case 'templates':
        const templates = [
          {
            title: "Bank Transfer Request",
            trigger: "Sent immediately when guest selects Manual Payment",
            subject: "Action Required: Secure your stay at One Eleven 🌿",
            accent: "Payment Required",
            headline: "Secure your stay<br/><span style='font-style: italic;'>at One Eleven.</span>",
            body: `We've received your booking request for [Dates]. To confirm your reservation, please transfer the total amount via bank transfer within 24 hours.`,
            details: [
              { label: "Account Name", value: "CARLSON & CO LTD." },
              { label: "Account Number", value: "06-0429-0411603-00" },
              { label: "Reference", value: "[Booking Reference]" },
              { label: "Total Amount", value: "NZD $[Total Amount]" }
            ],
            footer: "Your dates are being held for 24 hours. Please email a screenshot of your receipt to bookings@carlsonproperties.co.nz.",
            buttonText: "View My Booking"
          },
          {
            title: "Booking Confirmation",
            trigger: "Sent immediately after you click 'Confirm Payment'",
            subject: "Your stay at One Eleven is confirmed! 🌿",
            accent: "Reservation Confirmed",
            headline: "See you at<br/><span style='font-style: italic;'>One Eleven.</span>",
            body: `Thank you for choosing us, we look forward to hosting you. Your sanctuary in Taupō is secured for [Dates]. Three days before your check-in you will receive another email with your door code and arrival details.`,
            footer: "In the meantime, feel free to explore our digital guidebook for local recommendations.",
            buttonText: "Digital Guidebook"
          },
          {
            title: "Arrival Details",
            trigger: "Scheduled for 9:00 AM, 3 days before check-in",
            subject: "Everything you need for your stay at One Eleven 🔑",
            accent: "Ready for your arrival?",
            headline: "Your stay begins<br/><span style='font-style: italic;'>in 3 days.</span>",
            body: `Your stay at One Eleven is just around the corner. Here is your essential check-in information for your arrival.`,
            isArrival: true,
            details: [
              { label: "Door Code", value: "[Last 4 Digits of Phone]#" },
              { label: "Wi-Fi", value: "Carlson & Co. Guest" },
              { label: "Password", value: "Gue$t111." }
            ],
            footer: "The code activates at 3pm on [Check in Date] and expires at 10am on [Check out Date].",
            buttonText: "View Arrival Guide"
          },
          {
            title: "Departure Instructions",
            trigger: "Scheduled for 9:00 AM on day of check-out",
            subject: "Good morning from One Eleven 🌿",
            accent: "Safe Travels",
            headline: "Thank you for<br/><span style='font-style: italic;'>staying with us.</span>",
            body: `We hope you’ve had a wonderful stay. As your visit comes to an end, please help us with a quicker turnover by starting the dishwasher and taking rubbish to the wheelie bin.`,
            footer: "Checkout is at 10:00 AM. We hope to see you again soon.",
            buttonText: "Digital Guidebook"
          },
          {
            title: "Post-Stay Review",
            trigger: "Scheduled for 9:00 AM, 1 day after check-out",
            subject: "We'd love to hear about your stay at One Eleven 🌿",
            accent: "Welcome Home",
            headline: "How was your<br/><span style='font-style: italic;'>stay?</span>",
            body: `Small local businesses like ours rely heavily on word-of-mouth. If you enjoyed your stay, it would mean the world to us if you could leave a brief review on Google.`,
            footer: "Thank you again for choosing One Eleven | On the Mile.",
            buttonText: "Leave a Review"
          }
        ];

        return (
          <div className="space-y-10 text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <h2 className="text-3xl font-serif text-white mb-2">Email Templates</h2>
                <p className="text-slate-500 text-sm tracking-widest uppercase font-light">Automated Guest Communication • Brand Aesthetic</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl flex items-center gap-3">
                <Info size={14} className="text-amber-500" />
                <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Select and copy preview for rich-text paste</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-12">
              {templates.map((tpl, i) => (
                <div key={i} className="bg-white/5 rounded-[40px] border border-white/5 overflow-hidden flex flex-col xl:flex-row">
                  <div className="p-8 xl:w-80 bg-white/2 border-r border-white/5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-white font-serif text-xl mb-2">{tpl.title}</h3>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#9DA07E]/10 border border-[#9DA07E]/20 rounded-full mb-6">
                        <Bell size={10} className="text-[#9DA07E]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#9DA07E]">Trigger</span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed mb-8">{tpl.trigger}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Subject</p>
                        <p className="text-xs text-white font-medium">{tpl.subject}</p>
                      </div>
                      <button 
                        onClick={() => {
                          const content = document.getElementById(`template-preview-${i}`);
                          if (content) {
                            const range = document.createRange();
                            range.selectNode(content);
                            window.getSelection()?.removeAllRanges();
                            window.getSelection()?.addRange(range);
                            try {
                              document.execCommand('copy');
                              toast.success("Rich Text Copied", { description: "You can now paste this directly into your email client." });
                            } catch (e) {
                              toast.error("Copy Failed", { description: "Please manually select and copy the preview." });
                            }
                            window.getSelection()?.removeAllRanges();
                          }
                        }}
                        className="w-full py-4 flex items-center justify-center gap-3 bg-[#9DA07E] hover:bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        <Copy size={14} /> Copy Rich Text
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-10 xl:p-16 flex-1 bg-black/30 flex justify-center overflow-auto">
                    {/* Rendered Email Preview */}
                    <div 
                      id={`template-preview-${i}`}
                      className="w-full max-w-[500px] bg-[#FDFCF8] text-[#2D2D2D] p-10 md:p-16 rounded-[40px] text-center border border-white/10"
                      style={{ fontFamily: "'Times New Roman', serif" }}
                    >
                      <div style={{ width: '1px', height: '60px', backgroundColor: '#9DA07E', margin: '0 auto 40px', opacity: 0.3 }}></div>
                      
                      <span style={{ color: '#9DA07E', fontFamily: 'sans-serif', fontSize: '10px', fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '20px', display: 'block' }}>
                        {tpl.accent}
                      </span>
                      
                      <h1 style={{ fontSize: '42px', color: '#1A1A1A', margin: '0 0 30px 0', lineHeight: 1.1, fontWeight: 'normal' }} dangerouslySetInnerHTML={{ __html: tpl.headline }}>
                      </h1>

                      <p style={{ fontFamily: 'sans-serif', fontSize: '15px', lineHeight: 1.6, color: '#666', marginBottom: '40px', fontWeight: 300 }}>
                        {tpl.body}
                      </p>

                      {tpl.details && (
                        <div style={{ background: tpl.isArrival ? '#1A1A1A' : '#F8F8F6', color: tpl.isArrival ? 'white' : '#2D2D2D', padding: '30px', borderRadius: '24px', margin: '40px 0', textAlign: tpl.isArrival ? 'center' : 'left', border: tpl.isArrival ? 'none' : '1px solid #F1F1EE' }}>
                          {tpl.details.map((d, di) => (
                            <div key={di} style={{ marginBottom: di === tpl.details!.length - 1 ? 0 : '15px' }}>
                              <span style={{ display: 'block', fontFamily: 'sans-serif', fontSize: '9px', fontWeight: 900, letterSpacing: '0.2em', color: tpl.isArrival ? 'rgba(255,255,255,0.6)' : '#AFAFAF', textTransform: 'uppercase', marginBottom: '5px' }}>{d.label}</span>
                              <span style={{ fontSize: tpl.isArrival ? '24px' : '16px', color: tpl.isArrival ? 'white' : '#1A1A1A', fontWeight: 'bold', fontFamily: tpl.isArrival ? 'sans-serif' : 'serif' }}>{d.value}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'inline-block', background: '#1A1A1A', color: 'white', padding: '18px 36px', borderRadius: '14px', textDecoration: 'none', fontFamily: 'sans-serif', fontSize: '10px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                          {tpl.buttonText}
                        </div>
                      </div>

                      <p style={{ fontFamily: 'sans-serif', fontSize: '11px', lineHeight: 1.6, color: '#999', fontStyle: 'italic' }}>
                        {tpl.footer}
                      </p>
                      
                      <div style={{ marginTop: '60px', borderTop: '1px solid #F1F1EE', paddingTop: '40px' }}>
                        <p style={{ fontFamily: 'sans-serif', fontSize: '9px', fontWeight: 900, letterSpacing: '0.2em', color: '#AFAFAF', textTransform: 'uppercase' }}>
                          111 Jarden Mile, Taupō, NZ
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default: // overview
        return (
          <div className="space-y-10 text-left">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/5 p-8 rounded-[32px] border border-white/5">
                <div className="flex items-center gap-3 text-[#9DA07E] mb-4">
                  <DollarSign size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Revenue</span>
                </div>
                <h3 className="text-4xl font-serif text-white mb-2">${Math.round(totalGrossRevenue).toLocaleString()}</h3>
                <p className="text-slate-500 text-xs tracking-widest uppercase font-light">Gross Platform Volume</p>
              </div>
              <div className="bg-white/5 p-8 rounded-[32px] border border-white/5">
                <div className="flex items-center gap-3 text-[#9DA07E] mb-4">
                  <Users size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Guests</span>
                </div>
                <h3 className="text-4xl font-serif text-white mb-2">{stats.totalBookings}</h3>
                <p className="text-slate-500 text-xs tracking-widest uppercase font-light">Total Reservations</p>
              </div>
              <div className="bg-white/5 p-8 rounded-[32px] border border-white/5">
                <div className="flex items-center gap-3 text-[#9DA07E] mb-4">
                  <TrendingUp size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Occupancy</span>
                </div>
                <h3 className="text-4xl font-serif text-white mb-2">{stats.occupancyRate}</h3>
                <p className="text-slate-500 text-xs tracking-widest uppercase font-light">Current Year Rate</p>
              </div>
              <div className="bg-white/5 p-8 rounded-[32px] border border-white/5">
                <div className="flex items-center gap-3 text-red-400 mb-4">
                  <Wallet size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Expenses</span>
                </div>
                <h3 className="text-4xl font-serif text-white mb-2">${Math.round(totalTotalExpenses).toLocaleString()}</h3>
                <p className="text-slate-500 text-xs tracking-widest uppercase font-light">Airtable Tracking</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8">
                <div className="bg-white/5 p-10 rounded-[40px] border border-white/5">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xl font-serif text-white">Performance Trend</h3>
                    <div className="flex gap-4">
                      {availableYears.map(year => (
                        <button 
                          key={year}
                          onClick={() => setSelectedYear(year)}
                          className={`text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-lg transition-all ${selectedYear === year ? "bg-[#9DA07E] text-black" : "text-slate-500 hover:text-white"}`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.yearlyEarnings?.[selectedYear] || []}>
                        <defs>
                          <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#9DA07E" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#9DA07E" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#111', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                        <Area type="monotone" dataKey="earnings" stroke="#9DA07E" fillOpacity={1} fill="url(#colorEarnings)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="bg-white/5 p-8 rounded-[40px] border border-white/5 h-full">
                  <h3 className="text-xl font-serif text-white mb-8">Recent Activity</h3>
                  <div className="space-y-6">
                    {(stats.recentGuests || []).slice(0, 6).map((guest: any, i: number) => (
                      <div key={guest.id} className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#9DA07E] font-black text-xs uppercase tracking-widest group-hover:bg-[#9DA07E] group-hover:text-black transition-all">
                          {guest.guest?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-bold truncate">{guest.guest}</p>
                          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-light">{guest.checkIn}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white text-sm font-serif">${Math.round(guest.total).toLocaleString()}</p>
                          <p className="text-[#9DA07E] text-[8px] uppercase font-black tracking-widest">{guest.channel}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setActiveTab('bookings')}
                    className="w-full mt-10 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    View All Directory
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#9DA07E] selection:text-black">
      {/* Mobile Navigation Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="font-serif text-lg tracking-tighter text-white uppercase">One Eleven</span>
          <span className="text-[8px] tracking-[0.4em] font-black text-[#9DA07E] -mt-1 uppercase">Management</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white"
        >
          {isMobileMenuOpen ? <Settings size={20} /> : <List size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed inset-0 z-40 bg-black pt-24 px-6 pb-10 overflow-y-auto"
          >
            <nav className="space-y-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-6 px-8 py-6 rounded-3xl text-sm font-black uppercase tracking-[0.2em] transition-all ${activeTab === item.id ? "bg-[#9DA07E] text-black" : "bg-white/5 text-slate-400"}`}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
              <div className="pt-8 border-t border-white/10">
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-6 px-8 py-6 rounded-3xl text-sm font-black uppercase tracking-[0.2em] text-red-400 bg-red-400/5 transition-all"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex">
        <aside className="hidden lg:flex w-80 bg-black border-r border-white/5 h-screen sticky top-0 flex-col p-8">
          <div className="mb-16">
            <Link to="/">
              <CarlsonLogo />
            </Link>
          </div>

          <nav className="flex-1 space-y-2 text-left">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === item.id ? "bg-[#9DA07E] text-black shadow-xl shadow-[#9DA07E]/20" : "text-slate-500 hover:text-white hover:bg-white/5"}`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-8 border-t border-white/5 text-left">
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-red-400 hover:bg-red-400/5 transition-all"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </aside>

        <main className="flex-1 min-h-screen p-6 md:p-16 pt-24 lg:pt-16">
          <header className="flex justify-between items-center mb-16 text-left">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-white mb-2 uppercase tracking-tight leading-tight">111 Jarden Mile</h1>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-slate-500 text-[8px] md:text-[10px] font-black uppercase tracking-widest">Live Sync: Google Calendar & Airtable</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden md:block">
                <p className="text-white text-sm font-bold uppercase tracking-widest">Management</p>
                <p className="text-slate-500 text-[10px] lowercase font-light">{session?.user?.email}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <Bell size={20} />
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}