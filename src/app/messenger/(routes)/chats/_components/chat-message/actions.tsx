"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import ActionsTrigger from "@/app/messenger/(routes)/chats/_components/chat-message/actions-trigger";
import ReactionTrigger, {
	type ReactionClickData,
} from "@/app/messenger/(routes)/chats/_components/chat-message/reaction-trigger";

import { cn } from "@/utils/general/cn";

interface ChatMessageActionsProps {
	isOpen?: boolean;
	isSender?: boolean;
	onEdit?: () => void;
	onReaction?: (emoji: ReactionClickData) => void;
}

const ChatMessageActions = ({
	isOpen = false,
	isSender = false,
	onEdit = () => {},
	onReaction = () => {},
}: ChatMessageActionsProps) => {
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
					<motion.div
						key="reaction-trigger"
						variants={childVariants}
						className={cn("h-max", isSender && "order-2")}
					>
						<ReactionTrigger
							open={isOpen && openReactionTrigger}
							onOpenChange={setOpenReactionTrigger}
							onReaction={onReaction}
						/>
					</motion.div>
					<motion.div
						key="actions-trigger"
						variants={childVariants}
						className={cn("h-max", isSender && "order-1")}
					>
						<ActionsTrigger
							isSender={isSender}
							open={isOpen && openActionsTrigger}
							onOpenChange={setOpenActionsTrigger}
							onEdit={onEdit}
						/>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ChatMessageActions;
