"use client";

import { useEffect, useState } from "react";

import Skeleton from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface MoreActionsProps {
	side?: "bottom" | "top" | "right" | "left";
	sideOffset?: number;
	align?: "center" | "end" | "start";
	alignOffset?: number;
	children: React.ReactNode;
	onBlock?: () => void;
	onRemoveFriend?: () => void;
}

const MoreActions = ({
	side = "bottom",
	sideOffset = 8,
	align = "start",
	alignOffset = -4,
	children,
	onBlock = () => {},
	onRemoveFriend = () => {},
}: MoreActionsProps) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <Skeleton className="size-11 rounded-full" />;
	}

	const btnClassName =
		"w-full justify-start space-x-2 border-transparent bg-transparent px-1.5 text-left hover:bg-surface-light-300 dark:border-transparent dark:hover:bg-surface-dark-500";

	return (
		<Popover>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent
				className="max-w-40 p-1.5"
				side={side}
				sideOffset={sideOffset}
				align={align}
				alignOffset={alignOffset}
			>
				<Button variant="outline" className={btnClassName} onClick={onRemoveFriend}>
					Remove Friend
				</Button>
				<Button variant="outline" className={btnClassName} onClick={onBlock}>
					Block
				</Button>
			</PopoverContent>
		</Popover>
	);
};

export default MoreActions;
