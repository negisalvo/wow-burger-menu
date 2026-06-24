"use client";

import React, { useState, useMemo } from 'react';
import { 
  Plus, Edit2, Trash2, Key, BarChart3, AppWindow, Flame, Check, X, 
  RotateCcw, Coffee, ShieldCheck, Dumbbell, Award, HelpCircle, 
  DollarSign, Sparkles, Filter, Search, Tag, Eye, Info, ListFilter,
  Users, Lock, Upload, ShieldAlert, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Category, MenuItem, CategoryId, Employee } from '../types';
import { 
  getStoredCategories, getStoredMenuItems, saveCategories, saveMenuItems, resetToDefaults,
  getStoredEmployees, saveEmployees 
} from '../data/store';
import { getImageSrc } from '../lib/utils';

// Set of preloaded elegant icons the manager can choose for categories
const ICON_PICKER_OPTIONS = [
  'Flame', 'Layers', 'Coffee', 'CupSoda', 'GlassWater', 'Dessert', 
  'Utensils', 'ChefHat', 'Pizza', 'GlassWater', 'Candy', 'Cookie', 'Sparkles'
];

interface AdminDashboardProps {
  categories: Category[];
  menuItems: MenuItem[];
  onDataChange: (newCategories: Category[], newItems: MenuItem[]) => void;
  onClose: () => void;
}

export default function AdminDashboard({ 
  categories, 
  menuItems, 
  onDataChange, 
  onClose 
}: AdminDashboardProps) {

  // Login authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [usernameInput, setUsernameInput] = useState('selam_manager');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [employees, setEmployees] = useState<Employee[]>(() => getStoredEmployees());
  
  // Password change form states
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');

  // Tab views
  const [activeTab, setActiveTab] = useState<'insights' | 'categories' | 'items'>('insights');

  // Search, filter, and page states
  const [itemSearchText, setItemSearchText] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  
  // Sorting & dietary filters
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'rating' | 'views'>('name');
  const [filterSpicyOnly, setFilterSpicyOnly] = useState(false);
  const [filterVeganOnly, setFilterVeganOnly] = useState(false);
  const [filterLocalOnly, setFilterLocalOnly] = useState(false);
  const [filterSignatureOnly, setFilterSignatureOnly] = useState(false);

  // Pagination controls
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Carousel base64 images list for multi uploads
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);

  // Employee CRUD states
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpUsername, setNewEmpUsername] = useState('');
  const [newEmpPassword, setNewEmpPassword] = useState('');
  const [newEmpRole, setNewEmpRole] = useState<'Manager' | 'Chef' | 'Cashier'>('Chef');

  // Interactive Form states (Creation & Edits)
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryFormState, setCategoryFormState] = useState({
    id: '',
    name: '',
    icon: 'Flame',
    description: ''
  });

  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemFormState, setItemFormState] = useState({
    id: '',
    name: '',
    category: 'burgers' as CategoryId,
    price: 0,
    description: '',
    imageUrl: '',
    ingredientsText: '', // raw textarea comma-separated
    estimatedTime: '10-12 mins',
    calories: 450,
    protein: '25g',
    carbs: '35g',
    fat: '15g',
    isVegan: false,
    isSpicy: false,
    isSignature: false,
    isGlutenFree: false,
    hasLocalTouch: false,
  });

  // Refs for auto-scrolling to forms when edited/opened
  const categoryFormRef = React.useRef<HTMLFormElement>(null);
  const itemFormRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (showCategoryForm) {
      const timer = setTimeout(() => {
        categoryFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [showCategoryForm, editingCategory]);

  React.useEffect(() => {
    if (showItemForm) {
      const timer = setTimeout(() => {
        itemFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [showItemForm, editingItem]);

  // Handle Authentication with staff credentials matching
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = employees.find(
      (emp) => emp.username === usernameInput && emp.passwordPlain === passwordInput
    );
    if (found) {
      setIsAuthenticated(true);
      setCurrentUser(found);
      setAuthError('');
      setPasswordInput('');
    } else {
      setAuthError('Incorrect password. Please try again.');
    }
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (currentUser.passwordPlain !== oldPassword) {
      setPasswordChangeError('Incorrect current password.');
      setPasswordChangeSuccess('');
      return;
    }
    if (!newPassword.trim()) {
      setPasswordChangeError('New password cannot be empty.');
      setPasswordChangeSuccess('');
      return;
    }
    
    // Update credentials
    const updatedEmployees = employees.map(emp => {
      if (emp.id === currentUser.id) {
        return { ...emp, passwordPlain: newPassword.trim() };
      }
      return emp;
    });
    
    setEmployees(updatedEmployees);
    saveEmployees(updatedEmployees);
    
    // update current user credentials too
    setCurrentUser({ ...currentUser, passwordPlain: newPassword.trim() });
    
    setPasswordChangeSuccess('Password successfully updated!');
    setPasswordChangeError('');
    setOldPassword('');
    setNewPassword('');
    setTimeout(() => {
      setShowPasswordChange(false);
      setPasswordChangeSuccess('');
    }, 2000);
  };

  // Perform quick recovery resetting to seed dataset
  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to restore the pristine menu seed dataset? This will overwrite your current changes in localStorage.')) {
      const data = resetToDefaults();
      onDataChange(data.categories, data.menuItems);
      alert('Pristine local dataset successfully restored!');
    }
  };

  // Compute stats dynamically purely from stored state items
  const stats = useMemo(() => {
    const totalItems = menuItems.length;
    const totalCategories = categories.length;
    
    // Total price metrics in ETB
    const maxPriceItem = menuItems.reduce((max, cur) => (cur.price > max.price ? cur : max), { name: 'None', price: 0 });
    const avgPrice = totalItems > 0 ? Math.round(menuItems.reduce((acc, cur) => acc + cur.price, 0) / totalItems) : 0;
    
    // Tag categories
    const spicyCount = menuItems.filter(i => i.tags.isSpicy).length;
    const veganCount = menuItems.filter(i => i.tags.isVegan).length;
    const localCount = menuItems.filter(i => i.tags.hasLocalTouch).length;
    const signatureCount = menuItems.filter(i => i.tags.isSignature).length;

    return {
      totalItems,
      totalCategories,
      maxPriceItem,
      avgPrice,
      spicyCount,
      veganCount,
      localCount,
      signatureCount
    };
  }, [categories, menuItems]);

  // CATEGORY OPERATIONS
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormState.name.trim()) return;

    // Build the slug/id automatically from name
    const generatedId = categoryFormState.id || categoryFormState.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '-');
    
    // Determine edit or create
    let updatedCats: Category[] = [];
    if (editingCategory) {
      updatedCats = categories.map(cat => 
        cat.id === editingCategory.id 
          ? { 
              ...cat, 
              name: categoryFormState.name, 
              icon: categoryFormState.icon, 
              description: categoryFormState.description 
            } 
          : cat
      );
    } else {
      // Check for dups
      if (categories.some(cat => cat.id === generatedId)) {
        alert('A category with this name or slug already exists!');
        return;
      }
      const newCat: Category = {
        id: generatedId,
        name: categoryFormState.name,
        count: 0,
        icon: categoryFormState.icon,
        description: categoryFormState.description
      };
      updatedCats = [...categories, newCat];
    }

    saveCategories(updatedCats);
    onDataChange(updatedCats, menuItems);
    
    // Reset forms
    setShowCategoryForm(false);
    setEditingCategory(null);
    setCategoryFormState({ id: '', name: '', icon: 'Flame', description: '' });
  };

  const handleEditCategoryToggle = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryFormState({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      description: cat.description
    });
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = (catId: string) => {
    const connectedItemsAmount = menuItems.filter(i => i.category === catId).length;
    
    let confirmMsg = `Are you sure you want to delete the "${catId}" category?`;
    if (connectedItemsAmount > 0) {
      confirmMsg += ` WARNING: This category currently contains ${connectedItemsAmount} menu items. Deleting the category will disconnect these items.`;
    }

    if (window.confirm(confirmMsg)) {
      const remainingCats = categories.filter(c => c.id !== catId);
      // Optional: Delete or move connected items
      const remainingItems = menuItems.filter(i => i.category !== catId);
      
      saveCategories(remainingCats);
      saveMenuItems(remainingItems);
      onDataChange(remainingCats, remainingItems);
      
      // Auto-assign active category to first remaining (if any)
      if (selectedCategoryFilter === catId) {
        setSelectedCategoryFilter('all');
      }
    }
  };

  // MENU ITEM OPERATIONS
  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemFormState.name.trim()) {
      alert('Please specify an item name.');
      return;
    }

    // Role blocks Check
    if (currentUser?.role === 'Chef' && editingItem) {
      // Check if price base was touched
      if (Number(itemFormState.price) !== Number(editingItem.price)) {
        alert('Permission Denied: Chefs are not permitted to change base price.');
        return;
      }
    } else if (currentUser?.role === 'Cashier' && editingItem) {
      // Check if details were touched
      if (itemFormState.name !== editingItem.name || itemFormState.category !== editingItem.category) {
        alert('Permission Denied: Cashiers can only update pricing.');
        return;
      }
    }

    // Comma string to ingredients list mapping
    const ingredientsArr = itemFormState.ingredientsText
      ? itemFormState.ingredientsText.split(',').map(s => s.trim()).filter(Boolean)
      : ['Fresh premium ingredients'];

    const generatedId = itemFormState.id || itemFormState.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '-');

    const formattedItem: MenuItem = {
      id: generatedId,
      name: itemFormState.name,
      category: itemFormState.category,
      price: Number(itemFormState.price) || 100,
      description: itemFormState.description || 'Delectable craft specialty prepared in-house.',
      imageUrl: itemFormState.imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      imageUrls: uploadedImageUrls.length > 0 ? uploadedImageUrls : (itemFormState.imageUrl ? [itemFormState.imageUrl] : []),
      ingredients: ingredientsArr,
      estimatedTime: itemFormState.estimatedTime,
      nutrition: {
        calories: Number(itemFormState.calories) || 300,
        protein: itemFormState.protein || '12g',
        carbs: itemFormState.carbs || '30g',
        fat: itemFormState.fat || '10g'
      },
      tags: {
        isVegan: itemFormState.isVegan,
        isSpicy: itemFormState.isSpicy,
        isSignature: itemFormState.isSignature,
        isGlutenFree: itemFormState.isGlutenFree,
        hasLocalTouch: itemFormState.hasLocalTouch
      },
      rating: editingItem ? (editingItem.rating || 4.8) : 4.8,
      reviewCount: editingItem ? (editingItem.reviewCount || 1) : 12,
      viewCount: editingItem ? (editingItem.viewCount || 0) : 0
    };

    let updatedItems: MenuItem[] = [];
    if (editingItem) {
      updatedItems = menuItems.map(item => item.id === editingItem.id ? formattedItem : item);
    } else {
      updatedItems = [...menuItems, formattedItem];
    }

    saveMenuItems(updatedItems);
    onDataChange(categories, updatedItems);

    // Reset Forms
    setShowItemForm(false);
    setEditingItem(null);
    setUploadedImageUrls([]);
    setItemFormState({
      id: '',
      name: '',
      category: 'burgers',
      price: 0,
      description: '',
      imageUrl: '',
      ingredientsText: '',
      estimatedTime: '10-12 mins',
      calories: 450,
      protein: '25g',
      carbs: '35g',
      fat: '15g',
      isVegan: false,
      isSpicy: false,
      isSignature: false,
      isGlutenFree: false,
      hasLocalTouch: false,
    });
  };

  const handleEditItemToggle = (item: MenuItem) => {
    setEditingItem(item);
    setUploadedImageUrls(item.imageUrls || (item.imageUrl ? [item.imageUrl] : []));
    setItemFormState({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      imageUrl: item.imageUrl,
      ingredientsText: item.ingredients.join(', '),
      estimatedTime: item.estimatedTime || '12 mins',
      calories: item.nutrition?.calories || 400,
      protein: item.nutrition?.protein || '20g',
      carbs: item.nutrition?.carbs || '40g',
      fat: item.nutrition?.fat || '15g',
      isVegan: !!item.tags.isVegan,
      isSpicy: !!item.tags.isSpicy,
      isSignature: !!item.tags.isSignature,
      isGlutenFree: !!item.tags.isGlutenFree,
      hasLocalTouch: !!item.tags.hasLocalTouch,
    });
    setShowItemForm(true);
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this menu item permanently from the digital menu?')) {
      const remaining = menuItems.filter(item => item.id !== itemId);
      saveMenuItems(remaining);
      onDataChange(categories, remaining);
    }
  };

  // Filter and Sort display items in administration lists
  const filteredDisplayItems = useMemo(() => {
    let filtered = menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(itemSearchText.toLowerCase()) || 
                            item.description.toLowerCase().includes(itemSearchText.toLowerCase());
      const matchesCat = selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;
      
      const matchesSpicy = !filterSpicyOnly || !!item.tags.isSpicy;
      const matchesVegan = !filterVeganOnly || !!item.tags.isVegan;
      const matchesLocal = !filterLocalOnly || !!item.tags.hasLocalTouch;
      const matchesSignature = !filterSignatureOnly || !!item.tags.isSignature;
      
      return matchesSearch && matchesCat && matchesSpicy && matchesVegan && matchesLocal && matchesSignature;
    });

    // Apply Sorting
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'views') {
      filtered.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    }

    return filtered;
  }, [menuItems, itemSearchText, selectedCategoryFilter, sortBy, filterSpicyOnly, filterVeganOnly, filterLocalOnly, filterSignatureOnly]);

  // Handle pagination dynamic reset
  React.useEffect(() => {
    setCurrentPage(1);
  }, [itemSearchText, selectedCategoryFilter, sortBy, filterSpicyOnly, filterVeganOnly, filterLocalOnly, filterSignatureOnly]);

  // Paginated display chunk representing server slices
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDisplayItems.slice(start, start + pageSize);
  }, [filteredDisplayItems, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredDisplayItems.length / pageSize) || 1;


  // LOGIN SHIELD ELEMENT
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
        <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-sm border border-neutral-150/50 shadow-2xl space-y-6 text-center">
          
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 shadow-md">
            <Lock className="w-6 h-6 animate-pulse text-rose-600" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight uppercase">
              back-office lounge
            </h2>
            <p className="text-xs text-neutral-500 font-medium leading-relaxed mt-1">
              Select your employee account to log into the backend management dashboard.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                Staff Profile Account
              </label>
              <select
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full text-xs p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold text-neutral-800"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.username}>
                    {emp.name} ({emp.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password..."
                className="w-full text-sm p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 placeholder-neutral-400 font-mono text-neutral-800"
              />
              <span className="text-[9px] text-neutral-400 block mt-1 leading-normal">
                Hint: Selam manager's key is "admin", chef's key is "chef123", cashier is "cashier123".
              </span>
            </div>

            {authError && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-100 text-center">
                {authError}
              </p>
            )}

            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 font-bold text-neutral-500 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/50 py-3.5 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 font-bold text-white bg-gradient-to-r from-rose-600 to-[#ff6b00] py-3.5 rounded-xl transition-all hover:opacity-95 active:scale-98 cursor-pointer shadow-md"
              >
                Verify Staff Login
              </button>
            </div>
          </form>

        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-900 flex flex-col font-sans select-none text-neutral-800">
      
      {/* DB TOP HEADER PANEL */}
      <header className="bg-neutral-950 border-b border-white/10 px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shrink-0 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600/10 border border-rose-500 flex items-center justify-center font-black text-rose-500 shrink-0">
            WOW
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black tracking-widest uppercase">
                Admin Lounge Console
              </h2>
              <span className="bg-rose-600 text-[8px] sm:text-[9px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-widest">
                {currentUser?.role || 'Staff'} Mode
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-neutral-400">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 inline-block" />
              <span>Session: <strong className="text-neutral-200">{currentUser?.name}</strong></span>
            </div>
          </div>
        </div>

        {/* Tab Selection Row */}
        <div className="flex flex-wrap items-center bg-white/5 p-1 border border-white/10 rounded-xl gap-0.5">
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'insights' ? 'bg-rose-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Insights
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'categories' ? 'bg-rose-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <AppWindow className="w-3.5 h-3.5" />
            Manage Categories
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'items' ? 'bg-rose-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Manage Menu Items
          </button>
          {currentUser?.role === 'Manager' && (
            <button
              onClick={() => setActiveTab('employees' as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                (activeTab as string) === 'employees' ? 'bg-rose-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Manage Staff
            </button>
          )}
        </div>

        {/* Action Header controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPasswordChange(!showPasswordChange)}
            className="flex items-center gap-1 py-1.5 px-3 bg-neutral-900 border border-white/15 hover:border-rose-500 rounded-lg text-xs font-bold text-rose-450 hover:bg-white/5 transition-all text-left cursor-pointer"
            title="Update your dashboard password"
          >
            <Key className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
            <span>Change PW</span>
          </button>
          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-1 py-1.5 px-3 bg-neutral-900 border border-white/10 hover:border-amber-500 rounded-lg text-xs font-bold text-amber-400 hover:bg-white/5 transition-all text-left cursor-pointer"
            title="Reset storage to original beautiful presets"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Presets</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-all cursor-pointer"
            title="Close Dashboard & Return to digital menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* INLINE PASSWORD UPDATER CONTROL DRAWER */}
      {showPasswordChange && (
        <div className="bg-neutral-950 border-b border-rose-600/30 px-5 py-4 text-white flex flex-col md:flex-row items-center justify-between gap-4 shrink-0 transition-all">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-rose-500 shrink-0" />
            <div>
              <p className="text-xs font-extrabold uppercase text-amber-400">Security: Change password for {currentUser?.name}</p>
              <p className="text-[10px] text-neutral-400 font-medium">Your credentials update straight in the synchronized database instantly.</p>
            </div>
          </div>
          <form onSubmit={handlePasswordChangeSubmit} className="flex flex-wrap items-center gap-2">
            <input
              type="password"
              required
              placeholder="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="text-xs p-2 bg-neutral-900 border border-white/10 rounded-lg focus:outline-none focus:border-rose-500 text-white font-mono placeholder-neutral-555"
            />
            <input
              type="password"
              required
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="text-xs p-2 bg-neutral-900 border border-white/10 rounded-lg focus:outline-none focus:border-rose-500 text-white font-mono placeholder-neutral-555"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-lg transition-all cursor-pointer"
            >
              Update Credentials
            </button>
            <button
              type="button"
              onClick={() => setShowPasswordChange(false)}
              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold rounded-lg transition-all cursor-pointer"
            >
              Cancel
            </button>
          </form>
          {passwordChangeError && <span className="text-xs text-red-500 px-2 font-bold">{passwordChangeError}</span>}
          {passwordChangeSuccess && <span className="text-xs text-emerald-500 px-2 font-bold">{passwordChangeSuccess}</span>}
        </div>
      )}

      {/* CORE DISPLAY WINDOW */}
      <div className="flex-1 overflow-y-auto bg-neutral-50 p-4 sm:p-6 lg:p-8">
        
        {/* TAB 1: INSIGHTS & ANALYTICS OVERVIEW */}
        {activeTab === 'insights' && (
          <div className="space-y-8 max-w-6xl mx-auto">
            
            {/* Title */}
            <div>
              <h3 className="text-xl font-extrabold text-neutral-900 uppercase">
                Gourmet digital menu statistics
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Real-time metrics computed straight from local JSON files & items schemas in localStorage.
              </p>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-5 rounded-3xl border border-neutral-150/80 shadow-xs space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                  Total Categories
                </span>
                <div className="text-3xl font-black text-rose-600">{stats.totalCategories}</div>
                <div className="text-[10px] text-neutral-500">Grouping menus dynamically</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-neutral-150/80 shadow-xs space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                  curated options
                </span>
                <div className="text-3xl font-black text-rose-600">{stats.totalItems}</div>
                <div className="text-[10px] text-neutral-500">Active menu items in stock</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-neutral-150/80 shadow-xs space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                  avg price (birr)
                </span>
                <div className="text-3xl font-black text-rose-600 font-mono">
                  {stats.avgPrice} <span className="text-xs">ETB</span>
                </div>
                <div className="text-[10px] text-neutral-500">Average price per selection</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-neutral-150/80 shadow-xs space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                  Signature chefs
                </span>
                <div className="text-3xl font-black text-rose-600">{stats.signatureCount}</div>
                <div className="text-[10px] text-neutral-500">Premium featured items</div>
              </div>
            </div>

            {/* Special localized ratios widget */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Highlight metrics */}
              <div className="bg-gradient-to-tr from-neutral-950 to-neutral-850 p-6 rounded-3xl text-white col-span-1 md:col-span-2 space-y-6 shadow-xl border border-white/5">
                <div>
                  <h4 className="font-extrabold text-sm uppercase text-amber-400">
                    Ethiopian Heritage & Localization
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Wow Burger leverages fine local farm products to celebrate local flavor.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase block">
                      Spicy Awaze
                    </span>
                    <span className="text-2xl font-black text-red-400 font-mono mt-1 inline-block">
                      {stats.spicyCount}
                    </span>
                    <span className="text-[9px] text-neutral-500 font-medium block mt-1">with fire kick</span>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase block">
                      Local touches
                    </span>
                    <span className="text-2xl font-black text-amber-400 font-mono mt-1 inline-block">
                      {stats.localCount}
                    </span>
                    <span className="text-[9px] text-neutral-500 font-medium block mt-1">🇪🇹 Teff / Habesha</span>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase block">
                      100% Vegan
                    </span>
                    <span className="text-2xl font-black text-emerald-400 font-mono mt-1 inline-block">
                      {stats.veganCount}
                    </span>
                    <span className="text-[9px] text-neutral-500 font-medium block mt-1">plant based</span>
                  </div>
                </div>

                <div className="flex gap-2 items-center bg-white/5 p-3 rounded-2xl border border-white/10 text-xs">
                  <Info className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Highest priced gourmet item on current menu: <strong>{stats.maxPriceItem.name}</strong> ({stats.maxPriceItem.price} ETB).
                  </span>
                </div>
              </div>

              {/* Tips for management */}
              <div className="bg-white p-6 rounded-3xl border border-neutral-150/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-rose-600" />
                  <h4 className="font-extrabold text-sm uppercase text-neutral-900">
                    Manager Tips
                  </h4>
                </div>
                <ul className="text-xs text-neutral-600 space-y-3 font-semibold list-disc pl-4">
                  <li>Keep images sized tightly or use optimized Unsplash assets to keep menu speed high over 3G.</li>
                  <li>When you create a new item, remember to add some traditional ingredients like "Berbere" or "Awaze" for Ethiopian authentic presentation profiles.</li>
                  <li>Verify prices always remain whole integers for easier cashier reconciliation in cash registers.</li>
                </ul>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: MANAGE CATEGORIES (Add, edit, delete) */}
        {activeTab === 'categories' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 uppercase">
                  Categories List ({categories.length})
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  These categories govern the horizontal sliding tabs seen by customers.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryFormState({ id: '', name: '', icon: 'Flame', description: '' });
                  setShowCategoryForm(true);
                }}
                className="flex items-center gap-1.5 bg-neutral-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-rose-600 transition-all shadow-md active:scale-95 text-center"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>

            {/* CATEGORY DIALOG FORM CONDITIONAL */}
            {showCategoryForm && (
              <form ref={categoryFormRef} onSubmit={handleCategorySubmit} className="bg-white p-5 sm:p-6 rounded-3xl border border-rose-200/50 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h4 className="font-extrabold text-sm uppercase text-rose-600">
                    {editingCategory ? 'Edit Category Details' : 'Create New Tab Category'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowCategoryForm(false)}
                    className="p-1 text-neutral-400 hover:text-neutral-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                      Category Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Traditional Cocktails"
                      value={categoryFormState.name}
                      onChange={(e) => setCategoryFormState({ ...categoryFormState, name: e.target.value })}
                      className="w-full text-sm p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-rose-500 font-semibold text-neutral-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                      Icon Presentation (Choose One)
                    </label>
                    <select
                      value={categoryFormState.icon}
                      onChange={(e) => setCategoryFormState({ ...categoryFormState, icon: e.target.value })}
                      className="w-full text-sm p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-rose-500 font-semibold text-neutral-800"
                    >
                      {ICON_PICKER_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                      Brief Tagline / Slogan
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Infused with honey and fresh botanical extracts"
                      value={categoryFormState.description}
                      onChange={(e) => setCategoryFormState({ ...categoryFormState, description: e.target.value })}
                      className="w-full text-sm p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-rose-500 text-neutral-800 font-medium"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setShowCategoryForm(false)}
                    className="text-xs font-bold text-neutral-500 hover:text-neutral-900 bg-neutral-100 px-4 py-2.5 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 px-5 py-2.5 rounded-xl shadow-md"
                  >
                    {editingCategory ? 'Save Changes' : 'Create Category'}
                  </button>
                </div>
              </form>
            )}

            {/* List categories grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(cat => {
                const connectedItemsAmt = menuItems.filter(i => i.category === cat.id).length;
                return (
                  <div key={cat.id} className="bg-white p-5 rounded-3xl border border-neutral-150/80 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-100 text-rose-600 font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-full">
                          Icon: {cat.icon}
                        </span>
                        <span className="text-[10.5px] font-bold text-neutral-400 font-mono bg-neutral-50 px-2 py-0.5 rounded-md border border-neutral-100">
                          ID: {cat.id}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-neutral-950 uppercase mt-2">
                        {cat.name}
                      </h4>
                      <p className="text-xs text-neutral-500 leading-relaxed font-semibold">
                        {cat.description || 'No description provided.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-50 pt-3 text-xs">
                      <span className="text-neutral-500 font-bold">
                        {connectedItemsAmt} active items
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditCategoryToggle(cat)}
                          className="p-1 px-2.5 bg-neutral-50 border border-neutral-200 hover:border-amber-400 hover:bg-amber-50 rounded-lg text-neutral-600 hover:text-neutral-900 transition-all text-xs flex items-center gap-1"
                          title="Edit Category Info"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1 px-2.5 bg-neutral-50 border border-neutral-200 hover:border-red-400 hover:bg-red-50 rounded-lg text-neutral-400 hover:text-red-650 transition-all text-xs flex items-center gap-1"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Del</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 3: MANAGE MENU ITEMS (CRUD actions for burgers, beverages, shakes, and side desserts) */}
        {activeTab === 'items' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 uppercase">
                  Menu Selections database ({filteredDisplayItems.length} items matched)
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Create, edit, or delete items inside categories. Changes populate the client view instantaneously.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setItemFormState({
                      id: '',
                      name: '',
                      category: categories[0]?.id || 'burgers',
                      price: 250,
                      description: '',
                      imageUrl: '',
                      ingredientsText: '',
                      estimatedTime: '10-12 mins',
                      calories: 450,
                      protein: '25g',
                      carbs: '35g',
                      fat: '15g',
                      isVegan: false,
                      isSpicy: false,
                      isSignature: false,
                      isGlutenFree: false,
                      hasLocalTouch: false,
                    });
                    setShowItemForm(true);
                  }}
                  className="flex items-center gap-1.5 bg-rose-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-rose-700 transition-all shadow-md active:scale-95 text-center cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-white" />
                  Add New Menu Selection
                </button>
              </div>
            </div>

            {/* FILTER SEARCH UTILITIES PANEL */}
            <div className="bg-white p-4 rounded-3xl border border-neutral-150/80 shadow-xs flex flex-col gap-4">
              <div className="flex flex-col md:flex-row items-center gap-4">
                
                {/* Text Search */}
                <div className="relative w-full md:w-64">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search selections..."
                    value={itemSearchText}
                    onChange={(e) => setItemSearchText(e.target.value)}
                    className="w-full text-xs pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-rose-500 font-medium"
                  />
                </div>

                {/* Category selector filter */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <ListFilter className="w-4 h-4 text-neutral-400 shrink-0" />
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-rose-500 font-semibold text-neutral-800"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Advanced Sort Ordering options */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider shrink-0 font-sans">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-rose-500 font-semibold text-neutral-800"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="price-asc">Price (Low → High)</option>
                    <option value="price-desc">Price (High → Low)</option>
                    <option value="rating">Rating (Highest First)</option>
                    <option value="views">Analytics (Highest Views)</option>
                  </select>
                </div>

                {/* Pagination page size selector */}
                <div className="flex items-center gap-2 w-full md:w-auto flex-1 md:justify-end">
                  <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider shrink-0 font-sans">Page Size:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-rose-500 font-bold text-neutral-800"
                  >
                    <option value={5}>5 items</option>
                    <option value={10}>10 items</option>
                    <option value={20}>20 items</option>
                    <option value={50}>50 items</option>
                  </select>
                </div>
              </div>

              {/* Dietary check checkboxes */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 border-t border-neutral-100 text-xs font-bold text-neutral-600">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest shrink-0 font-sans">Dietary Filters:</span>
                <label className="flex items-center gap-1.5 cursor-pointer hover:text-neutral-900 transition-colors">
                  <input
                    type="checkbox"
                    checked={filterSpicyOnly}
                    onChange={(e) => setFilterSpicyOnly(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                  />
                  <span>🌶️ Spicy Selections</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer hover:text-neutral-900 transition-colors">
                  <input
                    type="checkbox"
                    checked={filterVeganOnly}
                    onChange={(e) => setFilterVeganOnly(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span>🌱 Vegan Friendly</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer hover:text-neutral-900 transition-colors">
                  <input
                    type="checkbox"
                    checked={filterLocalOnly}
                    onChange={(e) => setFilterLocalOnly(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <span>🇪🇹 Ethiopian Specialities</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer hover:text-neutral-900 transition-colors">
                  <input
                    type="checkbox"
                    checked={filterSignatureOnly}
                    onChange={(e) => setFilterSignatureOnly(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span>⭐ Chef Signatures</span>
                </label>
                {(filterSpicyOnly || filterVeganOnly || filterLocalOnly || filterSignatureOnly || itemSearchText || selectedCategoryFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setFilterSpicyOnly(false);
                      setFilterVeganOnly(false);
                      setFilterLocalOnly(false);
                      setFilterSignatureOnly(false);
                      setItemSearchText('');
                      setSelectedCategoryFilter('all');
                      setSortBy('name');
                    }}
                    className="text-[10px] text-rose-600 uppercase font-black tracking-widest ml-auto cursor-pointer hover:underline"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            </div>

            {/* EXPANDED NEW SELECTS FORM */}
            {showItemForm && (
              <form ref={itemFormRef} onSubmit={handleItemSubmit} className="bg-white p-5 sm:p-6 rounded-3xl border border-rose-200/50 space-y-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h4 className="font-extrabold text-sm uppercase text-rose-650 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                    <span>{editingItem ? 'Edit Culinary Selection' : 'Create New Menu Item'}</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowItemForm(false)}
                    className="p-1 text-neutral-400 hover:text-neutral-950"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Item Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cameroonian Spicy Rib-eye"
                      value={itemFormState.name}
                      onChange={(e) => setItemFormState({ ...itemFormState, name: e.target.value })}
                      className="w-full text-sm p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-rose-500 text-neutral-800 font-semibold"
                    />
                  </div>

                  {/* Category Assignment */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                      App Tab Category *
                    </label>
                    <select
                      value={itemFormState.category}
                      onChange={(e) => setItemFormState({ ...itemFormState, category: e.target.value })}
                      className="w-full text-sm p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-rose-500 font-semibold text-neutral-800"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Base price in Birr */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                      Base Price (ETB birr) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={itemFormState.price}
                      onChange={(e) => setItemFormState({ ...itemFormState, price: Number(e.target.value) })}
                      placeholder="e.g. 350"
                      className="w-full text-sm p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-rose-500 text-neutral-800 font-mono font-bold"
                    />
                  </div>

                  {/* Core description text */}
                  <div className="col-span-1 md:col-span-3 space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                      Detailed Description Text
                    </label>
                    <input
                      type="text"
                      placeholder="Specify sensory properties (e.g. double flame-kissed premium beef patty glazed gracefully in berbere mustard...)"
                      value={itemFormState.description}
                      onChange={(e) => setItemFormState({ ...itemFormState, description: e.target.value })}
                      className="w-full text-sm p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-rose-500 text-neutral-700"
                    />
                  </div>

                                  {/* Image URL path */}
                  <div className="col-span-1 md:col-span-2 space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                      Premium Image URL Link
                    </label>
                    <input
                      type="url"
                      placeholder="Paste crisp Unsplash or standard secure https:// address..."
                      value={itemFormState.imageUrl}
                      onChange={(e) => setItemFormState({ ...itemFormState, imageUrl: e.target.value })}
                      className="w-full text-sm p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-rose-500 text-neutral-600 font-medium"
                    />
                  </div>

                  {/* Prep time */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                      Estimated Prep (Ready Time)
                    </label>
                    <input
                      type="text"
                      value={itemFormState.estimatedTime}
                      onChange={(e) => setItemFormState({ ...itemFormState, estimatedTime: e.target.value })}
                      placeholder="e.g. 8-10 mins"
                      className="w-full text-sm p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-rose-500 font-semibold"
                    />
                  </div>

                  {/* Multi-Image Upload Panel */}
                  <div className="col-span-1 md:col-span-3 bg-neutral-50/50 p-4 border border-dashed border-neutral-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-rose-500" />
                        <span>Interactive Gallery Asset Carousel Manager ({uploadedImageUrls.length} images connected)</span>
                      </label>
                      <span className="text-[9px] text-neutral-400 font-bold uppercase">Drag & Drop or Touch</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Drop area */}
                      <div className="relative group hover:border-rose-450 border border-neutral-200 bg-white rounded-xl p-3.5 transition-all text-center flex flex-col items-center justify-center min-h-[90px] cursor-pointer">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files) {
                              const filesArr = Array.from(e.target.files);
                              filesArr.forEach(file => {
                                const reader = new FileReader();
                                reader.onload = (loadEvt) => {
                                  if (loadEvt.target?.result) {
                                    const base64Str = loadEvt.target.result as string;
                                    setUploadedImageUrls(prev => {
                                      if (prev.includes(base64Str)) return prev;
                                      return [...prev, base64Str];
                                    });
                                    // Also set first image as core imageUrl if empty
                                    setItemFormState(prev => {
                                      if (!prev.imageUrl) {
                                        return { ...prev, imageUrl: base64Str };
                                      }
                                      return prev;
                                    });
                                  }
                                };
                                reader.readAsDataURL(file);
                              });
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                        />
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-neutral-700 group-hover:text-rose-600 transition-colors">
                            Click to Browse / Drop Images
                          </p>
                          <p className="text-[9px] text-neutral-400 font-medium">Supports multiple JPG, PNG, WebP uploads</p>
                        </div>
                      </div>

                      {/* Display uploaded images carousel queue */}
                      <div className="flex flex-wrap items-center gap-2 border border-neutral-200 bg-neutral-50 rounded-xl p-2 min-h-[90px]">
                        {uploadedImageUrls.length === 0 ? (
                          <div className="text-[10px] text-neutral-400 font-bold m-auto text-center leading-normal">
                            No loaded secondary gallery images found
                          </div>
                        ) : (
                          uploadedImageUrls.map((url, index) => (
                            <div key={index} className="relative w-12 h-12 rounded-lg border border-neutral-200 overflow-hidden shrink-0 group">
                              <img
                                src={getImageSrc(url)}
                                alt={`gallery-${index}`}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = uploadedImageUrls.filter((_, i) => i !== index);
                                  setUploadedImageUrls(updated);
                                  // Update main imageUrl if removed first one
                                  if (index === 0) {
                                    setItemFormState(prev => ({ ...prev, imageUrl: updated[0] || '' }));
                                  }
                                }}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white hover:text-red-400 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Key Ingredients raw list */}
                  <div className="col-span-1 md:col-span-3 space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                      Recipe Ingredients (Separated by Commas)
                    </label>
                    <textarea
                      placeholder="e.g. Charcoal beef patty, Toasted sesame seed bun, CAMEROON relish sauce, Provolone melt"
                      value={itemFormState.ingredientsText}
                      onChange={(e) => setItemFormState({ ...itemFormState, ingredientsText: e.target.value })}
                      rows={2}
                      className="w-full text-sm p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-rose-500 text-neutral-750 placeholder-neutral-400"
                    />
                  </div>

                  {/* Nutrition Highlights block */}
                  <div className="col-span-1 md:col-span-3 bg-gray-50 p-4 rounded-2xl border border-neutral-200/50 space-y-3">
                    <h5 className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider flex items-center gap-1">
                      <Dumbbell className="w-3.5 h-3.5" />
                      Nutrient Metrics Setup
                    </h5>
                    
                    <div className="grid grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-neutral-400">Calories</label>
                        <input
                          type="number"
                          value={itemFormState.calories}
                          onChange={(e) => setItemFormState({ ...itemFormState, calories: Number(e.target.value) })}
                          className="w-full text-xs p-2.5 bg-white border border-neutral-200 rounded-xl focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-neutral-400">Protein (g)</label>
                        <input
                          type="text"
                          value={itemFormState.protein}
                          onChange={(e) => setItemFormState({ ...itemFormState, protein: e.target.value })}
                          className="w-full text-xs p-2.5 bg-white border border-neutral-200 rounded-xl focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-neutral-400">Carbs (g)</label>
                        <input
                          type="text"
                          value={itemFormState.carbs}
                          onChange={(e) => setItemFormState({ ...itemFormState, carbs: e.target.value })}
                          className="w-full text-xs p-2.5 bg-white border border-neutral-200 rounded-xl focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-neutral-400">Fat (g)</label>
                        <input
                          type="text"
                          value={itemFormState.fat}
                          onChange={(e) => setItemFormState({ ...itemFormState, fat: e.target.value })}
                          className="w-full text-xs p-2.5 bg-white border border-neutral-200 rounded-xl focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tag Checkboxes Column */}
                  <div className="col-span-1 md:col-span-3 bg-rose-50/20 p-4 rounded-2xl border border-rose-100/50 space-y-3">
                    <h5 className="text-[10px] uppercase font-bold text-rose-800 tracking-wider">
                      Dietary, Spiciness & Placement Flags
                    </h5>
                    
                    <div className="flex flex-wrap gap-4 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-700">
                        <input
                          type="checkbox"
                          checked={itemFormState.isSignature}
                          onChange={(e) => setItemFormState({ ...itemFormState, isSignature: e.target.checked })}
                          className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-neutral-300Accent"
                        />
                        <span>Is Signature Spotlight</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-700">
                        <input
                          type="checkbox"
                          checked={itemFormState.isSpicy}
                          onChange={(e) => setItemFormState({ ...itemFormState, isSpicy: e.target.checked })}
                          className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-neutral-300"
                        />
                        <span className="flex items-center gap-0.5">
                          Spicy <Flame className="w-3.5 h-3.5 text-rose-500" />
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-700">
                        <input
                          type="checkbox"
                          checked={itemFormState.isVegan}
                          onChange={(e) => setItemFormState({ ...itemFormState, isVegan: e.target.checked })}
                          className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-neutral-300"
                        />
                        <span>100% Vegan Recipe</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-700">
                        <input
                          type="checkbox"
                          checked={itemFormState.isGlutenFree}
                          onChange={(e) => setItemFormState({ ...itemFormState, isGlutenFree: e.target.checked })}
                          className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-neutral-300"
                        />
                        <span>Gluten Free Base</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-700">
                        <input
                          type="checkbox"
                          checked={itemFormState.hasLocalTouch}
                          onChange={(e) => setItemFormState({ ...itemFormState, hasLocalTouch: e.target.checked })}
                          className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-neutral-300"
                        />
                        <span className="text-amber-600">🇪🇹 Local Touch (Awaze / Teff)</span>
                      </label>
                    </div>

                  </div>

                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setShowItemForm(false)}
                    className="text-xs font-bold text-neutral-500 bg-neutral-100 hover:bg-neutral-200 px-4 py-2.5 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95 text-center cursor-pointer"
                  >
                    {editingItem ? 'Save Selection Changes' : 'Publish to Digital Menu'}
                  </button>
                </div>

              </form>
            )}

            {/* Desktop Tabular View (hidden on mobile, shown on md and larger) */}
            <div className="hidden md:block bg-white rounded-3xl border border-neutral-150/80 shadow-xs overflow-hidden">
              {/* Responsive Scrollable Tabular View */}
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-sans font-semibold text-neutral-700 min-w-[768px]">
                  <thead className="bg-neutral-50 text-[10px] uppercase text-neutral-400 font-bold border-b border-neutral-150 tracking-wider">
                    <tr>
                      <th className="p-4 pl-6">Title & Category</th>
                      <th className="p-4">Ingredients preview</th>
                      <th className="p-4 text-center">Nutrition</th>
                      <th className="p-4 text-center">Flags</th>
                      <th className="p-4 text-center">Views Analytics</th>
                      <th className="p-4 text-right">Price</th>
                      <th className="p-4 pr-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {paginatedItems.map(item => (
                      <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                        
                        {/* Title group */}
                        <td className="p-4 pl-6 space-y-1 max-w-[200px]">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                              <img
                                src={getImageSrc(item.imageUrl)}
                                alt={item.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
                                }}
                              />
                            </div>
                            <div>
                              <p className="font-extrabold text-neutral-900 uppercase truncate">
                                {item.name}
                              </p>
                              <span className="text-[10px] text-rose-600 font-black uppercase">
                                {categories.find(c => c.id === item.category)?.name || item.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Ingredients */}
                        <td className="p-4 font-normal text-neutral-500 max-w-[250px]">
                          <p className="truncate" title={item.ingredients.join(', ')}>
                            {item.ingredients.join(', ')}
                          </p>
                          <span className="text-[10px] font-semibold text-neutral-400 block mt-1">
                            ⏰ {item.estimatedTime || '—'}
                          </span>
                        </td>

                        {/* Calories */}
                        <td className="p-4 text-center font-mono font-medium text-neutral-500">
                          {item.nutrition?.calories || 400} Cal
                          <span className="text-[9px] text-neutral-400 block font-sans font-bold">
                            P: {item.nutrition?.protein || '—'}
                          </span>
                        </td>

                        {/* Tags list */}
                        <td className="p-4 text-center">
                          <div className="flex flex-wrap justify-center gap-1 max-w-[120px] mx-auto">
                            {item.tags.isSignature && (
                              <span className="bg-amber-400 text-neutral-900 text-[8px] font-black px-1.5 py-0.2 rounded uppercase">
                                Sig
                              </span>
                            )}
                            {item.tags.isSpicy && (
                              <span className="bg-red-650 text-white text-[8px] font-black px-1.5 py-0.2 rounded uppercase">
                                Hot
                              </span>
                            )}
                            {item.tags.isVegan && (
                              <span className="bg-emerald-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded uppercase">
                                Veg
                              </span>
                            )}
                            {item.tags.hasLocalTouch && (
                              <span className="bg-neutral-800 text-amber-300 text-[8px] font-black px-1.5 py-0.2 rounded">
                                🇪🇹
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Views Counts */}
                        <td className="p-4 text-center font-mono font-medium text-neutral-500">
                          <span className="inline-flex items-center gap-1 bg-neutral-100 px-2 py-1 rounded-full text-[10px]">
                            <Eye className="w-3 h-3 text-neutral-500" />
                            {item.viewCount || 0} views
                          </span>
                        </td>

                        {/* Price */}
                        <td className="p-4 text-right">
                          <span className="text-sm font-black text-neutral-900 font-mono">
                            {item.price} <span className="text-[10px] text-rose-600 font-sans">ETB</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-4 pr-6 text-center flex-1">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleEditItemToggle(item)}
                              className="p-1 px-2.5 bg-neutral-50 border border-neutral-200 hover:border-amber-400 hover:bg-amber-50 rounded-lg text-neutral-700 hover:text-neutral-900 transition-all text-xs flex items-center gap-1"
                              title="Modify Selection properties"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1 px-2.5 bg-neutral-50 border border-neutral-200 hover:border-red-400 hover:bg-red-50 rounded-lg text-neutral-400 hover:text-red-700 transition-all text-xs flex items-center gap-1"
                              title="Delete permanently"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}

                    {paginatedItems.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-neutral-400">
                          No menu selections found matching the current search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile List View (rendered on smaller screens, no horizontal slide required) */}
            <div className="block md:hidden space-y-4">
              {paginatedItems.map(item => (
                <div key={item.id} className="bg-white rounded-2xl border border-neutral-150/80 p-4 shadow-xs flex flex-col gap-3">
                  <div className="flex gap-3">
                    {/* Item Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-150 shrink-0">
                      <img
                        src={getImageSrc(item.imageUrl)}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-neutral-900 uppercase truncate">
                        {item.name}
                      </p>
                      <span className="text-[10px] text-rose-600 font-extrabold uppercase block mt-0.5">
                        {categories.find(c => c.id === item.category)?.name || item.category}
                      </span>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1.5 text-neutral-500 font-semibold text-[11px]">
                        <span className="text-xs font-black text-neutral-900 font-mono">
                          {item.price} <span className="text-[9px] text-rose-600 font-sans">ETB</span>
                        </span>
                        <span className="text-neutral-300">•</span>
                        <span className="font-mono">{item.nutrition?.calories || 400} Cal</span>
                        <span className="text-neutral-300">•</span>
                        <span>⏰ {item.estimatedTime || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights/Tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded font-mono inline-flex items-center gap-1 font-bold">
                      <Eye className="w-2.5 h-2.5 text-neutral-400" />
                      {item.viewCount || 0} views
                    </span>
                    {item.tags.isSignature && (
                      <span className="bg-amber-400 text-neutral-900 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                        Signature
                      </span>
                    )}
                    {item.tags.isSpicy && (
                      <span className="bg-red-650 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                        Spicy
                      </span>
                    )}
                    {item.tags.isVegan && (
                      <span className="bg-emerald-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                        Vegan
                      </span>
                    )}
                    {item.tags.hasLocalTouch && (
                      <span className="bg-neutral-800 text-amber-300 text-[8px] font-black px-1.5 py-0.5 rounded">
                        🇪🇹 Ethiopian
                      </span>
                    )}
                  </div>

                  {/* Ingredients Preview */}
                  <div className="text-[11px] text-neutral-500 border-t border-neutral-100 pt-2 font-normal">
                    <span className="font-bold text-neutral-700">Ingredients: </span>
                    {item.ingredients.join(', ')}
                  </div>

                  {/* Actions (Prominent touch targets for mobile) */}
                  <div className="grid grid-cols-2 gap-2 border-t border-neutral-100 pt-3">
                    <button
                      type="button"
                      onClick={() => handleEditItemToggle(item)}
                      className="py-2.5 bg-neutral-50 border border-neutral-200 hover:border-amber-400 hover:bg-amber-50 rounded-xl text-neutral-700 hover:text-neutral-900 transition-all text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-amber-500" />
                      <span>Edit Item</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="py-2.5 bg-neutral-50 border border-neutral-200 hover:border-red-400 hover:bg-red-50 rounded-xl text-neutral-500 hover:text-red-700 transition-all text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}

              {paginatedItems.length === 0 && (
                <div className="bg-white rounded-2xl border border-neutral-150 p-8 text-center text-neutral-400 font-bold text-xs">
                  No menu selections found matching the current search criteria.
                </div>
              )}
            </div>

            {/* PAGINATION STATUS CONTROL BAR */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-neutral-150 px-5 py-4 rounded-3xl shrink-0">
                <span className="text-xs text-neutral-500 font-bold font-sans text-center sm:text-left">
                  Showing <strong className="text-neutral-900">{Math.min(filteredDisplayItems.length, (currentPage - 1) * pageSize + 1)}</strong> to <strong className="text-neutral-900">{Math.min(filteredDisplayItems.length, currentPage * pageSize)}</strong> of <strong className="text-neutral-900">{filteredDisplayItems.length}</strong> culinary selections
                </span>

                <div className="flex items-center gap-1 text-xs font-bold font-sans">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage(prev => Math.max(1, prev - 1));
                      const el = document.getElementById('items-db-start');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-2 border border-neutral-200 bg-white hover:bg-neutral-50 rounded-xl disabled:opacity-45 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNo = idx + 1;
                    return (
                      <button
                        key={pageNo}
                        type="button"
                        onClick={() => {
                          setCurrentPage(pageNo);
                          const el = document.getElementById('items-db-start');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                          currentPage === pageNo
                            ? 'bg-rose-600 border-rose-600 text-white shadow-sm font-extrabold'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        {pageNo}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage(prev => Math.min(totalPages, prev + 1));
                      const el = document.getElementById('items-db-start');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-2 border border-neutral-200 bg-white hover:bg-neutral-50 rounded-xl disabled:opacity-45 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 4: EMPLOYEE DIRECTORY ADMINISTRATION */}
        {activeTab === ('employees' as any) && currentUser?.role === 'Manager' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-neutral-900 uppercase flex items-center gap-2">
                  <Users className="w-5 h-5 text-rose-650" />
                  <span>Employee & Crew Administration</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Add staff profiles, designate role privileges, and inspect passwords/profile credentials.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowEmployeeForm(!showEmployeeForm);
                  setNewEmpName('');
                  setNewEmpUsername('');
                  setNewEmpPassword('');
                }}
                className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-white" />
                Add Crew Member
              </button>
            </div>

            {/* CREW CREATION FORM */}
            {showEmployeeForm && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newEmpName.trim() || !newEmpUsername.trim() || !newEmpPassword.trim()) {
                    alert('Please specify all details.');
                    return;
                  }
                  if (employees.some(emp => emp.username === newEmpUsername.trim().toLowerCase())) {
                    alert('Username is already taken by another employee.');
                    return;
                  }
                  const added: Employee = {
                    id: 'emp-' + Date.now(),
                    name: newEmpName.trim(),
                    username: newEmpUsername.trim().toLowerCase(),
                    passwordPlain: newEmpPassword.trim(),
                    role: newEmpRole,
                    joinedDate: new Date().toISOString().split('T')[0]
                  };
                  const updated = [...employees, added];
                  setEmployees(updated);
                  saveEmployees(updated);
                  setShowEmployeeForm(false);
                }}
                className="bg-white p-5 rounded-3xl border border-rose-200/50 space-y-4 shadow-xl"
              >
                <h4 className="text-xs uppercase font-extrabold text-rose-650">Create New Staff Profile</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-neutral-400">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Almaz Kebede"
                      value={newEmpName}
                      onChange={(e) => setNewEmpName(e.target.value)}
                      className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-rose-500 font-semibold text-neutral-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-neutral-400">Username handle</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. almaz_chef"
                      value={newEmpUsername}
                      onChange={(e) => setNewEmpUsername(e.target.value)}
                      className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-rose-500 font-mono text-neutral-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-neutral-400">Password key</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. almazPass123"
                      value={newEmpPassword}
                      onChange={(e) => setNewEmpPassword(e.target.value)}
                      className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-rose-500 font-mono text-neutral-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-neutral-400">Role Privilege</label>
                    <select
                      value={newEmpRole}
                      onChange={(e) => setNewEmpRole(e.target.value as any)}
                      className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none font-bold text-neutral-800"
                    >
                      <option value="Manager">Manager (All Privileges)</option>
                      <option value="Chef">Chef (Metadata, No Pricing)</option>
                      <option value="Cashier">Cashier (Pricing Only)</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-2 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setShowEmployeeForm(false)}
                    className="text-xs font-bold text-neutral-550 bg-neutral-100 hover:bg-neutral-200 px-4 py-2.5 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 px-5 py-2.5 rounded-xl shadow cursor-pointer"
                  >
                    Register Crew Profile
                  </button>
                </div>
              </form>
            )}

            {/* STAFF TABLE DIRECTORY */}
            <div className="bg-white rounded-3xl border border-neutral-150 shadow-sm overflow-hidden">
              <div className="overflow-x-auto font-sans">
                <table className="w-full text-left text-xs text-neutral-700 font-semibold">
                  <thead className="bg-neutral-50 text-[10px] uppercase text-neutral-400 font-bold border-b border-rose-150">
                    <tr>
                      <th className="p-4 pl-6">Crew Member Name</th>
                      <th className="p-4">Username Handle</th>
                      <th className="p-4">Staff Password</th>
                      <th className="p-4">Role Assigned</th>
                      <th className="p-4">Joined Date</th>
                      <th className="p-4 pr-6 text-center">Privilege Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {employees.map(emp => (
                      <tr key={emp.id} className="hover:bg-neutral-50/40">
                        <td className="p-4 pl-6 text-neutral-900 font-extrabold">{emp.name}</td>
                        <td className="p-4 font-mono text-neutral-500">{emp.username}</td>
                        <td className="p-4 font-mono text-neutral-550">{emp.passwordPlain}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-[10px] font-black rounded uppercase tracking-wider ${
                            emp.role === 'Manager' ? 'bg-rose-100 text-rose-700' :
                            emp.role === 'Chef' ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {emp.role}
                          </span>
                        </td>
                        <td className="p-4 text-neutral-400 font-normal">{emp.joinedDate}</td>
                        <td className="p-4 pr-6 text-center">
                          {emp.username === 'selam_manager' ? (
                            <span className="text-[10px] text-neutral-400 font-bold uppercase italic">Primary Owner</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to deactivate and remove ${emp.name}?`)) {
                                  const updated = employees.filter(e => e.id !== emp.id);
                                  setEmployees(updated);
                                  saveEmployees(updated);
                                }
                              }}
                              className="text-xs text-red-500 hover:text-red-700 font-black cursor-pointer"
                            >
                              Revoke Access
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
