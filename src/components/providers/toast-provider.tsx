"use client";

import type { ThemeOptions } from "@prisma/client";

import { Toaster } from "sonner";
import { CheckCircle2, Info, CircleX, OctagonAlert, Loader2 } from "lucide-react";

import { useTheme } from "next-themes";

const ToastProvider = () => {
	const { theme } = useTheme();

	return (
		<Toaster
			richColors
			position="top-right"
			theme={theme as ThemeOptions}
			icons={{
				success: <CheckCircle2 size={18} />,
				info: <Info size={18} />,
				error: <CircleX size={18} />,
				warning: <OctagonAlert size={18} />,
				loading: <Loader2 size={18} className="animate-spin" />,
			}}
		/>
	);
};

export default ToastProvider;
