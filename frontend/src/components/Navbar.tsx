import React from 'react';
import { ShieldCheck, FileText, Activity, BookOpen } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'vault' | 'policies' | 'audit' | 'how-it-works';
  setActiveTab: (tab: 'dashboard' | 'vault' | 'policies' | 'audit' | 'how-it-works') => void;
  onTryDemo?: () => void;
  isProcessing?: boolean;
  isLanding?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-300 border-b border-slate-200/80 bg-white/85 backdrop-blur-md text-slate-900 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-slate-900">
                ReceiptGuard <span className="text-indigo-600 font-extrabold">AI</span>
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 p-1 rounded-xl border bg-slate-100/90 border-slate-200/90">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'vault'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Receipt Vault</span>
          </button>

          <button
            onClick={() => setActiveTab('policies')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'policies'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Policy Explorer</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'audit'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </button>
        </nav>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl border bg-slate-50 border-slate-200/80 text-slate-800 shadow-2xs">
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
              RS
            </div>
            <div className="text-left text-xs">
              <div className="font-semibold leading-tight">Raj Soni</div>
              <div className="text-[10px] text-emerald-600 font-medium flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Protected</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
