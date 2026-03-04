import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Instagram, Facebook, Home, Info, Users, Calendar, Shield, Lock } from "lucide-react";
import { Link } from "react-router";
import { CarlsonLogo } from "./CarlsonLogo";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const menuItems = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    { name: "About the Property", path: "/about", icon: <Info size={20} /> },
    { name: "Meet Your Hosts", path: "/meet-hosts", icon: <Users size={20} /> },
    { name: "Guest Information", path: "/guest-info", icon: <Calendar size={20} /> },
    { name: "Owner Portal", path: "/owner-login", icon: <Lock size={20} /> },
    { name: "Book Your Stay", path: "/book", icon: <Shield size={20} />, primary: true },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[1000]"
          />

          {/* Menu Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-[1001] shadow-2xl flex flex-col"
          >
            <div className="p-8 flex justify-between items-center border-b border-slate-100">
              <Link to="/" onClick={onClose}>
                <CarlsonLogo dark={true} />
              </Link>
              <button 
                onClick={onClose}
                className="p-2 bg-slate-100 rounded-full text-slate-900 hover:bg-[#9DA07E] hover:text-white transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-8 space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-4 p-5 rounded-2xl transition-all ${
                    item.primary 
                    ? "bg-[#9DA07E] text-white shadow-lg shadow-[#9DA07E]/20" 
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className={`${item.primary ? "text-white" : "text-[#9DA07E]"}`}>
                    {item.icon}
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest">{item.name}</span>
                </Link>
              ))}
            </nav>

            <div className="p-8 border-t border-slate-100">
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-6 text-center">Follow our journey</p>
              <div className="flex justify-center gap-6">
                <a 
                  href="https://www.instagram.com/oneelevenonthemile" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#9DA07E] hover:text-white hover:border-[#9DA07E] transition-all"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href="https://www.facebook.com/p/One-Eleven-On-The-Mile-61563014557673/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#9DA07E] hover:text-white hover:border-[#9DA07E] transition-all"
                >
                  <Facebook size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}