import type { LucideIcon } from "lucide-react";

interface ValidationFeedbackProps {
	icon?: LucideIcon;
	heading: React.ReactNode;
	children?: React.ReactNode;
}

const ValidationFeedback: React.FC<ValidationFeedbackProps> = ({
	icon: Icon,
	heading,
	children,
}) => (
	<div className="flex flex-col space-y-4 rounded-md border border-neutral-200 bg-surface-light-100 px-6 py-8 dark:border-neutral-900 dark:bg-surface-dark-500">
		<div className="flex items-center justify-center space-x-3">
			{Icon && <Icon size={24} />}
			<h1 className="heading-4 text-center">{heading}</h1>
		</div>
		<div className="flex flex-col space-y-4 text-center text-base text-neutral-700 dark:text-neutral-400">
			{children}
		</div>
	</div>
);

export default ValidationFeedback;
