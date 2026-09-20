import React, { useState } from 'react';
import {
  ShieldCheck,
  Calendar,
  FileCheck2,
  Search,
  Edit3,
  Archive,
  Calculator,
  Lock,
  Camera,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

interface FeedbackData {
  type: 'feedback';
  id: string;
  quote: string;
  category: string;
  handle: string;
  code: string;
  location: string;
  icon: 'shield' | 'calendar' | 'policy' | 'search' | 'edit' | 'archive' | 'calc' | 'camera' | 'lock' | 'sparkles';
}

interface BrandData {
  type: 'brand';
  id: string;
  name: string;
  category: string;
}

type MotionItem = FeedbackData | BrandData;

function ItemIcon({ type }: { type: FeedbackData['icon'] }) {
  const className = 'w-4 h-4 text-indigo-600';
  switch (type) {
    case 'shield': return <ShieldCheck className={className} />;
    case 'calendar': return <Calendar className={className} />;
    case 'policy': return <FileCheck2 className={className} />;
    case 'search': return <Search className={className} />;
    case 'edit': return <Edit3 className={className} />;
    case 'archive': return <Archive className={className} />;
    case 'calc': return <Calculator className={className} />;
    case 'camera': return <Camera className={className} />;
    case 'lock': return <Lock className={className} />;
    case 'sparkles': return <Sparkles className={className} />;
    default: return <CheckCircle2 className={className} />;
  }
}

function BrandGlyph({ id }: { id: string }) {
  switch (id) {
    case 'amazon':
      return (
        <svg className="w-4 h-4 fill-slate-700" viewBox="0 0 24 24">
          <path d="M13.9 12.2c-.1.8-.7 1.2-1.5 1.2-1.1 0-1.7-.8-1.7-2.1 0-1.5.8-2.3 2-2.3.6 0 1 .2 1.2.6v2.6zm3.3 2.9c-.1-.3-.2-.8-.2-1.3-.6.9-1.5 1.5-2.6 1.5-1.9 0-3.3-1.4-3.3-3.7 0-2.4 1.5-3.8 3.5-3.8.9 0 1.7.4 2.2.9V6.2h2.2v8.9h-1.8zm-14.7 4c5.8 4 14.5 3.3 19.3-.9.3-.3.1-.7-.3-.6-4.4 2-13.8 2.5-18.7-1.1-.3-.2-.5.3-.3.6zm20-1.1c-.5-.7-2.1-.3-3.1-.1-.3.1-.3.4 0 .5 2.1.8 2.8 1.4 3 1.6.2.2.4 0 .3-.3-.1-.4-.1-1.1-.2-1.7z" />
        </svg>
      );
    case 'apple':
      return (
        <svg className="w-4 h-4 fill-slate-700" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.41c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 0.6-2.65 1.36-.57.66-.99 1.72-.85 2.74 1.01.08 1.96-.5 2.58-1.25z" />
        </svg>
      );
    case 'nike':
      return (
        <svg className="w-5 h-4 fill-slate-700" viewBox="0 0 24 24">
          <path d="M21.7 4.2C13.2 8.3 5.4 14.3 2.3 17.5c-1.2 1.2-.9 2.5.6 2.5 1.5 0 4.1-.7 7.7-2.1 6.5-2.5 11.1-6.7 11.1-13.7z" />
        </svg>
      );
    case 'flipkart':
      return (
        <svg className="w-4 h-4 fill-slate-700" viewBox="0 0 24 24">
          <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm4 10h-3v4h-2v-4H9v-2h2V9h2v2h3v2z" />
        </svg>
      );
    case 'myntra':
      return (
        <svg className="w-4 h-4 fill-slate-700" viewBox="0 0 24 24">
          <path d="M12 4.5c-1.6 0-3.1.9-3.9 2.2L4.5 13.5c-.8 1.3-.8 3 0 4.3.8 1.3 2.3 2.2 3.9 2.2h7.2c1.6 0 3.1-.9 3.9-2.2.8-1.3.8-3 0-4.3L15.9 6.7c-.8-1.3-2.3-2.2-3.9-2.2zm-2.7 4.2c.4-.6 1.1-1 1.8-1s1.4.4 1.8 1l3.2 5.5-1.9 3.3H7.8l-1.9-3.3 3.4-5.5z" />
        </svg>
      );
    case 'croma':
      return (
        <svg className="w-4 h-4 fill-slate-700" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
      );
    case 'reliancedigital':
      return (
        <svg className="w-4 h-4 fill-slate-700" viewBox="0 0 24 24">
          <path d="M4 6h16v12H4z M2 9h2v6H2z M20 9h2v6h-2z M9 4h2v2H9z M13 4h2v2h-2z M9 18h2v2H9z M13 18h2v2h-2z" />
        </svg>
      );
    case 'nykaa':
      return (
        <svg className="w-4 h-4 fill-slate-700" viewBox="0 0 24 24">
          <path d="M12 2l2.4 6.9 7.1 1.4-5.3 4.9 1.4 7.1-5.6-3.6-5.6 3.6 1.4-7.1-5.3-4.9 7.1-1.4z" />
        </svg>
      );
    case 'ajio':
      return (
        <svg className="w-4 h-4 fill-slate-700" viewBox="0 0 24 24">
          <path d="M12 2L2 12l10 10 10-10L12 2zm0 4.5l5.5 5.5-5.5 5.5L6.5 12 12 6.5z" />
        </svg>
      );
    case 'meesho':
      return (
        <svg className="w-4 h-4 fill-slate-700" viewBox="0 0 24 24">
          <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
        </svg>
      );
    default:
      return <ShoppingBag className="w-4 h-4 text-slate-500" />;
  }
}

// 14 Concise ReceiptGuard Product Reviews
const FEEDBACK_ITEMS: FeedbackData[] = [
  {
    type: 'feedback',
    id: 'f-1',
    quote: 'Return window was easy to track.',
    category: 'Return Guard',
    handle: 'returns',
    code: 'IN',
    location: 'Bengaluru',
    icon: 'calendar',
  },
  {
    type: 'feedback',
    id: 'f-2',
    quote: 'The policy source made the answer clear.',
    category: 'Policy Evidence',
    handle: 'policy',
    code: 'IN',
    location: 'Mumbai',
    icon: 'policy',
  },
  {
    type: 'feedback',
    id: 'f-3',
    quote: 'Editing before saving gave me confidence.',
    category: 'Draft Review',
    handle: 'verifier',
    code: 'IN',
    location: 'Pune',
    icon: 'edit',
  },
  {
    type: 'feedback',
    id: 'f-4',
    quote: 'Original invoice preserved byte-for-byte.',
    category: 'Receipt Vault',
    handle: 'vault',
    code: 'IN',
    location: 'Delhi',
    icon: 'archive',
  },
  {
    type: 'feedback',
    id: 'f-5',
    quote: 'Order status verified from the database.',
    category: 'Order Lookup',
    handle: 'orders',
    code: 'IN',
    location: 'Ahmedabad',
    icon: 'search',
  },
  {
    type: 'feedback',
    id: 'f-6',
    quote: '30-day deadline flagged proactively.',
    category: 'Expiry Guard',
    handle: 'alerts',
    code: 'IN',
    location: 'Hyderabad',
    icon: 'shield',
  },
  {
    type: 'feedback',
    id: 'f-7',
    quote: 'Wristwatch warranty calculated to the day.',
    category: 'Date Precision',
    handle: 'warranty',
    code: 'IN',
    location: 'Surat',
    icon: 'calc',
  },
  {
    type: 'feedback',
    id: 'f-8',
    quote: 'Extracted all items from a wrinkled store bill.',
    category: 'Vision OCR',
    handle: 'scanner',
    code: 'IN',
    location: 'Chennai',
    icon: 'camera',
  },
  {
    type: 'feedback',
    id: 'f-9',
    quote: 'Zero hallucinations when an order was missing.',
    category: 'Truth Anchor',
    handle: 'truth',
    code: 'IN',
    location: 'Jaipur',
    icon: 'lock',
  },
  {
    type: 'feedback',
    id: 'f-10',
    quote: 'Two-page invoice handled with separate totals.',
    category: 'Multi-Section',
    handle: 'sections',
    code: 'IN',
    location: 'Kolkata',
    icon: 'policy',
  },
  {
    type: 'feedback',
    id: 'f-11',
    quote: 'Evidence matched the purchase exactly.',
    category: 'Grounding',
    handle: 'grounded',
    code: 'IN',
    location: 'Gurugram',
    icon: 'shield',
  },
  {
    type: 'feedback',
    id: 'f-12',
    quote: 'Warranty details were easy to find.',
    category: 'Asset Guard',
    handle: 'assets',
    code: 'IN',
    location: 'Noida',
    icon: 'calc',
  },
  {
    type: 'feedback',
    id: 'f-13',
    quote: 'Return deadline calculator was deterministic.',
    category: 'Calculator',
    handle: 'math',
    code: 'IN',
    location: 'Chandigarh',
    icon: 'calc',
  },
  {
    type: 'feedback',
    id: 'f-14',
    quote: 'Shopper-isolated vault protected my data.',
    category: 'Vector Privacy',
    handle: 'privacy',
    code: 'IN',
    location: 'Kochi',
    icon: 'lock',
  },
];

// 10 Major Shopping Ecosystem Marks
const BRAND_ITEMS: BrandData[] = [
  { type: 'brand', id: 'amazon', name: 'Amazon', category: 'Marketplace' },
  { type: 'brand', id: 'flipkart', name: 'Flipkart', category: 'E-Commerce' },
  { type: 'brand', id: 'myntra', name: 'Myntra', category: 'Fashion' },
  { type: 'brand', id: 'apple', name: 'Apple', category: 'Consumer Tech' },
  { type: 'brand', id: 'nike', name: 'Nike', category: 'Sportswear' },
  { type: 'brand', id: 'croma', name: 'Croma', category: 'Electronics' },
  { type: 'brand', id: 'reliancedigital', name: 'Reliance Digital', category: 'Tech Retail' },
  { type: 'brand', id: 'nykaa', name: 'Nykaa', category: 'Beauty' },
  { type: 'brand', id: 'ajio', name: 'AJIO', category: 'Fashion Tech' },
  { type: 'brand', id: 'meesho', name: 'Meesho', category: 'Social Commerce' },
];

export const Minimal3DMotionField: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Distribute 7 distinct items per column
  const col1Set: MotionItem[] = [
    FEEDBACK_ITEMS[0],
    BRAND_ITEMS[0],
    FEEDBACK_ITEMS[3],
    BRAND_ITEMS[3],
    FEEDBACK_ITEMS[5],
    BRAND_ITEMS[5],
    FEEDBACK_ITEMS[10],
  ];

  const col2Set: MotionItem[] = [
    FEEDBACK_ITEMS[1],
    BRAND_ITEMS[1],
    FEEDBACK_ITEMS[6],
    BRAND_ITEMS[4],
    FEEDBACK_ITEMS[4],
    BRAND_ITEMS[9],
    FEEDBACK_ITEMS[8],
  ];

  const col3Set: MotionItem[] = [
    FEEDBACK_ITEMS[2],
    BRAND_ITEMS[2],
    FEEDBACK_ITEMS[7],
    BRAND_ITEMS[6],
    FEEDBACK_ITEMS[11],
    BRAND_ITEMS[7],
    FEEDBACK_ITEMS[9],
  ];

  const col4Set: MotionItem[] = [
    FEEDBACK_ITEMS[12],
    BRAND_ITEMS[8],
    FEEDBACK_ITEMS[13],
    BRAND_ITEMS[0],
    FEEDBACK_ITEMS[3],
    BRAND_ITEMS[1],
    FEEDBACK_ITEMS[0],
  ];

  const col5Set: MotionItem[] = [
    FEEDBACK_ITEMS[1],
    BRAND_ITEMS[3],
    FEEDBACK_ITEMS[10],
    BRAND_ITEMS[6],
    FEEDBACK_ITEMS[5],
    BRAND_ITEMS[4],
    FEEDBACK_ITEMS[4],
  ];

  const col6Set: MotionItem[] = [
    FEEDBACK_ITEMS[7],
    BRAND_ITEMS[5],
    FEEDBACK_ITEMS[8],
    BRAND_ITEMS[7],
    FEEDBACK_ITEMS[11],
    BRAND_ITEMS[9],
    FEEDBACK_ITEMS[2],
  ];

  // Columns configured with exact user-requested timings, angles, opacities, and scales
  const columns = [
    {
      items: [...col1Set, ...col1Set],
      animationClass: 'animate-marquee-up',
      duration: '34s',
      colTransform: 'rotateY(-14deg) translateZ(-35px)',
      scale: 0.90,
      opacity: 0.82,
      responsiveClass: 'hidden 2xl:flex',
    },
    {
      items: [...col2Set, ...col2Set],
      animationClass: 'animate-marquee-down',
      duration: '40s',
      colTransform: 'rotateY(-9deg) translateZ(-10px)',
      scale: 0.95,
      opacity: 0.88,
      responsiveClass: 'hidden xl:flex',
    },
    {
      items: [...col3Set, ...col3Set],
      animationClass: 'animate-marquee-up',
      duration: '36s',
      colTransform: 'rotateY(-4deg) translateZ(15px)',
      scale: 1.0,
      opacity: 0.96,
      responsiveClass: 'flex',
    },
    {
      items: [...col4Set, ...col4Set],
      animationClass: 'animate-marquee-down',
      duration: '44s',
      colTransform: 'rotateY(4deg) translateZ(20px)',
      scale: 1.0,
      opacity: 0.96,
      responsiveClass: 'flex',
    },
    {
      items: [...col5Set, ...col5Set],
      animationClass: 'animate-marquee-up',
      duration: '38s',
      colTransform: 'rotateY(9deg) translateZ(-5px)',
      scale: 0.95,
      opacity: 0.88,
      responsiveClass: 'hidden md:flex',
    },
    {
      items: [...col6Set, ...col6Set],
      animationClass: 'animate-marquee-down',
      duration: '46s',
      colTransform: 'rotateY(14deg) translateZ(-30px)',
      scale: 0.90,
      opacity: 0.82,
      responsiveClass: 'hidden lg:flex',
    },
  ];

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 bg-white"
    >
      {/* 3D Perspective Viewport */}
      <div
        className="w-full h-full flex justify-center items-center preserve-3d"
        style={{
          perspective: '1350px',
        }}
      >
        <div
          className="w-[125%] sm:w-[115%] max-w-[1750px] flex justify-center gap-4 sm:gap-5 preserve-3d"
          style={{
            transform: 'rotateX(12deg) rotateY(-8deg) rotateZ(3deg) scale(1.06)',
            transformStyle: 'preserve-3d',
          }}
        >
          {columns.map((col, colIdx) => (
            <div
              key={`motion-col-${colIdx}`}
              className={`flex-1 min-w-[200px] max-w-[240px] flex-col preserve-3d ${col.responsiveClass} pointer-events-auto`}
              style={{
                transform: col.colTransform,
                transformStyle: 'preserve-3d',
              }}
            >
              <div
                className={`flex flex-col space-y-4 ${col.animationClass}`}
                style={{
                  '--duration': col.duration,
                  animationPlayState: hoveredId ? 'paused' : undefined,
                } as React.CSSProperties}
              >
                {col.items.map((item, itemIdx) => {
                  const key = `col-${colIdx}-item-${item.id}-${itemIdx}`;
                  const isHovered = hoveredId === item.id;

                  if (item.type === 'feedback') {
                    return (
                      <div
                        key={key}
                        onMouseEnter={() => setHoveredId(item.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className="w-[205px] sm:w-[225px] rounded-[20px] p-4 transition-all duration-300 cursor-default bg-white border flex flex-col justify-between"
                        style={{
                          background: 'rgba(255, 255, 255, 0.96)',
                          border: isHovered
                            ? '1px solid rgba(99, 102, 241, 0.45)'
                            : '1px solid rgba(15, 23, 42, 0.12)',
                          boxShadow: isHovered
                            ? '0 18px 40px rgba(15, 23, 42, 0.14)'
                            : '0 12px 30px rgba(15, 23, 42, 0.08)',
                          opacity: isHovered ? 1.0 : col.opacity,
                          transform: isHovered
                            ? 'scale(1.05) translateZ(35px)'
                            : `scale(${col.scale})`,
                          transformStyle: 'preserve-3d',
                        }}
                      >
                        {/* Card Header matching reference style */}
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-50 border border-indigo-200/80 flex items-center justify-center flex-shrink-0 shadow-2xs">
                              <ItemIcon type={item.icon} />
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="text-xs font-bold text-slate-900 tracking-tight leading-none">
                                {item.category}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                                @{item.handle}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end text-right">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider leading-none">
                              {item.code}
                            </span>
                            <span className="text-[9px] text-slate-400 font-medium mt-0.5">
                              {item.location}
                            </span>
                          </div>
                        </div>

                        {/* Card Quote Body */}
                        <p className="text-[12.5px] font-semibold text-slate-800 leading-snug text-left">
                          "{item.quote}"
                        </p>
                      </div>
                    );
                  }

                  // Brand Pill Card
                  return (
                    <div
                      key={key}
                      onMouseEnter={() => setHoveredId(item.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className="w-[205px] sm:w-[225px] rounded-[18px] px-4 py-3 transition-all duration-300 cursor-default bg-white border flex items-center justify-between"
                      style={{
                        background: 'rgba(255, 255, 255, 0.94)',
                        border: isHovered
                          ? '1px solid rgba(15, 23, 42, 0.25)'
                          : '1px solid rgba(15, 23, 42, 0.11)',
                        boxShadow: isHovered
                          ? '0 16px 36px rgba(15, 23, 42, 0.12)'
                          : '0 8px 24px rgba(15, 23, 42, 0.06)',
                        opacity: isHovered ? 1.0 : col.opacity * 0.90,
                        transform: isHovered
                          ? 'scale(1.04) translateZ(28px)'
                          : `scale(${col.scale})`,
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-700 shadow-2xs">
                          <BrandGlyph id={item.id} />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-bold text-slate-800 tracking-tight leading-tight">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            Supported Store
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider text-indigo-600/80 font-bold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                        {item.category}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
