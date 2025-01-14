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

import DetailsPanel from "@/app/messenger/(chat-features)/_components/group-chat-details/details-panel";
import StarredMessagesPanel from "@/app/messenger/(chat-features)/_components/group-chat-details/starred-messages-panel";

import useChatInfoStore from "@/store/use-chat-info-store";
import useMessengerDialogStore from "@/store/use-messenger-dialog-store";

import useCurrentUser from "@/hooks/tanstack-query/use-current-user";
import { useGroupConversationDetailsQuery } from "@/hooks/tanstack-query/use-conversation";

interface GroupChatDetailsProps {
	conversationId: string;
}

type ViewMode = "default" | "starred_messages";

const GroupChatDetails = ({ conversationId }: GroupChatDetailsProps) => {
	const [viewMode, setViewMode] = useState<ViewMode>("default");
	const openDialog = useMessengerDialogStore().onOpen;

	const { data: { data: currentUser } = {} } = useCurrentUser();
	const { data, isLoading, isError, error, refetch } =
		useGroupConversationDetailsQuery(conversationId);
	const overview = data?.data;

	const { isOpen, type, onClose } = useChatInfoStore();
	const isGroupDetailsOpen = isOpen && type === "GROUP_DETAILS";

	useEffect(() => {
		if (!isGroupDetailsOpen) setViewMode("default");
	}, [isGroupDetailsOpen]);

	return (
		<Sheet open={isGroupDetailsOpen} onOpenChange={onClose}>
			<SheetContent
				side="right"
				className="bg-surface-light-100 p-0 dark:bg-surface-dark-400"
				closeClassName="hidden"
			>
				<SheetHeader className="sr-only">
					<SheetTitle>Group Info</SheetTitle>
					<SheetDescription>Group Info</SheetDescription>
				</SheetHeader>
				<AnimatePresence mode="wait">
					{viewMode === "default" && (
						<motion.div
							key="details_panel"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
						>
							<DetailsPanel
								overview={overview}
								isGroupCreator={overview?.creator.id === currentUser?.id}
								isLoading={isLoading}
								isError={isError}
								error={error}
								refetch={refetch}
								onClose={onClose}
								onGroupExit={() =>
									openDialog("EXIT_GROUP", {
										groupConversationToExit: {
											conversationId: overview?.id,
											name: overview?.name,
										},
									})
								}
								onGroupDelete={() =>
									openDialog("DELETE_GROUP", {
										groupConversationToExit: {
											conversationId: overview?.id,
											name: overview?.name,
										},
									})
								}
								onSharedMedia={() => {}}
								onStarredMessage={() => setViewMode("starred_messages")}
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

export default GroupChatDetails;
