"use client";

import { useEffect, useState } from "react";

import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

import { cn } from "@/utils/general/cn";
import useDebounce from "@/hooks/use-debounce";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
	delay?: number;
	iconPlacement?: "start" | "end";
	wrapperClassName?: string;
	onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
	delay = 500,
	iconPlacement = "start",
	wrapperClassName,
	className,
	placeholder = "Search",
	onSearch,
	...props
}) => {
	const [searchTerm, setSearchTerm] = useState<string>("");

	// Use the useDebounce hook to get the debounced search term
	const debouncedSearchTerm = useDebounce({ value: searchTerm, delay });

	// Trigger the search function when the debounced search term changes
	useEffect(() => {
		if (debouncedSearchTerm !== undefined) {
			onSearch(debouncedSearchTerm);
		}
	}, [debouncedSearchTerm, onSearch]);

	// Handle input change and update the search term
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	const renderIcon = <SearchIcon size={20} className="text-neutral-500 dark:text-neutral-400" />;

	return (
		<div
			className={cn(
				"flex h-11 items-center space-x-4 rounded-lg border border-neutral-200 bg-surface-light-200 px-4 transition dark:border-neutral-800 dark:bg-surface-dark-500",
				wrapperClassName
			)}
		>
			{iconPlacement === "start" && renderIcon}
			<Input
				value={searchTerm}
				onChange={handleChange}
				placeholder={placeholder}
				className={cn(
					"h-full border-transparent bg-transparent px-0 ring-offset-transparent placeholder:text-neutral-500 focus-visible:ring-transparent dark:border-transparent dark:bg-transparent dark:ring-offset-transparent dark:placeholder:text-neutral-400 dark:focus-visible:ring-transparent",
					className
				)}
				{...props}
			/>
			{iconPlacement === "end" && renderIcon}
		</div>
	);
};

export default SearchBar;
