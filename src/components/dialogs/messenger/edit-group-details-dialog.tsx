"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import useMediaQuery from "@/hooks/use-media-query";
import useMessengerDialogStore from "@/store/use-messenger-dialog-store";
import { useUpdateGroupConversationDetails } from "@/hooks/tanstack-query/use-conversation";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogBody,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
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
import { TextArea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";

import { Loader2, XOctagon } from "lucide-react";

export const ValidationSchema = z.object({
	groupName: z
		.string()
		.min(1, { message: "Group name is required" })
		.max(100, { message: "Group name must be at most 100 characters long" }),
	groupDescription: z
		.string()
		.max(200, { message: "Group description must be at most 200 characters long" })
		.optional(),
});

const EditGroupDetailsDialog = () => {
	const title = `Edit Group Details`;
	const description = `Update the group name and description.`;

	// Hook to manage group conversation update
	const { mutate, isPending, isError, error, reset } = useUpdateGroupConversationDetails();

	// Hook to check if the screen size is desktop
	const isDesktop = useMediaQuery("(min-width: 768px)");

	// Get dialog state from the store
	const {
		type,
		data: { groupConversationToEdit },
		isOpen,
		onClose,
	} = useMessengerDialogStore();
	const isDialogOpen = isOpen && type === "EDIT_GROUP_DETAILS";

	// Initialize form with validation schema and default values
	const form = useForm<z.infer<typeof ValidationSchema>>({
		resolver: zodResolver(ValidationSchema),
		defaultValues: { groupName: "", groupDescription: "" },
	});

	// Effect to set defaultValues for form fields
	useEffect(() => {
		if (groupConversationToEdit) {
			form.reset({
				groupName: groupConversationToEdit.name,
				groupDescription: groupConversationToEdit.description ?? "",
			});
		}
	}, [groupConversationToEdit, form]);

	// Handle dialog close
	const handleClose = () => {
		if (isPending) return;
		reset();
		onClose();
	};

	// Handle form submission
	const onSubmit = (values: z.infer<typeof ValidationSchema>) => {
		const conversationId = groupConversationToEdit?.id;
		const { groupName, groupDescription } = values;
		if (!conversationId) return;
		mutate({ conversationId, groupName, groupDescription }, { onSuccess: handleClose });
	};

	// Render form fields
	const renderFormFields = () => (
		<div className="flex flex-col space-y-5">
			{isError && (
				<Alert variant="danger">
					<XOctagon />
					<AlertTitle>{error.message}</AlertTitle>
				</Alert>
			)}

			<FormField
				control={form.control}
				name="groupName"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Group Name</FormLabel>
						<FormControl>
							<Input
								disabled={isPending}
								placeholder="E.g. Legends"
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
				name="groupDescription"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Description</FormLabel>
						<FormControl>
							<TextArea
								rows={4}
								disabled={isPending}
								placeholder="Type your group description..."
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
			variant="outline"
			disabled={isPending}
			className="border-none bg-transparent hover:bg-transparent dark:bg-transparent"
		>
			Cancel
		</Button>
	);

	// Render submit button with loading indicator
	const renderSubmitBtn = () => (
		<Button type="submit" className="space-x-2" disabled={isPending}>
			{isPending && <Loader2 size={18} className="animate-spin" />}
			<span>{isPending ? "Saving..." : "Done"}</span>
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

export default EditGroupDetailsDialog;
