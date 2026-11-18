// Lightweight data for the homepage only.
// Keep this file small — it ships in the initial JS bundle.
// Full menu data lives in menuData.js (lazy-loaded with the Menu page).

export const FEATURED_DISHES = [
  {
    id: '13-10',
    name: 'Paneer Malai Tikka',
    description: 'Cottage cheese marinated in malai, pepper, coriander, cashews and onions, grilled in tandoor.',
    price: 249,
    tags: ['veg'],
  },
  {
    id: '23-3',
    name: 'Dal Makhani',
    description: 'Black urad & rajma slow cooked in tandoor for hours for rich, authentic flavours.',
    price: 239,
    tags: ['veg'],
  },
  {
    id: '29-2',
    name: 'Khuraak Special Meal',
    description: 'Kadhai Paneer, Chana Masala, Dal Makhani, Jeera Rice, Laccha Paratha, Butter Naan, Missi Roti, Butter Milk, Papad & Gulab Jamun.',
    price: 299,
    tags: ['veg'],
  },
  {
    id: '28-11',
    name: 'Sizzling Brownie',
    description: 'Warm gooey chocolate brownie served sizzling with a scoop of vanilla ice cream.',
    price: 229,
    tags: ['veg'],
  },
]

export const REVIEWS = [
  {
    id: 1,
    name: 'Ankit Tiwari',
    rating: 5,
    text: 'Best fine dining experience in Etawah! The Paneer Malai Tikka and Dal Makhani were outstanding. Beautiful ambiance and prompt service.',
  },
  {
    id: 2,
    name: 'Pooja Verma',
    rating: 5,
    text: 'Visited with family for a birthday dinner. The Khuraak Special Meal thali was lavish, fresh, and authentic. Highly recommended!',
  },
  {
    id: 3,
    name: 'Rohit Chauhan',
    rating: 5,
    text: 'Great mocktails, delicious sizzlers, and the Sizzling Brownie is to die for. A truly welcome dining destination in Etawah.',
  },
]
