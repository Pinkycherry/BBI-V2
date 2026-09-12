import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { z } from "zod";

import { searchIdeas } from "../lib/ideas.functions";
import { SiteShell } from "../components/site-shell";
import { IdeaCard } from "../components/idea-card";

export const Route = createFileRoute("/search")({
  validateSearch: z.object({ q: z.string().optional() }),
  head: () => ({
    meta: [{ title: "Search the library — BBI" }, { name: "robots", content: "noindex" }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const [term, setTerm] = useState(q ?? "");

  const { data: results, isFetching } = useQuery({
    queryKey: ["search", q ?? ""],
    queryFn: () => searchIdeas({ data: { q: q ?? "" } }),
    enabled: Boolean(q && q.trim()),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void navigate({ search: { q: term.trim() } });
  }

  return (
    <SiteShell>
      <section className="px-4 pt-32 pb-12 sm:pt-44">
        <div className="mx-auto max-w-3xl">
          <h1 className="t-display">
            Search
            <br />
            <span className="accent">every blueprint.</span>
          </h1>

          <form onSubmit={onSubmit} className="mt-10">
            <div className="flex items-center gap-3 rounded-full border border-rule bg-paper px-6 py-3">
              <Search className="h-5 w-5 shrink-0 text-ink-faint" />
              <label htmlFor="q" className="sr-only">
                Search the library
              </label>
              <input
                id="q"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="zero investment, SaaS, work from home…"
                className="w-full bg-transparent py-2 text-lg focus:outline-none"
              />
              <button type="submit" className="pill pill-coral shrink-0">
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto max-w-6xl">
          {isFetching ? <p className="t-lead">Searching…</p> : null}

          {results && results.length > 0 ? (
            <>
              <p className="t-eyebrow mb-6">
                {results.length} {results.length === 1 ? "result" : "results"} for “{q}”
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((idea) => (
                  <IdeaCard key={idea.ideaId} idea={idea} />
                ))}
              </div>
            </>
          ) : null}

          {results && results.length === 0 && !isFetching ? (
            <p className="t-lead">
              Nothing matched “{q}”. Try a broader word — a category name, or the kind of work
              rather than the exact business.
            </p>
          ) : null}
        </div>
      </section>
    </SiteShell>
  );
}
