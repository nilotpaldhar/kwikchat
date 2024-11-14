import "server-only";

import { NextResponse } from "next/server";
import { SendPrivateMessageError, SendGroupMessageError } from "@/lib/message";

/**
 * Handles errors that occur when attempting to send a private message.
 */
const handleSendPrivateMessageError = (error: SendPrivateMessageError) => {
	switch (error) {
		case SendPrivateMessageError.ReceiverNotFound:
			return NextResponse.json(
				{
					success: false,
					message:
						"Unable to find a recipient for this conversation. Please ensure you're messaging a valid participant.",
				},
				{ status: 404 }
			);
		case SendPrivateMessageError.SenderBlocked:
			return NextResponse.json(
				{
					success: false,
					message:
						"You are unable to send a message to this recipient at the moment. Please check your connection or try again later.",
				},
				{ status: 403 }
			);
		case SendPrivateMessageError.FriendshipNotFound:
			return NextResponse.json(
				{
					success: false,
					message:
						"You can only send messages to users who are your friends. Please add this user as a friend to start messaging.",
				},
				{ status: 404 }
			);
		default:
			return NextResponse.json(
				{ success: false, message: "An unexpected error occurred. Please try again later" },
				{ status: 500 }
			);
	}
};

/**
 * Handles errors that may occur when attempting to send a message in a group conversation.
 */
const handleSendGroupMessageError = (error: SendGroupMessageError) => {
	switch (error) {
		case SendGroupMessageError.NotGroupMember:
			return NextResponse.json(
				{
					success: false,
					message:
						"You are not a member of this group and do not have permission to send messages here.",
				},
				{ status: 403 }
			);
		default:
			return NextResponse.json(
				{ success: false, message: "An unexpected error occurred. Please try again later" },
				{ status: 500 }
			);
	}
};

export { handleSendPrivateMessageError, handleSendGroupMessageError };
