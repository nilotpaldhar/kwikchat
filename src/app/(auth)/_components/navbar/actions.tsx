"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SigninLinkProps {
	message?: string;
	linkText?: string;
	hideIcon?: boolean;
}

const SignupLink = () => (
	<div className="flex items-center space-x-2">
		<span className="text-muted font-medium">Need an account?</span>
		<Button variant="link" className="h-max p-0 leading-none" asChild>
			<Link href="/sign-up">Sign Up</Link>
		</Button>
	</div>
);

const SigninLink = ({
	message = "Already have an account?",
	linkText = "Sign In",
	hideIcon = true,
}: SigninLinkProps) => (
	<div className="flex items-center space-x-2">
		<span className="text-muted font-medium">{message}</span>
		<Button variant="link" className="h-max space-x-1 p-0 leading-none" asChild>
			<Link href="/sign-in">
				{!hideIcon && <ArrowLeft size={14} />}
				<span>{linkText}</span>
			</Link>
		</Button>
	</div>
);

const NavActions: React.FC<{ className?: string }> = ({ className = "" }) => {
	const pathname = usePathname();

	return (
		<div className={className}>
			{(pathname === "/sign-in" || pathname === "/verification") && <SignupLink />}
			{pathname === "/sign-in/error" && (
				<SigninLink message="" hideIcon={false} linkText="Back to Sign In" />
			)}
			{pathname === "/sign-up" && <SigninLink />}
			{(pathname === "/forgot-password" || pathname === "/reset-password") && (
				<SigninLink message="Change your mind?" linkText="Back to Sign In" />
			)}
		</div>
	);
};

export { NavActions, SignupLink, SigninLink };
