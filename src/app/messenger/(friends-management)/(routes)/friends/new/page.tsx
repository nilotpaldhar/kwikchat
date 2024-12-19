import { Block, BlockTitle, BlockDescription, BlockContent } from "@/components/ui/block";
import FriendsRequestForm from "@/app/messenger/(friends-management)/_components/friends-request-form";

const FriendsNewPage = () => (
	<Block className="space-y-1">
		<BlockTitle className="text-base leading-7">Add Friend</BlockTitle>
		<BlockDescription className="text-xs">
			You can add friends with their KwikChat username.
		</BlockDescription>
		<BlockContent className="pt-4">
			<FriendsRequestForm />
		</BlockContent>
	</Block>
);

export default FriendsNewPage;
