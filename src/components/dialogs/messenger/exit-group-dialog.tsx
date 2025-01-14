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
import { useExitGroupConversation } from "@/hooks/tanstack-query/use-conversation";

const ExitGroupDialog = () => {
	const router = useRouter();
	const params = useParams();

	const { mutate, isPending } = useExitGroupConversation();

	const { type, isOpen, data, onClose } = useMessengerDialogStore();
	const closeGroupChatDetails = useChatInfoStore().onClose;

	const isDialogOpen = isOpen && type === "EXIT_GROUP";
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
							<AlertDialogTitle>Exit this group?</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to leave the group <strong>{groupName}</strong>? You will lose
								access to its messages and updates, but the group will remain available for other
								members.
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

export default ExitGroupDialog;
