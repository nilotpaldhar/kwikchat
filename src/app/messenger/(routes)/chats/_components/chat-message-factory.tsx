import type { CompleteMessage } from "@/types";

import { useMemo } from "react";
import { format } from "date-fns";

import ChatMessageText from "@/app/messenger/(routes)/chats/_components/chat-message/text";
import ChatMessageImage from "@/app/messenger/(routes)/chats/_components/chat-message/image";

import isMessageEdited from "@/utils/messenger/is-message-edited";

interface ChatMessageFactoryProps {
	message: CompleteMessage;
	currentUserId: string;
}

const ChatMessageFactory = ({ message, currentUserId }: ChatMessageFactoryProps) => {
	const content = message.textMessage?.content ?? "";
	const isSender = currentUserId === message.senderId;
	const isRead = message.seenByMembers.length > 0;
	const isEdited = isMessageEdited(message);
	const formattedTime = useMemo(() => format(message.createdAt, "hh:mm a"), [message.createdAt]);

	if (message.type === "image") {
		return <ChatMessageImage />;
	}

	if (message.type === "text") {
		return (
			<ChatMessageText
				id={message.id}
				conversationId={message.conversationId}
				content={content}
				isSender={isSender}
				timestamp={formattedTime}
				isRead={isRead}
				isEdited={isEdited}
			/>
		);
	}

	return null;
};

export default ChatMessageFactory;
