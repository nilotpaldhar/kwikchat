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
			"relative flex size-14 items-center justify-center rounded-full border border-transparent bg-slate-500 dark:border-neutral-700",
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
				"absolute -top-1 right-0 hidden size-5 items-center justify-center rounded-full bg-primary-400 text-white",
				active && "flex"
			)}
		>
			<Check size={12} />
		</span>
		{variant === "system" && <RefreshCcw size={20} className="text-white" />}
	</button>
);

export default ToggleThemeButton;
