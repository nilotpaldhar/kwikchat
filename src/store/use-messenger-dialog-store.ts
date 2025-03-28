import type {
	CompleteMessage,
	FriendWithFriendship,
	GroupOverview,
	ImageMessageWithMedia,
} from "@/types";

import { create } from "zustand";

export type ModalType =
	| "NEW_CHAT"
	| "NEW_GROUP_CHAT"
	| "ADD_NEW_GROUP_MEMBERS"
	| "EDIT_MESSAGE"
	| "DELETE_MESSAGE"
	| "CLEAR_CONVERSATION"
	| "DELETE_CONVERSATION"
	| "EDIT_GROUP_DETAILS"
	| "EDIT_GROUP_BANNER"
	| "EDIT_GROUP_ICON"
	| "EXIT_GROUP"
	| "DELETE_GROUP"
	| "BLOCK_FRIEND"
	| "REMOVE_FRIEND"
	| "IMAGE_GALLERY";

interface DialogData {
	messageToEdit?: {
		messageId: string;
		conversationId: string;
		content: string;
		timestamp: string;
	};
	messageToDelete?: { message: CompleteMessage; showDeleteForEveryone: boolean };
	conversationToClear?: { conversationId: string };
	conversationToDelete?: { conversationId: string };
	conversationToAddMembers?: { conversationId: string };
	groupConversationToEdit?: GroupOverview;
	groupConversationToDelete?: { conversationId: string; name: string };
	groupConversationToExit?: { conversationId?: string; name?: string };
	friendToBlock?: FriendWithFriendship;
	friendToRemove?: FriendWithFriendship;
	imageGallery?: {
		imageMessages: ImageMessageWithMedia[];
		initialIndex?: number;
	};
}

interface MessengerDialogStore {
	type: ModalType | null;
	isOpen: boolean;
	data: DialogData;
	onOpen: (type: ModalType, data?: DialogData) => void;
	setOpen: (isOpen: boolean) => void;
	onClose: () => void;
}

/** Returns the initial state of DialogData */
const getInitialDialogData = (): DialogData => ({
	messageToEdit: undefined,
	messageToDelete: undefined,
	conversationToClear: undefined,
	conversationToDelete: undefined,
	conversationToAddMembers: undefined,
	groupConversationToEdit: undefined,
	groupConversationToDelete: undefined,
	groupConversationToExit: undefined,
	friendToBlock: undefined,
	friendToRemove: undefined,
	imageGallery: undefined,
});

const useMessengerDialogStore = create<MessengerDialogStore>((set) => ({
	type: null,
	isOpen: false,
	data: getInitialDialogData(),

	onOpen: (type, data = {}) =>
		set((state) => ({
			...state,
			isOpen: true,
			type,
			data: { ...state.data, ...data },
		})),

	setOpen: (isOpen) => set({ isOpen }),

	onClose: () =>
		set(() => ({
			isOpen: false,
			type: null,
			data: getInitialDialogData(),
		})),
}));

export default useMessengerDialogStore;
