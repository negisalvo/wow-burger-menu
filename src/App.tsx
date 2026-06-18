import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Compass, Flame, Coffee, Heart, Clock, UtensilsCrossed, Award, ArrowUpRight, Search, RotateCcw, ShoppingBag, Key } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryNav from './components/CategoryNav';
import MenuItemCard from './components/MenuItemCard';
import ItemDetailDrawer from './components/ItemDetailDrawer';
import CartDrawer, { CartItem } from './components/CartDrawer';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import { MenuItem, Category, CategoryId } from './types';
import { getStoredCategories, getStoredMenuItems } from './data/store';

export default function App() {

  // Real-time local storage dynamic databases
  const [categories, setCategories] = useState<Category[]>(() => getStoredCategories());
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => getStoredMenuItems());
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Pull remote data dynamically on mount if Supabase keys are active in environment secrets
  useEffect(() => {
    async function pullRemoteDatabase() {
      const { syncFromSupabase } = await import('./data/store');
      const data = await syncFromSupabase();
      if (data) {
        setCategories(data.categories);
        setMenuItems(data.menuItems);
      }
    }
    pullRemoteDatabase();
  }, []);

  // Theme support: defaulting to the demanded dark theme (#0f0f11 background)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('wow_theme_dark');
      return stored !== 'false'; // Dark mode is true by default
    } catch {
      return true;
    }
  });

  // Persists theme select
  useEffect(() => {
    localStorage.setItem('wow_theme_dark', String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Real-time shopping cart states
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('wow_cart') || '[]');
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Real-time local persistent favorites engine
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('wow_favorites') || '[]');
    } catch {
      return [];
    }
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Search filter query
  const [searchQuery, setSearchQuery] = useState('');

  // Save favorites helper
  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavoriteIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem('wow_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // Cart operations implementation
  const handleAddToCart = (item: MenuItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCartItems((prev) => {
      const idx = prev.findIndex((x) => x.item.id === item.id);
      let updated;
      if (idx > -1) {
        updated = prev.map((x, currIdx) => currIdx === idx ? { ...x, quantity: x.quantity + 1 } : x);
      } else {
        updated = [...prev, { id: Date.now().toString(), item, quantity: 1 }];
      }
      localStorage.setItem('wow_cart', JSON.stringify(updated));
      return updated;
    });
    // Trigger opening of cart implicitly or show visual feedback
  };

  const handleUpdateQuantity = (cartItemId: string, increment: number) => {
    setCartItems((prev) => {
      const updated = prev.map((x) => {
        if (x.id === cartItemId) {
          const qty = x.quantity + increment;
          return qty > 0 ? { ...x, quantity: qty } : null;
        }
        return x;
      }).filter(Boolean) as CartItem[];
      localStorage.setItem('wow_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => {
      const updated = prev.filter((x) => x.id !== cartItemId);
      localStorage.setItem('wow_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem('wow_cart');
  };

  // References for smooth scrolling sections
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const promotionRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // Filter items based on active category, search query, or favorites state
  const filteredItems = menuItems.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      item.name.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query) ||
      item.ingredients.some(i => i.toLowerCase().includes(query));

    if (!matchesSearch) return false;

    if (showOnlyFavorites) {
      return favoriteIds.includes(item.id);
    }
    
    if (activeCategory === 'all') {
      return true;
    }

    return item.category === activeCategory;
  });

  const handleJumpToSection = (section: 'home' | 'menu' | 'contact') => {
    setSelectedItem(null);
    setShowOnlyFavorites(false);

    if (section === 'home') {
      setActiveCategory('all');
      menuPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (section === 'menu') {
      menuPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (section === 'contact') {
      const footerElement = document.querySelector('footer');
      footerElement?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Quick category switch and scroll to menu view
  const handleSelectCategory = (categoryId: CategoryId | 'all') => {
    setShowOnlyFavorites(false);
    setActiveCategory(categoryId);
    menuPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Reset filtering configuration
  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setShowOnlyFavorites(false);
  };

  // Signature Spotlight items
  const spotlightItems = menuItems.filter((item) => item.tags.isSignature).slice(0, 3);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 pb-20 md:pb-0 ${
        isDarkMode ? 'bg-[#ff6b00]/3 bg-[#0f0f11] text-white' : 'bg-[#f8f8fa] text-neutral-900'
      }`}>
        
        {/* Sticky Top Header */}
        <Header
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          cartCount={cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
          onOpenCart={() => setIsCartOpen(true)}
          favoriteCount={favoriteIds.length}
          onToggleFavoritesOnly={(favsOnly) => {
            setShowOnlyFavorites(favsOnly);
            menuPanelRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
          showOnlyFavorites={showOnlyFavorites}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onJumpToSection={handleJumpToSection}
        />

        {/* Welcoming Subheader Bar */}
        <div className={`py-2 px-4 border-b text-center select-none ${
          isDarkMode ? 'bg-neutral-900/60 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-100 text-neutral-605'
        }`}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] font-bold">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Bole Road, Addis Ababa • Active Counter Delivery</span>
            </span>
            <span className={isDarkMode ? 'text-neutral-500 hidden sm:inline' : 'text-neutral-300 hidden sm:inline'}>•</span>
            <span className="text-[#ff6b00]">
              Get 15% OFF your next order with coupon code: <span className="underline font-black">WOW15</span>
            </span>
          </div>
        </div>

        {/* Categories Tabs & Menu Grid Section Container: FIRST VIEWPORT FOR LAUNCH */}
        <div ref={menuPanelRef} id="menu-section" className="flex-1 flex flex-col">
          
          {/* horizontal category tabs */}
          <CategoryNav
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
            isDarkMode={isDarkMode}
          />

          {/* Search Area & Metrics Controller */}
          <section className={`py-4 px-4 border-b ${
            isDarkMode ? 'bg-[#121216]/60 border-neutral-800' : 'bg-white border-neutral-100'
          }`}>
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              
              {/* Search input with search icon inside */}
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search burgers, beverages or ingredients..."
                  className={`w-full py-2.5 pl-10 pr-4 rounded-full text-xs font-bold tracking-wide outline-none border transition-theme ${
                    isDarkMode 
                      ? 'bg-neutral-900 border-neutral-800 text-white focus:border-[#ff6b00]' 
                      : 'bg-neutral-100 border-neutral-200 text-neutral-900 focus:border-[#ff6b00] focus:bg-white'
                  }`}
                  id="primary-search-input"
                />
              </div>

              {/* Total items found and reset filters controller */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-450 font-mono">
                  {showOnlyFavorites 
                    ? `${filteredItems.length} favorites identified` 
                    : `${filteredItems.length} delicacies found`}
                </div>

                {(searchQuery || activeCategory !== 'all' || showOnlyFavorites) && (
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase bg-red-500/10 text-red-500 hover:bg-red-505/20 border border-red-500/10 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset filters</span>
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Main Food Grid Area */}
          <section className="py-6 sm:py-10 px-4 max-w-7xl mx-auto w-full flex-1">
            
            {/* Custom Header Stats banner */}
            {showOnlyFavorites && (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20 flex items-center justify-between">
                <div>
                  <h3 className="text-xs uppercase font-extrabold tracking-widest text-red-500">My Favorites Selections</h3>
                  <p className="text-[10px] sm:text-xs text-neutral-400 mt-1">Reviewing items liked during this browsing session.</p>
                </div>
                <button 
                  onClick={() => setShowOnlyFavorites(false)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg text-[10px] font-bold uppercase"
                >
                  Show All Items
                </button>
              </div>
            )}

            {/* Food Grid: 2-column mobile layout, responsive grid on desk */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6" id="homepage-food-grid">
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onSelect={setSelectedItem}
                  isFavorite={favoriteIds.includes(item.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onAddToCart={handleAddToCart}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>

            {/* Empty fallback handler */}
            {filteredItems.length === 0 && (
              <div className="py-16 text-center space-y-3.5 max-w-md mx-auto">
                <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mx-auto text-neutral-400 border border-neutral-800">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-wider">No matching delicacies found</p>
                  <p className="text-xs text-neutral-500 leading-normal">
                    We couldn't locate any menu items in this criteria. Try refining your spelling or clicking the reset button below.
                  </p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 mt-2 bg-[#ff6b00] text-white hover:bg-orange-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                >
                  Reset Selections
                </button>
              </div>
            )}

          </section>

        </div>

        {/* Signature Spotlight Showcase */}
        <section className={`py-12 sm:py-16 border-t border-b ${
          isDarkMode ? 'bg-[#18181c]/40 border-neutral-800/60' : 'bg-neutral-50 border-neutral-100'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#ff6b00] uppercase tracking-widest leading-none">
                  <Award className="w-4 h-4" />
                  <span>The Chef's Masterpieces</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                  Spotlight Signatures
                </h3>
              </div>
              <p className="text-xs text-neutral-500 max-w-sm font-bold">
                Our kitchen highlights for first-time cafe explorers in Addis Ababa. 
                A collection of our highest voted, premium crafted recipes.
              </p>
            </div>

            {/* Spotlight signature cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {spotlightItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`group rounded-3xl border transition-all cursor-pointer overflow-hidden flex flex-col h-full hover:shadow-lg ${
                    isDarkMode 
                      ? 'bg-[#121216] border-neutral-800/80 text-white hover:border-[#ff6b00]/30' 
                      : 'bg-white border-neutral-100 hover:border-orange-200'
                  }`}
                >
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden shrink-0 bg-neutral-900">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                    <span className="absolute top-3 right-3 bg-[#ff6b00] text-white text-[9.5px] font-black px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 fill-white/10" />
                      Chef Selection
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-[#ff6b00] tracking-wider block">
                        {item.category === 'burgers' ? '🔥 signature patty' : item.category === 'coffee' ? '☕ Single-Origin Arabica' : '🍰 gourmet sweet'}
                      </span>
                      <h4 className="font-extrabold group-hover:text-[#ff6b00] transition-colors uppercase text-sm sm:text-base leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-xs text-neutral-400 leading-normal line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between border-t border-neutral-850 pt-3">
                      <span className="text-sm font-extrabold font-mono text-[#ff6b00]">
                        {item.price} <span className="text-[10px] font-bold">ETB</span>
                      </span>
                      <span className="text-xs font-black uppercase text-[#ff6b00] group-hover:underline flex items-center gap-0.5">
                        Inspect Craft <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Dynamic Promotional Hero Area */}
        <div ref={promotionRef} id="home-section" className="shrink-0">
          <Hero onExploreClick={() => handleSelectCategory('burgers')} />
        </div>

        {/* Ambiance Callouts Section */}
        <section className={`py-12 px-6 border-b ${
          isDarkMode ? 'bg-[#0f0f11]/40 border-neutral-850' : 'bg-white border-neutral-100'
        }`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-2 mb-12">
              <span className="text-[10px] text-[#ff6b00] font-extrabold uppercase tracking-widest bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/10">
                Gourmet Standard
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                The Brand Philosophy
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-semibold">
                At WowBurger, we blend the high-adrenaline excitement of giant, juicy, charcoal-cooked 
                gourmet burgers with the slow-drip, delicate, organic focus of a boutique Habesha coffee shop. 
                Enjoy our handcrafted menu made wholely with local premium flour, prime meat varieties, and Yirgacheffe roasts.
              </p>
            </div>

            {/* Core Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Pillar 1 */}
              <div className={`p-6 rounded-3xl border space-y-3.5 ${
                isDarkMode ? 'bg-[#121216] border-neutral-800' : 'bg-neutral-50 border-neutral-100'
              }`}>
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#ff6b00]">
                  <Flame className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm sm:text-base uppercase tracking-tight">
                  Wagyu Prime Beef
                </h4>
                <p className="text-xs text-neutral-450 leading-relaxed">
                  Our meat is freshly ground in-house, flame-grilled on our volcanic stone double grates, 
                  seasoned with premium organic spices, and caramelized for standard savory outcomes.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className={`p-6 rounded-3xl border space-y-3.5 ${
                isDarkMode ? 'bg-[#121216] border-neutral-800' : 'bg-neutral-50 border-neutral-100'
              }`}>
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-amber-500">
                  <Coffee className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm sm:text-base uppercase tracking-tight">
                  Single-Origin Brews
                </h4>
                <p className="text-xs text-neutral-450 leading-relaxed">
                  We celebrate Ethiopian coffee origin by brewing dry-processed Arabica beans. 
                  Every cup is slow-poured by certified baristas to emphasize delicate jasmine floral aromas.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className={`p-6 rounded-3xl border space-y-3.5 sm:col-span-2 lg:col-span-1 ${
                isDarkMode ? 'bg-[#121216] border-neutral-800' : 'bg-neutral-50 border-neutral-100'
              }`}>
                <div className="w-10 h-10 rounded-xl bg-[#ff6b00]/10 border border-orange-500/15 flex items-center justify-center text-emerald-500">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm sm:text-base uppercase tracking-tight">
                  Local Teff Crumb Desserts
                </h4>
                <p className="text-xs text-neutral-450 leading-relaxed">
                  Every pastry and rich cheesecake incorporates local whole-grains like toasted Teff and 
                  fragrant wildflower forest honey harvested sustainably from local rural beehive cooperatives.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Sticky Mobile Bottom Navigation with Orange Accents */}
        <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t shadow-2xl flex items-center justify-around py-2.5 px-3 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-[#121216]/95 backdrop-blur-md border-neutral-800/80 text-white' 
            : 'bg-white/95 backdrop-blur-md border-neutral-200/90 text-neutral-900'
        }`}>
          
          {/* Mobile HOME */}
          <button
            onClick={() => {
              setShowOnlyFavorites(false);
              setActiveCategory('all');
              menuPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
              !showOnlyFavorites && activeCategory === 'all'
                ? 'text-[#ff6b00] font-black'
                : 'text-neutral-500 hover:text-[#ff6b00]'
            }`}
          >
            <Compass className="w-4.5 h-4.5 shrink-0" />
            <span className="text-[9px] uppercase tracking-wider font-extrabold">Home</span>
          </button>

          {/* Mobile FOOD */}
          <button
            onClick={() => {
              setShowOnlyFavorites(false);
              setActiveCategory('burgers');
              menuPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
              !showOnlyFavorites && activeCategory === 'burgers'
                ? 'text-[#ff6b00] font-black'
                : 'text-neutral-500 hover:text-[#ff6b00]'
            }`}
          >
            <Flame className="w-4.5 h-4.5 shrink-0" />
            <span className="text-[9px] uppercase tracking-wider font-extrabold">Food</span>
          </button>

          {/* Mobile DRINKS */}
          <button
            onClick={() => {
              setShowOnlyFavorites(false);
              setActiveCategory('coffee');
              menuPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
              !showOnlyFavorites && activeCategory === 'coffee'
                ? 'text-[#ff6b00] font-black'
                : 'text-neutral-500 hover:text-[#ff6b00]'
            }`}
          >
            <Coffee className="w-4.5 h-4.5 shrink-0" />
            <span className="text-[9px] uppercase tracking-wider font-extrabold">Drinks</span>
          </button>

          {/* Mobile FAVORITES */}
          <button
            onClick={() => {
              setShowOnlyFavorites(true);
              menuPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition-all cursor-pointer relative ${
              showOnlyFavorites ? 'text-[#ff6b00] font-black' : 'text-neutral-500 hover:text-[#ff6b00]'
            }`}
          >
            <div className="relative">
              <Heart className={`w-4.5 h-4.5 shrink-0 ${showOnlyFavorites ? 'fill-[#ff6b00] text-[#ff6b00]' : 'text-neutral-500'}`} />
              {favoriteIds.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#ff6b00] text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">
                  {favoriteIds.length}
                </span>
              )}
            </div>
            <span className="text-[9px] uppercase tracking-wider font-extrabold">Favorites</span>
          </button>
        </div>

        {/* Detailed Menu Item View Slide drawer */}
        <ItemDetailDrawer
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSelectRelated={(relatedItem) => setSelectedItem(relatedItem)}
          menuItems={menuItems}
          isFavorite={selectedItem ? favoriteIds.includes(selectedItem.id) : false}
          onToggleFavorite={handleToggleFavorite}
          onAddToCart={handleAddToCart}
          isDarkMode={isDarkMode}
        />

        {/* Shopping checkout Cart Drawer overlay */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          isDarkMode={isDarkMode}
        />

        {/* Administrative Dashboard Portal Modal Overlay */}
        {isAdminOpen && (
          <AdminDashboard
            categories={categories}
            menuItems={menuItems}
            onDataChange={(newCats, newItems) => {
              setCategories(newCats);
              setMenuItems(newItems);
              if (newCats.length > 0 && activeCategory !== 'all' && !newCats.some(c => c.id === activeCategory)) {
                setActiveCategory(newCats[0].id);
              }
            }}
            onClose={() => setIsAdminOpen(false)}
          />
        )}

        {/* Standard Footer Area */}
        <div ref={footerRef}>
          <Footer onBackToTop={() => menuPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />
        </div>

      </div>
  );
}
