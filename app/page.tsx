'use client';

import React, { useState, useEffect, useRef } from 'react';

// ============================================================
// MIRANDA — Cinematic AI Website (Optimized Video Parallax)
// Palette: Warm white #F5F3EF · Soft gray #EAE7E1 · Ink #0A0A0A · Muted #8E8E8E
// ============================================================

const VIDEOS = {
  hero:      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4',
  miranda:   'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4',
  histoire:  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4',
  archLeft:  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4',
  v7:        'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4',
  v8:        'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4',
  infra:     'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4',
  philo:     'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4',
};

// ============================================================
// LazyVideo — plays only when near viewport
// ============================================================
function LazyVideo({
  src,
  className,
  style,
  priority = false,
  parallax = 0,
}: {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  parallax?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(priority);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    if (priority) return;
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setReady(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: '400px 0px', threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [priority]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !ready) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        });
      },
      { threshold: 0.05 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [ready]);

  useEffect(() => {
    if (!parallax) return;
    let raf = 0;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(() => {
        const el = containerRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          const winH = window.innerHeight;
          const progress = (rect.top + rect.height / 2 - winH / 2) / winH;
          setTranslateY(-progress * parallax);
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [parallax]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className || ''}`} style={style}>
      <div
        className="absolute -inset-y-[10%] inset-x-0 will-change-transform"
        style={{ transform: `translate3d(0, ${translateY}px, 0) scale(1.15)` }}
      >
        {ready && (
          <video
            ref={ref}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload={priority ? 'auto' : 'metadata'}
            disablePictureInPicture
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </div>
  );
}

// ============================================================
// Reveal — on-scroll reveal
// ============================================================
function Reveal({
  children,
  y = 40,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  y?: number;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -80px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity 900ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 1100ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ============================================================
// SplitReveal — word-by-word mask reveal
// ============================================================
function SplitReveal({
  text,
  className = '',
  italic = false,
  delay = 0,
  stagger = 60,
}: {
  text: string;
  className?: string;
  italic?: boolean;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const words = String(text || '').split(' ');
  return (
    <span ref={ref} className={`${className} ${italic ? 'italic' : ''}`} style={{ display: 'inline-block' }}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-baseline" style={{ marginRight: '0.25em' }}>
          <span
            className="inline-block"
            style={{
              transform: visible ? 'translateY(0)' : 'translateY(110%)',
              opacity: visible ? 1 : 0,
              transition: `transform 900ms cubic-bezier(0.22,1,0.36,1) ${delay + i * stagger}ms, opacity 900ms ease ${delay + i * stagger}ms`,
            }}
          >
            {w}
          </span>
        </span>
      ))}
    </span>
  );
}

// ============================================================
// GrainOverlay
// ============================================================
function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100]"
      style={{
        opacity: 0.05,
        mixBlendMode: 'multiply',
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.9 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
      }}
    />
  );
}

// ============================================================
// Navbar
// ============================================================
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 300);
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
  const links = [
    { href: '#histoire',     label: 'Notre Histoire' },
    { href: '#architecture', label: 'Architecture' },
    { href: '#philosophie',  label: 'Philosophie' },
    { href: '#feuille',      label: 'Feuille de Route' },
    { href: '#contact',      label: 'Contact' },
  ];
  return (
    <nav
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[90] hidden md:block"
      style={{
        opacity: mounted ? 1 : 0,
        transform: `translate(-50%, ${mounted ? '0' : '-40px'})`,
        transition: 'opacity 800ms ease, transform 800ms cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <div
        className={`flex items-center gap-1 px-2 py-2 rounded-full border transition-all duration-500 ${
          scrolled ? 'bg-black/50 backdrop-blur-md border-white/10' : 'bg-black/25 backdrop-blur-sm border-white/8'
        }`}
      >
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="relative group px-4 py-1.5 text-[13px] text-white/80 hover:text-white rounded-full transition-colors whitespace-nowrap"
          >
            <span className="relative z-10">{l.label}</span>
            <span className="absolute inset-0 rounded-full bg-white/5 scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-300" />
          </a>
        ))}
      </div>
    </nav>
  );
}

// ============================================================
// Cursor
// ============================================================
function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener('mousemove', onMove);
    let raf = 0;
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${mx - 4}px, ${my - 4}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx - 16}px, ${ry - 16}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div className="pointer-events-none hidden md:block">
      <div ref={dot} className="fixed top-0 left-0 z-[200] w-2 h-2 rounded-full bg-white mix-blend-difference" />
      <div ref={ring} className="fixed top-0 left-0 z-[200] w-8 h-8 rounded-full border border-white/40 mix-blend-difference" />
    </div>
  );
}

// ============================================================
// Marquee
// ============================================================
function Marquee({ text, className = '' }: { text: string; className?: string }) {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className="inline-block will-change-transform" style={{ animation: 'marquee 40s linear infinite' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="mx-8 font-serif italic" style={{ fontFamily: '"Instrument Serif", serif' }}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================
export default function Home() {
  // Smooth scroll (Lenis-like)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let current = window.scrollY;
    let target = window.scrollY;
    let raf = 0;
    let active = false;
    const lerp = 0.08;

    const onWheel = (e: WheelEvent) => {
      if (window.innerWidth < 900) return;
      let node = e.target as HTMLElement | null;
      while (node && node !== document.body) {
        const s = node.scrollHeight > node.clientHeight;
        const style = getComputedStyle(node);
        if (s && (style.overflowY === 'auto' || style.overflowY === 'scroll')) return;
        node = node.parentElement;
      }
      e.preventDefault();
      target += e.deltaY;
      target = Math.max(0, Math.min(target, document.documentElement.scrollHeight - window.innerHeight));
      if (!active) {
        active = true;
        loop();
      }
    };
    const loop = () => {
      current += (target - current) * lerp;
      if (Math.abs(target - current) < 0.5) {
        current = target;
        window.scrollTo(0, current);
        active = false;
        return;
      }
      window.scrollTo(0, current);
      raf = requestAnimationFrame(loop);
    };
    const onScroll = () => {
      if (!active) {
        current = window.scrollY;
        target = window.scrollY;
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main className="relative min-h-screen text-[#0A0A0A] overflow-x-hidden" style={{ background: '#F5F3EF' }}>
      <GrainOverlay />
      <Cursor />
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col overflow-hidden" style={{ minHeight: '100dvh' }}>
        <div className="absolute inset-0 z-0">
          <LazyVideo src={VIDEOS.hero} priority parallax={200} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.88) 100%)' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/80" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center pt-24">
          <Reveal delay={200}>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 mb-10 rounded-full border border-white/15 bg-black/45 backdrop-blur">
              <span className="text-xs text-white/90">🧠 Nouveau</span>
              <span className="text-xs text-white/70">Miranda — Notre première IA conçue from scratch</span>
            </div>
          </Reveal>

          <h1
            className="italic leading-[0.95] tracking-tight text-white max-w-5xl"
            style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(48px, 10vw, 128px)' }}
          >
            {['Intelligence', 'Artificielle', 'Souveraine', 'Régionale'].map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <SplitReveal text={line} delay={400 + i * 150} stagger={0} />
              </span>
            ))}
          </h1>

          <Reveal delay={1200} y={20}>
            <p className="mt-10 max-w-2xl text-sm md:text-base text-white/70 leading-relaxed">
              18 mois de R&D indépendante. Un prototype fonctionnel validé. La première alternative souveraine aux solutions centralisées américaines — prête pour un déploiement industriel.
            </p>
          </Reveal>

          <Reveal delay={1400} y={20}>
            <div className="mt-10 flex flex-wrap items-center gap-4 justify-center">
              <a href="#architecture" className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 bg-black/45 backdrop-blur text-white text-sm hover:bg-white/10 transition-all duration-300">
                Découvrir Miranda
                <span className="inline-block transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
              </a>
              <a href="#histoire" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm text-white/80 hover:text-white transition">
                Notre histoire ▸
              </a>
            </div>
          </Reveal>

          <Reveal delay={1600} y={40}>
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
              <div className="rounded-2xl border border-white/12 bg-black/45 backdrop-blur p-6 text-left hover:bg-black/55 transition-all duration-300">
                <div className="text-xs text-white/50 mb-3">⏱</div>
                <div className="italic text-3xl text-white" style={{ fontFamily: '"Instrument Serif", serif' }}>18 mois</div>
                <div className="text-xs text-white/60 mt-1">R&D indépendante — prototype validé</div>
              </div>
              <div className="rounded-2xl border border-white/12 bg-black/45 backdrop-blur p-6 text-left hover:bg-black/55 transition-all duration-300">
                <div className="text-xs text-white/50 mb-3">🌐</div>
                <div className="italic text-3xl text-white" style={{ fontFamily: '"Instrument Serif", serif' }}>$251B</div>
                <div className="text-xs text-white/60 mt-1">Marché IA agents — projection 2034</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={1800}>
            <div className="mt-8 inline-block px-4 py-2 rounded-full border border-white/12 bg-black/35 text-xs text-white/70">
              Marché mondial des agents IA — CAGR +46.61% jusqu&apos;en 2034
            </div>
          </Reveal>

          <Reveal delay={2000}>
            <div className="mt-6 flex flex-wrap items-center gap-6 text-white/75 italic" style={{ fontFamily: '"Instrument Serif", serif' }}>
              <span>V7 Métier</span>
              <span className="text-white/30">·</span>
              <span>V8 Général</span>
              <span className="text-white/30">·</span>
              <span>Qwen 72B</span>
              <span className="text-white/30">·</span>
              <span>Souverain</span>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-[10px] tracking-[0.4em] uppercase text-white/50" style={{ animation: 'pulse-scroll 2.4s ease-in-out infinite' }}>
          Scroll ↓
        </div>
      </section>

      {/* MIRANDA GIANT */}
      <section className="relative overflow-hidden py-32 border-t border-black/10">
        <div className="absolute inset-0 z-0" style={{ opacity: 0.55 }}>
          <LazyVideo src={VIDEOS.miranda} parallax={80} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #F5F3EF, rgba(245,243,239,0.5) 40%, #F5F3EF)' }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <h2
            className="italic leading-[0.85] text-[#0A0A0A] select-none whitespace-nowrap"
            style={{ fontFamily: '"Instrument Serif", serif', fontSize: '22vw', transform: 'translateX(-8%)' }}
          >
            Miranda
          </h2>
          <div className="grid md:grid-cols-2 gap-10 mt-10">
            <div />
            <Reveal>
              <div className="space-y-6">
                <p className="text-[#0A0A0A]/80 leading-relaxed text-lg">
                  Miranda est une infrastructure d&apos;intelligence artificielle souveraine — conçue pour briser les dépendances structurelles et assurer la maîtrise complète du cycle de la donnée.
                </p>
                <a href="#contact" className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#0A0A0A] text-[#F5F3EF] text-sm font-medium hover:bg-[#1a1a1a] transition-all duration-300">
                  Partenariat institutionnel
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* HISTOIRE */}
      <section id="histoire" className="relative border-t border-black/10 py-28 px-6 bg-[#F5F3EF]">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-xs tracking-[0.3em] uppercase text-[#8E8E8E] mb-6">Intelligence Artificielle Souveraine</div>
          </Reveal>

          <h2 className="leading-[1.05] max-w-4xl" style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(36px, 6vw, 72px)' }}>
            <SplitReveal text="Nous sommes Miranda," />
            <br />
            <SplitReveal text="la première IA souveraine conçue from scratch." italic delay={200} className="text-[#0A0A0A]/90" />
          </h2>

          <div className="grid md:grid-cols-2 gap-12 mt-24">
            <div className="space-y-16">
              {[
                { n: 'i.',   t: 'Souveraineté',  d: "Aucune donnée transactionnelle ou identitaire ne transite par des serveurs externes. Toute la puissance de calcul est opérée en circuit fermé local." },
                { n: 'ii.',  t: 'Spécialisation', d: 'Miranda V7 exécute des cycles de vente complexes avec une logique métier native — zéro hallucination, 99.99% de fiabilité.' },
                { n: 'iii.', t: 'Déploiement',   d: "De 10 entreprises pilotes à 500+ PME connectées en 36 mois — ancrage régional dans la Corne de l'Afrique." },
              ].map((p, i) => (
                <Reveal key={p.n} delay={i * 120}>
                  <div>
                    <div className="text-xs text-[#8E8E8E] mb-2">{p.n}</div>
                    <h3 className="italic text-3xl mb-3" style={{ fontFamily: '"Instrument Serif", serif' }}>{p.t}</h3>
                    <p className="text-sm text-[#0A0A0A]/70 leading-relaxed max-w-md">{p.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={200}>
              <div className="relative rounded-2xl border border-black/10 bg-[#EAE7E1]/50 overflow-hidden min-h-[500px]">
                <LazyVideo src={VIDEOS.histoire} parallax={80} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                <div className="absolute bottom-6 left-6 text-xs text-white/85 italic" style={{ fontFamily: '"Instrument Serif", serif' }}>
                  Circuit fermé. Local. Souverain.
                </div>
              </div>
            </Reveal>
          </div>

          <div className="mt-32 max-w-4xl">
            <p className="italic leading-relaxed text-[#0A0A0A]/85" style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(20px, 2.6vw, 32px)' }}>
              <SplitReveal text="L'infrastructure Miranda matérialise 18 mois de recherche et d'ingénierie logicielle indépendantes." stagger={40} />
              {' '}
              <SplitReveal text="Le prototype fonctionnel actuel valide des scénarios industriels et commerciaux de haut niveau." stagger={40} delay={300} />
            </p>
            <Reveal delay={400}>
              <div className="mt-12 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-black/15 flex items-center justify-center italic" style={{ fontFamily: '"Instrument Serif", serif' }}>I</div>
                <div>
                  <div className="text-sm">Ismail</div>
                  <div className="text-xs text-[#8E8E8E]">Architecte Principal &amp; Concepteur de l&apos;Infrastructure Miranda</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section id="architecture" className="relative border-t border-black/10 py-28 px-6 bg-[#F5F3EF]">
        <div className="max-w-7xl mx-auto text-center">
          <Reveal>
            <div className="text-xs tracking-[0.3em] uppercase text-[#8E8E8E] mb-6">Architecture Duale</div>
          </Reveal>

          <h2 className="leading-[1.05] max-w-4xl mx-auto" style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(36px, 6vw, 72px)' }}>
            <SplitReveal text="V7 exécute, V8 comprend." />
            <br />
            <span className="italic">
              <SplitReveal text="L'infrastructure orchestre les deux en" italic delay={200} />
              {' '}
              <SplitReveal text="circuit fermé." italic delay={600} className="text-[#0A0A0A]/55" />
            </span>
          </h2>

          <div className="grid md:grid-cols-4 gap-4 mt-20 text-left">
            <Reveal>
              <div className="rounded-2xl border border-black/10 bg-[#EAE7E1]/40 overflow-hidden relative min-h-[420px] h-full group">
                <LazyVideo src={VIDEOS.archLeft} parallax={50} style={{ opacity: 0.85 }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-5 right-5">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-white/60 mb-2">Système</div>
                  <div className="italic text-xl text-white" style={{ fontFamily: '"Instrument Serif", serif' }}>Miranda — Architecture duale.</div>
                </div>
              </div>
            </Reveal>

            {[
              { title: 'Miranda V7 — Métier.',   n: '(01)', video: VIDEOS.v7, items: [
                'Gestion autonome des cycles de vente complexes',
                'Rédaction automatisée de propositions commerciales',
                'Pilotage rigoureux des objectifs',
                'Zéro hallucination métier — 99.99% fiabilité',
              ]},
              { title: 'Miranda V8 — Général.',  n: '(02)', video: VIDEOS.v8, items: [
                'Compréhension avancée du langage naturel',
                'Analyse approfondie de corpus hétérogènes',
                'Adaptation immédiate aux thématiques transversales',
              ]},
              { title: 'Infrastructure.',        n: '(03)', video: VIDEOS.infra, items: [
                'Hébergement souverain exclusif — isolation totale',
                'Aucun transit de données vers des serveurs externes',
                'Facturation mensuelle fixe — prévisibilité budgétaire',
              ]},
            ].map((card, i) => (
              <Reveal key={card.n} delay={120 + i * 100}>
                <article className="relative rounded-2xl border border-black/10 bg-[#EAE7E1]/50 p-5 flex flex-col h-full overflow-hidden group hover:border-black/20 transition-all duration-300">
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(600px circle at 50% 50%, rgba(10,10,10,0.05), transparent 40%)' }} />
                  <div className="relative h-40 rounded-xl overflow-hidden mb-5 border border-black/10">
                    <LazyVideo src={card.video} parallax={40} style={{ opacity: 0.95 }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="flex items-baseline justify-between mb-4 relative">
                    <h3 className="italic text-xl" style={{ fontFamily: '"Instrument Serif", serif' }}>{card.title}</h3>
                    <span className="text-xs text-[#8E8E8E]">{card.n}</span>
                  </div>
                  <ul className="space-y-3 text-sm text-[#0A0A0A]/75 flex-1 relative">
                    {card.items.map((it) => (
                      <li key={it} className="flex gap-2">
                        <span className="text-[#8E8E8E]">✓</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PHILOSOPHIE */}
      <section id="philosophie" className="relative border-t border-black/10 py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-45 z-0">
          <LazyVideo src={VIDEOS.philo} parallax={150} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #F5F3EF, rgba(245,243,239,0.7) 50%, #F5F3EF)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto z-10">
          <Reveal>
            <div className="rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-8 md:p-12 max-w-xl">
              <div className="text-xs tracking-[0.3em] uppercase text-[#8E8E8E] mb-4">Notre Approche</div>
              <p className="text-[#0A0A0A]/85 leading-relaxed">
                Miranda dépasse le simple cadre logiciel : c&apos;est un actif technologique stratégique conçu pour assurer la maîtrise complète du cycle de la donnée et l&apos;efficacité opérationnelle des organisations.
              </p>
              <a href="#contact" className="inline-flex mt-6 px-5 py-2.5 rounded-full border border-black/15 text-sm hover:bg-black/5 transition-all duration-300">
                Démonstration technique
              </a>
            </div>
          </Reveal>

          <h2 className="italic mt-28 leading-none" style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(48px, 9vw, 128px)' }}>
            <SplitReveal text="Spécialisation" italic />
            <span className="text-[#0A0A0A]/40"> × </span>
            <SplitReveal text="Souveraineté" italic delay={300} />
          </h2>

          <div className="grid md:grid-cols-2 gap-16 mt-20">
            <Reveal>
              <div className="relative rounded-2xl border border-black/10 overflow-hidden min-h-[480px]">
                <LazyVideo src={VIDEOS.miranda} parallax={100} />
              </div>
            </Reveal>
            <div className="space-y-10">
              <Reveal delay={100}>
                <div>
                  <div className="text-xs tracking-[0.3em] uppercase text-[#8E8E8E] mb-3">Avantage concurrentiel décisif</div>
                  <p className="text-[#0A0A0A]/80 leading-relaxed">
                    Aucun acteur ne combine spécialisation métier native et souveraineté intégrale des données. Miranda opère à cette intersection — transformant la dépendance technologique en indépendance stratégique.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={200}>
                <div className="border-t border-black/10 pt-8">
                  <div className="text-xs tracking-[0.3em] uppercase text-[#8E8E8E] mb-3">Gouvernance technique</div>
                  <p className="text-[#0A0A0A]/80 leading-relaxed">
                    Le code déterministe remplace l&apos;incertitude des modèles ouverts. L&apos;agent est structurellement incapable de dévier des grilles tarifaires configurées ou de modifier des clauses juridiques validées.
                  </p>
                </div>
              </Reveal>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { v: '100%',   l: 'Étanchéité contractuelle' },
                  { v: '99.99%', l: 'Fiabilité V7' },
                  { v: 'Totale', l: 'Isolation des données' },
                  { v: '~72%',   l: 'Couverture marché 36 mois' },
                ].map((s, i) => (
                  <Reveal key={s.l} delay={300 + i * 80}>
                    <div className="rounded-2xl border border-black/10 bg-white/50 backdrop-blur p-5 hover:bg-white/70 transition-all duration-300">
                      <div className="italic text-2xl" style={{ fontFamily: '"Instrument Serif", serif' }}>{s.v}</div>
                      <div className="text-xs text-[#0A0A0A]/60 mt-1">{s.l}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEUILLE DE ROUTE */}
      <section id="feuille" className="relative border-t border-black/10 py-28 px-6 bg-[#F5F3EF]">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex items-baseline justify-between mb-16">
              <h2 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(36px, 5.5vw, 72px)' }}>Feuille de route</h2>
              <div className="text-xs text-[#8E8E8E]">12 mois opérationnels</div>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { seg: 'Segment A — Mois 1–3', title: 'Compute & Tuning', video: VIDEOS.histoire, body: "Optimisation et recalibrage local du modèle fondation open-source Qwen 72B quantisé en INT4. Finalisation des couches logicielles d'inférence pour stabiliser la latence sous 1.5 seconde." },
              { seg: 'Segment B — Mois 4–6', title: 'Déploiement V7', video: VIDEOS.v7, body: 'Intégration opérationnelle de Miranda V7 avec une cohorte pilote de 10 à 50 entreprises régionales. Validation des connecteurs API (WhatsApp, Emails) et mesure de la pertinence de négociation.' },
            ].map((c, i) => (
              <Reveal key={c.seg} delay={i * 120}>
                <article className="rounded-2xl border border-black/10 bg-[#EAE7E1]/40 overflow-hidden h-full group hover:border-black/25 transition-all duration-500">
                  <div className="relative h-64 border-b border-black/10 overflow-hidden">
                    <LazyVideo src={c.video} parallax={40} style={{ opacity: 0.95 }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-xs text-[#8E8E8E] tracking-widest uppercase">{c.seg}</div>
                      <div className="w-8 h-8 rounded-full border border-black/15 flex items-center justify-center text-xs transition-transform duration-300 group-hover:rotate-45">↗</div>
                    </div>
                    <h3 className="text-2xl mb-3" style={{ fontFamily: '"Instrument Serif", serif' }}>{c.title}</h3>
                    <p className="text-sm text-[#0A0A0A]/70 leading-relaxed">{c.body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <article className="mt-4 rounded-2xl border border-black/10 bg-[#EAE7E1]/40 overflow-hidden group hover:border-black/25 transition-all duration-500">
              <div className="relative h-56 border-b border-black/10 overflow-hidden">
                <LazyVideo src={VIDEOS.v8} parallax={40} style={{ opacity: 0.95 }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>
              <div className="p-6 grid md:grid-cols-[1fr_auto] gap-8 items-end">
                <div>
                  <div className="text-xs text-[#8E8E8E] tracking-widest uppercase mb-3">Segment C — Mois 7–12</div>
                  <h3 className="text-2xl mb-3" style={{ fontFamily: '"Instrument Serif", serif' }}>Convergence V7 + V8</h3>
                  <p className="text-sm text-[#0A0A0A]/70 leading-relaxed max-w-3xl">
                    Fusion algorithmique entre les facultés proactives de V7 et la puissance d&apos;analyse logique globale de V8. Basculement progressif du cluster de serveurs vers la précision native BF16.
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 p-6 text-center min-w-[160px]">
                  <div className="italic text-3xl" style={{ fontFamily: '"Instrument Serif", serif' }}>500+</div>
                  <div className="text-xs text-[#0A0A0A]/60 mt-1">PME à 36 mois</div>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      {/* AVANTAGES STRATÉGIQUES */}
      <section className="relative border-t border-black/10 py-28 px-6 bg-[#F5F3EF]">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-xs tracking-[0.3em] uppercase text-[#8E8E8E] mb-6">// Avantages Stratégiques</div>
          </Reveal>

          <h2 className="mb-20" style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(48px, 8vw, 112px)', lineHeight: 0.95 }}>
            <SplitReveal text="Miranda" />
            <br />
            <SplitReveal text="souveraine" italic className="text-[#0A0A0A]/60" delay={300} />
          </h2>

          <Marquee text="Fixe Mensuel · Prévisible · Sans Surprise · Souverain · Fixe Mensuel · Prévisible · Sans Surprise · Souverain ·" className="text-2xl text-[#0A0A0A]/40 border-y border-black/10 py-6 mb-6" />

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Modèle Économique', body: "Substitution de la facturation volatile par token par un modèle d'infrastructure à coût fixe — garantissant un contrôle absolu des dépenses à grande échelle.", tags: ['Fixe Mensuel', 'Prévisible', 'Sans Surprise', 'Souverain'] },
              { title: 'Matrice Concurrentielle', body: "Aucun concurrent ne combine spécialisation métier native et souveraineté intégrale des données. Miranda détient l'avantage concurrentiel décisif.", tags: ['OpenAI', 'Salesforce', 'Conversica', 'Miranda ✓'] },
              { title: 'Ancrage Territorial', body: "Déploiement progressif dans la Corne de l'Afrique — de 10 entreprises pilotes à 500+ PME connectées, avec généralisation dans les services publics.", tags: ['Corne Afrique', '36 Mois', '~72% Marché', 'Régional'] },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 120}>
                <div className="rounded-2xl border border-black/10 bg-white/40 p-8 h-full hover:bg-white/70 hover:-translate-y-1 transition-all duration-500">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {c.tags.map((t) => {
                      const active = t.includes('✓');
                      return (
                        <span key={t} className={`text-[10px] px-2.5 py-1 rounded-full border ${active ? 'bg-[#0A0A0A] text-[#F5F3EF] border-[#0A0A0A]' : 'border-black/15 text-[#0A0A0A]/70'}`}>{t}</span>
                      );
                    })}
                  </div>
                  <h3 className="text-2xl mb-4" style={{ fontFamily: '"Instrument Serif", serif' }}>{c.title}</h3>
                  <p className="text-sm text-[#0A0A0A]/70 leading-relaxed">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FROM SCRATCH */}
      <section className="relative border-t border-black/10 py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ opacity: 0.35 }}>
          <LazyVideo src={VIDEOS.archLeft} parallax={120} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #F5F3EF, rgba(245,243,239,0.6), #F5F3EF)' }} />
        </div>
        <div className="relative max-w-5xl mx-auto z-10 text-center">
          <Reveal>
            <div className="text-xs tracking-[0.3em] uppercase text-[#8E8E8E] mb-6">Annonce — Juillet 2026</div>
          </Reveal>
          <h2 className="leading-[1.02]" style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(42px, 7vw, 96px)' }}>
            <SplitReveal text="Nous avons conçu notre" />
            <br />
            <SplitReveal text="première IA from scratch." italic delay={300} />
          </h2>
          <Reveal delay={500}>
            <p className="mt-10 max-w-2xl mx-auto text-[#0A0A0A]/75 leading-relaxed">
              Miranda est le fruit de 18 mois de recherche et d&apos;ingénierie logicielle indépendantes. Un prototype fonctionnel qui valide des scénarios industriels de haut niveau — la première alternative souveraine aux solutions centralisées américaines.
            </p>
          </Reveal>
          <Reveal delay={700}>
            <div className="mt-10 flex flex-wrap items-center gap-4 justify-center">
              <a href="#architecture" className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0A0A0A] text-[#F5F3EF] text-sm hover:bg-[#1a1a1a] transition-all duration-300">
                Découvrir l&apos;architecture
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-black/15 text-sm hover:bg-black/5 transition-all duration-300">
                Démonstration technique
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative border-t border-black/10 py-28 px-6 bg-[#F5F3EF]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="italic" style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(36px, 5.5vw, 72px)' }}>
            <SplitReveal text="Intéressé par un partenariat institutionnel ?" italic stagger={40} />
          </h2>
          <Reveal delay={400}>
            <div className="mt-10 flex flex-wrap items-center gap-4 justify-center">
              <a href="mailto:hello@miranda.ai" className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0A0A0A] text-[#F5F3EF] text-sm hover:bg-[#1a1a1a] transition-all duration-300">
                Nous contacter
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a href="#histoire" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-black/15 text-sm hover:bg-black/5 transition-all duration-300">
                Notre histoire ▸
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-black/10 px-6 py-16 bg-[#F5F3EF]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">▲</span>
                <span className="italic text-2xl" style={{ fontFamily: '"Instrument Serif", serif' }}>Miranda</span>
              </div>
              <div className="text-xs text-[#8E8E8E] max-w-sm">
                Direction Technique — Cabinet Conseil<br />
                © 2026 Projet Miranda
              </div>
            </div>
            <div className="flex flex-wrap gap-8 text-sm">
              {[
                { href: '#histoire',     label: 'Histoire' },
                { href: '#feuille',      label: 'Feuille de route' },
                { href: '#architecture', label: 'Architecture' },
                { href: '#contact',      label: 'Contact' },
              ].map((l) => (
                <a key={l.href} href={l.href} className="text-[#0A0A0A]/70 hover:text-[#0A0A0A] transition-colors">{l.label}</a>
              ))}
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-black/10">
            <div className="italic select-none" style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(80px, 20vw, 320px)', lineHeight: 0.85, color: '#0A0A0A', opacity: 0.08 }}>
              Miranda
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
