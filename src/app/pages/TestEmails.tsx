import React, { useState } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { getOwnerToken } from "../lib/supabase";
import { Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function TestEmails() {
  const [email, setEmail] = useState('grantashl1@gmail.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const sendTestEmails = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const url = `https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/test-emails?email=${encodeURIComponent(email)}`;
      console.log('Sending test emails to:', email);
      console.log('URL:', url);
      
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${await getOwnerToken()}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send test emails');
      }

      setResult(data);
      console.log('✅ Test emails sent successfully:', data);
    } catch (err: any) {
      console.error('❌ Error sending test emails:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/20 rounded-full mb-6">
            <Mail className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Email Template Tester</h1>
          <p className="text-slate-300 text-lg">
            Send all 6 booking email templates to test their design and content
          </p>
        </div>

        {/* Email Input */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-8">
          <label className="block mb-3 font-semibold text-sm uppercase tracking-wider text-emerald-400">
            Test Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-6 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
          
          <button
            onClick={sendTestEmails}
            disabled={loading || !email}
            className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-lg transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending Test Emails...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                Send All Test Emails
              </>
            )}
          </button>
        </div>

        {/* Success Result */}
        {result && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 mb-8 animate-fade-in">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-8 h-8 text-emerald-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-emerald-400 mb-3">
                  ✅ Test Emails Sent Successfully!
                </h3>
                <p className="text-slate-300 mb-6">
                  {result.message}
                </p>
                
                <div className="bg-slate-900/50 rounded-xl p-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                    Emails Sent:
                  </h4>
                  <ul className="space-y-3">
                    {result.emails?.map((emailDesc: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-emerald-400 font-mono">✓</span>
                        <span className="text-slate-200">{emailDesc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-200">
                    <strong>📬 Check your inbox:</strong> {email}
                  </p>
                  <p className="text-xs text-blue-300 mt-1">
                    (Don't forget to check spam/junk folder)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Result */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 mb-8 animate-fade-in">
            <div className="flex items-start gap-4">
              <XCircle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-400 mb-3">
                  ❌ Error Sending Emails
                </h3>
                <p className="text-slate-300">
                  {error}
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  Check the browser console for more details.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Email List */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          <h3 className="text-xl font-bold mb-6">Email Templates Being Tested</h3>
          <div className="space-y-4">
            {[
              { num: '1', title: 'Booking Confirmation', timing: 'Immediate', desc: 'Thank you + bedding config + guidebook preview' },
              { num: '2', title: 'Owner Notification', timing: 'Immediate', desc: 'Sent to bookings@carlsonproperties.co.nz' },
              { num: '3', title: 'Pre-Arrival Info', timing: '4 days before check-in', desc: 'Door code + WiFi + house manual link' },
              { num: '4', title: 'Check-In Welcome', timing: '9am on check-in day', desc: 'Welcome + milk reminder + contact number' },
              { num: '5', title: 'Check-Out Instructions', timing: '9am on checkout day', desc: 'Dishwasher + rubbish + bed stripping' },
              { num: '6', title: 'Review Request', timing: '2 days after checkout', desc: 'Thank you + Google review link' }
            ].map((item) => (
              <div key={item.num} className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50 hover:border-emerald-500/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-400">
                    {item.num}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h4 className="font-bold text-white">{item.title}</h4>
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded whitespace-nowrap">
                        {item.timing}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
          <h4 className="font-bold text-blue-300 mb-3 flex items-center gap-2">
            <span>ℹ️</span>
            Note About Timing
          </h4>
          <p className="text-sm text-blue-200 leading-relaxed">
            The test emails will all be sent immediately. In production, emails 1-2 send immediately after payment, 
            while emails 3-6 are scheduled based on the booking dates (requires cron job setup).
          </p>
        </div>
      </div>
    </div>
  );
}
