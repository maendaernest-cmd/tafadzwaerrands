
import React, { useState, useEffect } from 'react';
import { User, Errand, ErrandStatus } from '../../types';
import Map, { MapPin } from '../common/Map';
import BudgetGuardian from '../client/BudgetGuardian';
import CreateRequestForm from '../client/CreateRequestForm';
import ChatRoom from '../common/ChatRoom';
import BusinessStorefront from '../client/BusinessStorefront';
import { extractLocationFromSocialLink, searchNearbyPlaces } from '../../services/gemini';
import { calculateDeliveryPrice, formatCurrency } from '../../services/pricing';

import { MOCK_USERS, MOCK_ERRANDS } from '../../constants';

// Create businesses from merchant users
const MOCK_BUSINESSES = MOCK_USERS
  .filter(user => user.role === 'MERCHANT')
  .map((merchant, index) => ({
    name: merchant.name,
    img: merchant.avatar,
    cat: index === 0 ? 'Grocery' : index === 1 ? 'Grocery' : 'Pharmacy',
    rating: 4.6 + Math.random() * 0.4 // Random rating between 4.6-5.0
  }));

const ClientView: React.FC<{ user: User, errands: Errand[], onCreateErrand: (errand: Errand) => void, activeTab: 'DISCOVER' | 'TRACKING' | 'CREATE' | 'SHOP', onTabChange: (tab: 'DISCOVER' | 'TRACKING' | 'CREATE' | 'SHOP') => void }> = ({ user, errands, onCreateErrand, activeTab, onTabChange }) => {
  const [tiktokLink, setTiktokLink] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);
  const [showFloatingChat, setShowFloatingChat] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);

  // Maps Grounding State
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [mapResults, setMapResults] = useState<{ text: string, mapLinks: { uri: string, title: string }[] } | null>(null);
  const [isMapSearching, setIsMapSearching] = useState(false);

  // Simulated live movement for tracking demo
  const [workerPos, setWorkerPos] = useState({ lat: 30, lng: 35 });
  
  useEffect(() => {
    if (activeTab === 'TRACKING') {
      const interval = setInterval(() => {
        setWorkerPos(prev => ({
          lat: prev.lat + (Math.random() - 0.5) * 0.8,
          lng: prev.lng + (Math.random() - 0.5) * 0.8
        }));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const handleLinkProcess = async () => {
    if (!tiktokLink) return;
    setExtracting(true);
    const result = await extractLocationFromSocialLink(tiktokLink);
    if (result) {
      alert(`AI Extraction Success! Found: ${result.storeName}`);
      setEstimatedPrice(calculateDeliveryPrice(8));
    }
    setExtracting(false);
  };

  const handleMapSearch = async () => {
    if (!mapSearchQuery.trim()) return;
    setIsMapSearching(true);
    
    // Get geolocation for better grounding accuracy
    let latLng = undefined;
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      latLng = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    } catch (e) {
      console.warn("Geolocation denied or unavailable for Maps Grounding.");
    }

    const result = await searchNearbyPlaces(mapSearchQuery, latLng);
    setMapResults(result);
    setIsMapSearching(false);
  };

  const handleCreateSubmit = (data: any) => {
    const newErrand: Errand = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: user.id,
      status: ErrandStatus.PENDING,
      pickup: data.pickup,
      destination: data.destination,
      budget: data.budget,
      currentSpend: 0,
      distance: data.distance,
      items: data.instructions.split(',').map((s: string) => s.trim()),
      proofPhotos: []
    };
    onCreateErrand(newErrand);
    onTabChange('TRACKING');
  };

  const handlePinClick = (pin: MapPin) => {
    setSelectedPin(pin);
  };

  return (
    <div className="relative min-h-[calc(100vh-6rem)] animate-in fade-in duration-700 pb-24" onClick={() => setSelectedPin(null)}>
      {/* Immersive Navigation Bar */}
      {activeTab !== 'CREATE' && activeTab !== 'SHOP' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 pt-6">
          <div className="flex bg-white/80 backdrop-blur-md p-1.5 rounded-[2rem] shadow-sm border w-fit">
            <button
              onClick={() => onTabChange('DISCOVER')}
              className={`px-10 py-3 rounded-[1.5rem] text-sm font-black transition-all ${activeTab === 'DISCOVER' ? 'bg-red-600 text-white shadow-xl shadow-red-600/20 scale-105' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Explore
            </button>
            <button
              onClick={() => onTabChange('TRACKING')}
              className={`px-10 py-3 rounded-[1.5rem] text-sm font-black transition-all ${activeTab === 'TRACKING' ? 'bg-red-600 text-white shadow-xl shadow-red-600/20 scale-105' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Live Tracking
              <span className="ml-2 w-2 h-2 bg-green-500 rounded-full inline-block animate-pulse" />
            </button>
          </div>
        </div>
      )}

      {/* DISCOVER VIEW */}
      {activeTab === 'DISCOVER' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            {/* Quick Actions / Categories */}
            <section className="flex space-x-6 overflow-x-auto no-scrollbar py-2">
              {[
                { id: 'groceries', name: 'Groceries', icon: '🛒', color: 'bg-orange-50 text-orange-600' },
                { id: 'pharmacy', name: 'Pharmacy', icon: '💊', color: 'bg-green-50 text-green-600' },
                { id: 'fastfood', name: 'Food', icon: '🍔', color: 'bg-red-50 text-red-600' },
                { id: 'parcel', name: 'Parcel', icon: '📦', color: 'bg-blue-50 text-blue-600' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); onTabChange('CREATE'); }}
                  className="flex flex-col items-center shrink-0 group"
                >
                  <div className={`${cat.color} w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-4xl shadow-sm group-hover:scale-110 group-hover:shadow-lg transition-all mb-3`}>
                    {cat.icon}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-900">{cat.name}</span>
                </button>
              ))}
            </section>

            {/* Maps Grounding Search */}
            <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 group transition-all hover:border-blue-200">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl shadow-blue-600/20 uppercase tracking-[0.2em]">Maps Grounding™</div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Find real-world locations</h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input 
                  type="text" 
                  placeholder="e.g. Italian restaurants near me or pharmacies in Harare"
                  className="flex-1 bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-2xl px-8 py-5 text-sm font-bold focus:bg-white transition-all outline-none"
                  value={mapSearchQuery}
                  onChange={(e) => setMapSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleMapSearch()}
                  onClick={(e) => e.stopPropagation()}
                />
                <button 
                  onClick={(e) => { e.stopPropagation(); handleMapSearch(); }}
                  disabled={isMapSearching}
                  className="bg-gray-900 text-white font-black px-12 py-5 rounded-2xl hover:bg-blue-600 transition-all disabled:opacity-50 active:scale-95 shadow-xl"
                >
                  {isMapSearching ? 'Searching...' : 'Explore Maps'}
                </button>
              </div>

              {mapResults && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500 p-6 bg-blue-50 rounded-[2rem] border border-blue-100">
                  <p className="text-sm font-medium text-gray-700 leading-relaxed mb-4">{mapResults.text}</p>
                  {mapResults.mapLinks.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {mapResults.mapLinks.map((link, i) => (
                        <a 
                          key={i} 
                          href={link.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-white border border-blue-200 text-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                          📍 {link.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* AI Social Input */}
            <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 group transition-all hover:border-red-200">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl shadow-red-600/20 uppercase tracking-[0.2em]">Albo Smart™</div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Seen something on TikTok?</h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="Paste video link here..."
                  className="flex-1 bg-gray-50 border-2 border-transparent focus:border-red-600 rounded-2xl px-8 py-5 text-sm font-bold focus:bg-white transition-all outline-none"
                  value={tiktokLink}
                  onChange={(e) => setTiktokLink(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <button 
                  onClick={(e) => { e.stopPropagation(); handleLinkProcess(); }}
                  disabled={extracting}
                  className="bg-black text-white font-black px-12 py-5 rounded-2xl hover:bg-red-600 transition-all disabled:opacity-50 active:scale-95 shadow-xl"
                >
                  {extracting ? 'Analysing...' : 'Find Shop'}
                </button>
              </div>
            </section>

            {/* Trending Shops */}
            <section className="space-y-8">
              <div className="flex justify-between items-end">
                <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Nearby Merchant Partners</h3>
                <button className="text-red-600 font-black text-xs uppercase tracking-widest hover:underline">See All</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {MOCK_BUSINESSES.map((biz) => (
                  <div
                    key={biz.name}
                    onClick={() => { setSelectedBusiness(biz.name); onTabChange('SHOP'); }}
                    className="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer group"
                  >
                    <div className="h-56 overflow-hidden relative">
                      <img src={biz.img} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" alt={biz.name} />
                      <div className="absolute top-6 left-6">
                        <span className="bg-white/95 backdrop-blur px-4 py-2 rounded-full text-[10px] font-black text-red-600 shadow-2xl uppercase tracking-widest">{biz.cat}</span>
                      </div>
                      <div className="absolute bottom-6 right-6">
                         <div className="bg-black/80 backdrop-blur-xl text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-2xl">
                           <span className="text-amber-500 font-black text-sm">★</span>
                           <span className="text-xs font-black">{biz.rating}</span>
                         </div>
                      </div>
                    </div>
                    <div className="p-8">
                      <h4 className="font-black text-xl text-gray-900 mb-1">{biz.name}</h4>
                      <p className="text-sm text-gray-500 font-medium tracking-tight">Partnered • 2.4km away • Fast Delivery</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Side Info */}
          <div className="space-y-8">
            <section className="bg-white rounded-[3rem] border shadow-sm p-3 overflow-hidden relative">
              <div className="flex items-center justify-between px-6 py-4">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Heatmap</span>
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Active Now</span>
                 </div>
              </div>
              <Map 
                className="h-80 rounded-[2.5rem]" 
                onPinClick={handlePinClick}
                selectedPinId={selectedPin?.id}
                pins={[
                  { id: 'simba-1', lat: 40, lng: 50, type: 'WORKER', label: 'Simba Muridzi', sublabel: 'Elite Runner • Active' }, 
                  { id: 'okmart-1', lat: 20, lng: 70, type: 'MERCHANT', label: 'OK Mart Avondale', sublabel: 'Verified Partner • Open' },
                  // Added More Density
                  { id: 'e-1', lat: 55, lng: 30, type: 'ERRAND', label: 'Pharmacy Delivery', sublabel: 'ASAP • $15 Budget' },
                  { id: 'e-2', lat: 15, lng: 45, type: 'ERRAND', label: 'Parcel Dispatch', sublabel: 'Pending Agent' },
                  { id: 'w-2', lat: 75, lng: 15, type: 'WORKER', label: 'Runner Tendai', sublabel: 'Pro Runner' },
                ]} 
              />
              
              {/* Contextual Pin Detail Card */}
              {selectedPin && (
                <div className="absolute bottom-10 left-10 right-10 bg-white/95 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border border-white animate-in slide-in-from-bottom-8 duration-500 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${selectedPin.type === 'WORKER' ? 'bg-blue-50 text-blue-600' : selectedPin.type === 'ERRAND' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                        {selectedPin.type === 'WORKER' ? '🏃' : selectedPin.type === 'ERRAND' ? '📦' : '🏬'}
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 leading-none">{selectedPin.label}</h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{selectedPin.sublabel}</p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedPin(null)} className="text-gray-300 hover:text-gray-900 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {selectedPin.type === 'MERCHANT' ? (
                      <button
                        onClick={() => { setSelectedBusiness(selectedPin.label!); onTabChange('SHOP'); }}
                        className="flex-1 bg-red-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all"
                      >
                        View Storefront
                      </button>
                    ) : (
                      <button className="flex-1 bg-black text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all">
                        {selectedPin.type === 'WORKER' ? 'Ping Runner' : 'Accept Job'}
                      </button>
                    )}
                    <button className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Direction</button>
                  </div>
                </div>
              )}
            </section>
            
            <section className="bg-gray-950 text-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h4 className="font-black text-2xl mb-1 tracking-tight">Safe Wallet</h4>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Diaspora-Linked Account</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl">
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>
                  </div>
                </div>
                <div className="text-5xl font-black mb-10 tracking-tighter">{formatCurrency(user.walletBalance)}</div>
                <div className="flex gap-4">
                  <button className="flex-1 bg-red-600 py-4 rounded-2xl font-black text-sm hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-95">Add Funds</button>
                  <button className="flex-1 bg-white/10 border border-white/5 py-4 rounded-2xl font-black text-sm hover:bg-white/20 transition-all active:scale-95">Statement</button>
                </div>
              </div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-red-600/10 rounded-full blur-[100px] group-hover:bg-red-600/20 transition-all duration-1000" />
            </section>

            <section className="bg-white p-8 rounded-[3rem] border shadow-sm border-dashed border-gray-200">
               <h5 className="font-black text-xs text-gray-400 uppercase tracking-widest mb-4">Latest Service News</h5>
               <p className="text-sm font-bold text-gray-700 leading-relaxed">Harare Central Hub is now processing 20% more errands. Inter-city routes to Bulawayo are open!</p>
            </section>
          </div>
        </div>
      )}

      {/* TRACKING VIEW - LIVE COMMAND CENTER */}
      {activeTab === 'TRACKING' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 animate-in slide-in-from-right-12 duration-1000">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10">
            {/* Main Column: Map & Primary Status */}
            <div className="lg:col-span-8 space-y-10">
              <section className="relative bg-white rounded-[4rem] border-[10px] border-white shadow-2xl overflow-hidden h-[500px] sm:h-[650px] group" onClick={() => setSelectedPin(null)}>
                {/* HUD Top: Agent Info & ETA Overlay */}
                <div className="absolute top-10 left-10 right-10 z-20 flex flex-col md:flex-row justify-between items-start gap-6 pointer-events-none">
                  <div className="pointer-events-auto bg-white/95 backdrop-blur-2xl p-6 rounded-[3rem] border border-white shadow-2xl flex items-center gap-6 animate-in slide-in-from-top-12 duration-700">
                    <div className="relative">
                      <img src="https://picsum.photos/seed/runner/100/100" className="w-16 h-16 rounded-[2rem] border-4 border-white shadow-2xl" alt="Runner" />
                      <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-[3px] border-white animate-pulse shadow-xl" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-xl tracking-tight leading-none">Simba Muridzi</h3>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] font-black bg-red-600 text-white px-3 py-1 rounded-full uppercase tracking-[0.1em] shadow-lg shadow-red-600/20">Elite Agent</span>
                        <div className="flex items-center gap-1.5">
                           <span className="text-amber-500 text-sm font-black">★</span>
                           <span className="text-xs font-black text-gray-500">4.9 (240+)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pointer-events-auto bg-gray-950 text-white p-8 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center px-12 animate-in slide-in-from-top-12 duration-700 delay-150 border border-white/5">
                    <span className="text-[11px] font-black text-red-500 uppercase tracking-[0.3em] mb-2">ETA Arrival</span>
                    <span className="text-4xl font-black tracking-tighter tabular-nums">12:45<span className="text-sm font-bold text-gray-500 ml-1.5">PM</span></span>
                    <div className="mt-2 flex items-center gap-2.5">
                       <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Sync</span>
                    </div>
                  </div>
                </div>

                {/* HUD Bottom: Detailed Step Tracker */}
                <div className="absolute bottom-10 left-10 right-10 z-20 pointer-events-none animate-in slide-in-from-bottom-12 duration-700">
                  <div className="pointer-events-auto bg-white/95 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)]">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                           <div className="w-3.5 h-3.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
                           <span className="text-[11px] font-black text-red-600 uppercase tracking-[0.4em]">Current Phase</span>
                        </div>
                        <h4 className="font-black text-3xl text-gray-900 tracking-tighter leading-none">Completing Shopping List</h4>
                        <p className="text-sm text-gray-400 font-bold mt-2">Checking OK Mart shelves in Avondale...</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1.5">Distance Remaining</span>
                        <span className="text-2xl font-black text-gray-900 tracking-tight tabular-nums">3.2 <span className="text-sm font-black text-gray-400 uppercase">km</span></span>
                      </div>
                    </div>
                    <div className="flex gap-4 sm:gap-6">
                      {[
                        { label: 'Ordered', done: true },
                        { label: 'Merchant', done: true },
                        { label: 'Shopping', active: true },
                        { label: 'En-Route' },
                        { label: 'Arrived' }
                      ].map((step, i) => (
                        <div key={i} className="flex-1 space-y-4">
                          <div className={`h-3 rounded-full relative transition-all duration-1000 shadow-inner ${step.done ? 'bg-green-500' : step.active ? 'bg-red-600' : 'bg-gray-100'}`}>
                             {step.active && <div className="absolute inset-0 bg-red-600 animate-ping opacity-25 rounded-full" />}
                          </div>
                          <span className={`block text-center text-[10px] font-black uppercase tracking-tighter ${step.done || step.active ? 'text-gray-900' : 'text-gray-300'}`}>{step.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Map
                  className="h-full w-full grayscale contrast-125"
                  onPinClick={handlePinClick}
                  selectedPinId={selectedPin?.id}
                  showRoute={true}
                  routeStart={{ lat: 60, lng: 60, type: 'MERCHANT', label: 'OK Mart Avondale' }}
                  routeEnd={{ lat: 30, lng: 80, type: 'ERRAND', label: 'Delivery Location' }}
                  pins={[
                    { id: 'worker-live', ...workerPos, type: 'WORKER', label: 'Simba (On Duty)' },
                    { id: 'okmart-pickup', lat: 60, lng: 60, type: 'MERCHANT', label: 'OK Mart Pick-up' },
                    { id: 'delivery-dest', lat: 30, lng: 80, type: 'ERRAND', label: 'Delivery Location' }
                  ]}
                />
              </section>

              {/* Errand Data Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <section className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-10 group">
                  <div className="flex justify-between items-center border-b pb-8">
                     <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.3em]">Manifest Summary</h4>
                     <button className="text-red-600 text-[11px] font-black uppercase tracking-widest hover:underline px-4 py-2 bg-red-50 rounded-xl transition-all">Modify</button>
                  </div>
                  <div className="space-y-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-gray-50 flex items-center justify-center shrink-0 shadow-inner text-2xl group-hover:bg-red-50 transition-colors">🛒</div>
                      <div>
                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Shopping List</span>
                        <p className="text-lg font-black text-gray-900 leading-tight">2L Mazoe, 2kg Sugar, 5L Oil, Fresh Bread, 2L Milk.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-gray-50 flex items-center justify-center shrink-0 shadow-inner text-2xl group-hover:bg-red-50 transition-colors">🏠</div>
                      <div>
                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Destination</span>
                        <p className="text-lg font-black text-gray-900 leading-tight">123 Samora Machel Ave, Apartment 4B, Harare.</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="bg-gray-50 p-12 rounded-[3.5rem] border border-gray-100 flex flex-col justify-between group">
                   <div className="space-y-4">
                      <h4 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.3em]">Safety Protocol</h4>
                      <p className="text-sm font-bold text-gray-600 leading-relaxed">Agent Simba is verified. Your funds are held in escrow and will only be released after you confirm the receipt photo.</p>
                   </div>
                   <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mt-10">
                      <div className="flex items-center gap-5 mb-6">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center shadow-inner text-xl">🛡️</div>
                        <span className="text-[11px] font-black text-green-600 uppercase tracking-[0.1em] leading-tight">Atumwa Insurance Active<br/>Coverage up to $100</span>
                      </div>
                      <div className="flex gap-4">
                         <button onClick={() => alert('Support Alerted')} className="flex-1 bg-black text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl active:scale-95">SOS / Support</button>
                         <button onClick={() => alert('Tracking Shared')} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95">Share Path</button>
                      </div>
                   </div>
                </section>
              </div>
            </div>

            {/* Side Column: Budget Guardian & Contextual Sidebar */}
            <div className="lg:col-span-4 space-y-10">
              <div className="sticky top-28 space-y-10">
                {/* Budget Bar Integration */}
                <BudgetGuardian budget={60.00} currentSpend={42.30} />
                
                {/* Visual context of the runner's progress - Receipt Preview placeholder */}
                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl p-8 space-y-6 animate-in slide-in-from-right-8 duration-700 delay-300">
                   <div className="flex justify-between items-center">
                     <h5 className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Live Receipt Proof</h5>
                     <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase">Waiting for Upload</span>
                   </div>
                   <div className="aspect-[4/3] bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-8">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                         <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                      </div>
                      <p className="text-xs font-bold text-gray-400">Agent will snap a photo of the receipt once they reach the checkout.</p>
                   </div>
                </div>

                {/* Loyalty / Nextdoor Style Social Proof */}
                <div className="bg-gradient-to-br from-red-600 to-red-900 p-12 rounded-[3.5rem] text-white shadow-2xl shadow-red-600/30 relative overflow-hidden group">
                   <div className="relative z-10">
                      <span className="text-[11px] font-black bg-white/20 px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/10 mb-6 inline-block">Loyalty Status: Hero-in-Training</span>
                      <h4 className="text-3xl font-black tracking-tighter mb-4 leading-tight">Supporting Avondale Hub</h4>
                      <p className="text-red-100 text-sm font-bold leading-relaxed mb-10 opacity-90">Every errand builds trust in the local network. You're 12.4km away from your next reward!</p>
                      <div className="w-full bg-black/30 h-3.5 rounded-full overflow-hidden mb-8 border border-white/5 shadow-inner">
                         <div className="bg-white h-full w-[45%] transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
                      </div>
                      <button className="w-full bg-white text-red-700 py-5 rounded-[1.5rem] font-black text-base shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">Redeem Hero Points</button>
                   </div>
                   <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:scale-125 transition-transform duration-1000" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Floating Chat Trigger (Modern Bubble) */}
      <div className="fixed bottom-12 right-12 z-[100] flex flex-col items-end gap-6 pointer-events-none">
        {showFloatingChat && (
          <div className="pointer-events-auto w-[22rem] sm:w-[32rem] shadow-[0_64px_96px_-24px_rgba(0,0,0,0.3)] border-[8px] border-white rounded-[4rem] overflow-hidden animate-in slide-in-from-bottom-24 duration-700 scale-100 origin-bottom-right">
             <ChatRoom user={user} errandId="ORD-4829" onClose={() => setShowFloatingChat(false)} />
          </div>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); setShowFloatingChat(!showFloatingChat); }}
          className={`pointer-events-auto w-24 h-24 sm:w-28 sm:h-28 rounded-[3.5rem] flex items-center justify-center shadow-2xl transition-all duration-700 transform ${showFloatingChat ? 'bg-black rotate-90 scale-90' : 'bg-red-600 hover:scale-110 active:scale-95 shadow-red-600/50 hover:rotate-12'}`}
        >
          {showFloatingChat ? (
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <div className="relative">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" /></svg>
              <div className="absolute -top-1.5 -right-1.5 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-2xl">
                <span className="w-5 h-5 bg-red-600 rounded-full animate-ping" />
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Overlays for Creating & Shopping */}
      {activeTab === 'SHOP' && selectedBusiness && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 animate-in fade-in duration-500">
          <BusinessStorefront businessName={selectedBusiness} onBack={() => onTabChange('DISCOVER')} onAddToCart={(p) => alert(`Added ${p.name}`)} />
        </div>
      )}
      {activeTab === 'CREATE' && (
        <div className="pt-10">
          <CreateRequestForm initialCategory={selectedCategory} onCancel={() => onTabChange('DISCOVER')} onSubmit={handleCreateSubmit} />
        </div>
      )}
    </div>
  );
};

export default ClientView;
