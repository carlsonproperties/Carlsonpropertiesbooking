import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase, getOwnerToken } from "../lib/supabase";
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
  Sparkles,
  Menu,
  X,
  CheckCircle,
  Trash2,
  Pencil,
  Save,
  Copy,
  Send,
  LayoutDashboard,
  FolderOpen,
  Mail as MailIcon,
  PieChart as PieChartIcon
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CarlsonLogo } from "../components/CarlsonLogo";
import { toast } from "sonner";

const AUTHORIZED_EMAILS = ["grantashl1@gmail.com", "donki.bmbr@gmail.com", "bookings@carlsonproperties.co.nz"];

type TabType = 'overview' | 'directory' | 'templates';

// Format date to NZ format DD-MM-YYYY
const formatNZDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Format datetime to NZ format with time
const formatNZDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(/\//g, '-');
};

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
  yearlyEarnings?: any;
  yearlyExpenses?: any;
  channelBreakdown?: any;
  totalAirtableExpenses?: number;
}

const EMAIL_TEMPLATES = [
  {
    id: 1,
    name: "Booking Confirmation",
    trigger: "Immediately when payment confirmed",
    subject: "Booking Confirmed - ONE ELEVEN ON THE MILE",
    body: `Hi [Guest Name],

Thank you for choosing us, we look forward to hosting you. Your dates have now been reserved for [Check-in Date] — [Check-out Date].

Three days before your check-in you will receive another email from us with more information — WiFi, Door code etc.

In the meantime explore the website and familiarize yourself with our digital guidebook.

Warm regards,
Matt & Ash
ONE ELEVEN | ON THE MILE`
  },
  {
    id: 2,
    name: "Pre-Arrival Details",
    trigger: "3 days before check-in at 9:00 AM",
    subject: "Your Stay is Almost Here - Guest Information",
    body: `Hi [Guest Name],

Your stay at ONE ELEVEN ON THE MILE is just around the corner. Here's everything you need to know:

DOOR CODE: [Last 4 digits of phone] followed by the # key
- Activates at 3:00 PM on [Check-in Date]
- Expires at 10:00 AM on [Check-out Date]

ADDRESS: 111 Jarden Mile, Taupō, Waikato 3330, New Zealand

WI-FI:
- Network: Carlson & Co. Guest
- Password: Gue$t111. (Don't forget the full stop!)

DIGITAL HOUSE MANUAL:
Visit carlsonproperties.co.nz/guest-info for video instructions on the pool, sauna, gym, and more.

It is a Self Check-In so we will not be there to meet you, however we also live in the neighbourhood so if you need anything we are around to help out.

See you soon,
Matt & Ash
ONE ELEVEN | ON THE MILE`
  },
  {
    id: 3,
    name: "Check-Out Morning",
    trigger: "Morning of check-out at 9:00 AM",
    subject: "Check-Out Instructions - Thank You for Staying",
    body: `Good morning [Guest Name],

We hope you've had a wonderful stay.

We do the cleaning ourselves to save you on a cleaning fee, so as your visit comes to an end, please help us with a quicker turnover by:
- Loading and starting the dishwasher
- Taking your rubbish out to the wheelie bin down the side of the house

It is not expected that you strip the beds but it is really helpful when you do. However, please, please, leave the mattress protectors on and the duvet inner protectors on. All bedding and towels get taken to the commercial laundry so don't worry about washing/drying them.

Warm regards,
Matt & Ash
ONE ELEVEN | ON THE MILE`
  },
  {
    id: 4,
    name: "Review Request",
    trigger: "1 day after check-out at 9:00 AM",
    subject: "How Was Your Stay? We'd Love Your Feedback",
    body: `Hi [Guest Name],

Thanks for being such a respectful guest and looking after our property. If you would like to book again in the future then please reach out to us again via our website.

In the meantime, please review your stay:
[GOOGLE REVIEW LINK BUTTON]

We're a small local business and your positive review really helps us. If you have anything we could learn from or that would help future guests, please email us privately at bookings@carlsonproperties.co.nz instead of posting it publicly.

See you again soon,
Matt & Ash
ONE ELEVEN | ON THE MILE`
  },
  {
    id: 5,
    name: "Owner Notification",
    trigger: "Immediately when new booking received",
    subject: "🎉 New Booking - [Guest Name] - [Check-in Date]",
    body: `New booking received!

GUEST: [Guest Name]
EMAIL: [Guest Email]
PHONE: [Guest Phone]
CHECK-IN: [Check-in Date]
CHECK-OUT: [Check-out Date]
GUESTS: [Number of Guests]
TOTAL: $[Amount]

View in dashboard: carlsonproperties.co.nz/dashboard`
  }
];

export function DashboardComplete() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [user, setUser] = useState<any>(null);
  const [expandedGuest, setExpandedGuest] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('directory');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showChannelBreakdown, setShowChannelBreakdown] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [editingGuest, setEditingGuest] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Guest>>({});
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [addBookingForm, setAddBookingForm] = useState({ guest: '', email: '', phone: '', checkIn: '', checkOut: '', guests: '2', total: '1275', notes: '', status: 'upcoming', sendEmails: false });
  const [addBookingLoading, setAddBookingLoading] = useState(false);

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
          'Authorization': `Bearer ${await getOwnerToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

      const data = await res.json();

      const processedGuests = (data.allGuests || []).map((g: any) => ({
        ...g,
        // Normalise legacy field names from old bookings
        guest: g.guest || g.guestName || 'Guest',
        email: g.email || g.guestEmail || '',
        phone: g.phone || g.guestPhone || '',
        notes: g.notes || g.guestNotes || '',
        source: (g.stripeSessionId || g.createdAt) ? 'direct' : 'airtable',
        channel: g.channel || 'Direct Booking (Website)'
      }));

      const uniqueGuests = processedGuests.reduce((acc: Guest[], guest: Guest) => {
        // For direct bookings use ID; for Airtable use name+dates to deduplicate
        const duplicate = acc.find(g =>
          guest.source === 'direct'
            ? g.id === guest.id
            : g.guest === guest.guest && g.checkIn === guest.checkIn && g.checkOut === guest.checkOut
        );

        if (duplicate) {
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

  const handleConfirmPayment = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      const res = await fetch(
        `https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/update-booking`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${await getOwnerToken()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            bookingId,
            updates: { status: 'upcoming' }
          })
        }
      );

      if (!res.ok) throw new Error('Failed to confirm payment');

      toast.success("Payment Confirmed", {
        description: "Booking status updated and confirmation email sent"
      });
      await fetchDashboardData();
    } catch (error: any) {
      toast.error("Failed to confirm payment", { description: error.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteBooking = async (bookingId: string, guestName: string) => {
    if (!confirm(`Delete booking for ${guestName}? This will reopen the dates for new bookings.`)) {
      return;
    }

    setActionLoading(bookingId);
    try {
      const res = await fetch(
        `https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/delete-booking`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${await getOwnerToken()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ bookingId })
        }
      );

      if (!res.ok) throw new Error('Failed to delete booking');

      toast.success("Booking Deleted", {
        description: "Dates have been reopened for new bookings"
      });
      await fetchDashboardData();
    } catch (error: any) {
      toast.error("Failed to delete booking", { description: error.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleStartEdit = (guest: Guest, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingGuest(guest.id);
    setEditForm({
      guest: guest.guest,
      email: guest.email,
      phone: guest.phone || '',
      checkIn: guest.checkIn,
      checkOut: guest.checkOut,
      notes: guest.notes || '',
      status: guest.status,
    });
  };

  const handleSaveEdit = async (bookingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoading(bookingId);
    try {
      const res = await fetch(
        `https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/update-booking`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${await getOwnerToken()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ bookingId, updates: editForm })
        }
      );
      if (!res.ok) throw new Error('Failed to update booking');
      toast.success("Booking Updated", { description: "Guest details have been saved." });
      setEditingGuest(null);
      await fetchDashboardData();
    } catch (error: any) {
      toast.error("Failed to update booking", { description: error.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addBookingForm.guest || !addBookingForm.checkIn || !addBookingForm.checkOut) {
      toast.error("Required fields missing", { description: "Guest name, check-in, and check-out are required." });
      return;
    }
    setAddBookingLoading(true);
    try {
      const res = await fetch(
        `https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/create-booking`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${await getOwnerToken()}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingData: { ...addBookingForm, total: parseFloat(addBookingForm.total || '0'), guests: parseInt(addBookingForm.guests || '1') }, sendEmails: addBookingForm.sendEmails })
        }
      );
      if (!res.ok) throw new Error('Failed to create booking');
      toast.success("Booking Added", { description: `${addBookingForm.guest} has been added to the directory.` });
      setShowAddBooking(false);
      setAddBookingForm({ guest: '', email: '', phone: '', checkIn: '', checkOut: '', guests: '2', total: '1275', notes: '', status: 'upcoming', sendEmails: false });
      await fetchDashboardData();
    } catch (error: any) {
      toast.error("Failed to add booking", { description: error.message });
    } finally {
      setAddBookingLoading(false);
    }
  };

  const copyTemplate = async (body: string) => {
    // Multi-layered clipboard fallback system
    try {
      // Method 1: Modern Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(body);
        toast.success("Copied to Clipboard");
        return;
      }
    } catch (err) {
      console.warn('Clipboard API failed, trying fallback:', err);
    }

    try {
      // Method 2: execCommand fallback
      const textArea = document.createElement('textarea');
      textArea.value = body;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        toast.success("Copied to Clipboard");
        return;
      }
    } catch (err) {
      console.warn('execCommand fallback failed:', err);
    }

    // Method 3: Manual selection fallback
    toast.error("Auto-copy blocked", {
      description: "Please manually select and copy the text"
    });
  };

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
      return dateA.getTime() - dateB.getTime();
    }

    return dateB.getTime() - dateA.getTime();
  });

  const directBookings = [...(stats?.allGuests || [])]
    .filter(g => g.source === 'direct' && g.createdAt)
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
    .slice(0, 10);

  // Get available years and current year data for charts
  const availableYears = stats?.yearlyEarnings ? Object.keys(stats.yearlyEarnings).sort().reverse() : [];
  const currentYearData = stats?.yearlyEarnings?.[selectedYear] || [];

  // Calculate channel percentages
  const channelData = stats?.channelBreakdown || {};
  const totalChannelBookings = Object.values(channelData).reduce((sum: number, count: any) => sum + count, 0) as number;

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
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4 md:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-[#9DA07E]/10 rounded-xl transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-[#9DA07E]" />
                ) : (
                  <Menu className="w-6 h-6 text-[#9DA07E]" />
                )}
              </button>

              <div className="w-10 h-10 md:w-12 md:h-12">
                <CarlsonLogo />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-serif text-[#2D2D2D]">Owner Dashboard</h1>
                <p className="text-xs md:text-sm text-[#9DA07E] font-medium hidden md:block">{user?.email}</p>
              </div>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'bg-[#9DA07E] text-white'
                    : 'border border-[#9DA07E]/30 text-[#2D2D2D] hover:bg-[#9DA07E]/10'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('directory')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all text-sm font-medium ${
                  activeTab === 'directory'
                    ? 'bg-[#9DA07E] text-white'
                    : 'border border-[#9DA07E]/30 text-[#2D2D2D] hover:bg-[#9DA07E]/10'
                }`}
              >
                <FolderOpen className="w-4 h-4" />
                Guest Directory
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all text-sm font-medium ${
                  activeTab === 'templates'
                    ? 'bg-[#9DA07E] text-white'
                    : 'border border-[#9DA07E]/30 text-[#2D2D2D] hover:bg-[#9DA07E]/10'
                }`}
              >
                <MailIcon className="w-4 h-4" />
                Email Templates
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/")}
                className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#9DA07E]/30 hover:bg-[#9DA07E]/10 text-[#2D2D2D] transition-all text-sm"
              >
                <Home className="w-4 h-4" />
                Website
              </button>
              <button
                onClick={fetchDashboardData}
                className="flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-full bg-[#9DA07E]/10 hover:bg-[#9DA07E]/20 text-[#9DA07E] transition-all text-sm font-medium"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="hidden md:inline">Refresh</span>
              </button>
              <button
                onClick={handleSignOut}
                className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full border border-red-200 hover:bg-red-50 text-red-600 transition-all text-sm"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-8">
                <h2 className="text-xl font-serif text-[#2D2D2D] mb-2">Navigation</h2>
                <p className="text-sm text-[#9DA07E]">{user?.email}</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('overview');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all text-left ${
                    activeTab === 'overview'
                      ? 'bg-[#9DA07E] text-white'
                      : 'bg-[#fdfcf8] text-[#2D2D2D] hover:bg-[#9DA07E]/10'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="font-medium">Overview</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('directory');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all text-left ${
                    activeTab === 'directory'
                      ? 'bg-[#9DA07E] text-white'
                      : 'bg-[#fdfcf8] text-[#2D2D2D] hover:bg-[#9DA07E]/10'
                  }`}
                >
                  <FolderOpen className="w-5 h-5" />
                  <span className="font-medium">Guest Directory</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('templates');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all text-left ${
                    activeTab === 'templates'
                      ? 'bg-[#9DA07E] text-white'
                      : 'bg-[#fdfcf8] text-[#2D2D2D] hover:bg-[#9DA07E]/10'
                  }`}
                >
                  <MailIcon className="w-5 h-5" />
                  <span className="font-medium">Email Templates</span>
                </button>

                <div className="pt-4 mt-4 border-t border-[#9DA07E]/20">
                  <button
                    onClick={() => {
                      navigate("/");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-[#fdfcf8] text-[#2D2D2D] hover:bg-[#9DA07E]/10 transition-all text-left"
                  >
                    <Home className="w-5 h-5" />
                    <span className="font-medium">Back to Website</span>
                  </button>

                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-all text-left mt-2"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1600px] mx-auto p-4 md:p-6">
        {/* Stats Cards - Show on Overview */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                onClick={() => setShowChannelBreakdown(!showChannelBreakdown)}
                className="bg-white border border-[#9DA07E]/20 rounded-3xl p-6 shadow-sm cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-[#9DA07E]/10 rounded-2xl flex items-center justify-center">
                    {showChannelBreakdown ? (
                      <PieChartIcon className="w-6 h-6 text-[#9DA07E]" />
                    ) : (
                      <Calendar className="w-6 h-6 text-[#9DA07E]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[#9DA07E] text-xs font-bold uppercase tracking-widest mb-1">Total Bookings</p>
                    {!showChannelBreakdown ? (
                      <p className="text-[#2D2D2D] text-2xl font-bold">
                        {stats?.totalBookings || 0}
                      </p>
                    ) : (
                      <div className="space-y-1">
                        {Object.entries(channelData)
                          .sort(([, a], [, b]) => (b as number) - (a as number))
                          .map(([channel, count]) => {
                            const percentage = totalChannelBookings > 0
                              ? ((count as number / totalChannelBookings) * 100).toFixed(0)
                              : 0;
                            return (
                              <div key={channel} className="flex items-center justify-between text-sm">
                                <span className="text-[#2D2D2D]/70 font-medium">{channel}:</span>
                                <span className="text-[#9DA07E] font-bold">{percentage}%</span>
                              </div>
                            );
                          })}
                      </div>
                    )}
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

            {/* Financial Performance Chart */}
            {availableYears.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white border border-[#9DA07E]/20 rounded-3xl p-8 shadow-sm mb-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-serif text-[#2D2D2D] mb-1">Financial Performance</h2>
                    <p className="text-sm text-[#9DA07E] font-medium">Revenue vs Expenses by Month</p>
                  </div>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-4 py-2.5 rounded-full border border-[#9DA07E]/30 bg-white text-[#2D2D2D] text-sm font-medium focus:outline-none focus:border-[#9DA07E] hover:bg-[#9DA07E]/5 transition-all"
                  >
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={currentYearData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9DA07E" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#9DA07E" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#9DA07E" opacity={0.1} />
                    <XAxis dataKey="name" stroke="#9DA07E" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#9DA07E" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #9DA07E',
                        borderRadius: '12px',
                        padding: '12px'
                      }}
                      labelStyle={{ color: '#2D2D2D', fontWeight: 'bold', marginBottom: '8px' }}
                    />
                    <Legend
                      wrapperStyle={{
                        paddingTop: '20px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="earnings"
                      stroke="#9DA07E"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      name="Gross Revenue"
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="#ef4444"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorExpenses)"
                      name="Monthly Expenses"
                    />
                  </AreaChart>
                </ResponsiveContainer>

                {stats?.totalAirtableExpenses && (
                  <div className="mt-6 pt-6 border-t border-[#9DA07E]/20 text-center">
                    <p className="text-sm text-[#2D2D2D]/60">
                      Total Expenses: <span className="font-bold text-red-600">${stats.totalAirtableExpenses.toLocaleString()}</span>
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Latest Direct Bookings on Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white border border-[#9DA07E]/20 rounded-3xl p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#9DA07E]/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#9DA07E]" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-[#2D2D2D]">Latest Direct Bookings</h2>
                  <p className="text-sm text-[#9DA07E] font-medium">Website payments</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {directBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="border border-[#9DA07E]/20 rounded-2xl p-5 bg-[#fdfcf8] hover:bg-white transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[#2D2D2D] font-semibold truncate mb-1">
                          {booking.guest}
                        </h4>
                        <p className="text-xs text-[#2D2D2D]/60">
                          {formatNZDate(booking.checkIn)} → {formatNZDate(booking.checkOut)}
                        </p>
                      </div>
                      <div className="text-right ml-2">
                        <p className="text-[#9DA07E] font-bold text-lg">
                          ${booking.total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {booking.createdAt && (
                      <div className="flex items-center gap-2 text-xs text-[#2D2D2D]/50 mb-2">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatNZDateTime(booking.createdAt)}
                        </span>
                      </div>
                    )}
                    <a
                      href={`mailto:${booking.email}`}
                      className="text-xs text-[#9DA07E] hover:underline flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3" />
                      {booking.email}
                    </a>
                  </motion.div>
                ))}
              </div>

              {directBookings.length === 0 && (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-[#9DA07E]/30 mx-auto mb-3" />
                  <p className="text-sm text-[#2D2D2D]/60">No direct bookings yet</p>
                </div>
              )}
            </motion.div>
          </>
        )}

        {/* Guest Directory Tab */}
        {activeTab === 'directory' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-white border border-[#9DA07E]/20 rounded-3xl p-6 md:p-8 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-serif text-[#2D2D2D] mb-1">Guest Directory</h2>
                  <p className="text-sm text-[#9DA07E] font-medium">All bookings and reservations</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-[#9DA07E]/10 px-4 py-2 rounded-full">
                    <span className="text-[#9DA07E] font-bold text-sm">
                      {allGuestsSorted.length} Total
                    </span>
                  </div>
                  <button
                    onClick={() => setShowAddBooking(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#9DA07E] hover:bg-[#8a8d6e] text-white text-sm font-medium transition-all"
                  >
                    <Pencil className="w-4 h-4" />
                    Add Booking
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {allGuestsSorted.map((guest, index) => (
                  <motion.div
                    key={guest.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
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
                                : guest.status === 'pending_payment'
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-green-50 text-green-600'
                            }`}>
                              {guest.status === 'pending_payment' ? 'Pending' : guest.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-[#2D2D2D]/60">
                            <span className="font-medium">{formatNZDate(guest.checkIn)}</span>
                            <span>→</span>
                            <span className="font-medium">{formatNZDate(guest.checkOut)}</span>
                            <span className="mx-2">•</span>
                            <span className="text-xs px-2 py-1 bg-[#9DA07E]/10 text-[#9DA07E] rounded-full font-medium">
                              {guest.channel}
                            </span>
                            <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
                              {guest.source === 'direct' ? 'Direct' : 'Airtable'}
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

                            {/* Edit Form (shown when editing) */}
                            {editingGuest === guest.id ? (
                              <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                                <p className="text-xs text-[#9DA07E] font-bold uppercase tracking-widest">Edit Booking Details</p>
                                <div className="grid md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs text-[#2D2D2D]/60 mb-1">Guest Name</label>
                                    <input
                                      type="text"
                                      value={editForm.guest || ''}
                                      onChange={(e) => setEditForm(f => ({ ...f, guest: e.target.value }))}
                                      className="w-full border border-[#9DA07E]/30 rounded-xl px-3 py-2 text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#9DA07E]/40"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-[#2D2D2D]/60 mb-1">Email</label>
                                    <input
                                      type="email"
                                      value={editForm.email || ''}
                                      onChange={(e) => setEditForm(f => ({ ...f, email: e.target.value }))}
                                      className="w-full border border-[#9DA07E]/30 rounded-xl px-3 py-2 text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#9DA07E]/40"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-[#2D2D2D]/60 mb-1">Phone</label>
                                    <input
                                      type="tel"
                                      value={editForm.phone || ''}
                                      onChange={(e) => setEditForm(f => ({ ...f, phone: e.target.value }))}
                                      className="w-full border border-[#9DA07E]/30 rounded-xl px-3 py-2 text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#9DA07E]/40"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-[#2D2D2D]/60 mb-1">Status</label>
                                    <select
                                      value={editForm.status || ''}
                                      onChange={(e) => setEditForm(f => ({ ...f, status: e.target.value }))}
                                      className="w-full border border-[#9DA07E]/30 rounded-xl px-3 py-2 text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#9DA07E]/40"
                                    >
                                      <option value="upcoming">Upcoming</option>
                                      <option value="pending_payment">Pending Payment</option>
                                      <option value="completed">Completed</option>
                                      <option value="confirmed">Confirmed</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs text-[#2D2D2D]/60 mb-1">Check-In</label>
                                    <input
                                      type="date"
                                      value={editForm.checkIn || ''}
                                      onChange={(e) => setEditForm(f => ({ ...f, checkIn: e.target.value }))}
                                      className="w-full border border-[#9DA07E]/30 rounded-xl px-3 py-2 text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#9DA07E]/40"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-[#2D2D2D]/60 mb-1">Check-Out</label>
                                    <input
                                      type="date"
                                      value={editForm.checkOut || ''}
                                      onChange={(e) => setEditForm(f => ({ ...f, checkOut: e.target.value }))}
                                      className="w-full border border-[#9DA07E]/30 rounded-xl px-3 py-2 text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#9DA07E]/40"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs text-[#2D2D2D]/60 mb-1">Notes</label>
                                  <textarea
                                    value={editForm.notes || ''}
                                    onChange={(e) => setEditForm(f => ({ ...f, notes: e.target.value }))}
                                    rows={2}
                                    className="w-full border border-[#9DA07E]/30 rounded-xl px-3 py-2 text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#9DA07E]/40 resize-none"
                                  />
                                </div>
                                <div className="flex gap-3 pt-2">
                                  <button
                                    onClick={(e) => handleSaveEdit(guest.id, e)}
                                    disabled={actionLoading === guest.id}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#9DA07E] hover:bg-[#8a8d6e] text-white transition-all text-sm font-medium disabled:opacity-50"
                                  >
                                    {actionLoading === guest.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Changes
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setEditingGuest(null); }}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all text-sm font-medium"
                                  >
                                    <X className="w-4 h-4" />
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
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
                                          {guest.email || <span className="text-[#2D2D2D]/40 italic">No email</span>}
                                        </a>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-[#9DA07E]" />
                                        {guest.phone ? (
                                          <a
                                            href={`tel:${guest.phone}`}
                                            className="text-[#2D2D2D] hover:text-[#9DA07E] transition-colors text-sm"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            {guest.phone}
                                          </a>
                                        ) : (
                                          <span className="text-[#2D2D2D]/40 text-sm italic">No phone</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-xs text-[#9DA07E] font-bold uppercase tracking-widest mb-2">Details</p>
                                    <div className="space-y-1 text-sm text-[#2D2D2D]/80">
                                      <p><strong>Guests:</strong> {guest.guests}</p>
                                      <p><strong>Source:</strong> {guest.source === 'direct' ? 'Direct Website' : 'Airtable'}</p>
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
                                    <span>Booked on {formatNZDateTime(guest.createdAt)}</span>
                                  </div>
                                )}
                              </>
                            )}

                            {/* Action Buttons */}
                            {guest.source === 'direct' && editingGuest !== guest.id && (
                              <div className="flex gap-3 pt-4 border-t border-[#9DA07E]/20">
                                <button
                                  onClick={(e) => handleStartEdit(guest, e)}
                                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#9DA07E]/10 hover:bg-[#9DA07E]/20 text-[#9DA07E] transition-all text-sm font-medium"
                                >
                                  <Pencil className="w-4 h-4" />
                                  Edit Details
                                </button>
                                {guest.status === 'pending_payment' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleConfirmPayment(guest.id);
                                    }}
                                    disabled={actionLoading === guest.id}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-green-500 hover:bg-green-600 text-white transition-all text-sm font-medium disabled:opacity-50"
                                  >
                                    {actionLoading === guest.id ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <CheckCircle className="w-4 h-4" />
                                    )}
                                    Confirm Payment
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteBooking(guest.id, guest.guest);
                                  }}
                                  disabled={actionLoading === guest.id}
                                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition-all text-sm font-medium disabled:opacity-50"
                                >
                                  {actionLoading === guest.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                  Delete Booking
                                </button>
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    if (!guest.email) { toast.error("No email address on this booking."); return; }
                                    setActionLoading(guest.id + '-email');
                                    try {
                                      const res = await fetch(
                                        `https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/resend-confirmation`,
                                        { method: 'POST', headers: { 'Authorization': `Bearer ${await getOwnerToken()}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ bookingId: guest.id }) }
                                      );
                                      const data = await res.json();
                                      if (!res.ok) throw new Error(data.error || 'Failed');
                                      toast.success("Emails Sent", { description: `Confirmation sent to ${guest.email}` });
                                    } catch (err: any) {
                                      toast.error("Failed to send emails", { description: err.message });
                                    } finally {
                                      setActionLoading(null);
                                    }
                                  }}
                                  disabled={!!actionLoading}
                                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all text-sm font-medium disabled:opacity-50"
                                >
                                  {actionLoading === guest.id + '-email' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                  Send Emails
                                </button>
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

            {/* Latest Direct Bookings Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
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
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="border border-[#9DA07E]/20 rounded-2xl p-4 bg-[#fdfcf8] hover:bg-white transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[#2D2D2D] font-semibold truncate mb-1">
                          {booking.guest}
                        </h4>
                        <p className="text-xs text-[#2D2D2D]/60">
                          {formatNZDate(booking.checkIn)} → {formatNZDate(booking.checkOut)}
                        </p>
                      </div>
                      <div className="text-right ml-2">
                        <p className="text-[#9DA07E] font-bold">
                          ${booking.total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {booking.createdAt && (
                      <div className="flex items-center gap-2 text-xs text-[#2D2D2D]/50 mb-2">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatNZDateTime(booking.createdAt)}
                        </span>
                      </div>
                    )}
                    <a
                      href={`mailto:${booking.email}`}
                      className="text-xs text-[#9DA07E] hover:underline flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3" />
                      {booking.email}
                    </a>
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
        )}

        {/* Email Templates Tab */}
        {activeTab === 'templates' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#9DA07E]/20 rounded-3xl p-8 shadow-sm"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-serif text-[#2D2D2D] mb-2">Email Templates</h2>
              <p className="text-sm text-[#9DA07E] font-medium">
                Automated email communications sent to guests
              </p>
            </div>

            <div className="space-y-6">
              {EMAIL_TEMPLATES.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-[#9DA07E]/20 rounded-2xl overflow-hidden"
                >
                  <div className="bg-[#9DA07E]/5 p-5 border-b border-[#9DA07E]/20">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-[#2D2D2D] mb-1">
                          {template.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-[#9DA07E]">
                          <Send className="w-4 h-4" />
                          <span className="font-medium">{template.trigger}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => copyTemplate(template.body)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#9DA07E]/30 hover:bg-[#9DA07E]/10 text-[#9DA07E] transition-all text-sm font-medium"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="p-5 bg-white">
                    <p className="text-xs text-[#9DA07E] font-bold uppercase tracking-widest mb-3">
                      Subject Line
                    </p>
                    <p className="text-sm text-[#2D2D2D] font-medium mb-4 pb-4 border-b border-[#9DA07E]/10">
                      {template.subject}
                    </p>
                    <p className="text-xs text-[#9DA07E] font-bold uppercase tracking-widest mb-3">
                      Email Body
                    </p>
                    <div className="bg-[#fdfcf8] rounded-xl p-5">
                      <pre className="text-sm text-[#2D2D2D] whitespace-pre-wrap font-sans leading-relaxed">
                        {template.body}
                      </pre>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Add Booking Modal */}
      <AnimatePresence>
        {showAddBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddBooking(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif text-[#2D2D2D]">Add Booking</h2>
                <button onClick={() => setShowAddBooking(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleAddBooking} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs text-[#2D2D2D]/60 mb-1 font-medium">Guest Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Alice Grey"
                      value={addBookingForm.guest}
                      onChange={(e) => setAddBookingForm(f => ({ ...f, guest: e.target.value }))}
                      className="w-full border border-[#9DA07E]/30 rounded-xl px-3 py-2.5 text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#9DA07E]/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#2D2D2D]/60 mb-1 font-medium">Email</label>
                    <input
                      type="email"
                      placeholder="alice@example.com"
                      value={addBookingForm.email}
                      onChange={(e) => setAddBookingForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full border border-[#9DA07E]/30 rounded-xl px-3 py-2.5 text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#9DA07E]/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#2D2D2D]/60 mb-1 font-medium">Phone</label>
                    <input
                      type="tel"
                      placeholder="021 234 5678"
                      value={addBookingForm.phone}
                      onChange={(e) => setAddBookingForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full border border-[#9DA07E]/30 rounded-xl px-3 py-2.5 text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#9DA07E]/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#2D2D2D]/60 mb-1 font-medium">Check-In *</label>
                    <input
                      type="date"
                      required
                      value={addBookingForm.checkIn}
                      onChange={(e) => setAddBookingForm(f => ({ ...f, checkIn: e.target.value }))}
                      className="w-full border border-[#9DA07E]/30 rounded-xl px-3 py-2.5 text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#9DA07E]/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#2D2D2D]/60 mb-1 font-medium">Check-Out *</label>
                    <input
                      type="date"
                      required
                      value={addBookingForm.checkOut}
                      onChange={(e) => setAddBookingForm(f => ({ ...f, checkOut: e.target.value }))}
                      className="w-full border border-[#9DA07E]/30 rounded-xl px-3 py-2.5 text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#9DA07E]/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#2D2D2D]/60 mb-1 font-medium">Guests</label>
                    <input
                      type="number"
                      min="1"
                      value={addBookingForm.guests}
                      onChange={(e) => setAddBookingForm(f => ({ ...f, guests: e.target.value }))}
                      className="w-full border border-[#9DA07E]/30 rounded-xl px-3 py-2.5 text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#9DA07E]/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#2D2D2D]/60 mb-1 font-medium">Total (NZD)</label>
                    <input
                      type="number"
                      min="0"
                      value={addBookingForm.total}
                      onChange={(e) => setAddBookingForm(f => ({ ...f, total: e.target.value }))}
                      className="w-full border border-[#9DA07E]/30 rounded-xl px-3 py-2.5 text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#9DA07E]/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#2D2D2D]/60 mb-1 font-medium">Status</label>
                    <select
                      value={addBookingForm.status}
                      onChange={(e) => setAddBookingForm(f => ({ ...f, status: e.target.value }))}
                      className="w-full border border-[#9DA07E]/30 rounded-xl px-3 py-2.5 text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#9DA07E]/40"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="pending_payment">Pending Payment</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#2D2D2D]/60 mb-1 font-medium">Notes</label>
                  <textarea
                    rows={2}
                    value={addBookingForm.notes}
                    onChange={(e) => setAddBookingForm(f => ({ ...f, notes: e.target.value }))}
                    className="w-full border border-[#9DA07E]/30 rounded-xl px-3 py-2.5 text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#9DA07E]/40 resize-none"
                  />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addBookingForm.sendEmails}
                    onChange={(e) => setAddBookingForm(f => ({ ...f, sendEmails: e.target.checked }))}
                    className="w-4 h-4 accent-[#9DA07E]"
                  />
                  <span className="text-sm text-[#2D2D2D]/70">Send confirmation emails to guest & owner</span>
                </label>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={addBookingLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#9DA07E] hover:bg-[#8a8d6e] text-white font-medium transition-all disabled:opacity-50"
                  >
                    {addBookingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Add Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddBooking(false)}
                    className="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
