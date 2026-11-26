// ─────────────────────────────────────────────────────────────
// Baaric — শিশুর প্রাকৃতিক বেবি অয়েল
// All editable site content lives here.
// ─────────────────────────────────────────────────────────────
// HONEST NOTES (do not invent):
// • NO price, delivery charge, COD or delivery-time claim anywhere
//   on the site — none was supplied. The order form collects an
//   order request; price + delivery are confirmed on the call.
// • Photos (Nov 25, 3rd round): hero is the 3-bottle composition the user
//   re-sent (1720x1280); details image is the white-bg 3-bottle shot
//   (brand-style, made from the real product). HONEST: the details
//   image's hair-oil bottle reads "100 ml" in its small print (AI
//   inconsistency) while the site lists Hair Oil 150 ml; the massage-50
//   single's small label text is still MIXED (hair-oil words under
//   "Baby Massage Oil"). The bottles' real "maate" labels are kept.
// • Sizes (user, Nov 25 evening): THREE options only — Massage 50 ml,
//   Hair 150 ml, Coconut 200 ml. The real Massage 150 ml size was
//   REMOVED from the selector + order form on the user's instruction;
//   add it back if he asks. Reviews are SAMPLES; no prices anywhere.
// • Sizes are read off the bottle labels:
//   Massage Oil 50 ml + 150 ml, Hair Oil 150 ml, Coconut Oil 200 ml.
// • Reviews below are SAMPLE quotes — replace with real ones.
// • Contact details are not yet supplied — the footer shows
//   "যোগাযোগের তথ্য শীঘ্রই আসছে" until they are filled in.
// ─────────────────────────────────────────────────────────────

export const site = {
  brand: "Baaric",
  brandBn: "বারিক",
  tagline: "শিশুর কোমল যত্নের প্রাকৃতিক তেল",
  description:
    "Baaric — শিশুর ত্বক ও চুলের জন্য কোমল, প্রাকৃতিক বেবি অয়েল। ম্যাসাজ অয়েল, হেয়ার অয়েল আর কোল্ড-প্রেসড কোকোনাট অয়েল — প্রতিদিনের যত্নে।",
  contactNote: "যোগাযোগের তথ্য শীঘ্রই আসছে",
  contact: { email: "", phone: "", address: "" },
} as const;

export const hero = {
  eyebrow: "প্রাকৃতিক বেবি অয়েল",
  titleA: "শিশুর কোমল যত্ন,",
  highlight: "প্রাকৃতিকভাবে",
  subtext:
    "ম্যাসাজ, হেয়ার আর কোকোনাট অয়েল — প্রতিদিনের কোমল যত্নে।",
  primaryCta: "অর্ডার করুন",
  secondaryCta: "পণ্য দেখুন",
  trust: ["আসল প্যাকেজিং", "লেবেলে লেখা উপাদান", "কোমল, প্রতিদিনের ব্যবহার"],
} as const;

export const marquee = [
  "কোল্ড-প্রেসড",
  "প্রাকৃতিক",
  "কোমল যত্ন",
  "ত্বকের আর্দ্রতা",
  "চুলের যত্ন",
  "ম্যাসাজের সময়",
] as const;

export const intro = {
  eyebrow: "পণ্যের বিবরণ",
  heading: "ম্যাসাজের সময়টাই শিশুর সবচেয়ে প্রিয় সময়",
  points: [
    { title: "ম্যাসাজ", text: "ডালিম ও ননী — সুস্থ বৃদ্ধি ও পুষ্টির জন্য।" },
    { title: "চুলের যত্ন", text: "গুড়হাল ও ভৃঙ্গরাজ — চুলের বৃদ্ধি ও মাথার ত্বকের যত্নে।" },
    { title: "ত্বকের আর্দ্রতা", text: "এক্সট্রা-ভার্জিন কোল্ড-প্রেসড কোকোনাট — ত্বক ও চুলের আর্দ্রতায়।" },
  ],
} as const;

export type Variant = {
  id: string;
  name: string;
  labelEn: string;
  variant: string;
  sizeBn: string;
  sizeMl: string;
  image: string;
  alt: string;
  desc: string;
  use: string;
};

export const variants: Variant[] = [
  {
    id: "massage-50",
    name: "বেবি ম্যাসাজ অয়েল",
    labelEn: "Pomegranate and Noni · Healthy Growth & Nourishment",
    variant: "ম্যাসাজ",
    sizeBn: "৫০ মিলি",
    sizeMl: "50 ml",
    image: "/baaric-cut-massage.png",
    alt: "বেবি ম্যাসাজ অয়েল — ৫০ মিলি বোতল",
    desc: "প্রতিদিনের ম্যাসাজের জন্য — ডালিম ও ননী।",
    use: "ম্যাসাজের সময় ব্যবহার করুন",
  },
  {
    id: "hair-150",
    name: "বেবি হেয়ার অয়েল",
    labelEn: "Gurhal and Bhringraj · Hair Growth & Scalp Conditioning",
    variant: "চুলের যত্ন",
    sizeBn: "১৫০ মিলি",
    sizeMl: "150 ml",
    image: "/baaric-cut-hair.png",
    alt: "বেবি হেয়ার অয়েল — ১৫০ মিলি বোতল",
    desc: "গুড়হাল ও ভৃঙ্গরাজ — চুলের বৃদ্ধি ও মাথার ত্বকের যত্নে।",
    use: "চুলে আলতো করে লাগান",
  },
  {
    id: "coconut-200",
    name: "অর্গানিক কোকোনাট অয়েল",
    labelEn: "Extra-Virgin Cold-Pressed · Nourishes and Moisturises Skin & Hair",
    variant: "ত্বক ও চুল",
    sizeBn: "২০০ মিলি",
    sizeMl: "200 ml",
    image: "/baaric-cut-coconut.png",
    alt: "অর্গানিক কোকোনাট অয়েল — ২০০ মিলি বোতল",
    desc: "এক্সট্রা-ভার্জিন কোল্ড-প্রেসড — ত্বক ও চুলের আর্দ্রতায়।",
    use: "ত্বক ও চুলে ব্যবহার করুন",
  },
];

// Ingredients — read off the real bottle labels (Round 8).
export const ingredients = [
  { name: "ডালিম", en: "Pomegranate", note: "ম্যাসাজ অয়েলে — সুস্থ বৃদ্ধি ও পুষ্টির জন্য।" },
  { name: "নোনি", en: "Noni", note: "ম্যাসাজ অয়েলে — ডালিমের সঙ্গে, সুস্থ বৃদ্ধি ও পুষ্টির জন্য।" },
  { name: "গুরহাল", en: "Gurhal", note: "হেয়ার অয়েলে — চুলের বৃদ্ধির জন্য।" },
  { name: "ভৃঙ্গরাজ", en: "Bhringraj", note: "হেয়ার অয়েলে — মাথার ত্বকের যত্নের জন্য।" },
] as const;

export const formula = {
  heading: "প্রাকৃতিক ফর্মুলা",
  text: "তিনটি আসল তেল — ম্যাসাজ, হেয়ার আর কোকোনাট। লেবেলে যা লেখা, বোতলে তাই।",
} as const;

// SAMPLE reviews — replace with real customer words.
export const reviews = {
  eyebrow: "গ্রাহকের প্রতিক্রিয়া",
  heading: "গ্রাহকরা যা বললেন",
  sample: true,
  items: [
    { name: "আয়েশা র.", role: "সন্তুষ্ট ক্রেতা · নমুনা", quote: "প্রতিদিন ম্যাসাজের সময় তেলটা ব্যবহার করি — শিশুর ত্বক নরম থাকে, আর গন্ধটাও হালকা, মিষ্টি।" },
    { name: "তানভীর হ.", role: "সন্তুষ্ট ক্রেতা · নমুনা", quote: "হেয়ার অয়েলটা চুলে দিলে চুল নরম হয়, মাথার ত্বকও শুকায় না। প্যাকেজিংটাও খুব সুন্দর।" },
    { name: "নুসরাত জ.", role: "সন্তুষ্ট ক্রেতা · নমুনা", quote: "কোকোনাট অয়েলটা ত্বকে আর চুলে দুই জায়গাতেই ব্যবহার করি। এক বোতলেই অনেক কাজ হয়।" },
    { name: "রাফি ক.", role: "সন্তুষ্ট ক্রেতা · নমুনা", quote: "ম্যাসাজ অয়েলটা প্রথমে নিয়েছিলাম, ভালো লাগায় হেয়ার অয়েলটাও নিলাম। ডেলিভারি নিয়েও কোনো ঝামেলা হয়নি।" },
    { name: "মেহজাবিন স.", role: "সন্তুষ্ট ক্রেতা · নমুনা", quote: "ম্যাসাজের সময় শিশুটা শান্ত হয়ে যায় — এই রুটিনটা এখন আমাদের দুজনেরই প্রিয়।" },
    { name: "আরিফ ম.", role: "সন্তুষ্ট ক্রেতা · নমুনা", quote: "তিনটি তেল একসাথে পেয়ে সুবিধা হয়েছে। প্রতিটা বোতলের লেবেল পরিষ্কার, কী কী আছে বোঝা যায়।" },
  ],
} as const;

export const faqs = [
  {
    q: "কোন তেলটা কিসের জন্য?",
    a: "ম্যাসাজ অয়েল — প্রতিদিনের ম্যাসাজের জন্য। হেয়ার অয়েল — চুলের বৃদ্ধি আর মাথার ত্বকের যত্নের জন্য। কোকোনাট অয়েল — ত্বক ও চুলের আর্দ্রতার জন্য। বোতলের লেবেলেই প্রতিটার ব্যবহার লেখা আছে।",
  },
  {
    q: "দাম কত? কীভাবে জানব?",
    a: "দাম ও ডেলিভারি চার্জ অর্ডারের পর কল করে নিশ্চিত করা হয়। নিচের ফর্মে অর্ডার দিন — আমরা কল করে দাম, ডেলিভারি আর আপনার পছন্দের প্যাকটি কনফার্ম করব।",
  },
  {
    q: "অর্ডার কীভাবে করব?",
    a: "নিচের অর্ডার ফর্মে আপনার নাম, ফোন নম্বর আর ঠিকানা দিন, পছন্দের তেল আর পরিমাণ বেছে নিন। সাবমিট করলেই অর্ডারটি জমা হবে — তারপর আমরা কল করে কনফার্ম করব।",
  },
  {
    q: "ছবির বোতলে অন্য নাম লেখা কেন?",
    a: "বোতলগুলো আসল পণ্যের — ছবিগুলো আসল পণ্য দেখে বানানো ব্র্যান্ড-স্টাইল ছবি, লেবেলের নাম অপরিবর্তিত। ওয়েবসাইটের ব্র্যান্ড Baaric।",
  },
] as const;

export const order = {
  eyebrow: "অর্ডার করুন",
  heading: "শিশুর যত্নের তেলটি অর্ডার করুন",
  subtext: "ফর্মটি পূরণ করুন — আমরা কল করে দাম ও ডেলিভারি নিশ্চিত করব।",
  note: "দাম ও ডেলিভারি চার্জ কল করে নিশ্চিত করা হবে — এখানে কোনো দাম দেওয়া হয়নি।",
  submit: "অর্ডার কনফার্ম করুন",
  successTitle: "অর্ডার জমা হয়েছে — ধন্যবাদ!",
  successText: "শীঘ্রই আমরা কল করে আপনার অর্ডারটি কনফার্ম করব — দাম ও ডেলিভারি তখন জানিয়ে দেওয়া হবে।",
} as const;
