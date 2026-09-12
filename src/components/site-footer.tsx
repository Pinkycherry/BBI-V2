import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";

import { catalogQuery } from "../lib/ideas.functions";
import { topCategories } from "../lib/catalog-display";
import { subscribeToNewsletter } from "../lib/newsletter.functions";

/**
 * One solid block, inset from the page edge so the cream ground frames it.
 *
 * The signup is wired to the real `newsletter_signups` table — a Subscribe
 * button that does nothing is worse than no button at all.
 */
export function SiteFooter() {
  const { data: catalog } = useQuery(catalogQuery);
  const categories = catalog?.categories ?? [];
  const { shown, hiddenCount, hasMore } = topCategories(categories, 5);

  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    try {
      await subscribeToNewsletter({ data: { email, source: "footer" } });
      setState("done");
      setMessage("You're on the list.");
      setEmail("");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Try again.");
    }
  }

  return (
    <footer className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="mx-auto max-w-7xl rounded-[var(--radius-block)] bg-coral px-5 py-10 text-white sm:px-10 sm:py-14">
        <form onSubmit={onSubmit} className="mx-auto max-w-5xl">
          <label htmlFor="footer-email" className="sr-only">
            Your email address
          </label>
          <input
            id="footer-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-full bg-white/25 px-7 py-5 text-2xl font-medium text-white placeholder:text-white/75 focus:outline-none focus-visible:outline-2 focus-visible:outline-white sm:px-9 sm:py-7 sm:text-4xl"
          />

          <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="max-w-md text-[1.05rem] text-white/95">
              {state === "done" || state === "error"
                ? message
                : "Drop your email and we'll tell you when new blueprints land."}
            </p>
            <button type="submit" className="pill pill-peri" disabled={state === "sending"}>
              {state === "sending" ? "Signing you up…" : "Keep me posted"}
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        <div className="mx-auto mt-14 grid max-w-5xl gap-10 sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-white/65">Browse</p>
            <ul className="mt-4 space-y-2.5">
              {shown.map((c) => (
                <li key={c.categorySlug}>
                  <Link
                    to="/category/$categorySlug"
                    params={{ categorySlug: c.categorySlug }}
                    className="text-white/95 transition-opacity hover:opacity-70"
                  >
                    {c.categoryName}
                  </Link>
                </li>
              ))}
              {hasMore ? (
                <li>
                  <Link to="/browse" className="text-white/95 transition-opacity hover:opacity-70">
                    and {hiddenCount} more
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white/65">Library</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link to="/browse" className="text-white/95 transition-opacity hover:opacity-70">
                  All categories
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-white/95 transition-opacity hover:opacity-70">
                  Search every blueprint
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white/65">What this is</p>
            <p className="mt-4 max-w-xs text-white/90">
              A free library of researched business ideas. No account, no email, no payment to
              read one.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-12 flex max-w-5xl flex-col gap-2 border-t border-white/25 pt-6 text-sm text-white/80 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Bro Business Ideas · businessidea.io</p>
          <p>Made in India, for everyone starting from zero. We were there too.</p>
        </div>
      </div>
    </footer>
  );
}
