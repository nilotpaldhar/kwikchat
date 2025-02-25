import { Smile, CloudLightning, Users, ShieldCheck, MessagesSquare } from "lucide-react";

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

const ADVANCED_MESSAGING_FEATURES = [
	{ id: "group_chat", content: "Connect with multiple people in a single conversation." },
	{ id: "editable_messages", content: "Edit messages and express yourself with reactions." },
	{ id: "media_sharing", content: "Share media and documents effortlessly." },
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
									Integer a aliquam massa. Nunc dapibus dolor eu felis aliquet ullamcorper. Vivamus
									elementum purus id augue auctor, eu finibus nunc fermentum.
								</SectionDescription>
							</SectionHeader>
						</FeatureBlockContent>
					</FeatureBlock>

					<FeatureBlock>
						<FeatureBlockImage
							src={APP_FEATURE_IMAGES.richChatExperience.src}
							alt={APP_FEATURE_IMAGES.richChatExperience.alt}
							width={APP_FEATURE_IMAGES.richChatExperience.width}
							height={APP_FEATURE_IMAGES.richChatExperience.height}
						/>
						<FeatureBlockContent>
							<SectionHeader className="items-start">
								<SectionBadge className="space-x-1.5">
									<MessagesSquare size={16} />
									<span>RICH CHAT EXPERIENCE</span>
								</SectionBadge>
								<SectionTitle className="text-left">
									Advanced Messaging Features for a Rich Chat Experience
								</SectionTitle>
								<SectionDescription className="max-w-full text-left font-normal text-neutral-700">
									Integer a aliquam massa. Nunc dapibus dolor eu felis aliquet ullamcorper vivamus
									elementum.
								</SectionDescription>
								<FeatureList items={ADVANCED_MESSAGING_FEATURES} />
							</SectionHeader>
						</FeatureBlockContent>
					</FeatureBlock>

					<FeatureBlock>
						<FeatureBlockImage
							src={APP_FEATURE_IMAGES.secureMessaging.src}
							alt={APP_FEATURE_IMAGES.secureMessaging.alt}
							width={APP_FEATURE_IMAGES.secureMessaging.width}
							height={APP_FEATURE_IMAGES.secureMessaging.height}
							className="lg:order-1 lg:justify-end"
							classNames={{
								imageBackground: "lg:pl-10 lg:pr-0",
								imageContainer: "lg:rounded-b-none lg:rounded-l-xl lg:rounded-r-none",
							}}
						/>
						<FeatureBlockContent>
							<SectionHeader className="items-start">
								<SectionBadge className="space-x-1.5">
									<ShieldCheck size={16} />
									<span>SAFETY AND SECURITY</span>
								</SectionBadge>
								<SectionTitle className="text-left">
									Strengthen Your Account Security & Customize Your Chat Experience
								</SectionTitle>
								<SectionDescription className="max-w-full text-left font-normal text-neutral-700">
									Integer a aliquam massa. Nunc dapibus dolor eu felis aliquet ullamcorper. Vivamus
									elementum purus id augue auctor, eu finibus nunc fermentum.
								</SectionDescription>
							</SectionHeader>
						</FeatureBlockContent>
					</FeatureBlock>
				</div>
			</div>
		</Container>
	</div>
);

export default FeaturesSection;
