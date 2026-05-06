import React, { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { Loader2, CreditCard, Mail, CheckCircle, AlertCircle } from "lucide-react";

export function StripeInfo() {
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
          'Authorization': `Bearer ${publicAnonKey.trim()}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch account info');
      }

      setAccountInfo(data);
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcf8] p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border border-[#9DA07E]/20 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-[#9DA07E]/10 rounded-2xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-[#9DA07E]" />
            </div>
            <div>
              <h1 className="text-2xl font-serif text-[#2D2D2D]">Stripe Account Information</h1>
              <p className="text-sm text-[#9DA07E] font-medium">Connected account details</p>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#9DA07E] animate-spin mr-3" />
              <span className="text-[#2D2D2D]/60">Loading account info...</span>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-red-900 font-bold mb-2">Error Loading Account</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!loading && accountInfo && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-green-900 font-bold mb-4 text-lg">✅ Stripe Account Connected</p>

                    <div className="space-y-3">
                      <div className="bg-white rounded-xl p-4 border border-green-200">
                        <p className="text-xs text-[#2D2D2D]/60 mb-2">Account Email</p>
                        <p className="text-xl font-bold text-green-700 flex items-center gap-2">
                          <Mail className="w-5 h-5" />
                          {accountInfo.email}
                        </p>
                      </div>

                      <div className="bg-white rounded-xl p-4 border border-green-200">
                        <p className="text-xs text-[#2D2D2D]/60 mb-2">Account ID</p>
                        <p className="text-sm font-mono text-[#2D2D2D]">{accountInfo.accountId}</p>
                      </div>

                      {accountInfo.businessName && accountInfo.businessName !== 'Not set' && (
                        <div className="bg-white rounded-xl p-4 border border-green-200">
                          <p className="text-xs text-[#2D2D2D]/60 mb-2">Business Name</p>
                          <p className="text-sm font-medium text-[#2D2D2D]">{accountInfo.businessName}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-xl p-3 border border-green-200">
                          <p className="text-xs text-[#2D2D2D]/60 mb-1">Country</p>
                          <p className="text-sm font-medium text-[#2D2D2D]">{accountInfo.country}</p>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-green-200">
                          <p className="text-xs text-[#2D2D2D]/60 mb-1">Currency</p>
                          <p className="text-sm font-medium text-[#2D2D2D]">{accountInfo.currency?.toUpperCase()}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-xl p-3 border border-green-200">
                          <p className="text-xs text-[#2D2D2D]/60 mb-1">Charges Enabled</p>
                          <p className={`text-sm font-bold ${accountInfo.chargesEnabled ? 'text-green-600' : 'text-red-600'}`}>
                            {accountInfo.chargesEnabled ? 'Yes ✓' : 'No ✗'}
                          </p>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-green-200">
                          <p className="text-xs text-[#2D2D2D]/60 mb-1">Payouts Enabled</p>
                          <p className={`text-sm font-bold ${accountInfo.payoutsEnabled ? 'text-green-600' : 'text-red-600'}`}>
                            {accountInfo.payoutsEnabled ? 'Yes ✓' : 'No ✗'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                      <a
                        href="https://dashboard.stripe.com/balance/overview"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#635bff] hover:bg-[#5248e4] text-white transition-all font-medium"
                      >
                        View Stripe Balance & Payouts
                      </a>
                      <a
                        href="https://dashboard.stripe.com/payments"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white border border-[#9DA07E]/30 hover:bg-[#9DA07E]/5 text-[#2D2D2D] transition-all font-medium"
                      >
                        View All Payments
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[#9DA07E]/5 rounded-2xl border border-[#9DA07E]/10">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#9DA07E] mb-3">
                  About Your Stripe Account
                </h3>
                <ul className="space-y-2 text-sm text-[#2D2D2D]/70">
                  <li>• This is the Stripe account receiving all direct booking payments</li>
                  <li>• Funds are held in Stripe and automatically paid out to your bank account</li>
                  <li>• Default payout schedule is usually 2-7 days after payment</li>
                  <li>• You can adjust payout timing in Stripe Dashboard → Settings → Bank accounts and scheduling</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
