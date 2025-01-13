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

import { useBlock } from "@/hooks/tanstack-query/use-block";
import useMessengerDialogStore from "@/store/use-messenger-dialog-store";

const BlockFriendDialog = () => {
	const { mutate } = useBlock();

	const { type, isOpen, data, onClose } = useMessengerDialogStore();
	const isDialogOpen = isOpen && type === "BLOCK_FRIEND";
	const friendToBlock = data.friendToBlock;

	const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
		evt.preventDefault();
		if (!friendToBlock) return;
		mutate(friendToBlock);
		onClose();
	};

	return (
		<AlertDialog open={isDialogOpen} onOpenChange={onClose}>
			<AlertDialogContent>
				<form onSubmit={handleSubmit}>
					<div className="flex flex-col space-y-5">
						<AlertDialogHeader>
							<AlertDialogTitle>Block {friendToBlock?.username ?? "unknown"}?</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to block
								<strong className="mx-1">{friendToBlock?.username ?? "unknown"}</strong>? Blocking
								this user will also remove them from your friend list.
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

export default BlockFriendDialog;
