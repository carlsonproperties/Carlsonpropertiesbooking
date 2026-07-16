import React, { useState, useEffect } from "react";
import { CreditCard, Info, Search, AlertCircle, Mail, Loader2, CheckCircle } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

import { getOwnerToken } from "../lib/supabase";
export function StripeAccountCheck() {
  const [sessionId] = useState("cs_live_a1qlwFrr4etDEDQYlMjJn00db9IdYjKJchHGGe8NKKss3iSGnoTmFugYaW");
  const [loading, setLoading] = useState(true);
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAccountInfo();
  }, []);

  const fetchAccountInfo = async () => {
    setLoading(true);
    try {
      const url = `https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/stripe-account-info`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${await getOwnerToken()}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch account info');
      }

      setAccountInfo(data);
    } catch (err: any) {
      console.error("Error fetching account info:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Stripe Account Checker</h1>
            <p className="text-slate-400 text-sm">Find which Stripe account is receiving your payments</p>
          </div>

          {/* Account Info Result */}
          {loading && (
            <div className="bg-slate-900/50 border border-slate-700/30 rounded-2xl p-8 mb-8 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin mr-3" />
              <span className="text-slate-300">Loading Stripe account information...</span>
            </div>
          )}

          {!loading && accountInfo && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-emerald-400 font-bold mb-4 text-lg">✅ Stripe Account Found</p>

                  <div className="space-y-3">
                    <div className="bg-slate-900/50 rounded-xl p-4">
                      <p className="text-xs text-slate-500 mb-1">Account Email</p>
                      <p className="text-lg font-bold text-emerald-300 flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        {accountInfo.email}
                      </p>
                    </div>

                    <div className="bg-slate-900/50 rounded-xl p-4">
                      <p className="text-xs text-slate-500 mb-1">Account ID</p>
                      <p className="text-sm font-mono text-purple-300">{accountInfo.accountId}</p>
                    </div>

                    {accountInfo.businessName && accountInfo.businessName !== 'Not set' && (
                      <div className="bg-slate-900/50 rounded-xl p-4">
                        <p className="text-xs text-slate-500 mb-1">Business Name</p>
                        <p className="text-sm font-medium text-slate-200">{accountInfo.businessName}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-900/50 rounded-xl p-3">
                        <p className="text-xs text-slate-500 mb-1">Country</p>
                        <p className="text-sm font-medium text-slate-200">{accountInfo.country}</p>
                      </div>
                      <div className="bg-slate-900/50 rounded-xl p-3">
                        <p className="text-xs text-slate-500 mb-1">Currency</p>
                        <p className="text-sm font-medium text-slate-200">{accountInfo.currency?.toUpperCase()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-900/50 rounded-xl p-3">
                        <p className="text-xs text-slate-500 mb-1">Charges Enabled</p>
                        <p className={`text-sm font-bold ${accountInfo.chargesEnabled ? 'text-emerald-400' : 'text-red-400'}`}>
                          {accountInfo.chargesEnabled ? 'Yes ✓' : 'No ✗'}
                        </p>
                      </div>
                      <div className="bg-slate-900/50 rounded-xl p-3">
                        <p className="text-xs text-slate-500 mb-1">Payouts Enabled</p>
                        <p className={`text-sm font-bold ${accountInfo.payoutsEnabled ? 'text-emerald-400' : 'text-red-400'}`}>
                          {accountInfo.payoutsEnabled ? 'Yes ✓' : 'No ✗'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-emerald-500/20">
                    <a
                      href={`https://dashboard.stripe.com/${accountInfo.accountId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      Open this account in Stripe Dashboard →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-red-400 font-bold mb-2">Error Loading Account Info</p>
                  <p className="text-sm text-slate-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-blue-400 font-bold mb-2">How to Find Your Stripe Account</p>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                  Your booking system is connected to a Stripe account via an API key stored in Supabase secrets.
                  To find which account is receiving payments:
                </p>
                <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                  <li>Try logging into these Stripe accounts:
                    <ul className="ml-6 mt-1 space-y-1 list-disc list-inside text-slate-400">
                      <li>grantashl1@gmail.com</li>
                      <li>bookings@carlsonproperties.co.nz</li>
                      <li>Any other email you might have used for Stripe</li>
                    </ul>
                  </li>
                  <li className="mt-2">Once logged in, go to <strong>Payments</strong> → <strong>All payments</strong></li>
                  <li>Search for one of the payment identifiers below</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Search Instructions */}
          <div className="space-y-6">
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/30">
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Search by Stripe Session ID</span>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 mb-3">
                <p className="text-xs text-slate-500 mb-2">Latest booking session ID:</p>
                <p className="font-mono text-xs text-purple-300 break-all">{sessionId}</p>
              </div>
              <p className="text-xs text-slate-400">
                Copy this ID and paste it into the Stripe search bar. If it shows up, you're in the correct account!
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/30">
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Search by Customer Email</span>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 mb-3">
                <p className="text-xs text-slate-500 mb-2">Recent customer emails:</p>
                <div className="space-y-1">
                  <p className="font-mono text-xs text-emerald-300">lesley.walter@greymouthpetroleum.co.nz</p>
                  <p className="font-mono text-xs text-emerald-300">kngapeka@gmail.com</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Search for these customer emails in your Stripe payments to verify they exist.
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/30">
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Search by Amount</span>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 mb-3">
                <p className="text-xs text-slate-500 mb-2">Recent payment amounts (NZD):</p>
                <div className="space-y-1">
                  <p className="font-mono text-xs text-amber-300">$3,442.50 (Lesley Walter - Feb 5, 2027)</p>
                  <p className="font-mono text-xs text-amber-300">$4,590.00 (Kristy Ngapeka - Apr 1, 2026)</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Filter payments by these amounts to find your bookings.
              </p>
            </div>
          </div>

          {/* Alternative: Check Supabase */}
          <div className="mt-8 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-amber-400 font-bold mb-2">✅ BEST METHOD: Check Supabase Configuration</p>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                  The Stripe account is determined by the <span className="font-mono bg-slate-900/50 px-2 py-1 rounded text-amber-300">STRIPE_SECRET_KEY</span> environment variable in Supabase.
                </p>
                <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                  <li>Go to your Supabase dashboard: <a href="https://supabase.com/dashboard/project/hxprmevheigajzqehjgf" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Open Supabase →</a></li>
                  <li>Navigate to <strong>Project Settings</strong> → <strong>Edge Functions</strong> → <strong>Secrets</strong></li>
                  <li>Look for <span className="font-mono bg-slate-900/50 px-2 py-1 rounded text-purple-300">STRIPE_SECRET_KEY</span></li>
                  <li>Copy the last 6-8 characters of the key value</li>
                  <li>Then for each potential Stripe account:
                    <ul className="ml-6 mt-2 space-y-1 list-disc list-inside text-slate-400">
                      <li>Log into stripe.com with that email</li>
                      <li>Click <strong>Developers</strong> → <strong>API keys</strong></li>
                      <li>Look at your "Secret key" - reveal it if needed</li>
                      <li>Compare the last 6-8 characters with the Supabase key</li>
                      <li><strong className="text-emerald-400">If they match → This is your active Stripe account!</strong></li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Email Search Tip */}
          <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-blue-400 font-bold mb-2">💡 Quick Tip: Check Your Emails</p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Search ALL your email inboxes (Gmail, etc.) for emails from <strong>Stripe</strong> containing:
                </p>
                <ul className="text-sm text-slate-300 mt-2 space-y-1 list-disc list-inside ml-4">
                  <li>Subject line: "Payment from Lesley Walter" or similar</li>
                  <li>Amount: "$3,442.50" or "$4,590.00"</li>
                  <li>Date: Early April 2026 or Mid-March 2026</li>
                </ul>
                <p className="text-sm text-slate-400 mt-3">
                  Whichever inbox received these Stripe payment notifications = Your active Stripe account email! 📧
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <a
              href="https://dashboard.stripe.com/payments"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-500 to-purple-700 text-white py-4 px-6 rounded-xl font-semibold text-center hover:shadow-lg hover:shadow-purple-500/20 transition-all"
            >
              Open Stripe Dashboard →
            </a>
            <a
              href="/view-latest-booking"
              className="bg-slate-700 text-white py-4 px-6 rounded-xl font-semibold text-center hover:bg-slate-600 transition-all"
            >
              View Latest Booking Details
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
