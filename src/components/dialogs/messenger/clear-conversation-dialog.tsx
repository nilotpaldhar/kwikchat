"use client";

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

import { useClearConversation } from "@/hooks/tanstack-query/use-conversation";
import useMessengerDialogStore from "@/store/use-messenger-dialog-store";

const ClearConversationDialog = () => {
	const { mutate } = useClearConversation();

	const { type, isOpen, data, onClose } = useMessengerDialogStore();
	const isDialogOpen = isOpen && type === "CLEAR_CONVERSATION";
	const { conversationId } = data.conversationToClear ?? {};

	const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
		evt.preventDefault();
		if (!conversationId) return;
		mutate({ conversationId });
		onClose();
	};

	return (
		<AlertDialog open={isDialogOpen} onOpenChange={onClose}>
			<AlertDialogContent>
				<form onSubmit={handleSubmit}>
					<div className="flex flex-col space-y-5">
						<AlertDialogHeader>
							<AlertDialogTitle>Clear this chat?</AlertDialogTitle>
							<AlertDialogDescription>
								This chat will be empty but will remain in your chat list.
							</AlertDialogDescription>
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

export default ClearConversationDialog;
