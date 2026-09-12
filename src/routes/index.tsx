import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  Check,
  ChevronDown,
  Clock,
  Gavel,
  Search,
  Users,
  Wallet,
} from "lucide-react";

import { catalogQuery, getTrendingIdeas, type CategoryNode } from "../lib/ideas.functions";
import { categoryImage, GENERIC } from "../config/category-imagery";
import { SiteShell } from "../components/site-shell";
import { IdeaCard } from "../components/idea-card";
import { WaveDivider } from "../components/wave-divider";
import { Reveal } from "../components/reveal";
import { CountUp } from "../components/count-up";

const trendingQuery = queryOptions({
  queryKey: ["trending"],
  queryFn: () => getTrendingIdeas(),
});

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(catalogQuery),
      context.queryClient.ensureQueryData(trendingQuery),
    ]);
  },
  component: HomePage,
});

/* The reader's path through one blueprint. These are the real sections of an
   idea page, in the order the page renders them — not invented steps. */
const STEPS = [
  { n: "01", label: "Browse" },
  { n: "02", label: "Buyer" },
  { n: "03", label: "Money" },
  { n: "04", label: "Risk" },
  { n: "05", label: "Verdict" },
] as const;

/* Every one of these is a real column on the `ideas` table. */
const FEATURES = [
  { icon: Users, title: "Who actually pays you", body: "A named buyer, not a market segment." },
  { icon: Banknote, title: "How the money works", body: "What you charge and what it costs." },
  { icon: AlertTriangle, title: "What hurts in year one", body: "The obstacle, written down first." },
  { icon: Gavel, title: "Founder-fit verdict", body: "Including “do not build this one.”" },
  { icon: Wallet, title: "Startup cost", body: "What it takes to get off the ground." },
  { icon: Clock, title: "Time to first customer", body: "How long before anyone pays." },
] as const;

const COMPARISON_COLUMNS = [
  "A free ideas listicle",
  "A paid course",
  "Working it out alone",
] as const;

const COMPARISON = [
  {
    n: "01",
    label: "Who pays you",
    others: ["A category, if you're lucky.", "Your homework, after you buy.", "You guess, then find out."],
    bbi: "A named buyer, on every blueprint.",
  },
  {
    n: "02",
    label: "How the money works",
    others: [
      "“Monetise with ads or subscriptions.”",
      "A pricing framework to apply yourself.",
      "Worked out after the first invoice.",
    ],
    bbi: "The actual mechanics, per idea.",
  },
  {
    n: "03",
    label: "Year-one risk",
    others: ["Rarely mentioned.", "Usually the upsell.", "Discovered the expensive way."],
    bbi: "Written down before you start.",
  },
  {
    n: "04",
    label: "When to walk away",
    others: ["Never — the list wants length.", "Never — the course wants a sale.", "Months later, after the spend."],
    bbi: "Stated plainly, idea by idea.",
  },
  {
    n: "05",
    label: "What it costs to read",
    others: ["Your email address.", "Paid up front.", "Your time, then your savings."],
    bbi: "Nothing. No account, no email.",
  },
  {
    n: "06",
    label: "What you leave with",
    others: ["Twenty tabs open.", "A framework, no decision.", "A hunch."],
    bbi: "One real candidate, or a clear no.",
  },
] as const;

const FAQS = [
  {
    q: "Are these real business ideas or just inspiration?",
    a: "Every entry is a researched blueprint, not a topic suggestion. Each one covers what the business actually does day to day, who the specific customer is, how money changes hands, what the realistic obstacles are, and a direct verdict on founder fit. You can evaluate any idea in under ten minutes.",
  },
  {
    q: "Is the whole library free?",
    a: "Yes. Every blueprint is free to read, start to finish. Validating an idea is free too — you use tools you already have, so it costs you nothing extra, ever.",
  },
  {
    q: "How are trend scores calculated?",
    a: "Each idea receives a trend score based on current market demand signals for that specific micro-niche, not the broader category. A high score indicates strong current momentum.",
  },
  {
    q: "Is this useful if I already have a business idea?",
    a: "Yes. Find the closest matching idea and tap Validate. You'll get real research — market size, competitors, and a launch plan — shaped around your own version of the idea, at no extra cost.",
  },
  {
    q: "Can I suggest a business idea to add to the library?",
    a: "Yes. We review suggestions and prioritise based on search demand and founder interest.",
  },
  {
    q: "How often is the library updated?",
    a: "New blueprints are added regularly across all categories. Every new entry appears in the browse page and category listings the moment it is published.",
  },
] as const;

const CHIPS = [
  "Zero investment",
  "Low investment",
  "Passive income",
  "Side hustle",
  "Work from home",
  "Evergreen",
  "AI & automation",
  "Tech & SaaS",
  "FinTech",
  "E-commerce",
  "Education",
  "Health & fitness",
  "Creator & media",
] as const;

function HomePage() {
  const { data: catalog } = useQuery(catalogQuery);
  const { data: trending } = useQuery(trendingQuery);

  const categories = catalog?.categories ?? [];
  const totalIdeas = catalog?.totalIdeas ?? 0;
  const totalCategories = catalog?.totalCategories ?? categories.length;

  return (
    <SiteShell>
      <Hero totalIdeas={totalIdeas} />
      <CategoryMarquee categories={categories} />
      <PhotoStrip categories={categories} />
      <FullBleedCallout totalCategories={totalCategories} />
      <FeatureTicker totalIdeas={totalIdeas} />
      <DarkBand
        totalIdeas={totalIdeas}
        totalCategories={totalCategories}
        trending={trending ?? []}
      />
      <WaveDivider />
      <ComparisonSection />
      <FaqSection />
      <CtaBand />
      <ChipCloud />
      <KeepExploring />
    </SiteShell>
  );
}

/* --------------------------------------------------------- 2. hero -------- */

function Hero({ totalIdeas }: { totalIdeas: number }) {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = term.trim();
    if (q) void navigate({ to: "/search", search: { q } });
  }

  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div aria-hidden className="grid-field grid-field-fade absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-4">
        <Reveal className="reveal-hero">
          <p className="text-center text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.92] font-extrabold tracking-[-0.055em]">
            IDEA<span className="accent">.</span>CHECKED<span className="accent">.</span>
          </p>
        </Reveal>

        {/* The five sections of a blueprint, in page order. */}
        <Reveal delay={80} className="reveal-hero">
          <ol className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10">
            {STEPS.map((s) => (
              <li key={s.n} className="flex items-baseline gap-2">
                <span className="text-xs font-semibold text-coral tabular-nums">{s.n}</span>
                <span className="text-sm font-medium text-ink-soft">{s.label}</span>
              </li>
            ))}
          </ol>
        </Reveal>

        <div className="mt-14 text-center">
          <Reveal delay={120} className="reveal-hero">
            <span className="pill pill-ink max-w-full text-center text-sm whitespace-normal">
              <Check className="h-4 w-4 shrink-0 text-coral" />
              Reviewed before launch by 967 founders
            </span>
          </Reveal>

          <Reveal delay={180} className="reveal-hero">
            <h1 className="t-display mt-7">
              From idea,
              <br />
              <span className="accent">to straight answer.</span>
            </h1>
          </Reveal>

          <Reveal delay={240} className="reveal-hero">
            <p className="mt-7 text-xl font-semibold sm:text-2xl">
              A free library of researched business ideas.
            </p>
            <p className="t-lead mx-auto mt-4 max-w-2xl">
              {totalIdeas > 0 ? `${totalIdeas} blueprints. ` : ""}Who specifically will pay you.
              How the money actually works. What will hurt in year one. And a straight verdict on
              whether you should build it at all.
            </p>
          </Reveal>

          {/* The prompt field: a real search, not a picture of one. */}
          <Reveal delay={300} className="reveal-hero">
            <div className="mt-10 flex flex-col items-center justify-center gap-3 lg:flex-row">
              <Link to="/browse" className="pill pill-coral shrink-0 px-7 py-4 text-base">
                Browse the library
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <form
                onSubmit={onSubmit}
                className="card flex w-full max-w-lg items-center gap-3 rounded-full py-2 pr-2 pl-5"
              >
                <Search className="h-5 w-5 shrink-0 text-ink-faint" />
                <label htmlFor="hero-q" className="sr-only">
                  Search the library
                </label>
                <input
                  id="hero-q"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="business ideas I can start with no money"
                  className="w-full bg-transparent py-2.5 text-[0.95rem] focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-white transition-transform hover:scale-105"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
            <p className="mt-5 text-sm text-ink-faint">
              No account. No email. No payment to read one.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------ 3. category marquee ----- */

function CategoryMarquee({ categories }: { categories: CategoryNode[] }) {
  if (categories.length === 0) return null;
  const loop = [...categories, ...categories];

  return (
    <section className="pb-16 sm:pb-20">
      <p className="t-eyebrow mb-5 text-center">Browse by category</p>
      <div className="marquee marquee-mask overflow-hidden">
        <div className="marquee-track gap-3 pr-3">
          {loop.map((c, i) => (
            <Link
              key={`${c.categorySlug}-${i}`}
              to="/category/$categorySlug"
              params={{ categorySlug: c.categorySlug }}
              className="dim-until-hover flex shrink-0 items-center gap-2 rounded-full border border-rule bg-paper px-5 py-2.5 text-[0.95rem] font-medium hover:border-coral hover:text-coral"
            >
              {c.categoryName}
              <span className="text-sm text-ink-faint tabular-nums">{c.ideaCount}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------- 4. photo strip ------- */

function PhotoStrip({ categories }: { categories: CategoryNode[] }) {
  const picks = categories.slice(0, 6);
  if (picks.length === 0) return null;

  return (
    <section className="pb-20 sm:pb-28">
      <div className="flex gap-3 overflow-x-auto px-4 pt-14 pb-16 sm:gap-4 lg:justify-center">
        {picks.map((c, i) => {
          const img = categoryImage(c.categorySlug);
          return (
            <Link
              key={c.categorySlug}
              to="/category/$categorySlug"
              params={{ categorySlug: c.categorySlug }}
              className={`tilt ${i % 2 === 1 ? "tilt-b" : ""} relative w-[62vw] shrink-0 overflow-hidden rounded-[var(--radius-card)] shadow-[0_18px_40px_-20px_rgb(22_22_26/0.4)] sm:w-[38vw] lg:w-[13.25rem]`}
            >
              <div className="aspect-[3/4]">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pt-10">
                <p className="font-semibold text-white">{c.categoryName}</p>
                <p className="text-sm text-white/75">{c.ideaCount} blueprints</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------------------------------------- 5. full-bleed callout ----- */

function FullBleedCallout({ totalCategories }: { totalCategories: number }) {
  return (
    <section className="relative isolate overflow-hidden px-4 py-28 text-center sm:py-40">
      <img
        src={GENERIC.src}
        alt=""
        aria-hidden
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/55" />

      <Reveal>
        <h2 className="t-section mx-auto max-w-3xl text-white">
          Every category,
          <br />
          <span className="accent">researched the same way.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
          {totalCategories} categories, from zero-investment to SaaS. The same four questions
          answered in every single one.
        </p>
        <Link to="/browse" className="pill pill-coral mt-9 px-7 py-4 text-base">
          See all {totalCategories} categories
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------ 6. feature ticker ------- */

function FeatureTicker({ totalIdeas }: { totalIdeas: number }) {
  /* Duplicated so the track can loop seamlessly at -50%. */
  const sets = [0, 1];

  return (
    <section className="bg-peri-wash py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <div className="grid gap-6 sm:grid-cols-2">
            <h2 className="t-card">Every blueprint names a real buyer.</h2>
            <h2 className="t-card">
              And says <span className="accent">when to walk away.</span>
            </h2>
          </div>
        </Reveal>
      </div>

      <div className="marquee marquee-mask mt-12 overflow-hidden">
        <div className="ticker-track items-start gap-4 pr-4">
          {sets.map((set) => (
            <div key={set} className="flex items-start gap-4" aria-hidden={set === 1}>
              <article className="card w-[21rem] shrink-0 p-7">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft">
                  <span aria-hidden className="h-2 w-2 rounded-full bg-coral" />
                  Live · {totalIdeas} blueprints
                </span>
                <h3 className="t-card mt-4">Momentum, per niche</h3>
                <p className="t-lead mt-3">
                  Every blueprint carries a demand score for its own micro-niche, not the broad
                  category it sits in.
                </p>
              </article>

              {FEATURES.map((f) => (
                <article key={f.title} className="card card-lift w-[17rem] shrink-0 p-6">
                  <f.icon className="h-5 w-5 text-ink-faint" aria-hidden />
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-soft">{f.body}</p>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------- 7 + 8. dark band and stats ----- */

function DarkBand({
  totalIdeas,
  totalCategories,
  trending,
}: {
  totalIdeas: number;
  totalCategories: number;
  trending: Parameters<typeof IdeaCard>[0]["idea"][];
}) {
  return (
    <section className="bg-night px-4 pt-20 pb-24 text-white sm:pt-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-coral/50 px-4 py-2 text-sm text-white/90 shadow-[0_0_30px_-6px_rgb(255_107_69/0.55)]">
            Free for everyone · no card, ever
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="t-section mt-8 max-w-3xl text-white">
            Get the whole library,
            <br />
            <span className="accent">out of the box.</span>
          </h2>
          <p className="t-lead mt-5 max-w-xl text-white/65">
            Validating an idea elsewhere costs money you were going to start the business with.
            Reading here costs nothing, and the verdict is honest even when it&rsquo;s no.
          </p>
        </Reveal>

        <Reveal delay={140}>
          <ul className="mt-7 flex flex-wrap gap-2.5">
            {["Free to read", "No account", "No email"].map((b) => (
              <li key={b} className="pill-dark rounded-full">
                {b}
              </li>
            ))}
          </ul>
          <Link to="/browse" className="pill pill-coral mt-8 px-7 py-4 text-base">
            Browse the library
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Reveal>

        {/* Three real figures. The 967 is a one-time pre-launch count and the
            line beneath says so — it is not presented as a live metric. */}
        <div className="mt-20 text-center">
          <p className="t-eyebrow text-white/45">The story so far</p>
          <div className="mt-8 grid gap-10 sm:grid-cols-3">
            <Stat value={totalIdeas} label="Researched blueprints" />
            <Stat value={totalCategories} label="Categories" />
            <Stat value={967} label="Founders in the pre-launch review group" />
          </div>
          <p className="mt-6 text-sm text-white/40">
            The review group is a one-time count recorded before launch, not a live figure.
          </p>
        </div>

        {trending.length > 0 ? (
          <div className="mt-20">
            <p className="t-eyebrow text-white/45">Highest momentum right now</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trending.slice(0, 6).map((idea) => (
                <IdeaCard key={idea.ideaId} idea={idea} tone="dark" />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="text-6xl font-extrabold tracking-[-0.04em] tabular-nums sm:text-7xl">
        <CountUp value={value} />
      </p>
      <p className="mt-3 text-white/60">{label}</p>
    </div>
  );
}

/* --------------------------------------------- 9. comparison + tabs ------- */

function ComparisonSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="t-section max-w-3xl">
            Your next idea.
            <br />
            <span className="accent">Less guessing.</span>
          </h2>
        </Reveal>

        {/* Tabs pick which comparison column is emphasised. On a phone they
            choose the single column shown, since four will not fit. */}
        <div className="mt-9 flex flex-wrap gap-2.5">
          {COMPARISON_COLUMNS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              className={`pill ${active === i ? "pill-ink" : "pill-quiet"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <Reveal delay={80}>
          <div className="card mt-8 overflow-x-auto">
            <div className="min-w-[48rem]">
              <div className="grid grid-cols-[1.1fr_1fr_1fr_1fr_1.2fr] px-6 pt-7 pb-5 text-sm sm:px-8">
                <p className="text-ink-faint">
                  From idea
                  <br />
                  to decision.
                </p>
                {COMPARISON_COLUMNS.map((label, i) => (
                  <p
                    key={label}
                    className={`pr-4 font-semibold transition-opacity ${
                      active === i ? "opacity-100" : "opacity-45"
                    }`}
                  >
                    {label}
                  </p>
                ))}
                <div className="self-end rounded-t-2xl bg-peri-wash px-4 pt-4 pb-2">
                  <p className="t-eyebrow text-ink-soft">One library</p>
                  <p className="mt-1 text-lg font-extrabold tracking-[-0.04em]">BBI</p>
                </div>
              </div>

              {COMPARISON.map((row, i) => (
                <div
                  key={row.n}
                  className="group grid grid-cols-[1.1fr_1fr_1fr_1fr_1.2fr] px-6 text-[0.95rem] transition-colors hover:bg-black/[0.035] sm:px-8"
                >
                  <div className="py-5 pr-4">
                    <p className="text-sm text-ink-faint tabular-nums">{row.n}</p>
                    <p className="mt-1 font-semibold">{row.label}</p>
                  </div>

                  {row.others.map((cell, j) => (
                    <p
                      key={cell}
                      className={`py-5 pr-4 text-ink-soft transition-opacity ${
                        active === j ? "opacity-100" : "opacity-45"
                      }`}
                    >
                      {cell}
                    </p>
                  ))}

                  <div
                    className={`flex items-start gap-2.5 bg-peri-wash px-4 py-5 ${
                      i === COMPARISON.length - 1 ? "rounded-b-2xl" : ""
                    }`}
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
                    <span className="font-medium">{row.bbi}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- 10. faq ---------- */

function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <h2 className="t-section">
            You got questions?
            <br />
            <span className="accent">We got answers.</span>
          </h2>
        </Reveal>

        <div className="mt-12">
          {FAQS.map((item, i) => (
            <div key={item.q} className="border-b border-rule">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="text-lg font-semibold">{item.q}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-ink-faint transition-transform duration-300 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div className={`acc-panel ${open === i ? "is-open" : ""}`}>
                <div>
                  <p className="t-lead max-w-3xl pb-7">{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------- 11. cta band --------- */

function CtaBand() {
  return (
    <section className="px-4 py-20 text-center sm:py-24">
      <Reveal>
        <h2 className="t-section mx-auto max-w-2xl">
          You bring <span className="accent">the hustle.</span>
        </h2>
        <Link to="/browse" className="pill pill-coral glow mt-9 px-7 py-4 text-base">
          Browse the library
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Reveal>
    </section>
  );
}

/* -------------------------------------------------- 12. chip cloud -------- */

function ChipCloud() {
  return (
    <section className="px-4 pb-20 sm:pb-24">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <h2 className="t-section">
            We bring <span className="accent">the homework.</span>
          </h2>
        </Reveal>

        <div className="mt-9 flex flex-wrap justify-center gap-2.5">
          {CHIPS.map((chip, i) => (
            <Reveal key={chip} delay={i * 25}>
              <span className="pill-quiet rounded-full">{chip}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------- 13. keep exploring -------- */

function KeepExploring() {
  return (
    <section className="px-4 pb-24">
      <div className="mx-auto max-w-6xl border-t border-rule pt-10">
        <p className="t-eyebrow">Keep exploring</p>
        <div className="mt-4 flex flex-wrap gap-x-10 gap-y-3">
          <Link to="/browse" className="nudge underline-wipe inline-flex items-center gap-2 text-lg font-medium">
            Browse every category
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link to="/search" className="nudge underline-wipe inline-flex items-center gap-2 text-lg font-medium">
            Search every blueprint
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
