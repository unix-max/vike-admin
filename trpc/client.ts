import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./appRouter";

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
});
