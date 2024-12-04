import "client-only";

import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { MemberRole } from "@prisma/client";
import type { APIResponse, GroupMember, PaginatedResponse } from "@/types";

import { groupMemberKeys, conversationKeys } from "@/constants/tanstack-query";

import {
	updateGroupMemberRole,
	removeGroupMember,
} from "@/utils/tanstack-query-cache/group-member";

import { getInfiniteQueryData } from "@/utils/tanstack-query-cache/helpers";

const optimisticUpdateGroupMemberRole = async ({
	conversationId,
	memberId,
	memberRole,
	queryClient,
}: {
	conversationId: string;
	memberId: string;
	memberRole: MemberRole;
	queryClient: QueryClient;
}) => {
	await queryClient.cancelQueries({ queryKey: groupMemberKeys.all(conversationId) });

	const groupMembersData = getInfiniteQueryData<GroupMember>({
		keys: groupMemberKeys.all(conversationId),
		queryClient,
	});

	updateGroupMemberRole({
		conversationId,
		memberId,
		memberRole,
		queryClient,
	});

	return { groupMembersData };
};

const optimisticRemoveGroupMember = async ({
	conversationId,
	memberId,
	queryClient,
}: {
	conversationId: string;
	memberId: string;
	queryClient: QueryClient;
}) => {
	await queryClient.cancelQueries({ queryKey: groupMemberKeys.all(conversationId) });

	const groupMembersData = getInfiniteQueryData<GroupMember>({
		keys: groupMemberKeys.all(conversationId),
		queryClient,
	});

	removeGroupMember({ conversationId, memberId, queryClient });

	return { groupMembersData };
};

const refetchOptimisticGroupMembers = ({
	conversationId,
	queryClient,
}: {
	conversationId: string;
	queryClient: QueryClient;
}) => {
	queryClient.invalidateQueries({ queryKey: groupMemberKeys.all(conversationId) });
	queryClient.invalidateQueries({ queryKey: conversationKeys.groupDetails(conversationId) });
};

const optimisticGroupMembersError = async ({
	conversationId,
	context,
	queryClient,
}: {
	conversationId: string;
	context?: {
		groupMembersData?: InfiniteData<APIResponse<PaginatedResponse<GroupMember>>>;
	};
	queryClient: QueryClient;
}) => {
	if (!context) return;
	queryClient.setQueryData(groupMemberKeys.all(conversationId), context.groupMembersData);
};

export {
	optimisticUpdateGroupMemberRole,
	optimisticRemoveGroupMember,
	refetchOptimisticGroupMembers,
	optimisticGroupMembersError,
};
