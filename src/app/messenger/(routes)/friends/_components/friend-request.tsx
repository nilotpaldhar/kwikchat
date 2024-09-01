import type { FriendRequestWithRequestType } from "@/types";

import { Minus } from "lucide-react";

import UserAvatar from "@/components/user/user-avatar";
import {
	RemoveFriendRequest,
	AcceptFriendRequest,
	RejectFriendRequest,
} from "@/app/messenger/(routes)/friends/_components/friend-request-actions";

import { cn } from "@/utils/general/cn";

interface FriendRequestProps extends FriendRequestWithRequestType {
	showUsername?: boolean;
	className?: string;
}

const FriendRequest = ({
	id,
	requestType,
	receiver,
	sender,
	showUsername = true,
	className,
}: FriendRequestProps) => {
	const isOutgoingRequest = requestType === "outgoing";
	const senderOrReceiver = isOutgoingRequest ? receiver : sender;

	if (!senderOrReceiver || !senderOrReceiver.username) return null;

	return (
		<div
			className={cn(
				"group flex select-none items-center space-x-3 rounded-lg px-2 py-3 transition hover:bg-neutral-100 dark:hover:bg-neutral-900",
				className
			)}
		>
			<div>
				<UserAvatar
					src={senderOrReceiver.avatar}
					fallback={
						senderOrReceiver?.displayName
							? senderOrReceiver.displayName.charAt(0)
							: senderOrReceiver.username?.charAt(0)
					}
				/>
			</div>
			<div className="flex-1">
				<div className="flex items-center space-x-2 text-sm font-medium leading-6">
					<div className="max-w-32 truncate">{senderOrReceiver.displayName}</div>
					{showUsername && (
						<div className="hidden origin-left items-center space-x-2 transition duration-300 group-hover:scale-100 group-hover:opacity-100 sm:flex hover-hover:scale-75 hover-hover:opacity-0">
							<Minus size={16} />
							<span className="text-xs">{senderOrReceiver.username}</span>
						</div>
					)}
				</div>
				<div className="text-xs font-semibold text-neutral-500">
					<span>{isOutgoingRequest ? "Outgoing" : "Incoming"}</span>
					<span className="ml-1 hidden sm:inline">Friend Request</span>
				</div>
			</div>
			<div className="flex items-center space-x-2">
				{isOutgoingRequest ? (
					<RemoveFriendRequest friendRequestId={id} />
				) : (
					<>
						<AcceptFriendRequest friendRequestId={id} />
						<RejectFriendRequest friendRequestId={id} />
					</>
				)}
			</div>
		</div>
	);
};

export default FriendRequest;
