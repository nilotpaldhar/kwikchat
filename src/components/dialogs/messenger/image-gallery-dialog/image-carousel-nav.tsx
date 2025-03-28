"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/general/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselNavProps {
	canPrev?: boolean;
	canNext?: boolean;
	onPrev: () => void;
	onNext: () => void;
}

const ImageCarouselNav = ({
	canPrev = true,
	canNext = true,
	onPrev,
	onNext,
}: ImageCarouselNavProps) => {
	const baseClassName = `absolute top-1/2 hidden w-24 -translate-y-1/2 lg:flex items-center justify-center`;
	const btnClassName = `rounded-full bg-transparent text-neutral-500 hover:bg-surface-light-100 dark:border-neutral-700 dark:bg-transparent dark:text-neutral-400 dark:hover:bg-surface-dark-300`;

	return (
		<>
			<div className={cn(baseClassName, "left-0")}>
				<Button
					variant="outline"
					size="icon"
					disabled={!canPrev}
					onClick={onPrev}
					className={btnClassName}
				>
					<ChevronLeft size={16} />
					<span className="sr-only">Previous</span>
				</Button>
			</div>
			<div className={cn(baseClassName, "right-0")}>
				<Button
					variant="outline"
					size="icon"
					disabled={!canNext}
					onClick={onNext}
					className={btnClassName}
				>
					<ChevronRight size={16} />
					<span className="sr-only">Next</span>
				</Button>
			</div>
		</>
	);
};

export default ImageCarouselNav;
