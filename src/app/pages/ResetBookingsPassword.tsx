import React, { useState } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { toast } from "sonner";
import { KeyRound, Loader2, CheckCircle } from "lucide-react";

export function ResetBookingsPassword() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const resetPassword = async () => {
    setLoading(true);
    
    try {
      console.log("Resetting password for bookings@carlsonproperties.co.nz...");
      
      // Call a new endpoint we'll create to reset the password
      const res = await fetch(`https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/reset-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey.trim()}`
        },
        body: JSON.stringify({ 
          email: "bookings@carlsonproperties.co.nz", 
          newPassword: "Gue$t111"
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }
      
      console.log("Password reset successfully:", data);
      toast.success("Password Reset!", { 
        description: "You can now sign in with the new password" 
      });
      setSuccess(true);
    } catch (error: any) {
      console.error("Reset error:", error);
      toast.error("Error", { 
        description: error.message || "Failed to reset password" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mx-auto">
          <KeyRound size={40} />
        </div>
        
        <h1 className="text-3xl font-serif text-slate-900">Reset Password</h1>
        
        <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-3 text-sm">
          <div>
            <span className="text-slate-500 text-xs uppercase tracking-widest font-bold">Email:</span>
            <p className="text-slate-900 font-medium">bookings@carlsonproperties.co.nz</p>
          </div>
          <div>
            <span className="text-slate-500 text-xs uppercase tracking-widest font-bold">New Password:</span>
            <p className="text-slate-900 font-medium">Gue$t111</p>
          </div>
        </div>

        {!success ? (
          <button
            onClick={resetPassword}
            disabled={loading}
            className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <KeyRound size={20} />}
            Reset Password
          </button>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-green-800 font-bold">✅ Password Reset Successfully!</p>
            <p className="text-green-600 text-sm mt-2">You can now sign in at /owner-login</p>
            <a 
              href="/owner-login"
              className="mt-4 inline-block bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-green-700 transition-all"
            >
              Go to Login
            </a>
          </div>
        )}

        <p className="text-slate-400 text-xs">Admin utility for password management</p>
      </div>
    </div>
  );
}
