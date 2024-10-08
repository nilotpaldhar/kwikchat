import type { MessageReaction, MessageReactionType } from "@prisma/client";

// Interface representing a grouped reaction with type and emoji image URL.
interface GroupedReaction {
	type: MessageReactionType;
	emojiImageUrl: string;
}

/**
 * Groups a list of message reactions by their type, ensuring unique entries.
 */
const groupReactionsByType = (reactions: MessageReaction[]) =>
	reactions.reduce((grouped: GroupedReaction[], reaction: MessageReaction) => {
		// Check if a reaction of this type already exists in the grouped list
		const existingReaction = grouped.find((r) => r.type === reaction.type);

		// If the reaction type is not already in the grouped list, add it
		if (!existingReaction) {
			grouped.push({
				type: reaction.type,
				emojiImageUrl: reaction.emojiImageUrl,
			});
		}

		return grouped;
	}, []);

export default groupReactionsByType;
