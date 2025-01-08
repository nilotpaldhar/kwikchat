"use client";

import { useEffect, useState } from "react";

import NewChatDialog from "@/components/dialogs/messenger/new-chat-dialog";
import EditMessageDialog from "@/components/dialogs/messenger/edit-message-dialog";
import DeleteMessageDialog from "@/components/dialogs/messenger/delete-message-dialog";
import ClearConversationDialog from "@/components/dialogs/messenger/clear-conversation-dialog";
import DeleteConversationDialog from "@/components/dialogs/messenger/delete-conversation-dialog";

import NewGroupDialog from "@/components/dialogs/messenger/new-group-dialog";
import ExitGroupDialog from "@/components/dialogs/messenger/exit-group-dialog";
import DeleteGroupDialog from "@/components/dialogs/messenger/delete-group-dialog";
import EditGroupIconDialog from "@/components/dialogs/messenger/edit-group-icon-dialog";
import EditGroupBannerDialog from "@/components/dialogs/messenger/edit-group-banner-dialog";
import AddGroupMembersDialog from "@/components/dialogs/messenger/add-group-members-dialog";
import EditGroupDetailsDialog from "@/components/dialogs/messenger/edit-group-details-dialog";

const MessengerDialogProvider = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<>
			<NewChatDialog />
			<EditMessageDialog />
			<DeleteMessageDialog />
			<ClearConversationDialog />
			<DeleteConversationDialog />

			<NewGroupDialog />
			<ExitGroupDialog />
			<DeleteGroupDialog />
			<EditGroupIconDialog />
			<EditGroupBannerDialog />
			<AddGroupMembersDialog />
			<EditGroupDetailsDialog />
		</>
	);
};

export default MessengerDialogProvider;
