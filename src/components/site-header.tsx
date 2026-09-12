import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";

import { catalogQuery } from "../lib/ideas.functions";
import { topCategories, typeGroups } from "../lib/catalog-display";
import { categoryImage } from "../config/category-imagery";

/**
 * The floating pill header.
 *
 * Fixed for the whole page, so it rides over the cream sections and the dark
 * band alike — the reference keeps one white bar throughout rather than
 * inverting it per section, and the constant contrast is what makes it read as
 * a floating object rather than part of any one band.
 */
export function SiteHeader() {
  const { data: catalog } = useQuery(catalogQuery);
  const categories = catalog?.categories ?? [];
  const totalCategories = catalog?.totalCategories ?? categories.length;

  const [open, setOpen] = useState<"categories" | "explore" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const featured = topCategories(categories, 4).shown;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
      <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full bg-paper py-2.5 pr-2.5 pl-5 shadow-[0_2px_6px_rgb(22_22_26/0.05),0_18px_44px_-24px_rgb(22_22_26/0.35)] sm:py-3 sm:pr-3 sm:pl-7">
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-[-0.06em] text-ink sm:text-[1.75rem]"
        >
          BBI
        </Link>

        <div ref={navRef} className="relative hidden items-center gap-1 md:flex">
          <button
            type="button"
            onClick={() => setOpen(open === "categories" ? null : "categories")}
            aria-expanded={open === "categories"}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.95rem] font-medium transition-colors ${
              open === "categories" ? "bg-peri-wash text-ink" : "text-ink hover:bg-black/5"
            }`}
          >
            Categories
            <ChevronDown
              className={`h-4 w-4 transition-transform ${open === "categories" ? "rotate-180" : ""}`}
            />
          </button>

          <button
            type="button"
            onClick={() => setOpen(open === "explore" ? null : "explore")}
            aria-expanded={open === "explore"}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.95rem] font-medium transition-colors ${
              open === "explore" ? "bg-peri-wash text-ink" : "text-ink hover:bg-black/5"
            }`}
          >
            Explore
            <ChevronDown
              className={`h-4 w-4 transition-transform ${open === "explore" ? "rotate-180" : ""}`}
            />
          </button>

          {open === "categories" ? (
            <div className="absolute top-[calc(100%+0.9rem)] left-0 w-[min(38rem,80vw)] rounded-[28px] bg-paper p-4 shadow-[0_2px_6px_rgb(22_22_26/0.05),0_28px_60px_-26px_rgb(22_22_26/0.4)]">
              <div className="grid grid-cols-2 gap-3">
                {featured.map((c) => {
                  const img = categoryImage(c.categorySlug);
                  return (
                    <Link
                      key={c.categorySlug}
                      to="/category/$categorySlug"
                      params={{ categorySlug: c.categorySlug }}
                      onClick={() => setOpen(null)}
                      className="group"
                    >
                      <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-cream-deep">
                        <img
                          src={img.src}
                          alt={img.alt}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <p className="mt-2 text-[0.95rem] font-semibold">{c.categoryName}</p>
                      <p className="text-sm text-ink-faint">{c.ideaCount} blueprints</p>
                    </Link>
                  );
                })}
              </div>

              <Link
                to="/browse"
                onClick={() => setOpen(null)}
                className="mt-3 flex items-center justify-between rounded-2xl bg-peri-wash px-4 py-3.5 transition-colors hover:bg-peri"
              >
                <span>
                  <span className="block text-[0.95rem] font-semibold">
                    See all {totalCategories} categories
                  </span>
                  <span className="block text-sm text-ink-soft">
                    Every blueprint we have researched and published
                  </span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0" />
              </Link>
            </div>
          ) : null}

          {open === "explore" ? (
            <div className="absolute top-[calc(100%+0.9rem)] left-0 w-[min(34rem,80vw)] rounded-[28px] bg-paper p-5 shadow-[0_2px_6px_rgb(22_22_26/0.05),0_28px_60px_-26px_rgb(22_22_26/0.4)]">
              <div className="grid gap-6 sm:grid-cols-2">
                {typeGroups(categories).map((group) => (
                  <div key={group.title}>
                    <p className="t-eyebrow">{group.title}</p>
                    <ul className="mt-2.5 space-y-1.5">
                      {group.categories.slice(0, 5).map((c) => (
                        <li key={c.categorySlug}>
                          <Link
                            to="/category/$categorySlug"
                            params={{ categorySlug: c.categorySlug }}
                            onClick={() => setOpen(null)}
                            className="text-[0.95rem] text-ink-soft transition-colors hover:text-coral"
                          >
                            {c.categoryName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <Link to="/browse" className="pill pill-coral hidden sm:inline-flex">
            Browse free
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-full p-2.5 text-ink transition-colors hover:bg-black/5 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="pointer-events-auto fixed inset-0 z-50 bg-cream px-4 py-5 md:hidden">
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

          <nav className="mt-8 space-y-7 overflow-y-auto pb-20">
            {typeGroups(categories).map((group) => (
              <div key={group.title}>
                <p className="t-eyebrow">{group.title}</p>
                <ul className="mt-3 space-y-2.5">
                  {group.categories.map((c) => (
                    <li key={c.categorySlug}>
                      <Link
                        to="/category/$categorySlug"
                        params={{ categorySlug: c.categorySlug }}
                        onClick={() => setMobileOpen(false)}
                        className="text-lg font-medium"
                      >
                        {c.categoryName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <Link
              to="/browse"
              onClick={() => setMobileOpen(false)}
              className="pill pill-coral w-full justify-center"
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
