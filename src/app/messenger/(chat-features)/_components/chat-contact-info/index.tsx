"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

import ContactPanel from "@/app/messenger/(chat-features)/_components/chat-contact-info/contact-panel";
import StarredMessagesPanel from "@/app/messenger/(chat-features)/_components/chat-contact-info/starred-messages-panel";

import useChatInfoStore from "@/store/use-chat-info-store";
import { useParticipantInConversationQuery } from "@/hooks/tanstack-query/use-conversation";

interface ChatContactInfoProps {
	conversationId: string;
}

type ViewMode = "default" | "starred_messages";

const ChatContactInfo = ({ conversationId }: ChatContactInfoProps) => {
	const [viewMode, setViewMode] = useState<ViewMode>("default");

	const { data, isLoading, isError, error, refetch } =
		useParticipantInConversationQuery(conversationId);
	const participant = data?.data;

	const { isOpen, type, onClose } = useChatInfoStore();
	const isContactInfoOpen = isOpen && type === "USER_INFO";

	useEffect(() => {
		if (!isContactInfoOpen) setViewMode("default");
	}, [isContactInfoOpen]);

	return (
		<Sheet open={isContactInfoOpen} onOpenChange={onClose}>
			<SheetContent
				side="right"
				className="bg-surface-light-100 p-0 dark:bg-surface-dark-400"
				closeClassName="hidden"
			>
				<SheetHeader className="sr-only">
					<SheetTitle>Contact Info</SheetTitle>
					<SheetDescription>Contact Info</SheetDescription>
				</SheetHeader>
				<AnimatePresence mode="wait">
					{viewMode === "default" && (
						<motion.div
							key="contact_panel"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
						>
							<ContactPanel
								participant={participant}
								isLoading={isLoading}
								isError={isError}
								error={error}
								refetch={refetch}
								onClose={onClose}
								onSharedMedia={() => {}}
								onStarredMessage={() => setViewMode("starred_messages")}
								onBlock={() => {}}
								onDeleteChat={() => {}}
							/>
						</motion.div>
					)}

					{viewMode === "starred_messages" && (
						<motion.div
							key="starred_messages_panel"
							initial={{ opacity: 0, x: "100%" }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: "100%" }}
							transition={{ duration: 0.3 }}
						>
							<StarredMessagesPanel
								conversationId={conversationId}
								onBack={() => setViewMode("default")}
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</SheetContent>
		</Sheet>
	);
};

export default ChatContactInfo;
