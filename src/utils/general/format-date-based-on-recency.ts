import { format, differenceInHours, differenceInDays } from "date-fns";

const formatDateBasedOnRecency = (date: Date): string => {
	const now = new Date();

	const hoursDifference = differenceInHours(now, date);
	const daysDifference = differenceInDays(now, date);

	// Less than 24 hours old
	if (hoursDifference < 24) {
		return format(date, "hh:mm a");
	}

	// Less than a week old
	if (daysDifference < 7) {
		return format(date, "EEEE");
	}

	// Default to day/month/year
	return format(date, "dd/MM/yyyy");
};

export default formatDateBasedOnRecency;
