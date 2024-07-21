import { create } from "zustand";

export type ModalType = "UPDATE_PASSWORD" | "TOGGLE_TWO_FACTOR_AUTHENTICATION";

interface DialogData {}

interface SettingsDialogStore {
	type: ModalType | null;
	data: DialogData;
	isOpen: boolean;
	onOpen: (type: ModalType, data?: DialogData) => void;
	onClose: () => void;
}

const useSettingsDialogStore = create<SettingsDialogStore>((set) => ({
	type: null,
	data: {},
	isOpen: false,
	onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
	onClose: () => set({ isOpen: false }),
}));

export default useSettingsDialogStore;
