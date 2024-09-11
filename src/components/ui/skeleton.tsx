import { cn } from "@/utils/general/cn";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn("animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-900", className)}
			{...props}
		/>
	);
}

export default Skeleton;
