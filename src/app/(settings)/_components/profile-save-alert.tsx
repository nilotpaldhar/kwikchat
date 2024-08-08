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
					<div className="flex flex-col items-start space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:justify-between px-4 py-3 sm:p-2 sm:pl-4 rounded-md border border-neutral-200 bg-surface-light-100 dark:border-transparent dark:bg-surface-dark-500">
						<div className="text-sm leading-6 font-medium">Careful - you have unsaved changes!</div>
						<div className="flex items-center w-full space-x-2 sm:w-auto">
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
								className="h-8 space-x-2 flex-1"
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
