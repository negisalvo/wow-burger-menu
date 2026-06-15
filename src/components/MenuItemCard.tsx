import React from 'react';
import { Star, Clock, Flame, Salad, Landmark, Award, Eye, Heart } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuItemCardProps {
  key?: string;
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (itemId: string, e: React.MouseEvent) => void;
}

export default function MenuItemCard({ item, onSelect, isFavorite = false, onToggleFavorite }: MenuItemCardProps) {
  return (
    <div
      onClick={() => onSelect(item)}
      className="group bg-white rounded-2xl xs:rounded-3xl border border-neutral-105/80 hover:border-rose-200 shadow-xs hover:shadow-lg transition-all duration-300 pointer-events-auto flex flex-col overflow-hidden cursor-pointer select-none relative active:scale-98"
    >
      
      {/* Upper image and overlay badge wrapper */}
      <div className="relative h-28 xs:h-36 sm:h-48 md:h-52 w-full overflow-hidden bg-neutral-100 shrink-0">
        <img
          src={item.imageUrl}
          alt={item.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Shadow gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-neutral-950/60 to-transparent pointer-events-none" />

        {/* Favorite Heart Trigger - positioned top-right (or bottom-right on mobile) */}
        {onToggleFavorite && (
          <button
            onClick={(e) => onToggleFavorite(item.id, e)}
            className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200 hover:bg-white active:scale-90 transition-all shadow-xs"
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-all ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-neutral-500 hover:text-rose-500'
              }`}
            />
          </button>
        )}

        {/* Ready time overlay badge - compact on mobile */}
        {item.estimatedTime && (
          <div className="absolute top-2 left-2 flex items-center gap-0.5 xs:gap-1 bg-white/90 backdrop-blur-md text-neutral-900 px-1.5 xs:px-2.5 py-0.5 xs:py-1 rounded-full text-[8px] xs:text-[10px] font-bold shadow-xs border border-white/40">
            <Clock className="w-2.5 h-2.5 text-rose-500 shrink-0" />
            <span className="truncate max-w-[50px] xs:max-w-none">{item.estimatedTime}</span>
          </div>
        )}

        {/* Nutritional Score Tag */}
        {item.nutrition && item.nutrition.calories && (
          <div className="absolute bottom-2 right-2 hidden xs:flex items-center bg-neutral-900/70 backdrop-blur-md text-white px-1.5 py-0.5 rounded-full text-[8.5px] font-semibold border border-white/10">
            <span>{item.nutrition.calories} Cal</span>
          </div>
        )}

        {/* Decorative dynamic categories labels */}
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-0.5 max-w-[90%] pointer-events-none">
          {item.tags.isSignature && (
            <span className="flex items-center gap-0.5 bg-amber-400 text-neutral-950 text-[7px] xs:text-[9px] font-black px-1 xs:px-2 py-0.5 rounded-sm uppercase tracking-wider">
              <Award className="w-2 xs:w-3 h-2 xs:h-3" />
              <span className="hidden xs:inline">Signature</span>
            </span>
          )}
          {item.tags.isSpicy && (
            <span className="flex items-center gap-0.5 bg-rose-600 text-white text-[7px] xs:text-[9px] font-black px-1 xs:px-2 py-0.5 rounded-sm uppercase tracking-wider">
              <Flame className="w-2 xs:w-3 h-2 xs:h-3 text-white" />
              <span className="hidden xs:inline">Spicy</span>
            </span>
          )}
          {item.tags.isVegan && (
            <span className="flex items-center gap-0.5 bg-emerald-600 text-white text-[7px] xs:text-[9px] font-black px-1 xs:px-2 py-0.5 rounded-sm uppercase tracking-wider">
              <Salad className="w-2 xs:w-3 h-2 xs:h-3" />
              <span className="hidden xs:inline">Vegan</span>
            </span>
          )}
        </div>
      </div>

      {/* Item core values content */}
      <div className="p-2.5 xs:p-3 sm:p-5 flex-1 flex flex-col gap-2 xs:gap-3 justify-between">
        
        {/* Row of title, rating and price */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-1">
            {/* Clickable menu title indicator */}
            <h4 
              onClick={(e) => {
                e.stopPropagation();
                onSelect(item);
              }}
              className="font-extrabold text-neutral-900 text-xs xs:text-sm sm:text-base leading-tight hover:text-rose-600 hover:underline transition-colors uppercase tracking-tight line-clamp-1 sm:line-clamp-2"
            >
              {item.name}
            </h4>
            
            {/* Stars score */}
            <div className="flex items-center gap-0.5 xs:gap-1 bg-amber-50 px-1 xs:px-1.5 py-0.5 rounded-md xs:rounded-lg border border-amber-200 shrink-0">
              <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
              <span className="text-[9px] xs:text-[10px] font-bold text-neutral-900 leading-none">
                {item.rating || 4.8}
              </span>
            </div>
          </div>

          {/* Core short description */}
          <p className="text-[10px] xs:text-xs text-neutral-500 font-medium leading-relaxed line-clamp-1 xs:line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Key Ingredients checklist preview (Cleanly hidden on mobile layouts to reduce spacing slop) */}
        <div className="border-t border-neutral-100 pt-2.5 hidden sm:flex flex-wrap gap-1 pointer-events-none">
          {item.ingredients.slice(0, 2).map((ingredient, index) => (
            <span
              key={index}
              className="text-[10px] bg-neutral-100 hover:bg-neutral-150 text-neutral-600 px-2 py-0.5 rounded-full font-medium"
            >
              {ingredient}
            </span>
          ))}
          {item.ingredients.length > 2 && (
            <span className="text-[10px] text-neutral-400 font-bold px-1.5 py-0.5">
              +{item.ingredients.length - 2} more
            </span>
          )}
        </div>

        {/* Price & Action footer bar layout */}
        <div className="flex items-center justify-between border-t border-b border-dashed border-neutral-100 py-1.5 xs:py-3 mt-0.5">
          <div className="flex flex-col">
            <span className="text-[7.5px] xs:text-[9px] text-neutral-400 uppercase tracking-widest font-black leading-none">
              PRICE
            </span>
            <span className="text-xs xs:text-sm sm:text-base md:text-lg font-black text-neutral-900 font-mono mt-0.5 xs:mt-1 tracking-tight">
              {item.price} <span className="text-[10px] xs:text-xs font-bold text-rose-600">ETB</span>
            </span>
          </div>

          {/* Quick detail trigger button - reduced size or hidden on super narrow */}
          <span className="flex items-center gap-0.5 xs:gap-1 text-[9px] xs:text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-2 xs:px-3 py-1 xs:py-1.5 rounded-lg xs:border xs:border-rose-100 transition-all active:scale-95 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500">
            <Eye className="w-2.5 xs:w-3.5 h-2.5 xs:h-3.5 shrink-0" />
            <span className="hidden xs:inline">Details</span>
          </span>
        </div>

      </div>
    </div>
  );
}
