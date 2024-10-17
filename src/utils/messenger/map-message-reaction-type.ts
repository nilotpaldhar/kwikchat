import { MessageReactionType } from "@prisma/client";

export type EmojiUnified = "1f44d" | "2764-fe0f" | "1f603" | "1f622" | "1f64f" | "1f44e" | "1f621";

const mapMessageReactionType = (unified: EmojiUnified) => {
	const reactionMAP = {
		"1f44d": MessageReactionType.like,
		"2764-fe0f": MessageReactionType.love,
		"1f603": MessageReactionType.laugh,
		"1f622": MessageReactionType.sad,
		"1f64f": MessageReactionType.pray,
		"1f44e": MessageReactionType.dislike,
		"1f621": MessageReactionType.angry,
	};

	return reactionMAP[unified] ?? null;
};

export default mapMessageReactionType;
