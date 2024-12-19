"use client";

import type { ConversationWithMetadata } from "@/types";

import { useMemo } from "react";

import UserAvatar from "@/components/user/user-avatar";
import ActionMenu from "@/app/messenger/(chat-features)/_components/conversation-tile/action-menu";
import RecentMsgPreview from "@/app/messenger/(chat-features)/_components/conversation-tile/recent-msg-preview";

import { cn } from "@/utils/general/cn";
import generateUserAvatarFallback from "@/utils/user/generate-user-avatar-fallback";
import formatDateBasedOnRecency from "@/utils/general/format-date-based-on-recency";

interface ConversationTileProps extends ConversationWithMetadata {
	isActive?: boolean;
	className?: string;
	onNavigate?: () => void;
}

const ConversationTile = ({
	isActive = false,
	className,
	onNavigate = () => {},
	...conversation
}: ConversationTileProps) => {
	const { id, createdAt, isGroup, participant, groupDetails, recentMessage, unreadMessages } =
		conversation;

	const actionRootHtmlId = `action-root-${id}`;
	const actionPopoverHtmlId = `action-popover-${id}`;

	const icon = useMemo(() => {
		if (isGroup) {
			const src = groupDetails?.icon?.url ?? "/placeholder/group.png";
			const fallback = groupDetails?.name?.charAt(0).toUpperCase() ?? "?";
			return { src, fallback };
		}
		const src = participant?.avatar ?? "/placeholder/user.png";
		const fallback = participant ? generateUserAvatarFallback({ user: participant }) : "?";
		return { src, fallback };
	}, [isGroup, groupDetails?.icon?.url, groupDetails?.name, participant]);

	const title = useMemo(() => {
		if (!isGroup && participant) {
			return participant.displayName ?? participant.username ?? "Unknown";
		}
		return groupDetails?.name ?? "Unknown";
	}, [isGroup, groupDetails?.name, participant]);

	const timestamp = useMemo(() => {
		if (recentMessage?.createdAt) {
			return formatDateBasedOnRecency(recentMessage?.createdAt, false);
		}
		return formatDateBasedOnRecency(createdAt, false);
	}, [createdAt, recentMessage?.createdAt]);

	const isInsideActionContainer = (evtTarget: HTMLElement): boolean =>
		!!evtTarget.closest(`#${actionRootHtmlId}`) || !!evtTarget.closest(`#${actionPopoverHtmlId}`);

	const handleInteraction = (
		evt: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
	) => {
		const target = evt.target as HTMLElement;
		const isClickEvent = evt.type === "click";
		const isKeyboardEvent = evt.type === "keydown";
		const isEnterKey = (evt as React.KeyboardEvent).key === "Enter";

		// Prevent interaction if the event originated from action button
		if (isInsideActionContainer(target)) return;

		if (!isClickEvent && !(isKeyboardEvent && isEnterKey)) return;

		onNavigate();
	};

	return (
		<div
			tabIndex={0}
			role="button"
			onClick={handleInteraction}
			onKeyDown={handleInteraction}
			aria-label={`Open conversation with ${title}`}
			className={cn(
				"group overflow-hidden py-3 transition focus-within:bg-neutral-100 hover:bg-neutral-100 focus-visible:bg-neutral-100 focus-visible:outline-none dark:focus-within:bg-surface-dark-500 dark:hover:bg-surface-dark-500 dark:focus-visible:bg-surface-dark-500",
				isActive && "bg-neutral-100 dark:bg-surface-dark-500",
				className
			)}
		>
			<div className="flex w-full items-center space-x-3">
				<div>
					<UserAvatar src={icon.src} fallback={icon.fallback} />
				</div>
				<div className="flex-1">
					<div className="mb-1 flex items-center space-x-2">
						<div className="flex flex-1 items-center space-x-2">
							<span title={title} className="block text-sm font-medium leading-6">
								<span className="line-clamp-1 font-semibold">{title}</span>
							</span>
							{unreadMessages > 0 ? (
								<div className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-400 px-1.5">
									<span className="block text-[10px] font-bold leading-none text-white">
										{unreadMessages >= 100 ? "99+" : unreadMessages}
									</span>
								</div>
							) : null}
						</div>

						<span className="block text-xs font-semibold capitalize leading-5 text-neutral-500 dark:text-neutral-400">
							{timestamp}
						</span>
					</div>
					<div className="flex items-center space-x-2">
						<div className="flex-1">
							<RecentMsgPreview message={recentMessage} />
						</div>
						<ActionMenu
							id={actionRootHtmlId}
							popoverId={actionPopoverHtmlId}
							isGroupConversation={isGroup}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ConversationTile;

// group-focus-within: group-hover: group-focus:
