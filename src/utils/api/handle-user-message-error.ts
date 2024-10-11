import "server-only";

import { NextResponse } from "next/server";
import { UserMessageError } from "@/data/message";

/**
 * Handles errors returned from the getUserMessage function
 * and returns appropriate responses based on the error type.
 */
const handleUserMessageError = (error: UserMessageError) => {
	switch (error) {
		case UserMessageError.MessageNotFound:
			return NextResponse.json(
				{ success: false, message: "Message could not be found." },
				{ status: 404 }
			);
		case UserMessageError.NotMember:
			return NextResponse.json(
				{ success: false, message: "You are not a member of this conversation." },
				{ status: 403 }
			);
		case UserMessageError.NoRecipient:
			return NextResponse.json(
				{ success: false, message: "No recipient found for this conversation." },
				{ status: 422 }
			);
		case UserMessageError.NotAllowed:
			return NextResponse.json(
				{ success: false, message: "You are not allowed to perform this action." },
				{ status: 422 }
			);
		default:
			return NextResponse.json(
				{ success: false, message: "An unexpected error occurred. Please try again later" },
				{ status: 500 }
			);
	}
};

export default handleUserMessageError;
