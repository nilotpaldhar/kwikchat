"use client";

import { Check, RefreshCcw } from "lucide-react";
import { cn } from "@/utils/general/cn";

interface ToggleThemeButtonProps {
	variant: "light" | "dark" | "system";
	active?: boolean;
	onClick?: () => void;
}

const ToggleThemeButton = ({
	variant,
	active = false,
	onClick = () => {},
}: ToggleThemeButtonProps) => (
	<button
		type="button"
		onClick={onClick}
		className={cn(
			"relative flex items-center justify-center size-14 rounded-full bg-slate-500 border border-transparent dark:border-neutral-700",
			variant === "light" && "bg-surface-light-100",
			(variant === "dark" || variant === "system") && "bg-surface-dark-600",
			active && "border-primary-400 dark:border-primary-400"
		)}
	>
		<span className="sr-only">
			{variant === "light" && "Light Mode"}
			{variant === "dark" && "Dark Mode"}
			{variant === "system" && "System"}
		</span>
		<span
			className={cn(
				"absolute -top-1 right-0 items-center justify-center size-5 bg-primary-400 rounded-full text-white hidden",
				active && "flex"
			)}
		>
			<Check size={12} />
		</span>
		{variant === "system" && <RefreshCcw size={20} className="text-white" />}
	</button>
);

export default ToggleThemeButton;
