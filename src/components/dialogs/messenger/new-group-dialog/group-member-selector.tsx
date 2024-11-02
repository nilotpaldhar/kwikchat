"use client";

import ChatFriendSelector from "@/components/messenger/chat-friend-selector/index";

interface GroupMemberSelectorProps {
	defaultSelectedIds: string[];
	onSelect: (friendId: string, selected: boolean) => void;
}
const GroupMemberSelector = ({ defaultSelectedIds, onSelect }: GroupMemberSelectorProps) => (
	<ChatFriendSelector isGroup defaultSelectedIds={defaultSelectedIds} onSelect={onSelect} />
);

export default GroupMemberSelector;
