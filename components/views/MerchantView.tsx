
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../types';
import { formatCurrency } from '../../services/pricing';
import MenuManager from '../merchant/MenuManager';

const MerchantView: React.FC<{ user: User }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'MENU'>('ORDERS');
  const [orders, setOrders] = useState([
    { id: 'ORD-4829', runner: 'Simba R.', items: 12, status: 'Ready', price: 45.50 },
    { id: 'ORD-4911', runner: 'John D.', items: 2, status: 'Preparing', price: 12.00 },
    { id: 'ORD-5012', runner: 'Sarah K.', items: 5, status: 'Ready', price: 28.50 }
  ]);

  // Incoming Order Simulation
  const [incomingOrder, setIncomingOrder] = useState<any | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play "New Order" chime
  const playAlertSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // High A
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn("Audio feedback blocked or unavailable");
    }
  };

  useEffect(() => {
    // Simulate a new order arriving after 5 seconds for demonstration
    const timer = setTimeout(() => {
      setIncomingOrder({
        id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        items: ['2x Mazoe 2L', '1x Red Seal Flour 2kg', '1x Zimgold 2L'],
        total: 15.40,
        distance: '1.2km away'
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (incomingOrder) {
      const interval = setInterval(playAlertSound, 2000);
      return () => clearInterval(interval);
    }
  }, [incomingOrder]);

  const handleAcceptOrder = () => {
    if (incomingOrder) {
      setOrders([{ 
        id: incomingOrder.id, 
        runner: 'Assigning...', 
        items: incomingOrder.items.length, 
        status: 'Preparing', 
        price: incomingOrder.total 
      }, ...orders]);
      setIncomingOrder(null);
    }
  };

  const handleVerify = (id: string) => {
    alert(`Runner identity verified for ${id}. Handover complete.`);
    setOrders(orders.filter(o => o.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Incoming Order Pulse Overlay */}
      {incomingOrder && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-red-600/95 backdrop-blur-xl animate-in zoom-in-95 duration-300">
           <div className="w-full max-w-lg bg-white rounded-[4rem] shadow-[0_64px_96px_-24px_rgba(0,0,0,0.5)] overflow-hidden animate-pulse-gentle">
              <div className="bg-gray-900 p-12 text-center text-white relative overflow-hidden">
                 <div className="relative z-10">
                    <span className="inline-block bg-red-600 px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-6 animate-bounce">New Incoming Order</span>
                    <h2 className="text-6xl font-black tracking-tighter mb-2">{formatCurrency(incomingOrder.total)}</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">{incomingOrder.id}</p>
                 </div>
                 <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.2)_0%,transparent_70%)]" />
              </div>
              <div className="p-12 space-y-10">
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2">Order Manifest</h4>
                    <div className="space-y-2">
                       {incomingOrder.items.map((item: string, i: number) => (
                         <div key={i} className="flex justify-between items-center">
                            <span className="font-bold text-gray-800">{item}</span>
                            <span className="w-2 h-2 bg-red-500 rounded-full" />
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <button 
                      onClick={() => setIncomingOrder(null)}
                      className="flex-1 py-6 rounded-[2rem] text-sm font-black text-gray-400 hover:bg-gray-50 transition-all uppercase tracking-widest"
                    >
                      Decline
                    </button>
                    <button 
                      onClick={handleAcceptOrder}
                      className="flex-[2] bg-red-600 text-white py-6 rounded-[2rem] text-xl font-black shadow-2xl shadow-red-600/30 hover:bg-red-700 active:scale-95 transition-all uppercase tracking-tight"
                    >
                      Accept Order
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Merchant Profile Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-4 sm:space-y-0 relative overflow-hidden group">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">OK Mart Avondale</h2>
          <p className="text-sm text-gray-500 font-medium">Official Merchant Portal • Partner #OK-8292</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right">
             <span className="block text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Store Status</span>
             <span className="text-green-600 font-black text-xs bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">Accepting Orders</span>
          </div>
          <div className="w-14 h-14 bg-green-100 rounded-[1.5rem] flex items-center justify-center shadow-inner">
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-red-600/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Navigation Switcher */}
      <div className="flex bg-white p-1.5 rounded-[1.5rem] shadow-sm border w-full sm:w-fit">
        <button 
          onClick={() => setActiveTab('ORDERS')}
          className={`flex-1 sm:px-10 py-3 text-sm font-black rounded-xl transition-all ${activeTab === 'ORDERS' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Active Orders
        </button>
        <button 
          onClick={() => setActiveTab('MENU')}
          className={`flex-1 sm:px-10 py-3 text-sm font-black rounded-xl transition-all ${activeTab === 'MENU' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Menu Manager
        </button>
      </div>

      {activeTab === 'ORDERS' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-10 rounded-[2.5rem] border shadow-sm">
               <div className="flex justify-between items-center mb-10">
                 <h3 className="font-black text-2xl text-gray-900 tracking-tight">Pending Pickups</h3>
                 <span className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em]">{orders.length} ACTIVE DISPATCHES</span>
               </div>
               <div className="space-y-6">
                 {orders.map(ord => (
                   <div key={ord.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-8 border border-gray-50 rounded-[2rem] hover:bg-gray-50/50 transition-all group gap-6">
                     <div className="flex items-center space-x-6">
                       <div className="w-16 h-16 bg-red-50 text-red-600 rounded-[1.5rem] flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-110 transition-transform">
                          #{ord.id.split('-')[1]}
                       </div>
                       <div>
                         <p className="font-black text-lg text-gray-900 tracking-tight">Runner: {ord.runner}</p>
                         <div className="flex items-center space-x-2 mt-1">
                           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{ord.items} items</span>
                           <span className="w-1 h-1 bg-gray-200 rounded-full" />
                           <span className={`text-[10px] font-black uppercase tracking-widest ${ord.status === 'Ready' ? 'text-green-600' : 'text-amber-500'}`}>{ord.status}</span>
                         </div>
                       </div>
                     </div>
                     <button 
                      onClick={() => handleVerify(ord.id)}
                      className="w-full sm:w-auto bg-black text-white text-xs font-black px-8 py-4 rounded-2xl hover:bg-red-600 transition-all shadow-xl active:scale-95 uppercase tracking-widest"
                     >
                       {ord.status === 'Ready' ? 'Verify Runner' : 'Preparing Order'}
                     </button>
                   </div>
                 ))}
                 {orders.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
                      <p className="text-gray-400 font-black uppercase text-xs tracking-widest">All orders fulfilled for now</p>
                    </div>
                 )}
               </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-950 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <h4 className="font-black text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-8">Financial Overview</h4>
              <div className="space-y-8 relative z-10">
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-gray-400 text-xs font-bold tracking-tight">Total Sales</span>
                    <span className="font-black text-2xl text-green-400">$3,450.20</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden shadow-inner">
                    <div className="bg-green-400 h-full w-[70%]" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-white/5 rounded-[1.5rem] border border-white/5 text-center">
                     <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Orders</p>
                     <p className="text-2xl font-black">142</p>
                  </div>
                  <div className="p-5 bg-white/5 rounded-[1.5rem] border border-white/5 text-center">
                     <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Rating</p>
                     <p className="text-2xl font-black">4.9★</p>
                  </div>
                </div>
                
                <button className="w-full bg-red-600 hover:bg-red-700 py-5 rounded-[1.5rem] font-black text-sm transition-all shadow-2xl shadow-red-600/20 active:scale-95">
                  Request Payout
                </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl group-hover:bg-red-600/10 transition-all" />
            </div>
            
            <div className="bg-white p-10 rounded-[2.5rem] border shadow-sm">
               <h4 className="font-black text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-8 border-b pb-4">Trending Purchases</h4>
               <div className="space-y-6">
                 {['Mazoe Orange Crush', 'Zimgold 2L', 'Red Seal Flour'].map((item, i) => (
                   <div key={i} className="flex justify-between items-center group cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-xl transition-all">
                     <span className="text-sm text-gray-900 font-bold group-hover:text-red-600 transition-colors">{item}</span>
                     <span className="text-[10px] font-black bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">{45 - (i*10)} SOLD</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      ) : (
        <MenuManager />
      )}

      <style>{`
        @keyframes pulse-gentle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default MerchantView;
