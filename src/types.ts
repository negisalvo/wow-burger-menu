export type CategoryId = string;

export interface Category {
  id: CategoryId;
  name: string;
  count: number;
  icon: string; // Lucide icon name
  description: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryId;
  price: number; // in ETB
  description: string;
  imageUrl: string;
  ingredients: string[];
  estimatedTime?: string; // e.g. "12-15 mins"
  nutrition?: {
    calories?: number;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
  tags: {
    isVegan?: boolean;
    isSpicy?: boolean;
    isSignature?: boolean;
    isGlutenFree?: boolean;
    hasLocalTouch?: boolean; // Ethiopian localization touch
  };
  rating?: number; // e.g. 4.9
  reviewCount?: number;
}
