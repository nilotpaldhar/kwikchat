"use client";

import { useEffect, useState } from "react";

import UpdatePasswordDialog from "@/components/dialogs/settings/update-password-dialog";
import ToggleTwoFADialog from "@/components/dialogs/settings/toggle-two-fa-dialog";
import UpdateUsernameDialog from "@/components/dialogs/settings/update-username-dialog";

const SettingsDialogProvider = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<>
			<UpdatePasswordDialog />
			<ToggleTwoFADialog />
			<UpdateUsernameDialog />
		</>
	);
};

export default SettingsDialogProvider;
