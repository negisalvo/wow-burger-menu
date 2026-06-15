import { Star, Clock, Flame, Salad, Landmark, Award, Eye } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuItemCardProps {
  key?: string;
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onSelect }: MenuItemCardProps) {
  return (
    <div
      onClick={() => onSelect(item)}
      className="group bg-white rounded-3xl border border-neutral-105/80 hover:border-rose-200 shadow-xs hover:shadow-lg transition-all duration-300 pointer-events-auto flex flex-col overflow-hidden cursor-pointer select-none relative active:scale-98"
    >
      
      {/* Upper image and overlay badge wrapper */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-100 shrink-0">
        <img
          src={item.imageUrl}
          alt={item.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Shadow gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-neutral-950/60 to-transparent pointer-events-none" />

        {/* Ready time overlay badge */}
        {item.estimatedTime && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-md text-neutral-900 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs border border-white/40">
            <Clock className="w-3 h-3 text-rose-500" />
            <span>{item.estimatedTime}</span>
          </div>
        )}

        {/* Nutritional Score Tag */}
        {item.nutrition && item.nutrition.calories && (
          <div className="absolute top-3 right-3 flex items-center bg-neutral-900/70 backdrop-blur-md text-white px-2 py-1 rounded-full text-[9px] font-semibold border border-white/10">
            <span>{item.nutrition.calories} Cal</span>
          </div>
        )}

        {/* Decorative dynamic categories labels */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
          {item.tags.isSignature && (
            <span className="flex items-center gap-0.5 bg-amber-400 text-neutral-950 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
              <Award className="w-3 h-3" />
              Signature
            </span>
          )}
          {item.tags.isSpicy && (
            <span className="flex items-center gap-0.5 bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
              <Flame className="w-3 h-3 text-white" />
              Spicy
            </span>
          )}
          {item.tags.isVegan && (
            <span className="flex items-center gap-0.5 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
              <Salad className="w-3 h-3" />
              Vegan
            </span>
          )}
          {item.tags.hasLocalTouch && (
            <span className="flex items-center gap-0.5 bg-neutral-900 text-amber-300 text-[9px] font-black px-2 py-0.5 rounded-md tracking-wider border border-amber-400/25">
              🇪🇹 Local Blend
            </span>
          )}
        </div>
      </div>

      {/* Item core values content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col gap-3 justify-between">
        
        {/* Row of title, rating and price */}
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-1.5">
            <h4 className="font-extrabold text-neutral-900 text-sm sm:text-base leading-tight group-hover:text-rose-650 transition-colors uppercase tracking-tight">
              {item.name}
            </h4>
            
            {/* Stars score */}
            <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded-lg border border-amber-200">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className="text-[10px] font-bold text-neutral-900 leading-none">
                {item.rating || 4.8}
              </span>
            </div>
          </div>

          {/* Core short description */}
          <p className="text-xs text-neutral-500 font-medium leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Key Ingredients checklist preview */}
        <div className="border-t border-neutral-100 pt-3 flex flex-wrap gap-1 pointer-events-none">
          {item.ingredients.slice(0, 3).map((ingredient, index) => (
            <span
              key={index}
              className="text-[10px] bg-neutral-100 hover:bg-neutral-150 text-neutral-600 px-2 py-0.5 rounded-full font-medium"
            >
              {ingredient}
            </span>
          ))}
          {item.ingredients.length > 3 && (
            <span className="text-[10px] text-neutral-400 font-bold px-1.5 py-0.5">
              +{item.ingredients.length - 3} more
            </span>
          )}
        </div>

        {/* Price & Action footer bar layout */}
        <div className="flex items-center justify-between border-t border-b border-dashed border-neutral-100 py-3 mt-1">
          <div className="flex flex-col">
            <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-black leading-none">
              PRICE in birr
            </span>
            <span className="text-base sm:text-lg font-black text-neutral-900 font-mono mt-1 tracking-tight">
              {item.price} <span className="text-xs font-bold text-rose-600">ETB</span>
            </span>
          </div>

          {/* Quick detail trigger button */}
          <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100 transition-all active:scale-95 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500">
            <Eye className="w-3.5 h-3.5 shrink-0" />
            <span>Inspect Craft</span>
          </span>
        </div>

      </div>
    </div>
  );
}
