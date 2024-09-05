import {
	SidePanel,
	SidePanelHeader,
	SidePanelContent,
} from "@/app/messenger/_components/side-panel";

import FriendsPane from "@/app/messenger/(routes)/friends/_components/friends-pane";
import FriendRequestsPane from "@/app/messenger/(routes)/friends/_components/friend-requests-pane";

const FriendsSidePanel = () => (
	<SidePanel>
		<SidePanelHeader>
			<h1 className="heading-3">Friends</h1>
		</SidePanelHeader>
		<SidePanelContent className="px-0">
			<div className="flex flex-col space-y-10">
				<FriendRequestsPane />
				<FriendsPane />
			</div>
		</SidePanelContent>
	</SidePanel>
);

export default FriendsSidePanel;
