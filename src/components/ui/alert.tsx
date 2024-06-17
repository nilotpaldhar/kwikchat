"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { XIcon } from "lucide-react";

import useToggle from "@/hooks/use-toggle";
import { cn } from "@/utils/general/cn";

const alertVariants = cva(
	"relative w-full rounded-lg p-4 [&>svg]:size-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7",
	{
		variants: {
			variant: {
				default:
					"bg-neutral-50 border-neutral-200 text-neutral-900 [&>div]:text-neutral-700  dark:bg-surface-dark-500 dark:border-surface-dark-200 dark:text-neutral-200 dark:[&>div]:text-neutral-400",
				info: "bg-indigo-50/50 border-indigo-500 text-indigo-500 [&>div]:text-indigo-500 dark:bg-surface-dark-500",
				success:
					"bg-green-50 border-green-600 text-green-600 [&>div]:text-green-600 dark:bg-surface-dark-500",
				warning:
					"bg-yellow-50 border-yellow-600 text-yellow-600 [&>div]:text-yellow-600 dark:bg-surface-dark-500",
				danger:
					"bg-red-50 border-red-600 text-red-600 [&>div]:text-red-600 dark:bg-surface-dark-500",
			},
			border: {
				true: "border-l-4",
				false: "border-none",
			},
		},
		defaultVariants: {
			variant: "default",
			border: false,
		},
	}
);

interface AlertProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof alertVariants> {
	closable?: boolean;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
	({ closable = true, className, children, variant, border, ...props }, ref) => {
		const [show, toggle] = useToggle();

		return show ? (
			<div
				ref={ref}
				role="alert"
				className={cn(alertVariants({ variant, border }), className)}
				{...props}
			>
				{children}
				{closable && (
					<button
						type="button"
						tabIndex={0}
						onClick={toggle}
						className="inline-flex items-center justify-center absolute top-4 right-3 !p-0 m-0 rounded-full ring-offset-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current dark:ring-offset-surface-dark-600"
					>
						<span className="sr-only">Close Alert</span>
						<XIcon size={16} />
					</button>
				)}
			</div>
		) : null;
	}
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
	({ className, children, ...props }, ref) => (
		<h5 ref={ref} className={cn("pr-6 font-semibold leading-5", className)} {...props}>
			{children}
		</h5>
	)
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
	<div ref={ref} className={cn("mt-2 pr-6 text-sm [&_p]:leading-relaxed", className)} {...props}>
		{children}
	</div>
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
