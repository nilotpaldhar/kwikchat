import { useQuery } from "@tanstack/react-query";
import { fetchMessageMediaAttachments } from "@/services/media";
import { messageMediaKeys } from "@/constants/tanstack-query";

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
		queryKey: messageMediaKeys.forMessage(conversationId, messageId),
		queryFn: () => fetchMessageMediaAttachments({ conversationId, messageId }),
		enabled,
	});

	return query;
};

// eslint-disable-next-line import/prefer-default-export
export { useMessageMediaAttachmentsQuery };
