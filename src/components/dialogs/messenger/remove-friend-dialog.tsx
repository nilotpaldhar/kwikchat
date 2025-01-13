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

import { useUnfriend } from "@/hooks/tanstack-query/use-friend";
import useMessengerDialogStore from "@/store/use-messenger-dialog-store";

const RemoveFriendDialog = () => {
	const { mutate } = useUnfriend();

	const { type, isOpen, data, onClose } = useMessengerDialogStore();
	const isDialogOpen = isOpen && type === "REMOVE_FRIEND";
	const friendToRemove = data.friendToRemove;

	const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
		evt.preventDefault();
		if (!friendToRemove) return;
		mutate(friendToRemove);
		onClose();
	};

	return (
		<AlertDialog open={isDialogOpen} onOpenChange={onClose}>
			<AlertDialogContent>
				<form onSubmit={handleSubmit}>
					<div className="flex flex-col space-y-5">
						<AlertDialogHeader>
							<AlertDialogTitle>Unfriend {friendToRemove?.username ?? "unknown"}?</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to remove
								<strong className="mx-1">{friendToRemove?.username ?? "unknown"}</strong>from your
								friends list? This action cannot be undone, and you will no longer be able to
								interact as friends.
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

export default RemoveFriendDialog;
