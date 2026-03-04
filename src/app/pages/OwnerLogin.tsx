import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { supabase } from "../lib/supabase";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ShieldCheck, ArrowLeft, Loader2, User } from "lucide-react";
import { toast } from "sonner";

const AUTHORIZED_EMAILS = ["grantashl1@gmail.com", "donki.bmbr@gmail.com"];

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 selection:bg-[#9DA07E] selection:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(157,160,126,0.05),transparent_50%)]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#9DA07E] transition-colors mb-8 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Site</span>
          </Link>
          
          <div className="w-16 h-16 bg-[#9DA07E]/10 rounded-2xl flex items-center justify-center text-[#9DA07E] mx-auto mb-6">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-4xl font-serif text-white mb-3">Owner Portal</h1>
          <p className="text-slate-500 text-sm tracking-widest uppercase">Secure Management Access</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-10 shadow-2xl">
          <form onSubmit={handleAuth} className="space-y-6">
            {isSignUp && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ashleigh Carlson"
                    required={isSignUp}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 focus:border-[#9DA07E]/50 outline-none transition-all"
                  />
                </div>
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 focus:border-[#9DA07E]/50 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your secure password"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 focus:border-[#9DA07E]/50 outline-none transition-all"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#9DA07E] text-black font-black py-5 rounded-2xl text-[11px] tracking-widest uppercase hover:bg-white hover:shadow-xl hover:shadow-[#9DA07E]/20 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:scale-100"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
              {isSignUp ? "Create Secure Account" : "Access Portfolio"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                toast.dismiss();
              }}
              className="text-xs text-slate-500 hover:text-white transition-colors"
            >
              {isSignUp ? "Already have access? Sign In" : "Need to set up access? Create Account"}
            </button>
          </div>
        </div>

        <p className="mt-12 text-center text-slate-600 text-[10px] uppercase tracking-[0.3em] leading-relaxed">
          Authorized personnel only.<br />
          Access restricted to Carlson Properties Administrators.
        </p>
      </motion.div>
    </div>
  );
}
