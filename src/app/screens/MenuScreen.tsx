import { useState } from 'react';
import { ScreenType, MenuItem, CartItem } from '../types';
import { Button } from '../components/Button';
import { ArrowLeft, Search, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface MenuScreenProps {
  onNavigate: (screen: ScreenType) => void;
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity: number, instructions?: string) => void;
}

const CATEGORIES = ['All', 'Appetizers', 'Entrees', 'Desserts', 'Beverages'];

const MOCK_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Jollof Rice',
    description: 'Aromatic rice cooked in a rich tomato sauce with spices, served with grilled chicken and fried plantains.',
    price: 15.00,
    category: 'Entrees',
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&q=75&auto=format&fit=crop',
    badges: []
  },
  {
    id: '2',
    name: 'Kelewele',
    description: 'Spicy fried plantain cubes seasoned with ginger, pepper, and aromatic spices. A perfect appetizer.',
    price: 8.00,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=600&q=75&auto=format&fit=crop',
    badges: ['Vegan', 'Gluten-Free']
  },
  {
    id: '3',
    name: 'Banku with Tilapia',
    description: 'Fermented corn and cassava dough served with grilled tilapia and spicy pepper sauce.',
    price: 18.00,
    category: 'Entrees',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=75&auto=format&fit=crop',
    badges: []
  },
  {
    id: '4',
    name: 'Bofrot',
    description: 'Sweet fried dough balls, crispy on the outside and soft inside. A beloved Ghanaian treat.',
    price: 6.00,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1626094309830-abbb0c99da4a?w=600&q=75&auto=format&fit=crop',
    badges: ['Vegetarian']
  },
  {
    id: '5',
    name: 'Sobolo',
    description: 'Refreshing hibiscus drink infused with ginger, pineapple, and cloves. Served chilled.',
    price: 5.00,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=75&auto=format&fit=crop',
    badges: ['Vegan', 'Gluten-Free']
  },
  {
    id: '6',
    name: 'Waakye',
    description: 'Rice and beans cooked with millet leaves, served with spaghetti, gari, boiled egg, and shito.',
    price: 12.00,
    category: 'Entrees',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=75&auto=format&fit=crop',
    badges: ['Vegetarian']
  },
  {
    id: '7',
    name: 'Red Red',
    description: 'Black-eyed peas stewed in palm oil with tomatoes and spices, served with fried plantains.',
    price: 10.00,
    category: 'Entrees',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=75&auto=format&fit=crop',
    badges: ['Vegan']
  },
  {
    id: '8',
    name: 'Groundnut Soup',
    description: 'Rich peanut-based soup with chicken, vegetables, and traditional spices. Served with fufu.',
    price: 16.00,
    category: 'Entrees',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=75&auto=format&fit=crop',
    badges: []
  },
  {
    id: '9',
    name: 'Fufu with Light Soup',
    description: 'Pounded cassava and plantain served with aromatic tomato-based light soup with goat meat.',
    price: 14.00,
    category: 'Entrees',
    image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=600&q=75&auto=format&fit=crop',
    badges: ['Gluten-Free']
  },
  {
    id: '10',
    name: 'Fried Yam with Shito',
    description: 'Crispy golden fried yam served with spicy black pepper sauce (shito).',
    price: 7.00,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=600&q=75&auto=format&fit=crop',
    badges: ['Vegan']
  },
  {
    id: '11',
    name: 'Grilled Tilapia',
    description: 'Whole tilapia marinated in spices and grilled to perfection, served with banku and pepper sauce.',
    price: 20.00,
    category: 'Entrees',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&q=75&auto=format&fit=crop',
    badges: ['Gluten-Free']
  },
  {
    id: '12',
    name: 'Chin Chin',
    description: 'Crunchy fried dough snacks with a hint of nutmeg. Perfect with tea or as a sweet treat.',
    price: 5.00,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&q=75&auto=format&fit=crop',
    badges: ['Vegetarian']
  }
];

export const MenuScreen = ({ onNavigate, cart, addToCart }: MenuScreenProps) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [modalInstructions, setModalInstructions] = useState('');
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const filteredItems = MOCK_MENU.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="flex flex-col h-full relative pt-32 px-6 max-w-7xl mx-auto">
      {/* Header with Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between z-30 bg-[#FDFBF7] pb-4 pt-4 -mx-6 px-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button variant="ghost" size="sm" onClick={() => onNavigate('HOME')}>
            <ArrowLeft size={20} className="mr-2" /> Back
          </Button>
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D6E63]" size={18} />
            <input 
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-[#D7CCC8] focus:border-[#8D6E63] focus:ring-1 focus:ring-[#8D6E63] outline-none"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={clsx(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                activeCategory === cat 
                  ? "bg-[#5D4037] text-white shadow-md" 
                  : "bg-white text-[#5D4037] border border-[#D7CCC8] hover:bg-[#8D6E63]/10"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            layoutId={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#D7CCC8]/30 hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full group"
            onClick={() => setSelectedItem(item)}
          >
            <div className="h-48 overflow-hidden relative bg-gray-100">
              {!loadedImages.has(item.id) && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
              )}
              <ImageWithFallback 
                src={item.image} 
                alt={item.name} 
                className={cn(
                  "w-full h-full object-cover transition-all duration-500 group-hover:scale-105",
                  loadedImages.has(item.id) ? "opacity-100" : "opacity-0"
                )}
                loading="lazy"
                onLoad={() => setLoadedImages(prev => new Set(prev).add(item.id))}
              />
              <div className="absolute top-2 right-2 flex gap-1">
                {item.badges.map(badge => (
                  <span 
                    key={badge} 
                    className="bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded-full text-[#5D4037] uppercase tracking-wider"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-[#3E2723]">{item.name}</h3>
                <span className="font-bold text-[#8D6E63]">GH₵ {item.price.toFixed(2)}</span>
              </div>
              <p className="text-sm text-[#5D4037]/70 line-clamp-2 mb-4 flex-1">{item.description}</p>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item, 1);
                  }}
                >
                  <Plus size={16} className="mr-2" /> 
                  <span>Add</span>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" 
            onClick={() => {
              setSelectedItem(null);
              setModalQuantity(1);
              setModalInstructions('');
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <motion.div 
              layoutId={selectedItem.id}
              className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <button 
                onClick={() => {
                  setSelectedItem(null);
                  setModalQuantity(1);
                  setModalInstructions('');
                }}
                className="absolute top-4 right-4 z-10 bg-white/50 backdrop-blur-md p-2 rounded-full hover:bg-white transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
              
              <div className="h-64 relative bg-gray-100">
                <ImageWithFallback 
                  src={selectedItem.image} 
                  alt={selectedItem.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-[#3E2723]">{selectedItem.name}</h2>
                  <span className="text-xl font-bold text-[#8D6E63]">GH₵ {selectedItem.price.toFixed(2)}</span>
                </div>
                
                <p className="text-[#5D4037]/80 mb-6 leading-relaxed">
                  {selectedItem.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                   {selectedItem.badges.map(badge => (
                    <span key={badge} className="bg-[#8D6E63]/10 text-[#8D6E63] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {badge}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-[#5D4037] mb-1 block">Special Instructions</label>
                    <input 
                      className="w-full border border-[#D7CCC8] rounded-lg px-3 py-2 text-sm" 
                      placeholder="e.g. No onions"
                      value={modalInstructions || ''}
                      onChange={(e) => setModalInstructions(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-[#D7CCC8] flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                        className="w-8 h-8 rounded-full border border-[#D7CCC8] flex items-center justify-center hover:bg-[#FDFBF7] transition-colors"
                      >
                        -
                      </button>
                      <span className="font-bold min-w-[2rem] text-center">{modalQuantity}</span>
                      <button 
                        onClick={() => setModalQuantity(modalQuantity + 1)}
                        className="w-8 h-8 rounded-full border border-[#D7CCC8] flex items-center justify-center hover:bg-[#FDFBF7] transition-colors"
                      >
                        +
                      </button>
                   </div>
                   <Button onClick={() => {
                     addToCart(selectedItem, modalQuantity, modalInstructions);
                     setSelectedItem(null);
                     setModalQuantity(1);
                     setModalInstructions('');
                   }}>
                     Add to Order - GH₵ {(selectedItem.price * modalQuantity).toFixed(2)}
                   </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Cart Button */}
      {cartTotalItems > 0 && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-6 right-6 left-6 md:left-auto md:w-96 z-[100]"
        >
          <Button 
            className="w-full flex items-center justify-between shadow-xl py-4" 
            onClick={() => onNavigate('CART')}
          >
            <div className="flex items-center gap-3">
              <span className="bg-white/20 px-2 py-1 rounded text-sm font-bold">
                {cartTotalItems}
              </span>
              <span>View Order</span>
            </div>
            <span className="font-bold">GH₵ {cartTotalPrice.toFixed(2)}</span>
          </Button>
        </motion.div>
      )}
    </div>
  );
};
