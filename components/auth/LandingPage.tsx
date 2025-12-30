import React from 'react';

interface LandingPageProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSignIn, onSignUp }) => {
  return (
    <div className="min-h-screen bg-red-600 flex flex-col items-center justify-center p-6 text-white text-center selection:bg-white selection:text-red-600">
      <div className="w-28 h-28 bg-white rounded-[2rem] flex items-center justify-center text-red-600 font-black text-6xl mb-8 shadow-2xl animate-bounce">T</div>
      <h1 className="text-5xl font-black mb-3 tracking-tighter">Tafadzwa Errand</h1>
      <p className="text-red-100 mb-12 max-w-sm font-medium opacity-90 text-lg leading-tight">Reliable help, just a tap away. Supporting local needs & the global Diaspora.</p>

      <div className="space-y-4 w-full max-w-sm">
        <button
          onClick={onSignIn}
          className="w-full bg-white text-red-600 font-black py-4 rounded-3xl shadow-xl hover:scale-105 active:scale-95 transition-all text-lg"
        >
          Sign In
        </button>
        <button
          onClick={onSignUp}
          className="w-full bg-red-800 text-white font-black py-4 rounded-3xl shadow-xl hover:scale-105 active:scale-95 transition-all text-lg border border-white/20"
        >
          Sign Up
        </button>
      </div>

      <div className="mt-16 text-[10px] uppercase font-black tracking-widest opacity-40">
        Powered by Appwrite & Gemini AI
      </div>
    </div>
  );
};

export default LandingPage;
