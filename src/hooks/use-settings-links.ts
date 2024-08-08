import { usePathname } from "next/navigation";

export interface SettingsLink {
	label: string;
	href: string;
	active?: boolean;
}

/**
 * Custom hook to generate settings links with an active state based on the current pathname.
 *
 * @returns {SettingsLink[]} Array of link objects, each containing a label, href, and active state.
 */
const useSettingsLinks = (): SettingsLink[] => {
	const pathname = usePathname(); // Get the current pathname

	// Define the list of settings links with their labels and hrefs
	const links = [
		{ label: "My Account", href: "/account" },
		{ label: "Profile", href: "/account-profile" },
		{ label: "Safety & Security", href: "/account-security" },
	];

	// Map through the links and add an 'active' property based on the current pathname
	return links.map((link) => ({
		...link,
		active: pathname === link.href,
	}));
};

export default useSettingsLinks;
