"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { faqs, hero, intro, marquee, order, reviews, site, variants, why } from "@/data/site";

const fade = "transition-all duration-300 ease-out";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [variantId, setVariantId] = useState("massage-150");
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [done, setDone] = useState(false);
  const [orderId, setOrderId] = useState("");

  const selected = variants.find((v) => v.id === variantId) ?? variants[1];

  // ── Reviews slider: auto-advances right-to-left, infinite.
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
    ["#why", "কেন Baaric"],
    ["#reviews", "রিভিউ"],
    ["#faq", "জিজ্ঞাসা"],
  ];

  return (
    <main className="min-h-screen">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-8">
          <a href="#" className="flex items-baseline gap-2">
            <span className="font-display text-[26px] font-bold leading-none tracking-tight text-leaf">
              Baaric
            </span>
            <span className="font-display text-[15px] text-terra-deep">বারিক</span>
          </a>
          <nav className="hidden items-center gap-8 text-[15px] font-medium text-cocoa-soft lg:flex">
            {navLinks.map(([href, label]) => (
              <a key={href} href={href} className={`${fade} hover:text-terra`}>
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#order"
              className={`${fade} rounded-full bg-terra px-5 py-2.5 text-[15px] font-semibold text-white hover:-translate-y-0.5 hover:bg-terra-deep hover:shadow-[0_10px_20px_-8px_rgb(180_74_42/0.6)] active:scale-95`}
            >
              অর্ডার করুন
            </a>
            <button
              type="button"
              aria-label="মেনু"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-cream text-cocoa lg:hidden"
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
                  className="rounded-xl px-2 py-3 transition-colors hover:bg-cream-deep/60 hover:text-terra"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-10 md:px-8 md:pb-20 md:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="hero-in inline-flex items-center gap-2 rounded-full border border-line bg-white/60 px-4 py-1.5 text-[13px] font-semibold tracking-wide text-leaf">
              <span className="h-2 w-2 rounded-full bg-terra" />
              {hero.eyebrow}
            </p>
            <h1 className="hero-in-delay mt-5 font-display text-[38px] font-bold leading-[1.25] text-cocoa sm:text-[48px] lg:text-[54px]">
              {hero.titleA}{" "}
              <em className="not-italic text-terra-deep">{hero.highlight}</em>
            </h1>
            <p className="hero-in-delay2 mt-5 max-w-lg text-[17px] leading-relaxed text-cocoa-soft">
              {hero.subtext}
            </p>
            <div className="hero-in-delay2 mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#order"
                className={`${fade} rounded-full bg-leaf px-7 py-3.5 text-[16px] font-semibold text-cream hover:-translate-y-0.5 hover:bg-leaf-deep hover:shadow-[0_14px_24px_-10px_rgb(47_74_34/0.7)] active:scale-95`}
              >
                {hero.primaryCta}
              </a>
              <a
                href="#variants"
                className={`${fade} rounded-full border border-cocoa/25 bg-white/50 px-7 py-3.5 text-[16px] font-semibold text-cocoa hover:-translate-y-0.5 hover:border-terra hover:text-terra-deep active:scale-95`}
              >
                {hero.secondaryCta}
              </a>
            </div>
            <p className="hero-in-delay2 mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] font-medium text-cocoa-faint">
              {hero.trust.map((t, i) => (
                <span key={t} className="flex items-center gap-3">
                  {i > 0 && <span className="text-rose">✦</span>}
                  {t}
                </span>
              ))}
            </p>
          </div>

          <div className="hero-in-delay relative mx-auto w-full max-w-[480px]">
            <div className="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-leaf-soft" aria-hidden />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-rose-soft" aria-hidden />
            <div className="relative overflow-hidden rounded-b-[2rem] rounded-t-[999px] border-[6px] border-white shadow-[0_30px_60px_-30px_rgb(59_36_22/0.45)]">
              <Image
                src="/baaric-hero-product.jpg"
                alt="Baaric বেবি অয়েল — ম্যাসাজ অয়েল, কোকোনাট অয়েল ও হেয়ার অয়েল"
                width={1080}
                height={1080}
                priority
                className="aspect-square w-full object-cover"
              />
            </div>
            <div className="animate-float absolute -left-3 top-[30%] rounded-2xl bg-white/95 px-4 py-3 shadow-[0_16px_30px_-14px_rgb(59_36_22/0.4)] sm:-left-8">
              <p className="font-display text-[20px] font-bold leading-none text-leaf">৩টি তেল</p>
              <p className="mt-1 text-[12px] font-medium text-cocoa-soft">ম্যাসাজ · চুল · ত্বক</p>
            </div>
            <div className="animate-float-slow absolute -right-2 bottom-[12%] rounded-full bg-terra px-4 py-2.5 text-[14px] font-semibold text-white shadow-[0_16px_30px_-14px_rgb(180_74_42/0.6)] sm:-right-5">
              ৫০ – ২০০ মিলি
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee strip ── */}
      <div className="overflow-hidden bg-leaf py-3.5" aria-hidden>
        <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap text-[15px] font-semibold text-cream/90">
          {[...marquee, ...marquee, ...marquee, ...marquee].map((w, i) => (
            <span key={i} className="flex items-center gap-8">
              {w} <span className="text-rose">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Intro / story ── */}
      <section id="intro" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 md:px-8">
        <div className="reveal grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-30px_rgb(59_36_22/0.45)]">
              <Image
                src="/baaric-lifestyle.jpg"
                alt="শিশুর ম্যাসাজের মুহূর্ত — বেবি হেয়ার অয়েল ও বেবি ম্যাসাজ অয়েল"
                width={1080}
                height={1080}
                className="aspect-square w-full object-cover"
              />
            </div>
            <p className="relative z-10 -mt-10 ml-5 max-w-[320px] rounded-2xl bg-white/95 px-5 py-4 text-[14px] leading-relaxed text-cocoa-soft shadow-[0_16px_30px_-14px_rgb(59_36_22/0.35)] sm:ml-8">
              {intro.caption}
            </p>
          </div>
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-terra-deep">{intro.eyebrow}</p>
            <h2 className="mt-3 font-display text-[30px] font-bold text-cocoa sm:text-[38px]">{intro.heading}</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-cocoa-soft">{intro.text}</p>
            <div className="mt-8">
              {intro.points.map((p, i) => (
                <div key={p.title} className="flex gap-5 border-t border-line py-5 last:border-b">
                  <span className="font-display text-[22px] font-bold text-rose">{["০১", "০২", "০৩"][i]}</span>
                  <div>
                    <h3 className="font-display text-[19px] font-bold text-cocoa">{p.title}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-cocoa-soft">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Variants ── */}
      <section id="variants" className="scroll-mt-24 bg-cream-deep/50 py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="reveal mx-auto max-w-2xl text-center">
            <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-terra-deep">পণ্য</p>
            <h2 className="mt-3 font-display text-[30px] font-bold text-cocoa sm:text-[38px]">
              আপনার শিশুর জন্য কোনটি?
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-cocoa-soft">
              নিচের যেকোনো একটি বেছে নিন — ছবি, সাইজ আর ব্যবহার একসাথে বদলে যাবে।
            </p>
          </div>

          <div className="reveal mt-12 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
            <div>
              <div className="overflow-hidden rounded-b-[2rem] rounded-t-[10rem] border-[6px] border-white bg-sand shadow-[0_30px_60px_-30px_rgb(59_36_22/0.4)]">
                <Image
                  key={selected.id}
                  src={selected.image}
                  alt={selected.alt}
                  width={900}
                  height={900}
                  className="anim-swap mx-auto h-[440px] w-auto object-contain sm:h-[520px]"
                />
              </div>
              <div className="mt-5 flex justify-center gap-3">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVariantId(v.id)}
                    aria-label={`${v.name} ${v.sizeBn}`}
                    className={`h-16 w-16 overflow-hidden rounded-full border-[3px] transition-all duration-300 ${
                      v.id === selected.id
                        ? "scale-110 border-terra shadow-[0_10px_20px_-8px_rgb(180_74_42/0.6)]"
                        : "border-white opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={v.image} alt="" width={120} height={120} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <p className="inline-flex w-fit items-center gap-2 rounded-full bg-leaf-soft px-4 py-1.5 text-[13px] font-bold text-leaf">
                {selected.variant} · {selected.sizeBn}
              </p>
              <h3 className="mt-4 font-display text-[32px] font-bold leading-tight text-cocoa sm:text-[40px]">
                {selected.name}
              </h3>
              <p className="mt-2 text-[14px] font-medium tracking-wide text-cocoa-faint">{selected.labelEn}</p>
              <p className="mt-4 text-[17px] leading-relaxed text-cocoa-soft">{selected.desc}</p>
              <p className="mt-4 flex items-center gap-2 text-[15px] font-semibold text-leaf">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-leaf-soft text-[13px]">✓</span>
                {selected.use} · {selected.sizeMl}
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVariantId(v.id)}
                    className={`rounded-2xl border-2 px-4 py-3.5 text-left transition-all duration-300 ${
                      v.id === selected.id
                        ? "border-leaf bg-leaf text-cream shadow-[0_14px_24px_-12px_rgb(47_74_34/0.6)]"
                        : "border-line bg-white/70 text-cocoa hover:border-leaf/50"
                    }`}
                  >
                    <span className="block text-[14px] font-bold leading-snug">{v.name}</span>
                    <span className={`mt-0.5 block text-[13px] font-medium ${v.id === selected.id ? "text-cream/80" : "text-cocoa-faint"}`}>
                      {v.variant} · {v.sizeBn}
                    </span>
                  </button>
                ))}
              </div>

              <a
                href="#order"
                className={`${fade} mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-terra px-7 py-3.5 text-[16px] font-semibold text-white hover:-translate-y-0.5 hover:bg-terra-deep active:scale-95`}
              >
                এই প্যাকটি অর্ডার করুন →
              </a>
              <p className="mt-5 text-[13px] leading-relaxed text-cocoa-faint">
                ছবিতে বোতলের আসল প্যাকেজিং ও লেবেল অপরিবর্তিত রাখা হয়েছে — প্রতিটি সাইজের ছবি আলাদা করে তোলা হয়েছে আসল ছবি থেকেই।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Baaric ── */}
      <section id="why" className="scroll-mt-24 bg-leaf-deep py-20 text-cream">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="reveal max-w-2xl">
            <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-rose">{why.eyebrow}</p>
            <h2 className="mt-3 font-display text-[30px] font-bold sm:text-[38px]">{why.heading}</h2>
          </div>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {why.items.map((item) => (
              <div key={item.n} className="reveal border-t-2 border-cream/20 pt-6">
                <p className="font-display text-[34px] font-bold text-rose">{item.n}</p>
                <h3 className="mt-2 font-display text-[20px] font-bold">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-cream/75">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section id="reviews" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 md:px-8">
        <div className="reveal flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-terra-deep">{reviews.eyebrow}</p>
            <h2 className="mt-3 font-display text-[30px] font-bold text-cocoa sm:text-[38px]">{reviews.heading}</h2>
            {reviews.sample && (
              <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-rose-soft px-3 py-1 text-[12px] font-bold text-terra-deep">
                নমুনা রিভিউ — আসল ক্রেতার কথা এলে এখানে বসবে
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={revPrev}
              aria-label="আগের রিভিউ"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-[18px] text-cocoa transition hover:border-terra hover:text-terra-deep"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={revNext}
              aria-label="পরের রিভিউ"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-[18px] text-cocoa transition hover:border-terra hover:text-terra-deep"
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
                className="w-[86%] shrink-0 rounded-[1.75rem] border border-line bg-white p-6 shadow-[0_18px_36px_-24px_rgb(59_36_22/0.35)] sm:w-[47%] lg:w-[31.5%]"
              >
                <p className="text-[17px] tracking-[0.2em] text-gold">★★★★★</p>
                <p className="mt-3 text-[16px] leading-relaxed text-cocoa-soft">“{r.quote}”</p>
                <p className="mt-5 font-display text-[16px] font-bold text-cocoa">{r.name}</p>
                <p className="text-[13px] text-cocoa-faint">{r.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-20 md:px-8">
        <div className="reveal text-center">
          <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-terra-deep">জিজ্ঞাসা</p>
          <h2 className="mt-3 font-display text-[30px] font-bold text-cocoa sm:text-[38px]">সচরাচর জিজ্ঞাসা</h2>
          <p className="mt-3 text-[16px] text-cocoa-soft">যা জানতে চান, সংক্ষেপে — কোনো বাড়তি কথা নয়।</p>
        </div>
        <div className="reveal mt-10">
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
                  <span className={`faq-chevron ${open ? "open" : ""} flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-white text-[18px] text-terra-deep`}>
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
      </section>

      {/* ── Order ── */}
      <section id="order" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-20 md:px-8">
        <div className="reveal overflow-hidden rounded-[2rem] bg-cream-deep/60">
          <div className="grid lg:grid-cols-[1fr_1.1fr]">
            <div className="bg-leaf px-7 py-10 text-cream sm:px-10">
              <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-rose">{order.eyebrow}</p>
              <h2 className="mt-3 font-display text-[28px] font-bold leading-snug sm:text-[34px]">{order.heading}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-cream/80">{order.subtext}</p>

              <div className="mt-8 flex items-center gap-4 rounded-2xl bg-white/10 p-4">
                <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-sand">
                  <Image
                    key={selected.id}
                    src={selected.image}
                    alt={selected.alt}
                    width={160}
                    height={200}
                    className="anim-swap h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-display text-[17px] font-bold leading-snug">{selected.name}</p>
                  <p className="mt-1 text-[13px] text-cream/75">
                    {selected.variant} · {selected.sizeBn} ({selected.sizeMl})
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="পরিমাণ কমান"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-[18px] transition hover:bg-white/25"
                    >
                      −
                    </button>
                    <span className="min-w-6 text-center text-[16px] font-bold">
                      {qty.toLocaleString("bn-BD")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.min(10, q + 1))}
                      aria-label="পরিমাণ বাড়ান"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-[18px] transition hover:bg-white/25"
                    >
                      +
                    </button>
                    <span className="text-[13px] text-cream/75">টি</span>
                  </div>
                </div>
              </div>

              <p className="mt-6 rounded-2xl bg-rose-soft/20 px-4 py-3 text-[13.5px] leading-relaxed text-cream/90">
                {order.note}
              </p>
            </div>

            <div className="px-7 py-10 sm:px-10">
              {done ? (
                <div className="flex h-full flex-col items-start justify-center py-6 text-left">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-leaf text-[26px] text-cream">✓</span>
                  <h3 className="mt-5 font-display text-[26px] font-bold text-cocoa">{order.successTitle}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-cocoa-soft">{order.successText}</p>
                  <p className="mt-5 rounded-2xl bg-white/80 px-5 py-4 text-[15px] leading-relaxed text-cocoa">
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
                    className={`${fade} mt-6 rounded-full border border-cocoa/25 px-6 py-3 text-[15px] font-semibold text-cocoa hover:border-terra hover:text-terra-deep`}
                  >
                    আরেকটি অর্ডার করুন
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="flex flex-col gap-4">
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
                      className="w-full rounded-2xl border border-line bg-white px-4 py-3.5 text-[16px] text-cocoa outline-none transition placeholder:text-cocoa-faint focus:border-terra focus:ring-2 focus:ring-terra/20"
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
                      className="w-full rounded-2xl border border-line bg-white px-4 py-3.5 text-[16px] text-cocoa outline-none transition placeholder:text-cocoa-faint focus:border-terra focus:ring-2 focus:ring-terra/20"
                    />
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
                      className="w-full resize-none rounded-2xl border border-line bg-white px-4 py-3.5 text-[16px] text-cocoa outline-none transition placeholder:text-cocoa-faint focus:border-terra focus:ring-2 focus:ring-terra/20"
                    />
                  </div>
                  <p className="text-[14px] leading-relaxed text-cocoa-soft">
                    নির্বাচিত পণ্য: <strong className="text-cocoa">{selected.name} · {selected.sizeBn}</strong> —{" "}
                    {qty.toLocaleString("bn-BD")} টি
                  </p>
                  <button
                    type="submit"
                    className={`${fade} mt-1 w-full rounded-full bg-terra py-4 text-[17px] font-bold text-white hover:-translate-y-0.5 hover:bg-terra-deep hover:shadow-[0_16px_28px_-12px_rgb(180_74_42/0.7)] active:scale-[0.98]`}
                  >
                    {order.submit} — {selected.sizeBn}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-leaf-deep py-12 text-cream">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-display text-[28px] font-bold leading-none">Baaric</p>
              <p className="mt-2 text-[15px] text-cream/70">{site.tagline}</p>
              <p className="mt-4 text-[13px] text-cream/50">{site.contactNote}</p>
            </div>
            <nav className="flex flex-col gap-2.5 text-[15px] font-medium text-cream/80">
              {navLinks.map(([href, label]) => (
                <a key={href} href={href} className="transition hover:text-rose">
                  {label}
                </a>
              ))}
              <a href="#order" className="transition hover:text-rose">
                অর্ডার করুন
              </a>
            </nav>
          </div>
          <div className="mt-10 border-t border-cream/15 pt-6 text-[13px] text-cream/50">
            © ২০২৬ Baaric · All rights reserved. Developed by{" "}
            <a href="https://jnx-dev.vercel.app" target="_blank" rel="noreferrer" className="font-semibold text-cream/80 hover:text-rose">
              JNX
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
