import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

/**
 * Sits over the hero and turns solid once the page moves.
 *
 * Transparent at rest so the hero reads full-bleed; a blurred, bordered bar
 * after the first scroll so the links stay legible over photography and the
 * dark band further down.
 */
export function SiteHeader() {
  const [stuck, setStuck] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        stuck
          ? "border-b border-rule/70 bg-cream/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-8">
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
