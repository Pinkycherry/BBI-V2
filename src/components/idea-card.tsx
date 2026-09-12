import { Link } from "@tanstack/react-router";

import type { IdeaCard as IdeaCardData } from "../lib/ideas-shared";

/**
 * One blueprint, as a card.
 *
 * `trendScore` is a single real number from the `trend_score` column — it is
 * rendered as a number and a bar, never as a fabricated trend line.
 */
export function IdeaCard({ idea, tone = "light" }: { idea: IdeaCardData; tone?: "light" | "dark" }) {
  const dark = tone === "dark";

  return (
    <Link
      to="/idea/$slug"
      params={{ slug: idea.slug }}
      className={`card-lift group flex flex-col rounded-[var(--radius-card)] p-6 ${
        dark ? "bg-night-2" : "card"
      }`}
    >
      <p className={`text-sm font-medium ${dark ? "text-coral-soft" : "text-coral"}`}>
        {idea.categoryName}
      </p>

      <h3 className={`t-card mt-2.5 ${dark ? "text-white" : "text-ink"}`}>{idea.title}</h3>

      {idea.summary ? (
        <p className={`mt-3 line-clamp-4 text-[0.95rem] leading-relaxed ${dark ? "text-white/65" : "text-ink-soft"}`}>
          {idea.summary}
        </p>
      ) : null}

      {typeof idea.trendScore === "number" ? (
        <div className="mt-6 pt-5">
          <div className="flex items-center justify-between text-sm">
            <span className={dark ? "text-white/55" : "text-ink-faint"}>Momentum</span>
            <span className={`font-semibold tabular-nums ${dark ? "text-white" : "text-ink"}`}>
              {idea.trendScore}
            </span>
          </div>
          <div className={`mt-2 h-1.5 overflow-hidden rounded-full ${dark ? "bg-white/12" : "bg-black/8"}`}>
            <div
              className="h-full rounded-full bg-coral"
              style={{ width: `${Math.max(0, Math.min(100, idea.trendScore))}%` }}
            />
          </div>
        </div>
      ) : null}
    </Link>
  );
}
