import Skeleton from "@/components/ui/skeleton";
import { cn } from "@/utils/general/cn";

interface LoadingSkeletonProps {
	count?: number;
	className?: string;
	wrapperClassName?: string;
}

const LoadingSkeleton = ({ count = 10, wrapperClassName, className }: LoadingSkeletonProps) => {
	const items = Array.from({ length: count }, (_, index) => index + 1);

	return (
		<div className={cn("w-full overflow-hidden", wrapperClassName)}>
			<ul className="flex flex-col space-y-2">
				{items.map((item) => (
					<li key={item}>
						<div className={cn("flex h-[72px] items-center", className)}>
							<div className="flex w-full items-center space-x-3">
								<Skeleton className="size-11 rounded-full" />
								<div className="flex h-12 flex-1 flex-col justify-center space-y-2.5">
									<div className="flex items-center justify-between">
										<Skeleton className="h-4 w-[70px]" />
										<Skeleton className="h-4 w-[30px]" />
									</div>
									<Skeleton className="h-4 w-full max-w-40" />
								</div>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default LoadingSkeleton;
