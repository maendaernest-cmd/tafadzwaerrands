
import React, { useState } from 'react';
import { User } from '../../types';
import Map, { MapPin } from '../common/Map';
import { formatCurrency } from '../../services/pricing';
import { ADMIN_ANALYTICS, MOCK_USERS, MOCK_ERRANDS } from '../../constants';

const AdminView: React.FC<{ user: User }> = ({ user }) => {
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);

  const handlePinClick = (pin: MapPin) => {
    setSelectedPin(pin);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500 pb-20" onClick={() => setSelectedPin(null)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Volume', value: formatCurrency(ADMIN_ANALYTICS.totalVolume), color: 'text-green-600' },
          { label: 'Active Errands', value: ADMIN_ANALYTICS.activeErrands.toString(), color: 'text-red-600' },
          { label: 'Online Runners', value: ADMIN_ANALYTICS.onlineRunners.toString(), color: 'text-blue-600' },
          { label: 'Merchant Partners', value: ADMIN_ANALYTICS.merchantPartners.toString(), color: 'text-purple-600' }
        ].map(stat => (
          <div key={stat.label} className="bg-white p-8 rounded-[2.5rem] border shadow-sm group hover:border-red-500 transition-all">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <div className="flex justify-between items-end">
              <span className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.value}</span>
              <div className="bg-gray-50 p-2 rounded-xl group-hover:bg-red-50 transition-all">
                 <svg className="w-4 h-4 text-gray-300 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <section className="bg-white rounded-[2.5rem] border shadow-xl overflow-hidden relative">
             <div className="p-8 border-b bg-gray-50 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                   <h3 className="font-black text-xl text-gray-900 tracking-tight">Global Logistics God-View</h3>
                   <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                </div>
                <div className="flex space-x-2">
                  <button className="text-[10px] font-black px-4 py-2 bg-red-600 text-white rounded-xl shadow-lg shadow-red-600/20">Harare</button>
                  <button className="text-[10px] font-black px-4 py-2 bg-white text-gray-400 border rounded-xl hover:bg-gray-50">Bulawayo</button>
                </div>
             </div>
             <div className="relative h-[600px]">
                <Map 
                  className="h-full w-full" 
                  onPinClick={handlePinClick}
                  selectedPinId={selectedPin?.id}
                  pins={[
                    { id: 'simba', lat: 20, lng: 30, type: 'WORKER', label: 'Runner Simba' },
                    { id: 'blessing', lat: 80, lng: 70, type: 'WORKER', label: 'Runner Blessing' },
                    { id: 'grocery-1', lat: 40, lng: 50, type: 'ERRAND', label: 'Urgent Grocery Delivery' },
                    { id: 'spar-1', lat: 15, lng: 85, type: 'MERCHANT', label: 'SPAR Borrowdale' },
                    { id: 'tendai', lat: 65, lng: 25, type: 'WORKER', label: 'Runner Tendai' },
                    { id: 'docs-1', lat: 30, lng: 60, type: 'ERRAND', label: 'Document Pick-up' },
                    { id: 'john', lat: 45, lng: 45, type: 'WORKER', label: 'Runner John' },
                    { id: 'pharma-1', lat: 70, lng: 15, type: 'ERRAND', label: 'Pharmacy Run' },
                    { id: 'okmart-1', lat: 10, lng: 10, type: 'MERCHANT', label: 'OK Mart Avondale' },
                    { id: 'sarah', lat: 90, lng: 90, type: 'WORKER', label: 'Runner Sarah' },
                    // More Density
                    { id: 'w-extra-1', lat: 33, lng: 44, type: 'WORKER', label: 'Runner Nyasha' },
                    { id: 'w-extra-2', lat: 12, lng: 66, type: 'WORKER', label: 'Runner Farai' },
                    { id: 'e-extra-1', lat: 55, lng: 12, type: 'ERRAND', label: 'Cake Delivery' },
                    { id: 'e-extra-2', lat: 28, lng: 82, type: 'ERRAND', label: 'Hardware Pickup' },
                    { id: 'e-extra-3', lat: 77, lng: 55, type: 'ERRAND', label: 'Fast Food Run' },
                    { id: 'w-extra-3', lat: 88, lng: 22, type: 'WORKER', label: 'Runner Tinashe' },
                    { id: 'm-extra-1', lat: 5, lng: 45, type: 'MERCHANT', label: 'The Cake Hut' },
                    { id: 'm-extra-2', lat: 95, lng: 35, type: 'MERCHANT', label: 'Greenwood Pharma' },
                  ]} 
                />

                {/* Admin Quick Action Card */}
                {selectedPin && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-white/95 backdrop-blur-2xl p-8 rounded-[3rem] shadow-[0_64px_96px_-24px_rgba(0,0,0,0.3)] border border-white z-[100] animate-in zoom-in-95 duration-300 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="text-center mb-8">
                       <div className={`w-20 h-20 rounded-[2rem] mx-auto flex items-center justify-center text-4xl shadow-inner mb-4 ${selectedPin.type === 'WORKER' ? 'bg-blue-50 text-blue-600' : selectedPin.type === 'ERRAND' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                         {selectedPin.type === 'WORKER' ? '🏃' : selectedPin.type === 'ERRAND' ? '📦' : '🏬'}
                       </div>
                       <h4 className="font-black text-2xl text-gray-900 tracking-tight">{selectedPin.label}</h4>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Status: High Efficiency</p>
                    </div>
                    
                    <div className="space-y-3">
                       <button className="w-full bg-gray-950 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all">Inspect Activity Logs</button>
                       <button className="w-full bg-gray-100 text-gray-900 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all">Ping Device</button>
                       <button onClick={() => setSelectedPin(null)} className="w-full py-3 text-[10px] font-black text-red-600 uppercase tracking-widest">Close Manager</button>
                    </div>
                  </div>
                )}
             </div>
           </section>
        </div>

        <div className="space-y-8">
           <section className="bg-white p-10 rounded-[2.5rem] border shadow-xl">
              <div className="flex justify-between items-center mb-10">
                <h3 className="font-black text-2xl text-gray-900 tracking-tight">Verification</h3>
                <span className="text-[10px] font-black text-red-600 bg-red-50 px-3 py-1 rounded-full uppercase tracking-widest">8 Pending</span>
              </div>
              <div className="space-y-6">
                {[
                  { name: 'Blessing M.', type: 'Worker', city: 'Harare', doc: 'ID + License' },
                  { name: 'SPAR Borrowdale', type: 'Merchant', city: 'Harare', doc: 'Trade License' },
                  { name: 'Tendai G.', type: 'Worker', city: 'Bulawayo', doc: 'ID + Proof Res' },
                ].map((app, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-3xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm ${app.type === 'Worker' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        {app.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-800">{app.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{app.city} • {app.doc}</p>
                      </div>
                    </div>
                    <button className="text-[10px] text-red-600 font-black hover:underline uppercase tracking-widest group-hover:scale-105 transition-transform">Review</button>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-5 border-2 border-dashed border-gray-200 rounded-[1.5rem] text-[10px] font-black text-gray-400 hover:border-red-600 hover:text-red-600 transition-all uppercase tracking-[0.2em]">
                View All Applications
              </button>
           </section>
           
           <section className="bg-gray-950 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <h4 className="font-black text-sm mb-8 uppercase tracking-widest text-gray-500">System Performance</h4>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400">Appwrite DB</span>
                  <span className="text-[10px] font-black text-green-400 uppercase tracking-widest bg-green-400/10 px-2 py-1 rounded-lg">99.9% Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400">Active WebSocket Subs</span>
                  <span className="text-sm font-black">1,242</span>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl" />
           </section>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
