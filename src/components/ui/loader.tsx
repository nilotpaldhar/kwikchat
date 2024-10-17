import { cn } from "@/utils/general/cn";

interface LoaderProps {
	containerClassName?: string;
	className?: string;
}

const Loader = ({ containerClassName, className }: LoaderProps) => (
	<div
		className={cn("flex items-center justify-center py-2", containerClassName)}
		role="status"
		aria-label="Loading, please wait..."
	>
		<div className={cn("flex max-w-max items-center justify-center space-x-1.5", className)}>
			<div className="animate-big-bounce size-2.5 rounded-full bg-primary-400" />
			<div className="animate-big-bounce animation-delay-200 size-2.5 rounded-full bg-primary-400" />
			<div className="animate-big-bounce animation-delay-400 size-2.5 rounded-full bg-primary-400" />
		</div>
	</div>
);

export default Loader;
