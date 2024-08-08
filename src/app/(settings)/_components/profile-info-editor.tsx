"use client";

import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { Block, BlockTitle, BlockDescription, BlockContent } from "@/components/ui/block";
import BannerSwatch from "@/app/(settings)/_components/banner-swatch";
import AvatarUploadDialog from "@/app/(settings)/_components/avatar-upload-dialog";

import useProfileStore from "@/store/use-profile-store";

const ProfileInfoEditor = ({ loading = false }: { loading?: boolean }) => {
	const { data, updateProfile } = useProfileStore();

	if (!data) return null;

	return (
		<div className="flex flex-col space-y-10">
			<Block className="space-y-2">
				<BlockTitle>Display Name</BlockTitle>
				<BlockContent>
					<Input
						type="text"
						placeholder="Your Name"
						value={data.displayName ?? ""}
						disabled={loading}
						onChange={(evt) => updateProfile("displayName", evt.target.value)}
					/>
				</BlockContent>
			</Block>
			<Block className="space-y-2">
				<BlockTitle>About Me</BlockTitle>
				<BlockContent>
					<TextArea
						placeholder="Brief description about yourself"
						rows={4}
						value={data.bio ?? ""}
						disabled={loading}
						onChange={(evt) => updateProfile("bio", evt.target.value)}
					/>
				</BlockContent>
				<BlockDescription className="text-xs">Bio must be 190 characters or fewer</BlockDescription>
			</Block>
			<Block className="space-y-2">
				<BlockTitle>Avatar</BlockTitle>
				<BlockContent>
					<AvatarUploadDialog
						disabled={loading}
						onSave={(image) => updateProfile("avatar", image)}
					/>
				</BlockContent>
			</Block>
			<Block className="space-y-2">
				<BlockTitle>Banner Color</BlockTitle>
				<BlockContent>
					<BannerSwatch
						bannerColor={data.banner_color}
						disabled={loading}
						onChange={(color) => updateProfile("banner_color", color)}
					/>
				</BlockContent>
			</Block>
		</div>
	);
};

export default ProfileInfoEditor;
