"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import Skeleton from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface ThemeToggleProps {
	side?: "bottom" | "top" | "right" | "left";
	sideOffset?: number;
	align?: "center" | "end" | "start";
	alignOffset?: number;
	children: React.ReactNode;
}

const ThemeToggle = ({
	side = "right",
	sideOffset = 8,
	align = "center",
	alignOffset = 0,
	children,
}: ThemeToggleProps) => {
	const { setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <Skeleton className="size-11 rounded-full" />;
	}

	return (
		<Popover>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent
				className="max-w-32 p-1.5"
				side={side}
				sideOffset={sideOffset}
				align={align}
				alignOffset={alignOffset}
			>
				{["light", "dark", "system"].map((colorMode) => (
					<Button
						key={colorMode}
						variant="outline"
						className="w-full justify-start border-transparent bg-transparent text-left hover:bg-surface-light-300 dark:border-transparent dark:hover:bg-surface-dark-500"
						onClick={() => setTheme(colorMode)}
					>
						<span className="capitalize">{colorMode}</span>
					</Button>
				))}
			</PopoverContent>
		</Popover>
	);
};

export default ThemeToggle;
