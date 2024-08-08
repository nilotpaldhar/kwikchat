import { create } from "zustand";

export type ModalType = "UPDATE_PASSWORD" | "TOGGLE_TWO_FACTOR_AUTHENTICATION" | "UPDATE_USERNAME";

interface SettingsDialogStore {
	type: ModalType | null;
	isOpen: boolean;
	onOpen: (type: ModalType) => void;
	onClose: () => void;
}

const useSettingsDialogStore = create<SettingsDialogStore>((set) => ({
	type: null,
	isOpen: false,
	onOpen: (type) => set({ isOpen: true, type }),
	onClose: () => set({ isOpen: false }),
}));

export default useSettingsDialogStore;
