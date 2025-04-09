import "server-only";

import { type Media, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

/**
 * Function to save media to the database.
 */
const saveMedia = async ({
	mediaId,
	data,
}: {
	mediaId?: string;
	data: Prisma.MediaCreateInput;
}): Promise<Media> => {
	// Update existing media with the given mediaId
	if (mediaId) {
		const updateMedia = await prisma.media.update({ where: { id: mediaId }, data });
		return updateMedia;
	}

	// Create new media
	const newMedia = await prisma.media.create({ data });
	return newMedia;
};

export { saveMedia };
