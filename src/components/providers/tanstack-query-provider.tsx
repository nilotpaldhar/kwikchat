"use client";

import { useState } from "react";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { toast } from "sonner";

const TanstackQueryProvider = ({ children }: { children: React.ReactNode }) => {
	const defaultOptions = {
		queries: { staleTime: Infinity, refetchInterval: 0 },
	};

	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions,
				queryCache: new QueryCache({ onError: (error) => toast.error(error.message) }),
			})
	);

	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools buttonPosition="top-right" />
			{children}
		</QueryClientProvider>
	);
};

export default TanstackQueryProvider;
