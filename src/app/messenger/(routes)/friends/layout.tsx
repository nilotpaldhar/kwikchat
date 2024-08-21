import {
	Wrapper,
	WrapperSidePanel,
	WrapperContentZone,
	WrapperContent,
	WrapperHeader,
	WrapperFooter,
} from "@/app/messenger/_components/wrapper";
import MobileNav from "@/app/messenger/_components/mobile-nav";
import MobileHeader from "@/app/messenger/(routes)/friends/_components/mobile-header";
import FriendsNav from "@/app/messenger/(routes)/friends/_components/friends-nav";

interface MessengerLayoutProps {
	children: React.ReactNode;
}

const FriendsLayout = ({ children }: MessengerLayoutProps) => (
	<Wrapper>
		<WrapperSidePanel>Friends Side Panel</WrapperSidePanel>
		<WrapperContentZone>
			<WrapperHeader className="px-4 sm:px-8 md:px-5">
				<div className="h-full md:hidden">
					<MobileHeader />
				</div>
				<div className="hidden h-full items-center md:flex">
					<FriendsNav />
				</div>
			</WrapperHeader>
			<WrapperContent>
				<div className="p-4 sm:p-8 md:px-5 md:py-8">{children}</div>
			</WrapperContent>
			<WrapperFooter className="px-4 sm:px-8 md:hidden">
				<MobileNav />
			</WrapperFooter>
		</WrapperContentZone>
	</Wrapper>
);

export default FriendsLayout;
