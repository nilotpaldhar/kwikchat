"use client";

import type { RefetchOptions } from "@tanstack/react-query";
import type { UserProfile, UserWithoutPassword } from "@/types";

import { XIcon } from "lucide-react";
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import ProfileOverview from "@/components/user/profile-overview";

import {
	SidePanel,
	SidePanelHeader,
	SidePanelContent,
} from "@/app/messenger/_components/side-panel";
import ErrorAlert from "@/app/messenger/_components/error-alert";

import ActionButtons from "@/app/messenger/(routes)/chats/_components/chat-contact-info/action-buttons";
import SharedMediaButton from "@/app/messenger/(routes)/chats/_components/chat-contact-info/shared-media-button";
import StarredMessagesButton from "@/app/messenger/(routes)/chats/_components/chat-contact-info/starred-messages-button";

interface ContactPanelProps {
	participant?: UserWithoutPassword;
	isLoading?: boolean;
	isError?: boolean;
	error: Error | null;
	refetch: (options?: RefetchOptions) => void;
	onClose: () => void;
	onSharedMedia?: () => void;
	onStarredMessage?: () => void;
	onBlock?: () => void;
	onDeleteChat?: () => void;
}

const ContactPanel = ({
	participant,
	isLoading,
	error,
	isError,
	refetch,
	onClose,
	onSharedMedia = () => {},
	onStarredMessage = () => {},
	onBlock = () => {},
	onDeleteChat = () => {},
}: ContactPanelProps) => (
	<SidePanel>
		<SidePanelHeader>
			<div className="flex w-full items-center justify-between space-x-3">
				<h1 className="text-base font-semibold leading-none">Contact Info</h1>
				<Button
					variant="outline"
					size="icon"
					className="size-5 border-transparent bg-transparent p-0 text-neutral-700 hover:bg-transparent dark:border-transparent dark:bg-transparent dark:text-neutral-300 dark:hover:bg-transparent"
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
				<div>
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
						<SharedMediaButton onClick={onSharedMedia} />
						<StarredMessagesButton onClick={onStarredMessage} />
						<ActionButtons onBlock={onBlock} onDeleteChat={onDeleteChat} />
					</div>
				</div>
			)}
		</SidePanelContent>
	</SidePanel>
);

export default ContactPanel;
