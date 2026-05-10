'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// ── CSS matching original DSW Med-Learn dark forest theme ──
const CSS = `
:root{--forest:#0d2b1f;--sage:#1a4d35;--mint:#2d7a5a;--emerald:#3aaa7a;--gold:#d4a843;--cream:#f5f0e8;--paper:#faf8f3;--ink:#1a1a1a;--muted:#6b7b6e;--glass:rgba(255,255,255,0.06);--glow:rgba(58,170,122,0.15)}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Sans',sans-serif;background:var(--forest);color:var(--cream);overflow-x:hidden}
body::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:9999;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");opacity:0.4}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:var(--forest)}::-webkit-scrollbar-thumb{background:var(--emerald);border-radius:2px}

/* Nav */
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:1.2rem 4rem;display:flex;align-items:center;justify-content:space-between;background:rgba(13,43,31,0.85);backdrop-filter:blur(20px);border-bottom:1px solid rgba(58,170,122,0.1)}
.nav-logo{display:flex;align-items:center;gap:0.75rem;cursor:pointer}
.logo-icon{width:38px;height:38px;border-radius:10px;overflow:hidden;display:flex;align-items:center;justify-content:center}.logo-icon img{width:100%;height:100%;object-fit:cover;border-radius:10px}
.logo-text{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:700;background:linear-gradient(135deg,var(--emerald),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.logo-sub{font-size:0.65rem;color:var(--muted);letter-spacing:0.15em;text-transform:uppercase}
.nav-links{display:flex;gap:2rem;list-style:none}.nav-links a{color:rgba(245,240,232,0.7);text-decoration:none;font-size:0.875rem;font-weight:500;letter-spacing:0.02em;transition:color 0.2s}.nav-links a:hover{color:var(--emerald)}
.btn-back{display:flex;align-items:center;gap:0.5rem;padding:0.5rem 1.2rem;border:1px solid rgba(58,170,122,0.3);color:var(--cream);background:transparent;border-radius:8px;font-size:0.875rem;cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif}.btn-back:hover{border-color:var(--emerald);color:var(--emerald)}

/* Hero */
.lib-hero{padding:8rem 4rem 3rem;text-align:center;position:relative;overflow:hidden}
.lib-hero::before{content:'';position:absolute;width:600px;height:600px;background:radial-gradient(circle,rgba(58,170,122,0.12) 0%,transparent 70%);top:-200px;left:-100px;pointer-events:none;animation:drift 8s ease-in-out infinite alternate}
.lib-hero::after{content:'';position:absolute;width:400px;height:400px;background:radial-gradient(circle,rgba(212,168,67,0.08) 0%,transparent 70%);bottom:-100px;right:-50px;pointer-events:none;animation:drift 10s ease-in-out infinite alternate-reverse}
@keyframes drift{from{transform:translate(0,0)}to{transform:translate(30px,20px)}}
.lib-hero h1{font-family:'Playfair Display',serif;font-size:clamp(2.5rem,5vw,4rem);font-weight:900;line-height:1.1;margin-bottom:1rem;animation:fadeUp 0.8s ease both}.lib-hero h1 em{font-style:normal;background:linear-gradient(135deg,var(--emerald),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.lib-hero p{font-size:1.1rem;color:rgba(245,240,232,0.6);max-width:600px;margin:0 auto 2rem;line-height:1.7;animation:fadeUp 0.8s 0.1s ease both}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}

/* Global Search */
.search-bar-wrap{max-width:700px;margin:0 auto 3rem;position:relative;animation:fadeUp 0.8s 0.2s ease both}
.search-bar{width:100%;padding:1rem 1.5rem 1rem 3.2rem;background:rgba(255,255,255,0.04);border:1px solid rgba(58,170,122,0.25);border-radius:14px;color:var(--cream);font-size:1rem;font-family:'DM Sans',sans-serif;outline:none;transition:all 0.2s}.search-bar:focus{border-color:var(--emerald);box-shadow:0 0 0 3px rgba(58,170,122,0.1)}
.search-icon{position:absolute;left:1rem;top:50%;transform:translateY(-50%);font-size:1.1rem;opacity:0.5}
.search-btn{position:absolute;right:0.5rem;top:50%;transform:translateY(-50%);padding:0.55rem 1.3rem;background:var(--emerald);border:none;border-radius:10px;color:white;font-weight:600;font-size:0.85rem;cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif}.search-btn:hover{background:var(--gold);color:var(--forest)}
.search-results-dropdown{position:absolute;top:calc(100% + 4px);left:0;right:0;background:#0a1f12;border:1px solid rgba(58,170,122,0.2);border-radius:14px;max-height:400px;overflow-y:auto;z-index:50;display:none}
.search-results-dropdown.open{display:block;animation:fadeUp 0.2s ease}
.search-result-item{padding:0.9rem 1.2rem;border-bottom:1px solid rgba(255,255,255,0.04);cursor:pointer;transition:background 0.15s}.search-result-item:hover{background:rgba(58,170,122,0.08)}
.search-result-item:last-child{border-bottom:none}
.sr-type{font-size:0.65rem;font-family:'JetBrains Mono',monospace;color:var(--gold);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.2rem}
.sr-title{font-size:0.9rem;font-weight:600;margin-bottom:0.15rem}
.sr-excerpt{font-size:0.78rem;color:rgba(245,240,232,0.5);line-height:1.5}
.sr-section{font-size:0.7rem;font-family:'JetBrains Mono',monospace;color:var(--emerald);margin-top:0.25rem}

/* Stats bar */
.stats-bar{display:flex;justify-content:center;gap:3rem;margin-bottom:4rem;animation:fadeUp 0.8s 0.3s ease both}
.stat-item{text-align:center}.stat-num{font-family:'Playfair Display',serif;font-size:2rem;font-weight:700;background:linear-gradient(135deg,var(--emerald),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent}.stat-label{font-size:0.75rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em;margin-top:0.15rem}

/* Filter tabs */
.filter-bar{display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin-bottom:3rem;animation:fadeUp 0.8s 0.35s ease both}
.filter-chip{padding:0.45rem 1.1rem;background:rgba(255,255,255,0.04);border:1px solid rgba(58,170,122,0.15);border-radius:50px;font-size:0.8rem;cursor:pointer;transition:all 0.2s;color:rgba(245,240,232,0.6);font-family:'DM Sans',sans-serif}.filter-chip:hover{border-color:rgba(58,170,122,0.4);color:var(--cream)}.filter-chip.active{background:rgba(58,170,122,0.15);border-color:var(--emerald);color:var(--emerald)}

/* Section Grid */
.sections-wrap{padding:0 4rem 6rem;max-width:1300px;margin:0 auto}
.sections-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}
.section-card{background:var(--glass);border:1px solid rgba(58,170,122,0.1);border-radius:18px;padding:2rem;transition:all 0.3s;position:relative;overflow:hidden;cursor:pointer}
.section-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--emerald),transparent);opacity:0;transition:opacity 0.3s}
.section-card:hover{border-color:rgba(58,170,122,0.3);transform:translateY(-4px);background:rgba(58,170,122,0.05)}.section-card:hover::before{opacity:1}
.sc-icon{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin-bottom:1.2rem;border:1px solid rgba(58,170,122,0.15)}
.sc-title{font-size:1.1rem;font-weight:600;margin-bottom:0.5rem}
.sc-desc{font-size:0.82rem;color:rgba(245,240,232,0.5);line-height:1.6;margin-bottom:1.2rem}
.sc-meta{display:flex;gap:1rem;align-items:center;margin-bottom:1rem}
.sc-count{font-size:0.7rem;font-family:'JetBrains Mono',monospace;color:var(--emerald);background:rgba(58,170,122,0.1);padding:0.2rem 0.65rem;border-radius:4px;border:1px solid rgba(58,170,122,0.15)}
.sc-badge{font-size:0.65rem;font-family:'JetBrains Mono',monospace;padding:0.2rem 0.55rem;border-radius:4px}
.sc-badge.free{color:var(--emerald);background:rgba(58,170,122,0.1);border:1px solid rgba(58,170,122,0.2)}
.sc-badge.premium{color:var(--gold);background:rgba(212,168,67,0.1);border:1px solid rgba(212,168,67,0.2)}
.sc-actions{display:flex;gap:0.5rem}
.sc-btn{padding:0.4rem 1rem;border-radius:8px;font-size:0.78rem;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif;border:1px solid}
.sc-btn-open{background:var(--emerald);color:white;border-color:var(--emerald)}.sc-btn-open:hover{background:var(--gold);border-color:var(--gold);color:var(--forest)}
.sc-btn-search{background:transparent;color:var(--cream);border-color:rgba(58,170,122,0.25)}.sc-btn-search:hover{border-color:var(--emerald);color:var(--emerald)}

/* Detail Panel (overlay for section content) */
.detail-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);z-index:200;display:none;animation:fadeIn 0.2s ease}
.detail-overlay.open{display:flex;align-items:stretch;justify-content:center;padding:1rem}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.detail-panel{background:#0a1f12;border:1px solid rgba(58,170,122,0.2);border-radius:20px;width:100%;max-width:1100px;max-height:90vh;overflow:hidden;display:flex;flex-direction:column;animation:slideUp 0.3s ease}
@keyframes slideUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
.detail-header{padding:1.2rem 1.8rem;background:rgba(58,170,122,0.06);border-bottom:1px solid rgba(58,170,122,0.1);display:flex;justify-content:space-between;align-items:center;flex-shrink:0}
.detail-title{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:700;display:flex;align-items:center;gap:0.75rem}
.detail-close{background:none;border:none;color:var(--muted);font-size:1.5rem;cursor:pointer;transition:color 0.2s;line-height:1}.detail-close:hover{color:var(--cream)}
.detail-body{flex:1;overflow-y:auto;padding:1.8rem}

/* Detail search */
.detail-search{margin-bottom:1.5rem;position:relative}
.detail-search-input{width:100%;padding:0.75rem 1rem 0.75rem 2.6rem;background:rgba(255,255,255,0.04);border:1px solid rgba(58,170,122,0.2);border-radius:10px;color:var(--cream);font-size:0.9rem;font-family:'DM Sans',sans-serif;outline:none;transition:border-color 0.2s}.detail-search-input:focus{border-color:var(--emerald)}
.detail-search-icon{position:absolute;left:0.85rem;top:50%;transform:translateY(-50%);opacity:0.4;font-size:0.95rem}

/* Content items */
.content-list{display:flex;flex-direction:column;gap:0.75rem}
.content-item{background:rgba(255,255,255,0.03);border:1px solid rgba(58,170,122,0.08);border-radius:12px;padding:1.2rem 1.4rem;cursor:pointer;transition:all 0.2s}.content-item:hover{border-color:rgba(58,170,122,0.25);background:rgba(58,170,122,0.04)}
.ci-title{font-size:0.95rem;font-weight:600;margin-bottom:0.3rem;display:flex;align-items:center;gap:0.5rem}
.ci-tag{font-size:0.65rem;font-family:'JetBrains Mono',monospace;padding:0.15rem 0.5rem;border-radius:3px;background:rgba(58,170,122,0.1);color:var(--emerald);border:1px solid rgba(58,170,122,0.15)}
.ci-desc{font-size:0.82rem;color:rgba(245,240,232,0.5);line-height:1.6;margin-bottom:0.5rem}
.ci-meta{display:flex;gap:0.75rem;flex-wrap:wrap}
.ci-meta-item{font-size:0.7rem;font-family:'JetBrains Mono',monospace;color:var(--muted)}

/* Reading pane */
.reading-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.8);backdrop-filter:blur(10px);z-index:300;display:none;align-items:center;justify-content:center;padding:1.5rem}
.reading-overlay.open{display:flex;animation:fadeIn 0.2s ease}
.reading-pane{background:#0a1f12;border:1px solid rgba(58,170,122,0.2);border-radius:20px;width:100%;max-width:800px;max-height:85vh;overflow:hidden;display:flex;flex-direction:column;animation:slideUp 0.3s ease}
.reading-header{padding:1.2rem 1.8rem;background:rgba(58,170,122,0.06);border-bottom:1px solid rgba(58,170,122,0.1);display:flex;justify-content:space-between;align-items:center;flex-shrink:0}
.reading-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700}
.reading-actions{display:flex;gap:0.5rem}
.ra-btn{padding:0.35rem 0.85rem;border-radius:6px;font-size:0.75rem;cursor:pointer;border:1px solid;transition:all 0.2s;font-family:'DM Sans',sans-serif;background:transparent}
.ra-btn.bookmark{border-color:rgba(212,168,67,0.3);color:var(--gold)}.ra-btn.bookmark:hover{background:rgba(212,168,67,0.1)}
.ra-btn.bookmark.active{background:rgba(212,168,67,0.15);border-color:var(--gold)}
.ra-btn.note{border-color:rgba(58,170,122,0.3);color:var(--emerald)}.ra-btn.note:hover{background:rgba(58,170,122,0.1)}
.ra-btn.close{border-color:rgba(255,255,255,0.15);color:var(--muted)}.ra-btn.close:hover{color:var(--cream)}
.reading-body{flex:1;overflow-y:auto;padding:2rem}
.reading-body h3{font-family:'Playfair Display',serif;font-size:1.3rem;margin-bottom:1rem;color:var(--emerald)}
.reading-body h4{font-size:1rem;font-weight:600;margin:1.2rem 0 0.5rem;color:var(--gold)}
.reading-body p{font-size:0.9rem;line-height:1.8;color:rgba(245,240,232,0.75);margin-bottom:1rem}
.reading-body .highlight{background:rgba(212,168,67,0.15);padding:0.1rem 0.25rem;border-radius:3px;color:var(--gold)}
.reading-body .label{font-size:0.7rem;font-family:'JetBrains Mono',monospace;color:var(--emerald);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.3rem}

/* Notes modal */
.note-area{margin-top:1rem;background:rgba(255,255,255,0.03);border:1px solid rgba(58,170,122,0.15);border-radius:10px;padding:1rem}
.note-area textarea{width:100%;min-height:80px;background:transparent;border:none;color:var(--cream);font-family:'DM Sans',sans-serif;font-size:0.85rem;resize:vertical;outline:none}
.note-area textarea::placeholder{color:rgba(245,240,232,0.3)}
.note-save-btn{margin-top:0.5rem;padding:0.4rem 1rem;background:var(--emerald);border:none;border-radius:6px;color:white;font-size:0.8rem;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif}.note-save-btn:hover{background:var(--gold);color:var(--forest)}

/* Back to top */
.back-top{position:fixed;bottom:2rem;right:2rem;width:42px;height:42px;background:var(--emerald);border:none;border-radius:12px;color:white;font-size:1.1rem;cursor:pointer;display:none;align-items:center;justify-content:center;z-index:50;transition:all 0.2s;box-shadow:0 4px 15px rgba(58,170,122,0.3)}.back-top.visible{display:flex}.back-top:hover{background:var(--gold);transform:translateY(-2px)}

/* Responsive */
@media(max-width:900px){nav{padding:1rem 1.5rem}.nav-links{display:none}.lib-hero{padding:7rem 1.5rem 2rem}.sections-wrap{padding:0 1.5rem 4rem}.sections-grid{grid-template-columns:1fr 1fr}.stats-bar{gap:1.5rem;flex-wrap:wrap}}
@media(max-width:600px){.sections-grid{grid-template-columns:1fr}.stats-bar{gap:1rem}.detail-overlay.open{padding:0}.detail-panel{border-radius:0;max-height:100vh}.reading-overlay.open{padding:0}.reading-pane{border-radius:0;max-height:100vh}}
`;

// ── Section Definitions ──
const SECTION_DEFS = [
  { slug: 'organon', title: 'Organon of Medicine', icon: '📖', color: '#3aaa7a', desc: "Hahnemann's foundational work — aphorisms, editions & commentary", badge: 'Free Access' },
  { slug: 'materia-medica', title: 'Materia Medica', icon: '🧪', color: '#d4a843', desc: 'Complete remedy library from Boericke, Kent & Hahnemann', badge: 'Free Access' },
  { slug: 'repertory', title: 'Repertory', icon: '🔍', color: '#2d7a5a', desc: "Kent's Repertory with rubric search & remedy grades", badge: 'Premium' },
  { slug: 'chronic-diseases', title: 'Chronic Diseases', icon: '🔬', color: '#e05555', desc: "Hahnemann's miasmatic theory — Psora, Sycosis, Syphilis", badge: 'Free Access' },
  { slug: 'philosophy', title: 'Philosophy', icon: '🧠', color: '#8b5cf6', desc: 'Vital force, susceptibility, similia principle & follow-up', badge: 'Free Access' },
  { slug: 'therapeutics', title: 'Therapeutics', icon: '💊', color: '#3aaa7a', desc: 'Disease-wise therapeutic references & remedy selection', badge: 'Premium' },
  { slug: 'clinical-cases', title: 'Clinical Cases', icon: '🩺', color: '#d4a843', desc: 'Solved cases with rubrics, remedies & follow-up notes', badge: 'Premium' },
  { slug: 'disease-templates', title: 'Disease Templates', icon: '📋', color: '#2d7a5a', desc: 'Structured templates for common diseases', badge: 'Free Access' },
  { slug: 'remedy-relationships', title: 'Remedy Relationships', icon: '🔗', color: '#e05555', desc: 'Complementary, antidotes, inimicals & follows-well', badge: 'Free Access' },
  { slug: 'miasm-library', title: 'Miasm Library', icon: '🦠', color: '#8b5cf6', desc: 'Detailed notes on Psora, Sycosis, Syphilis & Tubercular', badge: 'Free Access' },
  { slug: 'bhms-notes', title: 'BHMS Notes', icon: '📝', color: '#3aaa7a', desc: 'Subject-wise academic notes for BHMS curriculum', badge: 'Free Access' },
  { slug: 'question-bank', title: 'Question Bank', icon: '❓', color: '#d4a843', desc: 'MCQs, viva questions & university exam papers', badge: 'Premium' },
];

type SearchResult = { type: string; section: string; id: string; title: string; excerpt: string };

export default function DigitalLibrary() {
  const router = useRouter();

  // ── State ──
  const [sections, setSections] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [detailSection, setDetailSection] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<any>(null);
  const [detailSearch, setDetailSearch] = useState('');
  const [readingItem, setReadingItem] = useState<any>(null);
  const [readingType, setReadingType] = useState('');
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [showNote, setShowNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [loading, setLoading] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Seed on mount ──
  useEffect(() => {
    fetch('/api/library/seed', { method: 'POST' }).catch(() => {});
  }, []);

  // ── Load sections ──
  useEffect(() => {
    fetch('/api/library')
      .then(r => r.json())
      .then(data => {
        if (data.sections) setSections(data.sections);
      })
      .catch(() => {});
  }, []);

  // ── Global search ──
  const doSearch = useCallback((q: string) => {
    if (!q.trim()) { setSearchResults([]); setSearchOpen(false); return; }
    fetch(`/api/library?search=${encodeURIComponent(q)}`)
      .then(r => r.json())
      .then(data => {
        setSearchResults(data.results || []);
        setSearchOpen(true);
      })
      .catch(() => {});
  }, []);

  const onSearchChange = (val: string) => {
    setSearchQuery(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => doSearch(val), 300);
  };

  // ── Open section detail ──
  const openSection = (slug: string) => {
    setLoading(true);
    setDetailSection(slug);
    setDetailSearch('');
    fetch(`/api/library?section=${slug}`)
      .then(r => r.json())
      .then(data => {
        setDetailData(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // ── Open reading item ──
  const openItem = async (type: string, id: string) => {
    try {
      const res = await fetch(`/api/library/item?type=${type}&id=${id}`);
      const data = await res.json();
      if (data.remedy) { setReadingItem(data.remedy); setReadingType('remedy'); }
      else if (data.aphorism) { setReadingItem(data.aphorism); setReadingType('aphorism'); }
      else if (data.case) { setReadingItem(data.case); setReadingType('case'); }
      else if (data.therapeutic) { setReadingItem(data.therapeutic); setReadingType('therapeutic'); }
      else if (data.template) { setReadingItem(data.template); setReadingType('template'); }
      else if (data.miasm) { setReadingItem(data.miasm); setReadingType('miasm'); }
      else if (data.note) { setReadingItem(data.note); setReadingType('bhms'); }
      else if (data.question) { setReadingItem(data.question); setReadingType('question'); }
      else if (data.rubric) { setReadingItem(data.rubric); setReadingType('rubric'); }
      setShowNote(false);
    } catch {}
  };

  // ── Toggle bookmark ──
  const toggleBookmark = (id: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // ── Filter sections ──
  const filteredSections = activeFilter === 'all'
    ? SECTION_DEFS
    : activeFilter === 'free'
      ? SECTION_DEFS.filter(s => s.badge === 'Free Access')
      : SECTION_DEFS.filter(s => s.badge === 'Premium');

  // ── Filter detail items by search ──
  const filterDetail = (items: any[], fields: string[]) => {
    if (!detailSearch.trim()) return items;
    const q = detailSearch.toLowerCase();
    return items.filter(item => fields.some(f => String(item[f] || '').toLowerCase().includes(q)));
  };

  // ── Count items for section ──
  const getItemCount = (slug: string) => {
    const s = sections.find(sec => sec.slug === slug);
    return s?.itemCount || 0;
  };

  // ── Render detail content by section ──
  const renderDetailContent = () => {
    if (!detailSection || !detailData) return null;

    switch (detailSection) {
      case 'organon': {
        const books = detailData as any[];
        return books.map((book: any) => (
          <div key={book.id} style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>{book.title} — {book.author} {book.edition ? `(${book.edition})` : ''}</h4>
            {book.chapters?.map((ch: any) => (
              <div key={ch.id} style={{ marginLeft: '1rem', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--cream)', marginBottom: '0.3rem' }}>
                  Chapter {ch.order}: {ch.title}
                </div>
                {ch.aphorisms?.map((aph: any) => (
                  <div key={aph.id} className="content-item" onClick={() => openItem('aphorism', aph.id)} style={{ marginLeft: '0.5rem', marginBottom: '0.5rem' }}>
                    <div className="ci-title">Aphorism {aph.number} <span className="ci-tag">{aph.title || 'Untitled'}</span></div>
                    <div className="ci-desc">{aph.originalText?.substring(0, 150)}...</div>
                    <div className="ci-meta"><span className="ci-meta-item">{aph.simplifiedExplanation ? 'Simplified' : ''}</span></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ));
      }

      case 'materia-medica': {
        const remedies = filterDetail(detailData as any[], ['name', 'essence', 'keynotes', 'mentalGenerals', 'clinicalUses']);
        return (
          <div className="content-list">
            {remedies.map((r: any) => (
              <div key={r.id} className="content-item" onClick={() => openItem('remedy', r.id)}>
                <div className="ci-title" style={{ color: 'var(--emerald)', fontFamily: "'Playfair Display',serif", fontSize: '1.05rem' }}>{r.name} <span className="ci-tag">{r.thermalState || ''}</span></div>
                <div className="ci-desc">{r.essence || r.keynotes || ''}</div>
                <div className="ci-meta">
                  {r.miasmaticTendency && <span className="ci-meta-item">Miasm: {r.miasmaticTendency}</span>}
                  {r.clinicalUses && <span className="ci-meta-item">Uses: {r.clinicalUses?.substring(0, 60)}...</span>}
                </div>
              </div>
            ))}
          </div>
        );
      }

      case 'repertory': {
        const { rubrics, chapters } = detailData as any;
        const filtered = filterDetail(rubrics, ['name', 'chapter']);
        return (
          <div className="content-list">
            {chapters.map((ch: string) => (
              <div key={ch} style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>{ch}</h4>
                {filtered.filter((r: any) => r.chapter === ch).map((r: any) => (
                  <div key={r.id} className="content-item" onClick={() => openItem('rubric', r.id)}>
                    <div className="ci-title">{r.name} <span className="ci-tag">Grade {r.grade}</span></div>
                    <div className="ci-desc">{r.remedy?.name || ''} — {r.synonyms || ''}</div>
                    {r.relatedRubrics && <div className="ci-meta"><span className="ci-meta-item">Related: {r.relatedRubrics}</span></div>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      }

      case 'chronic-diseases': {
        const { books, miasmNotes } = detailData as any;
        return (
          <div>
            {books?.map((b: any) => (
              <div key={b.id} style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>{b.title} — {b.author}</h4>
                {b.chapters?.map((ch: any) => (
                  <div key={ch.id} className="content-item">
                    <div className="ci-title">Chapter {ch.order}: {ch.title}</div>
                  </div>
                ))}
              </div>
            ))}
            {miasmNotes?.map((mn: any) => (
              <div key={mn.id} className="content-item" onClick={() => openItem('miasm', mn.id)}>
                <div className="ci-title">{mn.title} <span className="ci-tag">{mn.miasm}</span></div>
                <div className="ci-desc">{mn.description?.substring(0, 150)}...</div>
              </div>
            ))}
          </div>
        );
      }

      case 'philosophy': {
        const books = detailData as any[];
        return books.map((b: any) => (
          <div key={b.id} style={{ marginBottom: '1rem' }}>
            <h4 style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>{b.title} — {b.author}</h4>
            {b.chapters?.map((ch: any) => (
              <div key={ch.id} className="content-item">
                <div className="ci-title">Chapter {ch.order}: {ch.title}</div>
              </div>
            ))}
          </div>
        ));
      }

      case 'therapeutics': {
        const items = filterDetail(detailData as any[], ['disease', 'description', 'remedies']);
        return (
          <div className="content-list">
            {items.map((t: any) => (
              <div key={t.id} className="content-item" onClick={() => openItem('therapeutic', t.id)}>
                <div className="ci-title" style={{ color: 'var(--emerald)' }}>{t.disease}</div>
                <div className="ci-desc">{t.description || ''}</div>
                <div className="ci-meta"><span className="ci-meta-item">Remedies: {t.remedies?.substring(0, 80)}...</span></div>
              </div>
            ))}
          </div>
        );
      }

      case 'clinical-cases': {
        const items = filterDetail(detailData as any[], ['title', 'caseHistory', 'finalRemedy']);
        return (
          <div className="content-list">
            {items.map((c: any) => (
              <div key={c.id} className="content-item" onClick={() => openItem('case', c.id)}>
                <div className="ci-title">{c.title}</div>
                <div className="ci-desc">{c.caseHistory?.substring(0, 150)}...</div>
                <div className="ci-meta">
                  {c.finalRemedy && <span className="ci-meta-item">Remedy: {c.finalRemedy}</span>}
                  {c.characteristicSymptoms && <span className="ci-meta-item">Key: {c.characteristicSymptoms?.substring(0, 60)}...</span>}
                </div>
              </div>
            ))}
          </div>
        );
      }

      case 'disease-templates': {
        const items = filterDetail(detailData as any[], ['name', 'commonRemedies']);
        return (
          <div className="content-list">
            {items.map((d: any) => (
              <div key={d.id} className="content-item" onClick={() => openItem('disease', d.id)}>
                <div className="ci-title" style={{ color: 'var(--emerald)' }}>{d.name}</div>
                <div className="ci-desc">{d.characteristicSymptoms || ''}</div>
                <div className="ci-meta"><span className="ci-meta-item">Remedies: {d.commonRemedies || ''}</span></div>
              </div>
            ))}
          </div>
        );
      }

      case 'remedy-relationships': {
        const items = filterDetail(detailData as any[], ['name', 'remedyRelationships', 'compareRemedies']);
        return (
          <div className="content-list">
            {items.map((r: any) => (
              <div key={r.id} className="content-item">
                <div className="ci-title" style={{ color: 'var(--emerald)', fontFamily: "'Playfair Display',serif", fontSize: '1.05rem' }}>{r.name}</div>
                {r.remedyRelationships && <div className="ci-desc"><strong>Relationships:</strong> {r.remedyRelationships}</div>}
                {r.compareRemedies && <div className="ci-desc"><strong>Compare:</strong> {r.compareRemedies}</div>}
              </div>
            ))}
          </div>
        );
      }

      case 'miasm-library': {
        const items = filterDetail(detailData as any[], ['title', 'miasm', 'description']);
        return (
          <div className="content-list">
            {items.map((m: any) => (
              <div key={m.id} className="content-item" onClick={() => openItem('miasm', m.id)}>
                <div className="ci-title">{m.title} <span className="ci-tag">{m.miasm}</span></div>
                <div className="ci-desc">{m.description?.substring(0, 150)}...</div>
                {m.remedies && <div className="ci-meta"><span className="ci-meta-item">Remedies: {m.remedies}</span></div>}
              </div>
            ))}
          </div>
        );
      }

      case 'bhms-notes': {
        const { notes, subjects } = detailData as any;
        const filtered = filterDetail(notes, ['topic', 'subject', 'content']);
        return (
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {subjects.map((s: string) => (
                <span key={s} className="ci-tag" style={{ cursor: 'pointer' }}>{s}</span>
              ))}
            </div>
            <div className="content-list">
              {filtered.map((n: any) => (
                <div key={n.id} className="content-item" onClick={() => openItem('bhms', n.id)}>
                  <div className="ci-title">{n.topic} <span className="ci-tag">{n.subject}</span></div>
                  <div className="ci-desc">{n.content?.substring(0, 150)}...</div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'question-bank': {
        const { questions, types, subjects } = detailData as any;
        const filtered = filterDetail(questions, ['question', 'subject', 'type']);
        return (
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {types.map((t: string) => <span key={t} className="ci-tag">{t}</span>)}
              {subjects.map((s: string) => <span key={s} className="ci-tag" style={{ borderColor: 'rgba(212,168,67,0.3)', color: 'var(--gold)' }}>{s}</span>)}
            </div>
            <div className="content-list">
              {filtered.map((q: any) => (
                <div key={q.id} className="content-item" onClick={() => openItem('question', q.id)}>
                  <div className="ci-title">{q.question} <span className="ci-tag">{q.type}</span> <span className="ci-tag" style={{ borderColor: 'rgba(212,168,67,0.3)', color: 'var(--gold)' }}>{q.subject}</span></div>
                  {q.options && <div className="ci-desc">Options: {q.options.split('|').join(' | ')}</div>}
                  {q.answer && <div className="ci-meta"><span className="ci-meta-item" style={{ color: 'var(--emerald)' }}>Answer: {q.answer}</span></div>}
                </div>
              ))}
            </div>
          </div>
        );
      }

      default: return <p>Unknown section</p>;
    }
  };

  // ── Render reading pane content ──
  const renderReading = () => {
    if (!readingItem) return null;

    if (readingType === 'remedy') {
      const r = readingItem;
      return (
        <>
          <h3>{r.name}</h3>
          {r.essence && <><div className="label">Essence</div><p>{r.essence}</p></>}
          {r.sourceAuthors && <><div className="label">Source Authors</div><p>{r.sourceAuthors}</p></>}
          {r.mentalGenerals && <><h4>Mental Generals</h4><p>{r.mentalGenerals}</p></>}
          {r.physicalGenerals && <><h4>Physical Generals</h4><p>{r.physicalGenerals}</p></>}
          {r.modalities && <><h4>Modalities</h4><p>{r.modalities}</p></>}
          {r.desiresAversions && <><h4>Desires & Aversions</h4><p>{r.desiresAversions}</p></>}
          {r.thermalState && <><div className="label">Thermal State</div><p>{r.thermalState}</p></>}
          {r.sleepDreams && <><h4>Sleep & Dreams</h4><p>{r.sleepDreams}</p></>}
          {r.miasmaticTendency && <><div className="label">Miasmatic Tendency</div><p>{r.miasmaticTendency}</p></>}
          {r.keynotes && <><h4>Keynotes</h4><p>{r.keynotes}</p></>}
          {r.remedyRelationships && <><h4>Remedy Relationships</h4><p>{r.remedyRelationships}</p></>}
          {r.compareRemedies && <><h4>Compare Remedies</h4><p>{r.compareRemedies}</p></>}
          {r.clinicalUses && <><h4>Clinical Uses</h4><p>{r.clinicalUses}</p></>}
          {r.dosage && <><div className="label">Dosage</div><p>{r.dosage}</p></>}
          {r.rubrics?.length > 0 && (
            <><h4>Related Rubrics</h4>
            {r.rubrics.map((rub: any) => (
              <p key={rub.id} style={{ fontSize: '0.85rem', color: 'rgba(245,240,232,0.6)' }}>
                {rub.chapter} — {rub.name} (Grade {rub.grade})
              </p>
            ))}</>
          )}
        </>
      );
    }

    if (readingType === 'aphorism') {
      const a = readingItem;
      return (
        <>
          <h3>Aphorism {a.number}: {a.title || 'Untitled'}</h3>
          <div className="label">Original Text</div>
          <p style={{ fontStyle: 'italic', borderLeft: '3px solid var(--emerald)', paddingLeft: '1rem' }}>{a.originalText}</p>
          {a.simplifiedExplanation && <><h4>Simplified Explanation</h4><p>{a.simplifiedExplanation}</p></>}
          {a.commentary && <><h4>Commentary</h4><p>{a.commentary}</p></>}
          {a.relatedTopics && <><div className="label">Related Topics</div><p>{a.relatedTopics}</p></>}
          {a.tags && <><div className="label">Tags</div><p>{a.tags}</p></>}
        </>
      );
    }

    if (readingType === 'case') {
      const c = readingItem;
      return (
        <>
          <h3>{c.title}</h3>
          <div className="label">Case History</div><p>{c.caseHistory}</p>
          {c.characteristicSymptoms && <><h4>Characteristic Symptoms</h4><p>{c.characteristicSymptoms}</p></>}
          {c.rubricsUsed && <><h4>Rubrics Used</h4><p>{c.rubricsUsed}</p></>}
          {c.remediesConsidered && <><h4>Remedies Considered</h4><p>{c.remediesConsidered}</p></>}
          {c.finalRemedy && <><h4 style={{ color: 'var(--emerald)' }}>Final Remedy</h4><p>{c.finalRemedy}</p></>}
          {c.followUpNotes && <><h4>Follow-Up Notes</h4><p>{c.followUpNotes}</p></>}
          {c.tags && <><div className="label">Tags</div><p>{c.tags}</p></>}
        </>
      );
    }

    if (readingType === 'therapeutic') {
      const t = readingItem;
      return (
        <>
          <h3>{t.disease}</h3>
          {t.description && <><div className="label">Description</div><p>{t.description}</p></>}
          {t.remedies && <><h4>Remedies</h4><p>{t.remedies}</p></>}
          {t.rubrics && <><h4>Rubrics</h4><p>{t.rubrics}</p></>}
          {t.notes && <><h4>Clinical Notes</h4><p>{t.notes}</p></>}
          {t.tags && <><div className="label">Tags</div><p>{t.tags}</p></>}
        </>
      );
    }

    if (readingType === 'template') {
      const d = readingItem;
      return (
        <>
          <h3>{d.name}</h3>
          {d.importantQuestions && <><h4>Important Questions</h4><p>{d.importantQuestions}</p></>}
          {d.characteristicSymptoms && <><h4>Characteristic Symptoms</h4><p>{d.characteristicSymptoms}</p></>}
          {d.commonRubrics && <><h4>Common Rubrics</h4><p>{d.commonRubrics}</p></>}
          {d.commonRemedies && <><h4>Common Remedies</h4><p>{d.commonRemedies}</p></>}
          {d.tags && <><div className="label">Tags</div><p>{d.tags}</p></>}
        </>
      );
    }

    if (readingType === 'miasm') {
      const m = readingItem;
      return (
        <>
          <h3>{m.title}</h3>
          <div className="label">Miasm: {m.miasm}</div>
          <p>{m.description}</p>
          {m.remedies && <><h4>Key Remedies</h4><p>{m.remedies}</p></>}
          {m.notes && <><h4>Notes</h4><p>{m.notes}</p></>}
        </>
      );
    }

    if (readingType === 'bhms') {
      const n = readingItem;
      return (
        <>
          <h3>{n.topic}</h3>
          <div className="label">Subject: {n.subject}</div>
          <p>{n.content}</p>
          {n.tags && <><div className="label">Tags</div><p>{n.tags}</p></>}
        </>
      );
    }

    if (readingType === 'question') {
      const q = readingItem;
      return (
        <>
          <h3>{q.subject} — {q.type}</h3>
          <p><strong>Q:</strong> {q.question}</p>
          {q.options && <><h4>Options</h4>{q.options.split('|').map((opt: string, i: number) => (
            <p key={i} style={{ paddingLeft: '1rem', fontSize: '0.88rem', color: opt === q.answer ? 'var(--emerald)' : 'rgba(245,240,232,0.7)' }}>
              {String.fromCharCode(65 + i)}. {opt} {opt === q.answer ? '✓' : ''}
            </p>
          ))}</>}
          {q.answer && <><h4 style={{ color: 'var(--emerald)' }}>Answer</h4><p>{q.answer}</p></>}
          {q.explanation && <><h4>Explanation</h4><p>{q.explanation}</p></>}
          {q.year && <><div className="label">Year</div><p>{q.year}</p></>}
        </>
      );
    }

    if (readingType === 'rubric') {
      const r = readingItem;
      return (
        <>
          <h3>{r.name}</h3>
          <div className="label">Chapter: {r.chapter}</div>
          <p>Grade: {r.grade}</p>
          {r.synonyms && <><h4>Synonyms</h4><p>{r.synonyms}</p></>}
          {r.relatedRubrics && <><h4>Related Rubrics</h4><p>{r.relatedRubrics}</p></>}
          {r.remedy?.name && <><div className="label">Remedy</div><p>{r.remedy.name}</p></>}
        </>
      );
    }

    return <p>Content not available</p>;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Nav */}
      <nav>
        <div className="nav-logo" onClick={() => router.push('/')}>
          <div className="logo-icon"><img src="/logo.png" alt="DSW" /></div>
          <div>
            <div className="logo-text">DSW Med-Learn</div>
            <div className="logo-sub">Digital Library</div>
          </div>
        </div>
        <ul className="nav-links">
          <li><a href="#" onClick={e => { e.preventDefault(); router.push('/'); }}>Home</a></li>
          <li><a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Sections</a></li>
        </ul>
        <button className="btn-back" onClick={() => router.push('/')}>← Back to Home</button>
      </nav>

      {/* Hero */}
      <div className="lib-hero">
        <h1>Digital <em>Library</em></h1>
        <p>Complete homeopathic knowledge base — Organon, Materia Medica, Repertory, Clinical Cases, and more. Search across all sections, bookmark favorites, and take notes.</p>

        {/* Global Search */}
        <div className="search-bar-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-bar"
            placeholder="Search remedies, aphorisms, rubrics, cases..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            onFocus={() => { if (searchResults.length) setSearchOpen(true); }}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
          />
          <button className="search-btn" onClick={() => doSearch(searchQuery)}>Search</button>
          {searchOpen && searchResults.length > 0 && (
            <div className="search-results-dropdown open">
              {searchResults.map((r, i) => (
                <div key={i} className="search-result-item" onClick={() => { openItem(r.type === 'remedy' ? 'remedy' : r.type === 'aphorism' ? 'aphorism' : r.type === 'rubric' ? 'rubric' : r.type === 'case' ? 'case' : r.type === 'therapeutic' ? 'therapeutic' : r.type === 'template' ? 'disease' : r.type === 'miasm' ? 'miasm' : r.type === 'note' ? 'bhms' : r.type === 'question' ? 'question' : r.type, r.id); setSearchOpen(false); }}>
                  <div className="sr-type">{r.type}</div>
                  <div className="sr-title">{r.title}</div>
                  <div className="sr-excerpt">{r.excerpt?.substring(0, 120)}</div>
                  <div className="sr-section">{SECTION_DEFS.find(s => s.slug === r.section)?.title || r.section}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="stats-bar">
          <div className="stat-item"><div className="stat-num">12</div><div className="stat-label">Sections</div></div>
          <div className="stat-item"><div className="stat-num">10+</div><div className="stat-label">Remedies</div></div>
          <div className="stat-item"><div className="stat-num">7</div><div className="stat-label">Aphorisms</div></div>
          <div className="stat-item"><div className="stat-num">6+</div><div className="stat-label">Therapeutics</div></div>
          <div className="stat-item"><div className="stat-num">3</div><div className="stat-label">Clinical Cases</div></div>
        </div>

        {/* Filter */}
        <div className="filter-bar">
          <span className={`filter-chip ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>All Sections</span>
          <span className={`filter-chip ${activeFilter === 'free' ? 'active' : ''}`} onClick={() => setActiveFilter('free')}>Free Access</span>
          <span className={`filter-chip ${activeFilter === 'premium' ? 'active' : ''}`} onClick={() => setActiveFilter('premium')}>Premium</span>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="sections-wrap">
        <div className="sections-grid">
          {filteredSections.map((sec, i) => (
            <div key={sec.slug} className="section-card" style={{ animationDelay: `${i * 0.05}s` }} onClick={() => openSection(sec.slug)}>
              <div className="sc-icon" style={{ background: `${sec.color}15`, borderColor: `${sec.color}30` }}>{sec.icon}</div>
              <div className="sc-title">{sec.title}</div>
              <div className="sc-desc">{sec.desc}</div>
              <div className="sc-meta">
                <span className="sc-count">{getItemCount(sec.slug)} items</span>
                <span className={`sc-badge ${sec.badge === 'Free Access' ? 'free' : 'premium'}`}>{sec.badge}</span>
              </div>
              <div className="sc-actions">
                <button className="sc-btn sc-btn-open" onClick={e => { e.stopPropagation(); openSection(sec.slug); }}>Open</button>
                <button className="sc-btn sc-btn-search" onClick={e => { e.stopPropagation(); openSection(sec.slug); }}>Browse</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Detail Overlay */}
      {detailSection && (
        <div className="detail-overlay open" onClick={e => { if (e.target === e.currentTarget) { setDetailSection(null); setDetailData(null); } }}>
          <div className="detail-panel">
            <div className="detail-header">
              <div className="detail-title">
                <span>{SECTION_DEFS.find(s => s.slug === detailSection)?.icon}</span>
                {SECTION_DEFS.find(s => s.slug === detailSection)?.title}
              </div>
              <button className="detail-close" onClick={() => { setDetailSection(null); setDetailData(null); }}>✕</button>
            </div>
            <div className="detail-body">
              <div className="detail-search">
                <span className="detail-search-icon">🔍</span>
                <input
                  className="detail-search-input"
                  placeholder="Search within this section..."
                  value={detailSearch}
                  onChange={e => setDetailSearch(e.target.value)}
                />
              </div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>Loading...</div>
              ) : (
                renderDetailContent()
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reading Pane */}
      {readingItem && (
        <div className="reading-overlay open" onClick={e => { if (e.target === e.currentTarget) { setReadingItem(null); setReadingType(''); } }}>
          <div className="reading-pane">
            <div className="reading-header">
              <div className="reading-title">
                {readingType === 'remedy' && readingItem.name}
                {readingType === 'aphorism' && `Aphorism ${readingItem.number}`}
                {readingType === 'case' && readingItem.title}
                {readingType === 'therapeutic' && readingItem.disease}
                {readingType === 'template' && readingItem.name}
                {readingType === 'miasm' && readingItem.title}
                {readingType === 'bhms' && readingItem.topic}
                {readingType === 'question' && `${readingItem.subject} — ${readingItem.type}`}
                {readingType === 'rubric' && readingItem.name}
              </div>
              <div className="reading-actions">
                <button
                  className={`ra-btn bookmark ${bookmarks.has(readingItem.id) ? 'active' : ''}`}
                  onClick={() => toggleBookmark(readingItem.id)}
                >
                  {bookmarks.has(readingItem.id) ? '★ Bookmarked' : '☆ Bookmark'}
                </button>
                <button className="ra-btn note" onClick={() => setShowNote(!showNote)}>
                  📝 Note
                </button>
                <button className="ra-btn close" onClick={() => { setReadingItem(null); setReadingType(''); }}>✕</button>
              </div>
            </div>
            <div className="reading-body">
              {renderReading()}
              {showNote && (
                <div className="note-area">
                  <textarea
                    placeholder="Write your notes here..."
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                  />
                  <button className="note-save-btn" onClick={() => { /* TODO: save note via API */ }}>
                    Save Note
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Back to top */}
      <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
    </>
  );
}
