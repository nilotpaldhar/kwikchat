import SiteLogo from "@/components/site-logo";
import NavActions from "./actions";

const AuthNavbar = () => (
	<nav className="px-5 pt-6 pb-5 md:px-10 md:pt-8">
		<div className="flex items-center justify-center md:justify-between">
			<SiteLogo />
			<NavActions className="hidden md:flex" />
		</div>
	</nav>
);

export default AuthNavbar;
