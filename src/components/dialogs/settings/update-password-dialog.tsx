"use client";

// External libraries and hooks
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Local schemas and actions
import { UpdatePasswordSchema } from "@/schemas";
import updatePassword from "@/actions/auth/update-password";

// Custom hooks and stores
import useMediaQuery from "@/hooks/use-media-query";
import useSettingsDialogStore from "@/store/use-settings-dialog-store";

// UI components
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogBody,
	DialogFooter,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
	DrawerFooter,
	DrawerTitle,
	DrawerDescription,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, XOctagon } from "lucide-react";

const UpdatePasswordDialog = () => {
	const title = `Update Password`;
	const description = `Enter your current password and a new password.`;

	// State to manage success, error messages, and pending status
	const [success, setSuccess] = useState<string | undefined>("");
	const [error, setError] = useState<string | undefined>("");
	const [pending, startTransition] = useTransition();
	const isDesktop = useMediaQuery("(min-width: 768px)");

	// Get dialog state from the store
	const { type, isOpen, onClose } = useSettingsDialogStore();
	const isDialogOpen = isOpen && type === "UPDATE_PASSWORD";

	// Initialize form with validation schema and default values
	const form = useForm<z.infer<typeof UpdatePasswordSchema>>({
		resolver: zodResolver(UpdatePasswordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmNewPassword: "",
		},
	});

	// Handle form submission
	const onSubmit = (values: z.infer<typeof UpdatePasswordSchema>) => {
		setError("");
		setSuccess("");

		startTransition(() => {
			updatePassword(values).then((data) => {
				setError(data?.error);

				if (data?.success) {
					setSuccess(data.success);
					form.reset();
				}
			});
		});
	};

	// Handle dialog close
	const handleClose = () => {
		if (pending) return;

		onClose();
		setError("");
		setSuccess("");
		form.reset();
	};

	// Render form fields
	const renderFormFields = () => (
		<div className="flex flex-col space-y-5">
			{error && (
				<Alert variant="danger">
					<XOctagon />
					<AlertTitle>{error}</AlertTitle>
				</Alert>
			)}
			{success && (
				<Alert variant="success">
					<CheckCircle />
					<AlertTitle>{success}</AlertTitle>
				</Alert>
			)}

			<FormField
				control={form.control}
				name="currentPassword"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Current Password</FormLabel>
						<FormControl>
							<Input
								type="password"
								placeholder="########"
								disabled={pending}
								className="dark:border-neutral-700 dark:bg-surface-dark-400"
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="newPassword"
				render={({ field }) => (
					<FormItem>
						<FormLabel>New Password</FormLabel>
						<FormControl>
							<Input
								type="password"
								placeholder="########"
								disabled={pending}
								className="dark:border-neutral-700 dark:bg-surface-dark-400"
								{...field}
							/>
						</FormControl>
						<FormMessage />
						<FormDescription>
							Must contain 1 uppercase letter, 1 number, min 8 characters
						</FormDescription>
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="confirmNewPassword"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Confirm New Password</FormLabel>
						<FormControl>
							<Input
								type="password"
								placeholder="########"
								disabled={pending}
								className="dark:border-neutral-700 dark:bg-surface-dark-400"
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);

	// Render cancel button
	const renderCancelBtn = () => (
		<Button
			className="border-none bg-transparent hover:bg-transparent dark:bg-transparent"
			variant="outline"
			disabled={pending}
		>
			Cancel
		</Button>
	);

	// Render submit button with loading indicator
	const renderSubmitBtn = () => (
		<Button type="submit" className="space-x-2" disabled={pending}>
			{pending && <Loader2 size={18} className="animate-spin" />}
			<span>{pending ? "Saving..." : "Done"}</span>
		</Button>
	);

	// Render dialog for desktop
	if (isDesktop) {
		return (
			<Dialog open={isDialogOpen} onOpenChange={handleClose}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} noValidate>
							<DialogBody>{renderFormFields()}</DialogBody>
							<DialogFooter>
								<DialogClose asChild>{renderCancelBtn()}</DialogClose>
								{renderSubmitBtn()}
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		);
	}

	// Render drawer for mobile
	return (
		<Drawer open={isDialogOpen} onOpenChange={handleClose}>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>{title}</DrawerTitle>
					<DrawerDescription>{description}</DrawerDescription>
				</DrawerHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} noValidate>
						<DrawerBody>{renderFormFields()}</DrawerBody>
						<DrawerFooter>
							<DrawerClose asChild>{renderCancelBtn()}</DrawerClose>
							{renderSubmitBtn()}
						</DrawerFooter>
					</form>
				</Form>
			</DrawerContent>
		</Drawer>
	);
};

export default UpdatePasswordDialog;
