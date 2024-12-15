import Skeleton from "@/components/ui/skeleton";
import { cn } from "@/utils/general/cn";

interface LoadingSkeletonProps {
	count?: number;
	className?: string;
}

const LoadingSkeleton = ({ count = 10, className }: LoadingSkeletonProps) => {
	const items = Array.from({ length: count }, (_, index) => index + 1);

	return (
		<div className={cn("w-full overflow-hidden", className)}>
			<ul className="flex items-center space-x-2">
				{items.map((item) => (
					<li key={item}>
						<Skeleton className="size-11 rounded-full" />
					</li>
				))}
			</ul>
		</div>
	);
};

export default LoadingSkeleton;
