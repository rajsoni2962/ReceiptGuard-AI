import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, Clock, HelpCircle, Tag } from 'lucide-react';
import type { ProtectionSummary as ProtectionSummaryType, CalculationResult } from '../types';
import { CalculationDrawer } from './CalculationDrawer';
import { StructuredReceiptCard } from './StructuredReceiptCard';

interface ProtectionSummaryProps {
  summary: ProtectionSummaryType;
}

export const ProtectionSummary: React.FC<ProtectionSummaryProps> = ({ summary }) => {
  const [selectedCalc, setSelectedCalc] = useState<CalculationResult | null>(null);

  return (
    <div className="space-y-6 w-full">
      {/* 1. Proactive Action Required Banner (If items expiring soon < 7 days) */}
      {summary.expiring_soon_count > 0 && (
        <div className="glass-card rounded-2xl p-5 border border-amber-500/50 bg-amber-500/10 glow-amber relative overflow-hidden">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500 text-slate-950 tracking-wider">
                  Action Required
                </span>
                <h3 className="text-sm font-bold text-amber-300">
                  {summary.expiring_soon_count} Item(s) Expiring Soon (&lt; 7 Days Remaining)
                </h3>
              </div>
              <p className="text-xs text-amber-200/90 mt-1">
                ReceiptGuard automatically calculated return deadlines immediately at receipt ingestion before any question was asked.
              </p>
              {summary.alerts.map((alert, i) => (
                <div key={i} className="mt-2 text-xs text-amber-100 bg-amber-950/60 p-2.5 rounded-xl border border-amber-500/30 flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>{alert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Structured Real Purchase Receipt Card */}
      <StructuredReceiptCard summary={summary} />

      {/* 3. Automatic Return & Warranty Deadlines Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Automatic Purchase Protection Status ({summary.store})</span>
          </h3>
          <span className="text-xs text-slate-400">Purchased: {summary.purchase_date}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {summary.all_calculations.map((calc) => (
            <div
              key={calc.calc_id}
              className={`glass-card glass-card-hover rounded-2xl p-5 border relative flex flex-col justify-between ${
                calc.expiring_soon
                  ? 'border-amber-500/40 bg-amber-500/5'
                  : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300">
                      {calc.category}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1.5">{calc.item_name}</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-extrabold text-white">₹{calc.price.toLocaleString('en-IN')}</div>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      calc.expiring_soon
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {calc.status_label}
                    </span>
                  </div>
                </div>

                {/* Deadlines */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Return Deadline:</span>
                    </span>
                    <span className="font-bold text-white">{calc.return_deadline}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Days Remaining:</span>
                    <span className={`font-extrabold ${calc.expiring_soon ? 'text-amber-400 text-sm' : 'text-emerald-400'}`}>
                      {calc.return_days_remaining} Days
                    </span>
                  </div>

                  {calc.warranty_deadline && (
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Warranty Deadline:</span>
                      <span className="font-semibold text-cyan-300">{calc.warranty_deadline}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <button
                  onClick={() => setSelectedCalc(calc)}
                  className="flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Why this date?</span>
                </button>

                <span className="text-[11px] text-slate-400 font-mono">
                  {calc.applicable_policy_section || 'DemoMart §3.1'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explanation Modal */}
      <CalculationDrawer item={selectedCalc} onClose={() => setSelectedCalc(null)} />
    </div>
  );
};
