import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Sensible defaults: dedupe within 60s, keep cache 5min, no
        // window-focus refetch storm, one retry with backoff.
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Preload route chunks + loader data on link hover/focus so navigation
    // feels instant. Router keeps freshness delegated to TanStack Query.
    defaultPreload: "intent",
    defaultPreloadDelay: 50,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
