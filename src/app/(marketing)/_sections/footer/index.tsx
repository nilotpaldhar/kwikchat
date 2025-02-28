"use client";

import dynamic from "next/dynamic";

import SiteLogo from "@/components/site-logo";
import SocialLink from "@/components/social-link";
import SmoothScrollLink from "@/components/smooth-scroll-link";

import Container from "@/app/(marketing)/_components/container";
import TryNowButton from "@/app/(marketing)/_components/try-now-button";
import {
	FoterMenu,
	FoterMenuContent,
	FoterMenuLabel,
	FoterMenuButton,
} from "@/app/(marketing)/_sections/footer/footer-menu";

import { APP_NAME } from "@/constants/seo";
import { NAV_SECTIONS, SOCIAL_MEDIA_LINKS, DEVELOPER_LINKS } from "@/constants/marketing";

import openInNewTab from "@/utils/general/open-in-new-tab";

const TechStackDialog = dynamic(() => import("@/app/(marketing)/_components/tech-stack-dialog"));

const FooterSection = () => {
	const currentYear = new Date().getFullYear();

	return (
		<div className="bg-surface-dark-600 text-neutral-200 dark:bg-surface-dark-600 dark:text-neutral-200">
			<Container>
				<div>
					<div className="py-12 md:py-16">
						<div className="flex flex-col space-y-14 lg:flex-row lg:justify-between lg:space-y-0">
							<div className="max-w-max lg:w-full lg:max-w-md xl:max-w-lg">
								<SiteLogo className="block max-w-max ring-offset-surface-dark-600 dark:ring-offset-surface-dark-600" />
								<div className="pb-6 pt-4">
									<p className="flex flex-col space-y-1 text-sm font-medium">
										<span>A modern chat platform designed for instant,</span>
										<span>secure, and user-friendly communication.</span>
									</p>
								</div>
								<TryNowButton
									bgVariant="primary"
									className="!h-10 px-5 py-2 text-sm ring-offset-surface-dark-600 dark:ring-offset-surface-dark-600"
								/>
							</div>
							<div className="flex flex-col space-y-14 sm:flex-row sm:justify-between sm:space-y-0 lg:flex-1">
								<FoterMenu>
									<FoterMenuLabel>Product</FoterMenuLabel>
									<FoterMenuContent>
										<FoterMenuButton asChild>
											<SmoothScrollLink href={`#${NAV_SECTIONS.features.id}`} offset={80}>
												{NAV_SECTIONS.features.label}
											</SmoothScrollLink>
										</FoterMenuButton>
										<TechStackDialog>
											<FoterMenuButton>Tech Stack</FoterMenuButton>
										</TechStackDialog>
										<FoterMenuButton asChild>
											<SmoothScrollLink href={`#${NAV_SECTIONS.faqs.id}`} offset={80}>
												{NAV_SECTIONS.faqs.label}
											</SmoothScrollLink>
										</FoterMenuButton>
									</FoterMenuContent>
								</FoterMenu>
								<FoterMenu>
									<FoterMenuLabel>Behind the Code</FoterMenuLabel>
									<FoterMenuContent>
										{Object.values(DEVELOPER_LINKS).map(({ id, label, url }) => (
											<FoterMenuButton
												key={id}
												disabled={url === null}
												onClick={() => openInNewTab(url)}
											>
												{label}
											</FoterMenuButton>
										))}
									</FoterMenuContent>
								</FoterMenu>
								<FoterMenu>
									<FoterMenuLabel>Social Media</FoterMenuLabel>
									<FoterMenuContent className="flex-row space-x-4 space-y-0">
										{Object.values(SOCIAL_MEDIA_LINKS).map(({ id, label, url }) => (
											<SocialLink key={id} platform={id} srText={label} url={url} />
										))}
									</FoterMenuContent>
								</FoterMenu>
							</div>
						</div>
					</div>
					<div className="border-t border-neutral-900 py-6 md:py-8">
						<p className="text-center text-sm font-medium">
							&copy; {currentYear} {APP_NAME}. All Rights Reserved
						</p>
					</div>
				</div>
			</Container>
		</div>
	);
};

export default FooterSection;
