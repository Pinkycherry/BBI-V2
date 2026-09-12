import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { catalogQuery } from "../lib/ideas.functions";
import { categoryImage } from "../config/category-imagery";
import { SiteShell } from "../components/site-shell";
import { Reveal } from "../components/reveal";

export const Route = createFileRoute("/browse")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  head: () => ({
    meta: [
      { title: "Browse every category — BBI" },
      {
        name: "description",
        content:
          "Every category in the BBI library of researched business ideas, from zero-investment to SaaS.",
      },
    ],
  }),
  component: BrowsePage,
});

function BrowsePage() {
  const { data: catalog } = useQuery(catalogQuery);
  const categories = catalog?.categories ?? [];

  return (
    <SiteShell>
      <section className="px-4 pt-32 pb-16 sm:pt-44">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="t-eyebrow">The catalogue</p>
            <h1 className="t-display mt-4 max-w-3xl">
              Every category,
              <br />
              <span className="accent">end to end.</span>
            </h1>
            <p className="t-lead mt-6 max-w-xl">
              {catalog?.totalIdeas ?? 0} researched blueprints across{" "}
              {catalog?.totalCategories ?? categories.length} categories. Free to read, all of
              them.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => {
            const img = categoryImage(c.categorySlug);
            return (
              <Reveal key={c.categorySlug} delay={Math.min(i, 8) * 50}>
                <Link
                  to="/category/$categorySlug"
                  params={{ categorySlug: c.categorySlug }}
                  className="card card-lift group block h-full overflow-hidden"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-cream-deep">
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="t-card">{c.categoryName}</h2>
                    <p className="mt-2 text-ink-faint">
                      {c.ideaCount} {c.ideaCount === 1 ? "blueprint" : "blueprints"}
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
    </SiteShell>
  );
}
