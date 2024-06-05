"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/general/cn";

const NavActions: React.FC<{ className?: string }> = ({ className = "" }) => {
	const pathname = usePathname();

	return (
		<div className={cn("flex items-center space-x-2", className)}>
			{pathname === "/sign-in" && (
				<>
					<span className="text-muted font-medium">Need an account?</span>
					<Link href="/sign-up" className={cn(buttonVariants({ variant: "link" }), "p-0 h-max")}>
						Sign Up
					</Link>
				</>
			)}

			{pathname === "/sign-up" && (
				<>
					<span className="text-muted font-medium">Already have an account?</span>
					<Link href="/sign-in" className={cn(buttonVariants({ variant: "link" }), "p-0 h-max")}>
						Sign In
					</Link>
				</>
			)}
		</div>
	);
};

export default NavActions;
