"use client";

import { Forward } from "lucide-react";

import { Button } from "@/components/ui/button";

const ForwardTrigger = () => (
	<Button
		size="icon"
		variant="outline"
		className="size-6 rounded-full bg-surface-light-100 text-neutral-500 shadow-md dark:bg-neutral-800 dark:text-neutral-400"
	>
		<Forward size={12} />
		<span className="sr-only">Forward Message</span>
	</Button>
);

export default ForwardTrigger;
