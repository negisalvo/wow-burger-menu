import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Star, Flame, Salad, Landmark, ShieldCheck, Dumbbell, Award, ChevronRight, Heart, ShoppingBag, Plus } from 'lucide-react';
import { MenuItem } from '../types';

interface ItemDetailDrawerProps {
  item: MenuItem | null;
  onClose: () => void;
  onSelectRelated: (item: MenuItem) => void;
  menuItems: MenuItem[];
  isFavorite?: boolean;
  onToggleFavorite?: (id: string, e?: React.MouseEvent) => void;
  onAddToCart: (item: MenuItem) => void;
  isDarkMode: boolean;
}

export default function ItemDetailDrawer({ 
  item, 
  onClose, 
  onSelectRelated, 
  menuItems,
  isFavorite = false,
  onToggleFavorite,
  onAddToCart,
  isDarkMode,
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
          animate={{ opacity: 0.7 }}
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
          transition={{ type: 'spring', damping: 26, stiffness: 210 }}
          className={`relative w-full max-w-lg h-full shadow-2xl flex flex-col overflow-y-auto ${
            isDarkMode ? 'bg-[#121216] text-white' : 'bg-white text-neutral-900'
          }`}
        >
          {/* Hero Section Container */}
          <div className="relative h-72 sm:h-80 w-full overflow-hidden shrink-0 bg-neutral-900">
            <img
              src={item.imageUrl}
              alt={item.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Dark vignette gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

            {/* Float Close Button */}
            <button
              id="close-drawer-btn"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-white bg-black/60 hover:bg-black/90 active:scale-95 rounded-full backdrop-blur-md transition-all border border-white/20 cursor-pointer"
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
              className="absolute top-4 right-14 z-10 p-2 bg-black/60 hover:bg-black/90 active:scale-95 rounded-full backdrop-blur-md transition-all border border-white/20 cursor-pointer"
              aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#ff6b00] text-[#ff6b00]' : 'text-white'}`} />
            </button>

            {/* Preparations time pill */}
            {item.estimatedTime && (
              <div className="absolute top-4 left-4 flex items-center gap-1 bg-black/75 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md border border-white/15">
                <Clock className="w-3.5 h-3.5 text-[#ff6b00]" />
                <span>Ready in {item.estimatedTime}</span>
              </div>
            )}

            {/* Visual categories background tags */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {item.tags.isSignature && (
                  <span className="flex items-center gap-1 bg-[#ff6b00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    <Award className="w-3 h-3 text-white" />
                    Signature
                  </span>
                )}
                {item.tags.isSpicy && (
                  <span className="flex items-center gap-0.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    <Flame className="w-3 h-3 text-white animate-pulse" />
                    Spicy
                  </span>
                )}
                {item.tags.isVegan && (
                  <span className="flex items-center gap-0.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    <Salad className="w-3 h-3" />
                    Vegan
                  </span>
                )}
                {item.tags.hasLocalTouch && (
                  <span className="flex items-center gap-1 bg-[#ff6b00]/20 text-[#ff6b00] text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wider border border-[#ff6b00]/30 font-mono">
                    🇪🇹 LOCAL ADDITION
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white drop-shadow-md">
                {item.name}
              </h2>
            </div>
          </div>

          {/* Core Info & Ingredients Block */}
          <div className="p-5 sm:p-6 flex-1 flex flex-col gap-6">
            
            {/* Price & Rating Tier */}
            <div className={`flex items-center justify-between border-b pb-4 ${
              isDarkMode ? 'border-neutral-800' : 'border-neutral-100'
            }`}>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#ff6b00] uppercase tracking-widest">
                  price
                </span>
                <span className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-neutral-900'
                }`}>
                  {item.price}{' '}
                  <span className="text-sm font-black text-[#ff6b00]">ETB</span>
                </span>
              </div>

              {/* Stars summary */}
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-[#ff6b00] uppercase tracking-widest">
                  review stats
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-3.5 h-3.5 ${
                          idx < Math.floor(item.rating || 4.7)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-neutral-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold">
                    {item.rating || 4.8}
                  </span>
                  <span className="text-neutral-500 text-xs">
                    ({item.reviewCount || 105})
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Add to Cart button explicitly at top of content */}
            <button
              onClick={() => onAddToCart(item)}
              className="w-full flex items-center justify-center gap-2 bg-[#ff6b00] hover:bg-orange-600 active:scale-95 text-white transition-all text-sm font-extrabold uppercase py-3.5 rounded-2xl shadow-lg cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Add to order list</span>
            </button>

            {/* Description */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-[#ff6b00] uppercase tracking-wider">
                the craft & recipe
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${
                isDarkMode ? 'text-neutral-300' : 'text-neutral-650'
              }`}>
                {item.description}
              </p>
            </div>

            {/* Ingredients */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-emerald-500">
                <ShieldCheck className="w-4 h-4" />
                key ingredients
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {item.ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-1.5 p-2 rounded-xl transition-colors ${
                      isDarkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-neutral-50 border border-neutral-100'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00] mt-1.5 shrink-0" />
                    <span className={`text-xs font-semibold leading-tight ${
                      isDarkMode ? 'text-neutral-300' : 'text-neutral-700'
                    }`}>
                      {ing}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition metrics */}
            {item.nutrition && (
              <div className={`space-y-3 rounded-2xl p-4 border ${
                isDarkMode ? 'bg-neutral-900/60 border-neutral-850' : 'bg-orange-50/20 border-orange-100/50'
              }`}>
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#ff6b00]">
                  <Dumbbell className="w-4 h-4 text-[#ff6b00]" />
                  nutritional highlights
                </h3>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: 'CAL', val: item.nutrition.calories },
                    { label: 'PRO', val: item.nutrition.protein },
                    { label: 'CARB', val: item.nutrition.carbs },
                    { label: 'FAT', val: item.nutrition.fat },
                  ].map((nut, index) => (
                    <div 
                      key={index} 
                      className={`px-1.5 py-2.5 rounded-xl border ${
                        isDarkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-100'
                      }`}
                    >
                      <div className="text-[9px] text-neutral-400 font-bold uppercase">{nut.label}</div>
                      <div className="text-xs xs:text-sm font-extrabold text-[#ff6b00] font-mono mt-0.5">
                        {nut.val || '—'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related items recommendations */}
            {relatedItems.length > 0 && (
              <div className={`space-y-2.5 mt-2 border-t pt-5 ${
                isDarkMode ? 'border-neutral-800' : 'border-neutral-100'
              }`}>
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  You May Also Like
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-8">
                  {relatedItems.map((relItem) => (
                    <div
                      key={relItem.id}
                      onClick={() => onSelectRelated(relItem)}
                      className={`group flex gap-2.5 rounded-xl p-2.5 cursor-pointer transition-all border ${
                        isDarkMode 
                          ? 'bg-neutral-900/40 border-neutral-800 hover:border-[#ff6b00]/30 hover:bg-neutral-800/50' 
                          : 'bg-neutral-50 border-neutral-100 hover:border-[#ff6b00]/30 hover:bg-white'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-neutral-800">
                        <img
                          src={relItem.imageUrl}
                          alt={relItem.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <h4 className="text-xs font-extrabold truncate uppercase group-hover:text-[#ff6b00] transition-colors">
                          {relItem.name}
                        </h4>
                        <span className="text-xs text-[#ff6b00] font-mono mt-0.5">
                          {relItem.price} ETB
                        </span>
                        <span className="text-[10px] text-amber-500 font-bold mt-1 flex items-center gap-0.5 uppercase">
                          Details <ChevronRight className="w-3 h-3" />
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
