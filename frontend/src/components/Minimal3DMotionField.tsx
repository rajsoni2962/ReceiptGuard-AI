import React, { useState, useEffect, useRef } from 'react';
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
   TYPE DEFINITIONS
   ========================================================================= */

interface FeedbackItem {
  id: string;
  quote: string;
  category: string;
  handle: string;
  code: string;
  location: string;
  icon: 'shield' | 'calendar' | 'policy' | 'search' | 'edit' | 'archive' | 'calc' | 'camera' | 'lock' | 'sparkles';
}

interface BrandItem {
  id: string;
  name: string;
  category: string;
  tagline: string;
}

/* =========================================================================
   AUTHENTIC BRAND DATA POOL (40 BRANDS FROM SUPPLIED REFERENCE SHEETS)
   ========================================================================= */

const ALL_BRANDS: BrandItem[] = [
  // Scene 1: Athletic & Footwear
  { id: 'nike', name: 'Nike', category: 'Sportswear', tagline: 'Just Do It' },
  { id: 'adidas', name: 'Adidas', category: 'Sportswear', tagline: 'Impossible Is Nothing' },
  { id: 'puma', name: 'Puma', category: 'Sportswear', tagline: 'Forever Faster' },
  { id: 'jordan', name: 'Jordan', category: 'Footwear', tagline: 'Flight Heritage' },
  { id: 'converse', name: 'Converse', category: 'Footwear', tagline: 'All Star' },

  // Scene 2: Luxury Haute Couture
  { id: 'gucci', name: 'Gucci', category: 'Luxury', tagline: 'Firenze 1921' },
  { id: 'prada', name: 'Prada', category: 'Haute Couture', tagline: 'Milano 1913' },
  { id: 'dior', name: 'Dior', category: 'Haute Couture', tagline: 'Paris Heritage' },
  { id: 'chanel', name: 'Chanel', category: 'Luxury', tagline: 'Haute Couture' },
  { id: 'louis-vuitton', name: 'Louis Vuitton', category: 'Luxury', tagline: 'Maison Fondée' },

  // Scene 3: Contemporary High Fashion
  { id: 'balenciaga', name: 'Balenciaga', category: 'High Fashion', tagline: 'Paris Couture' },
  { id: 'valentino', name: 'Valentino', category: 'Luxury', tagline: 'Roma Heritage' },
  { id: 'versace', name: 'Versace', category: 'Luxury', tagline: 'Medusa Couture' },
  { id: 'calvin-klein', name: 'Calvin Klein', category: 'Designer', tagline: 'Modern Minimal' },
  { id: 'zara', name: 'Zara', category: 'Fashion', tagline: 'Global Retail' },

  // Scene 4: Casual & Lifestyle Apparel
  { id: 'bershka', name: 'Bershka', category: 'Youth Fashion', tagline: 'Urban Style' },
  { id: 'pull-and-bear', name: 'Pull&Bear', category: 'Casual Wear', tagline: 'Daily Apparel' },
  { id: 'tommy-hilfiger', name: 'Tommy Hilfiger', category: 'Heritage', tagline: 'Classic American' },
  { id: 'guess', name: 'Guess', category: 'Denim', tagline: 'Est. 1981' },
  { id: 'gap', name: 'GAP', category: 'Casual', tagline: 'Clean Denim' },

  // Scene 5: Denim, Surf & Outdoor Tech
  { id: 'hollister', name: 'Hollister', category: 'Lifestyle', tagline: 'California Coast' },
  { id: 'lacoste', name: 'Lacoste', category: 'Sport Casual', tagline: 'Crocodile Touch' },
  { id: 'levis', name: "Levi's", category: 'Denim Heritage', tagline: 'Original 501' },
  { id: 'supreme', name: 'Supreme', category: 'Streetwear', tagline: 'New York City' },
  { id: 'the-north-face', name: 'The North Face', category: 'Outdoor Tech', tagline: 'Never Stop Exploring' },

  // Scene 6: Athletics & Skate
  { id: 'new-balance', name: 'New Balance', category: 'Athletics', tagline: 'Fearlessly Independent' },
  { id: 'under-armour', name: 'Under Armour', category: 'Performance', tagline: 'Protect This House' },
  { id: 'reebok', name: 'Reebok', category: 'Fitness', tagline: 'Life Is Not A Spectator Sport' },
  { id: 'quiksilver', name: 'Quiksilver', category: 'Boardwear', tagline: 'Mountain & Wave' },
  { id: 'dc-shoes', name: 'DC Shoes', category: 'Skatewear', tagline: 'Defy Convention' },

  // Scene 7: Streetwear & Global Lifestyle
  { id: 'benetton', name: 'Benetton', category: 'Apparel', tagline: 'United Colors' },
  { id: 'forever-21', name: 'Forever 21', category: 'Fast Fashion', tagline: 'Daily Trends' },
  { id: 'playboy', name: 'Playboy', category: 'Lifestyle', tagline: 'Signature Icon' },
  { id: 'ny-yankees', name: 'NY Yankees', category: 'Sportswear', tagline: 'Major League' },
  { id: 'apple', name: 'Apple', category: 'Consumer Tech', tagline: 'Think Different' },

  // Scene 8: Global Tech, Automotive & Retail
  { id: 'tesla', name: 'Tesla', category: 'Automotive', tagline: 'Future Driven' },
  { id: 'amazon', name: 'Amazon', category: 'Marketplace', tagline: 'Delivering Smiles' },
  { id: 'starbucks', name: 'Starbucks', category: 'Beverages', tagline: 'Coffee Heritage' },
  { id: 'bmw', name: 'BMW', category: 'Automotive', tagline: 'Driving Pleasure' },
  { id: 'mercedes-benz', name: 'Mercedes-Benz', category: 'Automotive', tagline: 'The Best Or Nothing' },
];

/* =========================================================================
   15 AUTHENTIC RECEIPTGUARD REVIEWS
   ========================================================================= */

const ALL_REVIEWS: FeedbackItem[] = [
  {
    id: 'rev-1',
    quote: 'Return window was easy to track.',
    category: 'Return Guard',
    handle: 'returns',
    code: 'IN',
    location: 'Bengaluru',
    icon: 'calendar',
  },
  {
    id: 'rev-2',
    quote: 'The policy source made the answer clear.',
    category: 'Policy Evidence',
    handle: 'policy',
    code: 'IN',
    location: 'Mumbai',
    icon: 'policy',
  },
  {
    id: 'rev-3',
    quote: 'Editing before saving gave me confidence.',
    category: 'Draft Review',
    handle: 'verifier',
    code: 'IN',
    location: 'Pune',
    icon: 'edit',
  },
  {
    id: 'rev-4',
    quote: 'Original invoice preserved byte-for-byte.',
    category: 'Receipt Vault',
    handle: 'vault',
    code: 'IN',
    location: 'Delhi',
    icon: 'archive',
  },
  {
    id: 'rev-5',
    quote: 'Order status verified from the database.',
    category: 'Order Lookup',
    handle: 'orders',
    code: 'IN',
    location: 'Ahmedabad',
    icon: 'search',
  },
  {
    id: 'rev-6',
    quote: '30-day deadline flagged proactively.',
    category: 'Expiry Guard',
    handle: 'alerts',
    code: 'IN',
    location: 'Hyderabad',
    icon: 'shield',
  },
  {
    id: 'rev-7',
    quote: 'Wristwatch warranty calculated to the day.',
    category: 'Date Precision',
    handle: 'warranty',
    code: 'IN',
    location: 'Surat',
    icon: 'calc',
  },
  {
    id: 'rev-8',
    quote: 'Extracted all items from a wrinkled store bill.',
    category: 'Vision OCR',
    handle: 'scanner',
    code: 'IN',
    location: 'Chennai',
    icon: 'camera',
  },
  {
    id: 'rev-9',
    quote: 'Zero hallucinations when an order was missing.',
    category: 'Truth Anchor',
    handle: 'truth',
    code: 'IN',
    location: 'Jaipur',
    icon: 'lock',
  },
  {
    id: 'rev-10',
    quote: 'Two-page invoice handled with separate totals.',
    category: 'Multi-Section',
    handle: 'sections',
    code: 'IN',
    location: 'Kolkata',
    icon: 'policy',
  },
  {
    id: 'rev-11',
    quote: 'Evidence matched the purchase exactly.',
    category: 'Grounding',
    handle: 'grounded',
    code: 'IN',
    location: 'Gurugram',
    icon: 'shield',
  },
  {
    id: 'rev-12',
    quote: 'Warranty details were easy to find.',
    category: 'Asset Guard',
    handle: 'assets',
    code: 'IN',
    location: 'Noida',
    icon: 'calc',
  },
  {
    id: 'rev-13',
    quote: 'Return deadline calculator was deterministic.',
    category: 'Calculator',
    handle: 'math',
    code: 'IN',
    location: 'Chandigarh',
    icon: 'calc',
  },
  {
    id: 'rev-14',
    quote: 'Shopper-isolated vault protected my data.',
    category: 'Vector Privacy',
    handle: 'privacy',
    code: 'IN',
    location: 'Kochi',
    icon: 'lock',
  },
  {
    id: 'rev-15',
    quote: 'Verified store return policy in 3 seconds.',
    category: 'Instant Guard',
    handle: 'instant',
    code: 'IN',
    location: 'Indore',
    icon: 'sparkles',
  },
];

/* =========================================================================
   MONOCHROME BRAND GLYPH RENDERER (SUBTLE, MINIMAL SAAS STYLE)
   ========================================================================= */

function BrandGlyph({ id }: { id: string }) {
  const commonClass = 'w-6 h-6 fill-slate-700 text-slate-700 stroke-none';

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
      return (
        <div className="font-serif font-black text-xs tracking-[0.2em] text-slate-800">
          PRADA
        </div>
      );
    case 'dior':
      return (
        <div className="font-serif font-black text-xs tracking-[0.25em] text-slate-800">
          DIOR
        </div>
      );
    case 'chanel':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <path d="M12 7.5c-2.8 0-5.1 1.8-5.8 4.2.7 2.4 3 4.2 5.8 4.2 1.2 0 2.3-.3 3.2-.9l-1.2-1.5c-.6.4-1.3.6-2 .6-1.9 0-3.5-1.1-4-2.4.5-1.3 2.1-2.4 4-2.4.7 0 1.4.2 2 .6l1.2-1.5c-.9-.6-2-0.9-3.2-.9zm0 0c2.8 0 5.1 1.8 5.8 4.2-.7 2.4-3 4.2-5.8 4.2-1.2 0-2.3-.3-3.2-.9l1.2-1.5c.6.4 1.3.6 2 .6 1.9 0 3.5-1.1 4-2.4-.5-1.3-2.1-2.4-4-2.4-.7 0-1.4.2-2 .6l-1.2-1.5c.9-.6 2-0.9 3.2-.9z" />
        </svg>
      );
    case 'louis-vuitton':
      return (
        <div className="font-serif font-black text-xs tracking-wider text-slate-800 flex items-center space-x-0.5">
          <span className="text-sm">L</span>
          <span className="-ml-1 text-sm font-light">V</span>
        </div>
      );
    case 'balenciaga':
      return (
        <div className="font-sans font-black text-[11px] tracking-[0.18em] text-slate-800 uppercase">
          Balenciaga
        </div>
      );
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
      return (
        <div className="font-sans font-light text-xs tracking-widest text-slate-800">
          <span className="font-bold">c</span>K
        </div>
      );
    case 'zara':
      return (
        <div className="font-serif font-black text-sm tracking-tighter text-slate-900 scale-y-110">
          ZARA
        </div>
      );
    case 'bershka':
      return (
        <div className="font-sans font-black text-[10.5px] tracking-[0.2em] text-slate-800 uppercase">
          Bershka
        </div>
      );
    case 'pull-and-bear':
      return (
        <div className="font-sans font-extrabold text-[9.5px] tracking-wider text-slate-800 uppercase">
          Pull&Bear
        </div>
      );
    case 'tommy-hilfiger':
      return (
        <div className="flex items-center space-x-1 border border-slate-300 rounded px-1.5 py-0.5">
          <div className="w-2.5 h-2 bg-blue-900" />
          <div className="w-2.5 h-2 bg-red-600" />
          <div className="w-2.5 h-2 bg-blue-900" />
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
      return (
        <div className="border border-slate-700 font-serif font-bold text-[10px] px-1.5 py-0.5 tracking-widest text-slate-800">
          GAP
        </div>
      );
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
      return (
        <div className="bg-red-700 text-white font-black text-[9px] px-1.5 py-0.5 rounded-xs tracking-tight">
          Levi's
        </div>
      );
    case 'supreme':
      return (
        <div className="bg-red-600 text-white font-sans italic font-black text-[9.5px] px-1.5 py-0.5 tracking-tight">
          Supreme
        </div>
      );
    case 'the-north-face':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <path d="M12 4a8 8 0 0 0-8 8h3a5 5 0 0 1 5-5V4zm3 0a8 8 0 0 0-3 1.5v3.1A5 5 0 0 1 15 7V4zm3 0a8 8 0 0 0-3 2.8v3.3A5 5 0 0 1 18 10V4z" />
        </svg>
      );
    case 'new-balance':
      return (
        <div className="font-sans italic font-black text-xs tracking-tighter text-slate-800">
          NB
        </div>
      );
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
      return (
        <div className="font-sans font-black text-xs tracking-tighter text-slate-800 flex items-center">
          <span>DC</span>
          <span className="text-[9px] ml-0.5">★</span>
        </div>
      );
    case 'benetton':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <circle cx="9" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="15" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'forever-21':
      return (
        <div className="font-sans font-extrabold text-[10px] tracking-widest text-slate-800">
          FOREVER 21
        </div>
      );
    case 'playboy':
      return (
        <svg className={commonClass} viewBox="0 0 24 24">
          <path d="M12 3c-1.5 0-2.5 1.5-2.5 3.5 0 1.5.5 3 1.5 4-.5 1-1.5 2-1.5 3.5 0 2 1.5 3.5 3.5 3.5s3.5-1.5 3.5-3.5c0-1.5-1-2.5-1.5-3.5 1-1 1.5-2.5 1.5-4 0-2-1-3.5-2.5-3.5-.5 1.5-1 3-2 3s-1.5-1.5-2-3z" />
        </svg>
      );
    case 'ny-yankees':
      return (
        <div className="font-serif font-black text-xs tracking-tighter text-slate-800">
          NY
        </div>
      );
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
      return (
        <div className="font-sans font-bold text-xs text-slate-700 uppercase">
          {id.slice(0, 3)}
        </div>
      );
  }
}

function ItemIcon({ type }: { type: FeedbackItem['icon'] }) {
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

/* =========================================================================
   FIXED PERIMETER POSITIONS (DO NOT RANDOMIZE — PROTECT THE CENTER)
   ========================================================================= */

interface SlotDefinition {
  id: string;
  style: React.CSSProperties;
  responsiveClass: string;
  floatDelay: string;
}

const FIXED_SLOTS: SlotDefinition[] = [
  // Slot A: Top-Left Perimeter
  {
    id: 'slot-top-left',
    style: { top: '10%', left: '7%' },
    responsiveClass: 'hidden sm:flex',
    floatDelay: '0s',
  },
  // Slot B: Top-Right Perimeter
  {
    id: 'slot-top-right',
    style: { top: '10%', right: '7%' },
    responsiveClass: 'hidden sm:flex',
    floatDelay: '1.2s',
  },
  // Slot C: Mid-Left Perimeter (Flanking the AI Composer)
  {
    id: 'slot-mid-left',
    style: { top: '48%', left: '5%' },
    responsiveClass: 'hidden lg:flex',
    floatDelay: '2.4s',
  },
  // Slot D: Mid-Right Perimeter (Flanking the AI Composer)
  {
    id: 'slot-mid-right',
    style: { top: '48%', right: '5%' },
    responsiveClass: 'hidden lg:flex',
    floatDelay: '0.8s',
  },
  // Slot E: Bottom-Center Anchor (Safely below composer)
  {
    id: 'slot-bottom-center',
    style: { bottom: '8%', left: '50%', transform: 'translateX(-50%)' },
    responsiveClass: 'hidden md:flex',
    floatDelay: '1.8s',
  },
];

/* =========================================================================
   MAIN COMPONENT: SCENE-ALTERNATING HERO MOTION BACKGROUND
   ========================================================================= */

export const Minimal3DMotionField: React.FC = () => {
  const [sceneType, setSceneType] = useState<'review' | 'brand'>('review');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Global Non-Repeating Cycle Trackers
  const usedLogosRef = useRef<Set<string>>(new Set());
  const brandIndexRef = useRef<number>(0);
  const reviewIndexRef = useRef<number>(0);

  // Current Scene Active Items (Exactly 5 items for the 5 fixed slots)
  const [currentReviews, setCurrentReviews] = useState<FeedbackItem[]>(() =>
    ALL_REVIEWS.slice(0, 5)
  );
  const [currentBrands, setCurrentBrands] = useState<BrandItem[]>(() =>
    ALL_BRANDS.slice(0, 5)
  );

  // Core Alternating Timer (Visible ~4 seconds, followed by 600ms smooth transition)
  useEffect(() => {
    const sceneDuration = 4000; // 4 seconds visible
    const transitionDuration = 600; // 0.6s smooth transition

    const interval = setInterval(() => {
      // Step 1: Trigger Fade-Out & Slight Blur
      setIsTransitioning(true);

      setTimeout(() => {
        // Step 2: Swap Content while invisible
        setSceneType((prevType) => {
          if (prevType === 'review') {
            // Transitioning to BRAND LOGO SCENE:
            // Select exactly 5 distinct non-repeating brands
            const selected: BrandItem[] = [];
            let pointer = brandIndexRef.current;

            for (let i = 0; i < 5; i++) {
              if (usedLogosRef.current.size >= ALL_BRANDS.length) {
                // When entire pool is exhausted, start a deliberate new cycle
                usedLogosRef.current.clear();
                pointer = 0;
              }

              const brand = ALL_BRANDS[pointer % ALL_BRANDS.length];
              usedLogosRef.current.add(brand.id);
              selected.push(brand);
              pointer = (pointer + 1) % ALL_BRANDS.length;
            }

            brandIndexRef.current = pointer;
            setCurrentBrands(selected);
            return 'brand';
          } else {
            // Transitioning to REVIEW SCENE:
            // Select next 5 reviews sequentially
            const nextReviewIndex = (reviewIndexRef.current + 5) % ALL_REVIEWS.length;
            reviewIndexRef.current = nextReviewIndex;

            const selected: FeedbackItem[] = [];
            for (let i = 0; i < 5; i++) {
              selected.push(ALL_REVIEWS[(nextReviewIndex + i) % ALL_REVIEWS.length]);
            }
            setCurrentReviews(selected);
            return 'review';
          }
        });

        // Step 3: Fade-In new content into SAME positions
        setIsTransitioning(false);
      }, transitionDuration);
    }, sceneDuration + transitionDuration);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="hero-animation-layer absolute inset-0 overflow-hidden pointer-events-none select-none z-0 bg-transparent"
    >
      {/* 5 Fixed Perimeter Slots — Content changes, Positions NEVER change */}
      {FIXED_SLOTS.map((slot, index) => {
        const reviewItem = currentReviews[index % currentReviews.length];
        const brandItem = currentBrands[index % currentBrands.length];
        const isHovered =
          (sceneType === 'review' && hoveredCardId === reviewItem?.id) ||
          (sceneType === 'brand' && hoveredCardId === brandItem?.id);

        return (
          <div
            key={slot.id}
            className={`absolute ${slot.responsiveClass} pointer-events-auto items-center justify-center`}
            style={slot.style}
          >
            {/* Subtle Vertical Floating Idle Animation */}
            <div
              className="animate-subtle-float transition-transform duration-300"
              style={{
                animationDelay: slot.floatDelay,
                animationPlayState: hoveredCardId ? 'paused' : 'running',
              }}
            >
              {/* Scene Card Transition Container */}
              <div
                style={{
                  opacity: isTransitioning ? 0 : isHovered ? 1.0 : 0.88,
                  filter: isTransitioning ? 'blur(6px)' : 'blur(0px)',
                  transform: isTransitioning
                    ? 'scale(0.96) translateY(4px)'
                    : isHovered
                    ? 'scale(1.04) translateY(-2px)'
                    : 'scale(1.0)',
                  transition:
                    'opacity 550ms cubic-bezier(0.4, 0, 0.2, 1), filter 550ms cubic-bezier(0.4, 0, 0.2, 1), transform 550ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {sceneType === 'review' ? (
                  /* ================= REVIEW CARD SCENE ================= */
                  <div
                    onMouseEnter={() => setHoveredCardId(reviewItem.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                    className="w-[215px] sm:w-[235px] rounded-[20px] p-4 cursor-default border flex flex-col justify-between"
                    style={{
                      background: 'rgba(255, 255, 255, 0.92)',
                      border: isHovered
                        ? '1px solid rgba(99, 102, 241, 0.4)'
                        : '1px solid rgba(15, 23, 42, 0.09)',
                      boxShadow: isHovered
                        ? '0 16px 36px -4px rgba(15, 23, 42, 0.12)'
                        : '0 10px 25px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.03)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-50 to-purple-50 border border-indigo-200/80 flex items-center justify-center flex-shrink-0 shadow-2xs">
                          <ItemIcon type={reviewItem.icon} />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-bold text-slate-900 tracking-tight leading-none">
                            {reviewItem.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                            @{reviewItem.handle}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        {reviewItem.code}
                      </span>
                    </div>

                    {/* Quote */}
                    <p className="text-[12px] font-semibold text-slate-700 leading-snug text-left">
                      "{reviewItem.quote}"
                    </p>
                  </div>
                ) : (
                  /* ================= BRAND LOGO SCENE ================= */
                  <div
                    onMouseEnter={() => setHoveredCardId(brandItem.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                    className="w-[215px] sm:w-[235px] rounded-[20px] px-4 py-3.5 cursor-default border flex items-center justify-between"
                    style={{
                      background: 'rgba(255, 255, 255, 0.92)',
                      border: isHovered
                        ? '1px solid rgba(99, 102, 241, 0.4)'
                        : '1px solid rgba(15, 23, 42, 0.09)',
                      boxShadow: isHovered
                        ? '0 16px 36px -4px rgba(15, 23, 42, 0.12)'
                        : '0 10px 25px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.03)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Monochrome Brand Mark Container */}
                      <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center flex-shrink-0 text-slate-700 shadow-2xs">
                        <BrandGlyph id={brandItem.id} />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-slate-800 tracking-tight leading-tight">
                          {brandItem.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {brandItem.tagline}
                        </span>
                      </div>
                    </div>

                    {/* Subtle Category Pill */}
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold bg-slate-100/90 px-2 py-0.5 rounded-full border border-slate-200/60">
                      {brandItem.category}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
