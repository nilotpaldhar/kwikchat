"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const TanstackQueryProvider = ({ children }: { children: React.ReactNode }) => {
	const defaultOptions = {
		queries: { staleTime: 4 * 1000, refetchInterval: 0 },
	};

	const [queryClient] = useState(() => new QueryClient({ defaultOptions }));

	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools />
			{children}
		</QueryClientProvider>
	);
};

export default TanstackQueryProvider;
