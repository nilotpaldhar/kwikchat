"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import ChatMessageActionsMenu from "@/app/messenger/(routes)/chats/_components/chat-message/chat-message-actions-menu";
import ChatMessageReactionButton, {
	type ReactionClickData,
} from "@/app/messenger/(routes)/chats/_components/chat-message/chat-message-reaction-button";

import { cn } from "@/utils/general/cn";

interface ChatMessageInteractionBarProps {
	isOpen: boolean;
	isSender: boolean;
	isStarred: boolean;
	isDeleted: boolean;
	onEdit?: () => void;
	onReaction?: (emoji: ReactionClickData) => void;
	onToggleStar?: () => void;
	onDelete?: () => void;
}

const ChatMessageInteractionBar = ({
	isOpen,
	isSender,
	isStarred,
	isDeleted,
	onEdit = () => {},
	onReaction = () => {},
	onToggleStar = () => {},
	onDelete = () => {},
}: ChatMessageInteractionBarProps) => {
	const [openActionsTrigger, setOpenActionsTrigger] = useState(false);
	const [openReactionTrigger, setOpenReactionTrigger] = useState(false);

	const containerVariants = {
		open: {
			opacity: 1,
			transition: {
				staggerChildren: 0.15,
				delayChildren: 0.1,
			},
		},
		closed: {
			opacity: 0,
			transition: { duration: 0.3 },
		},
	};

	const childVariants = {
		open: { opacity: 1, transformOrigin: "center", transition: { duration: 0.2 } },
		closed: { opacity: 0, transformOrigin: "center", transition: { duration: 0.1 } },
	};

	const handleToggleStar = () => {
		setOpenActionsTrigger(false);
		onToggleStar();
	};

	const handleDelete = () => {
		setOpenActionsTrigger(false);
		onDelete();
	};

	useEffect(() => {
		if (!isOpen) {
			setOpenActionsTrigger(false);
			setOpenReactionTrigger(false);
		}
	}, [isOpen]);

	return (
		<AnimatePresence mode="wait">
			{isOpen && (
				<motion.div
					key="chat-message-actions"
					initial="closed"
					animate="open"
					exit="closed"
					variants={containerVariants}
					className={cn(
						"mx-2 flex h-max gap-x-2 overflow-hidden px-1 py-1.5",
						isSender && "order-1"
					)}
				>
					{!isDeleted && (
						<motion.div
							key="reaction-trigger"
							variants={childVariants}
							className={cn("h-max", isSender && "order-2")}
						>
							<ChatMessageReactionButton
								open={isOpen && openReactionTrigger}
								onOpenChange={setOpenReactionTrigger}
								onReaction={onReaction}
							/>
						</motion.div>
					)}

					<motion.div
						key="actions-trigger"
						variants={childVariants}
						className={cn("h-max", isSender && "order-1")}
					>
						<ChatMessageActionsMenu
							isSender={isSender}
							isStarred={isStarred}
							isDeleted={isDeleted}
							open={isOpen && openActionsTrigger}
							onOpenChange={setOpenActionsTrigger}
							onEdit={onEdit}
							onToggleStar={handleToggleStar}
							onDelete={handleDelete}
						/>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ChatMessageInteractionBar;
