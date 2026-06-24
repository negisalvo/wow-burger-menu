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
  imageUrl: any; // Can be string URL or imported StaticImageData in Next.js
  imageUrls?: string[]; // Multiple images for the carousel on detail view
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
  viewCount?: number; // For item click analytics
}

export interface Employee {
  id: string;
  name: string;
  username: string;
  passwordPlain: string; // Plain password for custom password changes
  role: 'Manager' | 'Chef' | 'Cashier';
  joinedDate: string;
}
