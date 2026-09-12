import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { getCategoryPage } from "../lib/ideas.functions";
import { categoryImage } from "../config/category-imagery";
import { SiteShell } from "../components/site-shell";
import { IdeaCard } from "../components/idea-card";
import { Reveal } from "../components/reveal";

export const Route = createFileRoute("/category/$categorySlug")({
  loader: async ({ params }) => {
    const page = await getCategoryPage({ data: { categorySlug: params.categorySlug } });
    if (!page.categoryName) throw notFound();
    return page;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.categoryName ?? "Category"} — BBI` },
      {
        name: "description",
        content: `Researched ${loaderData?.categoryName ?? "business"} blueprints: who pays you, how the money works, what hurts in year one, and whether to build it.`,
      },
    ],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { categoryName, categorySlug, ideas } = Route.useLoaderData();
  const img = categoryImage(categorySlug);

  return (
    <SiteShell>
      <section className="px-4 pt-32 pb-14 sm:pt-44">
        <div className="mx-auto max-w-6xl">
          <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-ink-faint">
            <Link to="/" className="transition-colors hover:text-coral">
              Home
            </Link>
            <span>/</span>
            <Link to="/browse" className="transition-colors hover:text-coral">
              Browse
            </Link>
            <span>/</span>
            <span className="text-ink">{categoryName}</span>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <h1 className="t-display">{categoryName}</h1>
              <p className="t-lead mt-6 max-w-xl">{img.description}</p>
              <p className="mt-6 text-ink-faint">
                {ideas.length} {ideas.length === 1 ? "blueprint" : "blueprints"} in this category.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <div className="mount aspect-[4/3]">
                <img src={img.src} alt={img.alt} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto max-w-6xl">
          {ideas.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ideas.map((idea) => (
                <IdeaCard key={idea.ideaId} idea={idea} />
              ))}
            </div>
          ) : (
            <p className="t-lead">
              Nothing published in this category yet. New blueprints appear here the moment they
              go live.
            </p>
          )}

          <div className="mt-14">
            <Link to="/browse" className="pill pill-coral">
              Browse every category
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
