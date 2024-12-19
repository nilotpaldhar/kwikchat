"use client";

import type { ConversationsFilterType } from "@/types";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/general/cn";

interface ConversationsFilterProps {
	disabled?: boolean;
	className?: string;
	onChange?: (filter: ConversationsFilterType) => void;
}

const ConversationsFilter = ({
	disabled = false,
	className,
	onChange = () => {},
}: ConversationsFilterProps) => {
	const filters: ConversationsFilterType[] = ["all", "group", "unread"];
	const [activeFilter, setActiveFilter] = useState<ConversationsFilterType>("all");

	const handleClick = (filter: ConversationsFilterType) => {
		setActiveFilter(filter);
		onChange(filter);
	};

	return (
		<div className={cn("mb-4 flex items-center space-x-2", className)}>
			{filters.map((filter) => {
				const isActive = filter === activeFilter;

				return (
					<Button
						key={filter}
						disabled={disabled}
						onClick={() => handleClick(filter)}
						variant={isActive ? "primary" : "outline"}
						className={cn("border", isActive && "border-transparent")}
					>
						<span className="inline-block capitalize">{filter}</span>
					</Button>
				);
			})}
		</div>
	);
};

export default ConversationsFilter;
