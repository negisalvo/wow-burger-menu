import { Category, MenuItem } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'burgers',
    name: 'Gourmet Burgers',
    count: 4,
    icon: 'Flame',
    description: 'Freshly ground premium beef patties flame-grilled to perfection'
  },
  {
    id: 'fries-sides',
    name: 'Fries & Sides',
    count: 3,
    icon: 'Layers',
    description: 'Crispy hand-cut sides and mouth-watering bites'
  },
  {
    id: 'coffee',
    name: 'Specialty Coffee',
    count: 3,
    icon: 'Coffee',
    description: 'Single-origin Ethiopian highlights and artisan espresso craft'
  },
  {
    id: 'drinks',
    name: 'Soft Drinks',
    count: 3,
    icon: 'CupSoda',
    description: 'Refreshing custom crafts and sparkling botanical soda'
  },
  {
    id: 'shakes',
    name: 'Milkshakes',
    count: 2,
    icon: 'GlassWater',
    description: 'Double-churned rich gelato shakes with gourmet toppings'
  },
  {
    id: 'desserts',
    name: 'Desserts',
    count: 2,
    icon: 'Dessert',
    description: 'Luxurious desserts crafted in-house daily'
  }
];

export const MENU_ITEMS: MenuItem[] = [
  // burgers
  {
    id: 'wow-masterpiece',
    name: 'The WOW Masterpiece',
    category: 'burgers',
    price: 520,
    description: 'Our crown-jewel double flame-grilled beef patty, melted double cheddar cheese, caramelized balsamic onions, fresh crisp butter lettuce, and organic heirloom tomatoes with WOW special house sauce on a glazed, toasted brioche bun.',
    imageUrl: '/src/assets/images/gourmet_burger_hero_1781288051773.jpg',
    ingredients: ['Double flame-grilled beef patty', 'Glistening toasted brioche bun', 'Double sharp cheddar', 'Slow-caramelized onions', 'Organic butter lettuce', 'Heirloom tomatoes', 'WOW secret house sauce'],
    estimatedTime: '12-15 mins',
    nutrition: {
      calories: 680,
      protein: '42g',
      carbs: '48g',
      fat: '31g'
    },
    tags: {
      isSignature: true
    },
    rating: 4.9,
    reviewCount: 318
  },
  {
    id: 'awaze-fire',
    name: 'Awaze Fire Burger',
    category: 'burgers',
    price: 480,
    description: 'Juicy premium flame-grilled beef patty glazed with our home-crafted fire Ethiopian Awaze sauce, seasoned green jalapeños, melted provolone cheese, thick crispy beer-battered onion rings, and smoked garlic aioli.',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    ingredients: ['Gourmet beef patty', 'Artisanal brioche bun', 'Ethiopian Awaze glaze', 'Fresh jalapeño slices', 'Melted provolone cheese', 'Smoked garlic aioli', 'Crisp red onions'],
    estimatedTime: '10-12 mins',
    nutrition: {
      calories: 630,
      protein: '39g',
      carbs: '45g',
      fat: '28g'
    },
    tags: {
      isSpicy: true,
      hasLocalTouch: true
    },
    rating: 4.8,
    reviewCount: 224
  },
  {
    id: 'bole-bacon-swiss',
    name: 'Bole Bacon Swiss',
    category: 'burgers',
    price: 540,
    description: 'Flame-grilled prime beef topped with crispy maple bacon, melted Swiss cheese, fresh peppered baby arugula, and our rich balsamic sweet onion relish, bound with smoky herb mayo.',
    imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80',
    ingredients: ['Prime beef patty', 'Crispy glazed maple bacon', 'Melted Swiss cheese', 'Baby arugula leaves', 'Balsamic sweet onion relish', 'Smoky herb mayonnaise'],
    estimatedTime: '14-16 mins',
    nutrition: {
      calories: 720,
      protein: '45g',
      carbs: '42g',
      fat: '36g'
    },
    tags: {},
    rating: 4.7,
    reviewCount: 142
  },
  {
    id: 'garden-escape',
    name: 'The Garden Escape',
    category: 'burgers',
    price: 420,
    description: 'Hand-crafted high-protein organic chickpea & sweet potato patty, melted vegan garlic cheese, fresh crushed Hass avocado mash, crispy cucumber, and organic alfalfa sprouts on a toasted artisan gluten-free bun.',
    imageUrl: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&w=600&q=80',
    ingredients: ['Chickpea & sweet potato patty', 'Gluten-free artisan bun', 'Vegan garlic cheese', 'Mashed Hass avocado', 'Fresh shredded sprouts', 'Sliced cucumber', 'Herb vegan-aise'],
    estimatedTime: '12-14 mins',
    nutrition: {
      calories: 490,
      protein: '18g',
      carbs: '65g',
      fat: '16g'
    },
    tags: {
      isVegan: true,
      isGlutenFree: true
    },
    rating: 4.6,
    reviewCount: 96
  },

  // fries-sides
  {
    id: 'truffle-rosemary-fries',
    name: 'Truffle Rosemary Fries',
    category: 'fries-sides',
    price: 260,
    description: 'Golden crispy white potatoes hand-cut in-house, lightly tossed with aromatic black truffle-infused oil, freshly picked highland mountain rosemary, coarse sea salt, and finely grated aged parmesan cheese.',
    imageUrl: '/src/assets/images/gourmet_truffle_fries_1781288103520.jpg',
    ingredients: ['In-house white potatoes', 'Pure black truffle oil', 'Highland rosemary sprigs', 'Coarse gray salt', 'Grated aged parmesan', 'Smoked garlic dipping sauce'],
    estimatedTime: '8 mins',
    nutrition: {
      calories: 390,
      protein: '6g',
      carbs: '46g',
      fat: '18g'
    },
    tags: {
      isSignature: true
    },
    rating: 4.9,
    reviewCount: 405
  },
  {
    id: 'berbere-sweet-potato',
    name: 'Spiced Sweet Potato Wedges',
    category: 'fries-sides',
    price: 290,
    description: 'Bake-roasted organic sweet potato wedges delicately seasoned with our signature local Berbere aromatic spice blend, served with a zesty cooling lemon-mint yogurt dip.',
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    ingredients: ['Organic sweet potato wedges', 'Arba Minch Berbere spice', 'Premium olive oil', 'Zesty lemon-mint yogurt sauce', 'Flaky pink salt'],
    estimatedTime: '10 mins',
    nutrition: {
      calories: 320,
      protein: '4g',
      carbs: '55g',
      fat: '8g'
    },
    tags: {
      hasLocalTouch: true,
      isVegan: false // yogurt dip, can be subbed
    },
    rating: 4.7,
    reviewCount: 154
  },
  {
    id: 'onion-halos',
    name: 'Crunchy Onion Halos',
    category: 'fries-sides',
    price: 220,
    description: 'Thick, sweet red onion rings freshly cut and drenched in our signature microbrew-infused crispy batter, topped with a crisp panko-crumb finish and smoked paprika relish.',
    imageUrl: 'https://images.unsplash.com/photo-1639024471283-2bc7b3c6a267?auto=format&fit=crop&w=600&q=80',
    ingredients: ['Giant sweet red onions', 'Wow specialty wheat craft batter', 'Golden crispy Japanese panko crumbs', 'Smoked paprika dipping relish'],
    estimatedTime: '8 mins',
    nutrition: {
      calories: 270,
      protein: '3g',
      carbs: '34g',
      fat: '12g'
    },
    tags: {
      isVegan: true
    },
    rating: 4.5,
    reviewCount: 88
  },

  // coffee
  {
    id: 'yirgacheffe-pour-over',
    name: 'Yirgacheffe Pour-Over',
    category: 'coffee',
    price: 180,
    description: 'Micro-lot single-origin organic arabica coffee sourced directly from dry-processed farms in Yirgacheffe. Elegantly hand-poured via V60 to express high jasmine floral fragrance, crisp citrus lime acidity, and smooth raw honey undertones.',
    imageUrl: '/src/assets/images/specialty_coffee_pour_1781288070716.jpg',
    ingredients: ['Premium Yirgacheffe Arabica beans', 'Fine micro-filtered mountain spring water', 'Pristine paper filter chemistry'],
    estimatedTime: '5-7 mins',
    nutrition: {
      calories: 4,
      protein: '0.5g',
      carbs: '0.8g',
      fat: '0g'
    },
    tags: {
      isSignature: true,
      hasLocalTouch: true,
      isVegan: true
    },
    rating: 4.95,
    reviewCount: 512
  },
  {
    id: 'addis-macchiato',
    name: 'Addis Espresso Macchiato',
    category: 'coffee',
    price: 140,
    description: 'A robust double-shot extracted from our custom medium-dark house espresso blend, stained with a single micro-foam dollop of creamy steamed organic whole milk. Rich dark chocolate profile.',
    imageUrl: 'https://images.unsplash.com/photo-1485808191679-5f63bbd0a11a?auto=format&fit=crop&w=600&q=80',
    ingredients: ['House dry-roasted espresso beans', 'Steamed local organic whole milk', 'Dense micro-surface foam'],
    estimatedTime: '3-4 mins',
    nutrition: {
      calories: 42,
      protein: '2.5g',
      carbs: '3.1g',
      fat: '2.2g'
    },
    tags: {
      hasLocalTouch: true
    },
    rating: 4.8,
    reviewCount: 298
  },
  {
    id: 'pistachio-honey-flat',
    name: 'Honey Pistachio Flat White',
    category: 'coffee',
    price: 220,
    description: 'Silky flat-textured organic whole milk poured gently over a rich double shot of custom espresso ristretto, infused with authentic forest wild honey and crushed roasted pistachio premium reduction.',
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
    ingredients: ['Specialty double espresso ristretto', 'Mountain wild forest honey', 'Slow-brewed pistachio cream', 'Steamed texturized velvet milk'],
    estimatedTime: '4-5 mins',
    nutrition: {
      calories: 190,
      protein: '7.5g',
      carbs: '18g',
      fat: '6.2g'
    },
    tags: {},
    rating: 4.85,
    reviewCount: 167
  },

  // drinks
  {
    id: 'hibiscus-ginger-fizz',
    name: 'Hibiscus Ginger Fizz',
    category: 'drinks',
    price: 150,
    description: 'Elegant draft beverage using organic red hibiscus hand-steeped in cold water for 16 hours, coupled with freshly squeezed pungent local ginger juice, botanical simple syrup, and pristine sparkling club soda over clear crushed ice.',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    ingredients: ['Organically grown red hibiscus flowers', 'Fresh hand-squeezed ginger root juice', 'Pure botanical honey syrup', 'Fine sparkling mineral soda', 'Garnished dewy mint sprig'],
    estimatedTime: '3 mins',
    nutrition: {
      calories: 95,
      protein: '0g',
      carbs: '22g',
      fat: '0g'
    },
    tags: {
      hasLocalTouch: true,
      isVegan: true
    },
    rating: 4.9,
    reviewCount: 243
  },
  {
    id: 'iced-matcha-latte',
    name: 'Iced Coconut Matcha Latte',
    category: 'drinks',
    price: 240,
    description: 'Ceremonial grade pure stone-ground Japanese Uji matcha whisked elegantly for smooth suspension, served chilled layered over cold creamy organic coconut milk and sweetened with real maple nectar.',
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
    ingredients: ['Pure ceremonial green tea matcha', 'Unsalted thick coconut cream milk', 'Pure Grade-A maple nectar syrup', 'Clear block ice spheres'],
    estimatedTime: '4 mins',
    nutrition: {
      calories: 140,
      protein: '2g',
      carbs: '15g',
      fat: '5g'
    },
    tags: {
      isVegan: true,
      isGlutenFree: true
    },
    rating: 4.75,
    reviewCount: 112
  },
  {
    id: 'mint-cucumber-fizz',
    name: 'Sparkling Cucumber Mint Soda',
    category: 'drinks',
    price: 140,
    description: 'Refreshing custom house-carbonated drink using freshly muddled English garden cucumbers, highly fragrant garden mint leaf extract, premium raw cane syrup, and pure mineral mountain soda water.',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    ingredients: ['Freshly harvested sweet mint sprigs', 'Organic English cucumber slices', 'In-house carbonated mountain spring water', 'Unfiltered organic cane sugar syrup'],
    estimatedTime: '3 mins',
    nutrition: {
      calories: 70,
      protein: '0g',
      carbs: '14g',
      fat: '0g'
    },
    tags: {
      isVegan: true
    },
    rating: 4.6,
    reviewCount: 78
  },

  // shakes
  {
    id: 'strawberry-forest-cream',
    name: 'Wild Strawberry Shake',
    category: 'shakes',
    price: 280,
    description: 'Double-churned gourmet organic vanilla beans blender-fused with whole wild strawberries from our local highland farms, piled high with fresh thick vanilla whipped cream and dark pink raspberry sprinkles.',
    imageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&q=80',
    ingredients: ['Double-churned vanilla bean ice cream', 'Highland wild strawberries', 'Velvety organic dairy whipped cream', 'Gourmet natural strawberry drops'],
    estimatedTime: '6-8 mins',
    nutrition: {
      calories: 550,
      protein: '9g',
      carbs: '68g',
      fat: '24g'
    },
    tags: {},
    rating: 4.85,
    reviewCount: 195
  },
  {
    id: 'salted-caramel-fudge',
    name: 'Salted Caramel PB Double',
    category: 'shakes',
    price: 310,
    description: 'Rich dark chocolate organic gelato whipped thick with handcrafted salted honey-caramel, roasted creamy organic peanut butter, and peanut honeycomb brittle chunks.',
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
    ingredients: ['Premium dark chocolate artisan gel', 'Creamy local organic peanut butter', 'Homemade organic sea salt caramel', 'Crushed traditional honeycomb candy pieces'],
    estimatedTime: '6-8 mins',
    nutrition: {
      calories: 640,
      protein: '14g',
      carbs: '72g',
      fat: '32g'
    },
    tags: {
      isSignature: true
    },
    rating: 4.9,
    reviewCount: 283
  },

  // desserts
  {
    id: 'molten-chocolate-volcano',
    name: 'Molten Chocolate Volcano',
    category: 'desserts',
    price: 320,
    description: 'Decadent slow-baked dark chocolate cake shell containing a dense, warm, oozing molten dark chocolate center, served with a velvety side scoop of house vanilla bean gelato, fresh raspberries, and a delicate mint leaf.',
    imageUrl: '/src/assets/images/chocolate_lava_dessert_1781288087237.jpg',
    ingredients: ['Belgian 72% organic dark chocolate', 'Local pasture-raised organic eggs', 'Madagascar organic vanilla pod oil', 'Artisanal micro-gelato cream scoop', 'Fresh mountain red raspberries'],
    estimatedTime: '10-12 mins',
    nutrition: {
      calories: 460,
      protein: '8g',
      carbs: '52g',
      fat: '22g'
    },
    tags: {
      isSignature: true
    },
    rating: 4.95,
    reviewCount: 374
  },
  {
    id: 'teff-honey-cheesecake',
    name: 'Teff Honey Honeycomb',
    category: 'desserts',
    price: 290,
    description: 'A luxurious velvet cream-cheese cake base layered gracefully on a crunchy toasted traditional gluten-free Ethiopian Teff grain crust, finished beautifully with mountain honey drizzle and crispy golden honeycomb candy.',
    imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80',
    ingredients: ['Highland double-cream cheese', 'Grounded golden raw honey', 'Toasted crisp organic Teff crumbs', 'Artisanal sweet candy honeycomb'],
    estimatedTime: '8 mins',
    nutrition: {
      calories: 410,
      protein: '7g',
      carbs: '46g',
      fat: '19g'
    },
    tags: {
      hasLocalTouch: true,
      isGlutenFree: true
    },
    rating: 4.88,
    reviewCount: 199
  }
];
