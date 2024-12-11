"use client";

import { useEffect, useState } from "react";

import NewChatDialog from "@/components/dialogs/messenger/new-chat-dialog";
import NewGroupDialog from "@/components/dialogs/messenger/new-group-dialog";
import EditMessageDialog from "@/components/dialogs/messenger/edit-message-dialog";
import DeleteMessageDialog from "@/components/dialogs/messenger/delete-message-dialog";
import AddGroupMembersDialog from "@/components/dialogs/messenger/add-group-members-dialog";
import EditGroupIconDialog from "@/components/dialogs/messenger/edit-group-icon-dialog";
import EditGroupBannerDialog from "@/components/dialogs/messenger/edit-group-banner-dialog";
import EditGroupDetailsDialog from "@/components/dialogs/messenger/edit-group-details-dialog";
import ClearConversationDialog from "@/components/dialogs/messenger/clear-conversation-dialog";

const MessengerDialogProvider = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<>
			<NewChatDialog />
			<NewGroupDialog />
			<EditMessageDialog />
			<DeleteMessageDialog />
			<EditGroupIconDialog />
			<AddGroupMembersDialog />
			<EditGroupDetailsDialog />
			<EditGroupBannerDialog />
			<ClearConversationDialog />
		</>
	);
};

export default MessengerDialogProvider;
