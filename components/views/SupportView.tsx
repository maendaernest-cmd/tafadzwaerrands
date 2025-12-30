
import React, { useState } from 'react';
import { User, UserRole, Ticket } from '../../types';
import ChatRoom from '../common/ChatRoom';

const INITIAL_TICKETS: Ticket[] = [
  { 
    $id: 'TIC-102', 
    user_id: 'u44', 
    userName: 'Simba R. (Worker)', 
    category: 'Merchant Issue', 
    priority: 'Urgent', 
    status: 'open', 
    transcript: 'Store Closed unexpectedly at OK Mart Avondale. Runner is stuck at the gate.', 
    time: '5m ago', 
    orderId: 'ORD-4829',
    metadata: {
      device: "Android 13 / Samsung S22",
      location: "Avondale, Harare",
      tags: ["Store-Closed", "Runner-Blocked"],
      lastAction: "GPS Pinged"
    }
  },
  { 
    $id: 'TIC-110', 
    user_id: 'u1', 
    userName: 'Tafadzwa D. (Client)', 
    category: 'Payment', 
    priority: 'Urgent', 
    status: 'open', 
    transcript: 'Double charge reported on Stripe for last wallet top-up. Needs immediate reversal.', 
    time: '8m ago',
    metadata: {
      device: "iOS 17 / iPhone 15 Pro",
      location: "London, UK",
      tags: ["Billing", "Stripe"],
      lastAction: "Payment Log Inspected"
    }
  },
  { 
    $id: 'TIC-115', 
    user_id: 'w2', 
    userName: 'Tendai G. (Worker)', 
    category: 'Safety', 
    priority: 'Urgent', 
    status: 'open', 
    transcript: 'Runner reported a flat tire during delivery. Parcel is safe but ETA is breached.', 
    time: '12m ago',
    orderId: 'ORD-5120',
    metadata: {
      device: "Android 12 / Huawei P30",
      location: "Milton Park, Harare",
      tags: ["Vehicle-Issue", "ETA-Delayed"],
      lastAction: "Incident Logged"
    }
  },
  { 
    $id: 'TIC-105', 
    user_id: 'u1', 
    userName: 'Maria K. (Client)', 
    category: 'Tech Support', 
    priority: 'Low', 
    status: 'pending', 
    transcript: 'Budget guardian not updating live on mobile. Web app seems fine.', 
    time: '25m ago', 
    orderId: 'ORD-4829',
    metadata: {
      device: "Android 14 / Google Pixel 7",
      location: "Pretoria, SA",
      tags: ["UI-Bug", "Budget-Guardian"]
    }
  },
  { 
    $id: 'TIC-108', 
    user_id: 'u88', 
    userName: 'John D. (Worker)', 
    category: 'Safety', 
    priority: 'Medium', 
    status: 'open', 
    transcript: 'Customer not answering door or phone in Avondale. Runner has been waiting for 10 mins.', 
    time: '34m ago', 
    orderId: 'ORD-4955',
    metadata: {
      device: "Android 11 / Redmi Note 10",
      location: "Avondale, Harare",
      tags: ["No-Show", "Delivery-Wait"],
      lastAction: "Client Pinned"
    }
  },
  { 
    $id: 'TIC-122', 
    user_id: 'm1', 
    userName: 'Manager (Merchant)', 
    category: 'Merchant Issue', 
    priority: 'Medium', 
    status: 'pending', 
    transcript: 'Cannot toggle stock for "Huletts Sugar". Inventory sync error.', 
    time: '1h ago',
    metadata: {
      device: "Windows 11 / Chrome 120",
      location: "Chisipite, Harare",
      tags: ["Inventory", "API-Sync"]
    }
  },
];

const SupportView: React.FC<{ user: User }> = ({ user }) => {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isBargedIn, setIsBargedIn] = useState(false);

  const handleIntervene = (id: string) => {
    setActiveChatId(id);
    setIsBargedIn(true);
  };

  const handleChatView = (id: string) => {
    setActiveChatId(id);
    setIsBargedIn(false);
  };

  const resolveTicket = (id: string) => {
    alert(`Ticket ${id} marked as resolved.`);
    setTickets(tickets.filter(t => t.$id !== id));
    if (activeChatId === id) setActiveChatId(null);
  };

  if (activeChatId) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border">
           <div className="p-8 bg-gray-900 text-white flex justify-between items-center">
             <div>
               <h2 className="text-2xl font-black tracking-tight">Support Room: {activeChatId}</h2>
               <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Incident Management Active</p>
             </div>
             <button onClick={() => setActiveChatId(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
           </div>
           <div className="p-8">
              <ChatRoom 
                user={user} 
                errandId={activeChatId} 
                isBargedIn={isBargedIn}
                onClose={() => setActiveChatId(null)} 
              />
              <div className="mt-8 flex justify-center space-x-4">
                <button onClick={() => resolveTicket(activeChatId)} className="bg-green-600 text-white font-black px-12 py-5 rounded-[1.5rem] shadow-xl hover:bg-green-700 transition-all">Close Incident</button>
                {!isBargedIn && (
                  <button onClick={() => setIsBargedIn(true)} className="bg-red-600 text-white font-black px-12 py-5 rounded-[1.5rem] shadow-xl hover:bg-red-700 transition-all">Active Intervention</button>
                )}
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <h2 className="text-5xl font-black text-gray-900 tracking-tighter">Support Pulse</h2>
           <p className="text-gray-500 font-medium text-lg mt-1 max-w-lg">Active mediation hub. Ensuring safety and trust for both Diaspora and local users.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-8 py-4 rounded-3xl border shadow-sm flex items-center gap-4">
            <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
            <span className="font-black text-sm text-gray-900 tracking-tight">{tickets.filter(t => t.priority === 'Urgent').length} URGENT TICKETS</span>
          </div>
          <div className="bg-black text-white px-8 py-4 rounded-3xl shadow-xl flex items-center gap-4">
            <span className="font-black text-sm tracking-tight">{tickets.length} OPEN TOTAL</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <aside className="lg:col-span-1 space-y-8">
           <div className="bg-white p-8 rounded-[3rem] border shadow-sm space-y-3">
             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 px-4">Helpdesk Filter</h4>
             {[
               { id: 'active', label: 'Active Queue', count: tickets.length },
               { id: 'urgent', label: 'Priority Alerts', count: tickets.filter(t => t.priority === 'Urgent').length },
               { id: 'unassigned', label: 'Unassigned', count: 0 },
               { id: 'resolved', label: 'Resolved History', count: 142 },
             ].map((filter, i) => (
               <button key={filter.id} className={`w-full text-left px-6 py-5 rounded-3xl flex justify-between items-center transition-all ${i === 0 ? 'bg-red-600 text-white shadow-2xl shadow-red-600/20 font-black' : 'text-gray-600 hover:bg-gray-50 font-bold'}`}>
                 <span className="text-sm tracking-tight">{filter.label}</span>
                 <span className={`text-[10px] font-black px-3 py-1 rounded-full ${i === 0 ? 'bg-white/20' : 'bg-gray-100'}`}>{filter.count}</span>
               </button>
             ))}
           </div>

           <div className="bg-red-50 p-8 rounded-[3rem] border border-red-100">
             <h5 className="font-black text-red-600 text-xs uppercase tracking-widest mb-2">Support Tip</h5>
             <p className="text-xs text-red-800/70 font-medium leading-relaxed">Urgent safety alerts auto-escalate to Admin if not acknowledged within 5 minutes.</p>
           </div>
        </aside>

        <section className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[3rem] border shadow-sm overflow-hidden">
             <div className="px-10 py-8 bg-gray-50 border-b flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Incident Board</span>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Real-time Updates</span>
                </div>
                <div className="flex gap-2">
                  <div className="bg-white border rounded-xl px-4 py-2 text-[10px] font-black text-gray-400 uppercase">Sort: Newest First</div>
                </div>
             </div>
             
             <div className="divide-y divide-gray-50">
               {tickets.map(ticket => (
                 <div key={ticket.$id} className="p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 hover:bg-gray-50/50 transition-all group">
                    <div className="flex items-start gap-8 flex-1">
                       <div className="relative shrink-0">
                         <img src={`https://picsum.photos/seed/${ticket.user_id}/100/100`} className="w-16 h-16 rounded-[1.5rem] border-2 border-white shadow-md group-hover:scale-110 transition-transform" alt="" />
                         <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${ticket.priority === 'Urgent' ? 'bg-red-600' : 'bg-yellow-500'}`}>
                           <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                         </div>
                       </div>
                       <div className="space-y-3">
                         <div className="flex flex-wrap items-center gap-3">
                           <span className="font-black text-gray-900 text-xl tracking-tight leading-none">{ticket.transcript}</span>
                           <span className={`text-[9px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${
                             ticket.priority === 'Urgent' ? 'bg-red-50 text-red-600 border-red-100 shadow-sm' : 
                             ticket.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                             'bg-gray-50 text-gray-500 border-gray-100'
                           }`}>
                             {ticket.priority}
                           </span>
                           {ticket.orderId && (
                             <span className="bg-black text-white text-[9px] font-black px-3 py-1 rounded-full tracking-widest uppercase">
                               ORD #{ticket.orderId.split('-')[1]}
                             </span>
                           )}
                         </div>
                         
                         {/* Metadata Display */}
                         {ticket.metadata && (
                           <div className="flex flex-wrap gap-2">
                             {ticket.metadata.location && (
                               <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded flex items-center">
                                 📍 {ticket.metadata.location}
                               </span>
                             )}
                             {ticket.metadata.device && (
                               <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded flex items-center">
                                 📱 {ticket.metadata.device}
                               </span>
                             )}
                             {ticket.metadata.tags?.map(tag => (
                               <span key={tag} className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tighter">
                                 #{tag}
                               </span>
                             ))}
                           </div>
                         )}

                         <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <span className="text-gray-900">{ticket.userName}</span>
                            <span className="w-1 h-1 bg-gray-200 rounded-full" />
                            <span>{ticket.category}</span>
                            <span className="w-1 h-1 bg-gray-200 rounded-full" />
                            <span className="text-red-500">{ticket.time}</span>
                         </div>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                       <button 
                         onClick={() => handleChatView(ticket.orderId || ticket.$id)} 
                         className="flex-1 sm:flex-none px-8 py-4 rounded-2xl text-[11px] font-black text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all uppercase tracking-widest active:scale-95"
                       >
                         Monitor
                       </button>
                       <button 
                         onClick={() => handleIntervene(ticket.orderId || ticket.$id)} 
                         className="flex-1 sm:flex-none px-8 py-4 rounded-2xl text-[11px] font-black text-white bg-black hover:bg-red-600 transition-all uppercase tracking-widest shadow-xl shadow-black/10 active:scale-95"
                       >
                         Mediate
                       </button>
                    </div>
                 </div>
               ))}
               {tickets.length === 0 && (
                 <div className="p-32 text-center">
                    <div className="text-6xl mb-6 opacity-20">🛡️</div>
                    <h5 className="text-xl font-black text-gray-300 uppercase tracking-tighter">Everything is running smoothly</h5>
                    <p className="text-sm text-gray-400 font-bold mt-2">All active incidents have been resolved.</p>
                 </div>
               )}
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SupportView;
