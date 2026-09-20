import React, { useState } from 'react';
import {
  ShieldCheck,
  Calendar,
  FileCheck2,
  Search,
  Edit3,
  Archive,
  ShoppingBag,
  Calculator,
  Lock,
  Camera,
  CheckCircle2,
} from 'lucide-react';

interface FeedbackData {
  type: 'feedback';
  id: string;
  quote: string;
  category: string;
  location: string;
  icon: 'shield' | 'calendar' | 'policy' | 'search' | 'edit' | 'archive' | 'calc' | 'camera' | 'lock';
}

interface BrandData {
  type: 'brand';
  id: string;
  name: string;
  category: string;
}

type MotionItem = FeedbackData | BrandData;

const MOTION_ITEMS: MotionItem[] = [
  {
    type: 'feedback',
    id: 'f-1',
    quote: 'Return window was easy to track.',
    category: 'Return Protection',
    location: 'Bengaluru',
    icon: 'calendar',
  },
  {
    type: 'brand',
    id: 'b-amazon',
    name: 'Amazon',
    category: 'Marketplace',
  },
  {
    type: 'feedback',
    id: 'f-2',
    quote: 'The policy source made the answer clear.',
    category: 'Policy Grounding',
    location: 'Mumbai',
    icon: 'policy',
  },
  {
    type: 'brand',
    id: 'b-flipkart',
    name: 'Flipkart',
    category: 'E-Commerce',
  },
  {
    type: 'feedback',
    id: 'f-3',
    quote: 'Editing before saving gave me confidence.',
    category: 'Draft Review',
    location: 'Pune',
    icon: 'edit',
  },
  {
    type: 'brand',
    id: 'b-myntra',
    name: 'Myntra',
    category: 'Fashion',
  },
  {
    type: 'feedback',
    id: 'f-4',
    quote: 'Original invoice preserved byte-for-byte.',
    category: 'Receipt Vault',
    location: 'Delhi',
    icon: 'archive',
  },
  {
    type: 'brand',
    id: 'b-ajio',
    name: 'AJIO',
    category: 'Fashion Tech',
  },
  {
    type: 'feedback',
    id: 'f-5',
    quote: 'Order status verified from the database.',
    category: 'Verified Lookup',
    location: 'Ahmedabad',
    icon: 'search',
  },
  {
    type: 'brand',
    id: 'b-meesho',
    name: 'Meesho',
    category: 'Social Commerce',
  },
  {
    type: 'feedback',
    id: 'f-6',
    quote: '30-day deadline flagged proactively.',
    category: 'Expiry Guard',
    location: 'Hyderabad',
    icon: 'shield',
  },
  {
    type: 'brand',
    id: 'b-tatacliq',
    name: 'Tata CLiQ',
    category: 'Luxury & Retail',
  },
  {
    type: 'feedback',
    id: 'f-7',
    quote: 'Wristwatch warranty calculated to the day.',
    category: 'Date Precision',
    location: 'Surat',
    icon: 'calc',
  },
  {
    type: 'brand',
    id: 'b-croma',
    name: 'Croma',
    category: 'Electronics',
  },
  {
    type: 'feedback',
    id: 'f-8',
    quote: 'Extracted all items from a wrinkled store bill.',
    category: 'Vision OCR',
    location: 'Chennai',
    icon: 'camera',
  },
  {
    type: 'brand',
    id: 'b-reliancedigital',
    name: 'Reliance Digital',
    category: 'Tech Retail',
  },
  {
    type: 'feedback',
    id: 'f-9',
    quote: 'Zero hallucinations when an order was missing.',
    category: 'Truth Anchor',
    location: 'Jaipur',
    icon: 'lock',
  },
  {
    type: 'brand',
    id: 'b-nykaa',
    name: 'Nykaa',
    category: 'Beauty & Wellness',
  },
  {
    type: 'feedback',
    id: 'f-10',
    quote: 'Two-page invoice handled with separate totals.',
    category: 'Multi-Section',
    location: 'Kolkata',
    icon: 'policy',
  },
  {
    type: 'brand',
    id: 'b-nike',
    name: 'Nike',
    category: 'Sportswear',
  },
  {
    type: 'brand',
    id: 'b-apple',
    name: 'Apple',
    category: 'Consumer Tech',
  },
];

function ItemIcon({ type }: { type: FeedbackData['icon'] }) {
  const className = 'w-3.5 h-3.5 text-indigo-600';
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
    default: return <CheckCircle2 className={className} />;
  }
}

export const Minimal3DMotionField: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Distribute items across 6 columns
  const col1 = [MOTION_ITEMS[0], MOTION_ITEMS[1], MOTION_ITEMS[6], MOTION_ITEMS[7]];
  const col2 = [MOTION_ITEMS[2], MOTION_ITEMS[3], MOTION_ITEMS[8], MOTION_ITEMS[9]];
  const col3 = [MOTION_ITEMS[4], MOTION_ITEMS[5], MOTION_ITEMS[10], MOTION_ITEMS[11]];
  const col4 = [MOTION_ITEMS[12], MOTION_ITEMS[13], MOTION_ITEMS[16], MOTION_ITEMS[17]];
  const col5 = [MOTION_ITEMS[14], MOTION_ITEMS[15], MOTION_ITEMS[18], MOTION_ITEMS[19]];
  const col6 = [MOTION_ITEMS[20], MOTION_ITEMS[0], MOTION_ITEMS[4], MOTION_ITEMS[5]];

  const columns = [
    {
      items: [...col1, ...col1, ...col1],
      animationClass: 'animate-marquee-up',
      duration: '36s',
      colTransform: 'rotateY(-14deg) translateZ(-30px)',
      responsiveClass: 'hidden 2xl:flex',
    },
    {
      items: [...col2, ...col2, ...col2],
      animationClass: 'animate-marquee-down',
      duration: '43s',
      colTransform: 'rotateY(-9deg) translateZ(-10px)',
      responsiveClass: 'hidden xl:flex',
    },
    {
      items: [...col3, ...col3, ...col3],
      animationClass: 'animate-marquee-up',
      duration: '39s',
      colTransform: 'rotateY(-4deg) translateZ(15px)',
      responsiveClass: 'hidden md:flex',
    },
    {
      items: [...col4, ...col4, ...col4],
      animationClass: 'animate-marquee-down',
      duration: '46s',
      colTransform: 'rotateY(0deg) translateZ(25px)',
      responsiveClass: 'flex',
    },
    {
      items: [...col5, ...col5, ...col5],
      animationClass: 'animate-marquee-up',
      duration: '41s',
      colTransform: 'rotateY(6deg) translateZ(10px)',
      responsiveClass: 'flex',
    },
    {
      items: [...col6, ...col6, ...col6],
      animationClass: 'animate-marquee-down',
      duration: '48s',
      colTransform: 'rotateY(13deg) translateZ(-20px)',
      responsiveClass: 'hidden lg:flex',
    },
  ];

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 bg-white"
    >
      {/* 3D Perspective Canvas */}
      <div
        className="w-full h-full flex justify-center items-center preserve-3d"
        style={{
          perspective: '1400px',
        }}
      >
        <div
          className="w-[115%] sm:w-[105%] max-w-7xl flex justify-center gap-3 sm:gap-4 preserve-3d"
          style={{
            transform: 'rotateX(12deg) rotateY(-6deg) rotateZ(3deg) scale(1.04)',
            transformStyle: 'preserve-3d',
          }}
        >
          {columns.map((col, colIdx) => (
            <div
              key={`motion-col-${colIdx}`}
              className={`flex-1 min-w-[160px] max-w-[220px] flex-col preserve-3d ${col.responsiveClass} pointer-events-auto`}
              style={{
                transform: col.colTransform,
                transformStyle: 'preserve-3d',
              }}
            >
              <div
                className={`flex flex-col space-y-3.5 ${col.animationClass}`}
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
                        className={`w-full rounded-2xl p-3.5 transition-all duration-300 cursor-default bg-white border ${
                          isHovered
                            ? 'border-indigo-400 shadow-xl shadow-indigo-500/10 scale-[1.04] z-30 translate-y-[-2px]'
                            : 'border-slate-200/80 shadow-sm shadow-slate-200/50 hover:border-slate-300'
                        }`}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center space-x-1.5">
                            <div className="w-5 h-5 rounded-md bg-indigo-50 flex items-center justify-center">
                              <ItemIcon type={item.icon} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              {item.category}
                            </span>
                          </div>
                          <span className="text-[9px] font-medium text-slate-400">
                            {item.location}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-800 leading-snug">
                          "{item.quote}"
                        </p>
                      </div>
                    );
                  }

                  // Brand pill
                  return (
                    <div
                      key={key}
                      onMouseEnter={() => setHoveredId(item.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className={`w-full rounded-xl px-3 py-2 transition-all duration-300 cursor-default bg-white/90 border flex items-center justify-between ${
                        isHovered
                          ? 'border-slate-400 shadow-md opacity-100 scale-[1.03] z-20'
                          : 'border-slate-200/70 shadow-2xs opacity-60 hover:opacity-90'
                      }`}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div className="flex items-center space-x-2">
                        <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-bold text-slate-700 tracking-tight">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">
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
