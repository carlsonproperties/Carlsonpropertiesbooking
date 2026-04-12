import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { supabase } from "../lib/supabase";
import { motion } from "motion/react";
import { Lock, Loader2, CheckCircle, ArrowLeft, KeyRound } from "lucide-react";
import { toast } from "sonner";

export function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user came from a valid reset link
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      // If no session, redirect to login
      if (!session) {
        toast.error("Invalid Reset Link", {
          description: "This password reset link is invalid or has expired. Please request a new one."
        });
        setTimeout(() => navigate("/owner-login"), 2000);
      }
    };

    checkSession();
  }, [navigate]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords Don't Match", {
        description: "Please make sure both passwords match."
      });
      return;
    }

    if (password.length < 8) {
      toast.error("Password Too Short", {
        description: "Password must be at least 8 characters long."
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast.success("Password Updated", {
        description: "Your password has been successfully reset."
      });

      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/owner-login");
      }, 2000);

    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error("Reset Failed", {
        description: error.message || "Failed to update password."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <Link
        to="/owner-login"
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm">Back to Login</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-10 shadow-2xl">
          {/* Logo/Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-[#9DA07E] to-[#7A7E5F] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-[#9DA07E]/20">
              <KeyRound className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-slate-400 text-sm">Enter your new password</p>
          </div>

          {!success ? (
            <form onSubmit={handlePasswordReset} className="space-y-6">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#9DA07E] transition-colors"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#9DA07E] transition-colors"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#9DA07E] to-[#7A7E5F] text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#9DA07E]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-5 h-5" />
                    <span>Reset Password</span>
                  </>
                )}
              </button>

              {/* Password Requirements */}
              <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Password must be at least 8 characters long
                </p>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/10 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
              <p className="text-slate-400 text-sm mb-6">
                Your password has been reset. Redirecting to login...
              </p>
              <div className="flex items-center justify-center gap-2 text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs">Redirecting...</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
