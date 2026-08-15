import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";
import '../i18n/config';
import i18next from 'i18next';
import { useTranslation, I18nextProvider } from 'react-i18next';


import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Spectre Hub — Automação de Elite para Discord" },
      { name: "description", content: "Domine o Discord com o Spectre Hub. Automação avançada, sniper de nicks e ferramentas de elite com tecnologia de ponta." },
      { name: "author", content: "Spectre Hub" },
      { property: "og:title", content: "Spectre Hub — Automação de Elite para Discord" },
      { property: "og:description", content: "Domine o Discord com o Spectre Hub. Automação avançada, sniper de nicks e ferramentas de elite com tecnologia de ponta." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Spectre Hub — Automação de Elite para Discord" },
      { name: "twitter:description", content: "Domine o Discord com o Spectre Hub. Automação avançada, sniper de nicks e ferramentas de elite com tecnologia de ponta." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/79e7fe18-9b3f-4c86-9466-b1659b463691" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/79e7fe18-9b3f-4c86-9466-b1659b463691" },
      { "httpEquiv": "Content-Security-Policy", content: "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src * data:; connect-src *; frame-src *; style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com; upgrade-insecure-requests;" },
      { "httpEquiv": "X-Content-Type-Options", content: "nosniff" },
      { name: "referrer", content: "no-referrer-when-downgrade" }
    ],
    scripts: [
      { src: "https://challenges.cloudflare.com/turnstile/v0/api.js", async: true, defer: true },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter+Tight:ital,wght@0,100..900;1,100..900&family=JetBrains+Mono:wght@400;500;600;700&display=swap",
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    if (i18n.language) {
      document.documentElement.lang = i18n.language;
    }
  }, [i18n.language]);

  return (
    <html lang={i18n.language}>
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
      <I18nextProvider i18n={i18next}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <div className="page-transition-wrapper">
        <Outlet />
      </div>
      <Toaster
        theme="dark"
        position="top-right"
        closeButton
        gap={12}
        toastOptions={{
          className: "spectre-toast",
          duration: 4000,
        }}
      />
      </I18nextProvider>
    </QueryClientProvider>

  );
}
