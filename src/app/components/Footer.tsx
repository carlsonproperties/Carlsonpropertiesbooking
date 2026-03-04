import * as React from "react";
import { Link } from "react-router";
import { Star, Instagram, Facebook } from "lucide-react";
import { CarlsonLogo } from "./CarlsonLogo";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white py-24 px-6 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2">
            <CarlsonLogo />
            <p className="mt-8 text-slate-400 max-w-sm leading-relaxed text-left">
              Experience Airbnb perfection in Taupō at One Eleven On The Mile.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <div className="flex text-[#9DA07E]">
                <Star size={12} fill="#9DA07E" />
                <Star size={12} fill="#9DA07E" />
                <Star size={12} fill="#9DA07E" />
                <Star size={12} fill="#9DA07E" />
                <Star size={12} fill="#9DA07E" />
              </div>
              <a href="https://g.page/r/CZuTLT-YqNStEBM/review" target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-widest font-bold text-slate-500 hover:text-[#9DA07E] transition-colors">
                5.0 Stars on Google
              </a>
            </div>
            <div className="flex gap-6 mt-10">
              <a href="https://www.instagram.com/oneelevenonthemile" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#9DA07E] hover:border-[#9DA07E] transition-all">
                <Instagram size={18} />
              </a>
              <a href="https://www.facebook.com/p/One-Eleven-On-The-Mile-61563014557673/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#9DA07E] hover:border-[#9DA07E] transition-all">
                <Facebook size={18} />
              </a>
            </div>
          </div>
          
          <div className="text-left">
            <h5 className="font-serif text-xl mb-6 text-white text-left">Explore</h5>
            <ul className="space-y-4 text-slate-400 text-sm font-medium uppercase tracking-widest text-left">
              <li><Link to="/about" className="hover:text-[#9DA07E] transition-colors">About the Property</Link></li>
              <li><Link to="/guest-info" className="hover:text-[#9DA07E] transition-colors">Guest Info</Link></li>
              <li><Link to="/meet-hosts" className="hover:text-[#9DA07E] transition-colors">Meet Hosts</Link></li>
              <li><Link to="/book" className="hover:text-[#9DA07E] transition-colors">Book Now</Link></li>
            </ul>
          </div>

          <div className="text-left">
            <h5 className="font-serif text-xl mb-6 text-white text-left">Further Information</h5>
            <ul className="space-y-4 text-slate-400 text-sm font-medium uppercase tracking-widest text-left">
              <li><Link to="/terms" className="hover:text-[#9DA07E] transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-[#9DA07E] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/refund" className="hover:text-[#9DA07E] transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          <div className="text-left">
            <h5 className="font-serif text-xl mb-6 text-white text-left">Contact</h5>
            <p className="text-slate-400 text-sm mb-4 text-left">Taupō, New Zealand</p>
            <a href="mailto:bookings@carlsonproperties.co.nz" className="text-slate-200 font-bold underline decoration-[#9DA07E] decoration-2 underline-offset-8 block w-fit">bookings@carlsonproperties.co.nz</a>
          </div>
        </div>
        
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">© 2026 One Eleven On The Mile</span>
          <div className="flex gap-10">
            <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">One Eleven</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">Direct Booking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
