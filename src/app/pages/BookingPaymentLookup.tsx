import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase, getOwnerToken } from "../lib/supabase";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { Loader2, Search, CreditCard, ExternalLink, ArrowLeft, DollarSign, Calendar, User, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

const AUTHORIZED_EMAILS = ["grantashl1@gmail.com", "donki.bmbr@gmail.com", "bookings@carlsonproperties.co.nz"];

export function BookingPaymentLookup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBookings(allBookings);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = allBookings.filter((booking: any) =>
        booking.guest?.toLowerCase().includes(term) ||
        booking.email?.toLowerCase().includes(term) ||
        booking.checkIn?.includes(term) ||
        booking.checkOut?.includes(term) ||
        booking.id?.toLowerCase().includes(term)
      );
      setFilteredBookings(filtered);
    }
  }, [searchTerm, allBookings]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.email || !AUTHORIZED_EMAILS.includes(session.user.email.toLowerCase())) {
        toast.error("Unauthorized Access");
        navigate("/owner-login");
        return;
      }
      setUser(session.user);
      await fetchBookings();
    } catch (error) {
      console.error("Auth check failed:", error);
      navigate("/owner-login");
    }
  };

  const fetchBookings = async () => {
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
      const bookings = (data.allGuests || [])
        .filter((b: any) => b.stripeSessionId || b.source === 'direct')
        .sort((a: any, b: any) => {
          const dateA = new Date(a.checkIn);
          const dateB = new Date(b.checkIn);
          return dateB.getTime() - dateA.getTime();
        });

      setAllBookings(bookings);
      setFilteredBookings(bookings);
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error("Error Loading Bookings");
    } finally {
      setLoading(false);
    }
  };

  const formatNZDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-[#fdfcf8] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#9DA07E] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcf8] p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-[#9DA07E] hover:text-[#2D2D2D] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="bg-white border border-[#9DA07E]/20 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-[#9DA07E]/10 rounded-2xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-[#9DA07E]" />
            </div>
            <div>
              <h1 className="text-2xl font-serif text-[#2D2D2D]">Payment Lookup</h1>
              <p className="text-sm text-[#9DA07E] font-medium">Search bookings and view Stripe payment details</p>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9DA07E]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by guest name, email, date (DD-MM-YYYY), or booking ID..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#9DA07E]/30 focus:outline-none focus:border-[#9DA07E] text-[#2D2D2D] bg-[#fdfcf8]"
              />
            </div>
          </div>

          {/* Important Note */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
            <p className="text-sm text-blue-900">
              <strong>💡 Where is my money?</strong> Payments are held in your Stripe account. Money is automatically transferred to your bank account based on your Stripe payout schedule (usually 2-7 days after payment).
              <a
                href="https://dashboard.stripe.com/balance/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 underline hover:text-blue-800"
              >
                Check Stripe Balance →
              </a>
            </p>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-[#9DA07E]/30 mx-auto mb-4" />
                <p className="text-[#2D2D2D]/60">
                  {searchTerm ? "No bookings found matching your search" : "No direct bookings with payment records"}
                </p>
              </div>
            ) : (
              filteredBookings.map((booking: any) => (
                <div
                  key={booking.id}
                  className="border border-[#9DA07E]/20 rounded-2xl p-6 bg-white hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="w-5 h-5 text-[#9DA07E]" />
                        <h3 className="text-xl font-semibold text-[#2D2D2D]">{booking.guest}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          booking.status === 'upcoming' ? 'bg-blue-50 text-blue-600' :
                          booking.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                          booking.status === 'pending_payment' ? 'bg-amber-50 text-amber-600' :
                          'bg-green-50 text-green-600'
                        }`}>
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 mt-4">
                        <div className="flex items-center gap-2 text-sm text-[#2D2D2D]/70">
                          <Calendar className="w-4 h-4 text-[#9DA07E]" />
                          <span>{formatNZDate(booking.checkIn)} → {formatNZDate(booking.checkOut)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-[#2D2D2D]/70">
                          <Mail className="w-4 h-4 text-[#9DA07E]" />
                          <a href={`mailto:${booking.email}`} className="hover:text-[#9DA07E] transition-colors">
                            {booking.email}
                          </a>
                        </div>

                        {booking.phone && (
                          <div className="flex items-center gap-2 text-sm text-[#2D2D2D]/70">
                            <Phone className="w-4 h-4 text-[#9DA07E]" />
                            <span>{booking.phone}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-[#2D2D2D]/70">
                          <DollarSign className="w-4 h-4 text-[#9DA07E]" />
                          <span className="font-bold text-[#9DA07E] text-lg">${booking.total.toLocaleString()} NZD</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  {booking.stripeSessionId ? (
                    <div className="mt-4 pt-4 border-t border-[#9DA07E]/10">
                      <div className="bg-[#9DA07E]/5 rounded-xl p-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-[#9DA07E] mb-3">
                          Stripe Payment Details
                        </h4>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-start justify-between text-sm">
                            <span className="text-[#2D2D2D]/60">Session ID:</span>
                            <code className="text-xs bg-white px-2 py-1 rounded font-mono text-[#2D2D2D]">
                              {booking.stripeSessionId}
                            </code>
                          </div>

                          {booking.createdAt && (
                            <div className="flex items-start justify-between text-sm">
                              <span className="text-[#2D2D2D]/60">Payment Date:</span>
                              <span className="font-medium text-[#2D2D2D]">
                                {new Date(booking.createdAt).toLocaleString('en-NZ', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          )}

                          <div className="flex items-start justify-between text-sm">
                            <span className="text-[#2D2D2D]/60">Booking ID:</span>
                            <code className="text-xs bg-white px-2 py-1 rounded font-mono text-[#2D2D2D]">
                              {booking.id}
                            </code>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <a
                            href={`https://dashboard.stripe.com/payments/${booking.stripeSessionId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#635bff] hover:bg-[#5248e4] text-white transition-all text-sm font-medium"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View in Stripe Dashboard
                          </a>

                          <a
                            href="https://dashboard.stripe.com/balance/overview"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#9DA07E]/30 hover:bg-[#9DA07E]/5 text-[#2D2D2D] transition-all text-sm font-medium"
                          >
                            <DollarSign className="w-4 h-4" />
                            View Stripe Balance
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 pt-4 border-t border-[#9DA07E]/10">
                      <p className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-xl">
                        ⚠️ No Stripe payment record found for this booking (may be from Airtable/external source)
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Help Section */}
          <div className="mt-8 p-6 bg-[#9DA07E]/5 rounded-2xl border border-[#9DA07E]/10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#9DA07E] mb-3">
              About Stripe Payments
            </h3>
            <ul className="space-y-2 text-sm text-[#2D2D2D]/70">
              <li>• <strong>Payment Status:</strong> All payments shown here have been successfully processed by Stripe</li>
              <li>• <strong>Bank Transfer:</strong> Stripe automatically transfers funds to your bank based on your payout schedule</li>
              <li>• <strong>Payout Schedule:</strong> Usually 2-7 business days after payment (check your Stripe settings)</li>
              <li>• <strong>Fees:</strong> Stripe deducts processing fees (typically 2.9% + 30¢) before payout</li>
              <li>• <strong>Tracking:</strong> Use the Stripe Dashboard links above to see detailed transaction and payout history</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
