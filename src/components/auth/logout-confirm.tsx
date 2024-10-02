"use client";

import { useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import logout from "@/actions/auth/logout";

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
import { Loader2 } from "lucide-react";

const LogoutConfirm = ({ children }: { children: React.ReactNode }) => {
	const [open, setOpen] = useState(false);
	const [pending, startTransition] = useTransition();
	const queryClient = useQueryClient();

	const onLogout = () => {
		startTransition(() => {
			logout().then(() => {
				setOpen(false);
				queryClient.clear();
			});
		});
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<form action={onLogout}>
					<div className="flex flex-col space-y-5">
						<AlertDialogHeader>
							<AlertDialogTitle>Log Out</AlertDialogTitle>
							<AlertDialogDescription>Are you sure you want to logout?</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
							<Button
								className="space-x-2 dark:ring-offset-surface-dark-400"
								type="submit"
								variant="danger"
								disabled={pending}
							>
								{pending && <Loader2 size={18} className="animate-spin" />}
								<span>{pending ? "Log Out..." : "Log Out"}</span>
							</Button>
						</AlertDialogFooter>
					</div>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default LogoutConfirm;
