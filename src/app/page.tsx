'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ── CSS (exact copy from original) ──
const CSS = `
:root{--forest:#0d2b1f;--sage:#1a4d35;--mint:#2d7a5a;--emerald:#3aaa7a;--gold:#d4a843;--cream:#f5f0e8;--paper:#faf8f3;--ink:#1a1a1a;--muted:#6b7b6e;--glass:rgba(255,255,255,0.06);--glow:rgba(58,170,122,0.15)}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Sans',sans-serif;background:var(--forest);color:var(--cream);overflow-x:hidden;cursor:default}
body::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:9999;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");opacity:0.4}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:var(--forest)}::-webkit-scrollbar-thumb{background:var(--emerald);border-radius:2px}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:1.2rem 4rem;display:flex;align-items:center;justify-content:space-between;background:rgba(13,43,31,0.85);backdrop-filter:blur(20px);border-bottom:1px solid rgba(58,170,122,0.1)}
.nav-logo{display:flex;align-items:center;gap:0.75rem}
.logo-icon{width:38px;height:38px;border-radius:10px;overflow:hidden;display:flex;align-items:center;justify-content:center}.logo-icon img{width:100%;height:100%;object-fit:cover;border-radius:10px}
.logo-text{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:700;background:linear-gradient(135deg,var(--emerald),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.logo-sub{font-size:0.65rem;color:var(--muted);letter-spacing:0.15em;text-transform:uppercase}
.nav-links{display:flex;gap:2rem;list-style:none}.nav-links a{color:rgba(245,240,232,0.7);text-decoration:none;font-size:0.875rem;font-weight:500;letter-spacing:0.02em;transition:color 0.2s}.nav-links a:hover{color:var(--emerald)}
.nav-actions{display:flex;gap:1rem}
.btn-ghost{padding:0.5rem 1.2rem;border:1px solid rgba(58,170,122,0.3);color:var(--cream);background:transparent;border-radius:8px;font-size:0.875rem;cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif}.btn-ghost:hover{border-color:var(--emerald);color:var(--emerald)}
.btn-primary{padding:0.5rem 1.4rem;background:var(--emerald);color:var(--forest);border:none;border-radius:8px;font-size:0.875rem;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif}.btn-primary:hover{background:var(--gold);transform:translateY(-1px)}
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8rem 4rem 4rem;position:relative;overflow:hidden;text-align:center}
.hero::before{content:'';position:absolute;width:700px;height:700px;background:radial-gradient(circle,rgba(58,170,122,0.12) 0%,transparent 70%);top:-100px;left:-200px;pointer-events:none;animation:drift 8s ease-in-out infinite alternate}
.hero::after{content:'';position:absolute;width:500px;height:500px;background:radial-gradient(circle,rgba(212,168,67,0.08) 0%,transparent 70%);bottom:-50px;right:-100px;pointer-events:none;animation:drift 10s ease-in-out infinite alternate-reverse}
@keyframes drift{from{transform:translate(0,0)}to{transform:translate(30px,20px)}}
.hero-badge{display:inline-flex;align-items:center;gap:0.5rem;background:rgba(58,170,122,0.1);border:1px solid rgba(58,170,122,0.25);padding:0.4rem 1rem;border-radius:50px;font-size:0.8rem;color:var(--emerald);margin-bottom:2rem;animation:fadeUp 0.8s ease both}.hero-badge span{font-size:0.7rem;font-family:'JetBrains Mono',monospace}
.hero h1{font-family:'Playfair Display',serif;font-size:clamp(3rem,7vw,6rem);font-weight:900;line-height:1.05;margin-bottom:1.5rem;animation:fadeUp 0.8s 0.1s ease both}.hero h1 em{font-style:normal;background:linear-gradient(135deg,var(--emerald) 0%,var(--gold) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{font-size:1.15rem;color:rgba(245,240,232,0.65);max-width:600px;line-height:1.75;margin-bottom:3rem;animation:fadeUp 0.8s 0.2s ease both}
.hero-cta{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;animation:fadeUp 0.8s 0.3s ease both}
.btn-hero{padding:0.9rem 2.2rem;border-radius:12px;font-size:1rem;font-weight:600;cursor:pointer;transition:all 0.25s;font-family:'DM Sans',sans-serif}
.btn-hero-main{background:linear-gradient(135deg,var(--emerald),#2d8a60);color:white;border:none;box-shadow:0 8px 30px rgba(58,170,122,0.35)}.btn-hero-main:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(58,170,122,0.45)}
.btn-hero-sec{background:transparent;color:var(--cream);border:1px solid rgba(245,240,232,0.2)}.btn-hero-sec:hover{border-color:var(--gold);color:var(--gold)}
.hero-stats{display:flex;gap:4rem;margin-top:5rem;justify-content:center;animation:fadeUp 0.8s 0.4s ease both}
.stat{text-align:center}.stat-num{font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:700;background:linear-gradient(135deg,var(--emerald),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent}.stat-label{font-size:0.8rem;color:var(--muted);margin-top:0.2rem;text-transform:uppercase;letter-spacing:0.1em}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
section{padding:6rem 4rem}.section-tag{font-size:0.75rem;font-family:'JetBrains Mono',monospace;color:var(--emerald);letter-spacing:0.2em;text-transform:uppercase;margin-bottom:1rem;display:block}.section-title{font-family:'Playfair Display',serif;font-size:clamp(2rem,4vw,3rem);font-weight:700;line-height:1.15;margin-bottom:1.2rem}.section-sub{color:rgba(245,240,232,0.6);font-size:1.05rem;line-height:1.7;max-width:560px}.section-header{margin-bottom:4rem}
.ai-section{background:linear-gradient(180deg,var(--forest) 0%,#071a10 100%);position:relative}.ai-inner{display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:start;max-width:1200px;margin:0 auto}
.ai-chat-window{background:rgba(255,255,255,0.04);border:1px solid rgba(58,170,122,0.15);border-radius:20px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,0.4)}
.chat-header{padding:1rem 1.5rem;background:rgba(58,170,122,0.08);border-bottom:1px solid rgba(58,170,122,0.1);display:flex;align-items:center;gap:0.75rem}
.chat-avatar{width:36px;height:36px;background:linear-gradient(135deg,var(--emerald),var(--gold));border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.1rem}
.chat-name{font-weight:600;font-size:0.9rem}.chat-status{font-size:0.75rem;color:var(--emerald)}
.dot-live{width:7px;height:7px;background:var(--emerald);border-radius:50%;display:inline-block;margin-right:4px;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
.chat-messages{padding:1.5rem;display:flex;flex-direction:column;gap:1rem;min-height:320px;max-height:400px;overflow-y:auto}
.msg{max-width:85%;animation:fadeUp 0.5s ease}.msg-bot{background:rgba(58,170,122,0.1);border:1px solid rgba(58,170,122,0.15);border-radius:4px 16px 16px 16px;padding:0.9rem 1.1rem;font-size:0.88rem;line-height:1.65}
.msg-user{margin-left:auto;background:rgba(212,168,67,0.12);border:1px solid rgba(212,168,67,0.2);border-radius:16px 4px 16px 16px;padding:0.9rem 1.1rem;font-size:0.88rem}
.msg-ref{font-family:'JetBrains Mono',monospace;font-size:0.72rem;color:var(--emerald);margin-top:0.5rem;opacity:0.8}
.chat-input-row{padding:1rem 1.5rem;border-top:1px solid rgba(58,170,122,0.1);display:flex;gap:0.75rem;align-items:center}
.chat-input{flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(58,170,122,0.2);border-radius:10px;padding:0.7rem 1rem;color:var(--cream);font-family:'DM Sans',sans-serif;font-size:0.88rem;outline:none;transition:border-color 0.2s}.chat-input:focus{border-color:var(--emerald)}.chat-input::placeholder{color:rgba(245,240,232,0.3)}
.chat-send{width:38px;height:38px;background:var(--emerald);border:none;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;font-size:1rem}.chat-send:hover{background:var(--gold);transform:scale(1.05)}
.typing-indicator{display:flex;gap:4px;align-items:center;padding:0.5rem 0}.typing-dot{width:7px;height:7px;background:var(--emerald);border-radius:50%;animation:typingBounce 1.4s infinite ease-in-out}.typing-dot:nth-child(2){animation-delay:0.2s}.typing-dot:nth-child(3){animation-delay:0.4s}
@keyframes typingBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
.modules-section{background:#071a10}.modules-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;max-width:1200px;margin:0 auto}
.module-card{background:var(--glass);border:1px solid rgba(58,170,122,0.1);border-radius:18px;padding:2rem;transition:all 0.3s;position:relative;overflow:hidden;cursor:default}.module-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--emerald),transparent);opacity:0;transition:opacity 0.3s}.module-card:hover{border-color:rgba(58,170,122,0.3);transform:translateY(-4px);background:rgba(58,170,122,0.05)}.module-card:hover::before{opacity:1}
.module-card.featured{background:linear-gradient(135deg,rgba(58,170,122,0.1),rgba(212,168,67,0.05));border-color:rgba(58,170,122,0.25);grid-column:span 1}
.module-icon{width:50px;height:50px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;margin-bottom:1.2rem;background:rgba(58,170,122,0.1);border:1px solid rgba(58,170,122,0.15)}
.module-card h3{font-size:1.05rem;font-weight:600;margin-bottom:0.5rem}.module-card p{font-size:0.85rem;color:rgba(245,240,232,0.55);line-height:1.6}
.module-tag{display:inline-block;margin-top:1rem;font-size:0.7rem;font-family:'JetBrains Mono',monospace;padding:0.25rem 0.75rem;border-radius:4px;background:rgba(58,170,122,0.1);color:var(--emerald);border:1px solid rgba(58,170,122,0.2)}.module-tag.premium{background:rgba(212,168,67,0.1);color:var(--gold);border-color:rgba(212,168,67,0.2)}
.exam-section{background:var(--forest);display:flex;align-items:center;justify-content:center}.exam-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:center}
.exam-demo{background:rgba(255,255,255,0.03);border:1px solid rgba(58,170,122,0.15);border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.3)}
.exam-topbar{padding:1rem 1.5rem;background:rgba(58,170,122,0.08);border-bottom:1px solid rgba(58,170,122,0.1);display:flex;justify-content:space-between;align-items:center}
.exam-title-sm{font-size:0.85rem;font-weight:600}.timer-display{font-family:'JetBrains Mono',monospace;font-size:1.1rem;color:var(--emerald);font-weight:600;background:rgba(58,170,122,0.1);padding:0.3rem 0.9rem;border-radius:8px}
.exam-body{padding:2rem}.q-count{font-size:0.75rem;font-family:'JetBrains Mono',monospace;color:var(--muted);margin-bottom:0.75rem}.q-text{font-size:1rem;line-height:1.6;margin-bottom:1.5rem;font-weight:500}
.options-list{display:flex;flex-direction:column;gap:0.75rem;margin-bottom:1.5rem}
.option{padding:0.85rem 1.1rem;border-radius:10px;border:1px solid rgba(58,170,122,0.12);background:rgba(255,255,255,0.02);font-size:0.88rem;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:0.75rem}.option:hover{border-color:rgba(58,170,122,0.3);background:rgba(58,170,122,0.06)}.option.correct{border-color:var(--emerald);background:rgba(58,170,122,0.12);color:var(--cream)}.option.wrong{border-color:#e05555;background:rgba(224,85,85,0.08)}
.option-key{width:26px;height:26px;border-radius:6px;background:rgba(58,170,122,0.1);border:1px solid rgba(58,170,122,0.2);display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-family:'JetBrains Mono',monospace;font-weight:600;flex-shrink:0}
.progress-bar-wrap{background:rgba(255,255,255,0.05);border-radius:4px;height:5px;margin-bottom:1rem}.progress-bar{height:100%;border-radius:4px;background:linear-gradient(90deg,var(--emerald),var(--gold));transition:width 0.5s ease}
.exam-footer{display:flex;justify-content:space-between;align-items:center}.btn-next{padding:0.65rem 1.5rem;background:var(--emerald);color:white;border:none;border-radius:9px;font-size:0.88rem;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif}.btn-next:hover{background:var(--gold);color:var(--forest)}
.search-section{background:#071a10}.search-inner{max-width:900px;margin:0 auto;text-align:center}
.search-box-wrap{position:relative;margin:2.5rem 0}.search-box{width:100%;padding:1.1rem 1.5rem 1.1rem 3.5rem;background:rgba(255,255,255,0.04);border:1px solid rgba(58,170,122,0.25);border-radius:14px;color:var(--cream);font-size:1rem;font-family:'DM Sans',sans-serif;outline:none;transition:all 0.2s}.search-box:focus{border-color:var(--emerald);box-shadow:0 0 0 3px rgba(58,170,122,0.1)}.search-icon{position:absolute;left:1.1rem;top:50%;transform:translateY(-50%);font-size:1.1rem;opacity:0.5}
.search-btn{position:absolute;right:0.6rem;top:50%;transform:translateY(-50%);padding:0.6rem 1.4rem;background:var(--emerald);border:none;border-radius:10px;color:white;font-weight:600;font-size:0.88rem;cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif}.search-btn:hover{background:var(--gold);color:var(--forest)}
.search-tags{display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin-bottom:2.5rem}.tag-chip{padding:0.4rem 1rem;background:rgba(58,170,122,0.08);border:1px solid rgba(58,170,122,0.15);border-radius:50px;font-size:0.8rem;cursor:pointer;transition:all 0.2s}.tag-chip:hover{background:rgba(58,170,122,0.15);border-color:var(--emerald);color:var(--emerald)}
.search-results{display:flex;flex-direction:column;gap:1rem;text-align:left}.result-card{background:rgba(255,255,255,0.03);border:1px solid rgba(58,170,122,0.1);border-radius:14px;padding:1.3rem 1.5rem;display:flex;gap:1.2rem;align-items:flex-start;transition:all 0.2s}.result-card:hover{border-color:rgba(58,170,122,0.25)}
.result-remedy{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:var(--emerald);white-space:nowrap;min-width:140px}.result-detail{flex:1}.result-title{font-size:0.88rem;font-weight:600;margin-bottom:0.3rem}.result-text{font-size:0.82rem;color:rgba(245,240,232,0.55);line-height:1.5}.result-ref{font-family:'JetBrains Mono',monospace;font-size:0.72rem;color:var(--gold);margin-top:0.4rem}
.pricing-section{background:var(--forest)}.pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;max-width:1000px;margin:0 auto}
.pricing-card{background:rgba(255,255,255,0.03);border:1px solid rgba(58,170,122,0.12);border-radius:20px;padding:2rem;position:relative;transition:all 0.3s}
.pricing-card.popular{border-color:rgba(58,170,122,0.4);background:rgba(58,170,122,0.06);transform:scale(1.03);box-shadow:0 20px 60px rgba(58,170,122,0.15)}
.popular-badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,var(--emerald),var(--gold));padding:0.3rem 1.2rem;border-radius:50px;font-size:0.72rem;font-weight:700;color:var(--forest);white-space:nowrap}
.plan-name{font-size:0.8rem;font-family:'JetBrains Mono',monospace;color:var(--muted);text-transform:uppercase;letter-spacing:0.15em;margin-bottom:0.75rem}.plan-price{font-family:'Playfair Display',serif;font-size:2.5rem;font-weight:700;line-height:1}.plan-price span{font-size:1rem;font-family:'DM Sans',sans-serif;color:var(--muted);font-weight:400}.plan-desc{font-size:0.85rem;color:rgba(245,240,232,0.5);margin:0.75rem 0 1.5rem}
.plan-features{list-style:none;display:flex;flex-direction:column;gap:0.65rem;margin-bottom:2rem}.plan-features li{font-size:0.85rem;display:flex;gap:0.6rem;align-items:flex-start;color:rgba(245,240,232,0.75)}.plan-features li::before{content:'✓';color:var(--emerald);font-weight:700;flex-shrink:0}.plan-features li.locked::before{content:'✗';color:rgba(255,255,255,0.2)}.plan-features li.locked{color:rgba(245,240,232,0.25)}
.btn-plan{width:100%;padding:0.85rem;border-radius:10px;font-size:0.9rem;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif}.btn-plan-ghost{background:transparent;border:1px solid rgba(58,170,122,0.25);color:var(--cream)}.btn-plan-ghost:hover{border-color:var(--emerald);color:var(--emerald)}.btn-plan-main{background:var(--emerald);color:white;border:none;box-shadow:0 6px 20px rgba(58,170,122,0.3)}.btn-plan-main:hover{background:var(--gold);color:var(--forest)}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);z-index:1000;display:none;align-items:center;justify-content:center;padding:2rem}.modal-overlay.open{display:flex;animation:fadeIn 0.2s ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.modal{background:#0d2b1f;border:1px solid rgba(58,170,122,0.2);border-radius:24px;padding:2.5rem;width:100%;max-width:460px;position:relative;animation:slideUp 0.3s ease}
@keyframes slideUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
.modal-close{position:absolute;top:1.2rem;right:1.5rem;background:none;border:none;color:var(--muted);font-size:1.4rem;cursor:pointer;transition:color 0.2s}.modal-close:hover{color:var(--cream)}
.modal h2{font-family:'Playfair Display',serif;font-size:1.6rem;margin-bottom:0.4rem}.modal-sub{font-size:0.85rem;color:var(--muted);margin-bottom:1.8rem}
.form-group{margin-bottom:1.1rem}.form-label{display:block;font-size:0.8rem;color:var(--muted);margin-bottom:0.4rem;font-weight:500}
.form-input,.form-select{width:100%;padding:0.75rem 1rem;background:rgba(255,255,255,0.04);border:1px solid rgba(58,170,122,0.15);border-radius:10px;color:var(--cream);font-family:'DM Sans',sans-serif;font-size:0.9rem;outline:none;transition:border-color 0.2s}.form-input:focus,.form-select:focus{border-color:var(--emerald)}.form-select option{background:#0d2b1f}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem}
.btn-submit{width:100%;padding:0.9rem;background:var(--emerald);border:none;border-radius:10px;color:white;font-size:0.95rem;font-weight:600;cursor:pointer;transition:all 0.2s;margin-top:0.5rem;font-family:'DM Sans',sans-serif}.btn-submit:hover{background:var(--gold);color:var(--forest)}.btn-submit:disabled{opacity:0.5;cursor:not-allowed}
.modal-switch{text-align:center;margin-top:1.2rem;font-size:0.83rem;color:var(--muted)}.modal-switch a{color:var(--emerald);text-decoration:none;cursor:pointer}
footer{background:#040f09;padding:4rem 4rem 2rem;border-top:1px solid rgba(58,170,122,0.08)}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:3rem;margin-bottom:3rem}.footer-brand p{font-size:0.85rem;color:var(--muted);line-height:1.7;margin-top:0.75rem;max-width:280px}.footer-col h4{font-size:0.8rem;text-transform:uppercase;letter-spacing:0.15em;color:var(--emerald);margin-bottom:1rem;font-family:'JetBrains Mono',monospace}.footer-col ul{list-style:none;display:flex;flex-direction:column;gap:0.6rem}.footer-col a{color:rgba(245,240,232,0.5);text-decoration:none;font-size:0.85rem;transition:color 0.2s}.footer-col a:hover{color:var(--emerald)}.footer-bottom{border-top:1px solid rgba(255,255,255,0.05);padding-top:1.5rem;display:flex;justify-content:space-between;align-items:center}.footer-copy{font-size:0.8rem;color:var(--muted)}.footer-badge{font-family:'JetBrains Mono',monospace;font-size:0.7rem;color:var(--emerald);opacity:0.6}
.admin-overlay{position:fixed;inset:0;background:#060f09;z-index:5000;display:none;flex-direction:column;font-family:'DM Sans',sans-serif}.admin-overlay.open{display:flex;animation:fadeIn 0.25s ease}
.admin-topbar{background:#0a1f12;border-bottom:1px solid rgba(58,170,122,0.15);padding:0.9rem 2rem;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}
.admin-logo{display:flex;align-items:center;gap:0.6rem}.admin-logo-icon{width:32px;height:32px;border-radius:8px;overflow:hidden;display:flex;align-items:center;justify-content:center}.admin-logo-icon img{width:100%;height:100%;object-fit:cover;border-radius:8px}.admin-logo-text{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:var(--cream)}.admin-badge{font-size:0.65rem;font-family:'JetBrains Mono',monospace;background:rgba(212,168,67,0.15);border:1px solid rgba(212,168,67,0.3);color:var(--gold);padding:0.2rem 0.6rem;border-radius:4px}.admin-user{display:flex;align-items:center;gap:1rem;font-size:0.85rem;color:var(--muted)}.btn-logout{padding:0.4rem 1rem;background:transparent;border:1px solid rgba(224,85,85,0.3);color:#e05555;border-radius:7px;font-size:0.8rem;cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif}.btn-logout:hover{background:rgba(224,85,85,0.1)}
.admin-body{display:flex;flex:1;overflow:hidden}
.admin-sidebar{width:220px;background:#0a1f12;border-right:1px solid rgba(58,170,122,0.1);padding:1.5rem 0;display:flex;flex-direction:column;gap:0.25rem;flex-shrink:0;overflow-y:auto}
.sidebar-section{font-size:0.65rem;font-family:'JetBrains Mono',monospace;color:var(--muted);text-transform:uppercase;letter-spacing:0.2em;padding:0.75rem 1.5rem 0.3rem}
.sidebar-item{display:flex;align-items:center;gap:0.75rem;padding:0.65rem 1.5rem;cursor:pointer;transition:all 0.2s;font-size:0.875rem;color:rgba(245,240,232,0.6);border-left:2px solid transparent}.sidebar-item:hover{background:rgba(58,170,122,0.05);color:var(--cream)}.sidebar-item.active{background:rgba(58,170,122,0.08);color:var(--emerald);border-left-color:var(--emerald)}.sidebar-item .icon{font-size:1rem;width:20px;text-align:center}
.admin-main{flex:1;overflow-y:auto;padding:2rem;background:#071209}
.admin-page{display:none}.admin-page.active{display:block;animation:fadeUp 0.3s ease}
.admin-page-title{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;margin-bottom:0.3rem}.admin-page-sub{font-size:0.83rem;color:var(--muted);margin-bottom:2rem}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem}
.stat-card{background:rgba(255,255,255,0.03);border:1px solid rgba(58,170,122,0.1);border-radius:14px;padding:1.3rem 1.5rem;transition:all 0.2s}.stat-card:hover{border-color:rgba(58,170,122,0.25)}.stat-card-label{font-size:0.75rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.5rem}.stat-card-num{font-family:'Playfair Display',serif;font-size:2rem;font-weight:700;line-height:1}.stat-card-num.green{color:var(--emerald)}.stat-card-num.gold{color:var(--gold)}.stat-card-num.red{color:#e05555}.stat-card-change{font-size:0.75rem;color:var(--emerald);margin-top:0.3rem}
.admin-table-wrap{background:rgba(255,255,255,0.02);border:1px solid rgba(58,170,122,0.1);border-radius:14px;overflow:hidden}.admin-table-head{padding:1rem 1.5rem;border-bottom:1px solid rgba(58,170,122,0.08);display:flex;justify-content:space-between;align-items:center}.admin-table-title{font-size:0.9rem;font-weight:600}
table{width:100%;border-collapse:collapse}th{font-size:0.72rem;font-family:'JetBrains Mono',monospace;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em;padding:0.75rem 1.5rem;text-align:left;border-bottom:1px solid rgba(58,170,122,0.07)}td{font-size:0.83rem;padding:0.9rem 1.5rem;border-bottom:1px solid rgba(255,255,255,0.03);color:rgba(245,240,232,0.8)}tr:last-child td{border-bottom:none}tr:hover td{background:rgba(58,170,122,0.03)}
.badge{display:inline-block;padding:0.2rem 0.65rem;border-radius:4px;font-size:0.7rem;font-weight:600}.badge-green{background:rgba(58,170,122,0.15);color:var(--emerald)}.badge-gold{background:rgba(212,168,67,0.15);color:var(--gold)}.badge-red{background:rgba(224,85,85,0.15);color:#e05555}.badge-muted{background:rgba(255,255,255,0.06);color:var(--muted)}
.admin-actions{display:flex;gap:0.5rem}.btn-action{padding:0.3rem 0.8rem;border-radius:6px;font-size:0.75rem;cursor:pointer;border:1px solid;transition:all 0.2s;font-family:'DM Sans',sans-serif}.btn-edit{border-color:rgba(58,170,122,0.3);color:var(--emerald);background:transparent}.btn-edit:hover{background:rgba(58,170,122,0.1)}.btn-del{border-color:rgba(224,85,85,0.3);color:#e05555;background:transparent}.btn-del:hover{background:rgba(224,85,85,0.1)}
.quick-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:2rem}.quick-btn{background:rgba(255,255,255,0.03);border:1px solid rgba(58,170,122,0.1);border-radius:12px;padding:1.2rem;cursor:pointer;transition:all 0.2s;text-align:center;color:var(--cream)}.quick-btn:hover{border-color:rgba(58,170,122,0.3);background:rgba(58,170,122,0.06)}.quick-btn .q-icon{font-size:1.5rem;margin-bottom:0.5rem}.quick-btn .q-label{font-size:0.83rem;font-weight:600}.quick-btn .q-sub{font-size:0.73rem;color:var(--muted);margin-top:0.2rem}
.deploy-modal{background:#0a1f12;border:1px solid rgba(58,170,122,0.2);border-radius:24px;padding:2.5rem;width:100%;max-width:640px;max-height:85vh;overflow-y:auto;position:relative;animation:slideUp 0.3s ease}
.deploy-step{display:flex;gap:1rem;margin-bottom:1.5rem;align-items:flex-start}.deploy-num{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--emerald),var(--gold));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;color:var(--forest);flex-shrink:0;margin-top:0.1rem}.deploy-step-title{font-weight:600;font-size:0.9rem;margin-bottom:0.4rem}.deploy-step-text{font-size:0.82rem;color:rgba(245,240,232,0.6);line-height:1.6}
.code-snippet{background:rgba(0,0,0,0.4);border:1px solid rgba(58,170,122,0.15);border-radius:8px;padding:0.75rem 1rem;margin-top:0.5rem;font-family:'JetBrains Mono',monospace;font-size:0.78rem;color:var(--emerald);line-height:1.6;white-space:pre-wrap;word-break:break-all}
.deploy-divider{border:none;border-top:1px solid rgba(58,170,122,0.08);margin:1.5rem 0}
.toast{position:fixed;bottom:2rem;right:2rem;z-index:9000;background:var(--sage);border:1px solid rgba(58,170,122,0.3);border-radius:12px;padding:1rem 1.5rem;display:none;align-items:center;gap:0.75rem;font-size:0.88rem;animation:slideLeft 0.3s ease;box-shadow:0 8px 30px rgba(0,0,0,0.3)}.toast.show{display:flex}
@keyframes slideLeft{from{transform:translateX(40px);opacity:0}to{transform:translateY(0);opacity:1}}
.feature-row{display:flex;gap:1rem;align-items:flex-start}.feature-icon{width:36px;height:36px;border-radius:50%;background:rgba(58,170,122,0.15);border:1px solid rgba(58,170,122,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.feature-title{font-weight:600;font-size:0.9rem;margin-bottom:0.2rem}.feature-desc{font-size:0.82rem;color:rgba(245,240,232,0.5)}
.exam-feature-box{background:rgba(58,170,122,0.06);border:1px solid rgba(58,170,122,0.12);border-radius:12px;padding:1rem 1.2rem;display:flex;justify-content:space-between;align-items:center}.exam-feature-box-gold{background:rgba(212,168,67,0.06);border:1px solid rgba(212,168,67,0.12)}
.error-box{background:rgba(224,85,85,0.1);border:1px solid rgba(224,85,85,0.2);border-radius:8px;padding:0.6rem 1rem;font-size:0.82rem;color:#e05555;margin-bottom:0.75rem}
.info-box{background:rgba(212,168,67,0.07);border:1px solid rgba(212,168,67,0.15);border-radius:8px;padding:0.7rem 1rem;font-size:0.78rem;color:rgba(212,168,67,0.8);margin-bottom:1rem}
.credential-box{margin-top:1rem;padding:0.75rem;background:rgba(212,168,67,0.06);border:1px solid rgba(212,168,67,0.12);border-radius:8px}
.deploy-summary{background:rgba(58,170,122,0.08);border:1px solid rgba(58,170,122,0.15);border-radius:12px;padding:1rem 1.2rem;margin-top:0.5rem}
@media(max-width:900px){nav{padding:1rem 1.5rem}.nav-links{display:none}section{padding:4rem 1.5rem}.ai-inner,.exam-inner{grid-template-columns:1fr;gap:2.5rem}.modules-grid{grid-template-columns:1fr 1fr}.pricing-grid{grid-template-columns:1fr}.pricing-card.popular{transform:none}.footer-grid{grid-template-columns:1fr 1fr;gap:2rem}.hero{padding:7rem 1.5rem 3rem}.hero-stats{gap:2rem}.form-row{grid-template-columns:1fr}}
@media(max-width:600px){.modules-grid{grid-template-columns:1fr}.footer-grid{grid-template-columns:1fr}}
`;

// ── Remedy DB for chat ──
const remedyDB: Record<string, { name: string; info: string; ref: string }> = {
  'nux vomica': { name: 'Nux Vomica (Nux-v)', info: 'Irritable, chilly, ambitious personality. Key indications:\n🔹 Gastric complaints with constipation\n🔹 Oversensitivity to noise, light, odors\n🔹 Sedentary workers, mental strain\n🔹 Worse: cold, morning, mental exertion\n🔹 Better: warmth, rest, evening', ref: 'Kent Materia Medica — Chapter: Nux Vomica | Confidence: 98%' },
  'pulsatilla': { name: 'Pulsatilla (Puls)', info: 'Mild, gentle, yielding. Key indications:\n🔹 Weeping, wants consolation\n🔹 Thirstless, changeable symptoms\n🔹 Worse: warm room, rich food\n🔹 Better: open air, cold applications, consolation\n🔹 Blonds, fair skin, women', ref: 'Kent Materia Medica — Chapter: Pulsatilla | Confidence: 96%' },
  'sulphur': { name: 'Sulphur (Sulph)', info: 'Philosophical, untidy, lazy. Key indications:\n🔹 Burning pains with standing aggravates\n🔹 Skin conditions, itching\n🔹 Heat sensation, flushes\n🔹 Worse: bathing, standing, heat\n🔹 Better: drawing up feet, dry weather', ref: 'Hahnemann Materia Medica Pura | Confidence: 97%' },
  'arsenicum': { name: 'Arsenicum Album (Ars)', info: 'Anxious, restless, fastidious. Key indications:\n🔹 Burning pains relieved by heat\n🔹 Great anxiety with fear of death\n🔹 Chilly, thirst for small sips\n🔹 Worse: cold, midnight, alone\n🔹 Better: heat, warm drinks, company', ref: 'Boerickes Materia Medica | Confidence: 99%' },
  'belladonna': { name: 'Belladonna (Bell)', info: 'Sudden, violent symptoms. Key indications:\n🔹 Hot, red, flushed face\n🔹 Throbbing headache, delirium\n🔹 Worse: touch, jarring, light\n🔹 Better: rest, dark room, standing', ref: 'Kent Materia Medica | Confidence: 95%' },
  'calcarea': { name: 'Calcarea Carb (Calc)', info: 'Obstinate, anxious, fears. Key indications:\n🔹 Chilly, perspires easily on head\n🔹 Craves eggs, indigestible things\n🔹 Worse: cold, damp, exertion\n🔹 Better: dry weather, lying on painful side', ref: 'Kent Repertory | Confidence: 94%' },
};

// ── MCQ Questions ──
const questions = [
  { q: "Which remedy is known as the 'King of Anti-psoric remedies'?", opts: ['Sulphur', 'Arsenicum Album', 'Calcarea Carb', 'Lycopodium'], ans: 0 },
  { q: "Consolation ameliorates symptoms in which remedy?", opts: ['Nux Vomica', 'Pulsatilla', 'Sulphur', 'Arsenicum Alb'], ans: 1 },
  { q: "Burning pains relieved by heat is the keynote of?", opts: ['Sulphur', 'Nux Vomica', 'Arsenicum Album', 'Pulsatilla'], ans: 2 },
  { q: "Which remedy is indicated in conditions 'Worse from warm room, Better in open air'?", opts: ['Nux Vomica', 'Arsenicum Alb', 'Pulsatilla', 'Sulphur'], ans: 2 },
  { q: "'Irritable, ambitious, chilly' personality matches which remedy?", opts: ['Pulsatilla', 'Sulphur', 'Nux Vomica', 'Calcarea Carb'], ans: 2 },
];

// ── Search Remedies ──
const remedies = [
  { name: 'Nux Vomica', title: 'Gastric complaints with Irritability', text: 'Indicated in gastritis with anger, constipation, oversensitivity. Worse morning, cold. Better warmth, rest.', ref: 'Boericke\'s Materia Medica | Kent Repertory: MIND — Irritability', tags: ['gastritis', 'anger', 'irritability', 'nux', 'constipation'] },
  { name: 'Pulsatilla', title: 'Mild, Yielding — Consolation Ameliorates', text: 'Weeping child who wants company. Changeable symptoms. Thirstless. Worse warm room, better open air.', ref: 'Kent Materia Medica | Rubric: MIND — Weeping, consolation ameliorates', tags: ['child', 'weeping', 'consolation', 'pulsatilla', 'thirstless', 'anxiety'] },
  { name: 'Sulphur', title: 'Burning + Untidy + Philosophical', text: 'Philosophical mind, aversion to bathing. Burning feet, itching. Worse standing, heat. Better rest.', ref: 'Hahnemann\'s Chronic Diseases | Boericke: Sulphur', tags: ['burning', 'philosophical', 'untidy', 'sulphur', 'skin', 'itching'] },
  { name: 'Arsenicum Album', title: 'Restlessness + Burning + Anxiety', text: 'Great anxiety, fear of death. Burning relieved by heat. Chilly, thirsty for sips. Worse midnight.', ref: 'Kent Materia Medica | Boericke: Arsenicum Album', tags: ['anxiety', 'restlessness', 'burning', 'arsenicum', 'fever', 'thirst'] },
  { name: 'Belladonna', title: 'Sudden, Violent — Hot, Red, Throbbing', text: 'High fever with flushed face. Pupils dilated. Worse touch, jarring. Better dark room, rest.', ref: 'Kent Materia Medica | Chapter: Belladonna', tags: ['fever', 'headache', 'hot', 'red', 'throbbing', 'sudden', 'fever'] },
];

export default function Home() {
  // ── Auth State ──
  const [loggedInUser, setLoggedInUser] = useState<{ name: string; email: string; role: string; plan: string } | null>(null);
  const [seeded, setSeeded] = useState(false);

  // ── Modal State ──
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [adminError, setAdminError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // ── Admin State ──
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminPage, setAdminPage] = useState('dashboard');

  // ── Toast State ──
  const [toastMsg, setToastMsg] = useState('');
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Chat State ──
  const [chatMessages, setChatMessages] = useState<{ type: 'bot' | 'user'; text: string; ref?: string }[]>([
    { type: 'bot', text: 'Namaskar! 🙏 Main aapka AI Homeopathy Assistant hoon. Koi bhi remedy ya symptom ke baare mein poochiye — main book reference ke saath jawab dunga.' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatTyping, setChatTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── MCQ State ──
  const [curQ, setCurQ] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [timerVal, setTimerVal] = useState(45);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Search State ──
  const [searchBox, setSearchBox] = useState('');
  const [searchResults, setSearchResults] = useState(remedies.slice(0, 2));

  // ── Seed DB on mount ──
  useEffect(() => {
    if (!seeded) {
      fetch('/api/auth/seed', { method: 'POST' })
        .then(r => r.json())
        .then(() => setSeeded(true))
        .catch(() => {});
    }
  }, [seeded]);

  // ── Toast helper ──
  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToastMsg(''), 3000);
  }, []);

  // ── Modal helpers ──
  const openModal = (type: string) => {
    setLoginError(''); setSignupError(''); setAdminError('');
    setActiveModal(type);
  };
  const closeModal = () => setActiveModal(null);

  // ── Scroll helper ──
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── Login handler ──
  const handleLogin = async () => {
    const email = (document.getElementById('loginEmail') as HTMLInputElement)?.value?.trim();
    const password = (document.getElementById('loginPassword') as HTMLInputElement)?.value?.trim();
    if (!email || !password) { setLoginError('Please fill in all fields'); return; }
    setAuthLoading(true); setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.error) { setLoginError(data.error); }
      else {
        setLoggedInUser(data.user);
        showToast(`Welcome back, ${data.user.name}!`);
        closeModal();
      }
    } catch { setLoginError('Network error. Please try again.'); }
    setAuthLoading(false);
  };

  // ── Signup handler ──
  const handleSignup = async () => {
    const name = (document.getElementById('signupName') as HTMLInputElement)?.value?.trim();
    const email = (document.getElementById('signupEmail') as HTMLInputElement)?.value?.trim();
    const password = (document.getElementById('signupPassword') as HTMLInputElement)?.value?.trim();
    const college = (document.getElementById('signupCollege') as HTMLInputElement)?.value?.trim();
    const year = (document.getElementById('signupYear') as HTMLSelectElement)?.value;
    if (!name || !email || !password) { setSignupError('Name, email and password are required'); return; }
    setAuthLoading(true); setSignupError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, college, year }),
      });
      const data = await res.json();
      if (data.error) { setSignupError(data.error); }
      else {
        setLoggedInUser(data.user);
        showToast(`Account created! Welcome, ${data.user.name}!`);
        closeModal();
      }
    } catch { setSignupError('Network error. Please try again.'); }
    setAuthLoading(false);
  };

  // ── Admin login handler ──
  const handleAdminLogin = async () => {
    const username = (document.getElementById('adminUser') as HTMLInputElement)?.value?.trim();
    const password = (document.getElementById('adminPass') as HTMLInputElement)?.value?.trim();
    if (!username || !password) { setAdminError('Please fill in all fields'); return; }
    setAuthLoading(true); setAdminError('');
    try {
      const res = await fetch('/api/auth/admin', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.error) { setAdminError(data.error); }
      else {
        setAdminOpen(true);
        setAdminPage('dashboard');
        showToast(`Welcome, ${data.user.name}! Admin panel opened.`);
        closeModal();
      }
    } catch { setAdminError('Network error. Please try again.'); }
    setAuthLoading(false);
  };

  // ── Chat send ──
  const sendMessage = () => {
    const q = chatInput.trim(); if (!q) return;
    setChatMessages(prev => [...prev, { type: 'user', text: q }]);
    setChatInput(''); setChatTyping(true);
    setTimeout(() => {
      let found: typeof remedyDB[string] | null = null;
      const lower = q.toLowerCase();
      for (const key in remedyDB) { if (lower.includes(key)) { found = remedyDB[key]; break; } }
      if (found) {
        setChatMessages(prev => [...prev, { type: 'bot', text: `${found!.name} — ${found!.info}`, ref: found!.ref }]);
      } else {
        setChatMessages(prev => [...prev, { type: 'bot', text: `I don't have specific information about "${q}" in my database yet. Try asking about remedies like Nux Vomica, Pulsatilla, Sulphur, Arsenicum Album, Belladonna, or Calcarea Carb.`, ref: '📚 General Reference | Confidence: 60%' }]);
      }
      setChatTyping(false);
    }, 1200);
  };

  // ── Chat auto-scroll ──
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages, chatTyping]);

  // ── MCQ timer ──
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimerVal(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); if (!answered) { setAnswered(true); } return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [curQ, answered]);

  const loadQuestion = (i: number) => {
    setCurQ(i); setAnswered(false); setSelectedOpt(null); setTimerVal(45);
  };

  const selectOption = (idx: number) => {
    if (answered) return;
    setAnswered(true); setSelectedOpt(idx);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const nextQuestion = () => {
    if (curQ < questions.length - 1) loadQuestion(curQ + 1);
    else showToast('Exam completed! Your answers have been submitted.');
  };

  // ── Search ──
  const doSearch = () => {
    const q = searchBox.toLowerCase().trim();
    if (!q) { setSearchResults(remedies.slice(0, 2)); return; }
    const results = remedies.filter(r => r.tags.some(t => q.includes(t)) || r.name.toLowerCase().includes(q) || r.title.toLowerCase().includes(q));
    setSearchResults(results.length ? results : remedies.slice(0, 2));
  };

  const quickSearch = (term: string) => { setSearchBox(term); doSearch(); };

  // ── Admin page render ──
  const renderAdminPage = () => {
    switch (adminPage) {
      case 'dashboard': return (
        <div className="admin-page active">
          <div className="admin-page-title">Dashboard Overview</div>
          <div className="admin-page-sub">DSW Med-Learn — Live Platform Stats</div>
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-card-label">Total Students</div><div className="stat-card-num green">1,247</div><div className="stat-card-change">↑ +43 this week</div></div>
            <div className="stat-card"><div className="stat-card-label">Premium Users</div><div className="stat-card-num gold">312</div><div className="stat-card-change">↑ +18 this week</div></div>
            <div className="stat-card"><div className="stat-card-label">Monthly Revenue</div><div className="stat-card-num green">₹93,288</div><div className="stat-card-change">↑ +12% vs last month</div></div>
            <div className="stat-card"><div className="stat-card-label">MCQs Attempted</div><div className="stat-card-num gold">28,450</div><div className="stat-card-change">↑ +2,100 this week</div></div>
          </div>
          <div className="quick-actions">
            <div className="quick-btn" onClick={() => setAdminPage('mcq')}><div className="q-icon">➕</div><div className="q-label">Add New MCQ</div><div className="q-sub">Add questions to exam bank</div></div>
            <div className="quick-btn" onClick={() => setAdminPage('students')}><div className="q-icon">👤</div><div className="q-label">Manage Students</div><div className="q-sub">View, edit, suspend users</div></div>
            <div className="quick-btn" onClick={() => setAdminPage('remedies')}><div className="q-icon">💊</div><div className="q-label">Add Remedy</div><div className="q-sub">Expand homeopathy database</div></div>
            <div className="quick-btn" onClick={() => setAdminPage('payments')}><div className="q-icon">💰</div><div className="q-label">View Revenue</div><div className="q-sub">Razorpay transactions</div></div>
            <div className="quick-btn" onClick={() => setAdminPage('library')}><div className="q-icon">📖</div><div className="q-label">Upload Book</div><div className="q-sub">Add to digital library</div></div>
            <div className="quick-btn" onClick={() => setAdminPage('cases')}><div className="q-icon">🩺</div><div className="q-label">Review Cases</div><div className="q-sub">Student clinical cases</div></div>
          </div>
          <div className="admin-table-wrap">
            <div className="admin-table-head"><div className="admin-table-title">Recent Registrations</div><button className="btn-action btn-edit" onClick={() => setAdminPage('students')}>View All →</button></div>
            <table><thead><tr><th>Name</th><th>College</th><th>Year</th><th>Plan</th><th>Joined</th></tr></thead>
            <tbody>
              <tr><td>Dr. Arjun Patel</td><td>NMC Ahmedabad</td><td>3rd Year</td><td><span className="badge badge-gold">Premium</span></td><td>Today</td></tr>
              <tr><td>Priya Sharma</td><td>HNGU Patan</td><td>Final Year</td><td><span className="badge badge-green">Free</span></td><td>Today</td></tr>
              <tr><td>Rahul Desai</td><td>GHU Surat</td><td>Intern</td><td><span className="badge badge-gold">Premium</span></td><td>Yesterday</td></tr>
              <tr><td>Anita Mehta</td><td>SDM Mangalore</td><td>2nd Year</td><td><span className="badge badge-green">Free</span></td><td>Yesterday</td></tr>
            </tbody></table>
          </div>
        </div>
      );
      case 'students': return (
        <div className="admin-page active">
          <div className="admin-page-title">Student Management</div><div className="admin-page-sub">View and manage all registered students</div>
          <div className="admin-table-wrap"><div className="admin-table-head"><div className="admin-table-title">All Students (1,247)</div></div>
          <table><thead><tr><th>Name</th><th>Mobile</th><th>College</th><th>Plan</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            <tr><td>Dr. Arjun Patel</td><td>+91 98765 43210</td><td>NMC Ahmedabad</td><td><span className="badge badge-gold">Premium</span></td><td><span className="badge badge-green">Active</span></td><td className="admin-actions"><button className="btn-action btn-edit" onClick={() => showToast('Student details opened')}>Edit</button><button className="btn-action btn-del" onClick={() => showToast('Student suspended')}>Suspend</button></td></tr>
            <tr><td>Priya Sharma</td><td>+91 87654 32109</td><td>HNGU Patan</td><td><span className="badge badge-green">Free</span></td><td><span className="badge badge-green">Active</span></td><td className="admin-actions"><button className="btn-action btn-edit" onClick={() => showToast('Student details opened')}>Edit</button><button className="btn-action btn-del" onClick={() => showToast('Student suspended')}>Suspend</button></td></tr>
          </tbody></table></div>
        </div>
      );
      case 'mcq': return (
        <div className="admin-page active">
          <div className="admin-page-title">MCQ Manager</div><div className="admin-page-sub">Add, edit and delete exam questions</div>
          <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(58,170,122,0.12)',borderRadius:14,padding:'1.5rem',marginBottom:'1.5rem'}}>
            <div style={{fontSize:'0.88rem',fontWeight:600,marginBottom:'1rem',color:'var(--emerald)'}}>➕ Add New MCQ</div>
            <div className="form-group"><label className="form-label">Question</label><input className="form-input" type="text" placeholder="Type the MCQ question..." /></div>
            <div className="form-row"><div className="form-group"><label className="form-label">Option A</label><input className="form-input" type="text" placeholder="Option A" /></div><div className="form-group"><label className="form-label">Option B</label><input className="form-input" type="text" placeholder="Option B" /></div><div className="form-group"><label className="form-label">Option C</label><input className="form-input" type="text" placeholder="Option C" /></div><div className="form-group"><label className="form-label">Option D</label><input className="form-input" type="text" placeholder="Option D" /></div></div>
            <button className="btn-submit" style={{width:'auto',padding:'0.65rem 2rem'}} onClick={() => showToast('✅ MCQ added to database!')}>Save Question</button>
          </div>
          <div className="admin-table-wrap"><div className="admin-table-head"><div className="admin-table-title">Question Bank (500)</div></div>
          <table><thead><tr><th>#</th><th>Question</th><th>Topic</th><th>Difficulty</th><th>Actions</th></tr></thead>
          <tbody>
            <tr><td>001</td><td>Which remedy is &apos;King of Anti-psoric remedies&apos;?</td><td><span className="badge badge-muted">MM</span></td><td><span className="badge badge-green">Easy</span></td><td className="admin-actions"><button className="btn-action btn-edit">Edit</button><button className="btn-action btn-del">Delete</button></td></tr>
            <tr><td>002</td><td>Consolation aggravates in which remedy?</td><td><span className="badge badge-muted">MM</span></td><td><span className="badge badge-gold">Medium</span></td><td className="admin-actions"><button className="btn-action btn-edit">Edit</button><button className="btn-action btn-del">Delete</button></td></tr>
          </tbody></table></div>
        </div>
      );
      case 'remedies': return (
        <div className="admin-page active">
          <div className="admin-page-title">Remedy Database</div><div className="admin-page-sub">Manage homeopathy remedy entries</div>
          <div className="admin-table-wrap"><div className="admin-table-head"><div className="admin-table-title">Remedies (5,000+)</div><button className="btn-action btn-edit" onClick={() => showToast('Add remedy form opened')}>+ Add Remedy</button></div>
          <table><thead><tr><th>Remedy</th><th>Key Symptom</th><th>Source</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            <tr><td><strong>Nux Vomica</strong></td><td>Gastritis + Anger + Irritability</td><td><span className="badge badge-muted">Kent + Boericke</span></td><td><span className="badge badge-green">Active</span></td><td className="admin-actions"><button className="btn-action btn-edit">Edit</button></td></tr>
            <tr><td><strong>Pulsatilla</strong></td><td>Weeping + Consolation amel.</td><td><span className="badge badge-muted">Kent MM</span></td><td><span className="badge badge-green">Active</span></td><td className="admin-actions"><button className="btn-action btn-edit">Edit</button></td></tr>
          </tbody></table></div>
        </div>
      );
      case 'library': return (
        <div className="admin-page active">
          <div className="admin-page-title">Digital Library</div><div className="admin-page-sub">Manage books and reading materials</div>
          <div className="admin-table-wrap"><div className="admin-table-head"><div className="admin-table-title">Library Books</div><button className="btn-action btn-edit" onClick={() => showToast('Upload book PDF')}>+ Upload Book</button></div>
          <table><thead><tr><th>Book Title</th><th>Author</th><th>Access</th><th>Downloads</th><th>Actions</th></tr></thead>
          <tbody>
            <tr><td>Organon of Medicine</td><td>Samuel Hahnemann</td><td><span className="badge badge-green">Free</span></td><td>2,341</td><td className="admin-actions"><button className="btn-action btn-edit">Edit</button></td></tr>
            <tr><td>Kent Materia Medica</td><td>J.T. Kent</td><td><span className="badge badge-gold">Premium</span></td><td>1,892</td><td className="admin-actions"><button className="btn-action btn-edit">Edit</button></td></tr>
          </tbody></table></div>
        </div>
      );
      case 'cases': return (
        <div className="admin-page active">
          <div className="admin-page-title">Clinical Cases</div><div className="admin-page-sub">Review student-submitted cases</div>
          <div className="admin-table-wrap"><div className="admin-table-head"><div className="admin-table-title">Submitted Cases (87)</div></div>
          <table><thead><tr><th>Patient</th><th>Submitted By</th><th>Remedy Given</th><th>Review</th><th>Actions</th></tr></thead>
          <tbody>
            <tr><td>Patient A (M/35)</td><td>Arjun Patel</td><td>Nux Vomica 30</td><td><span className="badge badge-green">Approved</span></td><td className="admin-actions"><button className="btn-action btn-edit">View</button></td></tr>
            <tr><td>Patient B (F/28)</td><td>Priya Sharma</td><td>Pulsatilla 200</td><td><span className="badge badge-gold">Pending</span></td><td className="admin-actions"><button className="btn-action btn-edit">Review</button><button className="btn-action btn-del">Reject</button></td></tr>
          </tbody></table></div>
        </div>
      );
      case 'premium': return (
        <div className="admin-page active">
          <div className="admin-page-title">Premium Users</div><div className="admin-page-sub">Students with active subscriptions</div>
          <div className="stats-grid" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
            <div className="stat-card"><div className="stat-card-label">Monthly Subscribers</div><div className="stat-card-num gold">248</div></div>
            <div className="stat-card"><div className="stat-card-label">Annual Subscribers</div><div className="stat-card-num green">64</div></div>
            <div className="stat-card"><div className="stat-card-label">Churned This Month</div><div className="stat-card-num red">12</div></div>
          </div>
          <div className="admin-table-wrap"><div className="admin-table-head"><div className="admin-table-title">Active Subscriptions</div></div>
          <table><thead><tr><th>Student</th><th>Plan</th><th>Amount</th><th>Renewal</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>Arjun Patel</td><td>Monthly</td><td>₹299</td><td>Jun 6, 2025</td><td><span className="badge badge-green">Active</span></td></tr>
            <tr><td>Rahul Desai</td><td>Annual</td><td>₹1999</td><td>May 6, 2026</td><td><span className="badge badge-green">Active</span></td></tr>
          </tbody></table></div>
        </div>
      );
      case 'payments': return (
        <div className="admin-page active">
          <div className="admin-page-title">Payment Transactions</div><div className="admin-page-sub">Razorpay payment history</div>
          <div className="stats-grid" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
            <div className="stat-card"><div className="stat-card-label">Total Revenue</div><div className="stat-card-num green">₹4,12,500</div></div>
            <div className="stat-card"><div className="stat-card-label">This Month</div><div className="stat-card-num gold">₹93,288</div></div>
            <div className="stat-card"><div className="stat-card-label">Pending Payouts</div><div className="stat-card-num red">₹12,400</div></div>
          </div>
          <div className="admin-table-wrap"><div className="admin-table-head"><div className="admin-table-title">Recent Transactions</div></div>
          <table><thead><tr><th>Order ID</th><th>Student</th><th>Amount</th><th>Plan</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.75rem'}}>RZP_001234</td><td>Arjun Patel</td><td>₹299</td><td>Monthly</td><td><span className="badge badge-green">Success</span></td></tr>
            <tr><td style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.75rem'}}>RZP_001235</td><td>Rahul Desai</td><td>₹1999</td><td>Annual</td><td><span className="badge badge-green">Success</span></td></tr>
          </tbody></table></div>
        </div>
      );
      default: return null;
    }
  };

  const q = questions[curQ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ══════ NAV ══════ */}
      <nav>
        <div className="nav-logo">
          <div className="logo-icon"><img src="/logo.png" alt="DSW Med-Learn Logo" /></div>
          <div><div className="logo-text">DSW Med-Learn</div><div className="logo-sub">Dr. Sagathiya Wellness</div></div>
        </div>
        <ul className="nav-links">
          <li><a href="/library" onClick={e => { e.preventDefault(); window.location.href = '/library'; }}>📚 Library</a></li>
          <li><a href="#modules" onClick={e => { e.preventDefault(); scrollToSection('modules'); }}>Modules</a></li>
          <li><a href="#ai" onClick={e => { e.preventDefault(); scrollToSection('ai'); }}>AI Assistant</a></li>
          <li><a href="#exam" onClick={e => { e.preventDefault(); scrollToSection('exam'); }}>Exam</a></li>
          <li><a href="#search" onClick={e => { e.preventDefault(); scrollToSection('search'); }}>Remedies</a></li>
          <li><a href="#pricing" onClick={e => { e.preventDefault(); scrollToSection('pricing'); }}>Pricing</a></li>
        </ul>
        <div className="nav-actions">
          {loggedInUser ? (
            <span style={{fontSize:'0.85rem',color:'var(--emerald)'}}>👤 {loggedInUser.name}</span>
          ) : (
            <button className="btn-ghost" onClick={() => openModal('login')}>Login</button>
          )}
          <button className="btn-ghost" style={{borderColor:'rgba(212,168,67,0.4)',color:'var(--gold)'}} onClick={() => openModal('adminlogin')}>🔐 Admin</button>
          <button className="btn-primary" onClick={() => openModal('signup')}>Join Free</button>
          <button className="btn-ghost" style={{borderColor:'rgba(58,170,122,0.4)',fontSize:'0.78rem'}} onClick={() => openModal('deploy')}>🚀 Deploy Guide</button>
        </div>
      </nav>

      {/* ══════ HERO ══════ */}
      <section className="hero" id="home">
        <div className="hero-badge"><span>🌱 INDIA&apos;S #1 HOMEOPATHY ED-TECH PLATFORM</span></div>
        <h1>Learn Homeopathy<br/>with <em>Intelligence</em></h1>
        <p>Complete digital ecosystem for BHMS students — AI study assistant, 500+ MCQs, digital library, Kent repertory, case management &amp; live doctor consultations.</p>
        <div className="hero-cta">
          <button className="btn-hero btn-hero-main" onClick={() => openModal('signup')}>🚀 Start Learning Free</button>
          <button className="btn-hero btn-hero-sec" onClick={() => scrollToSection('ai')}>Watch AI Demo →</button>
        </div>
        <div className="hero-stats">
          <div className="stat"><div className="stat-num">500+</div><div className="stat-label">MCQ Questions</div></div>
          <div className="stat"><div className="stat-num">12</div><div className="stat-label">Core Modules</div></div>
          <div className="stat"><div className="stat-num">5000+</div><div className="stat-label">Remedy Entries</div></div>
          <div className="stat"><div className="stat-num">24/7</div><div className="stat-label">AI Assistant</div></div>
        </div>
      </section>

      {/* ══════ MODULES ══════ */}
      <section className="modules-section" id="modules">
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <div className="section-header">
            <span className="section-tag">{'// platform modules'}</span>
            <h2 className="section-title">Everything a BHMS Student Needs</h2>
            <p className="section-sub">From organon to AI — a complete homeopathy learning ecosystem built for modern students.</p>
          </div>
          <div className="modules-grid">
            {[
              { icon: '🧠', title: 'AI Study Assistant', desc: 'Ask any homeopathy question — get answers with book references from Kent, Boericke & Hahnemann.', tag: '✦ Premium', featured: true },
              { icon: '📚', title: 'Digital Library', desc: 'Organon of Medicine, Materia Medica Pura, EPMD and more — with bookmarks & highlights.', tag: 'Free Access', link: '/library' },
              { icon: '🧪', title: 'MCQ Exam Engine', desc: '500 questions with timer, auto-scoring, weak topic detection and performance analytics.', tag: '✦ Premium' },
              { icon: '🔍', title: 'Therapeutic Search', desc: 'Search by disease, symptom or remedy. Like Google — but for homeopathy. Instant results.', tag: 'Free Access' },
              { icon: '📖', title: 'Kent Repertory', desc: 'Full rubric search, reverse search, remedy comparison with weighted grading — software-grade.', tag: '✦ Premium' },
              { icon: '🩺', title: 'Case Taking System', desc: 'Digital case sheets with patient info, symptoms, miasm analysis and remedy suggestions.', tag: '✦ Premium' },
              { icon: '💬', title: 'Student Community', desc: 'Group chats for Materia Medica, Repertory, Case Discussion & expert doctor rooms.', tag: '✦ Premium' },
              { icon: '🏥', title: 'Online Consultation', desc: 'Student-to-patient consultation module with doctor verification and appointment booking.', tag: 'Coming Soon' },
              { icon: '📜', title: 'Homeopathy History', desc: "Hahnemann's life, miasm theory, evolution timeline, classical practitioners database.", tag: 'Free Access' },
            ].map((m, i) => (
              <div key={i} className={`module-card${m.featured ? ' featured' : ''}`} onClick={() => { if ((m as any).link) window.location.href = (m as any).link; }} style={(m as any).link ? { cursor: 'pointer' } : {}}>
                <div className="module-icon">{m.icon}</div>
                <h3>{m.title}</h3><p>{m.desc}</p>
                <span className={`module-tag${m.tag.includes('Premium') ? ' premium' : ''}`}>{m.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ AI SECTION ══════ */}
      <section className="ai-section" id="ai">
        <div className="ai-inner">
          <div>
            <span className="section-tag">{'// ai study assistant'}</span>
            <h2 className="section-title">Your 24/7 Homeopathy <em style={{fontStyle:'normal',color:'var(--emerald)'}}>AI Guru</em></h2>
            <p className="section-sub" style={{marginBottom:'2rem'}}>Not just answers — referenced answers. Every response cites the exact book, chapter and author so you learn correctly.</p>
            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div className="feature-row"><div className="feature-icon">📖</div><div><div className="feature-title">Book-Referenced Answers</div><div className="feature-desc">Matches database before answering — Kent, Boericke, Hahnemann</div></div></div>
              <div className="feature-row"><div className="feature-icon">⚡</div><div><div className="feature-title">Instant Response</div><div className="feature-desc">No hallucinations — only verified homeopathy knowledge</div></div></div>
              <div className="feature-row"><div className="feature-icon">🎯</div><div><div className="feature-title">Confidence Level</div><div className="feature-desc">Each answer shows confidence % so you know how reliable it is</div></div></div>
            </div>
          </div>
          <div className="ai-chat-window">
            <div className="chat-header">
              <div className="chat-avatar"><img src="/logo.png" alt="Logo" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}} /></div>
              <div><div className="chat-name">DSW AI Assistant</div><div className="chat-status"><span className="dot-live"></span>Online — Homeopathy Mode</div></div>
            </div>
            <div className="chat-messages">
              {chatMessages.map((m, i) => (
                <div key={i} className="msg" style={m.type === 'user' ? {marginLeft:'auto'} : {}}>
                  <div className={m.type === 'bot' ? 'msg-bot' : 'msg-user'}>
                    {m.text.split('\n').map((line, j) => <span key={j}>{line}<br/></span>)}
                    {m.ref && <div className="msg-ref">📚 {m.ref}</div>}
                  </div>
                </div>
              ))}
              {chatTyping && <div className="msg"><div className="msg-bot"><div className="typing-indicator"><div className="typing-dot"></div><div className="typing-dot"></div><div className="typing-dot"></div></div></div></div>}
              <div ref={chatEndRef} />
            </div>
            <div className="chat-input-row">
              <input className="chat-input" type="text" placeholder="Koi bhi remedy poochiye... e.g. Pulsatilla" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} />
              <button className="chat-send" onClick={sendMessage}>➤</button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ EXAM ══════ */}
      <section className="exam-section" id="exam">
        <div className="exam-inner">
          <div>
            <span className="section-tag">{'// mcq exam engine'}</span>
            <h2 className="section-title">500 MCQ — <em style={{fontStyle:'normal',color:'var(--gold)'}}>Exam Ready</em></h2>
            <p className="section-sub" style={{marginBottom:'2rem'}}>Practice mode, mock test, timed exam — complete with auto-scoring and weak topic analysis after every session.</p>
            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div className="exam-feature-box"><div style={{fontSize:'0.88rem',fontWeight:600}}>📊 Weak Topic Detection</div><div style={{fontSize:'0.75rem',fontFamily:"'JetBrains Mono',monospace",color:'var(--emerald)'}}>AUTO</div></div>
              <div className="exam-feature-box exam-feature-box-gold"><div style={{fontSize:'0.88rem',fontWeight:600}}>⏱ Custom Timer System</div><div style={{fontSize:'0.75rem',fontFamily:"'JetBrains Mono',monospace",color:'var(--gold)'}}>1 MIN/Q</div></div>
              <div className="exam-feature-box"><div style={{fontSize:'0.88rem',fontWeight:600}}>📈 Result Analysis</div><div style={{fontSize:'0.75rem',fontFamily:"'JetBrains Mono',monospace",color:'var(--emerald)'}}>DETAILED</div></div>
            </div>
          </div>
          <div className="exam-demo">
            <div className="exam-topbar">
              <div className="exam-title-sm">🧪 Mock Test — Materia Medica</div>
              <div className="timer-display">{String(Math.floor(timerVal / 60)).padStart(2, '0')}:{String(timerVal % 60).padStart(2, '0')}</div>
            </div>
            <div className="exam-body">
              <div className="progress-bar-wrap"><div className="progress-bar" style={{width:`${((curQ + 1) / questions.length) * 100}%`}}></div></div>
              <div className="q-count">Question {curQ + 1} of {questions.length}</div>
              <div className="q-text">{q.q}</div>
              <div className="options-list">
                {q.opts.map((opt, idx) => {
                  let cls = 'option';
                  if (answered) {
                    if (idx === q.ans) cls += ' correct';
                    else if (idx === selectedOpt && idx !== q.ans) cls += ' wrong';
                  }
                  return <div key={idx} className={cls} onClick={() => selectOption(idx)}><div className="option-key">{String.fromCharCode(65 + idx)}</div>{opt}</div>;
                })}
              </div>
              <div className="exam-footer">
                <div style={{fontSize:'0.8rem',color:'var(--muted)'}}>{answered ? (selectedOpt === q.ans ? '✅ Correct!' : timerVal === 0 ? '⏱ Time up! Correct answer shown.' : '❌ Wrong answer') : 'Select an option'}</div>
                <button className="btn-next" disabled={!answered} onClick={nextQuestion}>Next →</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ SEARCH ══════ */}
      <section className="search-section" id="search">
        <div className="search-inner">
          <div className="section-header" style={{textAlign:'center'}}>
            <span className="section-tag">{'// therapeutic search engine'}</span>
            <h2 className="section-title">Google for Homeopathy 🔍</h2>
            <p className="section-sub" style={{margin:'0 auto'}}>Search by disease, symptom combination, or remedy name — get instant clinical results.</p>
          </div>
          <div className="search-box-wrap">
            <span className="search-icon">🔍</span>
            <input className="search-box" type="text" placeholder="e.g. gastritis + anger, or child weeping..." value={searchBox} onChange={e => setSearchBox(e.target.value)} onKeyDown={e => e.key === 'Enter' && doSearch()} />
            <button className="search-btn" onClick={doSearch}>Search</button>
          </div>
          <div className="search-tags">
            {['Gastritis anger', 'Child weeping consolation', 'Anxiety exam', 'Fever thirst', 'Headache sun'].map(t => (
              <span key={t} className="tag-chip" onClick={() => { setSearchBox(t); quickSearch(t); }}>{t.replace(/([a-z])([A-Z])/g, '$1 + $2')}</span>
            ))}
          </div>
          <div className="search-results">
            {searchResults.map((r, i) => (
              <div key={i} className="result-card">
                <div className="result-remedy">{r.name}</div>
                <div className="result-detail"><div className="result-title">{r.title}</div><div className="result-text">{r.text}</div><div className="result-ref">📚 {r.ref}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ PRICING ══════ */}
      <section className="pricing-section" id="pricing">
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div className="section-header" style={{textAlign:'center'}}>
            <span className="section-tag">{'// subscription plans'}</span>
            <h2 className="section-title">Simple, Honest Pricing</h2>
            <p className="section-sub" style={{margin:'0 auto'}}>Start free. Upgrade when you&apos;re ready to unlock the full power of DSW Med-Learn.</p>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="plan-name">Free Plan</div><div className="plan-price">₹0<span>/month</span></div><div className="plan-desc">For students just starting out</div>
              <ul className="plan-features"><li>Basic remedy search</li><li>50 MCQ questions</li><li>Digital library (limited)</li><li>Homeopathy history</li><li className="locked">AI Study Assistant</li><li className="locked">Kent Repertory</li><li className="locked">Case Taking System</li><li className="locked">Community Chat</li></ul>
              <button className="btn-plan btn-plan-ghost" onClick={() => openModal('signup')}>Get Started Free</button>
            </div>
            <div className="pricing-card popular">
              <div className="popular-badge">⭐ Most Popular</div>
              <div className="plan-name">Premium Monthly</div><div className="plan-price">₹299<span>/month</span></div><div className="plan-desc">For serious BHMS students</div>
              <ul className="plan-features"><li>Full 500 MCQ Engine</li><li>AI Study Assistant (unlimited)</li><li>Kent Repertory Software</li><li>Case Taking System</li><li>Full Digital Library + Downloads</li><li>Student Community Chat</li><li>Weak Topic Analysis</li><li>Doctor Discussion Room</li></ul>
              <button className="btn-plan btn-plan-main" onClick={() => openModal('signup')}>Start Premium</button>
            </div>
            <div className="pricing-card">
              <div className="plan-name">Annual Plan</div><div className="plan-price">₹1999<span>/year</span></div><div className="plan-desc">Best value — save ₹1,589</div>
              <ul className="plan-features"><li>Everything in Premium</li><li>Priority Doctor Access</li><li>Offline PDF Downloads</li><li>Certificate of Completion</li><li>Early access to new modules</li><li>Dedicated study dashboard</li><li>Video consultation credit</li><li>1-on-1 mentor sessions</li></ul>
              <button className="btn-plan btn-plan-ghost" onClick={() => openModal('signup')}>Get Annual Plan</button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo"><div className="logo-icon"><img src="/logo.png" alt="DSW Med-Learn Logo" /></div><div><div className="logo-text">DSW Med-Learn</div><div className="logo-sub">Dr. Sagathiya Wellness</div></div></div>
            <p>India&apos;s most comprehensive homeopathy education platform — built for BHMS students, interns and practitioners.</p>
          </div>
          <div className="footer-col"><h4>Platform</h4><ul><li><a href="#">AI Assistant</a></li><li><a href="#">MCQ Engine</a></li><li><a href="#">Repertory</a></li><li><a href="/library">Digital Library</a></li><li><a href="#">Case System</a></li></ul></div>
          <div className="footer-col"><h4>Learn</h4><ul><li><a href="#">Materia Medica</a></li><li><a href="#">Organon</a></li><li><a href="#">Miasm Theory</a></li><li><a href="#">Case Taking</a></li><li><a href="#">Practitioners</a></li></ul></div>
          <div className="footer-col"><h4>Support</h4><ul><li><a href="#">About DSW</a></li><li><a href="#">Contact Us</a></li><li><a href="#">Privacy Policy</a></li><li><a href="#">Terms of Use</a></li><li><a href="#">Razorpay Billing</a></li></ul></div>
        </div>
        <div className="footer-bottom"><div className="footer-copy">© 2025 Dr. Sagathiya Wellness. All rights reserved.</div><div className="footer-badge">v1.0 — Phase 1 Launch</div></div>
      </footer>

      {/* ══════ LOGIN MODAL ══════ */}
      <div className={`modal-overlay${activeModal === 'login' ? ' open' : ''}`} onClick={e => e.target === e.currentTarget && closeModal()}>
        <div className="modal">
          <button className="modal-close" onClick={closeModal}>×</button>
          <h2>Welcome Back 🌿</h2><div className="modal-sub">Login to your DSW Med-Learn account</div>
          {loginError && <div className="error-box">❌ {loginError}</div>}
          <div className="form-group"><label className="form-label">Email / Mobile</label><input className="form-input" id="loginEmail" type="text" placeholder="your@email.com" /></div>
          <div className="form-group"><label className="form-label">Password</label><input className="form-input" id="loginPassword" type="password" placeholder="••••••••" /></div>
          <div className="info-box">🔑 <strong>Demo Student:</strong> arjun@demo.com / demo@123</div>
          <button className="btn-submit" disabled={authLoading} onClick={handleLogin}>{authLoading ? 'Logging in...' : 'Login to Platform'}</button>
          <div className="modal-switch">Don&apos;t have an account? <a onClick={() => openModal('signup')}>Register Free →</a></div>
        </div>
      </div>

      {/* ══════ SIGNUP MODAL ══════ */}
      <div className={`modal-overlay${activeModal === 'signup' ? ' open' : ''}`} onClick={e => e.target === e.currentTarget && closeModal()}>
        <div className="modal">
          <button className="modal-close" onClick={closeModal}>×</button>
          <h2>Join DSW Med-Learn 🌱</h2><div className="modal-sub">Create your free student account</div>
          {signupError && <div className="error-box">❌ {signupError}</div>}
          <div className="form-row">
            <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" id="signupName" type="text" placeholder="Dr. Your Name" /></div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" id="signupEmail" type="email" placeholder="your@email.com" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Password</label><input className="form-input" id="signupPassword" type="password" placeholder="Min 6 characters" /></div>
            <div className="form-group"><label className="form-label">College</label><input className="form-input" id="signupCollege" type="text" placeholder="Your college name" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Year</label><select className="form-select" id="signupYear"><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option><option>Intern</option></select></div>
            <div className="form-group"><label className="form-label">Mobile (Optional)</label><input className="form-input" type="text" placeholder="+91 XXXXX XXXXX" /></div>
          </div>
          <button className="btn-submit" disabled={authLoading} onClick={handleSignup}>{authLoading ? 'Creating Account...' : 'Create Free Account 🚀'}</button>
          <div className="modal-switch">Already have an account? <a onClick={() => openModal('login')}>Login →</a></div>
        </div>
      </div>

      {/* ══════ ADMIN LOGIN MODAL ══════ */}
      <div className={`modal-overlay${activeModal === 'adminlogin' ? ' open' : ''}`} onClick={e => e.target === e.currentTarget && closeModal()}>
        <div className="modal" style={{borderColor:'rgba(212,168,67,0.25)'}}>
          <button className="modal-close" onClick={closeModal}>×</button>
          <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
            <div style={{width:56,height:56,background:'linear-gradient(135deg,var(--gold),#b8893a)',borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.6rem',margin:'0 auto 0.75rem'}}>🔐</div>
            <h2 style={{color:'var(--gold)'}}>Admin Login</h2>
            <div className="modal-sub">Dr. Sagathiya Wellness — Control Panel</div>
          </div>
          {adminError && <div className="error-box">❌ {adminError}</div>}
          <div className="form-group"><label className="form-label">Admin Username</label><input className="form-input" id="adminUser" type="text" placeholder="admin" style={{borderColor:'rgba(212,168,67,0.2)'}} /></div>
          <div className="form-group"><label className="form-label">Admin Password</label><input className="form-input" id="adminPass" type="password" placeholder="••••••••" style={{borderColor:'rgba(212,168,67,0.2)'}} /></div>
          <button className="btn-submit" style={{background:'linear-gradient(135deg,var(--gold),#b8893a)',color:'var(--forest)'}} disabled={authLoading} onClick={handleAdminLogin}>{authLoading ? 'Authenticating...' : 'Enter Admin Panel 🔐'}</button>
          <div className="credential-box">
            <div style={{fontSize:'0.72rem',fontFamily:"'JetBrains Mono',monospace",color:'var(--gold)',marginBottom:'0.3rem'}}>{'// CREDENTIALS'}</div>
            <div style={{fontSize:'0.8rem',color:'rgba(245,240,232,0.6)'}}>Username: <strong style={{color:'var(--cream)'}}>admin</strong> &nbsp;|&nbsp; Password: <strong style={{color:'var(--cream)'}}>dsw@2025</strong></div>
          </div>
        </div>
      </div>

      {/* ══════ DEPLOY GUIDE MODAL ══════ */}
      <div className={`modal-overlay${activeModal === 'deploy' ? ' open' : ''}`} onClick={e => e.target === e.currentTarget && closeModal()}>
        <div className="deploy-modal">
          <button className="modal-close" onClick={closeModal}>×</button>
          <div style={{marginBottom:'1.5rem'}}>
            <span style={{fontSize:'0.72rem',fontFamily:"'JetBrains Mono',monospace",color:'var(--emerald)',textTransform:'uppercase',letterSpacing:'0.2em'}}>{'// Deploy Guide'}</span>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.5rem',marginTop:'0.4rem'}}>Google Par Website Kaise Lagayein 🚀</h2>
            <p style={{fontSize:'0.83rem',color:'var(--muted)',marginTop:'0.3rem'}}>Free mein — sirf 10 minute lagte hain</p>
          </div>
          <div className="deploy-step"><div className="deploy-num">1</div><div><div className="deploy-step-title">GitHub Account Banao (Free)</div><div className="deploy-step-text">👉 <strong>github.com</strong> par jaao → Sign Up karo (free hai)<br/>Ek new repository banao — name: <strong>dsw-medlearn</strong></div></div></div>
          <div className="deploy-step"><div className="deploy-num">2</div><div><div className="deploy-step-title">HTML File Upload Karo</div><div className="deploy-step-text">Download ki hui <strong>dsw-medlearn.html</strong> file ko rename karo:<br/><strong>index.html</strong> — phir GitHub repository mein upload karo<div className="code-snippet">File name: index.html{'\n'}Repository: dsw-medlearn (Public)</div></div></div></div>
          <hr className="deploy-divider"/><p style={{fontSize:'0.8rem',fontWeight:600,color:'var(--gold)',marginBottom:'1rem'}}>🌟 Option A — Vercel (BEST — Free Custom Domain)</p>
          <div className="deploy-step"><div className="deploy-num">3A</div><div><div className="deploy-step-title">Vercel Par Deploy Karo</div><div className="deploy-step-text">👉 <strong>vercel.com</strong> → Login with GitHub → &quot;New Project&quot; → Apna <strong>dsw-medlearn</strong> repo select karo → Deploy click karo<div className="code-snippet">Aapki website live hogi:{'\n'}https://dsw-medlearn.vercel.app ✅</div></div></div></div>
          <hr className="deploy-divider"/><p style={{fontSize:'0.8rem',fontWeight:600,color:'var(--emerald)',marginBottom:'1rem'}}>✅ Option B — GitHub Pages (Seedha Free)</p>
          <div className="deploy-step"><div className="deploy-num">3B</div><div><div className="deploy-step-title">GitHub Pages Enable Karo</div><div className="deploy-step-text">Repository → Settings → Pages → Source: <strong>main branch</strong> → Save<br/>2 minute mein website live ho jayegi!<div className="code-snippet">https://yourusername.github.io/dsw-medlearn ✅</div></div></div></div>
          <hr className="deploy-divider"/>
          <div className="deploy-summary"><div style={{fontSize:'0.8rem',fontWeight:600,color:'var(--emerald)',marginBottom:'0.4rem'}}>💡 Summary — Sabse Aasaan Tarika:</div><div style={{fontSize:'0.8rem',color:'rgba(245,240,232,0.7)',lineHeight:1.7}}>1. github.com → account banao<br/>2. index.html upload karo<br/>3. vercel.com → deploy karo<br/>4. Link share karo — website live! 🎉</div></div>
        </div>
      </div>

      {/* ══════ ADMIN DASHBOARD ══════ */}
      <div className={`admin-overlay${adminOpen ? ' open' : ''}`}>
        <div className="admin-topbar">
          <div className="admin-logo"><div className="admin-logo-icon"><img src="/logo.png" alt="DSW Med-Learn Logo" /></div><div className="admin-logo-text">DSW Med-Learn</div><div className="admin-badge">ADMIN PANEL</div></div>
          <div className="admin-user"><span>👤 Dr. Sagathiya &nbsp;|&nbsp; <span style={{color:'var(--emerald)'}}>● Online</span></span><button className="btn-logout" onClick={() => setAdminOpen(false)}>Logout</button></div>
        </div>
        <div className="admin-body">
          <div className="admin-sidebar">
            <div className="sidebar-section">Main</div>
            {[
              { id: 'dashboard', icon: '📊', label: 'Dashboard' },
              { id: 'students', icon: '👥', label: 'Students' },
              { id: 'mcq', icon: '🧪', label: 'MCQ Manager' },
              { id: 'remedies', icon: '💊', label: 'Remedies DB' },
            ].map(s => <div key={s.id} className={`sidebar-item${adminPage === s.id ? ' active' : ''}`} onClick={() => setAdminPage(s.id)}><span className="icon">{s.icon}</span>{s.label}</div>)}
            <div className="sidebar-section">Content</div>
            {[
              { id: 'library', icon: '📚', label: 'Library' },
              { id: 'cases', icon: '🩺', label: 'Cases' },
            ].map(s => <div key={s.id} className={`sidebar-item${adminPage === s.id ? ' active' : ''}`} onClick={() => setAdminPage(s.id)}><span className="icon">{s.icon}</span>{s.label}</div>)}
            <div className="sidebar-section">Revenue</div>
            {[
              { id: 'premium', icon: '⭐', label: 'Premium Users' },
              { id: 'payments', icon: '💳', label: 'Payments' },
            ].map(s => <div key={s.id} className={`sidebar-item${adminPage === s.id ? ' active' : ''}`} onClick={() => setAdminPage(s.id)}><span className="icon">{s.icon}</span>{s.label}</div>)}
          </div>
          <div className="admin-main">
            {renderAdminPage()}
          </div>
        </div>
      </div>

      {/* ══════ TOAST ══════ */}
      <div className={`toast${toastMsg ? ' show' : ''}`}>{toastMsg}</div>
    </>
  );
}
