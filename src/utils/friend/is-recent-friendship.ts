import { differenceInMonths } from "date-fns";

/**
 * Checks if the friendship was created 3 or more months ago.
 */
const isRecentFriendship = (createdAt: Date) => {
	const monthsDifference = differenceInMonths(new Date(), createdAt);
	return monthsDifference <= 3;
};

export default isRecentFriendship;
