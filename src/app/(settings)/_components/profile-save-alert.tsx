"use client";

import { AnimatePresence, motion } from "framer-motion";
import useProfileStore from "@/store/use-profile-store";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ProfileSaveAlertProps {
	loading?: boolean;
	onReset: () => void;
	onSave: () => void;
}

const ProfileSaveAlert = ({ loading = false, onReset, onSave }: ProfileSaveAlertProps) => {
	const { hasChanges } = useProfileStore();

	return (
		<AnimatePresence>
			{hasChanges && (
				<motion.div
					initial={{ opacity: 0, y: 100 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 100 }}
					transition={{ type: "spring" }}
				>
					<div className="flex flex-col items-start space-y-3 rounded-md border border-neutral-200 bg-surface-light-100 px-4 py-3 dark:border-transparent dark:bg-surface-dark-500 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:p-2 sm:pl-4">
						<div className="text-sm font-medium leading-6">Careful - you have unsaved changes!</div>
						<div className="flex w-full items-center space-x-2 sm:w-auto">
							<Button
								onClick={onReset}
								variant="outline"
								disabled={loading}
								className="h-8 flex-1 bg-transparent hover:bg-transparent dark:bg-transparent"
							>
								Reset
							</Button>

							<Button
								variant="success"
								className="h-8 flex-1 space-x-2"
								disabled={loading}
								onClick={onSave}
							>
								{loading && <Loader2 size={16} className="animate-spin" />}
								<span>{loading ? "Saving..." : "Save Changes"}</span>
							</Button>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ProfileSaveAlert;
