import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Locale negotiation + cookie persistence.
 *
 * NOTE: In Next.js 16 the middleware file was renamed from `middleware.ts`
 * to `proxy.ts`. next-intl's `createMiddleware` is still the correct API.
 *
 * The matcher skips API routes, Next internals and any path containing a
 * dot — which covers every static asset, including the project media under
 * `/project_afbeeldingen/...` (`.mp4`, `.png`, etc.) and `favicon.ico`.
 */
export default createMiddleware(routing);

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
