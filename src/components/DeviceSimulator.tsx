import { useState, ReactNode } from 'react';
import { Smartphone, Tablet, Monitor, RefreshCw, Sparkles, MapPin, Eye, Phone, ArrowUpRight } from 'lucide-react';

export type DeviceMode = 'mobile' | 'tablet' | 'desktop' | 'responsive';

interface DeviceSimulatorProps {
  children: ReactNode;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  onJumpToSection: (section: 'home' | 'menu' | 'contact' | 'detail-volcano') => void;
}

export default function DeviceSimulator({
  children,
  deviceMode,
  setDeviceMode,
  onJumpToSection
}: DeviceSimulatorProps) {
  const [showHelper, setShowHelper] = useState(true);

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col font-sans select-none antialiased">
      {/* Simulator Management Bar */}
      <header className="bg-neutral-950 border-b border-white/10 px-4 py-3 shrink-0 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center font-black text-white text-lg tracking-wider border border-white/10 shadow-md">
              WOW
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold text-sm sm:text-base uppercase tracking-wider">
                  Wow Burger Studio
                </span>
                <span className="bg-rose-600/20 text-rose-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest border border-rose-500/20">
                  Mockup Console
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-medium">
                Addis Ababa, ET • Bole Road Cafè Lounge
              </p>
            </div>
          </div>

          {/* Device Selection Tabs (Deliverable 4, 5, 6) */}
          <div className="flex items-center bg-white/5 border border-white/10 p-1 rounded-2xl shadow-inner gap-1">
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                deviceMode === 'mobile'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">Mobile Mockup</span>
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                deviceMode === 'tablet'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Tablet className="w-4 h-4" />
              <span className="hidden sm:inline">Tablet Mockup</span>
            </button>
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                deviceMode === 'desktop'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden sm:inline">Desktop Mockup</span>
            </button>
            <button
              onClick={() => setDeviceMode('responsive')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                deviceMode === 'responsive'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Responsive Web</span>
            </button>
          </div>

          {/* Quick Jumps (Deliverable 1, 2, 3) */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider hidden lg:inline">
              Quick Scenarios:
            </span>
            <div className="flex bg-neutral-900 border border-white/5 p-1 rounded-xl">
              <button
                onClick={() => onJumpToSection('home')}
                className="px-2.5 py-1 text-[10px] sm:text-xs font-bold text-neutral-300 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-all"
              >
                1. Home
              </button>
              <button
                onClick={() => onJumpToSection('menu')}
                className="px-2.5 py-1 text-[10px] sm:text-xs font-bold text-neutral-300 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-all"
              >
                2. Categories
              </button>
              <button
                onClick={() => onJumpToSection('detail-volcano')}
                className="px-2.5 py-1 text-[10px] sm:text-xs font-bold text-neutral-300 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-all flex items-center gap-1"
              >
                3. Detail Card
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              </button>
            </div>
          </div>
          
        </div>
      </header>

      {/* Helper Ribbon Alert */}
      {showHelper && (
        <div className="bg-gradient-to-r from-amber-600/95 to-rose-700/95 border-b border-white/5 px-4 py-2 shrink-0 flex items-center justify-between text-white text-[11px] font-medium shadow-md">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-white text-rose-800 font-extrabold text-[9px] uppercase px-1.5 py-0.5 rounded-md">
                Tip
              </span>
              <span>
                Use the mockups bar above to toggle the digital menu inside <strong>Mobile (Vertical)</strong>, 
                <strong>Tablet (Spacious)</strong>, or <strong>Desktop</strong> physical shells. Each is fully functional!
              </span>
            </div>
            <button
              onClick={() => setShowHelper(false)}
              className="text-white/60 hover:text-white font-bold px-1 py-0.5 rounded-sm active:scale-95"
            >
              ✕ Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Simulator Main Stage */}
      <main className="flex-1 overflow-auto bg-gradient-to-b from-neutral-950/20 to-neutral-900/50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        {deviceMode === 'responsive' && (
          <div className="w-full min-h-[500px] bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl border border-white/5">
            {children}
          </div>
        )}

        {deviceMode === 'mobile' && (
          <div className="relative mx-auto transition-all duration-300 flex flex-col items-center">
            {/* iPhone Top Speaker Ear Piece / Front Camera notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-5 bg-neutral-950 rounded-b-2xl z-30 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-1 bg-neutral-800 rounded-full mb-1" />
              <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full absolute right-8 top-1 border border-neutral-800" />
            </div>

            {/* Smartphone Metal Shell Frame */}
            <div className="w-[375px] h-[780px] bg-neutral-950 rounded-[44px] shadow-2xl border-[12px] border-neutral-950 relative flex flex-col outline-none ring-4 ring-neutral-800 ring-offset-2 ring-offset-neutral-950 overflow-hidden">
              
              {/* Simulated Mobile Status Info Bar */}
              <div className="bg-neutral-950 h-7 px-6 flex items-center justify-between text-white/95 text-[10px] select-none font-semibold uppercase leading-none border-b border-white/5 tracking-wider shrink-0 z-20">
                <span className="font-mono">Wow Burger</span>
                <div className="flex items-center gap-1.5">
                  <span className="bg-emerald-600 w-1.5 h-1.5 rounded-full inline-block animate-pulse"></span>
                  <span>Addis Ababa, ET</span>
                </div>
              </div>

              {/* Page Contents Viewport */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white relative flex flex-col">
                {children}
              </div>

              {/* iPhone Bottom Home Bar */}
              <div className="bg-neutral-950 h-4 flex items-center justify-center shrink-0 z-20 pb-1">
                <div className="w-28 h-1 bg-white/40 rounded-full" />
              </div>
            </div>
            
            <p className="text-[11px] font-bold text-neutral-400 mt-4 tracking-wider flex items-center gap-1.5">
              <span>SIMULATED IPHONE VIEWPORT (375 × 740)</span>
            </p>
          </div>
        )}

          {deviceMode === 'tablet' && (
            <div className="relative mx-auto transition-all duration-300 flex flex-col items-center">
              {/* Tablet Shell Frame */}
              <div className="w-[768px] h-[980px] bg-neutral-950 rounded-[32px] shadow-2xl border-[14px] border-neutral-950 relative flex flex-col outline-none ring-4 ring-neutral-800 ring-offset-2 ring-offset-neutral-950 overflow-hidden">
                
                {/* Simulated Tablet Status Bar */}
                <div className="bg-neutral-950 h-8 px-8 flex items-center justify-between text-white/95 text-xs select-none font-bold uppercase border-b border-white/5 tracking-wider shrink-0 z-20">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-rose-600 font-extrabold px-1.5 py-0.5 rounded-xs tracking-widest text-white">Lounge</span>
                    <span className="font-mono tracking-widest text-neutral-300">Wow Burger Cafe Menu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500 w-2 h-2 rounded-full inline-block"></span>
                    <span className="text-[10px] text-neutral-300">Bole Road • Live Connection</span>
                  </div>
                </div>

                {/* Contents viewport */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white relative flex flex-col">
                  {children}
                </div>

                {/* Tablet bezel bottom identifier */}
                <div className="bg-neutral-950 h-3 flex items-center justify-center shrink-0 z-20" />
              </div>

              <p className="text-[11px] font-bold text-neutral-400 mt-4 tracking-wider">
                SIMULATED IPAD PRO VIEWPORT (768 × 940)
              </p>
            </div>
          )}

          {deviceMode === 'desktop' && (
            <div className="relative mx-auto transition-all duration-300 flex flex-col items-center w-full max-w-5xl">
              {/* Laptop Display Lid Shell Frame */}
              <div className="w-full bg-neutral-950 rounded-2xl shadow-2xl overflow-hidden border-[8px] border-neutral-950 relative flex flex-col ring-4 ring-neutral-800 ring-offset-1 ring-offset-neutral-950">
                {/* Screen top camera notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-4 bg-neutral-950 rounded-b-lg z-30 flex items-center justify-center pointer-events-none">
                  <div className="w-1.5 h-1.5 bg-neutral-800 rounded-full" />
                </div>

                {/* Simulated Desktop App Frame Utility Header */}
                <div className="bg-neutral-950 h-9 px-4 flex items-center justify-between text-neutral-300 text-xs border-b border-white/5 shrink-0 z-20">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 px-6 py-1 rounded-md text-[10px] text-neutral-400 font-semibold tracking-wide flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    <span>https://www.wowburger.com/addis-lounge/digital-menu</span>
                  </div>

                  <div className="text-[10px] font-mono font-bold text-neutral-400 tracking-wider">
                    MACBOOK PRO PROTOTYPE
                  </div>
                </div>

                {/* Scrollable container viewport space (Height adjusted lower to mimic laptop ratio perfectly) */}
                <div className="h-[620px] overflow-y-auto overflow-x-hidden bg-white">
                  {children}
                </div>
              </div>

              {/* Laptop Keyboard Metallic Base Stand */}
              <div className="w-[104%] h-4 bg-neutral-800 rounded-b-xl border-t border-white/20 relative shrink-0 shadow-lg">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-2 bg-neutral-950 rounded-b-xs" />
              </div>

              <p className="text-[11px] font-bold text-neutral-400 mt-4 tracking-wider uppercase">
                SIMULATED MACBOOK DESKTOP VIEWPORT (FLUID HEIGHT 620)
              </p>
            </div>
          )}
      </main>

      {/* Mini Footer metadata */}
      <footer className="bg-neutral-950 border-t border-white/5 px-6 py-4 shrink-0 text-center flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-500 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="text-rose-500">★</span>
          <span>Designed with local Ethiopian hospitality and modern premium digital layouts.</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-neutral-600">Currency: ETB (Birr)</span>
          <span className="text-neutral-600">Location: Bole, Addis Ababa</span>
        </div>
      </footer>
    </div>
  );
}
