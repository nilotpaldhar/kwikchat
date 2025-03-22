"use client";

import type { ImageMessage, Media } from "@prisma/client";

import ErrorAlert from "@/app/messenger/_components/error-alert";
import ChatMessageImageGallery from "@/app/messenger/(chat-features)/_components/chat-message/chat-message-image/image-gallery";
import ImageGallerySkeleton from "@/app/messenger/(chat-features)/_components/chat-message/chat-message-image/image-gallery-skeleton";

import { useMessageMediaAttachmentsQuery } from "@/hooks/tanstack-query/use-media";
import { PLACEHOLDER_CHAT_IMAGE } from "@/constants/media";

import { cn } from "@/utils/general/cn";
import { isTempId } from "@/utils/general/temp-id-generator";
import { useMemo } from "react";

interface ChatMessageImageProps {
	conversationId: string;
	messageId: string;
	isSender: boolean;
	attachments: ImageMessage[];
	className?: string;
}

// Utility function to generate class names
const getGalleryClassNames = ({ isSender, className }: { isSender: boolean; className?: string }) =>
	cn(
		"w-56 overflow-hidden rounded-xl p-3 shadow-md sm:w-80",
		isSender
			? "rounded-tr-none bg-primary-400 text-neutral-50"
			: "rounded-tl-none bg-surface-light-100 dark:bg-surface-dark-400",
		className
	);

// Function to get media gallery items (for both temp & fetched messages)
const getMediaGallery = ({
	attachments,
	isTemp,
	fetchedData,
}: {
	attachments: ImageMessage[];
	isTemp: boolean;
	fetchedData?: Media[];
}) => {
	if (isTemp) {
		return attachments.map((media) => ({
			id: media.id,
			imagePath: undefined,
			imageName: media.fileName ?? "Image",
			imageUrl: media.tempDataUrl ?? PLACEHOLDER_CHAT_IMAGE,
		}));
	}

	return (
		fetchedData?.map((media) => ({
			id: media.id,
			imagePath: media.filePath,
			imageName: media.name,
			imageUrl: media.url,
		})) ?? []
	);
};

const ChatMessageImage = ({
	conversationId,
	messageId,
	isSender,
	attachments,
	className,
}: ChatMessageImageProps) => {
	// Maximum number of images displayed in the gallery preview
	const maxVisibleImages = 4;

	// Check if the message is temporary (not yet persisted in the database)
	const isTemp = isTempId(messageId);

	// Fetch media attachments only if the message is not temporary
	const { data, isLoading, isError, error, refetch } = useMessageMediaAttachmentsQuery({
		conversationId,
		messageId,
		enabled: !isTemp,
	});

	// Generate media gallery data, using fetched media if available, otherwise using temporary attachments
	const mediaGallery = useMemo(
		() => getMediaGallery({ attachments, isTemp, fetchedData: data?.data }),
		[attachments, isTemp, data]
	);

	// Determine the content to render based on query status
	let content;
	if (isLoading) {
		content = <ImageGallerySkeleton count={Math.min(attachments.length, maxVisibleImages)} />;
	} else if (isError) {
		content = (
			<ErrorAlert onClick={refetch}>{error?.message ?? "Something went wrong!"}</ErrorAlert>
		);
	} else {
		content = (
			<ChatMessageImageGallery
				mediaGallery={mediaGallery}
				maxVisibleImages={maxVisibleImages}
				isDownloadable={!isTemp}
			/>
		);
	}

	return <div className={getGalleryClassNames({ isSender, className })}>{content}</div>;
};

export default ChatMessageImage;
