// ══════════════════════════════════════════════════════════════════════════
// TheHeritagePath_v5.jsx — "The Wealth Advisor Edition"
//
// UPGRADE LOG vs v4-revised:
//   [1] Equity-based filter — replaces budget with "Vốn tự có"
//       Leverage calc: purchasePower = equity / 0.3
//       Advisor note rendered in BespokeSearch
//   [2] Hồn Việt copy — 100% from i18n.js Final Copy
//   [3] QuickEntry section — below Hero, fast lead capture
//       score +20 on submit · source "quick_entry" in payload
//   [4] Knowledge Lock blur — 5-year scenario blurred until CTA click
//       isKnowledgeUnlocked state; lifts blur on CTA press
//   [5] Interaction scoring engine (SCORE_WEIGHTS from dataStore)
//       KnowledgeLock viewed +25 · Journal viewed +10 · Form +50
//   [6] n8n payload v5:
//       { selected_equity, depth_score, interest_tag,
//         viewed_projects_count, session_duration, session_id,
//         psychological_tag (strict 3 values), ... }
//
// ENDPOINTS (replace placeholders before deploy):
//   CONCIERGE_ENDPOINT  = "/api/concierge"         ← n8n Webhook URL
//   QUICK_ENTRY_ENDPOINT = "/api/quick-entry"       ← n8n Webhook URL
//
// DESIGN TOKENS (unchanged):
//   Ivory #F8F5EF · Charcoal #27241C · Navy #0D1B2A
//   Gold  #B49158 · Cream #EDE7DB    · Mist  #C5BFB5
// ══════════════════════════════════════════════════════════════════════════

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";

import {
  projects,
  journal,
  glossary,
  EQUITY_RANGES,
  PILLARS,
  STAGES,
  SCORE_WEIGHTS,
} from "../data/dataStore";
import { i18n } from "../data/i18n";

// ══════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ══════════════════════════════════════════════════════════════════════════
const T = {
  ivory:     "#F8F5EF",
  charcoal:  "#27241C",
  navy:      "#0D1B2A",
  gold:      "#B49158",
  goldLight: "#C8A96E",
  goldDim:   "#8A6E3F",
  goldLine:  "rgba(180,145,88,0.22)",
  goldGlow:  "rgba(180,145,88,0.13)",
  cream:     "#EDE7DB",
  mist:      "#C5BFB5",
  stone:     "#7A7468",
  fog:       "#F2EFE9",
  navyMid:   "#142236",
};

// ══════════════════════════════════════════════════════════════════════════
// GLOBAL STYLES
// ══════════════════════════════════════════════════════════════════════════
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Be+Vietnam+Pro:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; font-size: 16px; -webkit-text-size-adjust: 100%; }
    body {
      background: ${T.ivory}; color: ${T.charcoal};
      font-family: 'Be Vietnam Pro', sans-serif; font-weight: 400;
      overflow-x: hidden; -webkit-font-smoothing: antialiased;
    }
    ::-webkit-scrollbar { width: 2px; }
    ::-webkit-scrollbar-track { background: ${T.ivory}; }
    ::-webkit-scrollbar-thumb { background: ${T.mist}; border-radius: 1px; }
    ::selection { background: ${T.goldDim}; color: ${T.ivory}; }

    .f-display { font-family: 'Playfair Display', Georgia, serif; }
    .f-accent  { font-family: 'Cormorant Garamond', Georgia, serif; }
    .f-sans    { font-family: 'Be Vietnam Pro', sans-serif; }

    .gold-text {
      background: linear-gradient(120deg, ${T.goldDim} 0%, ${T.gold} 45%, ${T.goldLight} 70%, ${T.gold} 100%);
      background-size: 220% 100%;
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      animation: gold-shift 7s ease-in-out infinite;
    }
    @keyframes gold-shift { 0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;} }

    .btn-primary {
      display: inline-flex; align-items: center; gap: 10px;
      background: ${T.gold}; color: ${T.ivory}; border: none; cursor: pointer;
      font-family: 'Be Vietnam Pro', sans-serif; font-size: 11px; font-weight: 500;
      letter-spacing: 0.26em; text-transform: uppercase; padding: 15px 38px;
      position: relative; overflow: hidden;
      transition: background 0.4s, box-shadow 0.4s, transform 0.25s;
    }
    .btn-primary:hover { background: ${T.goldDim}; box-shadow: 0 12px 36px rgba(180,145,88,0.28); transform: translateY(-1px); }
    .btn-primary::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent); transform:translateX(-100%); transition:transform 0.6s; }
    .btn-primary:hover::after { transform: translateX(100%); }
    .btn-primary:disabled { opacity: 0.65; cursor: not-allowed; transform: none; box-shadow: none; }

    .btn-ghost {
      display: inline-flex; align-items: center; gap: 10px;
      background: transparent; border: 1px solid ${T.mist}; color: ${T.stone};
      cursor: pointer; font-family: 'Be Vietnam Pro', sans-serif;
      font-size: 11px; font-weight: 400; letter-spacing: 0.22em; text-transform: uppercase;
      padding: 15px 36px; transition: all 0.35s;
    }
    .btn-ghost:hover { border-color: ${T.gold}; color: ${T.gold}; }

    .inp {
      width: 100%; background: transparent; border: none;
      border-bottom: 1px solid ${T.mist}; color: ${T.charcoal};
      font-family: 'Be Vietnam Pro', sans-serif; font-size: 14px; font-weight: 400;
      padding: 16px 0 10px; outline: none; letter-spacing: 0.02em; transition: border-color 0.3s;
    }
    .inp::placeholder { color: ${T.mist}; }
    .inp:focus { border-bottom-color: ${T.gold}; }
    .inp.has-error { border-bottom-color: #b04040; }
    textarea.inp { resize: none; line-height: 1.75; }

    .lbl {
      display: inline-block; font-family: 'Be Vietnam Pro', sans-serif;
      font-size: 10px; font-weight: 500; letter-spacing: 0.46em; text-transform: uppercase;
      color: ${T.gold}; margin-bottom: 20px;
    }

    .section { padding: clamp(72px,10vw,120px) clamp(20px,6vw,80px); }

    /* Pillar card */
    .pillar-card {
      position: relative; text-align: left; cursor: pointer;
      padding: clamp(18px,2.5vw,28px); border: 1px solid ${T.mist}; background: transparent;
      transition: border-color 0.35s, background 0.35s, transform 0.25s;
    }
    .pillar-card:hover { border-color: ${T.gold}; transform: translateY(-2px); }
    .pillar-card.selected { border-color: ${T.charcoal}; background: ${T.charcoal}; }

    /* Equity chip */
    .equity-chip {
      position: relative; cursor: pointer; text-align: left;
      padding: 14px 20px; border: 1px solid ${T.mist}; background: transparent;
      transition: border-color 0.3s, background 0.3s, transform 0.22s;
    }
    .equity-chip:hover { border-color: ${T.goldDim}; transform: translateY(-1px); }
    .equity-chip.selected { border-color: ${T.gold}; background: rgba(180,145,88,0.08); }

    /* Stage chip */
    .stage-chip {
      position: relative; cursor: pointer; text-align: left;
      padding: 16px 22px; border: 1px solid ${T.mist}; background: transparent;
      transition: border-color 0.3s, background 0.3s, transform 0.22s;
    }
    .stage-chip:hover { border-color: ${T.goldDim}; transform: translateY(-1px); }
    .stage-chip.selected { border-color: ${T.gold}; background: rgba(180,145,88,0.07); }

    /* Heritage match badge */
    .heritage-badge {
      display: inline-flex; align-items: center; gap: 5px;
      font-family: 'Be Vietnam Pro', sans-serif; font-size: 9px; font-weight: 500;
      letter-spacing: 0.26em; text-transform: uppercase;
      color: ${T.gold}; padding: 4px 10px;
      border: 1px solid ${T.goldLine}; background: rgba(180,145,88,0.08);
    }

    /* Advisor box */
    .advisor-box {
      border-left: 2px solid ${T.gold};
      padding: clamp(24px,3vw,36px) clamp(24px,3vw,40px);
      background: ${T.fog}; position: relative;
    }

    /* Equity note */
    .equity-note {
      background: rgba(180,145,88,0.06); border: 1px solid ${T.goldLine};
      padding: 16px 20px; margin-top: 20px;
    }

    /* Knowledge lock blur overlay */
    .kl-blur-overlay {
      position: absolute; inset: 0; z-index: 4;
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      background: rgba(248,245,239,0.6);
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; gap: 16px; text-align: center;
      padding: 24px;
    }

    /* Glossary tooltip trigger */
    .gloss-trigger {
      border-bottom: 1px dashed ${T.gold}; cursor: help;
      display: inline; color: inherit; background: none;
      font: inherit; padding: 0; outline-offset: 2px;
    }
    .gloss-trigger:focus-visible { outline: 1px solid ${T.gold}; }

    /* Success panel */
    .success-panel { padding: clamp(40px,5vw,64px) 0; text-align: center; }

    .habitus-gloss {
      font-family: 'Be Vietnam Pro', sans-serif; font-size: 10px; font-weight: 300;
      font-style: italic; color: ${T.stone}; letter-spacing: 0.04em;
      display: block; margin-top: 4px;
    }

    @media (max-width: 768px) {
      .section { padding: 64px clamp(18px,5vw,32px); }
      .desktop-nav { display: none !important; }
      .mobile-menu-btn { display: flex !important; }
      #concierge > div { grid-template-columns: 1fr !important; }
      .about-grid { grid-template-columns: 1fr !important; }
      .kl-grid { grid-template-columns: 1fr !important; }
      .quick-grid { grid-template-columns: 1fr !important; }
    }
    @media (max-width: 640px) {
      .pillar-grid  { grid-template-columns: 1fr !important; }
      .stage-grid   { grid-template-columns: 1fr !important; }
      .equity-grid  { grid-template-columns: repeat(2,1fr) !important; }
    }
    @media (max-width: 900px) {
      .journal-featured  { grid-column: span 12 !important; }
      .journal-secondary { grid-column: span 12 !important; }
      .journal-small     { grid-column: span 12 !important; }
    }
  `}</style>
);

// ══════════════════════════════════════════════════════════════════════════
// MOTION VARIANTS
// ══════════════════════════════════════════════════════════════════════════
const MV = {
  fadeUp:  { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.22, 0.61, 0.36, 1] } } },
  fadeIn:  { hidden: { opacity: 0 },        visible: { opacity: 1, transition: { duration: 0.55, ease: "easeOut" } } },
  stagger: { hidden: {}, visible: { transition: { staggerChildren: 0.11, delayChildren: 0.06 } } },
  scaleIn: { hidden: { opacity: 0, scale: 0.97 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.62, ease: [0.22, 0.61, 0.36, 1] } } },
};

// ══════════════════════════════════════════════════════════════════════════
// API ENDPOINTS — replace with your n8n Webhook URLs before deploy
// ══════════════════════════════════════════════════════════════════════════
// ← REPLACE: n8n Webhook URL for main consultation form
const CONCIERGE_ENDPOINT   = "/api/concierge";
// ← REPLACE: n8n Webhook URL for Quick Entry (fast lead capture)
const QUICK_ENTRY_ENDPOINT = "/api/quick-entry";

// ══════════════════════════════════════════════════════════════════════════
// VN PHONE VALIDATION
// ══════════════════════════════════════════════════════════════════════════
const VN_PHONE_RE = /^(\+?84|0)(3[2-9]|5[2568-9]|7[06-9]|8[0-9]|9[0-9])\d{7}$/;

// ══════════════════════════════════════════════════════════════════════════
// [6] STRICT PSYCHOLOGICAL_TAG — 3 values only
// ══════════════════════════════════════════════════════════════════════════
function computePsychologicalTag(need, lifeStage) {
  if (need === "toa_do_du_phong")                         return "Safety_Security";
  if (lifeStage === "children_grown" && need === "an_cu") return "Legacy_Transfer";
  if (lifeStage === "enjoying_privacy")                   return "Discreet_Luxury";
  return null;
}

function computeInterestType(need, lifeStage) {
  if (need === "toa_do_du_phong")     return "safety";
  if (need === "dau_tu")              return "leverage";
  if (lifeStage === "children_grown") return "legacy";
  return null;
}

// ══════════════════════════════════════════════════════════════════════════
// [1] EQUITY ADVISOR NOTE — injected from i18n template
// ══════════════════════════════════════════════════════════════════════════
function buildEquityNote(selectedEquity, t) {
  const range = EQUITY_RANGES.find(r => r.val === selectedEquity);
  if (!range) return null;
  if (!range.purchasePower) {
    return t.equity_advisor_note_unlimited_vi;
  }
  return t.equity_advisor_note_vi
    .replace("{equity}", range.maxEquity)
    .replace("{power}", range.purchasePower);
}

// ══════════════════════════════════════════════════════════════════════════
// ADVISOR MESSAGES — via i18n lookup
// ══════════════════════════════════════════════════════════════════════════
const NC = { an_cu: "an_cu", dau_tu: "dau_tu", toa_do_du_phong: "tod" };
const BC = { "5-10": "b1", "10-20": "b2", "20+": "b3" };

function getAdvisorMessages(need, budget, t) {
  const nc = NC[need] ?? null;
  const bc = BC[budget] ?? null;
  if (!nc) return { why_fit: t.advisor_default_fit, why_not: null };
  const fitKey = bc ? `advisor_${nc}_${bc}_fit` : `advisor_${nc}_fit`;
  const notKey = bc ? `advisor_${nc}_${bc}_not` : null;
  return {
    why_fit: t[fitKey] ?? t[`advisor_${nc}_fit`] ?? t.advisor_default_fit,
    why_not: notKey ? (t[notKey] ?? null) : null,
  };
}

// ══════════════════════════════════════════════════════════════════════════
// PAYMENT STRATEGY — via i18n lookup
// ══════════════════════════════════════════════════════════════════════════
function getPaymentStrategy(need, lifeStage, t) {
  const nc = need ?? "default";
  const sc = lifeStage ?? "any";
  return {
    title: t[`knowledge_payment_title_${nc}`] ?? t.knowledge_payment_title_default,
    body:  t[`knowledge_payment_body_${nc}_${sc}`]
        ?? t[`knowledge_payment_body_${nc}_any`]
        ?? t.knowledge_payment_body_default,
    miss:  t[`knowledge_payment_miss_${nc}`] ?? t.knowledge_payment_miss_default,
  };
}

// ══════════════════════════════════════════════════════════════════════════
// ENGAGEMENT GATE — 2+ selections OR 4s hover time
// ══════════════════════════════════════════════════════════════════════════
function hasEnoughEngagement({ selectedNeed, selectedEquity, selectedLifeStage, accumulatedMs }) {
  const dims = [selectedNeed, selectedEquity, selectedLifeStage].filter(Boolean).length;
  return dims >= 2 || accumulatedMs >= 4000;
}

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Module-level lang ref — synced from root, read by sub-components
let lang = "vi";

// ══════════════════════════════════════════════════════════════════════════
// HOOKS
// ══════════════════════════════════════════════════════════════════════════
function useScrolledSafe(threshold = 60) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let raf;
    const h = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > threshold));
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, [threshold]);
  return scrolled;
}

function SectionReveal({ children, style = {}, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  return (
    <motion.div ref={ref} variants={MV.stagger} initial="hidden"
      animate={inView ? "visible" : "hidden"} style={style} className={className}>
      {children}
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// GLOSSARY TOOLTIP
// ══════════════════════════════════════════════════════════════════════════
function GlossaryTooltip({ termKey, t, onOpen, children }) {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState({ x: 0, y: 0 });
  const ref             = useRef(null);
  const entry           = glossary[termKey];
  const definition      = t[entry?.defKey] ?? "";

  const openTip = useCallback(() => {
    if (!open && ref.current) {
      const r = ref.current.getBoundingClientRect();
      setPos({ x: r.left + r.width / 2, y: r.top });
      setOpen(true);
      onOpen?.();
    }
  }, [open, onOpen]);

  const closeTip = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("scroll", closeTip, { passive: true });
    return () => window.removeEventListener("scroll", closeTip);
  }, [open, closeTip]);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (!ref.current?.contains(e.target)) closeTip(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open, closeTip]);

  if (!entry) return <>{children}</>;

  return (
    <>
      <button ref={ref} className="gloss-trigger" type="button"
        onMouseEnter={openTip} onMouseLeave={closeTip}
        onClick={() => open ? closeTip() : openTip()}
        onFocus={openTip} onBlur={closeTip}
        aria-expanded={open}
        aria-label={`${entry.term} — ${t.glossary_aria_label}`}>
        {children ?? entry.term}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div role="tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.22, ease: "easeOut" } }}
            exit={{ opacity: 0, y: 4, scale: 0.97, transition: { duration: 0.15 } }}
            style={{
              position: "fixed",
              left: Math.max(12, Math.min(pos.x - 135, (typeof window !== "undefined" ? window.innerWidth : 800) - 282)),
              top: pos.y - 12, transform: "translateY(-100%)", zIndex: 9000,
              width: 270, background: T.charcoal, padding: "14px 18px 16px", pointerEvents: "none",
            }}>
            <div style={{ width: 24, height: 1, background: T.gold, marginBottom: 10 }} />
            <div style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 9, fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase", color: T.gold, marginBottom: 8 }}>
              {entry.term}
            </div>
            <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 12, fontWeight: 300, lineHeight: 1.68, color: T.cream }}>
              {definition}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// GATEKEEPER
// ══════════════════════════════════════════════════════════════════════════
function Gatekeeper({ onSelect }) {
  const [hovered, setHovered] = useState(null);
  const g = i18n.vi; // Always Vietnamese on entry screen

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.012, transition: { duration: 0.82, ease: [0.22, 0.61, 0.36, 1] } }}
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: T.navy,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>

      {/* Decorative rules */}
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1, transition: { duration: 1.4, ease: "easeInOut" } }}
        style={{ position: "absolute", top: "clamp(32px,5vw,60px)", left: "clamp(32px,6vw,80px)", right: "clamp(32px,6vw,80px)", height: "1px", background: T.goldLine, transformOrigin: "left" }} />
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1, transition: { duration: 1.4, ease: "easeInOut", delay: 0.1 } }}
        style={{ position: "absolute", bottom: "clamp(32px,5vw,60px)", left: "clamp(32px,6vw,80px)", right: "clamp(32px,6vw,80px)", height: "1px", background: T.goldLine, transformOrigin: "right" }} />

      <motion.div variants={MV.stagger} initial="hidden" animate="visible" style={{ textAlign: "center", maxWidth: 560 }}>
        <motion.div variants={MV.fadeUp} style={{ marginBottom: 8 }}>
          <span style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 10, letterSpacing: "0.52em", textTransform: "uppercase", color: T.gold }}>
            {g.gate_mark}
          </span>
        </motion.div>

        <motion.h1 variants={MV.fadeUp} className="f-display"
          style={{ fontSize: "clamp(32px,6vw,52px)", fontWeight: 500, color: T.ivory, letterSpacing: "0.04em", marginBottom: 24, lineHeight: 1.2 }}>
          {g.gate_brand}
        </motion.h1>

        <motion.div variants={MV.fadeUp} style={{ width: 48, height: 1, background: T.gold, margin: "0 auto 32px" }} />

        {/* Manifesto — from i18n, no slogan */}
        <motion.p variants={MV.fadeUp}
          style={{ fontFamily: "'Be Vietnam Pro'", fontSize: "clamp(13px,1.6vw,15px)", fontWeight: 300, color: "rgba(197,191,181,0.85)", marginBottom: 52, lineHeight: 1.85, letterSpacing: "0.015em" }}>
          {g.gate_manifesto}
        </motion.p>

        <motion.div variants={MV.fadeUp} style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { l: "vi", label: g.gate_vi, sub: g.gate_vi_sub },
            { l: "en", label: g.gate_en, sub: g.gate_en_sub },
          ].map(({ l, label, sub }) => (
            <motion.button key={l} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(l)}
              onMouseEnter={() => setHovered(l)} onMouseLeave={() => setHovered(null)}
              style={{ background: hovered === l ? T.gold : "transparent",
                border: `1px solid ${hovered === l ? T.gold : "rgba(197,191,181,0.3)"}`,
                color: hovered === l ? T.navy : T.cream, cursor: "pointer",
                padding: "18px 44px", transition: "all 0.35s ease", textAlign: "center", minWidth: 160 }}>
              <div style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 13, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</div>
              <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 12, fontStyle: "italic", opacity: 0.7, marginTop: 3 }}>{sub}</div>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// NAV
// ══════════════════════════════════════════════════════════════════════════
function Nav({ t, activeLang, onLangToggle }) {
  const scrolled = useScrolledSafe(40);
  const [menuOpen, setMenuOpen] = useState(false);
  const go = (id) => { setMenuOpen(false); scrollTo(id); };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.8, delay: 0.3, ease: "easeOut" } }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
          background: scrolled ? "rgba(248,245,239,0.94)" : "transparent",
          backdropFilter: scrolled ? "blur(18px) saturate(160%)" : "none",
          borderBottom: scrolled ? `1px solid ${T.goldLine}` : "none",
          transition: "all 0.5s ease",
          padding: `${scrolled ? 14 : 20}px clamp(20px,6vw,72px)` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <span className="f-display" style={{ fontSize: 18, fontWeight: 500, color: T.charcoal, letterSpacing: "0.08em" }}>The Heritage Path</span>
          </button>

          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 36 }}>
            {[
              { id: "about-advisor", label: t.nav_about },
              { id: "collections",   label: t.nav_collections },
              { id: "journal",       label: t.nav_journal },
              { id: "concierge",     label: t.nav_concierge },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => go(id)}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Be Vietnam Pro'", fontSize: 11, fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase", color: T.stone, transition: "color 0.3s" }}
                onMouseEnter={e => (e.target.style.color = T.gold)}
                onMouseLeave={e => (e.target.style.color = T.stone)}>
                {label}
              </button>
            ))}
            <button onClick={onLangToggle}
              style={{ background: "none", border: `1px solid ${T.mist}`, cursor: "pointer", padding: "6px 14px", fontFamily: "'Be Vietnam Pro'", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: T.stone, transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.gold; e.currentTarget.style.color = T.gold; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.mist; e.currentTarget.style.color = T.stone; }}>
              {activeLang === "vi" ? "EN" : "VI"}
            </button>
          </div>

          <button className="mobile-menu-btn" onClick={() => setMenuOpen(v => !v)}
            style={{ display: "none", background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: 5, padding: 4 }}>
            {[0,1,2].map(i => <span key={i} style={{ display: "block", width: 22, height: 1, background: T.charcoal }} />)}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 490, background: T.ivory, padding: "80px 32px 40px", borderBottom: `1px solid ${T.goldLine}` }}>
            {[
              { id: "about-advisor", label: t.nav_about },
              { id: "collections",   label: t.nav_collections },
              { id: "journal",       label: t.nav_journal },
              { id: "concierge",     label: t.nav_concierge },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => go(id)}
                style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", borderBottom: `1px solid ${T.cream}`, cursor: "pointer", fontFamily: "'Be Vietnam Pro'", fontSize: 13, fontWeight: 400, letterSpacing: "0.16em", textTransform: "uppercase", color: T.charcoal, padding: "16px 0" }}>
                {label}
              </button>
            ))}
            <button onClick={onLangToggle}
              style={{ marginTop: 20, background: "none", border: `1px solid ${T.mist}`, cursor: "pointer", padding: "10px 20px", fontFamily: "'Be Vietnam Pro'", fontSize: 11, letterSpacing: "0.22em", color: T.stone }}>
              {activeLang === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// HERO
// ══════════════════════════════════════════════════════════════════════════
function Hero({ t }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y  = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const op = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section ref={ref} style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", overflow: "hidden", background: T.navy }}>
      <motion.div style={{ position: "absolute", inset: "-10%", y }}
        initial={{ scale: 1.08 }} animate={{ scale: 1, transition: { duration: 2.5, ease: "easeOut" } }}>
        <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=85" alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(13,27,42,0.9) 0%,rgba(13,27,42,0.55) 60%,rgba(13,27,42,0.72) 100%)" }} />
      </motion.div>

      <motion.div style={{ position: "relative", zIndex: 2, width: "100%", padding: "160px clamp(20px,6vw,80px) 100px", opacity: op }}>
        <div style={{ maxWidth: 780 }}>
          <SectionReveal>
            <motion.div variants={MV.fadeUp}><span className="lbl">{t.hero_label}</span></motion.div>
            <motion.h1 variants={MV.fadeUp} className="f-display"
              style={{ fontSize: "clamp(36px,6.5vw,76px)", fontWeight: 400, color: T.ivory, lineHeight: 1.15, letterSpacing: "0.01em", marginBottom: 32, whiteSpace: "pre-line" }}>
              {t.hero_headline}
            </motion.h1>
            <motion.div variants={MV.fadeUp} style={{ width: 48, height: 1, background: T.gold, marginBottom: 28 }} />
            <motion.p variants={MV.fadeUp} className="f-accent"
              style={{ fontSize: "clamp(16px,2.2vw,21px)", fontWeight: 300, fontStyle: "italic", color: T.cream, maxWidth: 540, lineHeight: 1.65, marginBottom: 40 }}>
              {t.hero_sub}
            </motion.p>
            <motion.div variants={MV.fadeUp} style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
              <button className="btn-primary" onClick={() => scrollTo("about-advisor")}>
                {t.hero_cta} <span style={{ fontSize: 14 }}>→</span>
              </button>
              <button className="btn-ghost" onClick={() => scrollTo("concierge")}>{t.hero_cta2}</button>
            </motion.div>
            <motion.p variants={MV.fadeUp}
              style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 12, fontWeight: 300, fontStyle: "italic", color: "rgba(197,191,181,0.55)", maxWidth: 460, lineHeight: 1.7 }}>
              {t.hero_hint}
            </motion.p>
          </SectionReveal>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 2.2, duration: 0.8 } }}
        style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 3 }}>
        <span style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 9, letterSpacing: "0.36em", textTransform: "uppercase", color: "rgba(197,191,181,0.5)" }}>{t.hero_scroll}</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          style={{ width: 1, height: 32, background: `linear-gradient(to bottom,${T.gold},transparent)` }} />
      </motion.div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// [3] QUICK ENTRY — fast lead capture, score +20
// n8n endpoint: QUICK_ENTRY_ENDPOINT
// ══════════════════════════════════════════════════════════════════════════
function QuickEntry({ t, sessionId, onScoreAdd }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const [form, setForm]   = useState({ name: "", phone: "", company: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [phoneErr, setPhoneErr] = useState(false);

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    if (!VN_PHONE_RE.test(form.phone.trim())) { setPhoneErr(true); return; }
    if (form.company.trim()) { setStatus("success"); return; } // Honeypot

    setStatus("sending");
    setPhoneErr(false);

    const payload = {
      name:         form.name.trim(),
      phone:        form.phone.trim(),
      source:       "quick_entry",
      session_id:   sessionId,
      submitted_at: new Date().toISOString(),
      lang,
    };

    try {
      // ← n8n Webhook: QUICK_ENTRY_ENDPOINT
      await fetch(QUICK_ENTRY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus("success");
      onScoreAdd(SCORE_WEIGHTS.QUICK_ENTRY_SUBMIT); // +20
      setForm({ name: "", phone: "", company: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="quick-entry" style={{ background: T.fog, padding: "clamp(48px,6vw,72px) clamp(20px,6vw,80px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }} ref={ref}>
        <motion.div variants={MV.stagger} initial="hidden" animate={inView ? "visible" : "hidden"}
          className="quick-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "clamp(36px,5vw,72px)", alignItems: "center" }}>

          {/* Left — copy */}
          <div>
            <motion.div variants={MV.fadeUp}><span className="lbl">{t.quick_label}</span></motion.div>
            <motion.h2 variants={MV.fadeUp} className="f-display"
              style={{ fontSize: "clamp(22px,3vw,38px)", fontWeight: 400, color: T.charcoal, marginBottom: 16, letterSpacing: "0.02em", lineHeight: 1.3 }}>
              {t.quick_title}
            </motion.h2>
            <motion.p variants={MV.fadeUp}
              style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 14, fontWeight: 300, color: T.stone, lineHeight: 1.82, maxWidth: 420, marginBottom: 16 }}>
              {t.quick_sub}
            </motion.p>
            <motion.p variants={MV.fadeUp}
              style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 11, fontWeight: 300, fontStyle: "italic", color: T.mist }}>
              {t.quick_note}
            </motion.p>
          </div>

          {/* Right — micro-form */}
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div key="qs" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ textAlign: "center", padding: "32px 0" }}>
                <motion.div initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, transition: { type: "spring", stiffness: 220, damping: 20 } }}
                  style={{ width: 44, height: 44, border: `1px solid ${T.gold}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 18, color: T.gold }}>
                  ✓
                </motion.div>
                <p className="f-accent" style={{ fontSize: 18, fontStyle: "italic", fontWeight: 300, color: T.charcoal, lineHeight: 1.5 }}>
                  {t.quick_success}
                </p>
              </motion.div>
            ) : (
              <motion.form key="qf" variants={MV.stagger} initial="hidden" animate={inView ? "visible" : "hidden"}
                onSubmit={onSubmit} noValidate>
                {/* Honeypot */}
                <div style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} aria-hidden="true">
                  <input tabIndex={-1} autoComplete="off" value={form.company}
                    onChange={e => setForm(v => ({ ...v, company: e.target.value }))} />
                </div>

                <motion.div variants={MV.fadeUp} style={{ marginBottom: 20 }}>
                  <input className="inp" value={form.name}
                    onChange={e => setForm(v => ({ ...v, name: e.target.value }))}
                    placeholder={t.quick_name} required />
                </motion.div>

                <motion.div variants={MV.fadeUp} style={{ marginBottom: phoneErr ? 6 : 24 }}>
                  <input type="tel" className={`inp${phoneErr ? " has-error" : ""}`} value={form.phone}
                    onChange={e => { setForm(v => ({ ...v, phone: e.target.value })); setPhoneErr(false); }}
                    placeholder={t.quick_phone} required />
                  <AnimatePresence>
                    {phoneErr && (
                      <motion.p key="qpe" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 11, fontWeight: 300, fontStyle: "italic", color: "#b04040", marginTop: 6, marginBottom: 16 }}>
                        {t.errors_phone_invalid}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={MV.fadeUp}>
                  <motion.button type="submit" className="btn-primary"
                    whileHover={status !== "sending" ? { y: -1 } : {}}
                    disabled={status === "sending"}
                    style={{ width: "100%", justifyContent: "center" }}>
                    {status === "sending" ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                          style={{ display: "inline-block", width: 14, height: 14, border: `1px solid rgba(248,245,239,0.4)`, borderTopColor: T.ivory, borderRadius: "50%" }} />
                        {t.quick_sending}
                      </span>
                    ) : t.quick_submit}
                  </motion.button>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ABOUT ADVISOR
// ══════════════════════════════════════════════════════════════════════════
function AboutAdvisor({ t }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about-advisor" style={{ background: T.navy, padding: "clamp(80px,10vw,128px) clamp(20px,6vw,80px)" }} ref={ref}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div variants={MV.stagger} initial="hidden" animate={inView ? "visible" : "hidden"}>
          <motion.div variants={MV.fadeUp}><span className="lbl" style={{ color: T.gold }}>{t.about_label}</span></motion.div>
          <motion.h2 variants={MV.fadeUp} className="f-display"
            style={{ fontSize: "clamp(22px,3.2vw,44px)", fontWeight: 400, color: T.ivory, lineHeight: 1.25, letterSpacing: "0.015em", marginBottom: 32, maxWidth: 720 }}>
            {t.about_title}
          </motion.h2>
          <motion.div variants={MV.fadeUp} style={{ width: 44, height: 1, background: T.gold, marginBottom: 44 }} />

          <motion.div variants={MV.fadeUp} style={{ borderLeft: `2px solid ${T.gold}`, paddingLeft: 24, marginBottom: 44 }}>
            <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: "clamp(13px,1.5vw,15px)", fontWeight: 500, color: T.cream, lineHeight: 1.75 }}>
              {t.about_trust}
            </p>
          </motion.div>

          <motion.div variants={MV.fadeUp} className="about-grid"
            style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: "clamp(40px,5vw,72px)", alignItems: "start" }}>
            <div>
              <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 15, fontWeight: 500, color: T.cream, lineHeight: 1.8, marginBottom: 10 }}>{t.about_p1_bold}</p>
              <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 14, fontWeight: 300, color: "rgba(197,191,181,0.78)", lineHeight: 1.85, marginBottom: 28 }}>{t.about_p1_body}</p>
              <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 15, fontWeight: 500, color: T.cream, lineHeight: 1.8, marginBottom: 10 }}>{t.about_p2_bold}</p>
              <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 14, fontWeight: 300, color: "rgba(197,191,181,0.78)", lineHeight: 1.85, marginBottom: 36 }}>{t.about_p2_body}</p>
              <p className="f-accent" style={{ fontSize: "clamp(16px,2vw,20px)", fontStyle: "italic", fontWeight: 300, color: T.gold, lineHeight: 1.65, marginBottom: 40 }}>
                "{t.about_closing}"
              </p>
              <div style={{ paddingTop: 28, borderTop: `1px solid ${T.goldLine}` }}>
                <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 13, fontWeight: 300, color: "rgba(197,191,181,0.6)", lineHeight: 1.75, marginBottom: 24, fontStyle: "italic" }}>
                  {t.about_filter_hint}
                </p>
                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                  className="btn-primary" onClick={() => scrollTo("bespoke-search")}>
                  {t.about_cta} <span style={{ fontSize: 14 }}>↓</span>
                </motion.button>
              </div>
            </div>

            {/* Timeline ornament */}
            <div style={{ paddingTop: 4 }}>
              {[
                { year: "2018",         sym: "✦" },
                { year: "2019 – 2024", sym: "◈" },
                { year: lang === "vi" ? "Hiện tại" : "Present", sym: "◉" },
              ].map(({ year, sym }, i, arr) => (
                <motion.div key={year} variants={MV.fadeUp}
                  style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: i < arr.length - 1 ? 32 : 0 }}>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 16, fontStyle: "italic", color: T.gold, marginBottom: 2 }}>{sym}</div>
                    <div style={{ width: 1, height: i < arr.length - 1 ? 48 : 0, background: T.goldLine, marginLeft: 7 }} />
                  </div>
                  <div style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 10, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: T.gold }}>{year}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// [1] BESPOKE SEARCH — Equity filter + Emotional Matrix + Life Stage
// ══════════════════════════════════════════════════════════════════════════
function BespokeSearch({ t, selectedEquity, setSelectedEquity, selectedNeed, setSelectedNeed, selectedLifeStage, setSelectedLifeStage, onScoreAdd }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Advisor leverage note
  const equityNote = selectedEquity ? buildEquityNote(selectedEquity, t) : null;

  const toggle = (setter, cur, val, scoreKey) => {
    if (cur !== val) onScoreAdd(SCORE_WEIGHTS[scoreKey] ?? 0);
    setter(cur === val ? null : val);
  };

  const needLabel   = selectedNeed      ? t[PILLARS.find(p => p.val === selectedNeed)?.titleKey]      : null;
  const stageLabel  = selectedLifeStage ? t[STAGES.find(s => s.val === selectedLifeStage)?.titleKey]  : null;
  const equityLabel = selectedEquity    ? EQUITY_RANGES.find(r => r.val === selectedEquity)?.[`label_${lang}`] : null;

  return (
    <section id="bespoke-search" style={{ background: T.fog, padding: "clamp(56px,8vw,96px) clamp(20px,6vw,80px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }} ref={ref}>
        <motion.div variants={MV.stagger} initial="hidden" animate={inView ? "visible" : "hidden"}>
          <motion.div variants={MV.fadeUp}><span className="lbl">{t.search_label}</span></motion.div>
          <motion.h2 variants={MV.fadeUp} className="f-display"
            style={{ fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 400, color: T.charcoal, marginBottom: 8, letterSpacing: "0.02em" }}>
            {t.search_title}
          </motion.h2>
          <motion.div variants={MV.fadeUp} style={{ width: 40, height: 1, background: T.gold, marginBottom: 52 }} />

          {/* Need — pillar cards */}
          <motion.div variants={MV.fadeUp}>
            <div className="pillar-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 44 }}>
              {PILLARS.map(({ val, titleKey, subKey }, idx) => {
                const sel = selectedNeed === val;
                return (
                  <motion.button key={val} className={`pillar-card${sel ? " selected" : ""}`}
                    whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                    onClick={() => toggle(setSelectedNeed, selectedNeed, val, "NEED_SELECTED")}
                    style={{ background: sel ? T.charcoal : "transparent" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 28, fontWeight: 300, fontStyle: "italic",
                      color: sel ? "rgba(248,245,239,0.18)" : "rgba(180,145,88,0.18)", lineHeight: 1, marginBottom: 14 }}>
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <div style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 14, fontWeight: 500, color: sel ? T.ivory : T.charcoal, marginBottom: 8, lineHeight: 1.35 }}>{t[titleKey]}</div>
                    <div style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 12, fontWeight: 300, fontStyle: "italic", color: sel ? "rgba(248,245,239,0.62)" : T.stone, lineHeight: 1.55 }}>{t[subKey]}</div>
                    {sel && <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
                      style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: T.gold, transformOrigin: "left" }} />}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Life stage chips */}
          <motion.div variants={MV.fadeUp} style={{ marginBottom: 44 }}>
            <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 11, fontWeight: 500, letterSpacing: "0.28em", textTransform: "uppercase", color: T.stone, marginBottom: 16 }}>
              {t.search_stage}
            </p>
            <div className="stage-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {STAGES.map(({ val, titleKey, subKey }) => {
                const sel = selectedLifeStage === val;
                return (
                  <motion.button key={val} className={`stage-chip${sel ? " selected" : ""}`}
                    whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
                    onClick={() => toggle(setSelectedLifeStage, selectedLifeStage, val, "STAGE_SELECTED")}>
                    <div style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 13, fontWeight: 500, color: T.charcoal, marginBottom: 5, lineHeight: 1.3 }}>{t[titleKey]}</div>
                    <div style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 11, fontWeight: 300, fontStyle: "italic", color: T.stone, lineHeight: 1.5 }}>{t[subKey]}</div>
                    {sel && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: T.gold }} />}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* [1] Equity chips — replacing old budget */}
          <motion.div variants={MV.fadeUp}>
            <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 11, fontWeight: 500, letterSpacing: "0.28em", textTransform: "uppercase", color: T.stone, marginBottom: 16 }}>
              {t.search_equity}
            </p>
            <div className="equity-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
              {EQUITY_RANGES.map(({ val }) => {
                const range = EQUITY_RANGES.find(r => r.val === val);
                const label = range[`label_${lang}`] ?? range.label_vi;
                const sel   = selectedEquity === val;
                return (
                  <motion.button key={val} className={`equity-chip${sel ? " selected" : ""}`}
                    whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                    onClick={() => toggle(setSelectedEquity, selectedEquity, val, "EQUITY_SELECTED")}>
                    <div style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 13, fontWeight: sel ? 500 : 400, color: sel ? T.charcoal : T.stone, lineHeight: 1.3 }}>
                      {label}
                    </div>
                    {sel && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: T.gold }} />}
                  </motion.button>
                );
              })}
            </div>

            {/* [1] Equity Advisor Note — leverage calculation */}
            <AnimatePresence>
              {equityNote && (
                <motion.div key="enote"
                  initial={{ opacity: 0, y: 8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto", transition: { duration: 0.4 } }}
                  exit={{ opacity: 0, height: 0 }}
                  className="equity-note">
                  <span style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 9, fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase", color: T.gold, display: "block", marginBottom: 8 }}>
                    Advisor Note
                  </span>
                  <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 13, fontWeight: 300, color: T.charcoal, lineHeight: 1.75, fontStyle: "italic" }}>
                    {equityNote}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Active summary tags */}
          <AnimatePresence>
            {(selectedEquity || selectedNeed || selectedLifeStage) && (
              <motion.div key="tags"
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                style={{ marginTop: 28, paddingTop: 24, borderTop: `1px solid ${T.goldLine}`, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 10, color: T.stone, letterSpacing: "0.14em" }}>{t.con_context}:</span>
                {needLabel   && <ActiveTag label={needLabel}   onRemove={() => setSelectedNeed(null)} />}
                {stageLabel  && <ActiveTag label={stageLabel}  onRemove={() => setSelectedLifeStage(null)} />}
                {equityLabel && <ActiveTag label={equityLabel} onRemove={() => setSelectedEquity(null)} />}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function ActiveTag({ label, onRemove }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: T.cream, padding: "6px 14px", fontSize: 12, color: T.charcoal, fontFamily: "'Be Vietnam Pro'" }}>
      {label}
      <button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: T.stone, fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
    </span>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// [4] KNOWLEDGE LOCK — Payment Strategy + 5-year blur
// isKnowledgeUnlocked lifts blur on CTA click (optimistic reward)
// Score +25 when section enters viewport
// ══════════════════════════════════════════════════════════════════════════
function KnowledgeLock({ t, selectedNeed, selectedEquity, selectedLifeStage, isKnowledgeUnlocked, onUnlock, onScoreAdd }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const hasScored = useRef(false);

  // Score +25 on first view
  useEffect(() => {
    if (inView && !hasScored.current) {
      hasScored.current = true;
      onScoreAdd(SCORE_WEIGHTS.KNOWLEDGE_LOCK_VIEWED); // +25
    }
  }, [inView, onScoreAdd]);

  const isFiltered = !!(selectedNeed || selectedEquity || selectedLifeStage);

  // Top matching projects
  const teaserProjects = projects
    .filter(p => {
      if (selectedNeed) {
        if (p.category !== selectedNeed) return false;
      }
      if (selectedEquity) {
        const range = EQUITY_RANGES.find(r => r.val === selectedEquity);
        if (range && !range.affordablePriceRanges.includes(p.priceRange)) return false;
      }
      return true;
    })
    .slice(0, 3);

  const strategy = getPaymentStrategy(selectedNeed, selectedLifeStage, t);

  // Placeholder 5-year scenario rows (blurred until unlocked)
  const fiveYrRows = [1, 3, 5].map(yr => ({
    year: yr,
    value: "— — —",
    cashflow: "— — —",
  }));

  const handleCTA = () => {
    onUnlock(); // lift blur
    scrollTo("concierge");
  };

  return (
    <section id="knowledge-lock" style={{ background: T.navy, padding: "clamp(64px,8vw,96px) clamp(20px,6vw,80px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }} ref={ref}>
        <motion.div variants={MV.stagger} initial="hidden" animate={inView ? "visible" : "hidden"}>
          <motion.div variants={MV.fadeUp}><span className="lbl" style={{ color: T.gold }}>{t.knowledge_label}</span></motion.div>

          {isFiltered ? (
            <>
              <motion.h2 variants={MV.fadeUp} className="f-display"
                style={{ fontSize: "clamp(24px,3.5vw,44px)", fontWeight: 400, color: T.ivory, marginBottom: 8, letterSpacing: "0.02em" }}>
                {t.knowledge_title}
              </motion.h2>
              <motion.div variants={MV.fadeUp} style={{ width: 40, height: 1, background: T.gold, marginBottom: 52 }} />

              <motion.div variants={MV.fadeUp} className="kl-grid"
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(36px,4vw,56px)", marginBottom: 52 }}>

                {/* Left — teaser projects */}
                <div>
                  <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 10, fontWeight: 500, letterSpacing: "0.28em", textTransform: "uppercase", color: T.gold, marginBottom: 20 }}>
                    {t.knowledge_teaser_heading}
                  </p>
                  <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 12, fontWeight: 300, fontStyle: "italic", color: "rgba(197,191,181,0.65)", lineHeight: 1.65, marginBottom: 28 }}>
                    {t.knowledge_teaser_sub}
                  </p>
                  {teaserProjects.length > 0 ? teaserProjects.map((p, i) => (
                    <motion.div key={p.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0, transition: { duration: 0.5, delay: i * 0.1 } }}
                      style={{ display: "flex", gap: 16, alignItems: "flex-start", paddingBottom: 18, marginBottom: 18, borderBottom: "1px solid rgba(197,191,181,0.08)" }}>
                      <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 13, fontStyle: "italic", color: T.gold, flexShrink: 0, minWidth: 20 }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Playfair Display'", fontSize: 16, fontWeight: 400, color: T.ivory, marginBottom: 4 }}>{p.name}</div>
                        <div style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 12, fontWeight: 300, color: "rgba(197,191,181,0.62)", lineHeight: 1.55 }}>
                          {p.teasers[lang]}
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 13, fontStyle: "italic", color: "rgba(197,191,181,0.5)" }}>{t.col_none}</p>
                  )}
                </div>

                {/* Right — payment strategy */}
                <div>
                  <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 10, fontWeight: 500, letterSpacing: "0.28em", textTransform: "uppercase", color: T.gold, marginBottom: 14 }}>
                    {t.knowledge_payment_section_label}
                  </p>
                  <h3 className="f-display"
                    style={{ fontSize: "clamp(17px,2vw,22px)", fontWeight: 400, color: T.ivory, lineHeight: 1.3, marginBottom: 20 }}>
                    {strategy.title}
                  </h3>
                  <AnimatePresence mode="wait">
                    <motion.div key={`${selectedNeed}-${selectedLifeStage}`}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.45 } }}
                      exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }}>
                      <div style={{ paddingBottom: 18, marginBottom: 18, borderBottom: "1px solid rgba(197,191,181,0.1)" }}>
                        <span style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 9, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: T.stone, display: "block", marginBottom: 10 }}>
                          {t.knowledge_payment_strategy_label}
                        </span>
                        <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 13, fontWeight: 300, color: "rgba(197,191,181,0.82)", lineHeight: 1.82 }}>
                          {strategy.body}
                        </p>
                      </div>
                      <div>
                        <span style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 9, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: T.stone, display: "block", marginBottom: 10 }}>
                          {t.knowledge_payment_reverse_label}
                        </span>
                        <p className="f-accent"
                          style={{ fontSize: "clamp(14px,1.6vw,17px)", fontStyle: "italic", fontWeight: 300, color: T.cream, lineHeight: 1.7 }}>
                          {strategy.miss}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* [4] 5-Year scenario — BLURRED until isKnowledgeUnlocked */}
              <motion.div variants={MV.fadeUp} style={{ marginBottom: 48 }}>
                <div style={{ position: "relative", border: `1px solid rgba(197,191,181,0.1)`, padding: "clamp(20px,2.5vw,32px)" }}>
                  <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 10, fontWeight: 500, letterSpacing: "0.28em", textTransform: "uppercase", color: T.gold, marginBottom: 20 }}>
                    {t.knowledge_5yr_lock_label}
                  </p>

                  {/* Table skeleton */}
                  <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr", gap: "0 20px" }}>
                    {[t.knowledge_5yr_year_label, t.knowledge_5yr_value_label, t.knowledge_5yr_cashflow_label].map((h, i) => (
                      <div key={i} style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 9, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: T.stone, paddingBottom: 12, borderBottom: `1px solid rgba(197,191,181,0.15)`, marginBottom: 10 }}>
                        {h}
                      </div>
                    ))}
                    {fiveYrRows.map(row => (
                      <>
                        <div key={`y${row.year}`} style={{ fontFamily: "'Cormorant Garamond'", fontSize: 16, fontStyle: "italic", color: T.gold, padding: "8px 0" }}>{row.year}</div>
                        <div key={`v${row.year}`} style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 13, color: "rgba(197,191,181,0.38)", padding: "8px 0" }}>
                          {isKnowledgeUnlocked ? t.knowledge_5yr_placeholder : "— — —"}
                        </div>
                        <div key={`c${row.year}`} style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 13, color: "rgba(197,191,181,0.38)", padding: "8px 0" }}>
                          {isKnowledgeUnlocked ? t.knowledge_5yr_placeholder : "— — —"}
                        </div>
                      </>
                    ))}
                  </div>

                  {/* Blur overlay — removed when isKnowledgeUnlocked */}
                  <AnimatePresence>
                    {!isKnowledgeUnlocked && (
                      <motion.div key="blur-overlay"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.55, ease: "easeOut" } }}
                        className="kl-blur-overlay">
                        <div style={{ width: 32, height: 1, background: T.goldLine }} />
                        <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 12, fontWeight: 300, fontStyle: "italic", color: T.mist, maxWidth: 260, lineHeight: 1.65 }}>
                          {t.knowledge_5yr_lock_hint}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Unlock confirmation */}
                <AnimatePresence>
                  {isKnowledgeUnlocked && (
                    <motion.div key="unlocked"
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: T.gold, fontSize: 12 }}>✓</span>
                      <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 11, fontWeight: 300, fontStyle: "italic", color: T.stone }}>
                        {t.knowledge_5yr_unlock_hint}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* CTA */}
              <motion.div variants={MV.fadeUp}
                style={{ borderTop: "1px solid rgba(197,191,181,0.1)", paddingTop: 36, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
                <motion.button className="btn-primary" whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} onClick={handleCTA}>
                  {t.knowledge_cta} →
                </motion.button>
                <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 12, fontWeight: 300, fontStyle: "italic", color: "rgba(197,191,181,0.55)", maxWidth: 480, lineHeight: 1.75 }}>
                  {t.knowledge_cta_sub}
                </p>
              </motion.div>
            </>
          ) : (
            <motion.div variants={MV.fadeUp} style={{ textAlign: "center", padding: "clamp(32px,5vw,56px) 0" }}>
              <div style={{ width: 40, height: 1, background: T.goldLine, margin: "0 auto 28px" }} />
              <p className="f-accent" style={{ fontSize: "clamp(18px,2.5vw,24px)", fontStyle: "italic", fontWeight: 300, color: T.cream, marginBottom: 12, lineHeight: 1.55 }}>
                {t.knowledge_no_filter}
              </p>
              <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 13, fontWeight: 300, color: "rgba(197,191,181,0.5)" }}>
                {t.knowledge_no_filter_sub}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// [SOFT REVEAL] COLLECTIONS — equity-based matching
// Match = gold border + glow + badge; No match = opacity 0.3 + grayscale
// ══════════════════════════════════════════════════════════════════════════
function Collections({ t, selectedEquity, selectedNeed, onReset, setCurrentProjectViewing, mostInterestedRef, accumulatedMsRef, viewedProjectsRef }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const isFiltered = !!(selectedEquity || selectedNeed);

  const equityRange = selectedEquity ? EQUITY_RANGES.find(r => r.val === selectedEquity) : null;

  return (
    <section id="collections" className="section" style={{ background: T.ivory }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }} ref={ref}>
        <motion.div variants={MV.stagger} initial="hidden" animate={inView ? "visible" : "hidden"}>
          <motion.div variants={MV.fadeUp}><span className="lbl">{t.col_label}</span></motion.div>
          <motion.h2 variants={MV.fadeUp} className="f-display"
            style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 400, color: T.charcoal, marginBottom: 8, letterSpacing: "0.02em" }}>
            {t.col_title}
          </motion.h2>
          <motion.p variants={MV.fadeUp} className="f-accent"
            style={{ fontSize: "clamp(15px,1.8vw,19px)", fontStyle: "italic", fontWeight: 300, color: T.stone, marginBottom: 16, maxWidth: 560, lineHeight: 1.65 }}>
            {t.col_sub}
          </motion.p>
          <motion.div variants={MV.fadeUp} style={{ width: 40, height: 1, background: T.gold, marginBottom: 52 }} />
        </motion.div>

        <motion.div layout style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(320px,100%),1fr))", gap: 24 }}>
          {projects.map((project, i) => {
            const needMatch   = !selectedNeed   || project.category === selectedNeed;
            const equityMatch = !equityRange     || equityRange.affordablePriceRanges.includes(project.priceRange);
            const isMatch     = !isFiltered     || (needMatch && equityMatch);
            return (
              <ProjectCard key={project.id} project={project} index={i} t={t}
                isMatch={isMatch} isFiltered={isFiltered}
                setCurrentProjectViewing={setCurrentProjectViewing}
                mostInterestedRef={mostInterestedRef}
                accumulatedMsRef={accumulatedMsRef}
                viewedProjectsRef={viewedProjectsRef}
              />
            );
          })}
        </motion.div>

        <AnimatePresence>
          {isFiltered && projects.every(p => {
            const nm = !selectedNeed   || p.category === selectedNeed;
            const em = !equityRange    || equityRange.affordablePriceRanges.includes(p.priceRange);
            return !(nm && em);
          }) && (
            <motion.div key="empty" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ textAlign: "center", marginTop: 40 }}>
              <p className="f-accent" style={{ fontSize: 18, fontStyle: "italic", color: T.stone, marginBottom: 20 }}>{t.col_none}</p>
              <button className="btn-ghost" onClick={onReset}>{t.col_reset}</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// [SOFT REVEAL] Project card with hover tracking
function ProjectCard({ project, index, t, isMatch, isFiltered, setCurrentProjectViewing, mostInterestedRef, accumulatedMsRef, viewedProjectsRef }) {
  const [hovered, setHovered] = useState(false);
  const hoverStart = useRef(null);
  const dimmed     = isFiltered && !isMatch;

  const shortLabel  = project[`shortLabel_${lang}`]  ?? project.shortLabel_vi;
  const description = project[`description_${lang}`] ?? project.description_vi;
  const needLabels  = { an_cu: t.pillar_1_title, dau_tu: t.pillar_2_title, toa_do_du_phong: t.pillar_3_title };
  const priceLabel  = { "5-10": "5–10 tỷ", "10-20": "10–20 tỷ", "20+": ">20 tỷ" };

  const onEnter = () => {
    setHovered(true);
    if (!dimmed) {
      hoverStart.current = performance.now();
      setCurrentProjectViewing({ id: project.id, name: project.name });
      // Track unique viewed projects
      if (viewedProjectsRef) {
        viewedProjectsRef.current.add(project.id);
      }
    }
  };

  const onLeave = () => {
    setHovered(false);
    if (!dimmed && hoverStart.current !== null) {
      const dur = performance.now() - hoverStart.current;
      hoverStart.current = null;
      if (accumulatedMsRef) accumulatedMsRef.current += dur;
      if (!mostInterestedRef.current || dur > mostInterestedRef.current.duration) {
        mostInterestedRef.current = { id: project.id, name: project.name, duration: dur };
      }
    }
  };

  return (
    <motion.article layout
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{
        opacity: dimmed ? 0.30 : 1,
        filter:  dimmed ? "saturate(0.0) brightness(0.88)" : "saturate(1) brightness(1)",
        y:       isFiltered && isMatch && !hovered ? -2 : 0,
        scale:   isFiltered && isMatch ? 1.01 : 1,
        transition: { duration: 0.45, ease: [0.22, 0.61, 0.36, 1], delay: index * 0.06 },
      }}
      onHoverStart={onEnter} onHoverEnd={onLeave}
      style={{
        background: T.ivory,
        border: `1px solid ${isFiltered && isMatch ? T.gold : hovered && !dimmed ? T.goldDim : T.cream}`,
        boxShadow: isFiltered && isMatch ? `0 0 0 1px ${T.goldLine}, 0 8px 40px rgba(180,145,88,0.16)` : "none",
        overflow: "hidden", cursor: dimmed ? "default" : "pointer",
        transition: "border-color 0.35s, box-shadow 0.35s", position: "relative",
      }}>

      {/* Match badge */}
      <AnimatePresence>
        {isFiltered && isMatch && (
          <motion.div key="badge" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}>
            <span className="heritage-badge">✦ {t.match_badge}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portrait image */}
      <div style={{ position: "relative", paddingTop: "133%", overflow: "hidden" }}>
        <motion.img src={project.image} alt={project.name}
          animate={{ scale: hovered && !dimmed ? 1.04 : 1 }} transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(13,27,42,0.55) 0%,transparent 50%)" }} />
        <div style={{ position: "absolute", top: 16, left: 16 }}>
          <span style={{ background: "rgba(13,27,42,0.72)", color: T.cream, fontFamily: "'Be Vietnam Pro'", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", padding: "5px 10px" }}>
            {priceLabel[project.priceRange]}
          </span>
        </div>
        <div style={{ position: "absolute", bottom: 16, left: 16 }}>
          <span style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 10, color: T.cream, letterSpacing: "0.14em", opacity: 0.85 }}>
            📍 {project.location}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "24px 24px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <h3 className="f-display" style={{ fontSize: 20, fontWeight: 500, color: T.charcoal, letterSpacing: "0.02em", lineHeight: 1.25 }}>
            {project.name}
          </h3>
          <span style={{ background: T.cream, color: T.stone, fontFamily: "'Be Vietnam Pro'", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", padding: "4px 10px", whiteSpace: "nowrap", marginLeft: 10, flexShrink: 0 }}>
            {needLabels[project.category]}
          </span>
        </div>
        <p className="f-accent" style={{ fontSize: 14, fontStyle: "italic", fontWeight: 300, color: T.gold, marginBottom: 12 }}>{shortLabel}</p>
        <div style={{ width: 28, height: 1, background: T.goldLine, marginBottom: 14 }} />
        <p style={{ fontSize: 13, color: T.stone, lineHeight: 1.75, fontFamily: "'Be Vietnam Pro'" }}>{description}</p>
        <AnimatePresence>
          {hovered && !dimmed && (
            <motion.div key="cta" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
              style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 10, fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase", color: T.gold }}>{t.col_learn}</span>
              <span style={{ color: T.gold, fontSize: 13 }}>→</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ADVISOR BOX
// ══════════════════════════════════════════════════════════════════════════
function AdvisorBox({ t, selectedEquity, selectedNeed }) {
  // Map equity to approximate budget range for advisor messages
  const equityToBudget = { "3-5": "5-10", "5-10": "10-20", "10-20": "20+", "20+": "20+" };
  const budget = selectedEquity ? equityToBudget[selectedEquity] : null;
  const { why_fit, why_not } = getAdvisorMessages(selectedNeed, budget, t);

  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section style={{ background: T.ivory, padding: "0 clamp(20px,6vw,80px) clamp(56px,7vw,80px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }} ref={ref}>
        <motion.div initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0, transition: { duration: 0.65, ease: "easeOut" } } : {}}
          className="advisor-box">
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 9, fontWeight: 500, letterSpacing: "0.38em", textTransform: "uppercase", color: T.gold }}>
              {t.advisor_label}
            </span>
            <div style={{ width: 28, height: 1, background: T.goldLine, marginTop: 10 }} />
          </div>
          <div>
            <span style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 9, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: T.stone, display: "block", marginBottom: 10 }}>
              {t.advisor_why_fit}
            </span>
            <AnimatePresence mode="wait">
              <motion.p key={`fit-${selectedNeed}-${selectedEquity}`}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
                exit={{ opacity: 0, y: -6, transition: { duration: 0.22 } }}
                className="f-accent"
                style={{ fontSize: "clamp(15px,1.8vw,19px)", fontStyle: "italic", fontWeight: 300, color: T.charcoal, lineHeight: 1.72 }}>
                {why_fit}
              </motion.p>
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {why_not && (
              <motion.div key={`not-${selectedNeed}-${selectedEquity}`}
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto", transition: { duration: 0.45 } }}
                exit={{ opacity: 0, height: 0 }}
                style={{ borderTop: `1px solid ${T.goldLine}`, marginTop: 18, paddingTop: 18 }}>
                <span style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 9, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: T.stone, display: "block", marginBottom: 10 }}>
                  {t.advisor_why_not}
                </span>
                <p className="f-accent" style={{ fontSize: "clamp(14px,1.6vw,17px)", fontStyle: "italic", fontWeight: 300, color: T.stone, lineHeight: 1.72 }}>
                  {why_not}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// HABITUS JOURNAL — score +10 on view, Habitus + Legacy glossary tooltips
// ══════════════════════════════════════════════════════════════════════════
function HabitusJournal({ t, onGlossaryOpen, onScoreAdd }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const hasScored = useRef(false);

  useEffect(() => {
    if (inView && !hasScored.current) {
      hasScored.current = true;
      onScoreAdd(SCORE_WEIGHTS.JOURNAL_VIEWED); // +10
    }
  }, [inView, onScoreAdd]);

  return (
    <section id="journal" className="section" style={{ background: T.navy }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }} ref={ref}>
        <motion.div variants={MV.stagger} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ marginBottom: 52 }}>
          <motion.div variants={MV.fadeUp}>
            <span style={{ display: "inline-block", fontFamily: "'Be Vietnam Pro'", fontSize: 10, fontWeight: 500, letterSpacing: "0.46em", textTransform: "uppercase", color: T.gold, marginBottom: 20 }}>
              {t.jour_label}
            </span>
          </motion.div>
          <motion.div variants={MV.fadeUp}>
            <h2 className="f-display"
              style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 400, color: T.ivory, marginBottom: 4, letterSpacing: "0.02em" }}>
              <GlossaryTooltip termKey="habitus" t={t} onOpen={onGlossaryOpen}>Habitus</GlossaryTooltip> Journal
            </h2>
            <span className="habitus-gloss" style={{ marginBottom: 14 }}>
              Habitus — {t.jour_habitus_gloss}
            </span>
          </motion.div>
          <motion.div variants={MV.fadeUp} style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
            <p className="f-accent" style={{ fontSize: "clamp(15px,1.8vw,19px)", fontStyle: "italic", fontWeight: 300, color: T.cream, maxWidth: 480, lineHeight: 1.65 }}>
              {t.jour_sub}
            </p>
            <span style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 11, fontWeight: 300, fontStyle: "italic", color: T.stone, whiteSpace: "nowrap" }}>
              <GlossaryTooltip termKey="legacy" t={t} onOpen={onGlossaryOpen}>Legacy</GlossaryTooltip> — {t.jour_legacy_gloss}
            </span>
          </motion.div>
          <motion.div variants={MV.fadeUp} style={{ width: 40, height: 1, background: T.gold }} />
        </motion.div>

        <motion.div variants={MV.stagger} initial="hidden" animate={inView ? "visible" : "hidden"}
          style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: 2 }} className="journal-grid">
          <motion.div variants={MV.scaleIn} style={{ gridColumn: "span 7" }} className="journal-featured">
            <JFeatured article={journal[0]} t={t} />
          </motion.div>
          <div style={{ gridColumn: "span 5", display: "flex", flexDirection: "column", gap: 2 }} className="journal-secondary">
            {journal.slice(1, 3).map(a => (
              <motion.div key={a.id} variants={MV.fadeUp} style={{ flex: 1 }}>
                <JSecondary article={a} t={t} />
              </motion.div>
            ))}
          </div>
          {journal.slice(3).map(a => (
            <motion.div key={a.id} variants={MV.fadeUp} style={{ gridColumn: "span 4" }} className="journal-small">
              <JSmall article={a} t={t} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function JTags({ tags }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
      {tags.slice(0, 3).map(tag => (
        <span key={tag} style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(180,145,88,0.6)", padding: "2px 8px", border: "1px solid rgba(180,145,88,0.2)" }}>
          {tag}
        </span>
      ))}
    </div>
  );
}

function JFeatured({ article, t }) {
  const [hov, setHov] = useState(false);
  const title   = article[`title_${lang}`]    ?? article.title_vi;
  const excerpt = article[`excerpt_${lang}`]  ?? article.excerpt_vi;
  const cat     = article[`category_${lang}`] ?? article.category_vi;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position: "relative", height: "100%", minHeight: 420, overflow: "hidden", cursor: "pointer" }}>
      <motion.img src={article.image} alt={title}
        animate={{ scale: hov ? 1.04 : 1 }} transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(13,27,42,0.94) 0%,rgba(13,27,42,0.18) 60%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "clamp(20px,3vw,36px)" }}>
        <span style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: T.gold, display: "block", marginBottom: 12 }}>{cat}</span>
        <h3 className="f-display" style={{ fontSize: "clamp(18px,2.5vw,26px)", fontWeight: 400, color: T.ivory, lineHeight: 1.3, marginBottom: 12 }}>{title}</h3>
        <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 13, color: "rgba(197,191,181,0.78)", lineHeight: 1.7, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{excerpt}</p>
        <JTags tags={article.tags} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
          <span style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 10, color: "rgba(197,191,181,0.45)", letterSpacing: "0.1em" }}>{article.date}</span>
          <motion.span animate={{ x: hov ? 4 : 0 }}
            style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: T.gold }}>
            {t.jour_read} →
          </motion.span>
        </div>
      </div>
    </div>
  );
}

function JSecondary({ article, t }) {
  const [hov, setHov] = useState(false);
  const title = article[`title_${lang}`]    ?? article.title_vi;
  const cat   = article[`category_${lang}`] ?? article.category_vi;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", height: "100%", cursor: "pointer", background: T.navyMid, overflow: "hidden" }}>
      <div style={{ position: "relative", width: "40%", flexShrink: 0, overflow: "hidden" }}>
        <motion.img src={article.image} alt={title}
          animate={{ scale: hov ? 1.05 : 1 }} transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ padding: "20px 20px 20px 22px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: T.gold, marginBottom: 10, display: "block" }}>{cat}</span>
        <h4 className="f-display" style={{ fontSize: "clamp(14px,1.6vw,16px)", fontWeight: 400, color: T.ivory, lineHeight: 1.4, marginBottom: 8 }}>{title}</h4>
        <JTags tags={article.tags} />
        <span style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 10, color: "rgba(197,191,181,0.38)", marginTop: 8 }}>{article.date}</span>
      </div>
    </div>
  );
}

function JSmall({ article, t }) {
  const title   = article[`title_${lang}`]    ?? article.title_vi;
  const excerpt = article[`excerpt_${lang}`]  ?? article.excerpt_vi;
  const cat     = article[`category_${lang}`] ?? article.category_vi;
  return (
    <div style={{ cursor: "pointer", padding: "clamp(18px,2vw,28px)", borderTop: "1px solid rgba(197,191,181,0.08)" }}>
      <span style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: T.gold, display: "block", marginBottom: 10 }}>{cat}</span>
      <h4 className="f-display" style={{ fontSize: 15, fontWeight: 400, color: T.ivory, lineHeight: 1.45, marginBottom: 8 }}>{title}</h4>
      <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 12, color: "rgba(197,191,181,0.55)", lineHeight: 1.65, marginBottom: 10 }}>{excerpt}</p>
      <JTags tags={article.tags} />
      <span style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 10, color: "rgba(197,191,181,0.3)", display: "block", marginTop: 10 }}>{article.date}</span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// CONCIERGE FORM — v5 payload
// [6] { selected_equity, depth_score, interest_tag, viewed_projects_count,
//       session_duration, session_id, psychological_tag (strict 3), ... }
// Score +50 on submit
// ══════════════════════════════════════════════════════════════════════════
function ConciergeForm({ t, activeLang, selectedEquity, selectedNeed, selectedLifeStage, currentProjectViewing, mostInterestedRef, accumulatedMsRef, viewedProjectsRef, unlockIntent, glossaryOpens, sessionId, sessionStart, isKnowledgeUnlocked, onScoreAdd }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const [form, setForm]     = useState({ name: "", phone: "", email: "", message: "", preferredCallTime: "", company: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [depthErr, setDepthErr] = useState(false);

  const equityLabel  = selectedEquity    ? EQUITY_RANGES.find(r => r.val === selectedEquity)?.[`label_${lang}`] : null;
  const needLabels   = { an_cu: t.pillar_1_title, dau_tu: t.pillar_2_title, toa_do_du_phong: t.pillar_3_title };
  const stageLabels  = { children_growing: t.stage_1_title, children_grown: t.stage_2_title, enjoying_privacy: t.stage_3_title };
  const hasContext   = !!(selectedEquity || selectedNeed || selectedLifeStage || currentProjectViewing);

  const validate = () => {
    const e = {};
    if (!form.name.trim())       e.name              = true;
    if (!form.phone.trim())      e.phone             = "required";
    else if (!VN_PHONE_RE.test(form.phone.trim())) e.phone = "invalid";
    if (!form.preferredCallTime) e.preferredCallTime = true;
    return e;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (form.company.trim()) { setStatus("success"); return; } // Honeypot

    const accMs = accumulatedMsRef?.current ?? 0;
    if (!hasEnoughEngagement({ selectedNeed, selectedEquity, selectedLifeStage, accumulatedMs: accMs })) {
      setDepthErr(true);
      return;
    }
    setDepthErr(false);
    setErrors({});
    setStatus("sending");

    const resolvedProject = mostInterestedRef?.current?.name ?? currentProjectViewing?.name ?? null;
    const psychTag        = computePsychologicalTag(selectedNeed, selectedLifeStage); // strict 3 values
    const interestType    = computeInterestType(selectedNeed, selectedLifeStage);
    const sessionDuration = Math.round((Date.now() - sessionStart) / 1000); // seconds
    const viewedCount     = viewedProjectsRef?.current?.size ?? 0;
    const depthScore      = [selectedNeed, selectedEquity, selectedLifeStage].filter(Boolean).length;

    // ← n8n Webhook: CONCIERGE_ENDPOINT
    // Full v5 payload — Telegram report fields included for n8n routing
    const payload = {
      // Core
      name:                    form.name.trim(),
      phone:                   form.phone.trim(),
      email:                   form.email.trim()   || undefined,
      message:                 form.message.trim() || undefined,
      preferred_call_time:     form.preferredCallTime,
      // [6] v5 tracking fields
      selected_equity:         selectedEquity    ?? null,
      need_selected:           selectedNeed      ?? null,
      life_stage_selected:     selectedLifeStage ?? null,
      current_project_viewing: resolvedProject,
      depth_score:             depthScore,
      interest_tag:            interestType,        // for n8n Telegram routing
      psychological_tag:       psychTag,            // strict: Safety_Security | Legacy_Transfer | Discreet_Luxury | null
      viewed_projects_count:   viewedCount,
      session_duration:        sessionDuration,
      session_id:              sessionId,
      // Context
      unlock_intent:           unlockIntent ?? null,
      knowledge_unlocked:      isKnowledgeUnlocked,
      glossary_opens:          glossaryOpens,
      quote_selected_id:       null,               // always null per spec
      phone_valid:             true,
      submitted_at:            new Date().toISOString(),
      source:                  "heritage_path_v5",
      lang:                    activeLang,
    };

    try {
      await fetch(CONCIERGE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus("success");
      onScoreAdd(SCORE_WEIGHTS.FORM_SUBMIT); // +50
      setForm({ name: "", phone: "", email: "", message: "", preferredCallTime: "", company: "" });
    } catch {
      setStatus("error");
    }
  };

  const timeOpts = [
    { val: "morning",   label: t.con_morning },
    { val: "afternoon", label: t.con_afternoon },
    { val: "evening",   label: t.con_evening },
  ];

  return (
    <section id="concierge" style={{ background: T.ivory, padding: "clamp(72px,10vw,120px) clamp(20px,6vw,80px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(48px,6vw,96px)", alignItems: "start" }} ref={ref}>

        {/* Left — copy */}
        <motion.div variants={MV.stagger} initial="hidden" animate={inView ? "visible" : "hidden"}>
          <motion.div variants={MV.fadeUp}><span className="lbl">{t.con_label}</span></motion.div>
          <motion.h2 variants={MV.fadeUp} className="f-display"
            style={{ fontSize: "clamp(28px,3.8vw,48px)", fontWeight: 400, color: T.charcoal, lineHeight: 1.2, marginBottom: 24, letterSpacing: "0.02em" }}>
            {t.con_title}
          </motion.h2>
          <motion.div variants={MV.fadeUp} style={{ width: 40, height: 1, background: T.gold, marginBottom: 24 }} />
          <motion.p variants={MV.fadeUp} className="f-accent"
            style={{ fontSize: "clamp(15px,1.8vw,19px)", fontStyle: "italic", fontWeight: 300, color: T.stone, lineHeight: 1.75, marginBottom: 36 }}>
            {t.con_sub}
          </motion.p>

          {/* Context recap */}
          {hasContext && (
            <motion.div variants={MV.fadeUp} style={{ marginBottom: 36 }}>
              <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: T.stone, marginBottom: 12 }}>
                {t.con_context}
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {equityLabel         && <CtxTag label={equityLabel} />}
                {selectedNeed        && <CtxTag label={needLabels[selectedNeed]} />}
                {selectedLifeStage   && <CtxTag label={stageLabels[selectedLifeStage]} />}
                {currentProjectViewing && <CtxTag label={`${t.con_project}: ${currentProjectViewing.name}`} muted />}
              </div>
            </motion.div>
          )}

          <motion.div variants={MV.fadeUp} style={{ marginTop: "auto" }}>
            <div style={{ width: 48, height: 1, background: T.goldLine, marginBottom: 24 }} />
            <p className="f-accent"
              style={{ fontSize: 16, fontStyle: "italic", fontWeight: 300, color: T.mist, lineHeight: 1.7, whiteSpace: "pre-line" }}>
              "{t.con_quote}"
            </p>
          </motion.div>
        </motion.div>

        {/* Right — form */}
        <motion.div variants={MV.stagger} initial="hidden" animate={inView ? "visible" : "hidden"}>
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div key="cs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="success-panel">
                <motion.div initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, transition: { delay: 0.1, type: "spring", stiffness: 220, damping: 20 } }}
                  style={{ width: 56, height: 56, border: `1px solid ${T.gold}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", fontSize: 22, color: T.gold }}>
                  ✓
                </motion.div>
                <h3 className="f-display" style={{ fontSize: 26, fontWeight: 400, color: T.charcoal, marginBottom: 14 }}>{t.con_success_h}</h3>
                <p className="f-accent" style={{ fontSize: 16, fontStyle: "italic", fontWeight: 300, color: T.stone, lineHeight: 1.7 }}>{t.con_success_b}</p>
              </motion.div>
            ) : (
              <motion.form key="cf" onSubmit={onSubmit} noValidate>
                {/* Honeypot */}
                <div style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} aria-hidden="true">
                  <input tabIndex={-1} autoComplete="off" value={form.company}
                    onChange={e => setForm(v => ({ ...v, company: e.target.value }))} />
                </div>

                {/* Name */}
                <motion.div variants={MV.fadeUp} style={{ marginBottom: 28 }}>
                  <input className={`inp${errors.name ? " has-error" : ""}`} value={form.name}
                    onChange={e => setForm(v => ({ ...v, name: e.target.value }))} placeholder={t.con_name} />
                </motion.div>

                {/* Phone */}
                <motion.div variants={MV.fadeUp} style={{ marginBottom: errors.phone ? 6 : 28 }}>
                  <input type="tel" className={`inp${errors.phone ? " has-error" : ""}`} value={form.phone}
                    onChange={e => { setForm(v => ({ ...v, phone: e.target.value })); if (errors.phone) setErrors(er => ({ ...er, phone: null })); }}
                    placeholder={t.con_phone} />
                  <AnimatePresence>
                    {errors.phone === "invalid" && (
                      <motion.p key="pe" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 11, fontWeight: 300, fontStyle: "italic", color: "#b04040", marginTop: 6, marginBottom: 18 }}>
                        {t.errors_phone_invalid}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Email */}
                <motion.div variants={MV.fadeUp} style={{ marginBottom: 28 }}>
                  <input type="email" className="inp" value={form.email}
                    onChange={e => setForm(v => ({ ...v, email: e.target.value }))} placeholder={t.con_email} />
                </motion.div>

                {/* Message */}
                <motion.div variants={MV.fadeUp} style={{ marginBottom: 36 }}>
                  <textarea rows={3} className="inp" value={form.message}
                    onChange={e => setForm(v => ({ ...v, message: e.target.value }))} placeholder={t.con_message} />
                </motion.div>

                {/* Time */}
                <motion.div variants={MV.fadeUp} style={{ marginBottom: 44 }}>
                  <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: errors.preferredCallTime ? "#b04040" : T.stone, marginBottom: 16 }}>
                    {t.con_time}
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {timeOpts.map(({ val, label }) => {
                      const active = form.preferredCallTime === val;
                      return (
                        <motion.button key={val} type="button" whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                          onClick={() => setForm(v => ({ ...v, preferredCallTime: val }))}
                          style={{ background: active ? T.charcoal : "transparent",
                            border: `1px solid ${active ? T.charcoal : errors.preferredCallTime ? "#b04040" : T.mist}`,
                            color: active ? T.ivory : T.stone, cursor: "pointer", padding: "12px 22px",
                            fontFamily: "'Be Vietnam Pro'", fontSize: 13, fontWeight: 500, transition: "all 0.3s" }}>
                          {label}
                        </motion.button>
                      );
                    })}
                  </div>
                  {errors.preferredCallTime && (
                    <p style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 11, color: "#b04040", marginTop: 8, fontStyle: "italic" }}>
                      {t.errors_time_required}
                    </p>
                  )}
                </motion.div>

                {/* Depth error */}
                <AnimatePresence>
                  {depthErr && (
                    <motion.p key="depth" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 12, fontWeight: 300, fontStyle: "italic", color: T.stone, marginBottom: 16, padding: "12px 16px", background: T.fog, borderLeft: `2px solid ${T.gold}` }}>
                      {t.errors_not_enough_depth}
                    </motion.p>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {status === "error" && (
                    <motion.p key="err" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 12, fontWeight: 300, fontStyle: "italic", color: "#b04040", marginBottom: 16 }}>
                      {t.errors_generic}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.div variants={MV.fadeUp}>
                  <motion.button type="submit" className="btn-primary"
                    whileHover={status !== "sending" ? { y: -1 } : {}}
                    whileTap={status !== "sending" ? { scale: 0.98 } : {}}
                    disabled={status === "sending"}
                    style={{ width: "100%", justifyContent: "center" }}>
                    {status === "sending" ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                          style={{ display: "inline-block", width: 14, height: 14, border: `1px solid rgba(248,245,239,0.4)`, borderTopColor: T.ivory, borderRadius: "50%" }} />
                        {t.con_sending}
                      </span>
                    ) : t.con_submit}
                  </motion.button>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function CtxTag({ label, muted = false }) {
  return (
    <span style={{ background: muted ? "transparent" : T.cream, border: muted ? `1px solid ${T.mist}` : "none", color: muted ? T.stone : T.charcoal, fontFamily: "'Be Vietnam Pro'", fontSize: 12, padding: "6px 14px" }}>
      {label}
    </span>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// FOOTER
// ══════════════════════════════════════════════════════════════════════════
function Footer({ t }) {
  return (
    <footer style={{ background: T.charcoal, padding: "clamp(48px,6vw,72px) clamp(20px,6vw,80px) clamp(24px,4vw,40px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 48 }}>
          <h2 className="f-display" style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 400, color: T.ivory, letterSpacing: "0.08em", marginBottom: 12 }}>
            The Heritage Path
          </h2>
          <p className="f-accent" style={{ fontSize: 15, fontStyle: "italic", fontWeight: 300, color: T.mist }}>{t.footer_sub}</p>
        </div>
        <div style={{ width: "100%", height: 1, background: `linear-gradient(90deg,transparent,${T.goldLine},transparent)`, marginBottom: 32 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: "'Be Vietnam Pro'", fontSize: 11, color: "rgba(197,191,181,0.4)", letterSpacing: "0.06em" }}>{t.footer_copy}</span>
          <span className="f-accent" style={{ fontSize: 12, fontStyle: "italic", color: "rgba(197,191,181,0.3)" }}>{t.footer_curated}</span>
        </div>
      </div>
    </footer>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ROOT — TheHeritagePath v5
// [5] Interaction scoring engine — centralised score state
// [6] session_id + sessionStart initialized on mount
// ══════════════════════════════════════════════════════════════════════════
export default function TheHeritagePath() {
  const [activeLang,           setActiveLang]           = useState(null);
  const [selectedEquity,       setSelectedEquity]       = useState(null);  // [1]
  const [selectedNeed,         setSelectedNeed]         = useState(null);
  const [selectedLifeStage,    setSelectedLifeStage]    = useState(null);
  const [currentProjectViewing, setCurrentProjectViewing] = useState(null);
  const [unlockIntent,         setUnlockIntent]         = useState(null);
  const [isKnowledgeUnlocked,  setIsKnowledgeUnlocked]  = useState(false); // [4]
  const [interactionScore,     setInteractionScore]     = useState(0);     // [5]
  const [glossaryOpens,        setGlossaryOpens]        = useState(0);

  // Refs — no re-render needed
  const mostInterestedRef  = useRef(null);
  const accumulatedMsRef   = useRef(0);
  const viewedProjectsRef  = useRef(new Set()); // [6] unique project views
  const sessionId          = useRef(null);
  const sessionStart       = useRef(Date.now());

  // Init session ID
  useEffect(() => {
    try {
      sessionId.current = crypto.randomUUID();
    } catch {
      sessionId.current = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    }
  }, []);

  // Sync module-level lang for sub-component closures
  useEffect(() => { lang = activeLang ?? "vi"; }, [activeLang]);

  const t          = i18n[activeLang ?? "vi"];
  const toggleLang = useCallback(() => setActiveLang(l => l === "vi" ? "en" : "vi"), []);

  // [5] Centralised score adder
  const addScore = useCallback((pts) => setInteractionScore(s => s + pts), []);

  const onGlossaryOpen = useCallback(() => setGlossaryOpens(n => n + 1), []);

  const handleUnlock = useCallback(() => {
    setIsKnowledgeUnlocked(true);
    setUnlockIntent("knowledge_lock");
  }, []);

  return (
    <>
      <GlobalStyles />

      <AnimatePresence>
        {!activeLang && <Gatekeeper key="gate" onSelect={setActiveLang} />}
      </AnimatePresence>

      <AnimatePresence>
        {activeLang && (
          <motion.div key="site" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.7, ease: "easeOut" } }}>
            <Nav t={t} activeLang={activeLang} onLangToggle={toggleLang} />

            <main>
              {/* 1. Hero */}
              <Hero t={t} />

              {/* 2. [3] Quick Entry — fast lead capture below hero */}
              <QuickEntry t={t} sessionId={sessionId.current} onScoreAdd={addScore} />

              {/* 3. About Advisor */}
              <AboutAdvisor t={t} />

              {/* 4. [1] Bespoke Search — equity filter */}
              <BespokeSearch
                t={t}
                selectedEquity={selectedEquity}       setSelectedEquity={setSelectedEquity}
                selectedNeed={selectedNeed}           setSelectedNeed={setSelectedNeed}
                selectedLifeStage={selectedLifeStage} setSelectedLifeStage={setSelectedLifeStage}
                onScoreAdd={addScore}
              />

              {/* 5. [4] Knowledge Lock — payment strategy + 5yr blur */}
              <KnowledgeLock
                t={t}
                selectedNeed={selectedNeed}
                selectedEquity={selectedEquity}
                selectedLifeStage={selectedLifeStage}
                isKnowledgeUnlocked={isKnowledgeUnlocked}
                onUnlock={handleUnlock}
                onScoreAdd={addScore}
              />

              {/* 6. Collections — soft reveal, equity-based matching */}
              <Collections
                t={t}
                selectedEquity={selectedEquity}
                selectedNeed={selectedNeed}
                onReset={() => { setSelectedEquity(null); setSelectedNeed(null); }}
                setCurrentProjectViewing={setCurrentProjectViewing}
                mostInterestedRef={mostInterestedRef}
                accumulatedMsRef={accumulatedMsRef}
                viewedProjectsRef={viewedProjectsRef}
              />

              {/* 7. Advisor Box */}
              <AdvisorBox t={t} selectedEquity={selectedEquity} selectedNeed={selectedNeed} />

              {/* 8. Journal — score +10, glossary tooltips */}
              <HabitusJournal t={t} onGlossaryOpen={onGlossaryOpen} onScoreAdd={addScore} />

              {/* 9. Concierge — full v5 payload */}
              <ConciergeForm
                t={t} activeLang={activeLang}
                selectedEquity={selectedEquity}
                selectedNeed={selectedNeed}
                selectedLifeStage={selectedLifeStage}
                currentProjectViewing={currentProjectViewing}
                mostInterestedRef={mostInterestedRef}
                accumulatedMsRef={accumulatedMsRef}
                viewedProjectsRef={viewedProjectsRef}
                unlockIntent={unlockIntent}
                glossaryOpens={glossaryOpens}
                sessionId={sessionId.current}
                sessionStart={sessionStart.current}
                isKnowledgeUnlocked={isKnowledgeUnlocked}
                onScoreAdd={addScore}
              />
            </main>

            <Footer t={t} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
