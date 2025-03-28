import type { ImageMessage, Media } from "@prisma/client";
import type { ImageMessageWithMedia } from "@/types";

/**
 * Merges an array of ImageMessage objects with corresponding Media objects.
 * Each ImageMessage is matched with a Media object using the `mediaId` field.
 */
const mergeImageMessagesWithMedia = ({
	imageMessages,
	media,
}: {
	imageMessages: ImageMessage[];
	media: Media[];
}): ImageMessageWithMedia[] => {
	// Create a Map for quick lookup: { mediaId -> Media }
	const mediaMap = new Map<string, Media>(media.map((m) => [m.id, m]));

	// Merge each ImageMessage with its corresponding Media (if found)
	return imageMessages.map((imageMessage) => ({
		...imageMessage,
		media: mediaMap.get(imageMessage.mediaId) || undefined, // Attach media if found
	}));
};

export default mergeImageMessagesWithMedia;
