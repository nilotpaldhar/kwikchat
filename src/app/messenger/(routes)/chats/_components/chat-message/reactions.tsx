/* eslint-disable @next/next/no-img-element */

"use client";

import type { MessageReaction } from "@prisma/client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

import groupReactionsByType from "@/utils/messenger/group-reactions-by-type";

interface ChatMessageReactionsProps {
	reactions: MessageReaction[];
}

const ChatMessageReactions = ({ reactions }: ChatMessageReactionsProps) => {
	const groupedReactions = useMemo(() => groupReactionsByType(reactions), [reactions]);

	return (
		<AnimatePresence>
			{reactions.length > 0 && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					className="absolute -top-4 left-1 !m-0 min-h-6 max-w-max rounded-full bg-surface-light-100 px-1.5 py-1 shadow-lg"
				>
					<div className="flex items-center space-x-1">
						<ul className="flex items-center space-x-1">
							{groupedReactions.map((reaction) => (
								<li key={reaction.type}>
									<div className="size-4 overflow-hidden rounded-full">
										<img
											src={reaction.emojiImageUrl}
											alt={reaction.type}
											className="block size-4"
										/>
									</div>
								</li>
							))}
						</ul>
						<div className="px-0.5">
							<span className="block font-mono text-xs font-semibold leading-none text-neutral-500">
								{reactions.length >= 100 ? "99+" : reactions.length}
							</span>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ChatMessageReactions;
