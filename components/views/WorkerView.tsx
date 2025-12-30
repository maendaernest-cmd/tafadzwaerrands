
import React, { useState } from 'react';
import { User, ErrandStatus } from '../../types.ts';
import Map from '../common/Map.tsx';
import ProofOfWork from '../worker/ProofOfWork.tsx';
import ChatRoom from '../common/ChatRoom.tsx';
import { scanReceiptOCR } from '../../services/gemini.ts';
import { formatCurrency } from '../../services/pricing.ts';

const MOCK_JOBS = [
  { id: '1', type: 'Grocery', fee: 12.50, dist: '2.5km', store: 'TM Pick n Pay Bond St', items: 12, budget: 60 },
  { id: '2', type: 'Medicine', fee: 15.00, dist: '4.1km', store: 'Greenwood Pharmacy', items: 2, budget: 20 },
  { id: '3', type: 'Document', fee: 8.00, dist: '1.2km', store: 'Harare Registry', items: 1, budget: 5 },
  { id: '4', type: 'Hardware', fee: 22.00, dist: '7.8km', store: 'Halsteds Msasa', items: 5, budget: 150 }
];

const WorkerView: React.FC<{ user: User }> = ({ user }) => {
  const [activeJob, setActiveJob] = useState<any | null>(null);
  const [showChat, setShowChat] = useState<boolean>(false);
  const [scanning, setScanning] = useState(false);
  const [earnings, setEarnings] = useState(65.50);

  const handleAcceptJob = (job: any) => {
    setActiveJob(job);
  };

  const handleProofUpload = async (img: string) => {
    setScanning(true);
    const base64Data = img.split(',')[1];
    const result = await scanReceiptOCR(base64Data);
    if (result) {
      alert(`Scan Success! Found total: ${formatCurrency(result.total)}`);
    }
    setScanning(false);
    setActiveJob(null);
    setEarnings(prev => prev + 12.50);
  };

  if (showChat) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <ChatRoom user={user} errandId="ORD-4829" onClose={() => setShowChat(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-6">
          <section className="bg-white p-8 rounded-[2.5rem] border shadow-xl text-center">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-4 border-4 border-white shadow-inner">L4</div>
            <h3 className="font-black text-xl text-gray-900 tracking-tight">Elite Runner</h3>
            <p className="text-xs text-gray-500 font-bold mb-6">98% On-Time Completion</p>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden shadow-inner">
              <div className="bg-red-600 h-full w-[85%]" />
            </div>
          </section>

          <section className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
             <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Today's Earnings</p>
             <h4 className="text-3xl font-black mb-8">{formatCurrency(earnings)}</h4>
             <button className="w-full bg-white/10 hover:bg-white/20 text-xs font-black py-3 rounded-xl transition-all border border-white/10 uppercase tracking-widest">View Details</button>
             <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full -mr-12 -mt-12 blur-2xl" />
          </section>
        </div>

        <div className="md:col-span-3">
          {!activeJob ? (
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-[2rem] border-2 border-gray-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  <span className="font-black text-sm text-gray-700 uppercase tracking-tight">Searching for Errands in Harare...</span>
                </div>
              </div>

              <Map className="h-[400px] rounded-[2.5rem] shadow-lg border-4 border-white" pins={MOCK_JOBS.map((j, i) => ({ lat: 20 + (i*15), lng: 20 + (i*15), type: 'ERRAND' as const }))} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {MOCK_JOBS.map(job => (
                   <div key={job.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer group">
                     <div className="flex items-center space-x-5">
                       <div className="bg-red-50 p-4 rounded-2xl text-2xl group-hover:bg-red-100 transition-colors">
                        {job.type === 'Grocery' ? '🛒' : job.type === 'Medicine' ? '💊' : '🔧'}
                       </div>
                       <div>
                         <h5 className="font-black text-gray-900 text-lg tracking-tight">{job.type} Errand</h5>
                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{job.store} • {job.dist}</p>
                       </div>
                     </div>
                     <button onClick={() => handleAcceptJob(job)} className="bg-black text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-red-600 transition-all shadow-xl active:scale-95">Accept</button>
                   </div>
                 ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
               <div className="bg-red-600 p-8 text-white flex justify-between items-center">
                 <div>
                    <h3 className="font-black text-2xl tracking-tighter">Active Job: {activeJob.type}</h3>
                    <p className="text-red-100 text-xs font-bold uppercase tracking-widest mt-1">ORD #{activeJob.id} • Assigned to Simba</p>
                 </div>
                 <span className="bg-white/20 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/30">In Progress</span>
               </div>
               
               <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <div className="space-y-8">
                   <div className="p-6 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 relative overflow-hidden">
                     <h4 className="font-black text-[10px] text-gray-400 uppercase tracking-widest mb-4">Client Request</h4>
                     <p className="text-lg font-bold text-gray-800 leading-tight">"Please buy 2kg White Sugar, 1 Loaf of Bread, and 5L Pure Cooking Oil."</p>
                     <div className="absolute top-0 right-0 w-16 h-16 bg-red-600/5 rounded-full -mr-8 -mt-8" />
                   </div>
                   
                   <div className="space-y-4">
                     <h4 className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Proof of Work (Mandatory)</h4>
                     <ProofOfWork onUpload={handleProofUpload} />
                     {scanning && <div className="p-5 bg-red-50 text-red-600 rounded-2xl font-black text-xs text-center animate-pulse border border-red-100 uppercase tracking-widest">Scanning Receipt OCR...</div>}
                   </div>
                 </div>

                 <div className="space-y-8">
                   <div className="space-y-4">
                     <h4 className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Navigation</h4>
                     <Map className="h-64 rounded-3xl" pins={[{ lat: 50, lng: 50, type: 'MERCHANT' }]} />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <button className="bg-black text-white py-5 rounded-2xl font-black text-sm shadow-xl hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center space-x-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                        <span>Navigate</span>
                     </button>
                     <button 
                       onClick={() => setShowChat(true)}
                       className="bg-white text-gray-900 py-5 rounded-2xl font-black text-sm border-2 border-gray-100 shadow-xl hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center space-x-3"
                     >
                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" /></svg>
                        <span>Open Chat</span>
                     </button>
                   </div>
                   <button disabled={scanning} onClick={() => alert('Finish job and upload proof first!')} className="w-full bg-green-600 text-white py-6 rounded-3xl font-black text-lg shadow-2xl shadow-green-600/30 hover:bg-green-700 disabled:opacity-50 transition-all uppercase tracking-tight">Complete Errand</button>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerView;
