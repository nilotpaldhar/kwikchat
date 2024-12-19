"use client";

import { useEffect, useState } from "react";

import Skeleton from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

import BlockConfirm from "@/app/messenger/_components/block-confirm";

interface MoreActionsProps {
	username: string;
	side?: "bottom" | "top" | "right" | "left";
	sideOffset?: number;
	align?: "center" | "end" | "start";
	alignOffset?: number;
	children: React.ReactNode;
	onBlock?: () => void;
	onRemoveFriend?: () => void;
}

const MoreActions = ({
	username,
	side = "top",
	sideOffset = 8,
	align = "end",
	alignOffset = 0,
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
		"w-full justify-start border-transparent bg-transparent text-left font-semibold text-red-600 hover:bg-red-600 hover:text-white dark:border-transparent dark:text-red-600 dark:hover:bg-red-600 dark:hover:text-neutral-200";

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
				<BlockConfirm username={username} onBlock={onBlock}>
					<Button variant="outline" className={btnClassName}>
						Block
					</Button>
				</BlockConfirm>
			</PopoverContent>
		</Popover>
	);
};

export default MoreActions;
