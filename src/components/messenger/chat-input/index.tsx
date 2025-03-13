"use client";

import { useRef, useState, useCallback } from "react";
import { toast } from "sonner";

import { SendHorizonal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/textarea";

import EmojiButton from "@/components/messenger/chat-input/emoji-button";
import AttachmentPopover, {
	type OnAttachmentUpload,
} from "@/components/messenger/chat-input/attachment-popover";

import { cn } from "@/utils/general/cn";
import { MAX_INPUT_SIZE, MAX_MESSAGE_CHAR_LENGTH } from "@/constants/chat-input";

interface ChatInputProps {
	placeHolder?: string;
	maxMessageLength?: number;
	attachment?: boolean;
	emojiPicker?: boolean;
	className?: string;
	classNames?: {
		wrapperClassName?: string;
		attachmentButtonClassName?: string;
		emojiButtonClassName?: string;
		submitButtonClassName?: string;
	};
	onTextSubmit?: (textMessage: string) => void;
	onAttachmentUpload?: OnAttachmentUpload;
}

const ChatInput = ({
	placeHolder = "Type a message",
	maxMessageLength = MAX_MESSAGE_CHAR_LENGTH,
	attachment = true,
	emojiPicker = true,
	className,
	classNames,
	onTextSubmit,
	onAttachmentUpload,
}: ChatInputProps) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [message, setMessage] = useState("");

	// Function to resize the textarea based on its content
	const resizeTextarea = useCallback((reset: boolean = false) => {
		const textarea = textareaRef.current;

		if (!textarea) return;

		// Reset the height to "auto" for recalculating scroll height
		textarea.style.height = "auto";

		if (reset) return;

		// Calculate and set the new height, but limit it to MAX_INPUT_SIZE
		const newHeight = Math.min(textarea.scrollHeight, MAX_INPUT_SIZE);
		textarea.style.height = `${newHeight}px`;

		// Set overflow based on whether the textarea has reached max height
		textarea.style.overflow = newHeight >= MAX_INPUT_SIZE ? "auto" : "hidden";
	}, []);

	// Function to handle submitting the message
	const handleSubmit = () => {
		const trimmedMessage = message.trim();

		// Prevent submitting empty messages
		if (!trimmedMessage) return;

		// Show a warning if the message exceeds the maximum length
		if (trimmedMessage.length > maxMessageLength) {
			const title = "Message Exceeds Character Limit";
			const description = `The message you’re trying to send is too long. Keep it under ${maxMessageLength} characters or break it into smaller parts.`;
			toast.warning(title, { description, position: "top-right" });
			return;
		}

		// Reset textarea height and submit the message
		resizeTextarea(true);
		if (onTextSubmit) onTextSubmit(trimmedMessage);
		setMessage(""); // Clear message after submission
	};

	// Function to handle emoji selection and insert into message
	const handleEmojiSelect = useCallback(
		(emoji: string) => {
			const textarea = textareaRef.current;
			if (!textarea) return;

			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const currentMessage = message;

			// Insert the emoji at the current cursor position
			const newMessage = currentMessage.slice(0, start) + emoji + currentMessage.slice(end);

			// Update the message and move the cursor to the position after the inserted emoji
			setMessage(newMessage);

			// Update the cursor position to be after the inserted emoji
			setTimeout(() => {
				textarea.setSelectionRange(start + emoji.length, start + emoji.length);
			}, 0);

			resizeTextarea(); // Resize the textarea if needed
		},
		[resizeTextarea, message]
	);

	// Handle the Enter keypress for submitting the message
	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	// Function to handle textarea input changes
	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setMessage(e.target.value);
			resizeTextarea();
		},
		[resizeTextarea]
	);

	return (
		<div className={cn("flex w-full items-start space-x-2", classNames?.wrapperClassName)}>
			{attachment && (
				<AttachmentPopover
					onAttachmentUpload={onAttachmentUpload}
					className={classNames?.attachmentButtonClassName}
				/>
			)}
			<div className="flex flex-1 items-start space-x-1 rounded-lg border border-neutral-200 px-2 dark:border-neutral-800">
				{emojiPicker && (
					<EmojiButton className={classNames?.emojiButtonClassName} onSelect={handleEmojiSelect} />
				)}
				<TextArea
					autoFocus
					rows={1}
					ref={textareaRef}
					value={message}
					onKeyDown={handleKeyDown}
					onChange={handleInputChange}
					placeholder={placeHolder}
					className={cn(
						"h-[40px] resize-none overflow-hidden border-transparent bg-transparent px-0 ring-offset-transparent placeholder:text-neutral-500 focus-visible:ring-transparent dark:border-transparent dark:bg-transparent dark:ring-offset-transparent dark:placeholder:text-neutral-400 dark:focus-visible:ring-transparent",
						"scrollbar-thin scrollbar-track-surface-light-100 scrollbar-thumb-neutral-200 dark:scrollbar-track-surface-dark-600 dark:scrollbar-thumb-neutral-800",
						className
					)}
				/>
			</div>
			<Button
				size="icon"
				variant="outline"
				onClick={handleSubmit}
				className={cn(
					"h-10 w-6 border-transparent bg-transparent text-neutral-500 hover:bg-transparent dark:border-transparent dark:bg-transparent dark:text-neutral-400 dark:hover:bg-transparent",
					classNames?.submitButtonClassName
				)}
			>
				<SendHorizonal size={24} />
				<span className="sr-only">Send Message</span>
			</Button>
		</div>
	);
};

export default ChatInput;
