import Skeleton from "@/components/ui/skeleton";
import { cn } from "@/utils/general/cn";

interface GroupMembersSkeletonProps {
	count?: number;
	className?: string;
	wrapperClassName?: string;
}

const GroupMembersSkeleton = ({
	count = 3,
	wrapperClassName,
	className,
}: GroupMembersSkeletonProps) => {
	const items = Array.from({ length: count }, (_, index) => index + 1);

	return (
		<ul className={cn("flex flex-col space-y-2", wrapperClassName)}>
			{items.map((item) => (
				<li key={item}>
					<Skeleton className={cn("h-14 w-full rounded-lg", className)} />
				</li>
			))}
		</ul>
	);
};

export default GroupMembersSkeleton;
