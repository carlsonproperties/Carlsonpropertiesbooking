import React from 'react';
import { Phone, Mail, Clock } from 'lucide-react';
import { CarlsonLogo } from '../components/CarlsonLogo';

export function Maintenance() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-8 rounded-3xl shadow-2xl">
            <CarlsonLogo className="w-24 h-24" />
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[40px] shadow-2xl p-12 md:p-16 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#9DA07E]/10 mb-8">
            <Clock className="text-[#9DA07E]" size={40} />
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl md:text-5xl text-slate-900 mb-4 uppercase tracking-tight">
            Closed for Maintenance
          </h1>

          {/* Subheading */}
          <p className="text-slate-600 text-lg mb-12 leading-relaxed">
            We're currently updating our booking system to serve you better.
            <br />
            Thank you for your patience.
          </p>

          {/* Divider */}
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#9DA07E] to-transparent mx-auto mb-12" />

          {/* Contact Information */}
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-inner">
            <h2 className="font-serif text-2xl text-slate-900 mb-6 uppercase tracking-tight">
              Direct Bookings Available
            </h2>
            
            <p className="text-slate-600 mb-8">
              For immediate booking inquiries, please contact Ashleigh directly:
            </p>

            {/* Phone Number - Primary CTA */}
            <a 
              href="tel:0276977961"
              className="inline-flex items-center gap-4 bg-gradient-to-r from-[#9DA07E] to-[#8a8d6e] text-white px-8 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 mb-6"
            >
              <Phone size={28} />
              <span>027 697 7961</span>
            </a>

            {/* Alternative Contact Info */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-4">
                Or reach out via
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-slate-600">
                <a 
                  href="sms:0276977961" 
                  className="flex items-center gap-2 hover:text-[#9DA07E] transition-colors"
                >
                  <Mail size={18} />
                  <span className="text-sm font-medium">Text Message</span>
                </a>
                <span className="hidden sm:block text-slate-300">|</span>
                <a 
                  href="https://wa.me/640276977961" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#9DA07E] transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span className="text-sm font-medium">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-slate-400 mt-10 uppercase tracking-widest">
            111 Jarden Mile, Taupo • New Zealand
          </p>
        </div>

        {/* Expected Return */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            We expect to be back online shortly. Thank you for your understanding.
          </p>
        </div>
      </div>
    </div>
  );
}
