"use client";

import { MessageType } from "@prisma/client";
import { ChatAttachmentTypes, ChatDocumentAttachment, ChatImageAttachment } from "@/types";

import Skeleton from "@/components/ui/skeleton";
import ChatInput from "@/components/messenger/chat-input";
import ErrorAlert from "@/app/messenger/_components/error-alert";

import useCurrentUser from "@/hooks/tanstack-query/use-current-user";
import { useSendMessage } from "@/hooks/tanstack-query/use-message";
import { toast } from "sonner";

interface ChatMessageInputProps {
	conversationId: string;
}

const ChatMessageInput = ({ conversationId }: ChatMessageInputProps) => {
	const { data, isLoading, isError, error, refetch } = useCurrentUser();
	const { mutate } = useSendMessage();

	const sender = data?.data;

	const handleSendMessage = ({
		messageType,
		textMessage,
		attachment,
	}: {
		messageType: MessageType;
		textMessage?: string;
		attachment?: ChatDocumentAttachment | ChatImageAttachment[];
	}) => {
		if (!sender) return;

		if (messageType === MessageType.text && textMessage) {
			mutate({ conversationId, sender, messageType, data: textMessage });
		}

		if (messageType === MessageType.document && attachment) {
			mutate({ conversationId, sender, messageType, data: attachment });
		}

		if (messageType === MessageType.image && attachment) {
			mutate({ conversationId, sender, messageType, data: attachment });
		}
	};

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
			onTextSubmit={(textMessage) =>
				handleSendMessage({ messageType: MessageType.text, textMessage })
			}
			onAttachmentUpload={(attachment) => {
				switch (attachment.type) {
					case ChatAttachmentTypes.Document: {
						handleSendMessage({
							messageType: MessageType.document,
							attachment: attachment.data,
						});
						return;
					}
					case ChatAttachmentTypes.Image: {
						handleSendMessage({
							messageType: MessageType.image,
							attachment: attachment.data,
						});
						return;
					}
					default: {
						toast.error("Unsupported Message");
					}
				}
			}}
		/>
	);
};

export default ChatMessageInput;
