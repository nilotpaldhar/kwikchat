import { FileType } from "@prisma/client";
import type { MediaAttachmentFilterType } from "@/types";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { mediaAttachmentKeys } from "@/constants/tanstack-query";
import { fetchConversationMediaAttachments, fetchMessageMediaAttachments } from "@/services/media";

// Function to map a media type to the corresponding FileType enum
const getMediaType = (mediaType: MediaAttachmentFilterType) => {
	if (mediaType === "image") return FileType.image;
	if (mediaType === "document") return FileType.document;
	return null;
};

/**
 * Custom React Query hook to fetch media attachments for a specific conversation.
 */
const useConversationMediaAttachmentsQuery = ({
	conversationId,
	filter = "all",
}: {
	conversationId: string;
	filter?: MediaAttachmentFilterType;
}) => {
	const query = useInfiniteQuery({
		queryKey: mediaAttachmentKeys.filtered(conversationId, filter),
		queryFn: ({ pageParam }) =>
			fetchConversationMediaAttachments({
				conversationId,
				page: pageParam,
				mediaType: getMediaType(filter),
			}),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.data?.pagination.nextPage,
	});

	return query;
};

/**
 * Custom React Query hook to fetch media attachments from a specific message.
 */
const useMessageMediaAttachmentsQuery = ({
	conversationId,
	messageId,
	enabled = true,
}: {
	conversationId: string;
	messageId: string;
	enabled?: boolean;
}) => {
	const query = useQuery({
		queryKey: mediaAttachmentKeys.forMessage(conversationId, messageId),
		queryFn: () => fetchMessageMediaAttachments({ conversationId, messageId }),
		enabled,
	});

	return query;
};

export { useConversationMediaAttachmentsQuery, useMessageMediaAttachmentsQuery };
