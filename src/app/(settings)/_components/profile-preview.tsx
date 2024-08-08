"use client";

import { Block, BlockTitle, BlockContent } from "@/components/ui/block";
import ProfileOverview from "@/components/user/profile-overview";

import useProfileStore from "@/store/use-profile-store";

const ProfilePreview = () => {
	const data = useProfileStore((state) => state.data);

	if (!data) return null;

	return (
		<Block className="space-y-2">
			<BlockTitle>Preview</BlockTitle>
			<BlockContent>
				<div className="overflow-hidden rounded-xl shadow-[0_8px_16px_rgba(0,0,0,0.1)]">
					<ProfileOverview user={data} />
				</div>
			</BlockContent>
		</Block>
	);
};

export default ProfilePreview;
