import React, { useState, useEffect, useRef, useMemo } from 'react';
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
} from 'lucide-react';

/* =========================================================================
   TYPES
   ========================================================================= */

interface ReviewCardData {
  id: string;
  quote: string;
  category: string;
  handle: string;
  code: string;
  location: string;
  icon: 'shield' | 'calendar' | 'policy' | 'search' | 'edit' | 'archive' | 'calc' | 'camera' | 'lock' | 'sparkles';
  microTilt: number; // e.g. -1, 0, 1 deg
  width: number;
  height: number;
}

interface BrandCardData {
  id: string;
  name: string;
  category: string;
  tagline: string;
}

/* =========================================================================
   REVIEW POOL (DENSE MASONRY FOR THE CONTINUOUS WALL)
   ========================================================================= */

const REVIEW_POOL: Omit<ReviewCardData, 'microTilt' | 'width' | 'height'>[] = [
  { id: 'r1', quote: 'Return window was easy to track.', category: 'Return Guard', handle: 'returns', code: 'IN', location: 'Bengaluru', icon: 'calendar' },
  { id: 'r2', quote: 'Warranty details were easy to find.', category: 'Asset Guard', handle: 'warranty', code: 'US', location: 'Austin', icon: 'calc' },
  { id: 'r3', quote: 'Order status was verified instantly.', category: 'Order Lookup', handle: 'verifier', code: 'UK', location: 'London', icon: 'search' },
  { id: 'r4', quote: 'Original invoice was preserved.', category: 'Receipt Vault', handle: 'vault', code: 'DE', location: 'Munich', icon: 'archive' },
  { id: 'r5', quote: 'Setup was incredibly smooth.', category: 'Instant Guard', handle: 'setup', code: 'JP', location: 'Tokyo', icon: 'sparkles' },
  { id: 'r6', quote: 'Everything was easy to organize.', category: 'Smart Vault', handle: 'organize', code: 'FR', location: 'Paris', icon: 'shield' },
  { id: 'r7', quote: 'The policy source made the answer clear.', category: 'Policy Evidence', handle: 'policy', code: 'IN', location: 'Mumbai', icon: 'policy' },
  { id: 'r8', quote: 'Editing before saving gave me confidence.', category: 'Draft Review', handle: 'editor', code: 'CA', location: 'Toronto', icon: 'edit' },
  { id: 'r9', quote: '30-day deadline flagged proactively.', category: 'Expiry Guard', handle: 'alerts', code: 'AU', location: 'Sydney', icon: 'shield' },
  { id: 'r10', quote: 'Wristwatch warranty calculated to the day.', category: 'Date Precision', handle: 'dates', code: 'CH', location: 'Zurich', icon: 'calc' },
  { id: 'r11', quote: 'Extracted all items from a wrinkled store bill.', category: 'Vision OCR', handle: 'scanner', code: 'IN', location: 'Delhi', icon: 'camera' },
  { id: 'r12', quote: 'Zero hallucinations when an order was missing.', category: 'Truth Anchor', handle: 'truth', code: 'SG', location: 'Singapore', icon: 'lock' },
  { id: 'r13', quote: 'Two-page invoice handled with separate totals.', category: 'Multi-Section', handle: 'sections', code: 'NL', location: 'Amsterdam', icon: 'policy' },
  { id: 'r14', quote: 'Evidence matched the purchase exactly.', category: 'Grounding', handle: 'grounded', code: 'SE', location: 'Stockholm', icon: 'shield' },
  { id: 'r15', quote: 'Shopper-isolated vault protected my data.', category: 'Vector Privacy', handle: 'privacy', code: 'US', location: 'Seattle', icon: 'lock' },
  { id: 'r16', quote: 'Claims deadline reminder saved my purchase.', category: 'Claim Alert', handle: 'claims', code: 'IN', location: 'Pune', icon: 'calendar' },
  { id: 'r17', quote: 'Calculations were deterministic and fast.', category: 'Calculator', handle: 'math', code: 'KR', location: 'Seoul', icon: 'calc' },
  { id: 'r18', quote: 'Side-by-side modal showed exact bill values.', category: 'Audit Verifier', handle: 'audit', code: 'IT', location: 'Milan', icon: 'edit' },
];

/* =========================================================================
   40 BRAND LOGOS (SUPPLIED REFERENCE SHEETS)
   ========================================================================= */

const ALL_BRANDS: BrandCardData[] = [
  // Sportswear & Footwear
  { id: 'nike', name: 'Nike', category: 'Sportswear', tagline: 'Just Do It' },
  { id: 'adidas', name: 'Adidas', category: 'Sportswear', tagline: 'Impossible Is Nothing' },
  { id: 'puma', name: 'Puma', category: 'Sportswear', tagline: 'Forever Faster' },
  { id: 'jordan', name: 'Jordan', category: 'Footwear', tagline: 'Flight Heritage' },
  { id: 'converse', name: 'Converse', category: 'Footwear', tagline: 'All Star' },

  // Luxury Haute Couture
  { id: 'gucci', name: 'Gucci', category: 'Luxury', tagline: 'Firenze 1921' },
  { id: 'prada', name: 'Prada', category: 'Haute Couture', tagline: 'Milano 1913' },
  { id: 'dior', name: 'Dior', category: 'Haute Couture', tagline: 'Paris Heritage' },
  { id: 'chanel', name: 'Chanel', category: 'Luxury', tagline: 'Haute Couture' },
  { id: 'louis-vuitton', name: 'Louis Vuitton', category: 'Luxury', tagline: 'Maison Fondée' },

  // Contemporary Fashion
  { id: 'balenciaga', name: 'Balenciaga', category: 'High Fashion', tagline: 'Paris Couture' },
  { id: 'valentino', name: 'Valentino', category: 'Luxury', tagline: 'Roma Heritage' },
  { id: 'versace', name: 'Versace', category: 'Luxury', tagline: 'Medusa Couture' },
  { id: 'calvin-klein', name: 'Calvin Klein', category: 'Designer', tagline: 'Modern Minimal' },
  { id: 'zara', name: 'Zara', category: 'Fashion', tagline: 'Global Retail' },

  // Casual Apparel
  { id: 'bershka', name: 'Bershka', category: 'Youth Fashion', tagline: 'Urban Style' },
  { id: 'pull-and-bear', name: 'Pull&Bear', category: 'Casual Wear', tagline: 'Daily Apparel' },
  { id: 'tommy-hilfiger', name: 'Tommy Hilfiger', category: 'Heritage', tagline: 'Classic American' },
  { id: 'guess', name: 'Guess', category: 'Denim', tagline: 'Est. 1981' },
  { id: 'gap', name: 'GAP', category: 'Casual', tagline: 'Clean Denim' },

  // Denim & Outdoor Tech
  { id: 'hollister', name: 'Hollister', category: 'Lifestyle', tagline: 'California Coast' },
  { id: 'lacoste', name: 'Lacoste', category: 'Sport Casual', tagline: 'Crocodile Touch' },
  { id: 'levis', name: "Levi's", category: 'Denim Heritage', tagline: 'Original 501' },
  { id: 'supreme', name: 'Supreme', category: 'Streetwear', tagline: 'New York City' },
  { id: 'the-north-face', name: 'The North Face', category: 'Outdoor Tech', tagline: 'Never Stop Exploring' },

  // Athletics & Skate
  { id: 'new-balance', name: 'New Balance', category: 'Athletics', tagline: 'Fearlessly Independent' },
  { id: 'under-armour', name: 'Under Armour', category: 'Performance', tagline: 'Protect This House' },
  { id: 'reebok', name: 'Reebok', category: 'Fitness', tagline: 'Vector Athletics' },
  { id: 'quiksilver', name: 'Quiksilver', category: 'Boardwear', tagline: 'Mountain & Wave' },
  { id: 'dc-shoes', name: 'DC Shoes', category: 'Skatewear', tagline: 'Defy Convention' },

  // Lifestyle & Global Icons
  { id: 'benetton', name: 'Benetton', category: 'Apparel', tagline: 'United Colors' },
  { id: 'forever-21', name: 'Forever 21', category: 'Fast Fashion', tagline: 'Daily Trends' },
  { id: 'playboy', name: 'Playboy', category: 'Lifestyle', tagline: 'Signature Icon' },
  { id: 'ny-yankees', name: 'NY Yankees', category: 'Sportswear', tagline: 'Major League' },
  { id: 'apple', name: 'Apple', category: 'Consumer Tech', tagline: 'Think Different' },

  // Global Tech & Automotive
  { id: 'tesla', name: 'Tesla', category: 'Automotive', tagline: 'Future Driven' },
  { id: 'amazon', name: 'Amazon', category: 'Marketplace', tagline: 'Delivering Smiles' },
  { id: 'starbucks', name: 'Starbucks', category: 'Beverages', tagline: 'Coffee Heritage' },
  { id: 'bmw', name: 'BMW', category: 'Automotive', tagline: 'Driving Pleasure' },
  { id: 'mercedes-benz', name: 'Mercedes-Benz', category: 'Automotive', tagline: 'The Best Or Nothing' },
];

/* =========================================================================
   MONOCHROME BRAND GLYPH COMPONENT
   ========================================================================= */

function BrandGlyph({ id }: { id: string }) {
  const commonClass = 'w-5 h-5 fill-slate-700 text-slate-700 stroke-none';

  switch (id) {
    case 'nike':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <path d="M21.7 4.2C13.2 8.3 5.4 14.3 2.3 17.5c-1.2 1.2-.9 2.5.6 2.5 1.5 0 4.1-.7 7.7-2.1 6.5-2.5 11.1-6.7 11.1-13.7z" />
        </svg>
      );
    case 'adidas':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <path d="M7.4 19.5L1.5 19.5 4.5 14.2 8.9 16.8z M12.8 19.5L7.9 19.5 12.3 11.8 15.8 13.8z M18.2 19.5L14.3 19.5 20.2 9.2 22.8 10.7z" />
        </svg>
      );
    case 'puma':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <path d="M19.5 5.5c-1.3-.8-2.6-.9-3.8-.4-.4.2-.7.5-.9.9-.4.7-.4 1.5-.1 2.2l-2.4 1.7c-1.1-.9-2.6-1.3-4-1-1.8.4-3.3 1.8-3.8 3.5-.3 1.1-.2 2.2.3 3.2.4.8 1 1.4 1.8 1.8l-1.4 1.4c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0l2.3-2.3c1.2.3 2.5.1 3.6-.5 1.4-.8 2.3-2.1 2.5-3.6l2.3-1.6c.7.2 1.5.1 2.2-.3.7-.4 1.1-1.1 1.1-1.9.1-1.8-1.2-3.7-3.2-4.5z" />
        </svg>
      );
    case 'jordan':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <path d="M14.5 3c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zm2.8 4.2l-3.2 3.1-2.1-1.8-4.5 3.2 1.2 1.5 3.5-2.5 2.1 1.8 4.6-4.5 1.2 1.4.9-.8-3.7-1.4z M11 13.5l-3.2 7.5h2.2l2.3-5.5 2.1 5.5h2.2L13.4 13.5z" />
        </svg>
      );
    case 'converse':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 4.2l1.6 3.4 3.7.5-2.7 2.6.6 3.7-3.2-1.7-3.2 1.7.6-3.7-2.7-2.6 3.7-.5z" />
        </svg>
      );
    case 'gucci':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <path d="M8.5 7C5.5 7 3 9.2 3 12s2.5 5 5.5 5c2.3 0 4.2-1.3 5-3.2h-2.3c-.6 1-1.6 1.6-2.7 1.6-1.9 0-3.4-1.5-3.4-3.4s1.5-3.4 3.4-3.4c1.1 0 2.1.6 2.7 1.6h2.3C12.7 8.3 10.8 7 8.5 7zm7 0c-2.3 0-4.2 1.3-5 3.2h2.3c.6-1 1.6-1.6 2.7-1.6 1.9 0 3.4 1.5 3.4 3.4s-1.5 3.4-3.4 3.4c-1.1 0-2.1-.6-2.7-1.6h-2.3c.8 1.9 2.7 3.2 5 3.2 3 0 5.5-2.2 5.5-5s-2.5-5-5.5-5z" />
        </svg>
      );
    case 'prada':
      return <div className="font-serif font-black text-[11px] tracking-[0.2em] text-slate-800">PRADA</div>;
    case 'dior':
      return <div className="font-serif font-black text-[11px] tracking-[0.25em] text-slate-800">DIOR</div>;
    case 'chanel':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <path d="M12 7.5c-2.8 0-5.1 1.8-5.8 4.2.7 2.4 3 4.2 5.8 4.2 1.2 0 2.3-.3 3.2-.9l-1.2-1.5c-.6.4-1.3.6-2 .6-1.9 0-3.5-1.1-4-2.4.5-1.3 2.1-2.4 4-2.4.7 0 1.4.2 2 .6l1.2-1.5c-.9-.6-2-0.9-3.2-.9zm0 0c2.8 0 5.1 1.8 5.8 4.2-.7 2.4-3 4.2-5.8 4.2-1.2 0-2.3-.3-3.2-.9l1.2-1.5c.6.4 1.3.6 2 .6 1.9 0 3.5-1.1 4-2.4-.5-1.3-2.1-2.4-4-2.4-.7 0-1.4.2-2 .6l-1.2-1.5c.9-.6 2-0.9 3.2-.9z" />
        </svg>
      );
    case 'louis-vuitton':
      return (
        <div className="font-serif font-black text-xs tracking-wider text-slate-800 flex items-center">
          <span className="text-sm">L</span>
          <span className="-ml-1 text-sm font-light">V</span>
        </div>
      );
    case 'balenciaga':
      return <div className="font-sans font-black text-[10px] tracking-[0.18em] text-slate-800 uppercase">Balenciaga</div>;
    case 'valentino':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <path d="M12 4C7.6 4 4 7.6 4 12s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 2c3.3 0 6 2.7 6 6 0 1.2-.4 2.4-1 3.3L12 7.8 7 15.3c-.6-.9-1-2.1-1-3.3 0-3.3 2.7-6 6-6zm0 10.2l2.3-3.7H9.7L12 16.2z" />
        </svg>
      );
    case 'versace':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 6.5c-2.5 0-4.5 1.8-4.5 4 0 1.5.9 2.8 2.2 3.5-.2.5-.5 1.1-.9 1.5 1-.2 2.1-.8 2.8-1.5.4.1.9.1 1.4.1 2.5 0 4.5-1.8 4.5-4s-2-3.6-4.5-3.6z" />
        </svg>
      );
    case 'calvin-klein':
      return <div className="font-sans font-light text-xs tracking-widest text-slate-800"><span className="font-bold">c</span>K</div>;
    case 'zara':
      return <div className="font-serif font-black text-xs tracking-tighter text-slate-900 scale-y-110">ZARA</div>;
    case 'bershka':
      return <div className="font-sans font-black text-[9.5px] tracking-[0.2em] text-slate-800 uppercase">Bershka</div>;
    case 'pull-and-bear':
      return <div className="font-sans font-extrabold text-[9px] tracking-wider text-slate-800 uppercase">Pull&Bear</div>;
    case 'tommy-hilfiger':
      return (
        <div className="flex items-center space-x-0.5 border border-slate-300 rounded px-1 py-0.5">
          <div className="w-2 h-2 bg-blue-900" />
          <div className="w-2 h-2 bg-red-600" />
          <div className="w-2 h-2 bg-blue-900" />
        </div>
      );
    case 'guess':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <polygon points="12,21 3,5 21,5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <text x="12" y="14" fontSize="8" fontWeight="bold" textAnchor="middle" fill="currentColor">?</text>
        </svg>
      );
    case 'gap':
      return <div className="border border-slate-700 font-serif font-bold text-[9px] px-1 py-0.5 tracking-widest text-slate-800">GAP</div>;
    case 'hollister':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <path d="M2.5 10.5c3.5-3 7-2 9.5 1.5 2.5-3.5 6-4.5 9.5-1.5-3 3-5.5 3-8.5.5-1-.8-1.5-.8-2 0-3 2.5-5.5 2.5-8.5-.5z" />
        </svg>
      );
    case 'lacoste':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <path d="M21 11c-1.5-.5-3.5-.5-5 0l-1.5-1.5c-2 0-3.5 1-4.5 2.5-1.5-.5-3.5-.5-5 .5l-2.5 2c0 1 1 1.5 2 1.5l2-.5c1.5 1 3.5 1.5 5.5 1 1.5.5 3.5.5 5-.5l3-1.5c1.5-.5 2-1.5 2-2.5-.5-.5-1-.7-1.5-.5z" />
        </svg>
      );
    case 'levis':
      return <div className="bg-red-700 text-white font-black text-[8.5px] px-1.5 py-0.5 rounded-xs tracking-tight">Levi's</div>;
    case 'supreme':
      return <div className="bg-red-600 text-white font-sans italic font-black text-[9px] px-1.5 py-0.5 tracking-tight">Supreme</div>;
    case 'the-north-face':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <path d="M12 4a8 8 0 0 0-8 8h3a5 5 0 0 1 5-5V4zm3 0a8 8 0 0 0-3 1.5v3.1A5 5 0 0 1 15 7V4zm3 0a8 8 0 0 0-3 2.8v3.3A5 5 0 0 1 18 10V4z" />
        </svg>
      );
    case 'new-balance':
      return <div className="font-sans italic font-black text-xs tracking-tighter text-slate-800">NB</div>;
    case 'under-armour':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <path d="M12 7c-3 0-5.5 2-6 5 1.5-1.5 3.5-2 6-2s4.5.5 6 2c-.5-3-3-5-6-5zm0 10c3 0 5.5-2 6-5-1.5 1.5-3.5 2-6 2s-4.5-.5-6-2c.5 3 3 5 6 5z" />
        </svg>
      );
    case 'reebok':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <path d="M3 14l8-4 10 4-5-2-5 2-8-0z M6 17l6-3 9 3-4-1.5-5 1.5-6-0z" />
        </svg>
      );
    case 'quiksilver':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <path d="M12 4l-8 14h16L12 4zm0 5l4 7H8l4-7z" />
        </svg>
      );
    case 'dc-shoes':
      return <div className="font-sans font-black text-xs tracking-tighter text-slate-800">DC<span className="text-[9px] ml-0.5">★</span></div>;
    case 'benetton':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <circle cx="9" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="15" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'forever-21':
      return <div className="font-sans font-extrabold text-[9px] tracking-widest text-slate-800">FOREVER 21</div>;
    case 'playboy':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <path d="M12 3c-1.5 0-2.5 1.5-2.5 3.5 0 1.5.5 3 1.5 4-.5 1-1.5 2-1.5 3.5 0 2 1.5 3.5 3.5 3.5s3.5-1.5 3.5-3.5c0-1.5-1-2.5-1.5-3.5 1-1 1.5-2.5 1.5-4 0-2-1-3.5-2.5-3.5-.5 1.5-1 3-2 3s-1.5-1.5-2-3z" />
        </svg>
      );
    case 'ny-yankees':
      return <div className="font-serif font-black text-xs tracking-tighter text-slate-800">NY</div>;
    case 'apple':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.41c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 0.6-2.65 1.36-.57.66-.99 1.72-.85 2.74 1.01.08 1.96-.5 2.58-1.25z" />
        </svg>
      );
    case 'tesla':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <path d="M12 5.5c2.8 0 5.4.7 7.5 2l.5-1.5C17.5 4.6 14.8 4 12 4s-5.5.6-8 2l.5 1.5c2.1-1.3 4.7-2 7.5-2zm0 3c-1.8 0-3.5.4-5 1.1l1.5 2.4c1-.5 2.2-.8 3.5-.8s2.5.3 3.5.8l1.5-2.4c-1.5-.7-3.2-1.1-5-1.1zm-1.2 4.2v7.3h2.4v-7.3c-.8-.1-1.6-.1-2.4 0z" />
        </svg>
      );
    case 'amazon':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <path d="M13.9 12.2c-.1.8-.7 1.2-1.5 1.2-1.1 0-1.7-.8-1.7-2.1 0-1.5.8-2.3 2-2.3.6 0 1 .2 1.2.6v2.6zm3.3 2.9c-.1-.3-.2-.8-.2-1.3-.6.9-1.5 1.5-2.6 1.5-1.9 0-3.3-1.4-3.3-3.7 0-2.4 1.5-3.8 3.5-3.8.9 0 1.7.4 2.2.9V6.2h2.2v8.9h-1.8zm-14.7 4c5.8 4 14.5 3.3 19.3-.9.3-.3.1-.7-.3-.6-4.4 2-13.8 2.5-18.7-1.1-.3-.2-.5.3-.3.6zm20-1.1c-.5-.7-2.1-.3-3.1-.1-.3.1-.3.4 0 .5 2.1.8 2.8 1.4 3 1.6.2.2.4 0 .3-.3-.1-.4-.1-1.1-.2-1.7z" />
        </svg>
      );
    case 'starbucks':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="12,7 13.5,10.5 17,11 14.5,13.5 15,17 12,15 9,17 9.5,13.5 7,11 10.5,10.5" fill="currentColor" />
        </svg>
      );
    case 'bmw':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.2" />
          <path d="M12 3a9 9 0 0 1 9 9h-9V3z M12 12v9a9 9 0 0 1-9-9h9z" fill="currentColor" opacity="0.3" />
        </svg>
      );
    case 'mercedes-benz':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 3v9l-7.8 4.5L12 12l7.8 4.5L12 12V3z" stroke="currentColor" strokeWidth="1.2" fill="none" />
        </svg>
      );
    default:
      return <div className="font-sans font-bold text-xs text-slate-700 uppercase">{id.slice(0, 3)}</div>;
  }
}

function ItemIcon({ type }: { type: ReviewCardData['icon'] }) {
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
    case 'sparkles': return <Sparkles className={className} />;
    default: return <CheckCircle2 className={className} />;
  }
}

/* =========================================================================
   6 MASONRY COLUMNS CONFIGURATION FOR THE OVERSIZED TILTED WALL
   ========================================================================= */

interface ColumnConfig {
  offsetY: number; // Vertical starting offset in px
  gap: number;
  width: number;
  cards: ReviewCardData[];
}

// Fixed positions for the 4-5 brand logos during Logo Scenes
interface LogoSlot {
  id: string;
  style: React.CSSProperties;
  responsiveClass: string;
}

const BRAND_SLOTS: LogoSlot[] = [
  // Top-Left perimeter
  { id: 'logo-tl', style: { top: '16%', left: '12%' }, responsiveClass: 'hidden sm:flex' },
  // Top-Right perimeter
  { id: 'logo-tr', style: { top: '16%', right: '12%' }, responsiveClass: 'hidden sm:flex' },
  // Mid-Left (flanking input field)
  { id: 'logo-ml', style: { top: '48%', left: '9%' }, responsiveClass: 'hidden lg:flex' },
  // Mid-Right (flanking input field)
  { id: 'logo-mr', style: { top: '48%', right: '9%' }, responsiveClass: 'hidden lg:flex' },
  // Bottom-Center anchor (safely below composer)
  { id: 'logo-bc', style: { bottom: '15%', left: '50%', transform: 'translateX(-50%)' }, responsiveClass: 'hidden md:flex' },
];

/* =========================================================================
   MAIN COMPONENT: TILTED CONTINUOUS REVIEW & BRAND WALL
   ========================================================================= */

export const Minimal3DMotionField: React.FC = () => {
  const [scene, setScene] = useState<'review' | 'logo'>('review');
  const [isCrossfading, setIsCrossfading] = useState(false);

  // Global Non-Repeating Used Logos Set
  const usedLogosRef = useRef<Set<string>>(new Set());
  const brandPointerRef = useRef<number>(0);

  // Current Active Brand Logo Scene (strictly 4-5 logos)
  const [activeBrands, setActiveBrands] = useState<BrandCardData[]>(() => ALL_BRANDS.slice(0, 5));

  // Pre-generate 6 masonry columns with controlled micro-variance
  const columns: ColumnConfig[] = useMemo(() => {
    const colDefinitions = [
      { offsetY: -40, gap: 24, width: 220 },
      { offsetY: 35, gap: 28, width: 240 },
      { offsetY: -15, gap: 22, width: 225 },
      { offsetY: 50, gap: 30, width: 250 },
      { offsetY: 10, gap: 24, width: 230 },
      { offsetY: -50, gap: 26, width: 235 },
    ];

    return colDefinitions.map((col, cIdx) => {
      // 4 cards per column to build a dense vertical slice
      const cards: ReviewCardData[] = [0, 1, 2, 3].map((cardIdx) => {
        const dataIndex = (cIdx * 3 + cardIdx) % REVIEW_POOL.length;
        const item = REVIEW_POOL[dataIndex];
        // Subtle micro-tilt: 0deg, -1deg, +1deg
        const microTilt = (cIdx + cardIdx) % 3 === 0 ? -1 : (cIdx + cardIdx) % 3 === 1 ? 1 : 0;
        return {
          ...item,
          id: `col-${cIdx}-card-${cardIdx}-${item.id}`,
          microTilt,
          width: col.width,
          height: 115 + ((cIdx * 7 + cardIdx * 11) % 25), // varied height 115px to 140px
        };
      });

      return {
        offsetY: col.offsetY,
        gap: col.gap,
        width: col.width,
        cards,
      };
    });
  }, []);

  // Continuous Alternating Scene Controller
  // Review scene: ~4.5s -> 1.2s crossfade -> Logo scene: ~4.0s -> 1.2s crossfade -> repeat
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const runSequence = () => {
      const displayDuration = scene === 'review' ? 4500 : 4000;
      const transitionDuration = 1200;

      timeoutId = setTimeout(() => {
        // Step 1: Start Crossfade (fade out + subtle blur)
        setIsCrossfading(true);

        setTimeout(() => {
          // Step 2: Swap Scene Content while obscured
          setScene((prev) => {
            if (prev === 'review') {
              // Select next 5 non-repeating brand logos
              const selected: BrandCardData[] = [];
              let ptr = brandPointerRef.current;

              for (let i = 0; i < 5; i++) {
                if (usedLogosRef.current.size >= ALL_BRANDS.length) {
                  // Cycle completed: reset pool
                  usedLogosRef.current.clear();
                  ptr = 0;
                }
                const brand = ALL_BRANDS[ptr % ALL_BRANDS.length];
                usedLogosRef.current.add(brand.id);
                selected.push(brand);
                ptr = (ptr + 1) % ALL_BRANDS.length;
              }

              brandPointerRef.current = ptr;
              setActiveBrands(selected);
              return 'logo';
            } else {
              return 'review';
            }
          });

          // Step 3: End Crossfade (smooth fade in to same positions)
          setIsCrossfading(false);
        }, transitionDuration);
      }, displayDuration);
    };

    runSequence();

    return () => clearTimeout(timeoutId);
  }, [scene]);

  return (
    <div
      aria-hidden="true"
      className="background-motion select-none pointer-events-none"
    >
      {/* 
        =======================================================================
        LARGE TILTED REVIEW CANVAS (145% width, 165% height, rotateZ(-5deg))
        Moving slowly via .animate-canvas-drift (26s translate3d cycle)
        =======================================================================
      */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[145%] h-[165%] flex items-center justify-center animate-canvas-drift transition-transform will-change-transform"
          style={{
            transformOrigin: 'center center',
          }}
        >
          {/* =================================================================
              REVIEW WALL SCENE (Dense editorial masonry columns)
             ================================================================= */}
          <div
            className="absolute inset-0 flex justify-center items-center gap-6 px-12 transition-all"
            style={{
              opacity: scene === 'review' && !isCrossfading ? 0.32 : 0,
              filter: isCrossfading ? 'blur(3px)' : 'blur(0px)',
              transition: 'opacity 1100ms cubic-bezier(0.4, 0, 0.2, 1), filter 1100ms cubic-bezier(0.4, 0, 0.2, 1)',
              visibility: scene === 'review' || isCrossfading ? 'visible' : 'hidden',
            }}
          >
            {columns.map((col, cIdx) => (
              <div
                key={`col-${cIdx}`}
                className="flex flex-col flex-shrink-0"
                style={{
                  width: `${col.width}px`,
                  gap: `${col.gap}px`,
                  transform: `translateY(${col.offsetY}px)`,
                }}
              >
                {col.cards.map((card) => (
                  <div
                    key={card.id}
                    className="rounded-[20px] p-3.5 border flex flex-col justify-between transition-transform duration-500"
                    style={{
                      width: `${card.width}px`,
                      minHeight: `${card.height}px`,
                      background: 'rgba(255, 255, 255, 0.82)',
                      border: '1px solid rgba(100, 110, 140, 0.13)',
                      boxShadow: '0 8px 30px rgba(40, 50, 80, 0.04)',
                      transform: `rotate(${card.microTilt}deg)`,
                      backdropFilter: 'blur(6px)',
                      WebkitBackdropFilter: 'blur(6px)',
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100/90 border border-slate-200/80 flex items-center justify-center flex-shrink-0">
                          <ItemIcon type={card.icon} />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[11px] font-bold text-slate-800 tracking-tight leading-none">
                            {card.category}
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium mt-0.5">
                            @{card.handle}
                          </span>
                        </div>
                      </div>
                      <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider">
                        {card.code}
                      </span>
                    </div>

                    {/* Quote */}
                    <p className="text-[11px] font-medium text-slate-700 leading-snug text-left line-clamp-2">
                      "{card.quote}"
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* =================================================================
              BRAND LOGO SCENE (4-5 logos in perimeter positions, -5deg angle)
             ================================================================= */}
          <div
            className="absolute inset-0 transition-all"
            style={{
              opacity: scene === 'logo' && !isCrossfading ? 0.36 : 0,
              filter: isCrossfading ? 'blur(3px)' : 'blur(0px)',
              transition: 'opacity 1100ms cubic-bezier(0.4, 0, 0.2, 1), filter 1100ms cubic-bezier(0.4, 0, 0.2, 1)',
              visibility: scene === 'logo' || isCrossfading ? 'visible' : 'hidden',
            }}
          >
            {BRAND_SLOTS.map((slot, idx) => {
              const brand = activeBrands[idx % activeBrands.length];
              if (!brand) return null;

              return (
                <div
                  key={slot.id}
                  className={`absolute ${slot.responsiveClass} items-center justify-center`}
                  style={slot.style}
                >
                  <div
                    className="w-[215px] sm:w-[235px] rounded-[20px] px-4 py-3 border flex items-center justify-between transition-transform duration-700"
                    style={{
                      background: 'rgba(255, 255, 255, 0.84)',
                      border: '1px solid rgba(100, 110, 140, 0.13)',
                      boxShadow: '0 8px 30px rgba(40, 50, 80, 0.04)',
                      backdropFilter: 'blur(6px)',
                      WebkitBackdropFilter: 'blur(6px)',
                      transform: 'scale(1.0)',
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center flex-shrink-0 text-slate-700 shadow-2xs">
                        <BrandGlyph id={brand.id} />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-slate-800 tracking-tight leading-tight">
                          {brand.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {brand.tagline}
                        </span>
                      </div>
                    </div>

                    <span className="text-[8.5px] uppercase tracking-wider text-slate-500 font-bold bg-slate-100/90 px-2 py-0.5 rounded-full border border-slate-200/60">
                      {brand.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
