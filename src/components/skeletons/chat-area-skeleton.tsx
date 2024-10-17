import Skeleton from "@/components/ui/skeleton";

import { cn } from "@/utils/general/cn";

interface ChatSkeletonProps {
	isSender?: boolean;
	className?: string;
	skeletonClassName?: string;
}

const ChatSkeleton = ({ isSender = false, className, skeletonClassName }: ChatSkeletonProps) => (
	<div className={cn("flex", isSender ? "justify-end" : "justify-start", className)}>
		<Skeleton
			className={cn(
				"h-12 w-full max-w-64 rounded-xl bg-neutral-200 dark:bg-neutral-800/50 sm:max-w-xs lg:max-w-md xl:max-w-xl 3xl:max-w-3xl",
				isSender ? "rounded-tr-none" : "rounded-tl-none",
				skeletonClassName
			)}
		/>
	</div>
);

const ChatAreaSkeleton = () => (
	<div className="flex flex-col gap-y-4">
		<ChatSkeleton skeletonClassName="w-[400px]" />
		<ChatSkeleton skeletonClassName="h-24" />
		<ChatSkeleton isSender skeletonClassName="h-24" />
		<ChatSkeleton skeletonClassName="w-[300px]" />
		<ChatSkeleton isSender skeletonClassName="w-[300px]" />
		<ChatSkeleton isSender skeletonClassName="w-[500px]" />
		<ChatSkeleton skeletonClassName="w-[200px]" />
		<ChatSkeleton skeletonClassName="w-[350px]" />
		<ChatSkeleton isSender skeletonClassName="h-24" />
	</div>
);

export default ChatAreaSkeleton;
