"use client";

import dynamic from "next/dynamic";

import { Theme, PickerProps } from "emoji-picker-react";
import { useTheme } from "next-themes";

import Loader from "@/components/ui/loader";

const EmojiPickerReact = dynamic(() => import("emoji-picker-react"), {
	ssr: false,
	loading: () => <Loader />,
});

const EmojiPicker = ({ ...props }: PickerProps) => {
	const { theme, systemTheme } = useTheme();

	const getTheme = () => {
		if (theme === "system") return systemTheme === "light" ? Theme.LIGHT : Theme.DARK;
		return theme === "light" ? Theme.LIGHT : Theme.DARK;
	};

	return <EmojiPickerReact {...props} theme={getTheme()} />;
};

export default EmojiPicker;
