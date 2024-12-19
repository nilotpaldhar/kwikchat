"use client";

import { useEffect } from "react";

import useGroupMembershipStore from "@/store/use-group-membership-store";
import { useGroupConversationMembershipQuery } from "@/hooks/tanstack-query/use-conversation";

interface GroupMembershipSyncProps {
	conversationId: string;
	isGroup: boolean;
}

const GroupMembershipSync = ({ conversationId, isGroup }: GroupMembershipSyncProps) => {
	const { data, status } = useGroupConversationMembershipQuery(conversationId, {
		enabled: isGroup,
	});
	const setMembership = useGroupMembershipStore().setMembership;

	useEffect(() => {
		if (status === "pending") setMembership();
		if (status === "success") setMembership(data?.data);
	}, [status, data?.data, setMembership]);

	return null;
};

export default GroupMembershipSync;
