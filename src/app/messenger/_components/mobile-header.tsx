import SiteLogo from "@/components/site-logo";
import ProfilePopup from "@/app/messenger/_components/profile-popup";

const MobileHeader = () => (
	<header className="flex h-full items-center space-x-5">
		<SiteLogo href="/messenger" />
		<div className="ml-auto flex flex-1 justify-end">
			<ProfilePopup side="bottom" sideOffset={8} align="end" alignOffset={0} />
		</div>
	</header>
);

export default MobileHeader;
