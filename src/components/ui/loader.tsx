import { cn } from "@/utils/general/cn";
import PulseLoader from "react-spinners/PulseLoader";

interface LoaderProps {
	color?: string;
	loading?: boolean;
	size?: number;
	containerClassName?: string;
	className?: string;
}

const Loader = ({
	color = "#27AE80",
	loading = false,
	size = 8,
	containerClassName,
	className,
}: LoaderProps) => (
	<div className={cn("flex items-center justify-center py-2", containerClassName)}>
		<PulseLoader
			color={color}
			loading={loading}
			size={size}
			aria-label="Loading Spinner"
			className={className}
		/>
	</div>
);

export default Loader;
