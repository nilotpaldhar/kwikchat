"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { MessageCaptionSchema } from "@/schemas";
import useMediaQuery from "@/hooks/use-media-query";
import { type FileDetails, truncateFileName } from "@/utils/general/file";

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
	DialogBody,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
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
import DocumentIcon from "@/components/messenger/document-icon";

interface DocumentUploadDialogProps {
	open?: boolean;
	documentDetails: FileDetails | null;
	onOpenChange?: (open: boolean) => void;
	onConfirmUpload?: (data: { documentDetails: FileDetails; caption?: string }) => void;
}

const DocumentUploadDialog = ({
	open,
	documentDetails,
	onOpenChange,
	onConfirmUpload,
}: DocumentUploadDialogProps) => {
	const title = `Send Document`;
	const description = `No Description`;

	const isDesktop = useMediaQuery("(min-width: 768px)");
	const truncatedFileName = truncateFileName(documentDetails?.fileName ?? "Unknown");

	// Initialize form with validation schema and default values
	const form = useForm<z.infer<typeof MessageCaptionSchema>>({
		resolver: zodResolver(MessageCaptionSchema),
		defaultValues: { caption: "" },
	});

	// Handle form submission
	const onSubmit = ({ caption }: z.infer<typeof MessageCaptionSchema>) => {
		if (documentDetails && onConfirmUpload) {
			onConfirmUpload({ caption, documentDetails });
			form.reset();
		}
	};

	const renderPreviewCard = () => (
		<div className="rounded-xl bg-surface-light-200 px-4 py-8 dark:bg-surface-dark-300">
			<div className="flex w-full flex-col items-center space-y-6">
				<div className="flex justify-center text-neutral-900 dark:text-neutral-200">
					<DocumentIcon fileType={documentDetails?.fileType} size={80} />
				</div>

				<div className="space-y-1 text-center">
					<h4
						className="heading-4 line-clamp-1 w-full"
						title={documentDetails?.fileName ?? "Unknown"}
					>
						{truncatedFileName}
					</h4>
					<p className="flex items-center space-x-1 text-sm font-medium uppercase text-neutral-500 dark:text-neutral-400">
						<span>{documentDetails?.fileSize.formatted ?? "Unknown"}</span>
						<span>-</span>
						<span>{documentDetails?.fileType ?? "Unknown"}</span>
					</p>
				</div>
			</div>
		</div>
	);

	const renderFormFields = () => (
		<FormField
			control={form.control}
			name="caption"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Caption</FormLabel>
					<FormControl>
						<Input
							type="text"
							placeholder="Add a caption"
							disabled={false}
							className="dark:border-neutral-700 dark:bg-surface-dark-400"
							{...field}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);

	const renderCancelBtn = () => (
		<Button
			variant="outline"
			className="border-none bg-transparent hover:bg-transparent dark:bg-transparent"
		>
			Cancel
		</Button>
	);

	const renderSubmitBtn = () => <Button type="submit">Send</Button>;

	// Render dialog for desktop
	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="outline-none">
					<DialogHeader className="text-left">
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription className="hidden">{description}</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} noValidate>
							<DialogBody className="space-y-5">
								<div>{renderPreviewCard()}</div>
								<div>{renderFormFields()}</div>
							</DialogBody>
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
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>{title}</DrawerTitle>
					<DrawerDescription className="hidden">{description}</DrawerDescription>
				</DrawerHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} noValidate>
						<DrawerBody className="space-y-5">
							<div>{renderPreviewCard()}</div>
							<div>{renderFormFields()}</div>
						</DrawerBody>
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

export default DocumentUploadDialog;
