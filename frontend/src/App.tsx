import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { UnifiedComposer } from './components/UnifiedComposer';
import { ProcessingTimeline } from './components/ProcessingTimeline';
import { DashboardMetrics } from './components/DashboardMetrics';
import { ProtectionSummary } from './components/ProtectionSummary';
import { ReviewDraftModal } from './components/ReviewDraftModal';
import { ReceiptVault } from './components/ReceiptVault';
import { RecentReceiptsWidget } from './components/RecentReceiptsWidget';
import { ChatPanel } from './components/ChatPanel';
import { OrderStatusCard } from './components/OrderStatusCard';
import { PolicyExplorer } from './components/PolicyExplorer';
import { AuditTimeline } from './components/AuditTimeline';
import { Minimal3DMotionField } from './components/Minimal3DMotionField';
import type { ProtectionSummary as ProtectionSummaryType, ReceiptDraft } from './types';
import { uploadReceipt, getProtectionSummary, getReceiptVault } from './services/api';
import { Lock, Upload, CheckCircle2, FolderArchive, ShieldCheck } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'vault' | 'policies' | 'audit' | 'how-it-works'>('dashboard');
  const [shopperId] = useState('demo-shopper-001');
  const [currentReceiptId, setCurrentReceiptId] = useState<string | null>(null);
  const [summary, setSummary] = useState<ProtectionSummaryType | null>(null);
  
  const [activeDraft, setActiveDraft] = useState<ReceiptDraft | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [vaultRefreshTrigger, setVaultRefreshTrigger] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const triggerProcessingSimulation = async (receiptId: string) => {
    setIsProcessing(true);
    setProgressPercentage(15);

    const intervals = [35, 60, 80, 95, 100];
    for (const p of intervals) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      setProgressPercentage(p);
    }

    try {
      const data = await getProtectionSummary(receiptId);
      setSummary(data);
      setCurrentReceiptId(receiptId);
      setVaultRefreshTrigger((prev) => prev + 1);
      showToast('Receipt securely saved to your Receipt Vault.');
    } catch (e) {
      console.error('Error fetching summary:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setProgressPercentage(25);
    try {
      const draft = await uploadReceipt(file, shopperId);
      setProgressPercentage(100);
      setIsProcessing(false);
      
      // Open Draft Review Modal
      setActiveDraft(draft);
      setIsReviewModalOpen(true);
    } catch (e) {
      console.error('Upload error:', e);
      setIsProcessing(false);
      showToast('Error uploading file. Please check format and try again.');
    }
  };

  const handleDraftConfirmed = async (receiptId: string) => {
    setIsReviewModalOpen(false);
    setActiveDraft(null);
    await triggerProcessingSimulation(receiptId);
  };

  const loadFirstVaultReceipt = async () => {
    try {
      const vaultRes = await getReceiptVault({ shopper_id: shopperId });
      if (vaultRes.receipts && vaultRes.receipts.length > 0) {
        const firstId = vaultRes.receipts[0].receipt_id;
        setCurrentReceiptId(firstId);
        const data = await getProtectionSummary(firstId);
        setSummary(data);
      }
    } catch (e) {
      console.error('Error loading vault receipt:', e);
    }
  };

  const handleAskReceiptGuard = (receiptId: string, _storeName: string) => {
    setCurrentReceiptId(receiptId);
    setActiveTab('dashboard');
  };

  const handleQuickOrderCheck = async (_orderId: string) => {
    setActiveTab('dashboard');
    if (!summary) {
      await loadFirstVaultReceipt();
    }
  };

  const handleUnifiedQuery = async (_queryText: string) => {
    setActiveTab('dashboard');
    if (!summary) {
      await loadFirstVaultReceipt();
    }
  };

  const isLanding = !summary && !isProcessing && activeTab === 'dashboard';

  return (
    <div className={`font-sans relative ${
      isLanding
        ? 'h-[100dvh] max-h-[100dvh] overflow-hidden bg-white text-slate-900'
        : 'min-h-screen bg-[#f8fafc] text-slate-900'
    }`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-xl bg-white border border-emerald-200 text-emerald-800 shadow-xl backdrop-blur-md animate-in slide-in-from-top-5 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onTryDemo={() => loadFirstVaultReceipt()}
        isProcessing={isProcessing}
        isLanding={isLanding}
      />

      {/* ULTRA-MINIMAL PURE WHITE SINGLE-SCREEN LAUNCHPAD */}
      {isLanding ? (
        <main className="flex-1 w-full h-[calc(100dvh-4rem)] overflow-hidden relative flex items-center justify-center select-none bg-white">
          {/* Layer 2: 3D Moving Review & Brand Cards in Background */}
          <Minimal3DMotionField />

          {/* Layer 3: Soft White Radial Clear Zone around the Center */}
          <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,#FFFFFF_0%,rgba(255,255,255,0.96)_35%,rgba(255,255,255,0.70)_60%,rgba(255,255,255,0.05)_100%)]" />

          {/* Edge Fades into Pure White */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

          {/* Layer 4: Exact Center AI Input Only (Zero Marketing Copy) */}
          <div className="relative z-20 w-full max-w-2xl px-4 my-auto flex flex-col items-center justify-center text-center">
            <div className="mb-6 flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                ReceiptGuard <span className="text-indigo-600">AI</span>
              </h1>
            </div>

            <UnifiedComposer
              onFileUpload={handleFileUpload}
              onSendMessage={handleUnifiedQuery}
              isProcessing={isProcessing}
              onQuickOrderCheck={handleQuickOrderCheck}
              shopperId={shopperId}
              currentReceiptId={currentReceiptId}
              theme="light"
              showQuickChips={false}
            />
          </div>
        </main>
      ) : (
        /* STANDARD MULTI-SECTION BODY (For Vault, Policies, Audit, and Active Inspection Dashboard) */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* RECEIPT VAULT TAB */}
          {activeTab === 'vault' && (
            <ReceiptVault
              shopperId={shopperId}
              onOpenUploader={() => {
                setActiveTab('dashboard');
              }}
              onAskReceiptGuard={handleAskReceiptGuard}
              refreshTrigger={vaultRefreshTrigger}
            />
          )}

        {/* PROCESSING TIMELINE STAGE */}
        {isProcessing && (
          <div className="max-w-2xl mx-auto">
            <ProcessingTimeline
              currentStage="CALCULATOR"
              progressPercentage={progressPercentage}
              stagesLog={[]}
            />
          </div>
        )}

        {/* DASHBOARD TAB (Active Summary View) */}
        {activeTab === 'dashboard' && summary && !isProcessing && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Metrics Row */}
            <DashboardMetrics summary={summary} />

            {/* Re-upload / Load Demo Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
              <div className="text-xs text-slate-600">
                Viewing active protection for <span className="text-slate-900 font-bold">{summary.store}</span> ({summary.purchase_date})
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('vault')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center space-x-1"
                >
                  <FolderArchive className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Go to Receipt Vault</span>
                </button>

                <label className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Receipt</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.txt"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Proactive Summary & Purchased Product Cards */}
            <ProtectionSummary summary={summary} />

            {/* Recent Receipts In Vault Section */}
            <RecentReceiptsWidget
              shopperId={shopperId}
              onViewAll={() => setActiveTab('vault')}
              refreshTrigger={vaultRefreshTrigger}
              onAskReceiptGuard={handleAskReceiptGuard}
            />

            {/* Bottom Two-Column Grid: RAG Assistant + Order Status Lookup */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
              {/* RAG Chat Assistant (2 Cols) */}
              <div className="lg:col-span-2">
                <ChatPanel shopperId={shopperId} receiptId={currentReceiptId} />
              </div>

              {/* Order Status Lookup Widget (1 Col) */}
              <div className="lg:col-span-1 space-y-6">
                <OrderStatusCard shopperId={shopperId} />

                {/* Trust Architecture Card */}
                <div className="glass-card rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
                  <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center space-x-1.5">
                    <Lock className="w-4 h-4 text-indigo-600" />
                    <span>Trust Architecture</span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-slate-500">Vault Storage:</span>
                      <span className="font-semibold text-emerald-700">Original Binary Preserved</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-slate-500">AI Role:</span>
                      <span className="font-semibold text-indigo-700">OCR & Document Extraction</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-slate-500">Code Role:</span>
                      <span className="font-semibold text-emerald-700">Deterministic Arithmetic</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-slate-500">Database Role:</span>
                      <span className="font-semibold text-cyan-700">Relational Order Truth</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Chroma Role:</span>
                      <span className="font-semibold text-purple-700">Shopper-Isolated RAG</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* POLICY EXPLORER TAB */}
        {activeTab === 'policies' && <PolicyExplorer />}

        {/* AUDIT TRAIL TAB */}
        {activeTab === 'audit' && <AuditTimeline receiptId={currentReceiptId} />}

      </main>
      )}

      {/* Review & Edit Draft Staging Modal */}
      {activeDraft && (
        <ReviewDraftModal
          draft={activeDraft}
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setActiveDraft(null);
          }}
          onConfirmed={handleDraftConfirmed}
        />
      )}

      {/* Footer (Only rendered on non-landing views so homepage remains strictly non-scrolling) */}
      {!isLanding && (
        <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-bold text-slate-800">ReceiptGuard AI</span> — Built for responsible, grounded AI purchase protection.
            </div>
            <div className="text-slate-500 text-[11px]">
              Consumer Purchase Protection • Persistent Receipt Vault • Native PDF + OCR • Deterministic Protection
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
