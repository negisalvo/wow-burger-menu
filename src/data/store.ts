import { Category, MenuItem } from '../types';
import { CATEGORIES as DEFAULT_CATEGORIES, MENU_ITEMS as DEFAULT_MENU_ITEMS } from './menu';

const STORAGE_KEYS = {
  CATEGORIES: 'wow_categories',
  MENU_ITEMS: 'wow_menu_items'
};

// Get categories from localStorage, or initialize with defaults
export function getStoredCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (raw) {
      const parsed = JSON.parse(raw) as Category[];
      // Update counts dynamically based on current items to prevent drift
      const items = getStoredMenuItems();
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
  saveCategories(initial);
  return initial;
}

// Get menu items from localStorage, or initialize with defaults
export function getStoredMenuItems(): MenuItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
    if (raw) {
      return JSON.parse(raw) as MenuItem[];
    }
  } catch (err) {
    console.error('Error loading stored menu items:', err);
  }

  // Fallback to defaults, write to storage
  saveMenuItems(DEFAULT_MENU_ITEMS);
  return DEFAULT_MENU_ITEMS;
}

// Save categories directly to local storage
export function saveCategories(categories: Category[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (err) {
    console.error('Failed to save categories to local storage', err);
  }
}

// Save menu items directly to local storage
export function saveMenuItems(items: MenuItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
    
    // Auto-update category counts when items list changes
    const categories = getStoredCategories();
    saveCategories(categories);
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
  
  saveCategories(cats);
  saveMenuItems(items);
  
  return { categories: cats, menuItems: items };
}
