"use client";

import { MemberRole } from "@prisma/client";
import { MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

import useGroupMembershipStore from "@/store/use-group-membership-store";

interface ChatMessageActionsMenuProps {
	open: boolean;
	isSender: boolean;
	isStarred: boolean;
	isDeleted: boolean;
	onOpenChange?: (open: boolean) => void;
	onEdit?: () => void;
	onToggleStar?: () => void;
	onDelete?: () => void;
}

const ChatMessageActionsMenu = ({
	open,
	isSender,
	isStarred,
	isDeleted,
	onOpenChange = () => {},
	onEdit = () => {},
	onToggleStar = () => {},
	onDelete = () => {},
}: ChatMessageActionsMenuProps) => {
	const isGroupAdmin = useGroupMembershipStore().membership?.role === MemberRole.admin;
	const isEditable = (isSender || isGroupAdmin) && !isDeleted;

	const triggerClassNames =
		"size-6 rounded-full bg-surface-light-100 text-neutral-500 shadow-md dark:bg-neutral-800 dark:text-neutral-400";
	const actionsClassNames =
		"w-full justify-start border-transparent bg-transparent px-2.5 text-left hover:bg-surface-light-300 dark:border-transparent dark:bg-transparent dark:hover:bg-surface-dark-500";

	return (
		<Popover open={open} onOpenChange={onOpenChange}>
			<PopoverTrigger asChild>
				<Button size="icon" variant="outline" className={triggerClassNames}>
					<MoreVertical size={12} />
					<span className="sr-only">More</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="max-w-32 p-1.5 dark:bg-surface-dark-400"
				side="top"
				sideOffset={4}
				align="center"
				alignOffset={0}
			>
				{!isDeleted && (
					<Button variant="outline" className={actionsClassNames} onClick={onToggleStar}>
						<span className="font-semibold capitalize">{!isStarred ? "Star" : "Unstar"}</span>
					</Button>
				)}
				{isEditable && (
					<Button variant="outline" className={actionsClassNames} onClick={onEdit}>
						<span className="font-semibold capitalize">Edit</span>
					</Button>
				)}
				<Button variant="outline" className={actionsClassNames} onClick={onDelete}>
					<span className="font-semibold capitalize">Delete</span>
				</Button>
			</PopoverContent>
		</Popover>
	);
};

export default ChatMessageActionsMenu;
