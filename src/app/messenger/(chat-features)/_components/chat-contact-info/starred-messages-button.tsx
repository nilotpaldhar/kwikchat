"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, Star } from "lucide-react";

const StarredMessagesButton = ({ onClick = () => {} }: { onClick?: () => void }) => (
	<Button
		variant="outline"
		className="space-x-2 dark:border-neutral-700/50 dark:bg-transparent dark:hover:bg-transparent"
		onClick={onClick}
	>
		<Star size={16} />
		<span className="flex-1 text-left font-semibold">Starred Messages</span>
		<ChevronRight size={16} />
	</Button>
);

export default StarredMessagesButton;
