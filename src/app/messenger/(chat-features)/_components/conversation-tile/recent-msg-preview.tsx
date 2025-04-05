"use client";

import type { RecentMessage } from "@/types";

import { MessageType } from "@prisma/client";
import { ImageIcon, FileText, MessageSquareOff } from "lucide-react";

interface RecentMsgPreviewProps {
	message: RecentMessage | null;
}

const RecentMsgPreview = ({ message }: RecentMsgPreviewProps) => {
	const getMessagePreview = (): { msgType: MessageType; content: string } | null => {
		if (!message) return null;

		const { isDeleted, textMessage, documentMessage, imageMessage, systemMessage } = message;

		if (isDeleted) return { msgType: MessageType.deleted, content: "This message was deleted." };
		if (systemMessage) return { msgType: MessageType.system, content: systemMessage.content };
		if (textMessage) return { msgType: MessageType.text, content: textMessage.content };
		if (documentMessage) return { msgType: MessageType.document, content: "Shared a document" };
		if (imageMessage)
			return {
				msgType: MessageType.image,
				content: imageMessage.length > 1 ? `Sent ${imageMessage.length} photos` : "Sent a photo",
			};

		return null;
	};

	const preview = getMessagePreview();

	if (!preview) {
		return (
			<div className="flex h-5 items-center overflow-hidden text-neutral-500 dark:text-neutral-400">
				<div className="text-xs font-semibold leading-5">
					<div className="line-clamp-1 italic">No messages yet. Start the conversation!</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-5 items-center space-x-1 overflow-hidden text-neutral-500 dark:text-neutral-400">
			{preview.msgType === MessageType.image && <ImageIcon size={14} />}
			{preview.msgType === MessageType.document && <FileText size={14} />}
			{preview.msgType === MessageType.deleted && <MessageSquareOff size={14} />}
			<div title={preview.content} className="text-xs font-semibold leading-5">
				<div className="line-clamp-1">{preview.content}</div>
			</div>
		</div>
	);
};

export default RecentMsgPreview;
