"use client";

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import DetailsPanel from "@/app/messenger/(chat-features)/_components/group-chat-details/details-panel";

import useChatInfoStore from "@/store/use-chat-info-store";
import { useGroupConversationDetailsQuery } from "@/hooks/tanstack-query/use-conversation";

interface GroupChatDetailsProps {
	conversationId: string;
}

const GroupChatDetails = ({ conversationId }: GroupChatDetailsProps) => {
	const { data, isLoading, isError, error, refetch } =
		useGroupConversationDetailsQuery(conversationId);
	const overview = data?.data;

	const { isOpen, type, onClose } = useChatInfoStore();
	const isGroupDetailsOpen = isOpen && type === "GROUP_DETAILS";

	return (
		<Sheet open={isGroupDetailsOpen} onOpenChange={onClose}>
			<SheetContent
				side="right"
				className="bg-surface-light-100 p-0 dark:bg-surface-dark-400"
				closeClassName="hidden"
			>
				<SheetHeader className="sr-only">
					<SheetTitle>Group Info</SheetTitle>
					<SheetDescription>Group Info</SheetDescription>
				</SheetHeader>
				<DetailsPanel
					overview={overview}
					isLoading={isLoading}
					isError={isError}
					error={error}
					refetch={refetch}
					onClose={onClose}
				/>
			</SheetContent>
		</Sheet>
	);
};

export default GroupChatDetails;
