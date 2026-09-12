import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

/**
 * A floating pill, solid from first paint.
 *
 * It does not flip from transparent to solid on scroll — the reference keeps
 * one white bar the whole way down, and the constant contrast is what lets it
 * ride over both the cream sections and the dark band without restyling.
 */
export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 rounded-full border border-black/5 bg-paper py-2.5 pr-2.5 pl-5 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)] sm:py-3 sm:pr-3 sm:pl-7">
        <Link to="/" className="text-2xl font-extrabold tracking-[-0.06em] sm:text-[1.7rem]">
          BBI
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/browse" className="text-[0.95rem] font-medium transition-colors hover:text-coral">
            Categories
          </Link>
          <Link to="/search" className="text-[0.95rem] font-medium transition-colors hover:text-coral">
            Search
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/browse" className="pill pill-coral hidden sm:inline-flex">
            Browse free
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-full p-2.5 transition-colors hover:bg-black/5 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-cream px-5 py-5 md:hidden">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-extrabold tracking-[-0.06em]">BBI</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="rounded-full p-2.5 transition-colors hover:bg-black/5"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="mt-12 flex flex-col gap-6">
            <Link to="/browse" onClick={() => setMobileOpen(false)} className="t-card">
              Categories
            </Link>
            <Link to="/search" onClick={() => setMobileOpen(false)} className="t-card">
              Search
            </Link>
            <Link
              to="/browse"
              onClick={() => setMobileOpen(false)}
              className="pill pill-coral mt-4 w-full justify-center"
            >
              Browse free
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
