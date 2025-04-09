"use client";

import { useState } from "react";

import {
	AlertDialog,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";

import { useDeleteMessage } from "@/hooks/tanstack-query/use-message";
import useMessengerDialogStore from "@/store/use-messenger-dialog-store";

const DeleteMessageDialog = () => {
	const [deleteForEveryone, setDeleteForEveryone] = useState(false);
	const { mutate } = useDeleteMessage();

	const { type, isOpen, data, onClose } = useMessengerDialogStore();
	const isDialogOpen = isOpen && type === "DELETE_MESSAGE";
	const { message, showDeleteForEveryone } = data.messageToDelete ?? {};

	const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
		evt.preventDefault();

		if (!message) return;

		mutate({
			message,
			deleteForEveryone: showDeleteForEveryone ? deleteForEveryone : false,
			conversationId: message.conversationId,
		});
		setDeleteForEveryone(false);
		onClose();
	};

	return (
		<AlertDialog open={isDialogOpen} onOpenChange={onClose}>
			<AlertDialogContent>
				<form onSubmit={handleSubmit}>
					<div className="flex flex-col space-y-5">
						<AlertDialogHeader>
							<AlertDialogTitle>Delete this message?</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to delete this message? This action cannot be undone.
							</AlertDialogDescription>
							{showDeleteForEveryone && (
								<div className="flex items-center space-x-2 pt-4">
									<Checkbox
										id="deleteForEveryone"
										checked={deleteForEveryone}
										onCheckedChange={(val) => setDeleteForEveryone(Boolean(val))}
									/>
									{}
									<label
										htmlFor="deleteForEveryone"
										className="select-none text-sm font-medium leading-none"
									>
										Delete for everyone
									</label>
								</div>
							)}
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<Button
								type="submit"
								variant="danger"
								className="space-x-2 dark:ring-offset-surface-dark-400"
							>
								Confirm
							</Button>
						</AlertDialogFooter>
					</div>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteMessageDialog;
