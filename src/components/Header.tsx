import React, { useState } from 'react';
import { Flame, Sun, Moon, ShoppingBag, Menu, X, Key, Compass, Heart, Phone, MapPin, Clock } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  cartCount: number;
  onOpenCart: () => void;
  favoriteCount: number;
  onToggleFavoritesOnly: (show: boolean) => void;
  showOnlyFavorites: boolean;
  onOpenAdmin: () => void;
  onJumpToSection: (section: 'home' | 'menu' | 'contact') => void;
}

export default function Header({
  isDarkMode,
  onToggleDarkMode,
  cartCount,
  onOpenCart,
  favoriteCount,
  onToggleFavoritesOnly,
  showOnlyFavorites,
  onOpenAdmin,
  onJumpToSection,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Custom hamburger menu action
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const selectMobileNav = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-300 border-b ${
      isDarkMode 
        ? 'bg-[#0f0f11]/90 backdrop-blur-md border-neutral-800/80 text-white' 
        : 'bg-white/90 backdrop-blur-md border-neutral-100/90 text-neutral-900'
    } shadow-xs`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Left Section: Logo & Brand name */}
        <div 
          onClick={() => onJumpToSection('menu')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="relative flex items-center justify-center">
            {/* Logo Icon Ring with custom Orange Gradient */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff6b00] to-amber-500 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
              <Flame className="w-5 h-5 text-white fill-white/10 animate-pulse" />
            </div>
            {/* Mini hot indicator badge */}
            <span className="absolute -top-[1px] -right-[1px] bg-red-600 text-white text-[7px] font-black px-1 rounded-full animate-bounce">
              HI
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-black tracking-tight uppercase leading-none">
                Wow<span className="text-[#ff6b00]">Burger</span>
              </span>
              <span className="text-[8px] sm:text-[9.5px] font-black uppercase tracking-wider text-white bg-[#ff6b00] px-1.5 py-0.5 rounded-sm shrink-0">
                café
              </span>
            </div>
            <p className={`text-[8px] uppercase tracking-widest font-black leading-none mt-1 font-mono ${
              isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
            }`}>
              artisan gourmet blend
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links Removed */}

        {/* Right Section: Action utilities */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          
          {/* ManagerPortal key shortcut */}
          <button
            onClick={onOpenAdmin}
            className={`hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold font-mono uppercase tracking-wider transition-all border ${
              isDarkMode 
                ? 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 text-neutral-300' 
                : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100 text-neutral-700'
            }`}
            title="Open Admin Manager Portal"
          >
            <Key className="w-3.5 h-3.5 text-[#ff6b00]" />
            <span>Portal</span>
          </button>

          {/* Theme Mode Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            className={`p-2 rounded-full cursor-pointer transition-theme relative active:scale-90 border ${
              isDarkMode 
                ? 'bg-neutral-900 border-neutral-800 hover:bg-neutral-850 text-amber-400' 
                : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100 text-[#ff6b00]'
            }`}
            aria-label="Toggle dark/light website mode"
            id="theme-toggle-btn"
          >
            {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 h-5" /> : <Moon className="w-4 h-4 sm:w-5 h-5" />}
          </button>

          {/* Cart Bag Badge with nice indicator */}
          <button
            onClick={onOpenCart}
            className="p-2 sm:p-2.5 rounded-full cursor-pointer transition-all relative active:scale-90 bg-gradient-to-tr from-[#ff6b00] to-orange-500 hover:shadow-lg text-white"
            aria-label="Open ordering checkout cart"
            id="cart-trigger-btn"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-[#ff6b00] text-[9.5px] font-black w-4 h-4 sm:w-[18px] sm:h-[18px] rounded-full flex items-center justify-center shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Circular Hamburger Mobile Menu Trigger */}
          <button
            onClick={toggleMobileMenu}
            className={`md:hidden p-2 rounded-full cursor-pointer transition-all active:scale-90 border ${
              isDarkMode 
                ? 'bg-neutral-950 border-neutral-800 text-white hover:bg-neutral-900' 
                : 'bg-white border-neutral-200 text-neutral-900 hover:bg-neutral-50'
            }`}
            aria-label="Toggle Navigation Options"
            id="burger-hamburger-btn"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Slide-out Mobile Hamburger Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className={`md:hidden fixed inset-x-0 top-16 z-30 transition-all border-b glass-panel py-6 px-4 space-y-4 shadow-2xl ${
          isDarkMode 
            ? 'bg-[#121216]/95 border-neutral-800 text-white' 
            : 'bg-white/95 border-neutral-200 text-neutral-900'
        }`}>
          <div className="grid grid-cols-2 gap-3 pb-2">
            <button
              onClick={() => selectMobileNav(() => {
                onToggleFavoritesOnly(false);
                onJumpToSection('menu');
              })}
              className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-bold uppercase transition-all ${
                isDarkMode ? 'bg-neutral-900/40 border-neutral-800 hover:bg-neutral-800' : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              <Compass className="w-4 h-4 text-[#ff6b00]" />
              <span>Our Menu</span>
            </button>
            <button
              onClick={() => selectMobileNav(() => {
                onToggleFavoritesOnly(true);
                onJumpToSection('menu');
              })}
              className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-bold uppercase transition-all ${
                isDarkMode ? 'bg-neutral-900/40 border-neutral-800 hover:bg-neutral-800' : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500/10" />
              <span>Favorites ({favoriteCount})</span>
            </button>
          </div>

          {/* Quick Info & Portal */}
          <div className="pt-2 border-t border-dashed border-neutral-800/20 space-y-3.5">
            <button
              onClick={() => selectMobileNav(onOpenAdmin)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-orange-500/15 to-amber-500/5 border border-orange-500/20 text-xs font-extrabold uppercase text-[#ff6b00]"
            >
              <span className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                <span>Admin Manager Portal</span>
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-orange-500 text-white">Go</span>
            </button>

            <div className="text-[10px] text-neutral-400 font-bold space-y-1.5 px-1 pt-1">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#ff6b00] shrink-0" />
                <span>Bole Road, Addis Ababa, Ethiopia</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Daily: 7:00 AM - 11:00 PM</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
