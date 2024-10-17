/**
 * Transforms the message object to map the seen-by members to their user IDs
 * and determines if the message is starred by the given user.
 */
const transformMessageSeenAndStarStatus = <
	T extends {
		seenByMembers: { member: { userId: string } }[];
		starred: { userId: string }[];
	},
>({
	message,
	userId,
}: {
	message: T;
	userId: string;
}): T & { seenByMembers: string[]; isStarred: boolean } => ({
	// Retain the original message properties while transforming the structure of seenByMembers and starred.
	...message,

	// Map the seenByMembers array to an array of user IDs.
	seenByMembers: message.seenByMembers.map((seenBy) => seenBy.member.userId),

	// Check if the current user has starred the message.
	isStarred: message.starred.some(({ userId: starredUserId }) => starredUserId === userId),

	// Reset the starred array to avoid unnecessary data duplication.
	starred: [],
});

export default transformMessageSeenAndStarStatus;
