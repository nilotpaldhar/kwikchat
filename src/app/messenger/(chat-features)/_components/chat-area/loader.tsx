import { motion } from "framer-motion";
import Loader from "@/components/ui/loader";

const ChatAreaLoader = ({ isFetchingNextPage }: { isFetchingNextPage: boolean }) => (
	<motion.div
		initial={{ height: 0 }}
		animate={{ height: isFetchingNextPage ? "80px" : 0 }}
		transition={{ duration: 0.3, ease: "easeIn" }}
		className="flex items-center justify-center"
		style={{ opacity: isFetchingNextPage ? 1 : 0 }}
	>
		{isFetchingNextPage && (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ delay: 0.3 }}
			>
				<Loader />
			</motion.div>
		)}
	</motion.div>
);

export default ChatAreaLoader;
