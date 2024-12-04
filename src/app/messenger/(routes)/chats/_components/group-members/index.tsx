"use client";

import { MemberRole } from "@prisma/client";
import { ArrowDown, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import ErrorAlert from "@/app/messenger/_components/error-alert";
import GroupMemberTile from "@/app/messenger/(routes)/chats/_components/group-members/group-member-tile";
import GroupMembersSkeleton from "@/app/messenger/(routes)/chats/_components/group-members/group-members-skeleton";

import useCurrentUser from "@/hooks/tanstack-query/use-current-user";
import {
	useGroupMembersQuery,
	useUpdateGroupMemberRole,
	useRemoveGroupMember,
} from "@/hooks/tanstack-query/use-group-member";

import useMessengerDialogStore from "@/store/use-messenger-dialog-store";
import useGroupMembershipStore from "@/store/use-group-membership-store";

import { cn } from "@/utils/general/cn";

interface GroupMembersProps {
	conversationId: string;
	total: number;
}

const GroupMembers = ({ conversationId, total }: GroupMembersProps) => {
	const { data: currentUserData } = useCurrentUser();
	const {
		data,
		isLoading,
		isSuccess,
		isError,
		error,
		refetch,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGroupMembersQuery({
		conversationId,
	});

	const openAddMembersDialog = useMessengerDialogStore().onOpen;
	const isGroupAdmin = useGroupMembershipStore().membership?.role === MemberRole.admin;

	const { mutate: updateMemberRoleMutation } = useUpdateGroupMemberRole();
	const { mutate: removeGroupMemberMutation } = useRemoveGroupMember();

	const handleUpdateMemberRole = ({
		memberId,
		memberRole,
	}: {
		memberId: string;
		memberRole: MemberRole;
	}) => {
		updateMemberRoleMutation(
			{ conversationId, memberId, memberRole },
			{
				onSuccess: ({ message }) => toast.success(message),
				onError: (mutationErr) => toast.error(mutationErr.message),
			}
		);
	};

	const handleRemoveGroupMember = ({ memberId }: { memberId: string }) => {
		removeGroupMemberMutation(
			{ conversationId, memberId },
			{
				onSuccess: ({ message }) => toast.success(message),
				onError: (mutationErr) => toast.error(mutationErr.message),
			}
		);
	};

	return (
		<div>
			<ScrollArea className={cn(total > 3 ? "h-48" : "h-auto")}>
				{isLoading && (
					<GroupMembersSkeleton
						wrapperClassName={cn(total > 3 && "pr-3")}
						count={total > 3 ? 10 : 3}
					/>
				)}
				{!isLoading && isError && (
					<ErrorAlert onClick={() => refetch()}>{error.message}</ErrorAlert>
				)}
				{!isLoading && isSuccess && data?.pages && (
					<div className={cn("flex flex-col space-y-2", total > 3 && "pr-3")}>
						{data.pages.map((page) =>
							page.data?.items ? (
								<ul key={page.data.pagination.page} className="flex flex-col space-y-2">
									{page.data.items.map((groupMember) => (
										<li key={groupMember.id}>
											<GroupMemberTile
												{...groupMember}
												currentUserId={currentUserData?.data?.id}
												onUpdateRole={handleUpdateMemberRole}
												onRemove={handleRemoveGroupMember}
											/>
										</li>
									))}
								</ul>
							) : null
						)}
						<div className="flex flex-col items-center space-y-1.5">
							{isGroupAdmin && (
								<Button
									className="w-full space-x-2"
									onClick={() =>
										openAddMembersDialog("ADD_NEW_GROUP_MEMBERS", {
											conversationToAddMembers: { conversationId },
										})
									}
								>
									<UserPlus size={16} />
									<span>Add members</span>
								</Button>
							)}

							{hasNextPage && (
								<Button
									variant="link"
									disabled={isFetchingNextPage}
									onClick={() => fetchNextPage()}
									className="h-auto max-w-max space-x-2 py-1"
								>
									<span className="font-bold">Load More</span>
									<ArrowDown size={14} />
								</Button>
							)}
						</div>
					</div>
				)}
			</ScrollArea>
		</div>
	);
};

export default GroupMembers;
