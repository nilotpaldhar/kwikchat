/* eslint-disable no-console */

"use client";

import Skeleton from "@/components/ui/skeleton";
import ChatInput from "@/components/messenger/chat-input";
import ErrorAlert from "@/app/messenger/_components/error-alert";

import useCurrentUser from "@/hooks/tanstack-query/use-current-user";
import { useSendPrivateMessage } from "@/hooks/tanstack-query/use-message";

interface ChatMessageInputProps {
	conversationId: string;
}

const ChatMessageInput = ({ conversationId }: ChatMessageInputProps) => {
	const { data, isLoading, isError, error, refetch } = useCurrentUser();
	const { mutate } = useSendPrivateMessage();

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

	return <ChatInput onSubmit={(message) => mutate({ conversationId, sender, message })} />;
};

export default ChatMessageInput;
