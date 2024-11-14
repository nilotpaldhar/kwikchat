"use client";

import { Button } from "@/components/ui/button";
import { Info, MoreVertical } from "lucide-react";

import { cn } from "@/utils/general/cn";
import useChatInfoStore from "@/store/use-chat-info-store";

const GroupChatHeaderActions = () => {
	const toggleContactInfo = useChatInfoStore().toggleOpen;

	const btnClassNames = `border-transparent text-neutral-700 dark:border-transparent dark:text-neutral-300`;

	return (
		<div className="flex items-center space-x-5">
			<Button
				variant="outline"
				size="icon"
				className={cn(btnClassNames, "hidden md:flex")}
				onClick={() => toggleContactInfo("GROUP_DETAILS")}
			>
				<Info size={20} />
				<span className="sr-only">Contact Info</span>
			</Button>
			<Button variant="outline" size="icon" className={btnClassNames}>
				<MoreVertical size={20} />
				<span className="sr-only">More</span>
			</Button>
		</div>
	);
};

export default GroupChatHeaderActions;
