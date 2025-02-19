"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogBody,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
	DrawerTitle,
	DrawerDescription,
	DrawerTrigger,
} from "@/components/ui/drawer";
import {
	SectionHeader,
	SectionBadge,
	SectionTitle,
	SectionDescription,
} from "@/app/(marketing)/_components/section-header";
import * as icons from "@/app/(marketing)/_components/tech-stack-dialog/icons";

import useMediaQuery from "@/hooks/use-media-query";

const TECH_STACK = [
	{ id: "next_js", label: "Next.js", icon: icons.NextJS },
	{ id: "react_js", label: "React", icon: icons.ReactJS },
	{ id: "postgresql", label: "PostgreSQL", icon: icons.PostgreSQL },
	{ id: "prisma", label: "Prisma", icon: icons.Prisma },
	{ id: "pusher", label: "Pusher", icon: icons.Pusher },
	{ id: "tailwind_css", label: "Tailwind CSS", icon: icons.TailwindCSS },
	{ id: "image_kit", label: "ImageKit", icon: icons.ImageKit },
	{ id: "shadcn", label: "Shadcn", icon: icons.Shadcn },
	{ id: "vercel", label: "Vercel", icon: icons.Vercel },
];

const TechStackDialog = ({ children }: { children: React.ReactNode }) => {
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const title = "The Technologies Powering This App";
	const description =
		"Leveraging modern technologies for fast, responsive, and dynamic experiences with top-tier performance.";

	const renderContent = () => (
		<>
			<SectionHeader>
				<SectionBadge>TECH STACK</SectionBadge>
				<SectionTitle>{title}</SectionTitle>
				<SectionDescription>{description}</SectionDescription>
			</SectionHeader>
			<div className="pt-10 md:px-6">
				<ul className="flex flex-wrap justify-center gap-4">
					{TECH_STACK.map(({ id, label, icon: Icon }) => (
						<li key={id}>
							<div className="flex flex-col justify-center space-y-1.5 text-center">
								<span className="flex size-20 items-center justify-center rounded-xl bg-neutral-200 md:size-24">
									<Icon className="size-12 md:size-14" />
								</span>
								<span className="text-sm font-extrabold leading-none text-neutral-900">
									{label}
								</span>
							</div>
						</li>
					))}
				</ul>
			</div>
		</>
	);

	// Render dialog for desktop
	if (isDesktop) {
		return (
			<Dialog>
				<DialogTrigger asChild>{children}</DialogTrigger>
				<DialogContent className="max-w-xs dark:bg-surface-light-100 sm:max-w-sm md:max-w-xl lg:max-w-2xl">
					<DialogHeader className="hidden">
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
					<DialogBody className="py-12 sm:px-5 sm:py-12 md:px-6">{renderContent()}</DialogBody>
				</DialogContent>
			</Dialog>
		);
	}

	// Render drawer for mobile
	return (
		<Drawer>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent className="dark:bg-surface-light-100">
				<DrawerHeader className="hidden">
					<DrawerTitle>{title}</DrawerTitle>
					<DrawerDescription>{description}</DrawerDescription>
				</DrawerHeader>
				<DrawerBody>{renderContent()}</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};

export default TechStackDialog;
