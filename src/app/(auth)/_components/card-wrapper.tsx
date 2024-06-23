import type { LucideIcon } from "lucide-react";
import {
	Card,
	CardHeader,
	CardIcon,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/app/(auth)/_components/card";

interface CardWrapperProps {
	icon: LucideIcon;
	title: React.ReactNode;
	description?: React.ReactNode;
	children: React.ReactNode;
}

const CardWrapper: React.FC<CardWrapperProps> = ({ icon, title, description, children }) => (
	<Card>
		<CardHeader>
			<CardIcon icon={icon} />
			<div>
				<CardTitle>{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</div>
		</CardHeader>
		<CardContent>{children}</CardContent>
	</Card>
);

export default CardWrapper;
