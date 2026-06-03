import {
  environmentManager,
  type FetchQueryOptions,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 60 * 1000, // 1 hour
        retry: 0,
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        toast.error(`Error: ${error.message}`, {
          action: {
            label: "Retry",
            onClick: query.invalidate,
          },
        });
      },
    }),
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (environmentManager.isServer()) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function prefetch<T>(
  queryOptions: FetchQueryOptions<T, Error, T, string[]>,
) {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(queryOptions);
}
