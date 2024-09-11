import "client-only";

/**
 * Formats a given date as a human-readable string for displaying when a user joined.
 *
 * If the provided date is invalid or undefined, it returns "Unknown". Otherwise, it
 * formats the date using the "en-US" locale with the format "Month Day, Year" (e.g., Jan 1, 2024).
 *
 * @param date - The date object representing the user's joining date.
 * @returns A formatted date string or "Unknown" if the date is invalid.
 */
const formatJoining = (date: Date) => {
	if (!date) return "Unknown";
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

export default formatJoining;
