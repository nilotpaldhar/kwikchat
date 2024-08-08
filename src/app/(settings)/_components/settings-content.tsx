import { cn } from "@/utils/general/cn";

const SettingsContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
	children,
	className,
}) => (
	<div
		className={cn(
			"px-4 pb-6 pt-[88px] md:px-8 md:pb-8 md:pt-24 lg:px-0 lg:pb-0 lg:pt-8",
			className
		)}
	>
		{children}
	</div>
);

export default SettingsContent;
