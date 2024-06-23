import * as React from "react";

import { cn } from "@/utils/general/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => (
		<input
			type={type}
			className={cn(
				"flex h-10 w-full rounded-md border border-neutral-200 bg-surface-light-100 px-3 py-2 text-sm ring-offset-surface-light-100 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-surface-dark-600 dark:ring-offset-surface-dark-600 dark:placeholder:text-neutral-600 dark:focus-visible:ring-primary-200",
				className
			)}
			ref={ref}
			{...props}
		/>
	)
);

Input.displayName = "Input";

export { Input };
