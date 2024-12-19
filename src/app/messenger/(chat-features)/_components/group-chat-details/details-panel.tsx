"use client";

import type { GroupOverview } from "@/types";
import type { RefetchOptions } from "@tanstack/react-query";

import { XIcon, ImageIcon, ChevronRight, Star, LogOut } from "lucide-react";

import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";

import {
	SidePanel,
	SidePanelHeader,
	SidePanelContent,
} from "@/app/messenger/_components/side-panel";
import ErrorAlert from "@/app/messenger/_components/error-alert";
import GroupInsightsCard from "@/app/messenger/(chat-features)/_components/group-insights-card";

interface DetailsPanelProps {
	overview?: GroupOverview;
	isLoading?: boolean;
	isError?: boolean;
	error: Error | null;
	refetch: (options?: RefetchOptions) => void;
	onClose: () => void;
}

const DetailsPanel = ({
	overview,
	isLoading,
	error,
	isError,
	refetch,
	onClose,
}: DetailsPanelProps) => (
	<SidePanel>
		<SidePanelHeader>
			<div className="flex w-full items-center justify-between space-x-3">
				<h1 className="text-base font-semibold leading-none">Group Info</h1>
				<Button
					variant="outline"
					size="icon"
					className="size-5 border-transparent bg-transparent p-0 text-neutral-700 hover:bg-transparent dark:border-transparent dark:bg-transparent dark:text-neutral-300 dark:hover:bg-transparent"
					onClick={onClose}
				>
					<XIcon size={20} />
					<span className="sr-only">Close</span>
				</Button>
			</div>
		</SidePanelHeader>
		<SidePanelContent className="h-full p-0">
			{isLoading ? (
				<div className="flex h-[calc(100vh-80px)] w-full items-center justify-center">
					<Loader />
				</div>
			) : (
				<div>
					{!isError && overview ? (
						<GroupInsightsCard overview={overview} />
					) : (
						<ErrorAlert onClick={() => refetch()}>
							{error ? error.message : "Something went wrong!"}
						</ErrorAlert>
					)}
					<div className="flex flex-col space-y-3 px-5 pb-4">
						<Button
							variant="outline"
							className="space-x-2 dark:border-neutral-700/50 dark:bg-transparent dark:hover:bg-transparent"
						>
							<ImageIcon size={16} />
							<span className="flex-1 text-left font-semibold">Shared Media</span>
							<ChevronRight size={16} />
						</Button>
						<Button
							variant="outline"
							className="space-x-2 dark:border-neutral-700/50 dark:bg-transparent dark:hover:bg-transparent"
						>
							<Star size={16} />
							<span className="flex-1 text-left font-semibold">Starred Messages</span>
							<ChevronRight size={16} />
						</Button>
						<Button
							variant="danger"
							className="w-full items-center justify-start space-x-2 md:justify-center"
						>
							<LogOut size={16} />
							<span className="font-semibold">Exit Group</span>
						</Button>
					</div>
				</div>
			)}
		</SidePanelContent>
	</SidePanel>
);

export default DetailsPanel;
