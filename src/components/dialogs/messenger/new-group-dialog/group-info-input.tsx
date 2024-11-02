"use client";

import Label from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import GroupIconPicker from "@/components/messenger/group-icon-picker";

interface GroupInfoInputProps {
	groupName: string;
	groupDescription: string;
	icon?: string | null;
	onGroupNameChange: (groupName: string) => void;
	onGroupDescriptionChange: (groupDescription: string) => void;
	onGroupIconChange: (icon: File) => void;
}

const GroupInfoInput = ({
	groupName,
	groupDescription,
	icon = null,
	onGroupNameChange,
	onGroupDescriptionChange,
	onGroupIconChange,
}: GroupInfoInputProps) => {
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		onGroupIconChange(file);
	};

	return (
		<div className="flex flex-col space-y-10 px-4 sm:px-5 lg:px-6">
			<div className="flex items-center justify-center">
				<GroupIconPicker src={icon} onChange={handleFileChange} />
			</div>
			<div className="flex flex-col space-y-4">
				<div className="flex flex-col space-y-1.5">
					<Label htmlFor="groupName">Group Name</Label>
					<Input
						id="groupName"
						type="text"
						placeholder="E.g. Legends"
						value={groupName}
						onChange={(e) => onGroupNameChange(e.target.value)}
						className="dark:border-neutral-700 dark:bg-surface-dark-400"
					/>
				</div>
				<div className="flex flex-col space-y-1.5">
					<Label htmlFor="groupDescription">Description</Label>
					<TextArea
						id="groupDescription"
						rows={4}
						placeholder="Type your group description..."
						value={groupDescription}
						onChange={(e) => onGroupDescriptionChange(e.target.value)}
						className="dark:border-neutral-700 dark:bg-surface-dark-400"
					/>
				</div>
			</div>
		</div>
	);
};

export default GroupInfoInput;
