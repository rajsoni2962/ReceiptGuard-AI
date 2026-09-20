import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  FolderArchive 
} from 'lucide-react';
import type { ReceiptVaultCard } from '../types';
import { getReceiptVault } from '../services/api';
import { ReceiptDetailModal } from './ReceiptDetailModal';

interface RecentReceiptsWidgetProps {
  shopperId?: string;
  onViewAll: () => void;
  refreshTrigger?: number;
  onAskReceiptGuard?: (receiptId: string, storeName: string) => void;
}

export const RecentReceiptsWidget: React.FC<RecentReceiptsWidgetProps> = ({
  shopperId = 'demo-shopper-001',
  onViewAll,
  refreshTrigger = 0,
  onAskReceiptGuard
}) => {
  const [recentReceipts, setRecentReceipts] = useState<ReceiptVaultCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getReceiptVault({
      shopper_id: shopperId,
      sort_by: 'newest'
    })
      .then((data) => {
        if (isMounted) {
          setRecentReceipts((data.receipts || []).slice(0, 4));
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error loading recent receipts:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [shopperId, refreshTrigger]);

  const formatCurrency = (val?: number | null, curr: string = '₹') => {
    if (val === undefined || val === null) return `${curr}0.00`;
    return `${curr}${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getFileIcon = (fileType: string) => {
    const ft = (fileType || '').toLowerCase();
    if (ft === 'pdf') return <FileText className="w-4 h-4 text-rose-400" />;
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ft)) return <ImageIcon className="w-4 h-4 text-emerald-400" />;
    return <FileText className="w-4 h-4 text-indigo-400" />;
  };

  if (loading && recentReceipts.length === 0) {
    return null;
  }

  if (recentReceipts.length === 0) {
    return null;
  }

  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FolderArchive className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Recent Saved Receipts in Vault</h3>
            <p className="text-[11px] text-slate-400">Permanently secured documents with active protection</p>
          </div>
        </div>

        <button
          onClick={onViewAll}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition group"
        >
          <span>View All in Vault</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {recentReceipts.map((r) => (
          <div
            key={r.receipt_id}
            onClick={() => setSelectedReceiptId(r.receipt_id)}
            className="p-3.5 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800/90 hover:border-slate-700 transition cursor-pointer flex flex-col justify-between group space-y-2.5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  {getFileIcon(r.file_type)}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white group-hover:text-indigo-300 transition truncate max-w-[120px]">
                    {r.store}
                  </h4>
                  <p className="text-[10px] text-slate-400">{r.purchase_date}</p>
                </div>
              </div>
              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded uppercase bg-slate-800 text-slate-300 border border-slate-700">
                {r.file_type}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
              <span className="font-extrabold font-mono text-emerald-400 text-xs">
                {formatCurrency(r.grand_total, r.currency)}
              </span>

              {r.has_expiring_soon ? (
                <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                  <AlertTriangle className="w-3 h-3 animate-pulse" />
                  <span>Expiring Soon</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Protected</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedReceiptId && (
        <ReceiptDetailModal
          receiptId={selectedReceiptId}
          shopperId={shopperId}
          onClose={() => setSelectedReceiptId(null)}
          onAskReceiptGuard={onAskReceiptGuard}
        />
      )}
    </div>
  );
};
