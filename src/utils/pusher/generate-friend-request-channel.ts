export type FriendRequestStatus = "incoming" | "accepted" | "rejected" | "deleted";
export type FriendRequestChannelType = "default" | "recent" | "count";

/**
 * Generates a unique channel identifier for friend request lifecycle events.
 */
const generateFriendRequestChannel = ({
	receiverId,
	status,
	channelType,
}: {
	receiverId: string;
	status: FriendRequestStatus;
	channelType: FriendRequestChannelType;
}) => `@friend_request=${status}@channel_type${channelType}@receiver_id=${receiverId}`;

export default generateFriendRequestChannel;
