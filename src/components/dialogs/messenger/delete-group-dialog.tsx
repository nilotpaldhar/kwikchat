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

import useChatInfoStore from "@/store/use-chat-info-store";
import useMessengerDialogStore from "@/store/use-messenger-dialog-store";
import { useDeleteGroupConversation } from "@/hooks/tanstack-query/use-conversation";

const DeleteGroupDialog = () => {
	const router = useRouter();
	const params = useParams();

	const { mutate, isPending } = useDeleteGroupConversation();

	const { type, isOpen, data, onClose } = useMessengerDialogStore();
	const closeGroupChatDetails = useChatInfoStore().onClose;

	const isDialogOpen = isOpen && type === "DELETE_GROUP";
	const { conversationId, name: groupName } = data.groupConversationToExit ?? {};

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
						closeGroupChatDetails();
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
							<AlertDialogTitle>Delete this group?</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to delete the group <strong>{groupName}</strong>? This action
								is permanent, and all data related to this group will be deleted.
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

export default DeleteGroupDialog;
