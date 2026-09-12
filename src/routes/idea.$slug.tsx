import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { getIdeaBySlug } from "../lib/ideas.functions";
import { SiteShell } from "../components/site-shell";
import { IdeaCard } from "../components/idea-card";
import { Reveal } from "../components/reveal";

export const Route = createFileRoute("/idea/$slug")({
  loader: async ({ params }) => {
    const data = await getIdeaBySlug({ data: { slug: params.slug } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const idea = loaderData?.idea;
    return {
      meta: [
        { title: idea ? `${idea.seoTitle || idea.title} — BBI` : "Blueprint — BBI" },
        {
          name: "description",
          content: idea?.metaDescription || idea?.summary || "",
        },
      ],
    };
  },
  component: IdeaPage,
});

function IdeaPage() {
  const { idea, related, relatedCategories } = Route.useLoaderData();

  /* The four questions, in the order the product defines them. Each renders
     only when the column behind it holds something — an idea the enrichment
     pipeline has not reached yet simply shows fewer blocks, never a heading
     over an empty space. */
  const answers = [
    { n: "01", title: "Who actually pays you", body: idea.targetCustomer },
    { n: "02", title: "How the money works", body: idea.howYouMakeMoney },
    { n: "03", title: "The opportunity", body: idea.marketOpportunity },
    { n: "04", title: "Your edge", body: idea.competitionEdge },
  ].filter((a) => a.body.trim());

  const facts = [
    { label: "Startup cost", value: idea.startupCost },
    { label: "Income potential", value: idea.incomePotential },
    { label: "Time to first customer", value: idea.timeToFirstCustomer },
  ].filter((f) => f.value.trim());

  return (
    <SiteShell>
      <article>
        <section className="relative overflow-hidden px-4 pt-32 pb-16 sm:pt-44">
          <div aria-hidden className="grid-field grid-field-fade absolute inset-0" />

          <div className="relative mx-auto max-w-4xl">
            <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-ink-faint">
              <Link to="/" className="transition-colors hover:text-coral">
                Home
              </Link>
              <span>/</span>
              <Link
                to="/category/$categorySlug"
                params={{ categorySlug: idea.categorySlug }}
                className="transition-colors hover:text-coral"
              >
                {idea.categoryName}
              </Link>
            </nav>

            <Reveal>
              <Link
                to="/category/$categorySlug"
                params={{ categorySlug: idea.categorySlug }}
                className="pill-quiet rounded-full"
              >
                {idea.categoryName}
              </Link>

              <h1 className="t-display mt-6">{idea.title}</h1>

              {idea.businessDescription ? (
                <p className="t-lead mt-6 max-w-2xl text-lg">{idea.businessDescription}</p>
              ) : null}
            </Reveal>

            {typeof idea.trendScore === "number" ? (
              <Reveal delay={100}>
                <div className="card mt-10 max-w-sm p-6">
                  <div className="flex items-baseline justify-between">
                    <span className="t-eyebrow">Momentum</span>
                    <span className="text-3xl font-extrabold tabular-nums">{idea.trendScore}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/8">
                    <div
                      className="h-full rounded-full bg-coral"
                      style={{ width: `${Math.max(0, Math.min(100, idea.trendScore))}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-ink-faint">
                    Demand signal for this specific niche, not the category.
                  </p>
                </div>
              </Reveal>
            ) : null}
          </div>
        </section>

        {idea.summary ? (
          <section className="px-4 pb-16">
            <div className="mx-auto max-w-4xl">
              <Reveal>
                <p className="t-eyebrow">The breakdown</p>
                <p className="mt-4 text-xl leading-relaxed">{idea.summary}</p>
              </Reveal>
            </div>
          </section>
        ) : null}

        {answers.length > 0 ? (
          <section className="bg-peri-wash px-4 py-20">
            <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
              {answers.map((a, i) => (
                <Reveal key={a.n} delay={i * 70}>
                  <div className="card h-full p-8">
                    <p className="text-sm font-semibold text-coral tabular-nums">{a.n}</p>
                    <h2 className="t-card mt-3">{a.title}</h2>
                    <p className="t-lead mt-3">{a.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}

        {idea.pros.length > 0 || idea.cons.length > 0 ? (
          <section className="px-4 py-20">
            <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2">
              {idea.pros.length > 0 ? (
                <Reveal>
                  <h2 className="t-card">Why it works</h2>
                  <ul className="mt-5 space-y-3">
                    {idea.pros.map((p) => (
                      <li key={p} className="flex gap-3">
                        <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                        <span className="t-lead">{p}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ) : null}

              {idea.cons.length > 0 ? (
                <Reveal delay={80}>
                  <h2 className="t-card">What will hurt</h2>
                  <ul className="mt-5 space-y-3">
                    {idea.cons.map((c) => (
                      <li key={c} className="flex gap-3">
                        <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-faint" />
                        <span className="t-lead">{c}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ) : null}
            </div>
          </section>
        ) : null}

        {idea.verdict ? (
          <section className="px-4 pb-20">
            <div className="mx-auto max-w-5xl">
              <Reveal>
                <div className="rounded-[var(--radius-block)] bg-night px-7 py-12 text-white sm:px-12">
                  <p className="t-eyebrow text-white/45">The verdict</p>
                  <p className="mt-5 max-w-3xl text-2xl leading-snug font-semibold sm:text-3xl">
                    {idea.verdict}
                  </p>
                </div>
              </Reveal>
            </div>
          </section>
        ) : null}

        {facts.length > 0 ? (
          <section className="px-4 pb-20">
            <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label} className="card p-7">
                  <p className="t-eyebrow">{f.label}</p>
                  <p className="mt-3 font-medium">{f.value}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {idea.gettingStartedSteps.length > 0 ? (
          <section className="px-4 pb-20">
            <div className="mx-auto max-w-4xl">
              <Reveal>
                <h2 className="t-section">
                  How to <span className="accent">start.</span>
                </h2>
                <ol className="mt-10">
                  {idea.gettingStartedSteps.map((step, i) => (
                    <li key={step} className="flex gap-6 border-b border-rule py-6">
                      <span className="text-sm font-semibold text-coral tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="t-lead text-ink">{step}</span>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </section>
        ) : null}

        {idea.toolsNeeded.length > 0 ? (
          <section className="px-4 pb-20">
            <div className="mx-auto max-w-4xl">
              <h2 className="t-card">What you need</h2>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {idea.toolsNeeded.map((t) => (
                  <span key={t} className="pill-quiet rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {idea.faq.length > 0 ? (
          <section className="px-4 pb-20">
            <div className="mx-auto max-w-4xl">
              <h2 className="t-section">
                Questions <span className="accent">people ask.</span>
              </h2>
              <dl className="mt-10">
                {idea.faq.map((f) => (
                  <div key={f.q} className="border-b border-rule py-6">
                    <dt className="text-lg font-semibold">{f.q}</dt>
                    <dd className="t-lead mt-2.5">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        ) : null}

        {idea.externalLinks.length > 0 ? (
          <section className="px-4 pb-20">
            <div className="mx-auto max-w-4xl">
              <h2 className="t-card">Useful resources</h2>
              <ul className="mt-5 space-y-2.5">
                {idea.externalLinks.map((l) => (
                  <li key={l.url}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-ink-soft transition-colors hover:text-coral"
                    >
                      {l.label}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="px-4 pb-20">
            <div className="mx-auto max-w-6xl">
              <h2 className="t-section">
                More in <span className="accent">{idea.categoryName}.</span>
              </h2>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <IdeaCard key={r.ideaId} idea={r} />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {relatedCategories.length > 0 ? (
          <section className="px-4 pb-24">
            <div className="mx-auto max-w-6xl">
              <p className="t-eyebrow">Other categories worth a look</p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {relatedCategories.map((c) => (
                  <Link
                    key={c.categorySlug}
                    to="/category/$categorySlug"
                    params={{ categorySlug: c.categorySlug }}
                    className="pill-quiet rounded-full"
                  >
                    {c.categoryName}
                    <span className="text-ink-faint tabular-nums">{c.ideaCount}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </article>
    </SiteShell>
  );
}
