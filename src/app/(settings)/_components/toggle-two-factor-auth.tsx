"use client";

import { Button } from "@/components/ui/button";
import { Block, BlockTitle, BlockDescription, BlockContent } from "@/components/ui/block";

import useSettingsDialogStore from "@/store/use-settings-dialog-store";

interface ToggleTwoFactorAuthProps {
	disabled?: boolean;
	twoFactorAuthEnabled?: boolean;
}

const ToggleTwoFactorAuth = ({
	disabled = false,
	twoFactorAuthEnabled = false,
}: ToggleTwoFactorAuthProps) => {
	const { onOpen } = useSettingsDialogStore();

	return (
		<Block className="space-y-3">
			<BlockTitle>Two Factor Authentication</BlockTitle>
			<BlockDescription>
				Two-factor authentication adds an additional layer of security to your account by requiring
				more than just a password to sign in.
			</BlockDescription>
			<BlockContent className="py-1">
				<Button
					disabled={disabled}
					variant={twoFactorAuthEnabled ? "danger" : "primary"}
					onClick={() => onOpen("TOGGLE_TWO_FACTOR_AUTHENTICATION", {})}
				>
					{twoFactorAuthEnabled
						? "Disable Two Factor Authentication"
						: "Enable Two Factor Authentication"}
				</Button>
			</BlockContent>
		</Block>
	);
};

export default ToggleTwoFactorAuth;
