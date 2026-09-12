import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import "../styles.css";
import { catalogQuery } from "../lib/ideas.functions";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "BBI — Bro Business Ideas | Researched Business Idea Blueprints" },
      {
        name: "description",
        content:
          "A free library of researched business ideas. Every blueprint names who pays you, how the money works, what hurts in year one, and whether you should build it at all.",
      },
      { property: "og:title", content: "BBI — Bro Business Ideas" },
      {
        property: "og:description",
        content:
          "A free library of researched business ideas — including the ones we tell you not to build.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="t-eyebrow">404</p>
        <h1 className="t-section mt-3">
          That page <span className="accent">isn&rsquo;t here.</span>
        </h1>
        <p className="t-lead mt-4">
          The link may be old, or the blueprint may have moved. The library is still open.
        </p>
        <Link to="/" className="pill pill-coral mt-7">
          Back to the library
        </Link>
      </div>
    </div>
  );
}
