"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

const CloseSettings = () => {
	const router = useRouter();

	const handleCloseSettings = useCallback(() => {
		router.push("/messenger");
	}, [router]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") handleCloseSettings();
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleCloseSettings]);

	return (
		<div className="fixed">
			<Button
				className="h-auto flex-col space-y-1.5 border-none p-1 text-neutral-500 hover:bg-surface-light-100 dark:text-neutral-400 dark:hover:bg-surface-dark-600"
				variant="outline"
				onClick={handleCloseSettings}
			>
				<span className="flex size-10 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-700">
					<XIcon size={24} />
				</span>
				<span className="font-bold">ESC</span>
			</Button>
		</div>
	);
};

export default CloseSettings;
