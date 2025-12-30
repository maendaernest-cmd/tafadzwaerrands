
import React, { useState, useEffect, useRef } from 'react';
import { calculateDeliveryPrice, formatCurrency } from '../../services/pricing';

interface CreateRequestFormProps {
  initialCategory?: string;
  onCancel: () => void;
  onSubmit: (errandData: any) => void;
}

interface FormErrors {
  pickup?: string;
  destination?: string;
  budget?: string;
  instructions?: string;
}

const CATEGORIES = [
  { id: 'groceries', name: 'Groceries', icon: '🛒' },
  { id: 'pharmacy', name: 'Pharmacy', icon: '💊' },
  { id: 'docs', name: 'Documents', icon: '📄' },
  { id: 'parcel', name: 'Parcel', icon: '📦' },
  { id: 'fastfood', name: 'Fast Food', icon: '🍔' },
];

const CreateRequestForm: React.FC<CreateRequestFormProps> = ({ initialCategory, onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    category: initialCategory || 'groceries',
    pickup: '',
    destination: '',
    budget: 0,
    instructions: '',
    joinRoute: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [distance, setDistance] = useState(0);
  const [price, setPrice] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const pickupRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);
  const budgetRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formData.pickup.trim() && formData.destination.trim()) {
      setIsCalculating(true);
      const timer = setTimeout(() => {
        const mockDist = Math.floor(Math.random() * 15) + 2;
        setDistance(mockDist);
        setPrice(calculateDeliveryPrice(mockDist));
        setIsCalculating(false);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setDistance(0);
      setPrice(0);
    }
  }, [formData.pickup, formData.destination]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.pickup.trim()) {
      newErrors.pickup = 'Please enter a pickup location';
    }
    
    if (!formData.destination.trim()) {
      newErrors.destination = 'Please enter a delivery destination';
    }
    
    if (formData.budget <= 0) {
      newErrors.budget = 'Budget must be greater than $0';
    } else if (formData.budget > 5000) {
      newErrors.budget = 'Maximum budget is $5,000 for single errands';
    }

    if (formData.instructions.length > 500) {
      newErrors.instructions = 'Instructions must be under 500 characters';
    }

    setErrors(newErrors);

    // Auto-focus first error field
    if (newErrors.pickup) pickupRef.current?.focus();
    else if (newErrors.destination) destinationRef.current?.focus();
    else if (newErrors.budget) budgetRef.current?.focus();

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ ...formData, distance, price });
    }
  };

  const finalPrice = formData.joinRoute ? Math.max(2, price - 2) : price;

  const inputBaseClass = "w-full bg-gray-50 border-2 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none transition-all shadow-sm";
  const errorInputClass = "border-red-500 bg-red-50 focus:border-red-600 focus:bg-white animate-shake";
  const normalInputClass = "border-gray-100 focus:border-red-600 focus:bg-white";

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="bg-red-600 p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black tracking-tight leading-none">Create Errand</h2>
            <p className="text-red-100 text-xs mt-2 font-bold uppercase tracking-widest opacity-80">Phase: Details & Budgeting</p>
          </div>
          <button 
            type="button" 
            onClick={onCancel} 
            className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12" noValidate>
        {/* Category Selector */}
        <div className="space-y-4">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">1. Errand Type <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat.id })}
                className={`flex items-center space-x-3 px-6 py-4 rounded-2xl border-2 transition-all ${
                  formData.category === cat.id ? 'border-red-600 bg-red-50 text-red-600 shadow-lg shadow-red-600/5 scale-105' : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'
                }`}
              >
                <span className="text-2xl" role="img" aria-label={cat.name}>{cat.icon}</span>
                <span className="text-xs font-black uppercase tracking-widest">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Location Details */}
          <div className="space-y-8">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">2. Route Information <span className="text-red-500">*</span></label>
            
            <div className="space-y-8">
              <div className="relative">
                <input 
                  ref={pickupRef}
                  type="text" 
                  placeholder="Pickup Point (e.g. OK Mart Avondale)"
                  className={`${inputBaseClass} ${errors.pickup ? errorInputClass : normalInputClass}`}
                  value={formData.pickup}
                  onChange={(e) => {
                    setFormData({...formData, pickup: e.target.value});
                    if (errors.pickup) setErrors({...errors, pickup: undefined});
                  }}
                  required
                />
                {errors.pickup && (
                  <p className="absolute -bottom-6 left-2 text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                    {errors.pickup}
                  </p>
                )}
              </div>

              <div className="relative">
                <input 
                  ref={destinationRef}
                  type="text" 
                  placeholder="Drop-off Point (Full Address)"
                  className={`${inputBaseClass} ${errors.destination ? errorInputClass : normalInputClass}`}
                  value={formData.destination}
                  onChange={(e) => {
                    setFormData({...formData, destination: e.target.value});
                    if (errors.destination) setErrors({...errors, destination: undefined});
                  }}
                  required
                />
                {errors.destination && (
                  <p className="absolute -bottom-6 left-2 text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                    {errors.destination}
                  </p>
                )}
              </div>
            </div>
            
            <label className="flex items-center space-x-4 cursor-pointer group bg-gray-50/50 p-6 rounded-3xl border border-gray-100 hover:bg-gray-50 transition-all">
              <input 
                type="checkbox" 
                className="w-6 h-6 rounded-lg border-gray-300 text-red-600 focus:ring-red-600 cursor-pointer"
                checked={formData.joinRoute}
                onChange={(e) => setFormData({...formData, joinRoute: e.target.checked})}
              />
              <div className="flex flex-col">
                <span className="text-sm font-black text-gray-900 tracking-tight">Join Existing Route</span>
                <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Saves $2.00 • Eco-Friendly</span>
              </div>
            </label>
          </div>

          {/* Budget & Items */}
          <div className="space-y-8">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">3. Budget Guardian™ <span className="text-red-500">*</span></label>
            
            <div className={`p-8 rounded-[2.5rem] border-2 transition-all shadow-inner relative ${errors.budget ? 'border-red-200 bg-red-50/30' : 'border-gray-50 bg-gray-50'}`}>
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Escrow Amount (USD)</span>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400 font-black text-xl">$</span>
                  <input 
                    ref={budgetRef}
                    type="number"
                    min="0"
                    max="5000"
                    className="w-24 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xl font-black text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
                    value={formData.budget === 0 ? '' : formData.budget}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setFormData({...formData, budget: val});
                      if (errors.budget && val > 0) setErrors({...errors, budget: undefined});
                    }}
                    required
                  />
                </div>
              </div>
              
              <input 
                type="range" 
                min="0" 
                max="500" 
                step="5"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                value={formData.budget > 500 ? 500 : formData.budget}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setFormData({...formData, budget: val});
                  if (errors.budget && val > 0) setErrors({...errors, budget: undefined});
                }}
              />
              <div className="flex justify-between mt-3 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                <span>$0</span>
                <span>$500+ Range</span>
              </div>

              {errors.budget && (
                <p className="mt-4 text-[10px] font-black text-red-600 uppercase tracking-widest animate-in fade-in slide-in-from-top-2 flex items-center gap-1.5">
                   <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                  {errors.budget}
                </p>
              )}
            </div>

            <div className="relative">
              <textarea 
                placeholder="Detailed Shopping List or Instructions..."
                rows={3}
                className={`w-full bg-gray-50 border-2 rounded-[2rem] px-8 py-6 text-sm font-bold focus:outline-none focus:bg-white transition-all resize-none shadow-sm ${errors.instructions ? 'border-red-500 bg-red-50' : 'border-gray-100 focus:border-red-600'}`}
                value={formData.instructions}
                onChange={(e) => {
                  setFormData({...formData, instructions: e.target.value});
                  if (errors.instructions && e.target.value.length <= 500) setErrors({...errors, instructions: undefined});
                }}
              />
              <div className={`absolute bottom-6 right-8 text-[10px] font-black uppercase tracking-widest ${formData.instructions.length > 450 ? 'text-red-500' : 'text-gray-300'}`}>
                {formData.instructions.length}/500
              </div>
              {errors.instructions && (
                <p className="mt-2 text-[10px] font-black text-red-600 uppercase tracking-widest ml-4">
                  {errors.instructions}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Summary */}
        <div className="pt-10 border-t flex flex-col sm:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-6">
            <div className={`p-8 rounded-[2.5rem] shadow-inner transition-all duration-300 min-w-[200px] border border-transparent ${isCalculating ? 'bg-gray-100 animate-pulse' : 'bg-gray-50 border-gray-100'}`}>
              <span className="block text-[10px] text-gray-400 font-black uppercase mb-2 tracking-[0.2em]">Delivery Fee</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-black tracking-tighter transition-all ${isCalculating ? 'text-gray-300' : 'text-gray-900'}`}>
                  {isCalculating ? '--' : formatCurrency(finalPrice)}
                </span>
                {distance > 0 && !isCalculating && (
                  <span className="text-[10px] font-black text-red-600 bg-red-50 px-3 py-1 rounded-full uppercase tracking-widest">
                    {distance} km
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="w-full sm:w-auto flex flex-col items-center sm:items-end gap-3">
            {Object.keys(errors).length > 0 && (
              <span className="text-[10px] font-black text-red-600 uppercase tracking-widest animate-pulse">Please fix errors to proceed</span>
            )}
            <button 
              type="submit"
              disabled={isCalculating}
              className="w-full sm:w-auto bg-red-600 text-white font-black px-20 py-7 rounded-[2.5rem] shadow-2xl shadow-red-600/30 hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50 text-xl tracking-tight group"
            >
              {isCalculating ? (
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="uppercase tracking-widest text-xs">Calculating...</span>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <span>Confirm Order</span>
                  <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              )}
            </button>
          </div>
        </div>
      </form>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.25s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default CreateRequestForm;
