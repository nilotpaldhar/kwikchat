import { MemberRole, type Member } from "@prisma/client";

/**
 * Checks if a user is an admin in a group conversation.
 *
 * This function determines whether a specific user holds the admin role
 * in a group conversation by inspecting the members list.
 */
const isGroupAdmin = ({ userId, members }: { userId: string; members: Member[] }) => {
	const member = members.find((m) => m.userId === userId);
	if (!member) return false;
	return member.role === MemberRole.admin;
};

export default isGroupAdmin;
