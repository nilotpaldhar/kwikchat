"use client";

import { MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const ActionsTrigger = () => {
	const triggerClassNames =
		"size-6 rounded-full bg-surface-light-100 text-neutral-500 shadow-md dark:bg-neutral-800 dark:text-neutral-400";
	const actionsClassNames =
		"w-full justify-start border-transparent bg-transparent px-2.5 text-left hover:bg-surface-light-300 dark:border-transparent dark:bg-transparent dark:hover:bg-surface-dark-500";

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button size="icon" variant="outline" className={triggerClassNames}>
					<MoreVertical size={12} />
					<span className="sr-only">Forward Message</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="max-w-32 p-1.5 dark:bg-surface-dark-400"
				side="top"
				sideOffset={4}
				align="center"
				alignOffset={0}
			>
				<Button variant="outline" className={actionsClassNames}>
					<span className="font-semibold capitalize">Star</span>
				</Button>
				<Button variant="outline" className={actionsClassNames}>
					<span className="font-semibold capitalize">Forward</span>
				</Button>
				<Button variant="outline" className={actionsClassNames}>
					<span className="font-semibold capitalize">Delete</span>
				</Button>
			</PopoverContent>
		</Popover>
	);
};

export default ActionsTrigger;
