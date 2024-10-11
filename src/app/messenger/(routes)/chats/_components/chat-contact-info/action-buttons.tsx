"use client";

import { Button } from "@/components/ui/button";
import { Ban, Trash2 } from "lucide-react";

interface ActionButtonsProps {
	onBlock?: () => void;
	onDeleteChat?: () => void;
}

const ActionButtons = ({ onBlock = () => {}, onDeleteChat = () => {} }: ActionButtonsProps) => (
	<div className="flex flex-col space-y-3 md:flex-row md:space-x-2 md:space-y-0">
		<Button
			variant="outline"
			className="w-full items-center justify-start space-x-2 bg-neutral-100 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-800/80 md:justify-center"
			onClick={onBlock}
		>
			<Ban size={16} />
			<span className="font-semibold">Block Friend</span>
		</Button>
		<Button
			variant="danger"
			className="w-full items-center justify-start space-x-2 md:justify-center"
			onClick={onDeleteChat}
		>
			<Trash2 size={16} />
			<span className="font-semibold">Delete Chat</span>
		</Button>
	</div>
);
export default ActionButtons;
