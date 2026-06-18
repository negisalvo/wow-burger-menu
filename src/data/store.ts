import { Category, MenuItem } from '../types';
import { CATEGORIES as DEFAULT_CATEGORIES, MENU_ITEMS as DEFAULT_MENU_ITEMS } from './menu';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEYS = {
  CATEGORIES: 'wow_categories',
  MENU_ITEMS: 'wow_menu_items'
};

// Get categories from localStorage, or initialize with defaults
export function getStoredCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (raw) {
      let parsed = JSON.parse(raw) as Category[];
      // Sync any newly added categories or filter out obsolete categories
      const sanitized = parsed.filter(pc => DEFAULT_CATEGORIES.some(dc => dc.id === pc.id));
      const missingCats = DEFAULT_CATEGORIES.filter(dc => !sanitized.some(pc => pc.id === dc.id));
      if (missingCats.length > 0 || sanitized.length !== parsed.length) {
        parsed = [...sanitized, ...missingCats];
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(parsed));
      } else {
        parsed = sanitized;
      }
      
      // Load current raw items straight from storage to avoid calling getStoredMenuItems recursively
      let items: MenuItem[] = [];
      const rawItems = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
      if (rawItems) {
        try {
          items = JSON.parse(rawItems) as MenuItem[];
        } catch {
          items = DEFAULT_MENU_ITEMS;
        }
      } else {
        items = DEFAULT_MENU_ITEMS;
      }

      return parsed.map(cat => ({
        ...cat,
        count: items.filter(item => item.category === cat.id).length
      }));
    }
  } catch (err) {
    console.error('Error loading stored categories:', err);
  }

  // Fallback to defaults, write to storage
  const initial = DEFAULT_CATEGORIES.map(cat => ({
    ...cat,
    count: DEFAULT_MENU_ITEMS.filter(item => item.category === cat.id).length
  }));
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initial));
  } catch (err) {
    console.error('Failed to save categories to local storage', err);
  }
  return initial;
}

// Get menu items from localStorage, or initialize with defaults
export function getStoredMenuItems(): MenuItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
    if (raw) {
      let parsed = JSON.parse(raw) as MenuItem[];
      // Sync any newly added menu items in DEFAULT_MENU_ITEMS
      const missingItems = DEFAULT_MENU_ITEMS.filter(di => !parsed.some(pi => pi.id === di.id));
      let hasChanged = false;
      if (missingItems.length > 0) {
        parsed = [...parsed, ...missingItems];
        hasChanged = true;
      }
      
      // Clean up deleted default items and removed categories
      const beforeCount = parsed.length;
      parsed = parsed.filter(item => 
        item.id !== 'onion-halos' && 
        item.id !== 'crispy-chicken-royal' && 
        item.category !== 'juice' &&
        item.id !== 'sprite-soda' &&
        item.id !== 'fanta-orange' &&
        item.id !== 'premium-water'
      );
      if (parsed.length !== beforeCount) {
        hasChanged = true;
      }

      // Sync and fix the old incorrect images for Addis Espresso Macchiato
      parsed = parsed.map(item => {
        if (item.id === 'addis-macchiato' && item.imageUrl && item.imageUrl.includes('photo-1485808191679-5f63bbd0a11a')) {
          const matchingDefault = DEFAULT_MENU_ITEMS.find(mi => mi.id === item.id);
          if (matchingDefault) {
            hasChanged = true;
            return { ...item, imageUrl: matchingDefault.imageUrl };
          }
        }
        return item;
      });

      // Dynamic migration: replace obsolete `/src/assets/images/` paths with the compiled Vite asset equivalents
      const migrated = parsed.map(item => {
        if (item.imageUrl && item.imageUrl.startsWith('/src/assets/images/')) {
          const matchingDefault = DEFAULT_MENU_ITEMS.find(mi => mi.id === item.id);
          if (matchingDefault) {
            hasChanged = true;
            return { ...item, imageUrl: matchingDefault.imageUrl };
          }
        }
        return item;
      });
      if (hasChanged) {
        saveMenuItems(migrated);
      }
      return migrated;
    }
  } catch (err) {
    console.error('Error loading stored menu items:', err);
  }

  // Fallback to defaults, write to storage
  saveMenuItems(DEFAULT_MENU_ITEMS);
  return DEFAULT_MENU_ITEMS;
}

// Save categories directly to local storage and sync to Supabase
export function saveCategories(categories: Category[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    
    if (isSupabaseConfigured && supabase) {
      (async () => {
        // Upsert categories
        for (const cat of categories) {
          await supabase.from('wow_categories').upsert({
            id: cat.id,
            name: cat.name,
            count: cat.count,
            icon: cat.icon,
            description: cat.description
          });
        }
        // Delete any obsolete categories
        const catIds = categories.map(c => c.id);
        if (catIds.length > 0) {
          const list = catIds.map(id => `'${id}'`).join(',');
          await supabase.from('wow_categories').delete().not('id', 'in', `(${list})`);
        }
      })().catch(err => console.error('Failed to sync categories to Supabase:', err));
    }
  } catch (err) {
    console.error('Failed to save categories to local storage', err);
  }
}

// Save menu items directly to local storage and sync to Supabase
export function saveMenuItems(items: MenuItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
    
    // Auto-update category counts when items list changes without causing recursive load cycles
    const rawCats = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    let categories: Category[] = [];
    if (rawCats) {
      try {
        categories = JSON.parse(rawCats) as Category[];
      } catch {
        categories = DEFAULT_CATEGORIES;
      }
    } else {
      categories = DEFAULT_CATEGORIES;
    }

    // Sync missing default categories if any
    const missingCats = DEFAULT_CATEGORIES.filter(dc => !categories.some(pc => pc.id === dc.id));
    if (missingCats.length > 0) {
      categories = [...categories, ...missingCats];
    }

    const updatedCategories = categories.map(cat => ({
      ...cat,
      count: items.filter(item => item.category === cat.id).length
    }));

    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updatedCategories));

    if (isSupabaseConfigured && supabase) {
      (async () => {
        // Upsert all items
        for (const item of items) {
          const img = typeof item.imageUrl === 'object' && item.imageUrl !== null ? (item.imageUrl as any).src : item.imageUrl;
          await supabase.from('wow_menu_items').upsert({
            id: item.id,
            name: item.name,
            category: item.category,
            price: item.price,
            description: item.description,
            imageUrl: img,
            ingredients: item.ingredients,
            estimatedTime: item.estimatedTime || '10-15 mins',
            nutrition: item.nutrition || {},
            tags: item.tags || {},
            rating: item.rating || 4.5,
            reviewCount: item.reviewCount || 0
          });
        }
        // Delete items no longer in the set
        const itemIds = items.map(i => i.id);
        if (itemIds.length > 0) {
          const list = itemIds.map(id => `'${id}'`).join(',');
          await supabase.from('wow_menu_items').delete().not('id', 'in', `(${list})`);
        }
      })().catch(err => console.error('Failed to sync menu items to Supabase:', err));
    }
  } catch (err) {
    console.error('Failed to save menu items to local storage', err);
  }
}

// Reset standard storage data to initial beautiful Ethiopian defaults
export function resetToDefaults(): { categories: Category[], menuItems: MenuItem[] } {
  localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
  localStorage.removeItem(STORAGE_KEYS.MENU_ITEMS);
  
  const items = DEFAULT_MENU_ITEMS;
  const cats = DEFAULT_CATEGORIES.map(cat => ({
    ...cat,
    count: items.filter(item => item.category === cat.id).length
  }));
  
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));

    if (isSupabaseConfigured && supabase) {
      (async () => {
        // Delete items first to satisfy foreign key constraints gently
        await supabase.from('wow_menu_items').delete().neq('id', 'placeholder-doesnot-exist');
        await supabase.from('wow_categories').delete().neq('id', 'placeholder-doesnot-exist');

        // Seed default categories
        for (const cat of cats) {
          await supabase.from('wow_categories').upsert({
            id: cat.id,
            name: cat.name,
            count: cat.count,
            icon: cat.icon,
            description: cat.description
          });
        }

        // Seed default items
        for (const item of items) {
          const img = typeof item.imageUrl === 'object' && item.imageUrl !== null ? (item.imageUrl as any).src : item.imageUrl;
          await supabase.from('wow_menu_items').upsert({
            id: item.id,
            name: item.name,
            category: item.category,
            price: item.price,
            description: item.description,
            imageUrl: img,
            ingredients: item.ingredients,
            estimatedTime: item.estimatedTime || '10-15 mins',
            nutrition: item.nutrition || {},
            tags: item.tags || {},
            rating: item.rating || 4.5,
            reviewCount: item.reviewCount || 0
          });
        }
      })().catch(err => console.error('Failed to reset Supabase to default seeded state:', err));
    }
  } catch (err) {
    console.error('Failed to reset storage to defaults', err);
  }
  
  return { categories: cats, menuItems: items };
}

// Pull the entire DB configuration state from Supabase dynamically on startup
export async function syncFromSupabase(): Promise<{ categories: Category[], menuItems: MenuItem[] } | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    // 1. Fetch categories
    const { data: catData, error: catErr } = await supabase.from('wow_categories').select('*');
    if (catErr) throw catErr;

    // 2. Fetch menu items
    const { data: itemData, error: itemErr } = await supabase.from('wow_menu_items').select('*');
    if (itemErr) throw itemErr;

    // Trigger seeding of empty database tables automatically if remote is empty
    if ((!catData || catData.length === 0) && (!itemData || itemData.length === 0)) {
      console.log('Remote Supabase backend is empty. Provisioning database details automatically...');
      const defaultCats = DEFAULT_CATEGORIES.map(cat => ({
        ...cat,
        count: DEFAULT_MENU_ITEMS.filter(item => item.category === cat.id).length
      }));

      // Upload default categories
      for (const cat of defaultCats) {
        await supabase.from('wow_categories').upsert({
          id: cat.id,
          name: cat.name,
          count: cat.count,
          icon: cat.icon,
          description: cat.description
        });
      }

      // Upload default menu items
      for (const item of DEFAULT_MENU_ITEMS) {
        const img = typeof item.imageUrl === 'object' && item.imageUrl !== null ? (item.imageUrl as any).src : item.imageUrl;
        await supabase.from('wow_menu_items').upsert({
          id: item.id,
          name: item.name,
          category: item.category,
          price: item.price,
          description: item.description,
          imageUrl: img,
          ingredients: item.ingredients,
          estimatedTime: item.estimatedTime || '10-15 mins',
          nutrition: item.nutrition || {},
          tags: item.tags || {},
          rating: item.rating || 4.5,
          reviewCount: item.reviewCount || 0
        });
      }

      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(defaultCats));
      localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(DEFAULT_MENU_ITEMS));
      return { categories: defaultCats, menuItems: DEFAULT_MENU_ITEMS };
    }

    const parsedCats: Category[] = (catData || []).map(c => ({
      id: c.id,
      name: c.name,
      count: Number(c.count || 0),
      icon: c.icon || 'Flame',
      description: c.description || ''
    }));

    const parsedItems: MenuItem[] = (itemData || []).map(i => ({
      id: i.id,
      name: i.name,
      category: i.category,
      price: Number(i.price || 0),
      description: i.description || '',
      imageUrl: i.imageUrl || i.image_url || '',
      ingredients: i.ingredients || [],
      estimatedTime: i.estimatedTime || i.estimated_time || '10-15 mins',
      nutrition: i.nutrition || {},
      tags: i.tags || {},
      rating: Number(i.rating || 4.5),
      reviewCount: Number(i.reviewCount || 0)
    }));

    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(parsedCats));
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(parsedItems));

    return { categories: parsedCats, menuItems: parsedItems };
  } catch (err) {
    console.error('Failed to pull from Supabase database:', err);
    return null;
  }
}

