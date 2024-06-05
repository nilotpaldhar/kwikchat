import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/general/cn";

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className }) => (
	<div className={cn("flex flex-col space-y-10", className)}>{children}</div>
);

const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className }) => (
	<div className={cn("flex flex-col items-center space-y-3", className)}>{children}</div>
);

const CardIcon = ({ icon: Icon }: { icon: LucideIcon }) => (
	<div className="flex justify-center items-center size-24 rounded-full bg-gradient-to-b from-primary-100/60 to-transparent dark:from-surface-dark-500/60">
		<div className="flex justify-center items-center size-16 rounded-full border bg-surface-light-100 border-neutral-200 text-neutral-500 dark:bg-surface-dark-600 dark:border-neutral-900 dark:text-neutral-300">
			<Icon size={32} />
		</div>
	</div>
);

const CardTitle: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className }) => (
	<h1 className={cn("heading-3 text-center", className)}>{children}</h1>
);

const CardDescription: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
	children,
	className,
}) => (
	<p className={cn("paragraph text-center mt-2 text-neutral-700 dark:text-neutral-300", className)}>
		{children}
	</p>
);

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className }) => (
	<div className={cn("flex flex-col space-y-10", className)}>{children}</div>
);

export { Card, CardHeader, CardDescription, CardIcon, CardTitle, CardContent };
