import { CheckCircle } from "lucide-react";
import { cn } from "@/utils/general/cn";

interface FeatureListProps {
	items: { id: string; content: string }[];
	className?: string;
}

const FeatureList = ({ items, className }: FeatureListProps) => (
	<ul className={cn("flex flex-col items-start space-y-3 text-left text-neutral-500", className)}>
		{items.map(({ id, content }) => (
			<li key={id} className="flex items-center space-x-2.5">
				<CheckCircle size={16} className="text-primary-400" />
				<span className="block text-sm font-medium md:text-base">{content}</span>
			</li>
		))}
	</ul>
);

export default FeatureList;
