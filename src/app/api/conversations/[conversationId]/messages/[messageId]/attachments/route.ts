/* eslint-disable import/prefer-default-export */

import { type NextRequest, NextResponse } from "next/server";
import { MessageType } from "@prisma/client";
import { ChatAttachmentTypes } from "@/types";

import { getCurrentUser } from "@/data/auth/session";
import { getUserMessage } from "@/data/message";
import { getMediaFromMessage } from "@/data/media";

import handleUserMessageError from "@/utils/api/handle-user-message-error";

type Params = {
	conversationId: string;
	messageId: string;
};

/**
 * Determines the attachment type based on the message type.
 */
const getAttachmentType = (messageType: MessageType): ChatAttachmentTypes | null => {
	// Mapping message types to their corresponding attachment types
	const attachmentTypeMap: Record<MessageType, ChatAttachmentTypes | null> = {
		[MessageType.image]: ChatAttachmentTypes.Image,
		[MessageType.document]: ChatAttachmentTypes.Document,
		[MessageType.deleted]: null,
		[MessageType.text]: null,
		[MessageType.system]: null,
	};

	return attachmentTypeMap[messageType] || null;
};

/**
 * Handler function for retrieving media attachments from a message.
 *
 * @returns A JSON response containing the status, message, and data (if successful).
 */
export async function GET(req: NextRequest, { params }: { params: Params }) {
	// Retrieve the current user from the session (with authentication required)
	const currentUser = await getCurrentUser(true);

	// Check if the current user is authenticated. If not, respond with an unauthorized status.
	if (!currentUser) {
		return NextResponse.json(
			{ success: false, message: "Unauthorized! Access denied" },
			{ status: 401 }
		);
	}

	const userId = currentUser.id;
	const { conversationId, messageId } = params;

	try {
		// Retrieve the message based on conversationId and messageId
		const { message, error } = await getUserMessage({
			conversationId,
			messageId,
			userId,
		});

		// Handle possible errors based on the returned error type
		if (error || !message) {
			return handleUserMessageError(error!);
		}

		// Determine the attachment type from the message type
		const attachmentType = getAttachmentType(message.type);

		// If the message type is unsupported, return a 400 Bad Request response
		if (!attachmentType) {
			return NextResponse.json(
				{
					success: false,
					message: "Unsupported attachment type. Please provide a valid attachment type.",
				},
				{ status: 400 }
			);
		}

		// Fetch media attachments based on messageId and attachmentType
		const data = await getMediaFromMessage({ messageId, attachmentType });

		return NextResponse.json({
			success: true,
			message: "Media attachments retrieved successfully.",
			data,
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "An unexpected error occurred. Please try again later" },
			{ status: 500 }
		);
	}
}
