import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { APIResponse, PaginatedResponse } from "@/types";
import type { PaginationMetadata } from "@/utils/general/calculate-pagination";

/**
 * Retrieves paginated data for infinite queries from the query client.
 */
const getInfiniteQueryData = <T>({
	keys,
	queryClient,
}: {
	keys: readonly string[];
	queryClient: QueryClient;
}) => {
	const data = queryClient.getQueryData<InfiniteData<APIResponse<PaginatedResponse<T>>>>(keys);
	return data;
};

/**
 * Retrieves paginated data for standard queries from the query client.
 */
const getQueryData = <T>({
	keys,
	queryClient,
}: {
	keys: readonly string[];
	queryClient: QueryClient;
}) => {
	const data = queryClient.getQueryData<APIResponse<PaginatedResponse<T>>>(keys);
	return data;
};

/**
 * Updates paginated data for infinite queries.
 */
const updateInfinitePaginatedData = <T>({
	existingData,
	updateFn,
}: {
	existingData: InfiniteData<APIResponse<PaginatedResponse<T>>> | undefined;
	updateFn: (
		page: PaginatedResponse<T> | undefined,
		pagination: PaginationMetadata
	) => PaginatedResponse<T>;
}) => {
	if (!existingData) return existingData;

	return {
		...existingData,
		pages: existingData.pages.map((page) => {
			const { data, status, message } = page;
			const pagination = data?.pagination as PaginationMetadata;

			return {
				status,
				message,
				data: updateFn(data, pagination),
			};
		}),
	};
};

/**
 * Updates paginated data for standard queries.
 */
const updatePaginatedData = <T>({
	existingData,
	updateFn,
}: {
	existingData: APIResponse<PaginatedResponse<T>> | undefined;
	updateFn: (
		page: PaginatedResponse<T> | undefined,
		pagination: PaginationMetadata
	) => PaginatedResponse<T>;
}) => {
	if (!existingData) return existingData;

	const { data, status, message } = existingData;
	const pagination = data?.pagination as PaginationMetadata;

	return {
		status,
		message,
		data: updateFn(data, pagination),
	};
};

export { getInfiniteQueryData, getQueryData, updateInfinitePaginatedData, updatePaginatedData };
