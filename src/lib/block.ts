import "server-only";

import { prisma } from "@/lib/db";

/**
 * Checks if a user has blocked another user.
 */
const isBlocked = async ({ blockerId, blockedId }: { blockerId: string; blockedId: string }) => {
	const block = await prisma.block.findFirst({
		where: { blockerId, blockedId },
	});
	return block !== null;
};

export { isBlocked };
