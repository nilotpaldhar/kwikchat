import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { isBlocked } from "@/lib/block";
import { pusherServer } from "@/lib/pusher/server";

import { friendEvents } from "@/constants/pusher-events";

import { getBlockedUsers } from "@/data/block";
import { getCurrentUser } from "@/data/auth/session";
import { deleteFriendship } from "@/lib/friendship";

/**
 * Handler function to list all blocked users.
 *
 * @returns A JSON response containing the status, message, and data of blocked users.
 */
export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const currentUser = await getCurrentUser();

	// Extract query parameters with default values
	const page = searchParams.get("page");
	const pageSize = searchParams.get("page_size");
	const query = searchParams.get("query") ?? "";

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	// Fetch the blocked users for the current user, applying pagination if specified
	const data = await getBlockedUsers({
		blockerId: currentUser.id,
		page: page ? parseInt(page, 10) : undefined,
		pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
		query,
	});

	return NextResponse.json({
		success: true,
		message: "List of all blocked users",
		data,
	});
}

/**
 * Handler function to block a user.
 *
 * @param req - The incoming request object from Next.js, containing request data.
 * @returns A response object indicating success or failure of the block operation.
 */
export async function POST(req: NextRequest) {
	const body = await req.json();
	const currentUser = await getCurrentUser();

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	// Extract the current user's ID and the blocked user's ID from the request body.
	const blockerId = currentUser.id;
	const blockedId = body?.blockedUserId ?? null;

	// Ensure that a blocked user ID is provided in the request body.
	if (!blockedId) {
		return NextResponse.json(
			{ success: false, message: "Blocked user ID is required" },
			{ status: 400 }
		);
	}

	// Check if the blocker is trying to block themselves.
	if (blockedId === blockerId) {
		return NextResponse.json(
			{ success: false, message: "Blocking yourself is not allowed" },
			{ status: 400 }
		);
	}

	try {
		// Check if the user is already blocked.
		const isUserBlocked = await isBlocked({ blockerId, blockedId });

		// If the user is already blocked, respond with a bad request status.
		if (isUserBlocked) {
			return NextResponse.json(
				{ success: false, message: "This user is already blocked" },
				{ status: 400 }
			);
		}

		// Remove any existing friendship between blocker and blocked user
		const deletedFriendship = await deleteFriendship({ userId: blockerId, friendId: blockedId });
		if (!deletedFriendship) {
			return NextResponse.json(
				{ success: false, message: "Unable to block the user. Please try again later." },
				{ status: 400 }
			);
		}

		// Create a new block entry in the database with the blocker and blocked user IDs.
		const block = await prisma.block.create({
			data: { blockerId, blockedId },
			include: { blocked: { omit: { password: true } } },
		});

		const data = {
			user: block.blocked,
			blockedAt: block.createdAt,
		};

		// Trigger a Pusher event to remove the friend from the friend list.
		pusherServer.trigger(blockedId, friendEvents.block, blockerId);

		return NextResponse.json(
			{ success: true, message: "User has been blocked successfully", data },
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Unable to block the user. Please try again later." },
			{ status: 500 }
		);
	}
}

/**
 * Handler function to unblock a user.
 *
 * @param req - The incoming request object from Next.js, containing request data.
 * @returns A response object indicating success or failure of the unblock operation.
 */
export async function DELETE(req: NextRequest) {
	const body = await req.json();
	const currentUser = await getCurrentUser();

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	// Extract the current user's ID and the blocked user's ID from the request body.
	const blockerId = currentUser.id;
	const blockedId = body?.blockedUserId ?? null;

	// Ensure that a blocked user ID is provided in the request body.
	if (!blockedId) {
		return NextResponse.json(
			{ success: false, message: "Blocked user ID is required" },
			{ status: 400 }
		);
	}

	try {
		// Attempt to delete the block record from the database where the blocker and blocked IDs match.
		const unblock = await prisma.block.deleteMany({
			where: { blockerId, blockedId },
		});

		// Check if any records were deleted. If not, respond with a not found status.
		if (unblock.count < 1) {
			return NextResponse.json(
				{ success: false, message: "Record of the blocked user could not be found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ success: true, message: "User has been unblocked successfully" },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Unable to unblock the user" },
			{ status: 500 }
		);
	}
}
