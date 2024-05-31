import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/general/cn";

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-surface-dark-600",
	{
		variants: {
			variant: {
				primary: "bg-primary-400 text-white hover:bg-primary-400/80 focus-visible:ring-primary-300",
				outline:
					"border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 focus-visible:ring-neutral-500 dark:border-neutral-800 dark:bg-surface-dark-600 dark:text-neutral-200 dark:hover:bg-neutral-900 dark:focus-visible:ring-neutral-600",
				secondary:
					"bg-neutral-700 text-white hover:bg-neutral-700/90 focus-visible:ring-neutral-500 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80 dark:focus-visible:ring-neutral-600",
				link: "text-primary-400 underline-offset-4 hover:underline focus-visible:ring-primary-300",
				warning: "bg-yellow-600 text-white hover:bg-yellow-600/80 focus-visible:ring-yellow-400",
				success: "bg-green-600 text-white hover:bg-green-600/80 focus-visible:ring-green-400",
				danger: "bg-red-600 text-white hover:bg-red-600/80 focus-visible:ring-red-400",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "default",
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
		);
	}
);

Button.displayName = "Button";

export { Button, buttonVariants };
