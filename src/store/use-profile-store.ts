import type { UserProfile } from "@/types";

import { create } from "zustand";
import isEqual from "lodash.isequal";

interface ProfileStore {
	initialData: UserProfile | null;
	data: UserProfile | null;
	hasChanges: boolean;
	init: (data?: UserProfile) => void;
	reset: (initialState: boolean) => void;
	updateProfile: (key: keyof UserProfile, value: unknown) => void;
	saveProfile: () => void;
}

const useProfileStore = create<ProfileStore>((set) => ({
	initialData: null,
	data: null,
	hasChanges: false,
	init: (data) => set({ initialData: data, data }),
	reset: (initialState) => {
		if (initialState) {
			set((state) => ({ data: state.initialData, hasChanges: false }));
		} else {
			set({ initialData: null, data: null, hasChanges: false });
		}
	},
	updateProfile: (key, value) =>
		set((state) => {
			if (!state.data || !value) return state;
			const newData = { ...state.data, [key]: value };
			return { data: newData, hasChanges: !isEqual(newData, state.initialData) };
		}),
	saveProfile: () =>
		set((state) => ({
			initialData: state.data,
			hasChanges: false,
		})),
}));

export default useProfileStore;
