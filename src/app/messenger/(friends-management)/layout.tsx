import type { Metadata } from "next";

import { APP_NAME } from "@/constants/seo";

import {
	Wrapper,
	WrapperSidePanel,
	WrapperContentZone,
	WrapperContent,
	WrapperHeader,
	WrapperFooter,
} from "@/app/messenger/_components/wrapper";
import MobileNav from "@/app/messenger/_components/mobile-nav";

import FriendsNav from "@/app/messenger/(friends-management)/_components/friends-nav";
import MobileHeader from "@/app/messenger/(friends-management)/_components/mobile-header";
import FriendsSidePanel from "@/app/messenger/(friends-management)/_components/friends-side-panel";

export const metadata: Metadata = {
	title: {
		template: `%s | ${APP_NAME}`,
		default: "Manage Friends",
	},
	description: "View, add, and manage your friends with ease, all in one place.",
};

interface FriendsManagementLayoutProps {
	children: React.ReactNode;
}

const FriendsManagementLayout = ({ children }: FriendsManagementLayoutProps) => (
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

export default FriendsManagementLayout;
