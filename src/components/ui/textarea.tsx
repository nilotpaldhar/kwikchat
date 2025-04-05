import * as React from "react";

import { cn } from "@/utils/general/cn";

export type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
	({ className, ...props }, ref) => (
		<textarea
			className={cn(
				"flex w-full rounded-md border border-neutral-200 bg-surface-light-100 px-3 py-2 text-sm ring-offset-surface-light-100 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-surface-dark-600 dark:ring-offset-surface-dark-600 dark:placeholder:text-neutral-600 dark:focus-visible:ring-primary-200",
				className
			)}
			ref={ref}
			{...props}
		/>
	)
);

TextArea.displayName = "TextArea";

export { TextArea };
