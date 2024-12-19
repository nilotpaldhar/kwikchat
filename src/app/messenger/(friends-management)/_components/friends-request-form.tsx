"use client";

import { useState } from "react";
import { useSendFriendRequest } from "@/hooks/tanstack-query/use-friend-request";

import { ArrowRight, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { cn } from "@/utils/general/cn";

const FriendsRequestForm = () => {
	const [receiverUsername, setReceiverUsername] = useState("");
	const { mutate, isSuccess, isError, isPending, data, error } = useSendFriendRequest();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		mutate(receiverUsername, {
			onSuccess: () => {
				setReceiverUsername("");
			},
		});
	};

	return (
		<form onSubmit={handleSubmit}>
			<div
				className={cn(
					"flex h-14 items-center space-x-4 rounded-lg border border-neutral-200 pl-4 pr-2 transition dark:border-neutral-800",
					isSuccess && "border-green-600",
					isError && "border-red-600"
				)}
			>
				<div className="flex h-full flex-1 items-center space-x-3">
					<UserPlus size={20} className="text-neutral-500 dark:text-neutral-400" />
					<Input
						type="text"
						value={receiverUsername}
						disabled={isPending}
						placeholder="You can add friends with their KwikChat username"
						className="h-full border-transparent px-0 ring-offset-transparent placeholder:text-neutral-500 focus-visible:ring-transparent dark:border-transparent dark:ring-offset-transparent dark:placeholder:text-neutral-300 dark:focus-visible:ring-transparent"
						onChange={(e) => setReceiverUsername(e.target.value)}
					/>
				</div>
				<Button disabled={!receiverUsername || isPending}>
					<ArrowRight size={16} className="lg:hidden" />
					<span className="sr-only lg:not-sr-only">Send Friend Request</span>
				</Button>
			</div>
			{isSuccess && data.message && (
				<p className="mt-1.5 px-0.5 text-xs font-medium text-green-600">{data.message}</p>
			)}
			{isError && (
				<p className="mt-1.5 px-0.5 text-xs font-medium text-red-500 dark:text-red-900">
					{error?.message}
				</p>
			)}
		</form>
	);
};

export default FriendsRequestForm;
