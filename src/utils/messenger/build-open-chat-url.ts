import "client-only";

/**
 * Generates a URL for opening a chat with a specified friend.
 */
const buildOpenChatUrl = (friendId: string, fallbackPath: string) => {
	const params = new URLSearchParams();
	params.append("friend_id", friendId);
	params.append("fallback_path", fallbackPath);
	return `/messenger/open-chat?${params.toString()}`;
};

export default buildOpenChatUrl;
