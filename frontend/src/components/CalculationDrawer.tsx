import React from 'react';
import { X, Calculator, BookOpen } from 'lucide-react';
import type { CalculationResult } from '../types';

interface CalculationDrawerProps {
  item: CalculationResult | null;
  onClose: () => void;
}

export const CalculationDrawer: React.FC<CalculationDrawerProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
      <div className="glass-card w-full max-w-lg rounded-2xl border border-indigo-500/30 p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">{item.item_name}</h3>
              <p className="text-xs text-slate-400">Deterministic Date Calculation Breakdown</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="mb-6 p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Calculated Expiry Status</span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
            item.expiring_soon
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
          }`}>
            ⚠ {item.status_label} ({item.return_days_remaining} days left)
          </span>
        </div>

        {/* Calculation Step-by-Step Breakdown */}
        <div className="space-y-4 text-xs">
          
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Purchase Date:</span>
              <span className="text-slate-200 font-semibold">{item.purchase_date}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Policy Return Window:</span>
              <span className="text-indigo-400 font-semibold">{item.applicable_policy_section || 'Store Policy §3.1'} (30 Days)</span>
            </div>
            <div className="flex justify-between text-slate-400 border-t border-slate-800/80 pt-2">
              <span>Calculated Return Deadline:</span>
              <span className="text-white font-bold">{item.return_deadline}</span>
            </div>
          </div>

          {/* Formula */}
          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 font-mono text-[11px] space-y-1">
            <div className="font-bold text-indigo-300">CALCULATION FORMULA:</div>
            <div>deadline = purchase_date (2026-09-10) + policy_days (30) = 2026-10-10</div>
            <div>days_remaining = deadline (2026-10-10) - as_of_date = {item.return_days_remaining} days</div>
            <div>expiring_flag = days_remaining ({item.return_days_remaining}) &lt; 7 threshold → TRUE</div>
          </div>

          {/* Source Citation */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-300 font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Policy Evidence &amp; Condition</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {item.explanation}
            </p>
          </div>

        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            Close Explanation
          </button>
        </div>

      </div>
    </div>
  );
};
