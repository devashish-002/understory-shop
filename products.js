const PRODUCTS = [
  {
    id: 1,
    name: 'Monstera Deliciosa',
    category: 'Tropical',
    price: 1000,
    care: 'Bright indirect light',
    blurb: 'Big split leaves and easygoing energy for layered, airy rooms.',
    color: '#2f8d57',
    image:
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 2,
    name: 'Calathea Orbifolia',
    category: 'Tropical',
    price: 750,
    care: 'Medium to bright indirect light',
    blurb: 'Soft striped foliage with a refined silhouette for calm, cozy corners.',
    color: '#7dbb71',
    image:
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 3,
    name: 'Snake Plant',
    category: 'Low Light',
    price: 2200,
    care: 'Low to bright indirect light',
    blurb: 'Architectural, drought-tolerant, and perfect for first-time plant parents.',
    color: '#4d7d55',
    image:
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 4,
    name: 'Aloe Vera',
    category: 'Succulent',
    price: 1800,
    care: 'Bright direct light',
    blurb: 'A tidy succulent with glossy leaves and a little bit of desert drama.',
    color: '#8ecb68',
    image:
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 5,
    name: 'ZZ Plant',
    category: 'Low Light',
    price: 2600,
    care: 'Low light with occasional watering',
    blurb: 'Glossy, upright leaves that thrive on neglect and bring instant polish.',
    color: '#3f8d79',
    image:
      'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 6,
    name: 'Olive Tree',
    category: 'Outdoor',
    price: 420,
    care: 'Full sun to partial shade',
    blurb: 'A sculptural statement plant for terrace corners and bright entryways.',
    color: '#7e9f54',
    image:
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 7,
    name: 'Boston Fern',
    category: 'Ferns',
    price: 2100,
    care: 'Filtered light and regular moisture',
    blurb: 'Soft fronds bring lush texture and a fresh, woodland feel to shelves.',
    color: '#4a9a6e',
    image:
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 8,
    name: 'Kidney Pot',
    category: 'Planters',
    price: 1600,
    care: 'Indoor or outdoor use',
    blurb: 'A warm-toned ceramic planter made to ground your favorite trailing plant.',
    color: '#d79a6d',
    image:
      'https://images.unsplash.com/photo-1520417558131-3ed6c8bc4e74?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 9,
    name: 'Peace Lily',
    category: 'Tropical',
    price: 3100,
    care: 'Medium indirect light',
    blurb: 'Elegant white blooms and glossy leaves that soften darker corners beautifully.',
    color: '#5aa86d',
    image:
      'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 10,
    name: 'Rubber Plant',
    category: 'Low Light',
    price: 2700,
    care: 'Low to medium indirect light',
    blurb: 'Bold, upright foliage gives a polished look without much fuss.',
    color: '#3d7d5b',
    image:
      'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 11,
    name: 'Hoya Carnosa',
    category: 'Succulent',
    price: 1200,
    care: 'Bright indirect light',
    blurb: 'Waxy leaves and trailing vines make this a charming shelf or hanging plant.',
    color: '#86b36a',
    image:
      'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 12,
    name: 'Pothos',
    category: 'Ferns',
    price: 2090,
    care: 'Medium to bright indirect light',
    blurb: 'Fast-growing, forgiving, and ideal for bringing life to bookcases and shelves.',
    color: '#719a5d',
    image:
      'https://images.unsplash.com/photo-1525498128493-380d1990a112?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 13,
    name: 'Spider Plant',
    category: 'Tropical',
    price: 230,
    care: 'Bright indirect light',
    blurb: 'Easygoing arching leaves and baby offshoots make it a cheerful little statement.',
    color: '#6faf77',
    image:
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 14,
    name: 'Jade Plant',
    category: 'Succulent',
    price: 250,
    care: 'Bright light with sparse watering',
    blurb: 'A classic succulent with woody stems and glossy, jewel-like foliage.',
    color: '#7eb66b',
    image:
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 15,
    name: 'Bird of Paradise',
    category: 'Outdoor',
    price: 3950,
    care: 'Bright light and regular feeding',
    blurb: 'Tall, lush leaves bring instant tropical flair to open rooms and patios.',
    color: '#4f9c57',
    image:
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 16,
    name: 'Lavender Pot',
    category: 'Planters',
    price: 1850,
    care: 'Indoor or outdoor use',
    blurb: 'A soft ceramic planter with a subtle matte finish for airy, minimal styling.',
    color: '#d7b4a0',
    image:
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 17,
    name: 'Money Plant',
    category: 'Low Light',
    price: 1800,
    care: 'Medium to bright indirect light',
    blurb: 'A cheerful trailing plant with lush green leaves that brings easy freshness to shelves and corners.',
    color: '#5d9f72',
    image:
      'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 18,
    name: 'Areca Palm',
    category: 'Tropical',
    price: 2800,
    care: 'Bright indirect light and regular watering',
    blurb: 'Feathery fronds create a breezy tropical feel and soften indoor corners beautifully.',
    color: '#7fbf8a',
    image:
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 19,
    name: 'Chinese Evergreen',
    category: 'Low Light',
    price: 2400,
    care: 'Low to medium indirect light',
    blurb: 'An adaptable favorite with striking variegated leaves that handle everyday life with ease.',
    color: '#67a56b',
    image:
      'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 20,
    name: 'Echeveria',
    category: 'Succulent',
    price: 1700,
    care: 'Bright light and occasional watering',
    blurb: 'Rosette-shaped leaves with a sculptural silhouette that suits modern shelves and windowsills.',
    color: '#9cc76d',
    image:
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=900&q=80'
  }
];

if (typeof module !== 'undefined') {
  module.exports = PRODUCTS;
}
