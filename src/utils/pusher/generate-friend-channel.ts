export type FriendChannelType = "default" | "filtered_friends";

/**
 * Generates a friend channel string based on the provided unique identifier (UID).
 */
const generateFriendChannel = ({
	uid,
	channelType,
}: {
	uid: string;
	channelType: FriendChannelType;
}) => `@friend_uid=${uid}@channel_type${channelType}`;

export default generateFriendChannel;
