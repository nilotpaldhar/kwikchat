import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { cn } from "@/utils/general/cn";

interface UIBlockerProps {
	isBlocking?: boolean;
	message?: string;
	spinnerSize?: number;
	className?: string;
	spinnerClassName?: string;
	messageClassName?: string;
}

const UIBlocker = ({
	isBlocking = false,
	message = "Loading...",
	spinnerSize = 16,
	className,
	spinnerClassName,
	messageClassName,
}: UIBlockerProps) => (
	<AnimatePresence>
		{isBlocking && (
			<motion.div
				key="blocker"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.3 }}
				className={cn(
					"absolute inset-0 z-50 flex items-center justify-center bg-surface-light-100 bg-opacity-80 backdrop-blur-sm dark:bg-surface-dark-600 dark:bg-opacity-95",
					className
				)}
			>
				<motion.div
					key="spinner"
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.8, opacity: 0 }}
					transition={{ duration: 0.3 }}
					className={cn(
						"flex select-none items-center space-x-2 text-neutral-900 dark:text-neutral-200",
						spinnerClassName
					)}
				>
					<Loader2 size={spinnerSize} className="animate-spin" />
					<span className={cn("text-sm font-semibold leading-none", messageClassName)}>
						{message}
					</span>
				</motion.div>
			</motion.div>
		)}
	</AnimatePresence>
);

export default UIBlocker;
