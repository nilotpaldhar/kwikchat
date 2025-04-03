import type { Media } from "@prisma/client";

import { format, isThisYear, isThisMonth } from "date-fns";

// Defines the structure for grouping media by month
interface GroupedMedia {
	month: string;
	mediaList: Media[];
}

/**
 * Formats a given date into a user-friendly label based on its recency:
 * - Returns "This Month" if the date is within the current month.
 * - Returns the month name (e.g., "February") if within the current year but not the current month.
 * - Returns "Month Year" (e.g., "December 2024") if from a previous year.
 */
const formatDateBasedOnMonth = (date: Date): string => {
	if (isThisMonth(date)) return "This Month";
	if (isThisYear(date)) return format(date, "MMMM"); // Example: "February"
	return format(date, "MMMM yyyy"); // Example: "December 2024"
};

/**
 * Groups an array of Media objects by their creation month.
 * The grouping logic is based on the recency of the media's `createdAt` date.
 */
const groupMediaByMonth = (mediaItems: Media[]): GroupedMedia[] => {
	// Group media items by month label using reduce.
	const groupedMedia = mediaItems.reduce<Record<string, Media[]>>((acc, mediaItem) => {
		const monthLabel = formatDateBasedOnMonth(new Date(mediaItem.createdAt));

		// Initialize array if label does not exist in the accumulator.
		if (!acc[monthLabel]) acc[monthLabel] = [];

		// Add the media item to the appropriate month group.
		acc[monthLabel].push(mediaItem);

		return acc;
	}, {});

	// Convert the grouped object to an array and sort it based on the latest creation date in each group.
	return Object.entries(groupedMedia)
		.map(([month, media]) => ({ month, mediaList: media })) // Transform object entries to the expected structure.
		.sort((a, b) => {
			// Find the most recent media item creation date within each group.
			const latestDateA = Math.max(
				...a.mediaList.map((item) => new Date(item.createdAt).getTime())
			);
			const latestDateB = Math.max(
				...b.mediaList.map((item) => new Date(item.createdAt).getTime())
			);

			// Sort groups by the most recent date, descending order.
			return latestDateB - latestDateA; // Sort most recent first
		});
};

export default groupMediaByMonth;
