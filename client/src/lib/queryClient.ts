import { QueryClient } from "@tanstack/react-query";
import { apiUrl } from "@/lib/apiBase";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: false,
    },
  },
});

// Default fetcher function for react-query
const defaultFetcher = async (url: string, options?: RequestInit) => {
  const response = await fetch(apiUrl(url), {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  const contentLength = response.headers.get("content-length");
  if (contentLength === "0") {
    return null;
  }

  return response.json();
};

// API request helper for mutations
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  return defaultFetcher(url, {
    method: "POST",
    ...options,
  });
};

// Set default query function
queryClient.setDefaultOptions({
  queries: {
    queryFn: ({ queryKey }) => {
      const [path] = queryKey as [string];
      return defaultFetcher(path);
    },
  },
});

export { queryClient };
