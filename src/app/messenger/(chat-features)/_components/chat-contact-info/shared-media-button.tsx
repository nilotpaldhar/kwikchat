"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, ImageIcon } from "lucide-react";

const SharedMediaButton = ({ onClick = () => {} }: { onClick?: () => void }) => (
	<Button
		variant="outline"
		className="space-x-2 dark:border-neutral-700/50 dark:bg-transparent dark:hover:bg-transparent"
		onClick={onClick}
	>
		<ImageIcon size={16} />
		<span className="flex-1 text-left font-semibold">Shared Media</span>
		<ChevronRight size={16} />
	</Button>
);

export default SharedMediaButton;
