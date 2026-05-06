import React, { useState } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { Mail, Loader2, CheckCircle, AlertCircle, Send } from "lucide-react";
import { toast } from "sonner";

export function ResendConfirmation() {
  const [bookingId, setBookingId] = useState("baed2047-5415-4ad7-81a8-5576e3dc17e6"); // Kristy's booking ID
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleResendEmail = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(
        `https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/resend-confirmation`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey.trim()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ bookingId })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend confirmation');
      }

      setSuccess(true);
      toast.success("Emails Sent!", {
        description: `Confirmation sent to ${data.booking.email}`
      });
    } catch (err: any) {
      console.error("Resend error:", err);
      setError(err.message);
      toast.error("Failed to Send", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-10 shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-[#9DA07E] to-[#7A7E5F] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-[#9DA07E]/20">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Resend Booking Confirmation</h1>
            <p className="text-slate-400 text-sm">Manually send confirmation emails to customers</p>
          </div>

          {/* Critical Warning */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-red-400 font-bold mb-2">⚠️ EMAIL DELIVERY ISSUE DETECTED</p>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                  Emails were using <code className="bg-slate-900/50 px-2 py-1 rounded text-red-300">bookings@resend.dev</code> which is NOT verified.
                  This has been updated to <code className="bg-slate-900/50 px-2 py-1 rounded text-emerald-300">bookings@carlsonproperties.co.nz</code>.
                </p>
                <p className="text-sm text-amber-400 font-bold">
                  ⚠️ IMPORTANT: You MUST verify bookings@carlsonproperties.co.nz in your Resend account for emails to work!
                </p>
                <div className="mt-3 p-3 bg-slate-900/50 rounded-xl">
                  <p className="text-xs text-slate-400 mb-2">To verify your email in Resend:</p>
                  <ol className="text-xs text-slate-300 space-y-1 list-decimal list-inside">
                    <li>Log into resend.com</li>
                    <li>Go to <strong>Domains</strong> → Add your domain or verify sender</li>
                    <li>Follow DNS verification steps</li>
                    <li>Once verified, emails will be delivered properly</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Booking ID Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Booking ID
            </label>
            <input
              type="text"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#9DA07E] transition-colors font-mono text-sm"
              placeholder="Enter booking ID"
            />
            <p className="text-xs text-slate-500 mt-2">
              Default: Kristy Ngapeka's booking (baed2047-5415-4ad7-81a8-5576e3dc17e6)
            </p>
          </div>

          {/* Send Button */}
          <button
            onClick={handleResendEmail}
            disabled={loading || !bookingId}
            className="w-full bg-gradient-to-r from-[#9DA07E] to-[#7A7E5F] text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#9DA07E]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending Emails...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Resend Confirmation Emails</span>
              </>
            )}
          </button>

          {/* Success Message */}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-green-400 font-bold mb-2">✅ Emails Sent Successfully!</p>
                  <p className="text-sm text-slate-300">
                    Confirmation emails have been sent to the customer and to bookings@carlsonproperties.co.nz.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-red-400 font-bold mb-2">Failed to Send Emails</p>
                  <p className="text-sm text-slate-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Mail className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-blue-400 font-bold mb-2">What This Tool Does</p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  This tool manually sends booking confirmation emails to customers who didn't receive them.
                  It sends two emails:
                </p>
                <ul className="text-sm text-slate-300 mt-2 space-y-1 list-disc list-inside ml-4">
                  <li>Booking confirmation to the customer</li>
                  <li>Owner notification to bookings@carlsonproperties.co.nz</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
