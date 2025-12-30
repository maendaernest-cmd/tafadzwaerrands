
import React from 'react';
import { formatCurrency } from '../../services/pricing';

interface BudgetGuardianProps {
  budget: number;
  currentSpend: number;
}

const BudgetGuardian: React.FC<BudgetGuardianProps> = ({ budget, currentSpend }) => {
  const percentage = Math.min((currentSpend / budget) * 100, 100);
  
  let colorClass = 'bg-green-500';
  let textColor = 'text-green-700';
  let bgColor = 'bg-green-50';
  let message = 'Securely within budget';
  
  if (percentage >= 90) {
    colorClass = 'bg-red-500';
    textColor = 'text-red-700';
    bgColor = 'bg-red-50';
    message = 'Critical: Budget limit reached';
  } else if (percentage >= 75) {
    colorClass = 'bg-amber-500';
    textColor = 'text-amber-700';
    bgColor = 'bg-amber-50';
    message = 'Warning: Near budget limit';
  }

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Budget Guardian™</h3>
          <p className={`text-xs font-bold ${textColor}`}>{message}</p>
        </div>
        <div className={`p-2 rounded-xl ${bgColor}`}>
          <svg className={`w-5 h-5 ${textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
      </div>
      
      <div className="flex justify-between items-end mb-3">
        <div>
          <span className="text-2xl font-black text-gray-900">{formatCurrency(currentSpend)}</span>
          <span className="text-gray-400 text-sm font-bold ml-1">spent</span>
        </div>
        <div className="text-right">
          <span className="text-gray-400 text-[10px] font-black uppercase block">Limit</span>
          <span className="text-sm font-bold text-gray-700">{formatCurrency(budget)}</span>
        </div>
      </div>
      
      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <div 
          className={`${colorClass} h-full transition-all duration-1000 ease-out rounded-full`} 
          style={{ width: `${percentage}%` }}
        >
          <div className="w-full h-full opacity-30 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[progress_1s_linear_infinite]" />
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { background-position: 0 0; }
          100% { background-position: 20px 0; }
        }
      `}</style>
    </div>
  );
};

export default BudgetGuardian;
