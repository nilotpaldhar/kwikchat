"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const NewChatDialog = dynamic(() => import("@/components/dialogs/messenger/new-chat-dialog"));
const EditMessageDialog = dynamic(
	() => import("@/components/dialogs/messenger/edit-message-dialog")
);
const DeleteMessageDialog = dynamic(
	() => import("@/components/dialogs/messenger/delete-message-dialog")
);
const ClearConversationDialog = dynamic(
	() => import("@/components/dialogs/messenger/clear-conversation-dialog")
);
const DeleteConversationDialog = dynamic(
	() => import("@/components/dialogs/messenger/delete-conversation-dialog")
);

const NewGroupDialog = dynamic(() => import("@/components/dialogs/messenger/new-group-dialog"));
const ExitGroupDialog = dynamic(() => import("@/components/dialogs/messenger/exit-group-dialog"));
const DeleteGroupDialog = dynamic(
	() => import("@/components/dialogs/messenger/delete-group-dialog")
);
const EditGroupIconDialog = dynamic(
	() => import("@/components/dialogs/messenger/edit-group-icon-dialog")
);
const EditGroupBannerDialog = dynamic(
	() => import("@/components/dialogs/messenger/edit-group-banner-dialog")
);
const AddGroupMembersDialog = dynamic(
	() => import("@/components/dialogs/messenger/add-group-members-dialog")
);
const EditGroupDetailsDialog = dynamic(
	() => import("@/components/dialogs/messenger/edit-group-details-dialog")
);

const BlockFriendDialog = dynamic(
	() => import("@/components/dialogs/messenger/block-friend-dialog")
);
const RemoveFriendDialog = dynamic(
	() => import("@/components/dialogs/messenger/remove-friend-dialog")
);

const ImageGalleryDialog = dynamic(
	() => import("@/components/dialogs/messenger/image-gallery-dialog")
);

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

			<BlockFriendDialog />
			<RemoveFriendDialog />

			<ImageGalleryDialog />
		</>
	);
};

export default MessengerDialogProvider;
