"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/general/cn";

export type FilterType = "all" | "online";

interface FilterFriendsProps {
	disabled?: boolean;
	onChange: (filter: FilterType) => void;
}

const FilterFriends = ({ disabled = false, onChange }: FilterFriendsProps) => {
	const filters: FilterType[] = ["all", "online"];
	const [activeFilter, setActiveFilter] = useState<FilterType>("all");

	const handleFilterChange = (filter: FilterType) => {
		setActiveFilter(filter);
		onChange(filter);
	};

	return (
		<div className="flex items-center space-x-2">
			{filters.map((filter) => {
				const isActive = filter === activeFilter;
				return (
					<Button
						key={filter}
						variant={isActive ? "primary" : "outline"}
						size="sm"
						onClick={() => handleFilterChange(filter)}
						className={cn(
							"border",
							isActive && "border-transparent",
							!isActive && "dark:bg-neutral-800"
						)}
						disabled={disabled}
					>
						<span className="inline-block capitalize">{filter}</span>
					</Button>
				);
			})}
		</div>
	);
};

export default FilterFriends;
