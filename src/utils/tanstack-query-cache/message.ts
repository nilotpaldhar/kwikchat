import "client-only";

import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { APIResponse, PaginatedResponse, CompleteMessage } from "@/types";
import type { PaginationMetadata } from "@/utils/general/calculate-pagination";

import { messageKeys } from "@/constants/tanstack-query";

import { updateInfinitePaginatedData } from "@/utils/tanstack-query-cache/helpers";

const addMessage = ({
	message,
	data,
	pagination,
}: {
	message?: CompleteMessage;
	data: PaginatedResponse<CompleteMessage> | undefined;
	pagination: PaginationMetadata;
}) => {
	const items = data?.items ?? [];
	const itemExists = items.some((item) => item.id === message?.id);

	return {
		pagination: {
			...pagination,
			totalItems: !itemExists ? pagination.totalItems + 1 : pagination.totalItems,
		},
		items: message && !itemExists ? [message, ...items] : items,
	};
};

const prependConversationMessage = ({
	conversationId,
	message,
	queryClient,
}: {
	conversationId: string;
	message?: CompleteMessage;
	queryClient: QueryClient;
}) => {
	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<CompleteMessage>>>>(
		messageKeys.all(conversationId),
		(existingData) =>
			updateInfinitePaginatedData<CompleteMessage>({
				existingData,
				updateFn: (data, pagination) => addMessage({ message, data, pagination }),
			})
	);
};

// eslint-disable-next-line import/prefer-default-export
export { prependConversationMessage };
