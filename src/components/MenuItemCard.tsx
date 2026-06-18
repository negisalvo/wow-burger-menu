"use client";

import React from 'react';
import { Star, Clock, Flame, Salad, Landmark, Award, Eye, Heart, ShoppingCart, Plus } from 'lucide-react';
import { MenuItem } from '../types';
import { getImageSrc } from '../lib/utils';

interface MenuItemCardProps {
  key?: string | number;
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (itemId: string, e?: React.MouseEvent) => void;
  onAddToCart: (item: MenuItem, e?: React.MouseEvent) => void;
  isDarkMode: boolean;
}

export default function MenuItemCard({
  item,
  onSelect,
  isFavorite = false,
  onToggleFavorite,
  onAddToCart,
  isDarkMode,
}: MenuItemCardProps) {
  // Determine if it should have Popular or Bestseller badges
  const isBestseller = item.tags.isSignature || item.rating && item.rating >= 4.9;
  const isPopular = item.reviewCount && item.reviewCount > 150;

  // Safe category display name
  const getCategoryDisplay = (catId: string) => {
    switch (catId) {
      case 'burgers': return 'Gourmet Burger';
      case 'fries-sides': return 'Fries & Side';
      case 'coffee': return 'Ethiopian Roast';
      case 'drinks': return 'Cold Craft';
      case 'shakes': return 'Double Churned';
      case 'desserts': return 'Signature Sweet';
      default: return 'Special Selections';
    }
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className={`group rounded-2xl sm:rounded-3xl border transition-all duration-300 pointer-events-auto flex flex-col overflow-hidden cursor-pointer select-none relative active:scale-98 h-full hover:shadow-[0_12px_24px_-8px_rgba(255,107,0,0.15)] ${
        isDarkMode
          ? 'bg-[#18181c]/70 border-neutral-800/80 text-white hover:border-[#ff6b00]/40'
          : 'bg-white border-neutral-100 hover:border-[#ff6b00]/30 shadow-[0_2px_8px_rgba(0,0,0,0.02)]'
      }`}
    >
      {/* Upper image with beautiful hover zoom */}
      <div className="relative h-28 xs:h-36 sm:h-48 w-full overflow-hidden bg-neutral-900 shrink-0">
        <img
          src={getImageSrc(item.imageUrl)}
          alt={item.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
          }}
        />
        
        {/* Subtle dark bottom gradient on image */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

        {/* Dynamic Badges: Popular / Bestseller in Top-Left Corner */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-15">
          {isBestseller ? (
            <span className="flex items-center gap-0.5 sm:gap-1 bg-[#ff6b00] text-white text-[8px] sm:text-[10px] font-extrabold px-1.5 sm:px-2.5 py-0.5 rounded-md shadow-md uppercase tracking-wider">
              <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white/10" />
              <span>Bestseller</span>
            </span>
          ) : isPopular ? (
            <span className="flex items-center gap-0.5 sm:gap-1 bg-amber-400 text-neutral-950 text-[8px] sm:text-[10px] font-extrabold px-1.5 sm:px-2.5 py-0.5 rounded-md shadow-md uppercase tracking-wider">
              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-neutral-950/10" />
              <span>Popular</span>
            </span>
          ) : null}
        </div>

        {/* Favorite Heart Trigger - Top-Right */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item.id, e);
            }}
            className={`absolute top-2 right-2 z-20 p-1.5 rounded-full transition-transform hover:scale-110 active:scale-90 shadow-md ${
              isDarkMode ? 'bg-neutral-900/95 text-white hover:bg-neutral-800 border border-neutral-800' : 'bg-white/95 text-neutral-800 hover:bg-white border border-neutral-100'
            }`}
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isFavorite ? 'fill-[#ff6b00] text-[#ff6b00]' : 'text-neutral-400 hover:text-red-500'
              }`}
            />
          </button>
        )}

        {/* Preparation time badge - bottom-right of image */}
        {item.estimatedTime && (
          <span className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[8px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded-md border border-white/10">
            {item.estimatedTime}
          </span>
        )}
      </div>

      {/* Info contents area with pristine card alignment */}
      <div className="p-2.5 xs:p-3 sm:p-4 md:p-5 flex-1 flex flex-col justify-between gap-1.5 sm:gap-3.5">
        
        {/* Title, Category & rating score banner */}
        <div className="space-y-1">
          {/* Orange category label */}
          <span className="text-[8px] xs:text-[10px] uppercase font-bold tracking-wider text-[#ff6b00] leading-none block">
            {getCategoryDisplay(item.category)}
          </span>

          <div className="flex items-start justify-between gap-1.5">
            {/* Clickable Product Title */}
            <h4
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelect(item);
              }}
              className="font-extrabold text-[#ff6b00] group-hover:text-amber-500 hover:underline transition-colors text-xs xs:text-sm sm:text-base leading-snug tracking-tight uppercase line-clamp-1 sm:line-clamp-2 cursor-pointer"
            >
              {item.name}
            </h4>

            {/* Stars rating banner */}
            <div className={`flex items-center gap-0.5 px-1 py-0.5 rounded border shrink-0 ${
              isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-amber-50 border-amber-100'
            }`}>
              <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
              <span className="text-[9.5px] font-black leading-none text-amber-500">
                {item.rating || 4.8}
              </span>
            </div>
          </div>

          <p className={`text-[9.5px] xs:text-xs leading-relaxed line-clamp-2 ${
            isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
          }`}>
            {item.description}
          </p>
        </div>

        {/* Action footer: Price & Explicit "Add-To-Cart" Button */}
        <div className={`flex items-center justify-between border-t border-dashed pt-3 mt-1.5 ${
          isDarkMode ? 'border-neutral-800' : 'border-neutral-100'
        }`}>
          {/* Price Tag with Currency styling */}
          <div className="flex flex-col">
            <span className="text-[7.5px] text-neutral-400 uppercase tracking-widest font-black leading-none">
              PRICE
            </span>
            <span className={`text-xs xs:text-sm sm:text-base md:text-lg font-black font-mono tracking-tight mt-0.5 ${
              isDarkMode ? 'text-white' : 'text-neutral-900'
            }`}>
              {item.price} <span className="text-[9px] sm:text-xs font-black text-[#ff6b00]">ETB</span>
            </span>
          </div>

          {/* Quick interactive order action button with scaling effect */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(item, e);
            }}
            className="group/btn flex items-center justify-center gap-1 bg-[#ff6b00] hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all text-white px-2.5 xs:px-3.5 py-1.5 sm:py-2 rounded-xl text-[9px] xs:text-[11px] font-extrabold uppercase tracking-wider font-sans shadow-md"
            aria-label={`Add ${item.name} to cart`}
          >
            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden xs:inline">Add</span>
          </button>
        </div>

      </div>
    </div>
  );
}
