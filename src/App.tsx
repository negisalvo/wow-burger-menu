import { useState, useRef } from 'react';
import { Sparkles, Compass, Flame, Coffee, Heart, Clock, UtensilsCrossed, Award, ArrowUpRight } from 'lucide-react';
import DeviceSimulator, { DeviceMode } from './components/DeviceSimulator';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryNav from './components/CategoryNav';
import MenuItemCard from './components/MenuItemCard';
import ItemDetailDrawer from './components/ItemDetailDrawer';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import { MenuItem, Category, CategoryId } from './types';
import { getStoredCategories, getStoredMenuItems } from './data/store';

export default function App() {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('responsive');
  
  // Real-time local storage dynamic databases
  const [categories, setCategories] = useState<Category[]>(() => getStoredCategories());
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => getStoredMenuItems());
  const [activeCategory, setActiveCategory] = useState<CategoryId>(() => {
    const loadedCats = getStoredCategories();
    return loadedCats[0]?.id || 'burgers';
  });
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // References for smooth scrolling sections
  const heroRef = useRef<HTMLDivElement>(null);
  const menuGridRef = useRef<HTMLDivElement>(null);

  // Filter items based on active category
  const filteredItems = menuItems.filter((item) => item.category === activeCategory);

  // Get signature spotlight highlights (Chef signatures or highest rated)
  const spotlightItems = menuItems.filter((item) => item.tags.isSignature).slice(0, 3);

  // Handle jump shortcut selections from top mockup controller
  const handleJumpToSection = (section: 'home' | 'menu' | 'contact' | 'detail-volcano') => {
    // Closes any existing open drawer
    setSelectedItem(null);

    if (section === 'home') {
      heroRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'menu') {
      menuGridRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'contact') {
      const footerElement = document.querySelector('footer');
      footerElement?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'detail-volcano') {
      // Find the preset item and open its drawer model immediately! (Fulfills Detail Page mockup test scenario)
      const volcanoItem = menuItems.find((mi) => mi.id === 'molten-chocolate-volcano') || menuItems[0];
      setSelectedItem(volcanoItem || null);
    }
  };

  // Quick category switch and scroll to menu view
  const handleSelectCategory = (categoryId: CategoryId) => {
    setActiveCategory(categoryId);
    menuGridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <DeviceSimulator
      deviceMode={deviceMode}
      setDeviceMode={setDeviceMode}
      onJumpToSection={handleJumpToSection}
    >
      <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans transition-all">
        
        {/* Main Website Header */}
        <Header
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Hero Section Banner Wrapper */}
        <div ref={heroRef} id="home-section">
          <Hero onExploreClick={() => handleSelectCategory('burgers')} />
        </div>

        {/* Ambiance Callouts Section */}
        <section className="bg-white py-12 px-6 border-b border-neutral-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-3 mb-12">
              <span className="text-[10px] text-rose-600 font-extrabold uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                Gourmet Standard
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight uppercase">
                The Brand Philosophy
              </h3>
              <p className="text-xs sm:text-sm text-neutral-550 leading-relaxed font-semibold text-neutral-500">
                At Wow Burger, we blend the high-adrenaline excitement of giant, juicy, charcoal-cooked 
                gourmet burgers with the slow-drip, delicate, organic focus of a boutique Habesha coffee shop. 
                Enjoy our handcrafted menu made wholely with local premium flour, prime meat varieties, and Yirgacheffe roasts.
              </p>
            </div>

            {/* Core Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Pillar 1 */}
              <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 space-y-4 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-100 flex items-center justify-center text-rose-600">
                  <Flame className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-neutral-900 uppercase">
                  Wagyu Prime Beef
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Our meat is freshly ground in-house, flame-grilled on our volcanic stone double grates, 
                  seasoned with premium organic spices, and caramelized for standard savory outcomes.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 space-y-4 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-100 flex items-center justify-center text-amber-600">
                  <Coffee className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-neutral-900 uppercase">
                  Single-Origin Brews
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  We celebrate Ethiopian coffee origin by brewing dry-processed Arabica beans. 
                  Every cup is slow-poured by certified baristas to emphasize delicate jasmine floral aromas.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 space-y-4 hover:shadow-md transition-all sm:col-span-2 lg:col-span-1">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-neutral-900 uppercase">
                  Local Teff Crumb Desserts
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Every pastry and rich cheesecake incorporates local whole-grains like toasted Teff and 
                  fragrant wildflower forest honey harvested sustainably from local rural beehive cooperatives.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Signature Spotlight Showcase */}
        <section className="bg-neutral-50 py-12 sm:py-16 px-6 border-b border-neutral-100">
          <div className="max-w-7xl mx-auto space-y-10">
            
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500 uppercase tracking-widest leading-none">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>The Chef's Masterpieces</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-tight">
                  Spotlight Signatures
                </h3>
              </div>
              <p className="text-xs text-neutral-500 max-w-md font-medium">
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
                  className="group bg-white rounded-3xl border border-neutral-150/80 hover:border-amber-300 shadow-xs hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col h-full"
                >
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-550"
                    />
                    <span className="absolute top-3 right-3 bg-amber-400 text-neutral-950 text-[10px] font-black px-2.5 py-1 rounded-lg border border-white/20 shadow-md uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-neutral-950" />
                      Signature Spotlight
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-rose-500 tracking-wider">
                        {item.category === 'burgers' ? '🔥 wagyu blend' : item.category === 'coffee' ? '☕ micro-lot brew' : '🍰 premium sweet'}
                      </span>
                      <h4 className="font-extrabold text-neutral-900 group-hover:text-rose-600 transition-colors uppercase text-sm sm:text-base">
                        {item.name}
                      </h4>
                      <p className="text-xs text-neutral-500 font-medium line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                      <span className="text-sm font-extrabold text-neutral-900 font-mono">
                        {item.price} <span className="text-xs text-rose-600 font-bold">ETB</span>
                      </span>
                      <span className="text-xs font-bold text-rose-600 group-hover:underline flex items-center gap-0.5">
                        Inspect Craft <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Categories Tabs & Menu Grid section Container */}
        <div ref={menuGridRef} id="menu-section" className="bg-white flex-1 flex flex-col">
          
          {/* Sub Navigation categories bar */}
          <CategoryNav
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          {/* Grid display contents */}
          <section className="py-10 px-6 max-w-7xl mx-auto w-full">
            
            {/* Header statistics info in page */}
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3 mb-8">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">
                showing {filteredItems.length} curated options available
              </span>
              <span className="text-[10px] text-neutral-400 font-bold uppercase select-none font-mono">
                Bole Road Lounge Standard
              </span>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onSelect={setSelectedItem}
                />
              ))}
            </div>

            {/* Empty category fallback (just in case) */}
            {filteredItems.length === 0 && (
              <div className="py-16 text-center text-neutral-400 space-y-2">
                <p className="text-sm font-bold">No menu items found in this section.</p>
                <p className="text-xs">Please try toggling another gourmet category above.</p>
              </div>
            )}

          </section>

        </div>

        {/* Detailed Menu Item View slide drawer (Popup) */}
        <ItemDetailDrawer
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSelectRelated={(relatedItem) => setSelectedItem(relatedItem)}
          menuItems={menuItems}
        />

        {/* Administrative Dashboard Portal Modal Overlay */}
        {isAdminOpen && (
          <AdminDashboard
            categories={categories}
            menuItems={menuItems}
            onDataChange={(newCats, newItems) => {
              setCategories(newCats);
              setMenuItems(newItems);
              // Safe-guard: if current category gets deleted, auto select the first remaining
              if (newCats.length > 0 && !newCats.some(c => c.id === activeCategory)) {
                setActiveCategory(newCats[0].id);
              }
            }}
            onClose={() => setIsAdminOpen(false)}
          />
        )}

        {/* Standard Footer Area */}
        <Footer onBackToTop={() => heroRef.current?.scrollIntoView({ behavior: 'smooth' })} />

      </div>
    </DeviceSimulator>
  );
}
