"use client";

import type { RefetchOptions } from "@tanstack/react-query";
import type { UserProfile, UserWithoutPassword } from "@/types";

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import ProfileOverview from "@/components/user/profile-overview";
import { XIcon, Ban, Trash2, ImageIcon, Star, ChevronRight } from "lucide-react";

import {
	SidePanel,
	SidePanelHeader,
	SidePanelContent,
} from "@/app/messenger/_components/side-panel";
import ErrorAlert from "@/app/messenger/_components/error-alert";

import useChatInfoStore from "@/store/chat-info-store";

interface ChatContactInfoProps {
	participant?: UserWithoutPassword;
	isLoading?: boolean;
	isError?: boolean;
	error: Error | null;
	refetch: (options?: RefetchOptions) => void;
}

const ChatContactInfo = ({
	participant,
	isLoading,
	isError,
	error,
	refetch,
}: ChatContactInfoProps) => {
	const { isOpen, type, onClose } = useChatInfoStore();
	const isContactInfoOpen = isOpen && type === "USER_INFO";

	return (
		<Sheet open={isContactInfoOpen} onOpenChange={onClose}>
			<SheetContent
				side="right"
				className="bg-surface-light-100 p-0 dark:bg-surface-dark-400"
				closeClassName="hidden"
			>
				<SheetHeader className="sr-only">
					<SheetTitle>Contact Info</SheetTitle>
					<SheetDescription>Contact Info</SheetDescription>
				</SheetHeader>
				<SidePanel>
					<SidePanelHeader>
						<div className="flex w-full items-center justify-between space-x-3">
							<h1 className="text-base font-semibold leading-none">Contact Info</h1>
							<Button
								variant="outline"
								size="icon"
								className="border-transparent bg-transparent text-neutral-700 dark:border-transparent dark:bg-transparent dark:text-neutral-300"
								onClick={onClose}
							>
								<XIcon size={20} />
								<span className="sr-only">Close</span>
							</Button>
						</div>
					</SidePanelHeader>
					<SidePanelContent className="h-full p-0">
						{isLoading ? (
							<div className="flex h-[calc(100vh-80px)] w-full items-center justify-center">
								<Loader />
							</div>
						) : (
							<div className="flex flex-col space-y-5">
								{!isError ? (
									<ProfileOverview
										user={participant as UserProfile}
										className="dark:bg-surface-dark-400"
										classNames={{
											profileAvatar: {
												wrapperClassName: "dark:bg-surface-dark-400",
												indicatorClassName: "dark:ring-surface-dark-400",
											},
											profileContent: "dark:[&>*:first-child]:bg-surface-dark-300",
										}}
									/>
								) : (
									<ErrorAlert onClick={() => refetch()}>
										{error ? error.message : "Something went wrong!"}
									</ErrorAlert>
								)}
								<div className="flex flex-col space-y-3 px-5 pb-4">
									<Button
										variant="outline"
										className="space-x-2 dark:border-neutral-700/50 dark:bg-transparent dark:hover:bg-transparent"
									>
										<ImageIcon size={16} />
										<span className="flex-1 text-left font-semibold">Shared Media</span>
										<ChevronRight size={16} />
									</Button>
									<Button
										variant="outline"
										className="space-x-2 dark:border-neutral-700/50 dark:bg-transparent dark:hover:bg-transparent"
									>
										<Star size={16} />
										<span className="flex-1 text-left font-semibold">Starred Messages</span>
										<ChevronRight size={16} />
									</Button>
									<div className="flex flex-col space-y-3 md:flex-row md:space-x-2 md:space-y-0">
										<Button
											variant="outline"
											className="w-full items-center justify-start space-x-2 bg-neutral-100 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-800/80 md:justify-center"
										>
											<Ban size={16} />
											<span className="font-semibold">Block Friend</span>
										</Button>
										<Button
											variant="danger"
											className="w-full items-center justify-start space-x-2 md:justify-center"
										>
											<Trash2 size={16} />
											<span className="font-semibold">Delete Chat</span>
										</Button>
									</div>
								</div>
							</div>
						)}
					</SidePanelContent>
				</SidePanel>
			</SheetContent>
		</Sheet>
	);
};

export default ChatContactInfo;
