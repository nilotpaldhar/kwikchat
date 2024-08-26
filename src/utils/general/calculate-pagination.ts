import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants/pagination";

export interface PaginationMetadata {
	totalItems: number; // Total number of items available.
	page: number; // Current page number.
	nextPage: number | null; // The number of the next page, or null if there is no next page.
	previousPage: number | null; // The number of the previous page, or null if there is no previous page.
	pageSize: number; // Number of items per page.
	totalPages: number; // Total number of pages.
	hasNextPage: boolean; // Whether there is a next page.
	hasPreviousPage: boolean; // Whether there is a previous page.
}

/**
 * Calculates pagination metadata based on current page, page size, and total items.
 */
export const calculatePagination = ({
	page = DEFAULT_PAGE,
	pageSize = DEFAULT_PAGE_SIZE,
	totalItems,
}: {
	page?: number;
	pageSize?: number;
	totalItems: number;
}) => {
	const totalPages = Math.ceil(totalItems / pageSize);
	const hasNextPage = page < totalPages;
	const hasPreviousPage = page > 1;
	const nextPage = hasNextPage ? page + 1 : null;
	const previousPage = hasPreviousPage ? page - 1 : null;

	return {
		totalItems,
		page,
		nextPage,
		previousPage,
		pageSize,
		totalPages,
		hasNextPage,
		hasPreviousPage,
	};
};
