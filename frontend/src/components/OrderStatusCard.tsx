import React, { useState } from 'react';
import { Search, CheckCircle2, AlertTriangle, Truck, Loader2 } from 'lucide-react';
import type { OrderStatusResult } from '../types';
import { lookupOrderStatus } from '../services/api';

interface OrderStatusCardProps {
  shopperId: string;
}

export const OrderStatusCard: React.FC<OrderStatusCardProps> = ({ shopperId }) => {
  const [orderIdInput, setOrderIdInput] = useState('ORD-1001');
  const [result, setResult] = useState<OrderStatusResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLookup = async (idToSearch?: string) => {
    const targetId = idToSearch || orderIdInput.trim();
    if (!targetId) return;

    setIsLoading(true);
    try {
      const res = await lookupOrderStatus(targetId, shopperId);
      setResult(res);
    } catch (e) {
      setResult({
        found: false,
        order_id: targetId,
        message: 'Order ID lookup error. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-slate-800 p-5 space-y-4">
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Verified Order Status Lookup</h3>
          <p className="text-[11px] text-slate-400">Direct query to official SQLite order database</p>
        </div>
      </div>

      {/* Input Box */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
            placeholder="Enter Order ID (e.g. ORD-1001)"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 uppercase tracking-wider font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>
        <button
          onClick={() => handleLookup()}
          disabled={isLoading}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl transition-colors flex items-center space-x-1.5 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Check Status</span>}
        </button>
      </div>

      {/* Quick Search Chips */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
        <span>Quick Lookup:</span>
        <button
          onClick={() => {
            setOrderIdInput('405-0187084-9011564');
            handleLookup('405-0187084-9011564');
          }}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-[10px]"
        >
          405-0187084-9011564
        </button>
        <button
          onClick={() => {
            setOrderIdInput('SALE-2026');
            handleLookup('SALE-2026');
          }}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-[10px]"
        >
          SALE-2026
        </button>
        <button
          onClick={() => {
            setOrderIdInput('ORD-999999');
            handleLookup('ORD-999999');
          }}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-[10px]"
        >
          ORD-999999 (Not Found)
        </button>
      </div>

      {/* Result Card */}
      {result && (
        <div className="mt-3 pt-3 border-t border-slate-800">
          {result.found ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Order Found: {result.order_id}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500 text-slate-950">
                  {result.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-300 pt-2 border-t border-emerald-500/20 text-[11px]">
                <div>
                  <span className="text-slate-400">Tracking Number:</span>
                  <div className="font-mono text-white font-medium">{result.tracking_number}</div>
                </div>
                <div>
                  <span className="text-slate-400">Carrier:</span>
                  <div className="text-white font-medium">{result.carrier}</div>
                </div>
                <div>
                  <span className="text-slate-400">Estimated Delivery:</span>
                  <div className="text-white font-medium">{result.estimated_delivery}</div>
                </div>
                <div>
                  <span className="text-slate-400">Database Truth:</span>
                  <div className="text-emerald-400 font-medium">✓ Verified Record</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
              <div className="flex items-center space-x-2 text-amber-400 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Order ID Not Found</span>
              </div>
              <p className="text-amber-200/90 leading-relaxed">
                {result.message}
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
