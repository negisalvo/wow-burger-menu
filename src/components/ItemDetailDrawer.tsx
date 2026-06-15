import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Star, Flame, Salad, Landmark, ShieldCheck, Dumbbell, Award, ChevronRight, Heart } from 'lucide-react';
import { MenuItem } from '../types';

interface ItemDetailDrawerProps {
  item: MenuItem | null;
  onClose: () => void;
  onSelectRelated: (item: MenuItem) => void;
  menuItems: MenuItem[];
  isFavorite?: boolean;
  onToggleFavorite?: (id: string, e?: React.MouseEvent) => void;
}

export default function ItemDetailDrawer({ 
  item, 
  onClose, 
  onSelectRelated, 
  menuItems,
  isFavorite = false,
  onToggleFavorite
}: ItemDetailDrawerProps) {
  if (!item) return null;

  // Get related items (same category, excluding current item) from live list
  const relatedItems = (menuItems || []).filter(
    (mi) => mi.category === item.category && mi.id !== item.id
  ).slice(0, 2);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          id="detail-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-neutral-950 backdrop-blur-xs cursor-crosshair"
        />

        {/* Slide-over Content Container */}
        <motion.div
          id="detail-drawer-panel"
          initial={{ x: '100%', opacity: 0.9 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col overflow-y-auto"
        >
          {/* Hero Section Container */}
          <div className="relative h-72 sm:h-80 w-full overflow-hidden shrink-0 bg-neutral-100">
            <img
              src={item.imageUrl}
              alt={item.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Dark vignette gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-900/10 to-transparent" />

            {/* Float Close Button */}
            <button
              id="close-drawer-btn"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-white bg-neutral-900/60 hover:bg-neutral-900/90 active:scale-95 rounded-full backdrop-blur-md transition-all border border-white/20"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Float Favorite Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleFavorite) onToggleFavorite(item.id, e);
              }}
              className="absolute top-4 right-14 z-10 p-2 bg-neutral-900/60 hover:bg-neutral-900/90 active:scale-95 rounded-full backdrop-blur-md transition-all border border-white/20"
              aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
            </button>

            {/* Preparations time pill */}
            {item.estimatedTime && (
              <div className="absolute top-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur-md text-neutral-900 px-3 py-1 rounded-full text-xs font-semibold shadow-xs border border-white/40">
                <Clock className="w-3.5 h-3.5 text-rose-600" />
                <span>Ready in {item.estimatedTime}</span>
              </div>
            )}

            {/* Visual categories background tags */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex flex-wrap gap-1.5 mb-1">
                {item.tags.isSignature && (
                  <span className="flex items-center gap-1 bg-amber-500 text-neutral-950 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    <Award className="w-3 h-3 text-neutral-950" />
                    Signature
                  </span>
                )}
                {item.tags.isSpicy && (
                  <span className="flex items-center gap-0.5 bg-rose-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    <Flame className="w-3 h-3 animate-pulse" />
                    Spicy Fire
                  </span>
                )}
                {item.tags.isVegan && (
                  <span className="flex items-center gap-0.5 bg-emerald-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    <Salad className="w-3 h-3" />
                    100% Vegan
                  </span>
                )}
                {item.tags.hasLocalTouch && (
                  <span className="flex items-center gap-1 bg-neutral-900/80 text-amber-400 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full tracking-wider border border-amber-400/30">
                    🇪🇹 local touch
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-md">
                {item.name}
              </h2>
            </div>
          </div>

          {/* Core Info & Ingredients Block */}
          <div className="p-5 sm:p-6 flex-1 flex flex-col gap-6">
            {/* Price & Rating Tier */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                  price
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-mono tracking-tight">
                  {item.price}{' '}
                  <span className="text-lg font-bold text-rose-600">ETB</span>
                </span>
              </div>

              {/* Stars summary */}
              <div className="flex flex-col items-end">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                  rating
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-4 h-4 ${
                          idx < Math.floor(item.rating || 4.7)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-neutral-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-neutral-900">
                    {item.rating || 4.8}
                  </span>
                  <span className="text-neutral-400 text-xs">
                    ({item.reviewCount || 105})
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">
                the craft
              </h3>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-sans">
                {item.description}
              </p>
            </div>

            {/* Ingredients */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                key ingredients
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {item.ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 bg-neutral-50 p-2.5 rounded-lg border border-neutral-100/80 hover:bg-neutral-100/40 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-neutral-700 leading-tight">
                      {ing}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition metrics */}
            {item.nutrition && (
              <div className="space-y-3 bg-rose-50/40 border border-rose-100/50 rounded-2xl p-4 sm:p-5">
                <h3 className="text-sm font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Dumbbell className="w-4 h-4" />
                  nutritional highlights
                </h3>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white px-2 py-3 rounded-xl border border-rose-100">
                    <div className="text-xs text-neutral-400 font-semibold uppercase">Cal</div>
                    <div className="text-base font-extrabold text-rose-700 font-mono mt-0.5">
                      {item.nutrition.calories}
                    </div>
                  </div>
                  <div className="bg-white px-2 py-3 rounded-xl border border-rose-100">
                    <div className="text-xs text-neutral-400 font-semibold uppercase">Prot</div>
                    <div className="text-base font-extrabold text-rose-700 font-mono mt-0.5">
                      {item.nutrition.protein || '—'}
                    </div>
                  </div>
                  <div className="bg-white px-2 py-3 rounded-xl border border-rose-100">
                    <div className="text-xs text-neutral-400 font-semibold uppercase">Carb</div>
                    <div className="text-base font-extrabold text-rose-700 font-mono mt-0.5">
                      {item.nutrition.carbs || '—'}
                    </div>
                  </div>
                  <div className="bg-white px-2 py-3 rounded-xl border border-rose-100">
                    <div className="text-xs text-neutral-400 font-semibold uppercase">Fat</div>
                    <div className="text-base font-extrabold text-rose-700 font-mono mt-0.5">
                      {item.nutrition.fat || '—'}
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-neutral-400 text-center italic">
                  *Approximations based on standard single-item gourmet recipes.
                </p>
              </div>
            )}

            {/* Related items recommendations */}
            {relatedItems.length > 0 && (
              <div className="space-y-3 mt-2 border-t border-neutral-100 pt-5">
                <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">
                  You May Also Like
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedItems.map((relItem) => (
                    <div
                      key={relItem.id}
                      onClick={() => onSelectRelated(relItem)}
                      className="group flex gap-3 bg-neutral-50 hover:bg-rose-50/30 border border-neutral-100 hover:border-rose-100 rounded-xl p-2.5 cursor-pointer transition-all active:scale-98"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-neutral-200">
                        <img
                          src={relItem.imageUrl}
                          alt={relItem.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900 truncate group-hover:text-rose-600 transition-colors">
                          {relItem.name}
                        </h4>
                        <span className="text-xs text-neutral-500 font-mono mt-0.5">
                          {relItem.price} ETB
                        </span>
                        <span className="text-[10px] text-rose-500 font-semibold mt-1 flex items-center gap-0.5">
                          View details <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
