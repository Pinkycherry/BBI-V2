import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Scroll reveal.
 *
 * The element starts clipped, not transparent — see the note in styles.css.
 * If this observer never fires (dead JS, an old browser, a crawler), the text
 * is still on the page and still readable; only the animation is lost.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          window.setTimeout(() => el.classList.add("is-in"), delay);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}
