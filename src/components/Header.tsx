import { Coffee, Flame, Phone, MapPin, Clock, Compass, Key } from 'lucide-react';

interface HeaderProps {
  onSelectCategory: (cat: string) => void;
  activeCategory: string;
  onOpenAdmin: () => void;
}

export default function Header({ onSelectCategory, activeCategory, onOpenAdmin }: HeaderProps) {
  return (
    <header className="bg-white border-b border-neutral-100 flex flex-col pt-3 pb-2 px-4 sticky top-0 z-40 shadow-xs">
      
      {/* Upper info band - responsive visibility */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-[11px] text-neutral-500 font-bold border-b border-neutral-50 pb-2 mb-2 hidden sm:flex font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 hover:text-rose-600 transition-colors">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>Bole Road, Addis Ababa, Ethiopia (Behind Cameroon St.)</span>
          </span>
          <span className="text-neutral-200">|</span>
          <span className="flex items-center gap-1.5 hover:text-amber-500 transition-colors">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Daily: 7:00 AM - 11:00 PM</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-neutral-400 font-medium uppercase mr-1">Hotline:</span>
          <span className="flex items-center gap-1 text-neutral-850 bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full border border-rose-100 font-mono text-xs">
            <Phone className="w-3 h-3" />
            +251 91 123 4567
          </span>
        </div>
      </div>

      {/* Primary Brand Navigation container */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 select-none">
          <div className="relative flex items-center justify-center">
            {/* Logo Icon Ring */}
            <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center border-2 border-amber-400 shadow-md">
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
            </div>
            {/* Mini decorative star badge */}
            <span className="absolute -top-1 -right-1 bg-amber-400 text-neutral-950 font-black text-[8px] px-1 rounded-full border border-white font-mono">
              ★
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <h1 className="text-lg sm:text-xl font-black text-neutral-900 tracking-tighter leading-none">
                WOW<span className="text-rose-600 font-black">BURGER</span>
              </h1>
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-sm shrink-0">
                café
              </span>
            </div>
            <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-black leading-none mt-1 font-mono">
              gourmet & artisan roast
            </p>
          </div>
        </div>

        {/* Action Link to Jump to Menu Grid */}
        <div className="flex items-center gap-2">
          {/* Quick Phone Call Hotline for mobile viewports */}
          <a
            href="tel:+251911234567"
            className="flex sm:hidden items-center justify-center p-2 rounded-full text-rose-600 hover:bg-rose-50 border border-rose-100 active:scale-95 transition-all"
            title="Call Restaurant"
          >
            <Phone className="w-4 h-4" />
          </a>

          {/* Admin Back-office trigger button */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 bg-rose-50 border-rose-100 hover:bg-rose-100 text-rose-700 text-xs font-bold px-3 py-2 rounded-xl transition-all border shrink-0"
            title="Access Back-office Admin Console"
          >
            <Key className="w-3.5 h-3.5 text-rose-600 fill-rose-50/10" />
            <span className="hidden xs:inline">Manager Portal</span>
          </button>

          <button
            onClick={() => onSelectCategory('burgers')}
            className="flex items-center gap-1.5 bg-neutral-900 hover:bg-rose-600 active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md active:bg-rose-700 font-sans border border-neutral-800 shrink-0"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Explore Menu</span>
          </button>
        </div>

      </div>
    </header>
  );
}
