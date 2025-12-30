
import React, { useState } from 'react';
import { UserRole, User, Errand, ErrandStatus } from './types';
import Header from './components/common/Header';
import ClientView from './components/views/ClientView';
import WorkerView from './components/views/WorkerView';
import MerchantView from './components/views/MerchantView';
import SupportView from './components/views/SupportView';
import AdminView from './components/views/AdminView';
import LandingPage from './components/auth/LandingPage';
import SignInPage from './components/auth/SignInPage';
import SignUpPage from './components/auth/SignUpPage';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<'landing' | 'signin' | 'signup'>('landing');
  const [errands, setErrands] = useState<Errand[]>([]);
  const [clientActiveTab, setClientActiveTab] = useState<'DISCOVER' | 'TRACKING' | 'CREATE' | 'SHOP'>('DISCOVER');

  const logout = () => {
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  if (!currentUser) {
    if (currentPage === 'landing') {
      return <LandingPage
        onSignIn={() => setCurrentPage('signin')}
        onSignUp={() => setCurrentPage('signup')}
      />;
    }
    if (currentPage === 'signin') {
      return <SignInPage
        onSignIn={setCurrentUser}
        onSwitchToSignUp={() => setCurrentPage('signup')}
      />;
    }
    if (currentPage === 'signup') {
      return <SignUpPage
        onSignUp={setCurrentUser}
        onSwitchToSignIn={() => setCurrentPage('signin')}
      />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 sm:pb-0">
      <Header user={currentUser} onLogout={logout} />
      
      <main className="pt-4 px-2 sm:px-6">
        {currentUser.role === UserRole.CLIENT && <ClientView user={currentUser} errands={errands} onCreateErrand={(errand) => setErrands([...errands, errand])} activeTab={clientActiveTab} onTabChange={setClientActiveTab} />}
        {currentUser.role === UserRole.WORKER && <WorkerView user={currentUser} />}
        {currentUser.role === UserRole.MERCHANT && <MerchantView user={currentUser} />}
        {currentUser.role === UserRole.SUPPORT && <SupportView user={currentUser} />}
        {currentUser.role === UserRole.ADMIN && <AdminView user={currentUser} />}
      </main>

      {/* Mobile Navigation Bar */}
      {currentUser?.role === UserRole.CLIENT && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t sm:hidden flex justify-around py-5 shadow-2xl z-40">
          <button onClick={() => setClientActiveTab('DISCOVER')} className="flex flex-col items-center text-red-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011-1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
            <span className="text-[9px] font-black uppercase mt-1 tracking-widest">Home</span>
          </button>
          <button onClick={() => setClientActiveTab('CREATE')} className="flex flex-col items-center text-gray-300">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
            <span className="text-[9px] font-black uppercase mt-1 tracking-widest">Create</span>
          </button>
          <button onClick={() => setClientActiveTab('TRACKING')} className="flex flex-col items-center text-gray-300">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
            <span className="text-[9px] font-black uppercase mt-1 tracking-widest">Tracking</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
