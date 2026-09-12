import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";

import { catalogQuery } from "../lib/ideas.functions";
import { subscribeToNewsletter } from "../lib/newsletter.functions";

/**
 * Email capture at the top, four link columns beneath, copyright last.
 *
 * The signup writes to the real `newsletter_signups` table — a Subscribe
 * button that does nothing is worse than no button at all.
 */
export function SiteFooter() {
  const { data: catalog } = useQuery(catalogQuery);
  const categories = [...(catalog?.categories ?? [])].sort((a, b) => b.ideaCount - a.ideaCount);
  const firstFive = categories.slice(0, 5);
  const nextFive = categories.slice(5, 10);

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
        <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
            className="w-full rounded-full bg-white/25 px-7 py-5 text-xl font-medium text-white placeholder:text-white/75 focus:outline-none focus-visible:outline-2 focus-visible:outline-white sm:px-8 sm:py-6 sm:text-2xl"
          />
          <button type="submit" className="pill pill-peri shrink-0 justify-center px-8 py-5 text-base">
            {state === "sending" ? "Signing you up…" : "Keep me posted"}
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-4 text-[1.05rem] text-white/90">
          {state === "done" || state === "error"
            ? message
            : "Drop your email and we'll tell you when new blueprints land."}
        </p>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <FooterColumn title="Categories">
            {firstFive.map((c) => (
              <FooterLink key={c.categorySlug} slug={c.categorySlug} label={c.categoryName} />
            ))}
          </FooterColumn>

          <FooterColumn title="More categories">
            {nextFive.map((c) => (
              <FooterLink key={c.categorySlug} slug={c.categorySlug} label={c.categoryName} />
            ))}
          </FooterColumn>

          <FooterColumn title="Library">
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
          </FooterColumn>

          <div>
            <p className="text-sm font-semibold text-white/65">What this is</p>
            <p className="mt-4 max-w-xs text-white/90">
              A free library of researched business ideas. No account, no email, no payment to
              read one.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/25 pt-6 text-sm text-white/80 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Bro Business Ideas · businessidea.io</p>
          <p>Made in India, for everyone starting from zero. We were there too.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-semibold text-white/65">{title}</p>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ slug, label }: { slug: string; label: string }) {
  return (
    <li>
      <Link
        to="/category/$categorySlug"
        params={{ categorySlug: slug }}
        className="text-white/95 transition-opacity hover:opacity-70"
      >
        {label}
      </Link>
    </li>
  );
}
