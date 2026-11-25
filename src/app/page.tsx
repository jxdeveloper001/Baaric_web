"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { faqs, hero, intro, marquee, order, reviews, site, variants } from "@/data/site";

const fade = "transition-all duration-300 ease-out";

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

      {/* ── Hero: the photo in its own shape — never cropped.
           Feathered edges melt it into the band below, where the
           heading + order button sit (same on mobile + desktop). */}
      <section className="bg-herobg">
        <div className="mx-auto max-w-5xl px-3 pt-4 sm:px-6 md:pt-6">
          <div className="[mask-image:linear-gradient(to_bottom,transparent,black_5%,black_88%,transparent_100%)]">
            <div className="[mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
              <Image
                src="/baaric-hero-product.jpg"
                alt="Baaric বেবি অয়েল — ম্যাসাজ অয়েল, কোকোনাট অয়েল ও হেয়ার অয়েল"
                width={1720}
                height={1280}
                priority
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-5 pb-16 pt-4 text-center md:pb-20">
          <p className="hero-in text-[13px] font-bold uppercase tracking-[0.22em] text-terra-deep">
            {hero.eyebrow}
          </p>
          <h1 className="hero-in-delay mx-auto mt-3 font-display text-[38px] font-bold leading-[1.2] text-cocoa sm:text-[52px] md:text-[60px]">
            {hero.titleA}{" "}
            <em className="not-italic text-terra">{hero.highlight}</em>
          </h1>
          <p className="hero-in-delay2 mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-cocoa-soft md:text-[18px]">
            {hero.subtext}
          </p>
          <div className="hero-in-delay2 mt-7 flex justify-center">
            <a
              href="#order"
              className={`${fade} rounded-full bg-terra px-8 py-3.5 text-[16px] font-semibold text-white shadow-[0_14px_28px_-12px_rgb(180_74_42/0.7)] hover:-translate-y-0.5 hover:bg-terra-deep active:scale-95`}
            >
              {hero.primaryCta}
            </a>
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

      {/* ── Product details: photo on top, no border, no frame;
           three round tinted cards below — left, right, bottom. */}
      <section id="intro" className="scroll-mt-24 bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="reveal text-center">
            <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-terra-deep">{intro.eyebrow}</p>
            <h2 className="mx-auto mt-3 max-w-2xl font-display text-[30px] font-bold text-cocoa sm:text-[38px]">
              {intro.heading}
            </h2>
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
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {intro.points.map((pt, i) => (
              <article
                key={pt.title}
                className={`reveal rounded-[2rem] p-7 shadow-[0_22px_44px_-26px_rgb(59_36_22/0.4)] md:p-8 ${
                  i === 2 ? "md:col-span-2 md:mx-auto md:w-full md:max-w-xl" : ""
                } ${["bg-leaf-soft", "bg-rose-soft", "bg-goldsoft"][i]}`}
              >
                <p className="font-display text-[26px] font-bold text-terra-deep">{["০১", "০২", "০৩"][i]}</p>
                <h3 className="mt-1 font-display text-[21px] font-bold text-cocoa">{pt.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-cocoa-soft">{pt.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product selection: one Gheeya-style pack card.
           Top image swaps with the selected size; options, qty,
           checkmarks and the dark order button live in the card. */}
      <section id="variants" className="scroll-mt-24 bg-goldsoft py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <div className="reveal overflow-hidden rounded-[2rem] bg-white shadow-[0_36px_70px_-32px_rgb(59_36_22/0.45)]">
            <div className="bg-white px-6 pt-8">
              <Image
                key={selected.id}
                src={selected.image}
                alt={selected.alt}
                width={900}
                height={900}
                className="anim-swap mx-auto h-[280px] w-auto object-contain sm:h-[320px]"
              />
            </div>
            <div className="px-6 pb-8 pt-6 sm:px-9">
              <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-gold">প্যাক</p>
              <h2 className="mt-2 font-display text-[30px] font-bold leading-tight text-cocoa sm:text-[36px]">
                {selected.name}
              </h2>
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
                      className={`relative rounded-2xl border-2 px-3 py-3.5 text-left transition-all duration-300 sm:px-4 ${
                        active ? "border-gold bg-goldsoft/50" : "border-line bg-white hover:border-gold/50"
                      }`}
                    >
                      <span
                        className={`absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full text-[12px] text-white ${
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

              <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-cream-deep/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-display text-[19px] font-bold whitespace-nowrap text-cocoa">
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
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-[18px] text-cocoa transition hover:border-terra hover:text-terra-deep"
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
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-[18px] text-cocoa transition hover:border-terra hover:text-terra-deep"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl border border-line bg-white px-5 py-4">
                {["আসল প্যাকেজিং", "লেবেলে লেখা উপাদান", "কোমল, প্রতিদিনের", "তিনটি তেল, একসাথে"].map((t) => (
                  <p key={t} className="flex items-center gap-2 text-[14px] font-medium text-cocoa-soft">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold text-[11px] text-white">
                      ✓
                    </span>
                    {t}
                  </p>
                ))}
              </div>

              <a
                href="#order"
                className={`${fade} mt-6 block rounded-full bg-cocoa py-4 text-center text-[17px] font-bold text-white shadow-[0_16px_28px_-12px_rgb(59_36_22/0.7)] hover:-translate-y-0.5 active:scale-[0.98]`}
              >
                অর্ডার করুন — {selected.sizeBn}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section id="reviews" className="scroll-mt-24 bg-peach py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
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
                className="w-[86%] shrink-0 rounded-[1.5rem] border border-line bg-white p-6 shadow-[0_18px_36px_-24px_rgb(59_36_22/0.35)] sm:w-[47%] lg:w-[31.5%]"
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

      {/* ── Order: white card, image + summary on top, form below. */}
      <section id="order" className="scroll-mt-24 bg-sage py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <div className="reveal overflow-hidden rounded-[1.5rem] bg-white shadow-[0_30px_60px_-30px_rgb(59_36_22/0.35)]">
            <div className="px-7 py-9 sm:px-10">
              {done ? (
                <div className="flex flex-col items-start justify-start py-4 text-left">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-leaf text-[26px] text-cream">✓</span>
                  <h3 className="mt-5 font-display text-[26px] font-bold text-cocoa">{order.successTitle}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-cocoa-soft">{order.successText}</p>
                  <p className="mt-5 w-full rounded-2xl bg-cream-deep/60 px-5 py-4 text-[15px] leading-relaxed text-cocoa">
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
                <>
                  <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-terra-deep">{order.eyebrow}</p>
                  <h2 className="mt-2 font-display text-[28px] font-bold leading-snug text-cocoa sm:text-[34px]">
                    {order.heading}
                  </h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-cocoa-soft">{order.subtext}</p>

                  <div className="mt-7 flex items-center gap-4 rounded-2xl bg-cream-deep/60 p-4">
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
                      <p className="font-display text-[18px] font-bold leading-snug text-cocoa">{selected.name}</p>
                      <p className="mt-1 text-[14px] text-cocoa-soft">
                        {selected.variant} · {selected.sizeBn} ({selected.sizeMl})
                      </p>
                      <p className="mt-1 text-[14px] font-semibold text-leaf">
                        পরিমাণ: {qty.toLocaleString("bn-BD")} টি
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 rounded-2xl bg-rose-soft/40 px-4 py-3 text-[13.5px] leading-relaxed text-cocoa-soft">
                    {order.note}
                  </p>

                  <form onSubmit={submit} className="mt-7 flex flex-col gap-4">
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
                </>
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
