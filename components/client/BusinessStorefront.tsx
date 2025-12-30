
import React, { useState, useMemo } from 'react';
import { formatCurrency } from '../../services/pricing';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface BusinessStorefrontProps {
  businessName: string;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
}

const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Mazoe Orange Crush 2L', price: 3.50, category: 'Beverages', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=200' },
  { id: 'p2', name: 'Zimgold Cooking Oil 2L', price: 3.90, category: 'Pantry', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200' },
  { id: 'p3', name: 'Red Seal Flour 2kg', price: 2.10, category: 'Baking', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200' },
  { id: 'p4', name: 'Huletts Sugar 2kg', price: 2.80, category: 'Pantry', image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&q=80&w=200' },
  { id: 'p5', name: 'Gloria Cake Flour 2kg', price: 2.25, category: 'Baking', image: 'https://images.unsplash.com/photo-1595940929854-36528d712053?auto=format&fit=crop&q=80&w=200' },
  { id: 'p6', name: 'Cerevita Choco Malt', price: 4.50, category: 'Beverages', image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=200' },
];

const CATEGORIES = ['All', 'Beverages', 'Pantry', 'Baking'];

const BusinessStorefront: React.FC<BusinessStorefrontProps> = ({ businessName, onBack, onAddToCart }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center space-x-6">
          <button onClick={onBack} className="p-4 bg-white border rounded-[1.5rem] hover:bg-red-50 hover:border-red-200 transition-all shadow-sm active:scale-90 text-gray-400 hover:text-red-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none">{businessName}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs font-black text-red-600 bg-red-50 px-3 py-1 rounded-full uppercase tracking-widest">Verified Partner</span>
              <span className="text-xs font-bold text-gray-400 tracking-tight">Ready in ~20m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Refined Filter Section */}
      <div className="bg-white p-2 rounded-[2.5rem] border shadow-sm flex flex-col space-y-2">
        <div className="flex flex-col md:flex-row gap-4 items-center p-4">
          <div className="relative flex-1 w-full group">
            <svg className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${searchQuery ? 'text-red-600' : 'text-gray-400 group-focus-within:text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text"
              placeholder={`Search items in ${businessName}...`}
              className="w-full bg-gray-50 border-2 border-transparent focus:border-red-600 focus:bg-white rounded-[1.5rem] pl-14 pr-12 py-4 text-base font-bold transition-all outline-none placeholder:text-gray-400 placeholder:font-medium shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-red-100 text-gray-500 hover:text-red-600 p-1.5 rounded-full transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        </div>
        
        <div className="px-4 pb-4 flex space-x-3 overflow-x-auto no-scrollbar relative">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-3.5 rounded-[1.25rem] text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                selectedCategory === cat 
                  ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20 translate-y-[-2px]' 
                  : 'bg-white text-gray-400 border-gray-100 hover:border-red-200 hover:text-red-600'
              }`}
            >
              {cat}
            </button>
          ))}
          {/* Subtle gradient indicators for scroll */}
          <div className="absolute top-0 right-0 bottom-4 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          <div className="absolute top-0 left-0 bottom-4 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Responsive Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all group animate-in zoom-in-95">
            <div className="h-48 relative overflow-hidden bg-gray-50">
              <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <button 
                onClick={() => onAddToCart(product)}
                className="absolute bottom-4 right-4 bg-red-600 text-white w-14 h-14 rounded-2xl shadow-xl shadow-red-600/30 hover:bg-red-700 hover:scale-110 active:scale-90 transition-all flex items-center justify-center z-10"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
              </button>
              <div className="absolute top-4 left-4">
                <span className="bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black text-gray-500 uppercase tracking-widest shadow-lg">{product.category}</span>
              </div>
            </div>
            <div className="p-6">
              <h4 className="font-black text-gray-900 leading-tight line-clamp-2 min-h-[3rem] text-lg tracking-tight">{product.name}</h4>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-red-600 font-black text-xl tracking-tighter">{formatCurrency(product.price)}</p>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">In Stock</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-32 space-y-6 bg-white rounded-[3rem] border border-dashed border-gray-200 shadow-inner">
           <div className="text-7xl opacity-20">🔎</div>
           <div className="space-y-2">
             <h4 className="text-2xl font-black text-gray-400 tracking-tight">No items match your search</h4>
             <p className="text-sm text-gray-500 font-bold max-w-xs mx-auto">Try a different keyword or change your category filter to see more items.</p>
           </div>
           <button 
             onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
             className="text-red-600 font-black text-xs uppercase tracking-widest hover:underline"
           >
             Clear All Filters
           </button>
        </div>
      )}
    </div>
  );
};

export default BusinessStorefront;
