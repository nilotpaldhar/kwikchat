import type { CompleteMessage } from "@/types";

import ChatMessageText from "@/app/messenger/(routes)/chats/_components/chat-message/text";
import ChatMessageImage from "@/app/messenger/(routes)/chats/_components/chat-message/image";

interface ChatMessageFactoryProps {
	message: CompleteMessage;
	currentUserId: string;
}

const ChatMessageFactory = ({ message, currentUserId }: ChatMessageFactoryProps) => {
	const content = message.textMessage?.content ?? "";
	const isSender = currentUserId === message.senderId;
	const isRead = message.seenByMembers.length > 0;

	if (message.type === "image") {
		return <ChatMessageImage />;
	}

	if (message.type === "text") {
		return (
			<ChatMessageText
				content={content}
				isSender={isSender}
				timestamp={message.createdAt}
				isRead={isRead}
			/>
		);
	}

	return null;
};

export default ChatMessageFactory;
