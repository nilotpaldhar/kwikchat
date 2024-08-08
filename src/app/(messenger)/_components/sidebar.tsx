import SiteLogo from "@/components/site-logo";
import ProfilePopup from "@/app/(messenger)/_components/profile-popup";

const Sidebar = () => (
	<div className="h-full flex flex-col items-center">
		<div className="flex justify-center items-center size-16">
			<SiteLogo src="/images/logo-icon.svg" width={28} height={28} />
		</div>
		<div className="flex-1 w-full py-6" />
		<div className="flex flex-col items-center w-full py-6">
			<ProfilePopup />
		</div>
	</div>
);

export default Sidebar;
