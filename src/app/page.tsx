"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { faqs, hero, intro, marquee, order, reviews, site, variants } from "@/data/site";

const fade = "transition-all duration-300 ease-out";
/* Round 5 — the whole site is SQUARE with just a touch of softness:
   cards rounded-lg, buttons/inputs rounded-md. Nothing pill, nothing
   fully round. Softness comes from shadows + blurred colour washes. */

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
    ["#intro", "পরিচিতি"],
    ["#variants", "পণ্য"],
    ["#reviews", "রিভিউ"],
    ["#faq", "জিজ্ঞাসা"],
  ];

  return (
    <main className="min-h-screen">
      {/* ── Header: cream, thin gold rule under it ── */}
      <header className="sticky top-0 z-40 border-b-2 border-gold/60 bg-cream/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-8">
          <a href="#" className="flex items-baseline gap-2">
            <span className="font-display text-[26px] font-bold leading-none tracking-tight text-leaf">
              Baaric
            </span>
            <span className="font-display text-[15px] text-terra-deep">বারিক</span>
          </a>
          <nav className="hidden items-center gap-8 text-[15px] font-medium text-cocoa-soft lg:flex">
            {navLinks.map(([href, label]) => (
              <a key={href} href={href} className={`${fade} hover:text-terra-deep`}>
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#order"
              className={`${fade} rounded-md bg-gold px-5 py-2.5 text-[15px] font-bold text-cocoa shadow-[0_8px_16px_-8px_rgb(185_127_31/0.7)] hover:-translate-y-0.5 hover:bg-terra-deep hover:text-white active:scale-95`}
            >
              অর্ডার করুন
            </a>
            <button
              type="button"
              aria-label="মেনু"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-cream text-cocoa lg:hidden"
            >
              <span className="text-[18px] leading-none">{menuOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>
        <div className={`faq-panel ${menuOpen ? "open" : ""} border-t border-line/60 bg-cream lg:hidden`}>
          <div>
            <nav className="flex flex-col px-5 py-2 text-[16px] font-medium text-cocoa-soft">
              {navLinks.map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-2 py-3 transition-colors hover:bg-cream-deep/60 hover:text-terra-deep"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* ── Hero: CENTERED. The product image sits in the middle,
           the text sits ON the image (top, over a soft cream wash),
           the buttons sit BELOW the image. Minimal text. */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/baaric-wood.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-cream/45" />
        </div>
        <div aria-hidden className="pointer-events-none absolute -left-24 top-8 h-72 w-72 bg-blur-green/45 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 bg-blur-pink/50 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-5 py-12 md:px-8 md:py-16">
          <div className="relative">
            <div aria-hidden className="absolute -left-3 -top-3 h-full w-full rounded-lg bg-gold/50" />
            <div aria-hidden className="absolute -bottom-3 -right-3 h-full w-full rounded-lg bg-rose/40" />
            <div className="relative overflow-hidden rounded-lg bg-white shadow-[0_30px_60px_-28px_rgb(74_46_27/0.5)]">
              <Image
                src="/baaric-hero-product.jpg"
                alt="Baaric বেবি অয়েল — ম্যাসাজ অয়েল, কোকোনাট অয়েল ও হেয়ার অয়েল"
                width={1720}
                height={1280}
                priority
                className="h-auto w-full"
              />
              <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-cream/90 via-cream/55 to-transparent px-5 pb-20 pt-6 text-center sm:pt-8">
                <p className="hero-in text-[12px] font-bold uppercase tracking-[0.22em] text-terra-deep sm:text-[13px]">
                  {hero.eyebrow}
                </p>
                <h1 className="hero-in-delay mx-auto mt-2 max-w-2xl font-display text-[26px] font-bold leading-[1.2] text-cocoa sm:text-[40px] md:text-[46px]">
                  {hero.titleA}{" "}
                  <em className="not-italic text-leaf">{hero.highlight}</em>
                </h1>
                <p className="hero-in-delay2 mx-auto mt-2 hidden max-w-xl text-[16px] leading-relaxed text-cocoa-soft sm:block">
                  {hero.subtext}
                </p>
              </div>
            </div>
          </div>
          <div className="hero-in-delay2 mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#order"
              className={`${fade} rounded-md bg-gold px-8 py-3.5 text-[16px] font-bold text-cocoa shadow-[0_14px_26px_-12px_rgb(185_127_31/0.8)] hover:-translate-y-0.5 hover:bg-terra-deep hover:text-white active:scale-95`}
            >
              {hero.primaryCta}
            </a>
            <a
              href="#variants"
              className={`${fade} rounded-md border-2 border-leaf/30 bg-white/70 px-7 py-3 text-[16px] font-bold text-leaf hover:-translate-y-0.5 hover:border-leaf active:scale-95`}
            >
              {hero.secondaryCta}
            </a>
          </div>
        </div>
      </section>

      {/* ── Marquee strip: gold band, cocoa text ── */}
      <div className="overflow-hidden bg-gold py-3.5" aria-hidden>
        <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap text-[15px] font-bold text-cocoa">
          {[...marquee, ...marquee, ...marquee, ...marquee].map((w, i) => (
            <span key={i} className="flex items-center gap-8">
              {w} <span className="text-rose">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Product details: photo on top, no border;
           three square tinted cards below, one row. */}
      <section id="intro" className="scroll-mt-24 bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="reveal max-w-2xl">
            <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-terra-deep">{intro.eyebrow}</p>
            <h2 className="mt-3 font-display text-[30px] font-bold text-cocoa sm:text-[38px]">
              {intro.heading}
            </h2>
            <div className="mt-4 h-1 w-16 bg-gold" />
          </div>
          <div className="reveal mx-auto mt-10 max-w-3xl">
            <Image
              src="/baaric-details-products.jpg"
              alt="Baaric-এর তিনটি তেল — বেবি ম্যাসাজ অয়েল, অর্গানিক কোকোনাট অয়েল ও বেবি হেয়ার অয়েল"
              width={1200}
              height={892}
              className="h-auto w-full"
            />
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {intro.points.map((pt, i) => (
              <article
                key={pt.title}
                className={`reveal rounded-lg p-7 shadow-[0_20px_40px_-26px_rgb(74_46_27/0.45)] ${
                  ["bg-leaf-soft", "bg-rose-soft", "bg-goldsoft"][i]
                }`}
              >
                <p className="font-display text-[26px] font-bold text-terra-deep">{["০১", "০২", "০৩"][i]}</p>
                <h3 className="mt-1 font-display text-[21px] font-bold text-cocoa">{pt.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-cocoa-soft">{pt.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product selection: SPLIT card (new shape).
           Left: selected product on a wood-cream panel.
           Right: title, square option boxes, qty, checks, gold CTA. */}
      <section id="variants" className="relative scroll-mt-24 overflow-hidden bg-sage py-20">
        <div aria-hidden className="pointer-events-none absolute -left-20 top-10 h-72 w-72 bg-blur-green/40 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-16 bottom-6 h-64 w-64 bg-blur-pink/45 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 md:px-8">
          <div className="reveal max-w-2xl">
            <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-terra-deep">প্যাক</p>
            <h2 className="mt-3 font-display text-[30px] font-bold text-cocoa sm:text-[38px]">
              কোনটি নেবেন?
            </h2>
            <div className="mt-4 h-1 w-16 bg-gold" />
          </div>
          <div className="reveal mt-10 grid overflow-hidden rounded-lg bg-white shadow-[0_36px_70px_-32px_rgb(74_46_27/0.45)] md:grid-cols-2">
            <div className="relative flex items-center justify-center overflow-hidden px-6 py-10">
              <div className="absolute inset-0">
                <Image src="/baaric-wood.jpg" alt="" fill className="object-cover opacity-70" />
                <div className="absolute inset-0 bg-cream/55" />
              </div>
              <div aria-hidden className="pointer-events-none absolute left-6 top-6 h-24 w-24 bg-blur-pink/50 blur-2xl" />
              <Image
                key={selected.id}
                src={selected.image}
                alt={selected.alt}
                width={900}
                height={900}
                className="anim-swap relative h-[300px] w-auto object-contain sm:h-[360px]"
              />
            </div>
            <div className="px-6 py-8 sm:px-9">
              <h3 className="font-display text-[28px] font-bold leading-tight text-cocoa sm:text-[32px]">
                {selected.name}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-cocoa-soft">
                {selected.variant} · {selected.sizeBn} — {selected.desc}
              </p>

              <p className="mt-7 font-display text-[16px] font-bold text-cocoa">পণ্য নির্বাচন করুন:</p>
              <div className="mt-3 grid grid-cols-3 gap-2.5 sm:gap-3">
                {variants.map((v) => {
                  const active = v.id === selected.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVariantId(v.id)}
                      aria-pressed={active}
                      className={`relative rounded-md border-2 px-3 py-3.5 text-left transition-all duration-300 sm:px-4 ${
                        active ? "border-gold bg-goldsoft/60" : "border-line bg-white hover:border-gold/50"
                      }`}
                    >
                      <span
                        className={`absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-sm text-[12px] text-white ${
                          active ? "bg-gold" : "bg-cocoa/15"
                        }`}
                      >
                        ✓
                      </span>
                      <span className="block pr-5 text-[14px] font-bold leading-snug text-cocoa sm:text-[15px]">
                        {v.variant}
                      </span>
                      <span className="mt-1 block text-[13px] font-medium text-cocoa-faint">{v.sizeBn}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-col gap-3 rounded-md bg-cream-deep/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="whitespace-nowrap font-display text-[19px] font-bold text-cocoa">
                    {qty.toLocaleString("bn-BD")}টি × {selected.sizeBn}
                  </p>
                  <p className="mt-0.5 text-[13px] text-cocoa-soft">দাম ও ডেলিভারি কল করে নিশ্চিত করা হবে</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[14px] font-semibold text-cocoa-soft">পরিমাণ</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="পরিমাণ কমান"
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white text-[18px] text-cocoa transition hover:border-gold hover:text-terra-deep"
                  >
                    −
                  </button>
                  <span className="min-w-5 text-center text-[17px] font-bold text-cocoa">
                    {qty.toLocaleString("bn-BD")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    aria-label="পরিমাণ বাড়ান"
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white text-[18px] text-cocoa transition hover:border-gold hover:text-terra-deep"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-md border border-line bg-white px-5 py-4">
                {["আসল প্যাকেজিং", "লেবেলে লেখা উপাদান", "কোমল, প্রতিদিনের", "তিনটি তেল, একসাথে"].map((t) => (
                  <p key={t} className="flex items-center gap-2 text-[14px] font-medium text-cocoa-soft">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-gold text-[11px] text-white">
                      ✓
                    </span>
                    {t}
                  </p>
                ))}
              </div>

              <a
                href="#order"
                className={`${fade} mt-6 block rounded-md bg-gold py-4 text-center text-[17px] font-bold text-cocoa shadow-[0_16px_28px_-12px_rgb(185_127_31/0.8)] hover:-translate-y-0.5 hover:bg-terra-deep hover:text-white active:scale-[0.98]`}
              >
                অর্ডার করুন — {selected.sizeBn}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews: ONE row, auto-sliding (as before), square corners. ── */}
      <section id="reviews" className="scroll-mt-24 bg-peach py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="reveal flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-terra-deep">{reviews.eyebrow}</p>
              <h2 className="mt-3 font-display text-[30px] font-bold text-cocoa sm:text-[38px]">{reviews.heading}</h2>
              {reviews.sample && (
                <p className="mt-3 inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-[12px] font-bold text-terra-deep">
                  নমুনা রিভিউ — আসল ক্রেতার কথা এলে এখানে বসবে
                </p>
              )}
              <div className="mt-4 h-1 w-16 bg-gold" />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={revPrev}
                aria-label="আগের রিভিউ"
                className="flex h-11 w-11 items-center justify-center rounded-md border border-line bg-white text-[18px] text-cocoa transition hover:border-gold hover:text-terra-deep"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={revNext}
                aria-label="পরের রিভিউ"
                className="flex h-11 w-11 items-center justify-center rounded-md border border-line bg-white text-[18px] text-cocoa transition hover:border-gold hover:text-terra-deep"
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
                  className="w-[86%] shrink-0 rounded-lg border border-line bg-white p-6 shadow-[0_18px_36px_-26px_rgb(74_46_27/0.4)] sm:w-[47%] lg:w-[31.5%]"
                >
                  <p className="text-[17px] tracking-[0.2em] text-gold">★★★★★</p>
                  <p className="mt-3 text-[16px] leading-relaxed text-cocoa-soft">“{r.quote}”</p>
                  <p className="mt-5 font-display text-[16px] font-bold text-cocoa">{r.name}</p>
                  <p className="text-[13px] text-cocoa-faint">{r.role}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ: plain and centered — just the questions. ── */}
      <section id="faq" className="scroll-mt-24 bg-white py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <div className="reveal text-center">
            <h2 className="font-display text-[30px] font-bold text-cocoa sm:text-[38px]">সচরাচর জিজ্ঞাসা</h2>
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
                    <span className="font-display text-[18px] font-bold text-cocoa">{f.q}</span>
                    <span
                      className={`faq-chevron ${open ? "open" : ""} flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line bg-cream text-[18px] text-terra-deep`}
                    >
                      +
                    </span>
                  </button>
                  <div className={`faq-panel ${open ? "open" : ""}`}>
                    <div>
                      <p className="pb-6 pr-10 text-[15px] leading-relaxed text-cocoa-soft">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Order: SPLIT card — form on the left, wood panel with
           product + summary (+ qty stepper) on the right. ── */}
      <section id="order" className="scroll-mt-24 bg-sage py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="reveal grid overflow-hidden rounded-lg bg-white shadow-[0_30px_60px_-30px_rgb(74_46_27/0.4)] md:grid-cols-[1.2fr_1fr]">
            <div className="px-7 py-9 sm:px-9">
              {done ? (
                <div className="flex h-full flex-col items-start justify-center py-4 text-left">
                  <span className="flex h-14 w-14 items-center justify-center rounded-md bg-leaf text-[26px] text-cream">✓</span>
                  <h3 className="mt-5 font-display text-[26px] font-bold text-cocoa">{order.successTitle}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-cocoa-soft">{order.successText}</p>
                  <p className="mt-5 w-full rounded-lg bg-cream-deep/70 px-5 py-4 text-[15px] leading-relaxed text-cocoa">
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
                    className={`${fade} mt-6 rounded-md border border-cocoa/25 px-6 py-3 text-[15px] font-semibold text-cocoa hover:border-gold hover:text-terra-deep`}
                  >
                    আরেকটি অর্ডার করুন
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="o-name" className="mb-1.5 block font-display text-[15px] font-bold text-cocoa">
                        আপনার নাম
                      </label>
                      <input
                        id="o-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="যেমন: আয়েশা রহমান"
                        className="w-full rounded-md border border-line bg-white px-4 py-3.5 text-[16px] text-cocoa outline-none transition placeholder:text-cocoa-faint focus:border-gold focus:ring-2 focus:ring-gold/25"
                      />
                    </div>
                    <div>
                      <label htmlFor="o-phone" className="mb-1.5 block font-display text-[15px] font-bold text-cocoa">
                        ফোন নম্বর
                      </label>
                      <input
                        id="o-phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        inputMode="tel"
                        placeholder="০১XXXXXXXXX"
                        className="w-full rounded-md border border-line bg-white px-4 py-3.5 text-[16px] text-cocoa outline-none transition placeholder:text-cocoa-faint focus:border-gold focus:ring-2 focus:ring-gold/25"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="o-address" className="mb-1.5 block font-display text-[15px] font-bold text-cocoa">
                      ডেলিভারির ঠিকানা
                    </label>
                    <textarea
                      id="o-address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      rows={3}
                      placeholder="বাসা/হোল্ডিং, রোড, এলাকা, জেলা"
                      className="w-full resize-none rounded-md border border-line bg-white px-4 py-3.5 text-[16px] text-cocoa outline-none transition placeholder:text-cocoa-faint focus:border-gold focus:ring-2 focus:ring-gold/25"
                    />
                  </div>
                  <p className="text-[14px] leading-relaxed text-cocoa-soft">
                    নির্বাচিত পণ্য: <strong className="text-cocoa">{selected.name} · {selected.sizeBn}</strong> —{" "}
                    {qty.toLocaleString("bn-BD")} টি
                  </p>
                  <button
                    type="submit"
                    className={`${fade} mt-1 w-full rounded-md bg-gold py-4 text-[17px] font-bold text-cocoa shadow-[0_16px_28px_-12px_rgb(185_127_31/0.8)] hover:-translate-y-0.5 hover:bg-terra-deep hover:text-white active:scale-[0.98]`}
                  >
                    {order.submit} — {selected.sizeBn}
                  </button>
                </form>
              )}
            </div>
            <div className="relative flex flex-col justify-center overflow-hidden px-7 py-10 sm:px-9">
              <div className="absolute inset-0">
                <Image src="/baaric-wood.jpg" alt="" fill className="object-cover opacity-75" />
                <div className="absolute inset-0 bg-cream/60" />
              </div>
              <div className="relative">
                <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-terra-deep">{order.eyebrow}</p>
                <h2 className="mt-2 font-display text-[28px] font-bold leading-snug text-cocoa sm:text-[32px]">
                  {order.heading}
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-cocoa-soft">{order.subtext}</p>
                <div className="mt-7 flex items-center gap-4 rounded-lg bg-white/85 p-4 shadow-[0_16px_30px_-20px_rgb(74_46_27/0.5)]">
                  <div className="h-24 w-20 shrink-0 overflow-hidden rounded-md bg-white">
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
                    <p className="font-display text-[18px] font-bold leading-snug text-cocoa">{selected.name}</p>
                    <p className="mt-1 text-[14px] text-cocoa-soft">
                      {selected.variant} · {selected.sizeBn} ({selected.sizeMl})
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-cocoa-soft">পরিমাণ</span>
                      <button
                        type="button"
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        aria-label="পরিমাণ কমান"
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-white text-[16px] text-cocoa transition hover:border-gold hover:text-terra-deep"
                      >
                        −
                      </button>
                      <span className="min-w-5 text-center text-[15px] font-bold text-cocoa">
                        {qty.toLocaleString("bn-BD")}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty((q) => Math.min(10, q + 1))}
                        aria-label="পরিমাণ বাড়ান"
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-white text-[16px] text-cocoa transition hover:border-gold hover:text-terra-deep"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <p className="mt-4 rounded-lg bg-rose-soft/60 px-4 py-3 text-[13.5px] leading-relaxed text-cocoa-soft">
                  {order.note}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer: deep wood brown, gold rule on top. ── */}
      <footer className="border-t-4 border-gold bg-wood-dark py-12 text-cream">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-display text-[28px] font-bold leading-none">Baaric</p>
              <p className="mt-2 text-[15px] text-cream/70">{site.tagline}</p>
              <p className="mt-4 text-[13px] text-cream/50">{site.contactNote}</p>
            </div>
            <nav className="flex flex-col gap-2.5 text-[15px] font-medium text-cream/80">
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
          <div className="mt-10 border-t border-cream/15 pt-6 text-[13px] text-cream/50">
            © ২০২৬ Baaric · All rights reserved. Developed by{" "}
            <a href="https://jnx-dev.vercel.app" target="_blank" rel="noreferrer" className="font-semibold text-cream/80 hover:text-gold">
              JNX
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
