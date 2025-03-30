"use client";

import type { FriendWithFriendship } from "@/types";

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
import SharedMediaPanel from "@/app/messenger/(chat-features)/_components/chat-contact-info/shared-media-panel";
import StarredMessagesPanel from "@/app/messenger/(chat-features)/_components/chat-contact-info/starred-messages-panel";

import useChatInfoStore from "@/store/use-chat-info-store";
import useMessengerDialogStore from "@/store/use-messenger-dialog-store";
import { useParticipantInConversationQuery } from "@/hooks/tanstack-query/use-conversation";

interface ChatContactInfoProps {
	conversationId: string;
}

type ViewMode = "default" | "shared_media" | "starred_messages";

const ChatContactInfo = ({ conversationId }: ChatContactInfoProps) => {
	const [viewMode, setViewMode] = useState<ViewMode>("default");
	const { data, isLoading, isError, error, refetch } =
		useParticipantInConversationQuery(conversationId);
	const { isOpen, type, onClose } = useChatInfoStore();
	const openDialog = useMessengerDialogStore().onOpen;

	const participant = data?.data;
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
								onSharedMedia={() => setViewMode("shared_media")}
								onStarredMessage={() => setViewMode("starred_messages")}
								onBlock={() => {
									if (participant) {
										openDialog("BLOCK_FRIEND", {
											friendToBlock: { ...participant, friendship: {} } as FriendWithFriendship,
										});
									}
								}}
								onDeleteChat={() =>
									openDialog("DELETE_CONVERSATION", {
										conversationToDelete: { conversationId },
									})
								}
							/>
						</motion.div>
					)}

					{viewMode === "shared_media" && (
						<motion.div
							key="shared_media_panel"
							initial={{ opacity: 0, x: "100%" }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: "100%" }}
							transition={{ duration: 0.3 }}
						>
							<SharedMediaPanel
								conversationId={conversationId}
								onBack={() => setViewMode("default")}
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
