import { cn } from "@/utils/general/cn";

interface ContainerProps {
	children: React.ReactNode;
	className?: string;
}

const Container = ({ children, className }: ContainerProps) => (
	<div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>
);

export default Container;
