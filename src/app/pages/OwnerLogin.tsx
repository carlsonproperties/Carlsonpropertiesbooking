import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { supabase } from "../lib/supabase";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { motion } from "motion/react";
import { Mail, Lock, LogIn, ShieldCheck, ArrowLeft, Loader2, User, KeyRound } from "lucide-react";
import { toast } from "sonner";

const AUTHORIZED_EMAILS = ["grantashl1@gmail.com", "donki.bmbr@gmail.com", "bookings@carlsonproperties.co.nz"];

export function OwnerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // If session exists but email is not authorized, sign them out
      if (session?.user?.email && !AUTHORIZED_EMAILS.includes(session.user.email.toLowerCase())) {
        await supabase.auth.signOut();
        toast.error("Unauthorized Access", { 
          description: "Your email is not on the authorized list." 
        });
        return;
      }
      
      // If session exists and IS authorized, redirect to dashboard
      if (session?.user?.email && AUTHORIZED_EMAILS.includes(session.user.email.toLowerCase())) {
        navigate("/dashboard");
      }
    };
    checkUser();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanEmail = email.toLowerCase().trim();

    if (!AUTHORIZED_EMAILS.includes(cleanEmail)) {
      toast.error("Access Denied", { 
        description: "This email address is not authorized to access the Owner Portal." 
      });
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        console.log("Attempting secure signup via edge function...");
        
        const res = await fetch(`https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/signup`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey.trim()}`
          },
          body: JSON.stringify({ 
            email: cleanEmail, 
            password: password.trim(), 
            name: name || cleanEmail.split('@')[0] 
          })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          // Check if user already exists
          if (data.error && data.error.includes("already been registered")) {
            throw new Error("This email is already registered. Please sign in instead using the link below.");
          }
          throw new Error(data.error || 'Failed to create account');
        }
        
        toast.success("Account Ready", { 
          description: "Your account has been created. Signing you in..." 
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password.trim(),
        });

        if (signInError) {
          console.error("Auto-login failed:", signInError);
          setIsSignUp(false);
          throw new Error("Account created but auto-login failed. Please try signing in manually.");
        }

        toast.success("Success", { description: "Redirecting to Dashboard..." });
        navigate("/dashboard");
      } else {
        console.log("Attempting sign in...");
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password.trim(),
        });
        
        if (error) {
          if (error.message.toLowerCase().includes("invalid login credentials")) {
            throw new Error("Invalid email or password. If you haven't created an account yet, please use the 'Create Account' link below.");
          }
          throw error;
        }
        
        toast.success("Welcome back", { description: "Accessing Owner Portal..." });
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error("Security Error", { description: error.message || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const cleanEmail = email.toLowerCase().trim();
    
    if (!cleanEmail) {
      toast.error("Email Required", { 
        description: "Please enter your email address first." 
      });
      return;
    }

    if (!AUTHORIZED_EMAILS.includes(cleanEmail)) {
      toast.error("Access Denied", { 
        description: "This email address is not authorized to access the Owner Portal." 
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success("Password Reset Email Sent", { 
        description: "Check your inbox for the password reset link." 
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error("Error", { 
        description: error.message || "Failed to send password reset email." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <Link 
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm">Back to Home</span>
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
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Owner Portal</h1>
            <p className="text-slate-400 text-sm">Secure access for property managers</p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-6">
            {/* Name (only for signup) */}
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#9DA07E] transition-colors"
                    placeholder="Your name"
                  />
                </div>
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#9DA07E] transition-colors"
                  placeholder="owner@carlsonproperties.co.nz"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#9DA07E] transition-colors"
                  placeholder="Enter your password"
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
                  <span>{isSignUp ? "Creating Account..." : "Signing In..."}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 pt-8 border-t border-white/5 text-center space-y-3">
            {!isSignUp && (
              <button 
                onClick={handleForgotPassword}
                disabled={loading}
                className="text-xs text-slate-500 hover:text-[#9DA07E] transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                <KeyRound size={14} />
                Forgot Password?
              </button>
            )}
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                toast.dismiss();
              }}
              className="text-xs text-slate-500 hover:text-white transition-colors block w-full"
            >
              {isSignUp ? "Already have access? Sign In" : "Need to set up access? Create Account"}
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-slate-900/50 border border-slate-700/30 rounded-xl p-4">
            <p className="text-xs text-slate-500 text-center leading-relaxed">
              🔒 Access is restricted to authorized email addresses only. Contact the administrator if you need access.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
