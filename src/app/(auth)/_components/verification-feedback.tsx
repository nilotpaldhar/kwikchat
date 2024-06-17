import type { LucideIcon } from "lucide-react";

interface VerificationFeedbackProps {
	icon?: LucideIcon;
	heading: React.ReactNode;
	children?: React.ReactNode;
}

const VerificationFeedback: React.FC<VerificationFeedbackProps> = ({
	icon: Icon,
	heading,
	children,
}) => (
	<div className="flex flex-col space-y-4 px-6 py-8 rounded-md bg-surface-light-100 border border-neutral-200 dark:bg-surface-dark-500 dark:border-neutral-900">
		<div className="flex justify-center items-center space-x-3">
			{Icon && <Icon size={24} />}
			<h1 className="heading-4">{heading}</h1>
		</div>
		<div className="flex flex-col space-y-4 text-base text-center text-neutral-700 dark:text-neutral-400">
			{children}
		</div>
	</div>
);

export default VerificationFeedback;
