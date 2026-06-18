"use client";

import React from 'react';
import * as Icons from 'lucide-react';
import { Category, CategoryId } from '../types';

interface CategoryNavProps {
  categories: Category[];
  activeCategory: CategoryId | 'all';
  onSelectCategory: (id: CategoryId | 'all') => void;
  isDarkMode: boolean;
}

export default function CategoryNav({
  categories,
  activeCategory,
  onSelectCategory,
  isDarkMode,
}: CategoryNavProps) {
  
  // Helper to dynamically match icons from Lucide safely
  const renderIcon = (iconName: string, isActive: boolean) => {
    const LucideIcon = (Icons as any)[iconName] || Icons.Sparkles;
    return <LucideIcon className={`w-3.5 h-3.5 sm:w-4 h-4 transition-colors ${
      isActive ? 'text-white' : 'text-neutral-500'
    }`} />;
  };

  // Build list of category options including a custom "All" option
  const allCategoryPills = [
    { id: 'all', name: 'All Selections', icon: 'Compass', count: 0 },
    ...categories.map(c => {
      // Shorten names for clean pill design
      let name = c.name;
      if (c.id === 'fries-sides') name = 'Fries';
      if (c.id === 'coffee') name = 'Coffee';
      if (c.id === 'drinks') name = 'Drinks';
      if (c.id === 'burgers') name = 'Burgers';
      return { id: c.id, name, icon: c.icon, count: c.count };
    })
  ];

  return (
    <div className={`sticky top-16 sm:top-20 z-30 transition-colors duration-300 border-b py-3.5 px-4 scrollbar-hide select-none ${
      isDarkMode 
        ? 'bg-[#0f0f11]/95 text-white border-neutral-800/80 shadow-md' 
        : 'bg-white/95 text-neutral-900 border-neutral-100/90 shadow-xs'
    }`}>
      <div className="max-w-7xl mx-auto w-full space-y-2.5">
        
        {/* Navigation title with orange subtitle */}
        <div className="flex items-center justify-between pb-1 sm:pb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ff6b00] bg-orange-500/10 px-2 py-0.5 rounded">
              Our Menu
            </span>
            <h3 className="text-sm font-black uppercase tracking-wider leading-none">
              Explore & Enjoy
            </h3>
          </div>
          <span className="hidden sm:inline text-[10px] text-neutral-400 font-bold uppercase tracking-widest font-mono">
            Bole Lounge Standard
          </span>
        </div>

        {/* Scrollable Categories Pill row */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 snap-x touch-pan-x">
          {allCategoryPills.map((cat) => {
            const isActive = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 uppercase whitespace-nowrap snap-start shrink-0 cursor-pointer active:scale-95 border ${
                  isActive
                    ? 'bg-[#ff6b00] text-white border-[#ff6b00] shadow-md shadow-orange-500/20'
                    : isDarkMode
                      ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600 border-neutral-200/50'
                }`}
              >
                {/* Embedded Lucide Icon */}
                {renderIcon(cat.icon, isActive)}

                <span className="tracking-wide">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
