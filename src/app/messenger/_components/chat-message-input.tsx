/* eslint-disable no-console */

"use client";

import ChatInput from "@/components/messenger/chat-input";
import { useSendPrivateMessage } from "@/hooks/tanstack-query/use-message";

interface ChatMessageInputProps {
	conversationId: string;
}

const ChatMessageInput = ({ conversationId }: ChatMessageInputProps) => {
	const { mutate, isSuccess, isError, isPending, error } = useSendPrivateMessage();

	console.log({ isSuccess, isError, isPending, error });

	return <ChatInput onSubmit={(message) => mutate({ conversationId, message })} />;
};

export default ChatMessageInput;
