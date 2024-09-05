"use client";

import { useState } from "react";

import {
	AlertDialog,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogTrigger,
	AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface BlockConfirmProps {
	username: string;
	children: React.ReactNode;
	onBlock?: () => void;
}

const BlockConfirm = ({ username, children, onBlock = () => {} }: BlockConfirmProps) => {
	const [open, setOpen] = useState(false);

	const handleSubmit = (evt: React.FormEvent) => {
		evt.preventDefault();
		setOpen(false);
		onBlock();
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<form onSubmit={handleSubmit}>
					<div className="flex flex-col space-y-5">
						<AlertDialogHeader>
							<AlertDialogTitle>Block {username}</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to block <strong>{username}</strong>? Blocking this user will
								also remove them from your friend list.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<Button
								className="space-x-2 dark:ring-offset-surface-dark-400"
								type="submit"
								variant="danger"
							>
								Block
							</Button>
						</AlertDialogFooter>
					</div>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default BlockConfirm;
