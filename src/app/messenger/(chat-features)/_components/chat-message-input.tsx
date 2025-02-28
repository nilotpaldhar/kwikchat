"use client";

import Skeleton from "@/components/ui/skeleton";
import ChatInput from "@/components/messenger/chat-input";
import ErrorAlert from "@/app/messenger/_components/error-alert";

import useCurrentUser from "@/hooks/tanstack-query/use-current-user";
import { useSendMessage } from "@/hooks/tanstack-query/use-message";

interface ChatMessageInputProps {
	conversationId: string;
}

const ChatMessageInput = ({ conversationId }: ChatMessageInputProps) => {
	const { data, isLoading, isError, error, refetch } = useCurrentUser();
	const { mutate } = useSendMessage();

	const sender = data?.data;

	if (isLoading)
		return (
			<div className="flex w-full items-center space-x-2">
				<Skeleton className="size-10 rounded-full" />
				<Skeleton className="h-10 w-full rounded-lg" />
				<Skeleton className="h-10 w-6" />
			</div>
		);

	if (isError || !sender)
		return (
			<ErrorAlert onClick={() => refetch()}>
				{error ? error.message : "Something went wrong!"}
			</ErrorAlert>
		);

	return (
		<ChatInput
			onSubmit={(message) => mutate({ conversationId, sender, message })}
			// eslint-disable-next-line no-console
			onAttachmentUpload={(attachmentdata) => console.log("ChatMessageInput: ", attachmentdata)}
		/>
	);
};

export default ChatMessageInput;
