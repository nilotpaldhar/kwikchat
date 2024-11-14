"use client";

import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/utils/general/cn";

const GroupMembers = ({ total }: { total: number }) => {
	const items = Array.from({ length: total }, (_, index) => index + 1);

	return (
		<div>
			<ScrollArea className={cn(total > 3 ? "h-48" : "h-auto")}>
				<ul className={cn("flex flex-col space-y-3", total > 3 && "pr-3")}>
					{items.map((item) => (
						<li key={item} className="h-14 w-full rounded-lg bg-white dark:bg-surface-dark-400" />
					))}
				</ul>
			</ScrollArea>
		</div>
	);
};

export default GroupMembers;
