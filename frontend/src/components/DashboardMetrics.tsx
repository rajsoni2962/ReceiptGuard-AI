import React from 'react';
import { Package, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { ProtectionSummary } from '../types';

interface DashboardMetricsProps {
  summary: ProtectionSummary | null;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ summary }) => {
  const totalItems = summary ? summary.total_items : 0;
  const activeReturns = summary ? summary.active_return_windows : 0;
  const activeWarranties = summary ? summary.active_warranties : 0;
  const expiringSoon = summary ? summary.expiring_soon_count : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* Total Items */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center space-x-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <div className="text-2xl font-extrabold text-white tracking-tight">{totalItems}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Items</div>
        </div>
      </div>

      {/* Active Return Windows */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center space-x-4">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <div className="text-2xl font-extrabold text-white tracking-tight">{activeReturns}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Returns</div>
        </div>
      </div>

      {/* Active Warranties */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex items-center space-x-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <div className="text-2xl font-extrabold text-white tracking-tight">{activeWarranties}</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Warranties</div>
        </div>
      </div>

      {/* Expiring Soon */}
      <div className={`glass-card rounded-2xl p-4 border flex items-center space-x-4 transition-all ${
        expiringSoon > 0
          ? 'border-amber-500/50 bg-amber-500/10 glow-amber'
          : 'border-slate-800'
      }`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          expiringSoon > 0 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
        }`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <div className={`text-2xl font-extrabold tracking-tight ${expiringSoon > 0 ? 'text-amber-400' : 'text-white'}`}>
            {expiringSoon}
          </div>
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Expiring Soon</div>
        </div>
      </div>
    </div>
  );
};
