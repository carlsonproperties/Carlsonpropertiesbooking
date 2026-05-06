import React, { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { Loader2, Mail, Send, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const AUTHORIZED_EMAILS = ["grantashl1@gmail.com", "donki.bmbr@gmail.com", "bookings@carlsonproperties.co.nz"];

export function EmailTester() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState("grantashl1@gmail.com");
  const [results, setResults] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.email || !AUTHORIZED_EMAILS.includes(session.user.email.toLowerCase())) {
      toast.error("Unauthorized Access");
      navigate("/owner-login");
      return;
    }
    setUser(session.user);
  };

  const handleTestEmails = async () => {
    setLoading(true);
    setResults(null);

    try {
      const url = `https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/test-emails?email=${encodeURIComponent(testEmail)}`;

      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey.trim()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to send test emails: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      setResults(data);
      toast.success("Test Emails Sent!", {
        description: `Check ${testEmail} for 6 test emails`
      });
    } catch (error: any) {
      console.error("Error sending test emails:", error);
      toast.error("Failed to send test emails", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProcessScheduled = async () => {
    setLoading(true);
    setResults(null);

    try {
      const url = `https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/process-scheduled-emails`;

      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey.trim()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to process scheduled emails: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      setResults(data);

      if (data.emailsSent > 0) {
        toast.success(`Sent ${data.emailsSent} Scheduled Emails`, {
          description: "Check results below"
        });
      } else {
        toast.info("No Scheduled Emails to Send", {
          description: "No bookings matched the schedule criteria today"
        });
      }
    } catch (error: any) {
      console.error("Error processing scheduled emails:", error);
      toast.error("Failed to process scheduled emails", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fdfcf8] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#9DA07E] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcf8] p-6">
      <div className="max-w-3xl mx-auto">
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
              <Mail className="w-6 h-6 text-[#9DA07E]" />
            </div>
            <div>
              <h1 className="text-2xl font-serif text-[#2D2D2D]">Email Testing & Automation</h1>
              <p className="text-sm text-[#9DA07E] font-medium">Test and monitor automated email delivery</p>
            </div>
          </div>

          {/* Test All Email Templates */}
          <div className="mb-8 p-6 bg-[#fdfcf8] rounded-2xl border border-[#9DA07E]/10">
            <h2 className="text-lg font-semibold text-[#2D2D2D] mb-4">Send Test Emails</h2>
            <p className="text-sm text-[#2D2D2D]/60 mb-4">
              This will send all 6 email templates (Booking Confirmation, Pre-Arrival, Check-In, Check-Out, Review Request, Owner Notification) to the email address below.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                Send Test Emails To:
              </label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-xl border border-[#9DA07E]/30 focus:outline-none focus:border-[#9DA07E] text-[#2D2D2D]"
              />
            </div>

            <button
              onClick={handleTestEmails}
              disabled={loading || !testEmail}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#9DA07E] hover:bg-[#8a9070] text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send All Test Emails
                </>
              )}
            </button>
          </div>

          {/* Process Scheduled Emails Manually */}
          <div className="mb-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-200/30">
            <h2 className="text-lg font-semibold text-[#2D2D2D] mb-4">Process Scheduled Emails Now</h2>
            <p className="text-sm text-[#2D2D2D]/60 mb-4">
              Manually trigger the scheduled email processor. This will check all bookings and send emails that are due today (Pre-Arrival, Check-In, Check-Out, Review Request).
            </p>

            <button
              onClick={handleProcessScheduled}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Process Scheduled Emails
                </>
              )}
            </button>
          </div>

          {/* Results Display */}
          {results && (
            <div className="p-6 bg-green-50/50 rounded-2xl border border-green-200/30">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-[#2D2D2D]">Results</h3>
              </div>

              {results.success && (
                <div className="space-y-2">
                  {results.message && (
                    <p className="text-sm text-[#2D2D2D] font-medium">{results.message}</p>
                  )}

                  {results.emails && (
                    <ul className="space-y-1 mt-3">
                      {results.emails.map((email: string, index: number) => (
                        <li key={index} className="text-sm text-[#2D2D2D]/70 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          {email}
                        </li>
                      ))}
                    </ul>
                  )}

                  {results.emailsSent !== undefined && (
                    <div className="mt-4 p-4 bg-white rounded-xl">
                      <p className="text-sm font-medium text-[#2D2D2D] mb-2">
                        Emails Sent: {results.emailsSent}
                      </p>
                      {results.results && results.results.length > 0 && (
                        <ul className="space-y-2 mt-3">
                          {results.results.map((result: any, index: number) => (
                            <li key={index} className="text-sm text-[#2D2D2D]/70 p-2 bg-[#fdfcf8] rounded-lg">
                              <span className="font-medium text-[#9DA07E]">{result.type}</span> → {result.guest} ({result.email})
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )}

              {results.error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-800">
                    <p className="font-medium mb-1">Error</p>
                    <p className="opacity-80">{results.error}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Information */}
          <div className="mt-8 p-6 bg-[#9DA07E]/5 rounded-2xl border border-[#9DA07E]/10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#9DA07E] mb-3">
              How It Works
            </h3>
            <ul className="space-y-2 text-sm text-[#2D2D2D]/70">
              <li>• <strong>Booking Confirmation:</strong> Sent immediately when payment is confirmed</li>
              <li>• <strong>Pre-Arrival Email:</strong> Sent 4 days before check-in with door code & WiFi</li>
              <li>• <strong>Check-In Day:</strong> Sent on check-in day at 9am NZ time</li>
              <li>• <strong>Check-Out Day:</strong> Sent on check-out day at 9am NZ time</li>
              <li>• <strong>Review Request:</strong> Sent 2 days after check-out</li>
              <li>• <strong>Owner Notification:</strong> Sent to you when a new booking is received</li>
            </ul>
            <p className="mt-4 text-sm text-[#2D2D2D]/60">
              The automated cron job runs daily at 9am NZ time to send scheduled emails.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
