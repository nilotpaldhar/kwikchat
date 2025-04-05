import { format, differenceInHours, differenceInDays, isYesterday } from "date-fns";

const formatDateBasedOnRecency = (date: Date, useTimeFormat = true): string => {
	const now = new Date();

	const hoursDifference = differenceInHours(now, date);
	const daysDifference = differenceInDays(now, date);

	// Less than 24 hours old
	if (hoursDifference < 24) {
		// If the date is from the previous day
		if (isYesterday(date)) {
			return useTimeFormat ? format(date, "hh:mm a") : "yesterday";
		}

		return useTimeFormat ? format(date, "hh:mm a") : "today";
	}

	// Less than a week old
	if (daysDifference < 7) {
		return format(date, "EEEE");
	}

	// Default to day/month/year
	return format(date, "dd/MM/yyyy");
};

export default formatDateBasedOnRecency;
