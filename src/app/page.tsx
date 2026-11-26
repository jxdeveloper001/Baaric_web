"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { faqs, formula, hero, ingredients, intro, marquee, order, reviews, site, variants } from "@/data/site";

const fade = "transition-all duration-300 ease-out";
/* Round 8 — full rebuild as a same-to-same clone of the user's reference
   landing page (green #0D9C4D + gold #F9A430 + black + white, sampled
   from the reference image). Design, layout and sections follow the
   reference; the products, photos and copy are Baaric's own — the
   reference's protein copy and prices are NOT copied (no prices were
   supplied for Baaric). Pill buttons, circular images, green arch hero,
   torn-edge green bands. Wood theme dropped entirely. */

/* Simple leaf shape (reference has small leaves around the hero) */
const Leaf = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M20.5 3.5C11 3.5 4.5 9 3.5 19.5c-.1 1 .7 2 1.8 1.9C16 20.5 20.5 13.5 20.5 3.5Z" />
  </svg>
);

const featureIcons = [
  <path key="heart" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />,
  <path key="leaf" d="M20.5 3.5C11 3.5 4.5 9 3.5 19.5c-.1 1 .7 2 1.8 1.9C16 20.5 20.5 13.5 20.5 3.5Z" />,
  <path key="drop" d="M12 2.7s6.5 7 6.5 11.3a6.5 6.5 0 1 1-13 0C5.5 9.7 12 2.7 12 2.7Z" />,
  <path key="star" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />,
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [variantId, setVariantId] = useState("massage-50");
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [done, setDone] = useState(false);
  const [orderId, setOrderId] = useState("");

  const selected = variants.find((v) => v.id === variantId) ?? variants[0];

  const pick = (id: string) => {
    setVariantId(id);
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  };

  // ── Reviews slider: one row, auto-advances, infinite.
  //    The list is rendered twice; the position snaps back to 0
  //    without animation after the duplicated first card.
  const reviewCount = reviews.items.length;
  const [revPos, setRevPos] = useState(0);
  const [revSnap, setRevSnap] = useState(false);
  const [revPaused, setRevPaused] = useState(false);
  const [revStep, setRevStep] = useState(0);
  const revTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measure = () => {
      const track = revTrackRef.current;
      if (track && track.children.length > 1) {
        const first = track.children[0] as HTMLElement;
        const second = track.children[1] as HTMLElement;
        setRevStep(second.offsetLeft - first.offsetLeft);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (revPos >= reviewCount) {
      const t = setTimeout(() => {
        setRevSnap(true);
        setRevPos(0);
      }, 700);
      return () => clearTimeout(t);
    }
  }, [revPos, reviewCount]);

  useEffect(() => {
    if (revPaused) return;
    const t = setInterval(() => {
      setRevSnap(false);
      setRevPos((p) => p + 1);
    }, 3000);
    return () => clearInterval(t);
  }, [revPaused]);

  const revNext = () => {
    setRevSnap(false);
    setRevPos((p) => p + 1);
  };
  const revPrev = () => {
    if (revPos === 0) {
      setRevSnap(true);
      setRevPos(reviewCount);
      setTimeout(() => {
        setRevSnap(false);
        setRevPos(reviewCount - 1);
      }, 40);
    } else {
      setRevSnap(false);
      setRevPos((p) => p - 1);
    }
  };

  // Scroll reveal — inline style only, never classList (React rewrites
  // className on re-render and would wipe an added class, fading the
  // card out forever — the Gheeya FAQ bug).
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "none";
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) return;
    setOrderId(`BAARIC-${Math.floor(1000 + Math.random() * 9000)}`);
    setDone(true);
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  }

  const navLinks: Array<[string, string]> = [
    ["#features", "বৈশিষ্ট্য"],
    ["#products", "পণ্য"],
    ["#ingredients", "উপাদান"],
    ["#packages", "প্যাকেজ"],
    ["#reviews", "রিভিউ"],
    ["#faq", "জিজ্ঞাসা"],
  ];

  const features = [
    ...intro.points,
    { title: "তিনটি তেল, একসাথে", text: "ম্যাসাজ, হেয়ার আর কোকোনাট — একসাথে যত্ন।" },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* ── Header: white, logo left, nav centre, gold pill button right ── */}
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-8">
          <a href="#" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green text-white">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="font-display text-[26px] font-bold leading-none tracking-tight text-ink">
              Baaric
            </span>
            <span className="font-display text-[15px] text-green">বারিক</span>
          </a>
          <nav className="hidden items-center gap-7 text-[15px] font-medium text-ink-soft lg:flex">
            {navLinks.map(([href, label]) => (
              <a key={href} href={href} className={`${fade} hover:text-green`}>
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#order"
              className={`${fade} rounded-full bg-gold px-5 py-2.5 text-[15px] font-bold text-ink shadow-[0_8px_16px_-8px_rgb(249_164_48/0.8)] hover:-translate-y-0.5 hover:bg-gold-deep hover:text-white active:scale-95`}
            >
              অর্ডার করুন
            </a>
            <button
              type="button"
              aria-label="মেনু"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink lg:hidden"
            >
              <span className="text-[18px] leading-none">{menuOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>
        <div className={`faq-panel ${menuOpen ? "open" : ""} border-t border-line/60 bg-white lg:hidden`}>
          <div>
            <nav className="flex flex-col px-5 py-2 text-[16px] font-medium text-ink-soft">
              {navLinks.map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full px-3 py-3 transition-colors hover:bg-green-pale hover:text-green-deep"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* ── Hero: white, big centred headline, gold pill button,
           green arch behind the 3-bottle photo, floating leaves. ── */}
      <section className="overflow-hidden bg-white pt-12 md:pt-16">
        <div className="relative z-10 mx-auto max-w-6xl px-5 text-center md:px-8">
          <p className="hero-in text-[12px] font-bold uppercase tracking-[0.24em] text-gold-deep sm:text-[13px]">
            {hero.eyebrow}
          </p>
          <h1 className="hero-in-delay mx-auto mt-3 max-w-3xl font-display text-[38px] font-bold leading-[1.15] text-ink sm:text-[56px] md:text-[68px]">
            {hero.titleA} <span className="text-green">{hero.highlight}</span>
          </h1>
          <p className="hero-in-delay2 mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-ink-soft md:text-[17px]">
            {hero.subtext}
          </p>
          <div className="hero-in-delay2 mt-7">
            <a
              href="#order"
              className={`${fade} inline-block rounded-full bg-gold px-9 py-3.5 text-[16px] font-bold text-ink shadow-[0_14px_26px_-12px_rgb(249_164_48/0.8)] hover:-translate-y-0.5 hover:bg-gold-deep hover:text-white active:scale-95`}
            >
              {hero.primaryCta}
            </a>
          </div>
        </div>
        <div className="relative mx-auto mt-12 max-w-4xl px-5 md:mt-14">
          <div aria-hidden className="absolute bottom-0 left-1/2 aspect-[1.5/1] w-[min(560px,125%)] -translate-x-1/2 rounded-t-full bg-green md:aspect-[1.7/1] md:w-[min(860px,112%)]" />
          <Leaf className="animate-float absolute left-[4%] top-[16%] z-20 h-8 w-8 text-green-deep md:h-10 md:w-10" />
          <Leaf className="animate-float-slow absolute right-[3%] top-[30%] z-20 h-7 w-7 rotate-[30deg] text-gold md:h-9 md:w-9" />
          <Leaf className="animate-float absolute right-[10%] top-[4%] z-20 hidden h-6 w-6 rotate-[-20deg] text-green-deep md:block" />
          <Image
            src="/baaric-hero-product.jpg"
            alt="Baaric বেবি অয়েল — ম্যাসাজ অয়েল, কোকোনাট অয়েল ও হেয়ার অয়েল"
            width={1720}
            height={1280}
            priority
            className="relative z-10 mx-auto h-auto w-[min(620px,90%)]"
          />
        </div>
      </section>

      {/* ── Trust strip: small label + marquee of the oils' qualities ── */}
      <div className="border-y border-line bg-white py-5">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.24em] text-ink-faint">
          আমাদের তেলের বৈশিষ্ট্য
        </p>
        <div className="mt-3 overflow-hidden" aria-hidden>
          <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap text-[15px] font-semibold text-ink-soft">
            {[...marquee, ...marquee, ...marquee, ...marquee].map((w, i) => (
              <span key={i} className="flex items-center gap-8">
                {w} <span className="text-green">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Green band: 4 features + circular product photo, torn edges ── */}
      <section id="features" className="torn scroll-mt-24 bg-green py-24 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-[1fr_auto] md:px-8">
          <div className="reveal">
            <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-white/80">কেন Baaric</p>
            <h2 className="mt-3 font-display text-[30px] font-bold leading-tight text-white sm:text-[38px]">
              {intro.heading}
            </h2>
            <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {features.map((f, i) => (
                <div key={f.title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
                      {featureIcons[i]}
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-display text-[19px] font-bold text-white">{f.title}</h3>
                    <p className="mt-1 text-[14.5px] leading-relaxed text-white/85">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal mx-auto">
            <div className="h-[240px] w-[240px] overflow-hidden rounded-full ring-4 ring-white/40 md:h-[280px] md:w-[280px]">
              <Image
                src="/baaric-product-coconut-200.jpg"
                alt="অর্গানিক কোকোনাট অয়েল — ২০০ মিলি বোতল"
                width={900}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Products: alternating rows, image / text ── */}
      <section id="products" className="scroll-mt-24 bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="reveal text-center">
            <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-green">পণ্য</p>
            <h2 className="mt-3 font-display text-[30px] font-bold text-ink sm:text-[38px]">আমাদের পণ্য</h2>
            <p className="mx-auto mt-3 max-w-xl text-[16px] leading-relaxed text-ink-soft">
              তিনটি তেল, তিন রকম যত্ন — বোতলের লেবেলেই সব লেখা।
            </p>
          </div>
          {variants.map((v, i) => (
            <article
              key={v.id}
              className={`reveal grid items-center gap-8 py-12 md:grid-cols-2 md:gap-14 ${i > 0 ? "border-t border-line" : ""}`}
            >
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <Image
                  src={v.image}
                  alt={v.alt}
                  width={900}
                  height={900}
                  className="mx-auto w-full max-w-[380px] object-contain"
                />
              </div>
              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-green">{v.variant}</p>
                <h3 className="mt-2 font-display text-[30px] font-bold leading-tight text-ink sm:text-[36px]">
                  {v.name}
                </h3>
                <p className="mt-2 text-[14px] font-medium text-ink-faint">{v.labelEn}</p>
                <p className="mt-3 max-w-md text-[16px] leading-relaxed text-ink-soft">{v.desc}</p>
                <div className="mt-7 flex flex-wrap items-center gap-5">
                  <button
                    type="button"
                    onClick={() => pick(v.id)}
                    className={`${fade} rounded-full bg-green px-8 py-3 text-[15px] font-bold text-white shadow-[0_12px_22px_-10px_rgb(13_156_77/0.7)] hover:-translate-y-0.5 hover:bg-green-deep active:scale-95`}
                  >
                    অর্ডার করুন
                  </button>
                  <span className="text-[20px] font-bold text-ink">{v.sizeBn}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Ingredients: 4 items from the real labels ── */}
      <section id="ingredients" className="scroll-mt-24 bg-paper py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <div className="reveal text-center">
            <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-green">উপাদান</p>
            <h2 className="mt-3 font-display text-[30px] font-bold text-ink sm:text-[38px]">উপাদান</h2>
            <p className="mx-auto mt-3 max-w-xl text-[16px] leading-relaxed text-ink-soft">
              বোতলের লেবেলে যা লেখা, ভেতরে তাই।
            </p>
          </div>
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {ingredients.map((g) => (
              <div key={g.name} className="reveal flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green text-white">
                  <Leaf className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-[20px] font-bold text-ink">
                    {g.name} <span className="text-[14px] font-medium text-ink-faint">· {g.en}</span>
                  </h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{g.note}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="reveal mt-10 text-center text-[15px] leading-relaxed text-ink-soft">
            আর কোকোনাট অয়েল — <strong className="text-ink">এক্সট্রা-ভার্জিন কোল্ড-প্রেসড</strong>।
          </p>
        </div>
      </section>

      {/* ── Formula band: green, circular photo + short text ── */}
      <section className="bg-green py-16 md:py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 md:grid-cols-[auto_1fr] md:px-8">
          <div className="reveal mx-auto">
            <div className="h-[220px] w-[220px] overflow-hidden rounded-full ring-4 ring-white/40 md:h-[260px] md:w-[260px]">
              <Image
                src="/baaric-details-products.jpg"
                alt="Baaric-এর তিনটি তেল — বেবি ম্যাসাজ অয়েল, অর্গানিক কোকোনাট অয়েল ও বেবি হেয়ার অয়েল"
                width={1200}
                height={892}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="reveal text-center md:text-left">
            <h2 className="font-display text-[30px] font-bold text-white sm:text-[36px]">{formula.heading}</h2>
            <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-white/85 md:mx-0">
              {formula.text}
            </p>
            <a
              href="#order"
              className={`${fade} mt-7 inline-block rounded-full bg-gold px-8 py-3 text-[15px] font-bold text-ink shadow-[0_12px_22px_-10px_rgb(0_0_0/0.35)] hover:-translate-y-0.5 hover:bg-gold-deep hover:text-white active:scale-95`}
            >
              অর্ডার করুন
            </a>
          </div>
        </div>
      </section>

      {/* ── Packages: 3 cards, click to select + go to order ── */}
      <section id="packages" className="scroll-mt-24 bg-paper py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="reveal text-center">
            <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-green">প্যাকেজ</p>
            <h2 className="mt-3 font-display text-[30px] font-bold text-ink sm:text-[38px]">প্যাকেজ</h2>
            <p className="mx-auto mt-3 max-w-xl text-[16px] leading-relaxed text-ink-soft">
              তিনটি প্যাক — যেটা দরকার, সেটা বেছে নিন।
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {variants.map((v) => {
              const active = v.id === selected.id;
              return (
                <article
                  key={v.id}
                  className={`reveal relative rounded-2xl border-2 bg-white p-6 text-center shadow-sm transition-all duration-300 ${
                    active ? "border-green shadow-[0_24px_44px_-22px_rgb(13_156_77/0.5)]" : "border-line"
                  }`}
                >
                  {active && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-green px-3.5 py-1 text-[12px] font-bold text-white">
                      নির্বাচিত
                    </span>
                  )}
                  <Image
                    src={v.image}
                    alt={v.alt}
                    width={900}
                    height={900}
                    className="mx-auto h-52 w-auto object-contain"
                  />
                  <h3 className="mt-4 font-display text-[20px] font-bold text-ink">{v.name}</h3>
                  <p className="mt-1 text-[14px] text-ink-faint">
                    {v.variant} · {v.sizeBn}
                  </p>
                  <button
                    type="button"
                    onClick={() => pick(v.id)}
                    className={`${fade} mt-5 w-full rounded-full bg-gold py-3 text-[15px] font-bold text-ink hover:-translate-y-0.5 hover:bg-gold-deep hover:text-white active:scale-[0.98]`}
                  >
                    অর্ডার করুন
                  </button>
                  <p className="mt-3 text-[12.5px] text-ink-faint">দাম কল করে নিশ্চিত করা হবে</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Reviews: ONE row, auto-sliding ── */}
      <section id="reviews" className="scroll-mt-24 bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="reveal flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-green">{reviews.eyebrow}</p>
              <h2 className="mt-3 font-display text-[30px] font-bold text-ink sm:text-[38px]">{reviews.heading}</h2>
              {reviews.sample && (
                <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-soft px-3 py-1.5 text-[12px] font-bold text-green-deep">
                  নমুনা রিভিউ — আসল ক্রেতার কথা এলে এখানে বসবে
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={revPrev}
                aria-label="আগের রিভিউ"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-[18px] text-ink transition hover:border-green hover:text-green-deep"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={revNext}
                aria-label="পরের রিভিউ"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-[18px] text-ink transition hover:border-green hover:text-green-deep"
              >
                ›
              </button>
            </div>
          </div>

          <div
            className="reveal mt-10 overflow-hidden"
            onMouseEnter={() => setRevPaused(true)}
            onMouseLeave={() => setRevPaused(false)}
          >
            <div
              ref={revTrackRef}
              className="flex gap-5"
              style={{
                transform: `translateX(-${revPos * revStep}px)`,
                transition: revSnap ? "none" : "transform 0.7s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {[...reviews.items, ...reviews.items].map((r, i) => (
                <article
                  key={i}
                  className="w-[86%] shrink-0 rounded-2xl border border-line bg-white p-6 shadow-[0_18px_36px_-26px_rgb(10_10_10/0.3)] sm:w-[47%] lg:w-[31.5%]"
                >
                  <p className="text-[17px] tracking-[0.2em] text-gold">★★★★★</p>
                  <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">“{r.quote}”</p>
                  <p className="mt-5 font-display text-[16px] font-bold text-ink">{r.name}</p>
                  <p className="text-[13px] text-ink-faint">{r.role}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ: plain and centered — just the questions. ── */}
      <section id="faq" className="scroll-mt-24 bg-paper py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <div className="reveal text-center">
            <h2 className="font-display text-[30px] font-bold text-ink sm:text-[38px]">সচরাচর জিজ্ঞাসা</h2>
          </div>
          <div className="reveal mt-8">
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className="border-b border-line first:border-t">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="font-display text-[18px] font-bold text-ink">{f.q}</span>
                    <span
                      className={`faq-chevron ${open ? "open" : ""} flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-green-soft text-[18px] text-green-deep`}
                    >
                      +
                    </span>
                  </button>
                  <div className={`faq-panel ${open ? "open" : ""}`}>
                    <div>
                      <p className="pb-6 pr-10 text-[15px] leading-relaxed text-ink-soft">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Order: form on the left, green summary panel on the right. ── */}
      <section id="order" className="scroll-mt-24 bg-green-pale py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="reveal grid overflow-hidden rounded-2xl bg-white shadow-[0_30px_60px_-30px_rgb(10_10_10/0.35)] md:grid-cols-[1.2fr_1fr]">
            <div className="px-7 py-9 sm:px-9">
              {done ? (
                <div className="flex h-full flex-col items-start justify-center py-4 text-left">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green text-[26px] text-white">✓</span>
                  <h3 className="mt-5 font-display text-[26px] font-bold text-ink">{order.successTitle}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{order.successText}</p>
                  <p className="mt-5 w-full rounded-2xl bg-green-pale px-5 py-4 text-[15px] leading-relaxed text-ink">
                    অর্ডার আইডি: <strong>{orderId}</strong>
                    <br />
                    {selected.name} · {selected.sizeBn} · {qty.toLocaleString("bn-BD")} টি
                    <br />
                    {name} · {phone}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setDone(false);
                      setName("");
                      setPhone("");
                      setAddress("");
                    }}
                    className={`${fade} mt-6 rounded-full border border-ink/25 px-6 py-3 text-[15px] font-semibold text-ink hover:border-green hover:text-green-deep`}
                  >
                    আরেকটি অর্ডার করুন
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="o-name" className="mb-1.5 block font-display text-[15px] font-bold text-ink">
                        আপনার নাম
                      </label>
                      <input
                        id="o-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="যেমন: আয়েশা রহমান"
                        className="w-full rounded-full border border-line bg-white px-5 py-3.5 text-[16px] text-ink outline-none transition placeholder:text-ink-faint focus:border-green focus:ring-2 focus:ring-green/25"
                      />
                    </div>
                    <div>
                      <label htmlFor="o-phone" className="mb-1.5 block font-display text-[15px] font-bold text-ink">
                        ফোন নম্বর
                      </label>
                      <input
                        id="o-phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        inputMode="tel"
                        placeholder="০১XXXXXXXXX"
                        className="w-full rounded-full border border-line bg-white px-5 py-3.5 text-[16px] text-ink outline-none transition placeholder:text-ink-faint focus:border-green focus:ring-2 focus:ring-green/25"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="o-address" className="mb-1.5 block font-display text-[15px] font-bold text-ink">
                      ডেলিভারির ঠিকানা
                    </label>
                    <textarea
                      id="o-address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      rows={3}
                      placeholder="বাসা/হোল্ডিং, রোড, এলাকা, জেলা"
                      className="w-full resize-none rounded-2xl border border-line bg-white px-5 py-3.5 text-[16px] text-ink outline-none transition placeholder:text-ink-faint focus:border-green focus:ring-2 focus:ring-green/25"
                    />
                  </div>
                  <p className="text-[14px] leading-relaxed text-ink-soft">
                    নির্বাচিত পণ্য: <strong className="text-ink">{selected.name} · {selected.sizeBn}</strong> —{" "}
                    {qty.toLocaleString("bn-BD")} টি
                  </p>
                  <button
                    type="submit"
                    className={`${fade} mt-1 w-full rounded-full bg-green py-4 text-[17px] font-bold text-white shadow-[0_16px_28px_-12px_rgb(13_156_77/0.7)] hover:-translate-y-0.5 hover:bg-green-deep active:scale-[0.98]`}
                  >
                    {order.submit} — {selected.sizeBn}
                  </button>
                </form>
              )}
            </div>
            <div className="flex flex-col justify-center bg-green px-7 py-10 sm:px-9">
              <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-gold-soft">{order.eyebrow}</p>
              <h2 className="mt-2 font-display text-[28px] font-bold leading-snug text-white sm:text-[32px]">
                {order.heading}
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-white/85">{order.subtext}</p>
              <div className="mt-7 flex items-center gap-4 rounded-2xl bg-white/95 p-4 shadow-[0_16px_30px_-20px_rgb(0_0_0/0.5)]">
                <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-white">
                  <Image
                    key={selected.id}
                    src={selected.image}
                    alt={selected.alt}
                    width={160}
                    height={200}
                    className="anim-swap h-full w-full object-contain"
                  />
                </div>
                <div>
                  <p className="font-display text-[18px] font-bold leading-snug text-ink">{selected.name}</p>
                  <p className="mt-1 text-[14px] text-ink-soft">
                    {selected.variant} · {selected.sizeBn} ({selected.sizeMl})
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-ink-soft">পরিমাণ</span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="পরিমাণ কমান"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white text-[16px] text-ink transition hover:border-green hover:text-green-deep"
                    >
                      −
                    </button>
                    <span className="min-w-5 text-center text-[15px] font-bold text-ink">
                      {qty.toLocaleString("bn-BD")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.min(10, q + 1))}
                      aria-label="পরিমাণ বাড়ান"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white text-[16px] text-ink transition hover:border-green hover:text-green-deep"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <p className="mt-4 rounded-xl bg-white/15 px-4 py-3 text-[13.5px] leading-relaxed text-white/90">
                {order.note}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer: black, like the reference ── */}
      <footer className="bg-ink py-12 text-white">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="flex items-center gap-2 font-display text-[28px] font-bold leading-none">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green text-white">
                  <Leaf className="h-4 w-4" />
                </span>
                Baaric
              </p>
              <p className="mt-3 text-[15px] text-white/60">{site.tagline}</p>
              <p className="mt-4 text-[13px] text-white/40">{site.contactNote}</p>
            </div>
            <nav className="flex flex-col gap-2.5 text-[15px] font-medium text-white/70">
              {navLinks.map(([href, label]) => (
                <a key={href} href={href} className="transition hover:text-gold">
                  {label}
                </a>
              ))}
              <a href="#order" className="transition hover:text-gold">
                অর্ডার করুন
              </a>
            </nav>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6 text-[13px] text-white/40">
            © ২০২৬ Baaric · All rights reserved. Developed by{" "}
            <a href="https://jnx-dev.vercel.app" target="_blank" rel="noreferrer" className="font-semibold text-gold hover:text-white">
              JNX
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
