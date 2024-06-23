import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/general/cn";

const dividerVariants = cva(
	"relative flex items-center before:absolute before:top-1/2 before:right-0 before:left-0 before:border-neutral-200 before:border-t dark:before:border-neutral-700",
	{
		variants: {
			type: {
				dashed: "before:border-dashed",
				solid: "before:border-solid",
				dotted: "before:border-dotted",
			},
			align: {
				left: "justify-start text-left",
				center: "justify-center text-center",
				right: "justify-end text-right",
			},
		},
		defaultVariants: {
			type: "dashed",
			align: "center",
		},
	}
);

const textVariants = cva(
	"relative z-10 text-sm leading-none py-0.5 text-neutral-500 bg-surface-light-100 dark:text-neutral-400 dark:bg-surface-dark-600",
	{
		variants: {
			align: {
				left: "text-left pr-2",
				center: "text-center px-2",
				right: "text-right pl-2",
			},
		},
		defaultVariants: {
			align: "center",
		},
	}
);

export interface DividerProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof dividerVariants> {}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
	({ type = "dashed", align = "center", className, children, ...props }, ref) => (
		<div ref={ref} className={cn(dividerVariants({ type, align, className }))} {...props}>
			{children && <span className={textVariants({ align })}>{children}</span>}
		</div>
	)
);

Divider.displayName = "Divider";

export { Divider, dividerVariants };
