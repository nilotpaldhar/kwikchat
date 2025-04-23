import { Smile, CloudLightning, Users, ShieldCheck, ImagePlus } from "lucide-react";

import {
	SectionHeader,
	SectionBadge,
	SectionTitle,
	SectionDescription,
} from "@/app/(marketing)/_components/section-header";
import Container from "@/app/(marketing)/_components/container";

import {
	FeatureCard,
	FeatureCardHeader,
	FeatureCardIcon,
	FeatureCardBody,
	FeatureCardTitle,
	FeatureCardDescription,
} from "@/app/(marketing)/_sections/features/feature-card";
import {
	FeatureBlock,
	FeatureBlockImage,
	FeatureBlockContent,
} from "@/app/(marketing)/_sections/features/feature-block";
import FeatureList from "@/app/(marketing)/_sections/features/feature-list";

import { APP_FEATURE_IMAGES } from "@/constants/media";

const SECURITY_FEATURES = [
	{
		id: "two-factor-authentication-toggle",
		content: "Two-Factor Authentication (2FA) toggle from your dashboard",
	},
	{
		id: "secure-session-password-management",
		content: "Secure session handling and password management",
	},
];

const UI_ENHANCEMENT_FEATURES = [
	{
		id: "instant-media-previews",
		content: "Instant media previews before upload",
	},
	{
		id: "accessible-ui-tailwind-shadcn",
		content: "Clean, accessible UI with Tailwind CSS and Shadcn UI",
	},
	{
		id: "dark-light-mode-support",
		content: "Full dark/light mode support for any environment",
	},
];

const FeaturesSection = () => (
	<div>
		<Container>
			<SectionHeader>
				<SectionBadge>FEATURES</SectionBadge>
				<SectionTitle>Powerful Features, Seamless Experience</SectionTitle>
				<SectionDescription>
					Designed for speed, security, and simplicity—enjoy real-time messaging with modern,
					user-friendly features.
				</SectionDescription>
			</SectionHeader>
			<div className="pt-16 md:pt-20">
				<div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-16 lg:grid-cols-4">
					<div>
						<FeatureCard>
							<FeatureCardHeader>
								<FeatureCardIcon className="bg-blue-50 text-blue-600" icon={Smile} />
							</FeatureCardHeader>
							<FeatureCardBody>
								<FeatureCardTitle>Easy to Use</FeatureCardTitle>
								<FeatureCardDescription>
									Intuitive design, allowing effortless navigation and chatting.
								</FeatureCardDescription>
							</FeatureCardBody>
						</FeatureCard>
					</div>
					<div>
						<FeatureCard>
							<FeatureCardHeader>
								<FeatureCardIcon className="bg-amber-50 text-amber-600" icon={CloudLightning} />
							</FeatureCardHeader>
							<FeatureCardBody>
								<FeatureCardTitle>Real Time</FeatureCardTitle>
								<FeatureCardDescription>
									Instant, seamless messaging with zero noticeable delays and lag.
								</FeatureCardDescription>
							</FeatureCardBody>
						</FeatureCard>
					</div>
					<div>
						<FeatureCard>
							<FeatureCardHeader>
								<FeatureCardIcon className="bg-purple-50 text-purple-600" icon={Users} />
							</FeatureCardHeader>
							<FeatureCardBody>
								<FeatureCardTitle>Group Chat</FeatureCardTitle>
								<FeatureCardDescription>
									Create and manage conversations with multiple participants.
								</FeatureCardDescription>
							</FeatureCardBody>
						</FeatureCard>
					</div>
					<div>
						<FeatureCard>
							<FeatureCardHeader>
								<FeatureCardIcon className="bg-red-50 text-red-600" icon={ShieldCheck} />
							</FeatureCardHeader>
							<FeatureCardBody>
								<FeatureCardTitle>Security</FeatureCardTitle>
								<FeatureCardDescription>
									Secure your account with two-factor authentication for safety.
								</FeatureCardDescription>
							</FeatureCardBody>
						</FeatureCard>
					</div>
				</div>
			</div>
			<div className="pt-20 md:pt-32 lg:pt-36">
				<div className="grid grid-cols-1 gap-20 md:gap-32 lg:gap-36">
					<FeatureBlock>
						<FeatureBlockImage
							src={APP_FEATURE_IMAGES.realTimeChat.src}
							alt={APP_FEATURE_IMAGES.realTimeChat.alt}
							width={APP_FEATURE_IMAGES.realTimeChat.width}
							height={APP_FEATURE_IMAGES.realTimeChat.height}
							className="lg:order-1 lg:justify-end"
							classNames={{
								imageBackground: "lg:pl-10 lg:pr-0",
								imageContainer: "lg:rounded-b-none lg:rounded-l-xl lg:rounded-r-none",
							}}
						/>
						<FeatureBlockContent>
							<SectionHeader className="items-start">
								<SectionBadge className="space-x-1.5">
									<CloudLightning size={16} />
									<span>REAT TIME</span>
								</SectionBadge>
								<SectionTitle className="text-left">
									Real-Time Messaging with Zero Delay & Instant Delivery
								</SectionTitle>
								<SectionDescription className="max-w-full text-left font-normal text-neutral-700">
									Experience seamless conversations with instant message delivery using Pusher and
									TanStack Query. Group chats, emoji reactions, starred messages, and live delivery
									indicators make every chat dynamic and responsive.
								</SectionDescription>
							</SectionHeader>
						</FeatureBlockContent>
					</FeatureBlock>

					<FeatureBlock>
						<FeatureBlockImage
							src={APP_FEATURE_IMAGES.secureMessaging.src}
							alt={APP_FEATURE_IMAGES.secureMessaging.alt}
							width={APP_FEATURE_IMAGES.secureMessaging.width}
							height={APP_FEATURE_IMAGES.secureMessaging.height}
						/>
						<FeatureBlockContent>
							<SectionHeader className="items-start">
								<SectionBadge className="space-x-1.5">
									<ShieldCheck size={16} />
									<span>SAFETY & SECURITY</span>
								</SectionBadge>
								<SectionTitle className="text-left">Built-In Security That Just Works</SectionTitle>
								<SectionDescription className="max-w-full text-left font-normal text-neutral-700">
									Your privacy is backed by enterprise-grade authentication and smart security
									controls:
								</SectionDescription>
								<FeatureList items={SECURITY_FEATURES} />
							</SectionHeader>
						</FeatureBlockContent>
					</FeatureBlock>

					<FeatureBlock>
						<FeatureBlockImage
							src={APP_FEATURE_IMAGES.richChatExperience.src}
							alt={APP_FEATURE_IMAGES.richChatExperience.alt}
							width={APP_FEATURE_IMAGES.richChatExperience.width}
							height={APP_FEATURE_IMAGES.richChatExperience.height}
							className="lg:order-1 lg:justify-end"
							classNames={{
								imageBackground: "lg:pl-10 lg:pr-0",
								imageContainer: "lg:rounded-b-none lg:rounded-l-xl lg:rounded-r-none",
							}}
						/>
						<FeatureBlockContent>
							<SectionHeader className="items-start">
								<SectionBadge className="space-x-1.5">
									<ImagePlus size={16} />
									<span>UX + MEDIA</span>
								</SectionBadge>
								<SectionTitle className="text-left">
									Media-Rich Chats in a Beautiful Interface
								</SectionTitle>
								<SectionDescription className="max-w-full text-left font-normal text-neutral-700">
									Share and preview media without leaving the chat. The interface is mobile-first,
									lightweight, and sharp — powered by:
								</SectionDescription>
								<FeatureList items={UI_ENHANCEMENT_FEATURES} />
							</SectionHeader>
						</FeatureBlockContent>
					</FeatureBlock>
				</div>
			</div>
		</Container>
	</div>
);

export default FeaturesSection;
