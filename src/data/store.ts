import { Category, MenuItem, Employee } from '../types';
import { CATEGORIES as DEFAULT_CATEGORIES, MENU_ITEMS as DEFAULT_MENU_ITEMS } from './menu';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEYS = {
  CATEGORIES: 'wow_categories',
  MENU_ITEMS: 'wow_menu_items',
  EMPLOYEES: 'wow_employees'
};

const DEFAULT_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Selam Tesfaye',
    username: 'selam_manager',
    passwordPlain: 'admin',
    role: 'Manager',
    joinedDate: '2025-01-20'
  },
  {
    id: 'emp-2',
    name: 'Yonas Kebede',
    username: 'yonas_chef',
    passwordPlain: 'chef123',
    role: 'Chef',
    joinedDate: '2025-03-15'
  },
  {
    id: 'emp-3',
    name: 'Betty Alene',
    username: 'betty_cashier',
    passwordPlain: 'cashier123',
    role: 'Cashier',
    joinedDate: '2025-05-10'
  }
];

export function getStoredEmployees(): Employee[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    if (raw) {
      const parsed = JSON.parse(raw) as Employee[];
      if (parsed && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading employees:', err);
  }
  // Initialize with defaults if empty
  try {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(DEFAULT_EMPLOYEES));
  } catch (err) {
    console.error('Failed to save default employees:', err);
  }
  return DEFAULT_EMPLOYEES;
}

export function saveEmployees(employees: Employee[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  } catch (err) {
    console.error('Failed to save employees to local storage', err);
  }
}

// State variables to store the dynamically resolved table names
let resolvedCategoriesTable = 'wow_categories';
let resolvedMenuItemsTable = 'wow_menu_items';

// Dynamically inspects Supabase to see which tables are active
async function resolveActualTables(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  
  // Resolve Categories Table name
  try {
    const { error: testError1 } = await supabase.from('wow_categories').select('id').limit(1);
    if (testError1 && (testError1.code === '42P01' || testError1.message.includes('does not exist'))) {
      const { error: testError2 } = await supabase.from('categories').select('id').limit(1);
      if (!testError2 || (testError2.code !== '42P01' && !testError2.message.includes('does not exist'))) {
        resolvedCategoriesTable = 'categories';
        console.log('Resolved categories table to alternative: "categories"');
      }
    }
  } catch (err) {
    console.warn('Error resolving categories table, using wow_categories by default', err);
  }

  // Resolve Menu Items Table name
  try {
    const { error: testError1 } = await supabase.from('wow_menu_items').select('id').limit(1);
    if (testError1 && (testError1.code === '42P01' || testError1.message.includes('does not exist'))) {
      const { error: testError2 } = await supabase.from('menu_items').select('id').limit(1);
      if (!testError2 || (testError2.code !== '42P01' && !testError2.message.includes('does not exist'))) {
        resolvedMenuItemsTable = 'menu_items';
        console.log('Resolved menu items table to alternative: "menu_items"');
      }
    }
  } catch (err) {
    console.warn('Error resolving menu items table, using wow_menu_items by default', err);
  }
}

// Get categories from localStorage, or initialize with defaults
export function getStoredCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (raw) {
      let parsed = JSON.parse(raw) as Category[];
      if (parsed.length === 0) {
        parsed = DEFAULT_CATEGORIES.map(cat => ({
          ...cat,
          count: DEFAULT_MENU_ITEMS.filter(item => item.category === cat.id).length
        }));
      }
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
          if (items.length === 0) {
            items = DEFAULT_MENU_ITEMS;
          }
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
      if (parsed.length === 0) {
        parsed = DEFAULT_MENU_ITEMS;
      }
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
        await resolveActualTables();
        // Upsert categories
        for (const cat of categories) {
          await supabase.from(resolvedCategoriesTable).upsert({
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
          await supabase.from(resolvedCategoriesTable).delete().not('id', 'in', `(${list})`);
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
        await resolveActualTables();
        // Upsert all items with dual-compatibility helper
        for (const item of items) {
          await safeUpsertMenuItem(item);
        }
        // Delete items no longer in the set
        const itemIds = items.map(i => i.id);
        if (itemIds.length > 0) {
          const list = itemIds.map(id => `'${id}'`).join(',');
          await supabase.from(resolvedMenuItemsTable).delete().not('id', 'in', `(${list})`);
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
        await resolveActualTables();
        // Delete items first to satisfy foreign key constraints gently
        await supabase.from(resolvedMenuItemsTable).delete().neq('id', 'placeholder-doesnot-exist');
        await supabase.from(resolvedCategoriesTable).delete().neq('id', 'placeholder-doesnot-exist');

        // Seed default categories
        for (const cat of cats) {
          await supabase.from(resolvedCategoriesTable).upsert({
            id: cat.id,
            name: cat.name,
            count: cat.count,
            icon: cat.icon,
            description: cat.description
          });
        }

        // Seed default items with dual-compatibility helper
        for (const item of items) {
          await safeUpsertMenuItem(item);
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
    await resolveActualTables();

    // 1. Fetch categories
    const { data: catData, error: catErr } = await supabase.from(resolvedCategoriesTable).select('*');
    if (catErr) throw catErr;

    // 2. Fetch menu items
    const { data: itemData, error: itemErr } = await supabase.from(resolvedMenuItemsTable).select('*');
    if (itemErr) throw itemErr;

    // Handle individual empty tables or complete seeding dynamically to ensure robust experience
    let finalCatData = catData || [];
    let finalItemData = itemData || [];

    if (finalCatData.length === 0) {
      console.log('Remote Supabase categories table is empty. Auto-seeding default categories...');
      const defaultCats = DEFAULT_CATEGORIES.map(cat => ({
        ...cat,
        count: DEFAULT_MENU_ITEMS.filter(item => item.category === cat.id).length
      }));

      for (const cat of defaultCats) {
        await supabase.from(resolvedCategoriesTable).upsert({
          id: cat.id,
          name: cat.name,
          count: cat.count,
          icon: cat.icon,
          description: cat.description
        });
      }
      finalCatData = defaultCats as any[];
    }

    if (finalItemData.length === 0) {
      console.log('Remote Supabase menu items table is empty. Auto-seeding default menu items...');
      for (const item of DEFAULT_MENU_ITEMS) {
        await safeUpsertMenuItem(item);
      }
      finalItemData = DEFAULT_MENU_ITEMS as any[];
    }

    const parsedCats: Category[] = finalCatData.map(c => ({
      id: c.id,
      name: c.name,
      count: Number(c.count || 0),
      icon: c.icon || 'Flame',
      description: c.description || ''
    }));

    const parsedItems: MenuItem[] = finalItemData.map(i => ({
      id: i.id,
      name: i.name,
      category: i.category,
      price: Number(i.price || 0),
      description: i.description || '',
      imageUrl: i.imageUrl || i.image_url || i.imageurl || '',
      ingredients: i.ingredients || [],
      estimatedTime: i.estimatedTime || i.estimated_time || i.estimatedtime || '10-15 mins',
      nutrition: i.nutrition || {},
      tags: i.tags || {},
      rating: Number(i.rating || 4.5),
      reviewCount: Number(i.reviewCount || i.review_count || i.reviewcount || 0)
    }));

    // Defensive fallback: If parsing returned empty items after all seeding/fetching configurations, 
    // load native defaults to make sure empty states never show to the user on startup
    let finalItems = parsedItems;
    if (finalItems.length === 0) {
      finalItems = DEFAULT_MENU_ITEMS;
    }

    let finalCats = parsedCats;
    if (finalCats.length === 0) {
      finalCats = DEFAULT_CATEGORIES;
    }

    // Update categories count dynamically if items have changed
    const synchronizedCats = finalCats.map(cat => ({
      ...cat,
      count: finalItems.filter(item => item.category === cat.id).length
    }));

    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(synchronizedCats));
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(finalItems));

    return { categories: synchronizedCats, menuItems: finalItems };
  } catch (err) {
    console.error('Failed to pull from Supabase database:', err);
    return null;
  }
}

// Resilient case-insensitive fallback helper to support both camelCase and snake_case column schemas
async function safeUpsertMenuItem(item: any): Promise<void> {
  if (!supabase) return;
  const img = typeof item.imageUrl === 'object' && item.imageUrl !== null ? (item.imageUrl as any).src : item.imageUrl;
  
  // Try running with camelCase first (the default expected structure)
  const camelPayload = {
    id: item.id,
    name: item.name,
    category: item.category,
    price: Number(item.price || 0),
    description: item.description || '',
    imageUrl: img || '',
    ingredients: item.ingredients || [],
    estimatedTime: item.estimatedTime || '10-15 mins',
    nutrition: item.nutrition || {},
    tags: item.tags || [],
    rating: Number(item.rating || 4.5),
    reviewCount: Number(item.reviewCount || 0)
  };

  const { error } = await supabase.from(resolvedMenuItemsTable).upsert(camelPayload);
  
  if (error) {
    console.warn(`Upsert with camelCase columns failed on item ${item.id}, retrying with snake_case column names... Error:`, error.message);
    
    // Retry with standard postgres/unquoted-friendly snake_case
    const snakePayload = {
      id: item.id,
      name: item.name,
      category: item.category,
      price: Number(item.price || 0),
      description: item.description || '',
      image_url: img || '',
      ingredients: item.ingredients || [],
      estimated_time: item.estimatedTime || '10-15 mins',
      nutrition: item.nutrition || {},
      tags: item.tags || [],
      rating: Number(item.rating || 4.5),
      review_count: Number(item.reviewCount || 0)
    };

    const { error: retryError } = await supabase.from(resolvedMenuItemsTable).upsert(snakePayload);
    if (retryError) {
      console.warn(`Upsert with snake_case columns also failed on item ${item.id}, final retry with lowercased unquoted names:`, retryError.message);
      
      // Last-ditch retry with literal unquoted lowercased fallback names (e.g. imageurl, estimatedtime, reviewcount)
      const lowercasePayload = {
        id: item.id,
        name: item.name,
        category: item.category,
        price: Number(item.price || 0),
        description: item.description || '',
        imageurl: img || '',
        ingredients: item.ingredients || [],
        estimatedtime: item.estimatedTime || '10-15 mins',
        nutrition: item.nutrition || {},
        tags: item.tags || [],
        rating: Number(item.rating || 4.5),
        reviewcount: Number(item.reviewCount || 0)
      };
      
      const { error: finalError } = await supabase.from(resolvedMenuItemsTable).upsert(lowercasePayload);
      if (finalError) {
        console.error(`Last-ditch lowercased upsert copy failed on item ${item.id}:`, finalError.message);
        throw finalError;
      }
    }
  }
}

// Track view count for item analytics
export function incrementItemViewCount(itemId: string): MenuItem[] {
  try {
    const items = getStoredMenuItems();
    const updated = items.map(item => {
      if (item.id === itemId) {
        return { ...item, viewCount: (item.viewCount || 0) + 1 };
      }
      return item;
    });
    saveMenuItems(updated);
    return updated;
  } catch (err) {
    console.error('Failed to increment view count', err);
    return getStoredMenuItems();
  }
}
