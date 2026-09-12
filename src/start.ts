import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";

/** Last-resort SSR failure page. Inline so it cannot itself fail to load. */
function renderErrorPage(): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Something went wrong — BBI</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#fdf7f0;color:#16161a;font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;padding:24px}div{max-width:30rem;text-align:center}h1{font-size:1.5rem;letter-spacing:-.02em;margin:0}p{color:#6b6b73;line-height:1.6}a{display:inline-block;margin-top:1.5rem;background:#ff6b45;color:#fff;text-decoration:none;font-weight:600;padding:.8rem 1.5rem;border-radius:999px}</style></head><body><div><h1>This page didn't load</h1><p>Something went wrong on our end. Try refreshing, or head back to the library.</p><a href="/">Back to the library</a></div></body></html>`;
}

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware, csrfMiddleware],
}));
