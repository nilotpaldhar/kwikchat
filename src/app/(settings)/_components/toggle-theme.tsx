"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import { Block, BlockTitle, BlockContent } from "@/components/ui/block";
import ToggleThemeButton from "@/app/(settings)/_components/toggle-theme-button";

const ToggleTheme = () => {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<Block className="space-y-4">
			<BlockTitle>Theme</BlockTitle>
			<BlockContent className="flex items-center space-x-4">
				<ToggleThemeButton
					variant="light"
					active={theme === "light"}
					onClick={() => setTheme("light")}
				/>
				<ToggleThemeButton
					variant="dark"
					active={theme === "dark"}
					onClick={() => setTheme("dark")}
				/>
				<ToggleThemeButton
					variant="system"
					active={theme === "system"}
					onClick={() => setTheme("system")}
				/>
			</BlockContent>
		</Block>
	);
};

export default ToggleTheme;
