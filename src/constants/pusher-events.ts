export const friendEvents = {
	delete: "delete_friend" as const,
	online: "online_friend" as const,
	offline: "offline_friend" as const,
	block: "block_friend" as const,
};

export const friendRequestEvents = {
	incoming: "incoming_friend_request" as const,
	delete: "delete_friend_request" as const,
	accept: "accept_friend_request" as const,
	reject: "reject_friend_request" as const,
};
