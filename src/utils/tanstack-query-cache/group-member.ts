import "client-only";

import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { MemberRole } from "@prisma/client";
import type { APIResponse, GroupMember, PaginatedResponse } from "@/types";

import { groupMemberKeys } from "@/constants/tanstack-query";

import { updateInfinitePaginatedData } from "@/utils/tanstack-query-cache/helpers";

/**
 * Updates the role of a group member in the local query cache.
 */
const updateGroupMemberRole = ({
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
	// Update the cached query data for the group's members
	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<GroupMember>>>>(
		groupMemberKeys.all(conversationId),
		(existingData) => {
			// If there's no existing data in the cache, return as is
			if (!existingData) return existingData;

			// Use a helper function to update the paginated data structure
			return updateInfinitePaginatedData<GroupMember>({
				existingData,
				updateFn: (data, pagination) => {
					// Get the list of current members or default to an empty array
					const items = data?.items ?? [];

					// Map over the members to update the role of the targeted member
					const updatedMembers = items.map((member) => {
						if (member.id !== memberId) return member;
						return { ...member, role: memberRole } as GroupMember;
					});

					return { pagination, items: updatedMembers };
				},
			});
		}
	);
};

/**
 * Removes a member from the group member list in the local query cache.
 */
const removeGroupMember = ({
	conversationId,
	memberId,
	queryClient,
}: {
	conversationId: string;
	memberId: string;
	queryClient: QueryClient;
}) => {
	// Update the cached query data for the group's members
	queryClient.setQueryData<InfiniteData<APIResponse<PaginatedResponse<GroupMember>>>>(
		groupMemberKeys.all(conversationId),
		(existingData) => {
			// If there's no existing data in the cache, return as is
			if (!existingData) return existingData;

			// Use a helper function to update the paginated data structure
			return updateInfinitePaginatedData<GroupMember>({
				existingData,
				updateFn: (data, pagination) => {
					// Use a helper function to update the paginated data structure
					const items = data?.items ?? [];

					// Check if the specified member exists in the current list
					const memberExists = items.some((member) => member.id === memberId);

					// Update the data: remove the member if they exist and adjust pagination info
					return {
						pagination: {
							...pagination,
							totalItems: memberExists ? pagination.totalItems - 1 : pagination.totalItems,
						},
						items: memberExists ? items.filter((m) => m.id !== memberId) : items,
					};
				},
			});
		}
	);
};

export { updateGroupMemberRole, removeGroupMember };
