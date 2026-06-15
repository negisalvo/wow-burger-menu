import { ArrowRight, Sparkles, Flame, Shield, Award, MapPin } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
}

export default function Hero({ onExploreClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white py-12 sm:py-16 md:py-20 px-6">
      
      {/* Background radial accent glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Center Layout wrapper */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        
        {/* Left Side Content Column (Grid span 7) */}
        <div className="md:col-span-7 space-y-6 sm:space-y-8 flex flex-col items-start text-left">
          
          {/* Location highlight badge */}
          <div className="inline-flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs text-amber-400 font-semibold tracking-wide">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>Bole, Addis Ababa • High-End Café & Burger Lounge</span>
          </div>

          {/* Premium Headline */}
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight uppercase font-sans">
              Where Gourmet <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-amber-400 to-amber-500">
                Burger Craft
              </span> <br />
              Meets Ethiopian Heritage.
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 font-medium leading-relaxed max-w-lg">
              Indulge in flame-grilled wagyu patties glazed with custom Awaze, hand-cut truffle rosemary fries, 
              and single-origin pour-over brew sourced from organic family micro-lots in Yirgacheffe. 
              Our kitchen blends international gourmet standards with cozy local hospitality.
            </p>
          </div>

          {/* Micro-USP icons list */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-md pt-2">
            <div className="flex flex-col gap-1.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Flame className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white leading-tight">Flame Grilled</span>
              <span className="text-[10px] text-neutral-500">100% Wagyu Angus Blend</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white leading-tight">Artisan Roast</span>
              <span className="text-[10px] text-neutral-500">Yirgacheffe Pour-Over</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white leading-tight">Pure Quality</span>
              <span className="text-[10px] text-neutral-500">Fresh Local Farm Grains</span>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-4 border-t border-white/5">
            <button
              onClick={onExploreClick}
              className="group flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-amber-500 text-white text-sm font-bold px-6 py-3.5 rounded-2xl transition-all shadow-xl shadow-rose-600/20 hover:shadow-rose-600/30 active:scale-95 border border-white/10"
            >
              <span>Explore Menu Categories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center justify-center gap-2 text-neutral-400 text-xs font-semibold px-4 py-2 border border-white/5 rounded-xl bg-white/5 backdrop-blur-md">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Prices in Ethiopian Birr (ETB)</span>
            </div>
          </div>

        </div>

        {/* Right Side Image Graphic (Grid span 5) */}
        <div className="md:col-span-5 relative mt-6 md:mt-0 flex justify-center">
          
          {/* Decorative frame rings around the burger picture */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-600 to-amber-500 rounded-2xl rotate-3 opacity-10 blur-md pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-500 to-transparent rounded-2xl -rotate-2 opacity-5 blur-xs pointer-events-none" />

          {/* Core Picture card wrapper */}
          <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-neutral-900 group">
            
            {/* Real gourmet image */}
            <img
              src="/src/assets/images/gourmet_burger_hero_1781288051773.jpg"
              alt="Signature Wow Burger"
              referrerPolicy="no-referrer"
              className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            
            {/* Image overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40 opacity-90" />
            
            {/* Visual Tag overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-rose-500 font-extrabold block">
                  lounge house favorite
                </span>
                <span className="text-base font-bold text-white tracking-tight">
                  The WOW Masterpiece
                </span>
              </div>
              <div className="bg-amber-400 text-neutral-950 font-mono font-bold text-xs px-2.5 py-1 rounded-lg border border-white/10 shadow-md">
                520 ETB
              </div>
            </div>

            {/* Glowing spot overlay */}
            <div className="absolute top-4 left-4 bg-rose-600 text-white text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full border border-white/20 shadow-lg flex items-center gap-1">
              <Flame className="w-3 h-3 fill-white animate-pulse" />
              <span>Signature</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
