"use client";

import { MapPin, Phone, Clock, Mail, Instagram, Compass, Heart, Award } from 'lucide-react';

interface FooterProps {
  onBackToTop: () => void;
}

export default function Footer({ onBackToTop }: FooterProps) {
  return (
    <footer className="bg-neutral-950 text-white pt-14 pb-8 px-6 border-t border-white/5 relative overflow-hidden">
      
      {/* Upper radial ambient glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-white/5 pb-10">
        
        {/* Brand Summary column (Grid span 4) */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center border border-amber-400 font-black text-white text-sm">
              W
            </div>
            <h3 className="text-lg font-black tracking-wider uppercase">
              WOW<span className="text-rose-500">BURGER</span> Café
            </h3>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
            Wow Burger is Addis Ababa's trendiest café-inspired gourmet burger lounge. 
            By marrying fine-grilled artisanal ingredients with world-famous single-origin Ethiopian coffee beans, 
            we create an authentic upscale dining experience representing local hospitality.
          </p>

          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs font-bold text-neutral-500 mr-2">Follow Us on Socials:</span>
            <a href="#instagram" className="p-2 bg-white/5 hover:bg-rose-600/20 text-neutral-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/20 rounded-lg transition-all">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#compass" className="p-2 bg-white/5 hover:bg-rose-600/20 text-neutral-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/20 rounded-lg transition-all">
              <Compass className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Contact info column (Grid span 4) */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest">
            the lounge location
          </h4>
          <ul className="space-y-4 text-xs font-semibold text-neutral-300">
            <li className="flex gap-2.5 items-start">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-bold">Bole Road, Addis Ababa</p>
                <p className="text-[11px] text-neutral-500 mt-0.5 font-medium">
                  Cameroon St. Crossing, Adjacent to Bole Medhanialem Cathedral, Addis Ababa, Ethiopia
                </p>
              </div>
            </li>
            <li className="flex gap-2.5 items-center">
              <Phone className="w-4 h-4 text-rose-500 shrink-0" />
              <div>
                <p className="text-white font-bold">+251 91 123 4567</p>
                <p className="text-[10px] text-neutral-550 font-mono mt-0.5">Custom Hotline Support</p>
              </div>
            </li>
            <li className="flex gap-2.5 items-center">
              <Mail className="w-4 h-4 text-rose-500 shrink-0" />
              <span>hello@wowburgeraddis.com</span>
            </li>
          </ul>
        </div>

        {/* Operating hours column (Grid span 3) */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest">
            Lounge Hours
          </h4>
          <ul className="space-y-3.5 text-xs text-neutral-400 font-semibold">
            <li className="flex justify-between items-center border-b border-white/5 pb-1.5">
              <span>Weekdays</span>
              <span className="text-white font-mono">07:00 AM – 11:00 PM</span>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-1.5">
              <span>Weekends</span>
              <span className="text-white font-mono">08:00 AM – Midnight</span>
            </li>
            <li className="flex justify-between items-center text-amber-500 font-bold bg-amber-500/5 px-2.5 py-1.5 border border-amber-500/10 rounded-lg">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>Specialty Brew Hour</span>
              </div>
              <span className="text-white font-mono font-medium text-[11px]">Starts 07:00 AM</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Styled vector directions/ambiance showcase mimicking location map directions */}
      <div className="max-w-7xl mx-auto mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4 font-semibold">
        <div className="flex items-center gap-1">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse inline" />
          <span>representing Ethiopian Hospitality. All Rights Reserved © 2026 Wow Burger Café.</span>
        </div>

        <button
          onClick={onBackToTop}
          className="text-[10px] tracking-wider uppercase text-neutral-400 hover:text-white bg-white/5 hover:bg-rose-600 border border-white/5 px-3 py-1.5 rounded-xl transition-all shadow-inner hover:scale-105 active:scale-95 cursor-pointer"
        >
          ↑ Back to Top
        </button>
      </div>

    </footer>
  );
}
