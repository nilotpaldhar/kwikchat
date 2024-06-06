"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const SignupLink = () => (
	<div className="flex items-center space-x-2">
		<span className="text-muted font-medium">Need an account?</span>
		<Button variant="link" className="p-0 h-max leading-none" asChild>
			<Link href="/sign-up">Sign Up</Link>
		</Button>
	</div>
);

const SigninLink = () => (
	<div className="flex items-center space-x-2">
		<span className="text-muted font-medium">Already have an account?</span>
		<Button variant="link" className="p-0 h-max leading-none" asChild>
			<Link href="/sign-in">Sign In</Link>
		</Button>
	</div>
);

const NavActions: React.FC<{ className?: string }> = ({ className = "" }) => {
	const pathname = usePathname();

	return (
		<div className={className}>
			{pathname === "/sign-in" && <SignupLink />}
			{pathname === "/sign-up" && <SigninLink />}
		</div>
	);
};

export { NavActions, SignupLink, SigninLink };
