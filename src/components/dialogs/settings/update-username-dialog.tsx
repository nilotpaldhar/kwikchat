"use client";

// External libraries and hooks
import { useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Local schemas and actions
import { UpdateUsernameSchema } from "@/schemas";
import { userKeys } from "@/constants/tanstack-query";
import updateUsername from "@/actions/auth/update-username";

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

const UpdateUsernameDialog = () => {
	const queryClient = useQueryClient();

	const title = `Change Your Username`;
	const description = `Enter a new username and your existing password.`;

	// State to manage success, error messages, and pending status
	const [success, setSuccess] = useState<string | undefined>("");
	const [error, setError] = useState<string | undefined>("");
	const [pending, startTransition] = useTransition();
	const isDesktop = useMediaQuery("(min-width: 768px)");

	// Get dialog state from the store
	const { type, isOpen, onClose } = useSettingsDialogStore();
	const isDialogOpen = isOpen && type === "UPDATE_USERNAME";

	// Initialize form with validation schema and default values
	const form = useForm<z.infer<typeof UpdateUsernameSchema>>({
		resolver: zodResolver(UpdateUsernameSchema),
		defaultValues: {
			newUsername: "",
			currentPassword: "",
		},
	});

	// Handle form submission
	const onSubmit = (values: z.infer<typeof UpdateUsernameSchema>) => {
		setError("");
		setSuccess("");

		startTransition(() => {
			updateUsername(values).then((data) => {
				setError(data?.error);

				if (data?.success) {
					setSuccess(data.success);
					queryClient.invalidateQueries({ queryKey: userKeys.current });
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
				name="newUsername"
				render={({ field }) => (
					<FormItem>
						<FormLabel>New Username</FormLabel>
						<FormControl>
							<Input
								type="text"
								placeholder="james_brown"
								disabled={pending}
								className="dark:border-neutral-700 dark:bg-surface-dark-400"
								{...field}
							/>
						</FormControl>
						<FormMessage />
						<FormDescription>Please only use numbers, letters or underscores _</FormDescription>
					</FormItem>
				)}
			/>
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
		<Drawer
			open={isDialogOpen}
			onOpenChange={(open) => {
				if (!open) handleClose();
			}}
		>
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

export default UpdateUsernameDialog;
