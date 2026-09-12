import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowUpRight, Check, ChevronDown } from "lucide-react";

import { catalogQuery, getTrendingIdeas, type CategoryNode } from "../lib/ideas.functions";
import { typeGroups } from "../lib/catalog-display";
import { categoryImage } from "../config/category-imagery";
import { SiteShell } from "../components/site-shell";
import { IdeaCard } from "../components/idea-card";
import { WaveDivider } from "../components/wave-divider";
import { Reveal } from "../components/reveal";

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

/* The four questions every blueprint answers. Taken verbatim from the product
   definition — this is the mechanism, not marketing copy written for a grid. */
const FOUR_ANSWERS = [
  {
    title: "Who specifically will pay you.",
    body: "Not “small businesses”. A named buyer with a reason to hand over money, and where they already are.",
  },
  {
    title: "How the money actually works.",
    body: "What you charge, how often, what it costs you to deliver, and what has to be true for the margin to survive.",
  },
  {
    title: "What will hurt in year one.",
    body: "The part most idea lists skip. The obstacle you hit in month three, written down before you hit it.",
  },
  {
    title: "A straight founder-fit verdict.",
    body: "Including “do not build this one.” A library that never says no is a list, not research.",
  },
] as const;

const COMPARISON = [
  {
    n: "01",
    label: "Who pays you",
    listicle: "A category, if you're lucky.",
    course: "Your homework, after you buy.",
    alone: "You guess, then find out.",
    bbi: "A named buyer, on every blueprint.",
  },
  {
    n: "02",
    label: "How the money works",
    listicle: "“Monetise with ads or subscriptions.”",
    course: "A pricing framework to apply yourself.",
    alone: "Worked out after the first invoice.",
    bbi: "The actual mechanics, per idea.",
  },
  {
    n: "03",
    label: "Year-one risk",
    listicle: "Rarely mentioned.",
    course: "Usually the upsell.",
    alone: "Discovered the expensive way.",
    bbi: "Written down before you start.",
  },
  {
    n: "04",
    label: "When to walk away",
    listicle: "Never — the list wants length.",
    course: "Never — the course wants a sale.",
    alone: "Months later, after the spend.",
    bbi: "Stated plainly, idea by idea.",
  },
  {
    n: "05",
    label: "What it costs to read",
    listicle: "Your email address.",
    course: "Paid up front.",
    alone: "Your time, then your savings.",
    bbi: "Nothing. No account, no email.",
  },
  {
    n: "06",
    label: "What you leave with",
    listicle: "Twenty tabs open.",
    course: "A framework, no decision.",
    alone: "A hunch.",
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
      <CollageSection categories={categories} totalCategories={totalCategories} />
      <FourAnswers />
      <DarkBand
        totalIdeas={totalIdeas}
        totalCategories={totalCategories}
        trending={trending ?? []}
      />
      <WaveDivider />
      <ComparisonSection />
      <FaqSection />
      <ClosingSplit categories={categories} />
    </SiteShell>
  );
}

/* ---------------------------------------------------------------- hero ---- */

function Hero({ totalIdeas }: { totalIdeas: number }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-44 sm:pb-28">
      <div aria-hidden className="grid-field grid-field-fade absolute inset-0" />

      <div className="relative mx-auto max-w-5xl px-4 text-center">
        {totalIdeas > 0 ? (
          <Reveal>
            {/* whitespace-normal so this does not run off a 390px screen,
                which `.pill`'s nowrap default would otherwise cause. */}
            <span className="pill pill-ink max-w-full text-center text-sm whitespace-normal">
              {totalIdeas} researched blueprints · free to read
            </span>
          </Reveal>
        ) : null}

        <Reveal delay={80}>
          <h1 className="t-display mt-7">
            From idea,
            <br />
            <span className="accent">to straight answer.</span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-7 text-xl font-semibold sm:text-2xl">
            A free library of researched business ideas.
          </p>
          <p className="t-lead mx-auto mt-4 max-w-2xl">
            Who specifically will pay you. How the money actually works. What will hurt in year
            one. And a straight verdict on whether you should build it at all.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/browse" className="pill pill-coral">
              Browse the library
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link to="/search" className="pill pill-quiet">
              Search every blueprint
            </Link>
          </div>
          <p className="mt-5 text-sm text-ink-faint">
            No account. No email. No payment to read one.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- marquee ------ */

function CategoryMarquee({ categories }: { categories: CategoryNode[] }) {
  if (categories.length === 0) return null;
  const loop = [...categories, ...categories];

  return (
    <section className="pb-16 sm:pb-24">
      <p className="t-eyebrow mb-5 text-center">Browse by category</p>
      <div className="marquee marquee-mask overflow-hidden">
        <div className="marquee-track gap-3 pr-3">
          {loop.map((c, i) => (
            <Link
              key={`${c.categorySlug}-${i}`}
              to="/category/$categorySlug"
              params={{ categorySlug: c.categorySlug }}
              className="flex shrink-0 items-center gap-2 rounded-full border border-rule bg-paper px-5 py-2.5 text-[0.95rem] font-medium transition-colors hover:border-coral hover:text-coral"
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

/* ----------------------------------------------------------- collage ------ */

/* Hand-placed, not generated. Every mount stays inside the outer quarter of
   the stage on its own side: the heading column sits in the middle and a
   scattered placement kept dropping a photo on top of the words. */
const COLLAGE = [
  "left-[1%] top-[4%] w-[14%] -rotate-6",
  "left-[9%] top-[34%] w-[13%] rotate-3",
  "left-[2%] top-[62%] w-[14%] -rotate-2",
  "right-[1%] top-[5%] w-[14%] rotate-5",
  "right-[9%] top-[35%] w-[13%] -rotate-3",
  "right-[2%] top-[63%] w-[14%] rotate-2",
] as const;

function CollageSection({
  categories,
  totalCategories,
}: {
  categories: CategoryNode[];
  totalCategories: number;
}) {
  const picks = categories.slice(0, 6);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream via-cream to-peri-wash px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="relative flex items-center justify-center lg:min-h-[44rem]">
          <div className="relative z-10 mx-auto max-w-xl text-center">
            <Reveal>
              <h2 className="t-section">
                Every category,
                <br />
                <span className="accent">researched the same way.</span>
              </h2>
              <p className="t-lead mt-5">
                {totalCategories} categories, from zero-investment to SaaS. Same four questions
                answered in every one.
              </p>
              <Link to="/browse" className="pill pill-coral mt-8">
                See all {totalCategories} categories
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          {/* Desktop: mounts pinned to the outer quarter on each side. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
            {picks.map((c, i) => {
              const pos = COLLAGE[i];
              if (!pos) return null;
              const img = categoryImage(c.categorySlug);
              return (
                <div key={c.categorySlug} className={`mount absolute aspect-[3/4] ${pos}`}>
                  <img src={img.src} alt="" loading="lazy" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Phone and tablet: the same photos as a plain, readable strip. */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden">
          {picks.map((c) => {
            const img = categoryImage(c.categorySlug);
            return (
              <Link
                key={c.categorySlug}
                to="/category/$categorySlug"
                params={{ categorySlug: c.categorySlug }}
                className="mount block aspect-[4/5]"
              >
                <img src={img.src} alt={img.alt} loading="lazy" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------ four answers ------ */

function FourAnswers() {
  return (
    <section className="bg-peri-wash px-4 pt-4 pb-20 sm:pb-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="t-section max-w-3xl">
            Every blueprint answers
            <br />
            <span className="accent">the same four things.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {FOUR_ANSWERS.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <article className="card card-lift h-full p-8">
                <p className="text-sm font-semibold text-coral tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="t-card mt-3">{item.title}</h3>
                <p className="t-lead mt-3">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- dark band ------- */

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
            Free to read · no account needed
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="t-section mt-8 max-w-3xl text-white">
            The whole library.
            <br />
            <span className="accent">No paywall to look.</span>
          </h2>
          <p className="t-lead mt-5 max-w-xl text-white/65">
            Validating an idea elsewhere costs money you were going to start the business with.
            Reading here costs nothing, and the verdict is honest even when it&rsquo;s no.
          </p>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <span className="pill-dark rounded-full">No signup</span>
            <span className="pill-dark rounded-full">No email</span>
            <span className="pill-dark rounded-full">No card</span>
          </div>
          <Link to="/browse" className="pill pill-coral mt-8">
            Browse the library
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Reveal>

        {/* Three real figures. The 967 is a one-time pre-launch count and the
            label says so — it is not presented as a live metric. */}
        <div className="mt-20 text-center">
          <p className="t-eyebrow text-white/45">The story so far</p>
          <div className="mt-8 grid gap-10 sm:grid-cols-3">
            <Stat value={totalIdeas > 0 ? String(totalIdeas) : "—"} label="Researched blueprints" />
            <Stat value={totalCategories > 0 ? String(totalCategories) : "—"} label="Categories" />
            <Stat value="967" label="Founders in the pre-launch review group" />
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

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-6xl font-extrabold tracking-[-0.04em] tabular-nums sm:text-7xl">{value}</p>
      <p className="mt-3 text-white/60">{label}</p>
    </div>
  );
}

/* ------------------------------------------------------- comparison ------- */

function ComparisonSection() {
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

        <Reveal delay={80}>
          <div className="card mt-12 overflow-hidden">
            <div className="min-w-[52rem] lg:min-w-0">
              <div className="grid grid-cols-[1.1fr_1fr_1fr_1fr_1.2fr] items-end gap-px px-6 pt-7 pb-5 text-sm sm:px-8">
                <p className="text-ink-faint">
                  From idea
                  <br />
                  to decision.
                </p>
                <p className="font-semibold">A free ideas listicle</p>
                <p className="font-semibold">A paid course</p>
                <p className="font-semibold">Working it out alone</p>
                <div className="rounded-t-2xl bg-peri-wash px-4 pt-4 pb-2">
                  <p className="t-eyebrow text-ink-soft">One library</p>
                  <p className="mt-1 text-lg font-extrabold tracking-[-0.04em]">BBI</p>
                </div>
              </div>

              {COMPARISON.map((row, i) => (
                <div
                  key={row.n}
                  className={`grid grid-cols-[1.1fr_1fr_1fr_1fr_1.2fr] gap-px px-6 text-[0.95rem] sm:px-8 ${
                    i % 2 === 0 ? "bg-black/[0.025]" : ""
                  }`}
                >
                  <div className="py-5 pr-4">
                    <p className="text-sm text-ink-faint tabular-nums">{row.n}</p>
                    <p className="mt-1 font-semibold">{row.label}</p>
                  </div>
                  <p className="py-5 pr-4 text-ink-soft">{row.listicle}</p>
                  <p className="py-5 pr-4 text-ink-soft">{row.course}</p>
                  <p className="py-5 pr-4 text-ink-soft">{row.alone}</p>
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

        <div className="mt-8 flex justify-end">
          <Link to="/browse" className="pill pill-coral">
            Start browsing
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- faq ------- */

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
                  className={`h-5 w-5 shrink-0 text-ink-faint transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i ? <p className="t-lead -mt-1 max-w-3xl pb-7">{item.a}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- closing ------- */

function ClosingSplit({ categories }: { categories: CategoryNode[] }) {
  return (
    <section className="px-4 pt-12 pb-24 sm:pb-32">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2">
        <Reveal>
          <h2 className="t-section">
            You bring
            <br />
            <span className="accent">the hustle.</span>
          </h2>
          <Link to="/browse" className="pill pill-coral mt-8">
            Browse the library
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="t-section">
            We bring
            <br />
            <span className="accent">the homework.</span>
          </h2>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {typeGroups(categories)
              .flatMap((g) => g.categories)
              .map((c) => (
                <Link
                  key={c.categorySlug}
                  to="/category/$categorySlug"
                  params={{ categorySlug: c.categorySlug }}
                  className="pill-quiet rounded-full"
                >
                  {c.categoryName}
                </Link>
              ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
