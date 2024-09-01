"use client";

import { Check, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { cn } from "@/utils/general/cn";
import {
	useRemoveFriendRequest,
	useAcceptFriendRequest,
	useRejectFriendRequest,
} from "@/hooks/use-friend-request";

interface FriendRequestActionProps {
	friendRequestId: string;
	className?: string;
}

const btnClassNames = `size-7 rounded-full border-transparent bg-neutral-100 hover:bg-neutral-200 dark:border-transparent dark:bg-neutral-900 dark:hover:bg-neutral-800`;

const RemoveFriendRequest = ({ friendRequestId, className }: FriendRequestActionProps) => {
	const { mutate } = useRemoveFriendRequest();

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						size="icon"
						variant="outline"
						className={cn(btnClassNames, "text-red-600 dark:text-red-600", className)}
						onClick={() => mutate(friendRequestId)}
					>
						<XIcon size={14} />
						<span className="sr-only">Remove Friend Request</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent>Cancel</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

const AcceptFriendRequest = ({ friendRequestId, className }: FriendRequestActionProps) => {
	const { mutate } = useAcceptFriendRequest();

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						size="icon"
						variant="outline"
						className={cn(btnClassNames, "text-green-600 dark:text-green-600", className)}
						onClick={() => mutate(friendRequestId)}
					>
						<Check size={14} />
						<span className="sr-only">Accept Friend Request</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent>Accept</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

const RejectFriendRequest = ({ friendRequestId, className }: FriendRequestActionProps) => {
	const { mutate } = useRejectFriendRequest();

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						size="icon"
						variant="outline"
						className={cn(btnClassNames, "text-red-600 dark:text-red-600", className)}
						onClick={() => mutate(friendRequestId)}
					>
						<XIcon size={14} />
						<span className="sr-only">Reject Friend Request</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent>Reject</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export { RemoveFriendRequest, AcceptFriendRequest, RejectFriendRequest };
