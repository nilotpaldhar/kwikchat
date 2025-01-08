"use client";

import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

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

import useMessengerDialogStore from "@/store/use-messenger-dialog-store";
import { useDeleteConversation } from "@/hooks/tanstack-query/use-conversation";

const DeleteConversationDialog = () => {
	const router = useRouter();
	const params = useParams();

	const { mutate, isPending } = useDeleteConversation();

	const { type, isOpen, data, onClose } = useMessengerDialogStore();
	const isDialogOpen = isOpen && type === "DELETE_CONVERSATION";
	const { conversationId } = data.conversationToDelete ?? {};

	const handleClose = () => {
		if (isPending) return;
		onClose();
	};

	const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
		evt.preventDefault();
		if (!conversationId) return;

		mutate(
			{ conversationId },
			{
				onSuccess: () => {
					if (params.id === conversationId) {
						router.push("/messenger");
					}
					handleClose();
				},
			}
		);
	};

	return (
		<AlertDialog open={isDialogOpen} onOpenChange={handleClose}>
			<AlertDialogContent>
				<form onSubmit={handleSubmit}>
					<div className="flex flex-col space-y-5">
						<AlertDialogHeader>
							<AlertDialogTitle>Delete this chat?</AlertDialogTitle>
							<AlertDialogDescription>
								Deleting this conversation will hide it temporarily from your chat list but restore
								it when new messages arrive. Past messages will stay intact. Use
								<strong className="mx-1">Clear Chat</strong>to remove past messages permanently.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<Button
								type="submit"
								variant="danger"
								disabled={isPending}
								className="space-x-2 dark:ring-offset-surface-dark-400"
							>
								{isPending && <Loader2 size={18} className="animate-spin" />}
								<span>Confirm</span>
							</Button>
						</AlertDialogFooter>
					</div>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteConversationDialog;
