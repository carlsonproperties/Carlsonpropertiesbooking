import React, { useState } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { toast } from "sonner";
import { UserPlus, Loader2 } from "lucide-react";

export function CreateBookingsUser() {
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);

  const createUser = async () => {
    setLoading(true);
    
    try {
      console.log("Creating bookings@carlsonproperties.co.nz user...");
      
      const res = await fetch(`https://${projectId.trim()}.supabase.co/functions/v1/make-server-edef7798/signup`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey.trim()}`
        },
        body: JSON.stringify({ 
          email: "bookings@carlsonproperties.co.nz", 
          password: "Gue$t111", 
          name: "Carlson Properties Bookings" 
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        // Check if user already exists
        if (data.error && data.error.includes("already been registered")) {
          toast.success("Account Already Exists!", { 
            description: "This account was already created. You can sign in at /owner-login" 
          });
          setCreated(true);
          return;
        }
        throw new Error(data.error || 'Failed to create account');
      }
      
      console.log("User created successfully:", data);
      toast.success("Account Created", { 
        description: "bookings@carlsonproperties.co.nz is ready to use!" 
      });
      setCreated(true);
    } catch (error: any) {
      console.error("Creation error:", error);
      toast.error("Error", { 
        description: error.message || "Failed to create user account" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-[#9DA07E]/10 rounded-2xl flex items-center justify-center text-[#9DA07E] mx-auto">
          <UserPlus size={40} />
        </div>
        
        <h1 className="text-3xl font-serif text-slate-900">Create Bookings Account</h1>
        
        <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-3 text-sm">
          <div>
            <span className="text-slate-500 text-xs uppercase tracking-widest font-bold">Email:</span>
            <p className="text-slate-900 font-medium">bookings@carlsonproperties.co.nz</p>
          </div>
          <div>
            <span className="text-slate-500 text-xs uppercase tracking-widest font-bold">Password:</span>
            <p className="text-slate-900 font-medium">Gue$t111</p>
          </div>
          <div>
            <span className="text-slate-500 text-xs uppercase tracking-widest font-bold">Access:</span>
            <p className="text-slate-900 font-medium">Full Owner Portal</p>
          </div>
        </div>

        {!created ? (
          <button
            onClick={createUser}
            disabled={loading}
            className="w-full bg-[#9DA07E] text-white font-bold py-4 rounded-2xl hover:bg-[#8A8D6D] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <UserPlus size={20} />}
            Create User Account
          </button>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <p className="text-green-800 font-bold">✅ Account Created Successfully!</p>
            <p className="text-green-600 text-sm mt-2">You can now sign in at /owner-login</p>
          </div>
        )}

        <p className="text-slate-400 text-xs">This is a one-time setup utility</p>
      </div>
    </div>
  );
}