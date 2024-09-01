import {
	Wrapper,
	WrapperSidePanel,
	WrapperContentZone,
	WrapperContent,
	WrapperHeader,
	WrapperFooter,
} from "@/app/messenger/_components/wrapper";
import MobileNav from "@/app/messenger/_components/mobile-nav";
import FriendsNav from "@/app/messenger/(routes)/friends/_components/friends-nav";
import MobileHeader from "@/app/messenger/(routes)/friends/_components/mobile-header";
import FriendsSidePanel from "@/app/messenger/(routes)/friends/_components/friends-side-panel";

interface MessengerLayoutProps {
	children: React.ReactNode;
}

const FriendsLayout = ({ children }: MessengerLayoutProps) => (
	<Wrapper>
		<WrapperSidePanel>
			<FriendsSidePanel />
		</WrapperSidePanel>
		<WrapperContentZone>
			<WrapperHeader className="border-b border-neutral-200 px-4 dark:border-neutral-900 sm:px-8 md:px-5">
				<div className="h-full md:hidden">
					<MobileHeader />
				</div>
				<div className="hidden h-full items-center md:flex">
					<FriendsNav />
				</div>
			</WrapperHeader>
			<WrapperContent className="md:mb-0">
				<div className="p-4 sm:p-8 md:px-5 md:py-8">{children}</div>
			</WrapperContent>
			<WrapperFooter className="px-4 sm:px-8 md:hidden">
				<MobileNav />
			</WrapperFooter>
		</WrapperContentZone>
	</Wrapper>
);

export default FriendsLayout;
