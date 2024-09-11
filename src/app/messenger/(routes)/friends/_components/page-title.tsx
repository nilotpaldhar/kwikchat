import { Loader2 } from "lucide-react";
import { Block, BlockTitle } from "@/components/ui/block";

const PageTitle = ({
	isLoading = false,
	children,
}: {
	isLoading?: boolean;
	children: React.ReactNode;
}) => (
	<Block className="mb-3">
		<BlockTitle className="border-b border-neutral-200 pb-4 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
			<div className="flex items-center justify-between">
				<div>{children}</div>
				{isLoading && <Loader2 size={16} className="animate-spin" />}
			</div>
		</BlockTitle>
	</Block>
);

export default PageTitle;
