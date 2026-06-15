import * as Icons from 'lucide-react';
import { Category, CategoryId } from '../types';

interface CategoryNavProps {
  categories: Category[];
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
}

export default function CategoryNav({ categories, activeCategory, onSelectCategory }: CategoryNavProps) {
  
  // Helper to dynamically match icons from Lucide safely
  const renderIcon = (iconName: string, isActive: boolean) => {
    // Falls back to generic Sparkles if named icon is not exported by some chance
    const LucideIcon = (Icons as any)[iconName] || Icons.Sparkles;
    const iconColorClass = isActive ? 'text-rose-600' : 'text-neutral-500 group-hover:text-rose-600';
    return <LucideIcon className={`w-4 h-4 sm:w-5 h-5 transition-colors ${iconColorClass}`} />;
  };

  return (
    <div className="bg-white border-b border-neutral-100 flex flex-col pt-6 pb-2 px-4 sticky top-[69px] sm:top-[103px] z-30 shadow-xs">
      <div className="max-w-7xl mx-auto w-full space-y-3.5">
        
        {/* Navigation title with counts */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest leading-none">
              gourmet selections
            </h3>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <p className="text-[11px] font-semibold text-neutral-400">
            Swipe left or right to explore all categories • Prices in ETB
          </p>
        </div>

        {/* Scrollable Categories Row */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2.5 -mx-4 px-4 snap-x touch-pan-x">
          {categories.map((cat) => {
            const isActive = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group flex items-center gap-2.5 px-4 py-3 rounded-2xl border transition-all text-xs font-bold whitespace-nowrap snap-start shrink-0 cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-rose-500/10 text-rose-700 border-rose-400/50 shadow-xs'
                    : 'bg-neutral-50 hover:bg-neutral-100/50 text-neutral-600 border-neutral-200/60'
                }`}
              >
                {/* Simulated Icon circle frame */}
                <div className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-white' : 'bg-neutral-100 group-hover:bg-neutral-200/50'
                }`}>
                  {renderIcon(cat.icon, isActive)}
                </div>

                {/* Name & Count */}
                <div className="flex flex-col items-start leading-none gap-1">
                  <span className={`${isActive ? 'text-neutral-900 font-extrabold' : 'text-neutral-800 font-bold'}`}>
                    {cat.name}
                  </span>
                  <span className="text-[9px] font-semibold text-neutral-400 truncate">
                    {cat.count} curated items
                  </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
