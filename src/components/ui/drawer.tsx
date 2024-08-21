"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/utils/general/cn";

const Drawer = ({
	shouldScaleBackground = true,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
	<DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
	React.ElementRef<typeof DrawerPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<DrawerPrimitive.Overlay
		ref={ref}
		className={cn("fixed inset-0 z-50 bg-black/50", className)}
		{...props}
	/>
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
	React.ElementRef<typeof DrawerPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<DrawerPortal>
		<DrawerOverlay />
		<DrawerPrimitive.Content
			ref={ref}
			className={cn(
				"fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-md border border-neutral-200 bg-surface-light-100 dark:border-neutral-800 dark:bg-surface-dark-400",
				className
			)}
			{...props}
		>
			<div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-neutral-100 dark:bg-neutral-800" />
			{children}
		</DrawerPrimitive.Content>
	</DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"flex flex-col space-y-2 px-4 pt-4 text-center sm:px-5 sm:pt-5 lg:px-6",
			className
		)}
		{...props}
	/>
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn("px-4 py-4 sm:px-5 sm:py-5 lg:px-6", className)} {...props} />
);
DrawerBody.displayName = "DrawerBody";

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"flex justify-end space-x-2 bg-neutral-100 px-4 py-3 dark:bg-neutral-900 sm:px-5 lg:px-6",
			className
		)}
		{...props}
	/>
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
	React.ElementRef<typeof DrawerPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
	<DrawerPrimitive.Title ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
	React.ElementRef<typeof DrawerPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
	<DrawerPrimitive.Description
		ref={ref}
		className={cn("text-sm text-neutral-500 dark:text-neutral-300", className)}
		{...props}
	/>
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
	Drawer,
	DrawerPortal,
	DrawerOverlay,
	DrawerTrigger,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
	DrawerFooter,
	DrawerTitle,
	DrawerDescription,
};
