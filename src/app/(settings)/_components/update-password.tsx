"use client";

import { Button } from "@/components/ui/button";
import { Block, BlockTitle, BlockContent } from "@/components/ui/block";

import useSettingsDialogStore from "@/store/use-settings-dialog-store";

interface UpdatePasswordProps {
	disabled?: boolean;
}

const UpdatePassword = ({ disabled = false }: UpdatePasswordProps) => {
	const { onOpen } = useSettingsDialogStore();

	return (
		<Block className="space-y-3">
			<BlockTitle>Password & Authetication</BlockTitle>
			<BlockContent>
				<Button disabled={disabled} onClick={() => onOpen("UPDATE_PASSWORD")}>
					Change Password
				</Button>
			</BlockContent>
		</Block>
	);
};

export default UpdatePassword;
