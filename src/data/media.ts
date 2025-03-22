import "server-only";

import { Media } from "@prisma/client";
import { ChatAttachmentTypes } from "@/types";

import { prisma } from "@/lib/db";

/**
 * Fetches media attachments from a message based on the specified attachment type.
 */
const getMediaFromMessage = async ({
	messageId,
	attachmentType,
}: {
	messageId: string;
	attachmentType: ChatAttachmentTypes;
}): Promise<Media[]> => {
	let mediaAttachments: Media[] = [];

	try {
		// Fetch document attachments if the type is Document
		if (attachmentType === ChatAttachmentTypes.Document) {
			const documentMessage = await prisma.documentMessage.findUnique({
				where: { messageId },
				include: { media: true },
			});

			// Ensure we return a consistent array format
			if (documentMessage?.media) {
				mediaAttachments = [documentMessage.media];
			}
		}

		// Fetch image attachments if the type is Image
		if (attachmentType === ChatAttachmentTypes.Image) {
			const imageMessages = await prisma.imageMessage.findMany({
				where: { messageId },
				include: { media: true },
			});

			// Flatten array since media is likely an object inside each message
			mediaAttachments = imageMessages.flatMap((imgMsg) => imgMsg.media);
		}

		return mediaAttachments;
	} catch (error) {
		return mediaAttachments;
	}
};

// eslint-disable-next-line import/prefer-default-export
export { getMediaFromMessage };
