import type { ReactNode } from "react";

import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
