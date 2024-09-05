import { Block, BlockTitle } from "@/components/ui/block";

const PageTitle = ({ children }: { children: React.ReactNode }) => (
	<Block className="mb-3">
		<BlockTitle className="border-b border-neutral-200 pb-4 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
			{children}
		</BlockTitle>
	</Block>
);

export default PageTitle;
