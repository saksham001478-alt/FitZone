// staticData.js — Static data for navigation, diet plans, membership plans, and shop products

export const dietPlans = {
  'weight-gain': {
    title: 'Weight Gain Diet',
    icon: '💪',
    description: 'High-calorie diet plan to help you gain healthy weight and build mass.',
    calories: '3000-3500 cal/day',
    meals: {
      breakfast: [
        '4 whole eggs scrambled with cheese',
        'Oatmeal with banana and honey',
        'Glass of whole milk',
        'Handful of almonds',
      ],
      lunch: [
        'Grilled chicken breast (200g)',
        'Brown rice (1.5 cups)',
        'Mixed vegetable salad with olive oil',
        'Lentil soup',
      ],
      snacks: [
        'Protein shake with peanut butter',
        'Trail mix with dried fruits',
        'Greek yogurt with granola',
      ],
      dinner: [
        'Salmon fillet (200g)',
        'Sweet potato mash',
        'Steamed broccoli and carrots',
        'Whole wheat bread',
      ],
    },
  },
  'weight-loss': {
    title: 'Weight Loss Diet',
    icon: '🔥',
    description: 'Calorie-deficit diet plan for healthy and sustainable weight loss.',
    calories: '1500-1800 cal/day',
    meals: {
      breakfast: [
        'Egg white omelette with spinach',
        'Whole wheat toast (1 slice)',
        'Green tea',
        'Half a grapefruit',
      ],
      lunch: [
        'Grilled chicken salad',
        'Quinoa (half cup)',
        'Cucumber and tomato salad',
        'Lime water',
      ],
      snacks: [
        'Apple slices with almond butter',
        'Carrot and celery sticks',
        'Handful of walnuts',
      ],
      dinner: [
        'Baked fish (150g)',
        'Steamed vegetables',
        'Mixed green salad',
        'Herbal tea',
      ],
    },
  },
  'muscle-gain': {
    title: 'Muscle Gain Diet',
    icon: '🏋️',
    description: 'Protein-rich diet plan designed for muscle building and recovery.',
    calories: '2800-3200 cal/day',
    meals: {
      breakfast: [
        'Protein pancakes (3 large)',
        '6 egg whites + 2 whole eggs',
        'Banana smoothie with whey',
        'Oats with berries',
      ],
      lunch: [
        'Chicken breast (250g)',
        'Brown rice (2 cups)',
        'Broccoli and asparagus',
        'Avocado half',
      ],
      snacks: [
        'Whey protein shake',
        'Cottage cheese with pineapple',
        'Rice cakes with peanut butter',
      ],
      dinner: [
        'Lean beef steak (200g)',
        'Baked potato',
        'Green beans and mushrooms',
        'Casein protein before bed',
      ],
    },
  },
  'maintenance': {
    title: 'Maintenance Diet',
    icon: '⚖️',
    description: 'Balanced diet plan to maintain your current weight and stay healthy.',
    calories: '2000-2400 cal/day',
    meals: {
      breakfast: [
        '2 boiled eggs',
        'Whole grain cereal with milk',
        'Fresh orange juice',
        'Mixed fruit bowl',
      ],
      lunch: [
        'Grilled turkey sandwich',
        'Brown rice with dal',
        'Green salad',
        'Buttermilk',
      ],
      snacks: [
        'Mixed nuts (30g)',
        'Fruit smoothie',
        'Dark chocolate (2 squares)',
      ],
      dinner: [
        'Grilled paneer or tofu (150g)',
        'Roti or whole wheat pasta',
        'Mixed vegetable curry',
        'Warm milk with turmeric',
      ],
    },
  },
};

export const adminNavItems = [
  { path: '/admin', icon: '📊', label: 'Dashboard' },
  { path: '/admin/members', icon: '👥', label: 'Members' },
  { path: '/admin/plans', icon: '💳', label: 'Membership' },
  { path: '/admin/attendance', icon: '📅', label: 'Attendance' },
  { path: '/admin/diet', icon: '🥗', label: 'Diet Plans' },
  { path: '/admin/fitness', icon: '🏋️', label: 'Fitness' },
  { path: '/admin/shop', icon: '🛍️', label: 'Shop' },
  { path: '/admin/orders', icon: '📦', label: 'Orders' },
  { path: '/admin/settings', icon: '⚙️', label: 'Settings' },
];

export const customerNavItems = [
  { path: '/app', icon: '🏠', label: 'Dashboard' },
  { path: '/app/profile', icon: '👤', label: 'My Profile' },
  { path: '/app/attendance', icon: '📅', label: 'My Attendance' },
  { path: '/app/plan', icon: '💳', label: 'My Plan' },
  { path: '/app/diet', icon: '🥗', label: 'Diet Plans' },
  { path: '/app/fitness', icon: '🏋️', label: 'My Fitness' },
  { path: '/app/shop', icon: '🛍️', label: 'Shop' },
  { path: '/app/contact', icon: '📞', label: 'Contact Us' },
  { path: '/app/settings', icon: '⚙️', label: 'Settings' },
];

export const membershipPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '₹999',
    numericPrice: 999,
    popular: false,
    features: [
      'Access to gym floor',
      'Locker room access',
      'Basic equipment usage',
      '1 group class per week',
      'Fitness assessment',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: '₹1,999',
    numericPrice: 1999,
    popular: true,
    features: [
      'Everything in Basic',
      'All group classes',
      'Personal trainer (2x/month)',
      'Diet plan consultation',
      'Sauna & steam room',
      'Towel service',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹2,999',
    numericPrice: 2999,
    popular: false,
    features: [
      'Everything in Standard',
      'Unlimited personal training',
      'Custom diet & workout plans',
      'Priority booking',
      'Guest passes (2/month)',
      'Supplement discounts',
      'Monthly body analysis',
    ],
  },
];

export const shopProducts = [
  {
    id: 1,
    name: 'Whey Protein',
    price: 2499,
    category: 'Supplements',
    icon: '🥛',
    description: 'Premium 100% whey protein powder for optimal muscle recovery and growth.',
  },
  {
    id: 2,
    name: 'Creatine',
    price: 899,
    category: 'Supplements',
    icon: '⚡',
    description: 'Micronized creatine monohydrate to boost strength, power, and muscle endurance.',
  },
  {
    id: 3,
    name: 'Gym Gloves',
    price: 499,
    category: 'Accessories',
    icon: '🧤',
    description: 'Breathable workout gloves with wrist support and enhanced palm grip.',
  },
  {
    id: 4,
    name: 'Resistance Bands',
    price: 699,
    category: 'Equipment',
    icon: '🎗️',
    description: 'Set of 5 durable latex resistance bands for strength training and stretching.',
  },
  {
    id: 5,
    name: 'Shaker Bottle',
    price: 349,
    category: 'Accessories',
    icon: '🥤',
    description: 'Leak-proof 700ml shaker bottle with blending ball for smooth shakes.',
  },
  {
    id: 6,
    name: 'Yoga Mat',
    price: 799,
    category: 'Equipment',
    icon: '🧘',
    description: 'Extra thick non-slip exercise yoga mat with carrying strap.',
  },
  {
    id: 7,
    name: 'Jump Rope',
    price: 299,
    category: 'Equipment',
    icon: '🪢',
    description: 'High-speed adjustable skipping rope for intense cardio and conditioning.',
  },
  {
    id: 8,
    name: 'Wrist Wraps',
    price: 399,
    category: 'Accessories',
    icon: '🩹',
    description: 'Heavy-duty elastic wrist wraps for maximum wrist stability during heavy lifts.',
  },
];

export default {
  dietPlans,
  adminNavItems,
  customerNavItems,
  membershipPlans,
  shopProducts,
};
