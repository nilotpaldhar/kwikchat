import type { FriendRequestWithRequestType } from "@/types";

import Skeleton from "@/components/ui/skeleton";
import FriendRequest from "@/app/messenger/(routes)/friends/_components/friend-request";

import { cn } from "@/utils/general/cn";

interface FriendRequestListProps {
	collection: FriendRequestWithRequestType[];
	showUsername?: boolean;
	className?: string;
	itemClassName?: string;
}

interface FriendRequestListSkeletonProps {
	count?: number;
	className?: string;
	wrapperClassName?: string;
}

const FriendRequestList = ({
	collection,
	showUsername,
	className,
	itemClassName,
}: FriendRequestListProps) => (
	<div className={cn("flex flex-col space-y-3", className)}>
		{collection.map((item) => (
			<FriendRequest
				key={item.id}
				{...item}
				className={itemClassName}
				showUsername={showUsername}
			/>
		))}
	</div>
);

const FriendRequestListSkeleton = ({
	count = 10,
	className,
	wrapperClassName,
}: FriendRequestListSkeletonProps) => {
	const items = Array.from({ length: count }, (_, index) => index + 1);

	return (
		<ul className={cn("flex flex-col space-y-3", wrapperClassName)}>
			{items.map((item) => (
				<li key={item}>
					<div className={cn("flex items-center space-x-3 rounded-lg px-2 py-3", className)}>
						<Skeleton className="size-11 rounded-full" />
						<div className="flex-1 space-y-2">
							<Skeleton className="h-4 w-[120px] sm:w-[160px]" />
							<Skeleton className="h-4 w-[70px] sm:w-[100px]" />
						</div>
						<div className="flex items-center space-x-2">
							<Skeleton className="size-7 rounded-full" />
							<Skeleton className="size-7 rounded-full" />
						</div>
					</div>
				</li>
			))}
		</ul>
	);
};

export { FriendRequestList, FriendRequestListSkeleton };
