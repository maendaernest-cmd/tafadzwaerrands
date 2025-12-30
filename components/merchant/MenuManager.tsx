
import React, { useState, useMemo } from 'react';
import { formatCurrency } from '../../services/pricing';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  stock: boolean;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Mazoe Orange Crush 2L', price: 3.50, category: 'Groceries', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=200', stock: true },
  { id: '2', name: 'Zimgold Cooking Oil 2L', price: 3.90, category: 'Groceries', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200', stock: true },
  { id: '3', name: 'Red Seal Flour 2kg', price: 2.10, category: 'Groceries', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200', stock: true },
  { id: '4', name: 'Huletts Sugar 2kg', price: 2.80, category: 'Groceries', image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&q=80&w=200', stock: false },
  { id: '5', name: 'Quarter Chicken & Chips', price: 5.50, category: 'Fast Food', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?auto=format&fit=crop&q=80&w=200', stock: true },
];

const CATEGORIES = ['All', 'Groceries', 'Fast Food', 'Pharmacy', 'Hardware'];

const MenuManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const toggleStock = (id: string) => {
    setProducts(products.map(p => p.id === id ? { ...p, stock: !p.stock } : p));
  };

  const handleAddClick = () => {
    setEditingProduct({ name: '', price: 0, category: 'Groceries', stock: true, image: '' });
    setIsEditing(true);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSave = () => {
    if (!editingProduct) return;
    if (editingProduct.id) {
      setProducts(products.map(p => p.id === editingProduct.id ? (editingProduct as Product) : p));
    } else {
      const newProduct = { ...editingProduct, id: Date.now().toString() } as Product;
      setProducts([...products, newProduct]);
    }
    setIsEditing(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header & Main Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">Menu Manager</h3>
          <p className="text-gray-500 text-sm font-medium">Manage your products, prices, and inventory availability.</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="w-full lg:w-auto bg-red-600 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-red-600/20 hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center space-x-3"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          <span>Add New Product</span>
        </button>
      </div>

      {/* Enhanced Filter Section */}
      <div className="bg-white p-2 rounded-[2.5rem] border shadow-sm flex flex-col space-y-2">
        <div className="flex flex-col md:flex-row gap-4 items-center p-4">
          <div className="relative flex-1 w-full group">
            <svg className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${searchQuery ? 'text-red-600' : 'text-gray-400 group-focus-within:text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text"
              placeholder="Search catalog items..."
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
        
        <div className="px-4 pb-4 overflow-hidden relative">
          <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-1">
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
          </div>
          {/* Subtle gradient indicators for scroll */}
          <div className="absolute top-0 right-0 bottom-4 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          <div className="absolute top-0 left-0 bottom-4 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            className={`bg-white rounded-[2.5rem] border overflow-hidden shadow-sm hover:shadow-2xl transition-all group relative ${!product.stock ? 'grayscale opacity-70' : ''}`}
          >
            <div className="h-52 relative overflow-hidden bg-gray-50">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                   <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              )}
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 backdrop-blur-sm">
                <button 
                  onClick={() => handleEditClick(product)}
                  className="bg-white p-3 rounded-xl shadow-lg hover:bg-red-600 hover:text-white transition-all transform hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="bg-white p-3 rounded-xl shadow-lg hover:bg-black hover:text-white transition-all transform hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>

              <div className="absolute top-4 left-4">
                <span className="bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black text-gray-700 uppercase tracking-widest shadow-xl">{product.category}</span>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start gap-4">
                <h4 className="font-black text-gray-900 tracking-tight leading-tight flex-1 line-clamp-2 text-lg">{product.name}</h4>
                <span className="text-red-600 font-black text-xl">{formatCurrency(product.price)}</span>
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${product.stock ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-gray-300'}`} />
                  <span className={`text-[11px] font-black uppercase tracking-widest ${product.stock ? 'text-green-600' : 'text-gray-400'}`}>
                    {product.stock ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={product.stock} 
                    onChange={() => toggleStock(product.id)}
                  />
                  <div className="w-12 h-6.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
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
             Reset All Filters
           </button>
        </div>
      )}

      {/* Edit/Add Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 bg-gray-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-black tracking-tight">{editingProduct?.id ? 'Edit Product' : 'Add New Product'}</h3>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Product Details</p>
              </div>
              <button onClick={() => setIsEditing(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-12 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Product Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Red Seal Flour"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-red-600 rounded-2xl px-6 py-4.5 text-sm font-bold focus:bg-white transition-all outline-none"
                    value={editingProduct?.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (USD)</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-black">$</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-red-600 rounded-2xl pl-12 pr-6 py-4.5 text-sm font-bold focus:bg-white transition-all outline-none"
                      value={editingProduct?.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                  <select 
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-red-600 rounded-2xl px-6 py-4.5 text-sm font-bold focus:bg-white transition-all outline-none appearance-none"
                    value={editingProduct?.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(cat => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Product Image Link</label>
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden border shadow-inner">
                       {editingProduct?.image ? (
                         <img src={editingProduct.image} className="w-full h-full object-cover" alt="Thumb" />
                       ) : (
                         <span className="text-xl">🖼️</span>
                       )}
                    </div>
                    <input 
                      type="text" 
                      placeholder="https://images.unsplash..."
                      className="flex-1 bg-gray-50 border-2 border-transparent focus:border-red-600 rounded-2xl px-6 py-4 text-xs font-bold focus:bg-white transition-all outline-none"
                      value={editingProduct?.image}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t flex gap-4">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-5 rounded-2xl text-xs font-black text-gray-400 hover:bg-gray-50 transition-all uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-red-600 py-5 rounded-2xl text-xs font-black text-white shadow-2xl shadow-red-600/20 hover:bg-red-700 active:scale-95 transition-all uppercase tracking-widest"
                >
                  {editingProduct?.id ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManager;
