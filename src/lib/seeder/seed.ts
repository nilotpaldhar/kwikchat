/* eslint-disable no-console */

import { PrismaClient } from "@prisma/client";
import pLimit from "p-limit";
import bcrypt from "bcryptjs";
import chalk from "chalk";

import * as data from "@/lib/seeder/data";
import { getRandomDateInLastYear } from "@/lib/seeder/utils";

const prisma = new PrismaClient();
const limit = pLimit(5); // Adjust if needed (5 concurrent inserts)

/**
 * Clears all data from relevant tables in the database.
 * Used to ensure the database is clean before seeding new data.
 */
const clearDB = async () => {
	console.log(chalk.blue("🧹 Clearing database..."));
	await prisma.$transaction([
		prisma.conversation.deleteMany(),
		prisma.media.deleteMany(),
		prisma.friendRequest.deleteMany(),
		prisma.friendship.deleteMany(),
		prisma.verificationToken.deleteMany(),
		prisma.passwordResetToken.deleteMany(),
		prisma.twoFactorToken.deleteMany(),
		prisma.twoFactorConfirmation.deleteMany(),
		prisma.user.deleteMany(),
	]);
	console.log(chalk.green("✅ All tables cleared."));
};

/**
 * Creates a demo user account.
 * The demo user is used for testing and seeding purposes.
 */
const createDemoAccount = async () => {
	const hashedPassword = await bcrypt.hash(data.demoUserAccount.password, 10);

	const demoUser = await prisma.user.create({
		data: {
			...data.demoUserAccount,
			avatar: `/images/avatars/demo-user.svg`,
			password: hashedPassword,
			createdAt: getRandomDateInLastYear().toISOString(),
			updatedAt: getRandomDateInLastYear().toISOString(),
			userSettings: { create: {} },
		},
	});

	return demoUser;
};

/**
 * Generates a list of users and stores them in the database.
 * The number of users is controlled by the `max` parameter (default is 30).
 *
 * @param max The maximum number of users to generate (defaults to 30).
 * @returns The list of created users.
 */
const generateUsers = async ({ max = 30 }: { max?: number } = {}) => {
	const hashedPassword = await bcrypt.hash(data.universalUserPassword, 10);

	const users = await Promise.all(
		data.users.slice(0, max).map((user, idx) =>
			limit(() =>
				prisma.user.create({
					data: {
						...user,
						isOnline: idx % 2 === 0,
						avatar: `/images/avatars/user-${idx + 1}.svg`,
						password: hashedPassword,
						createdAt: getRandomDateInLastYear().toISOString(),
						updatedAt: getRandomDateInLastYear().toISOString(),
						userSettings: { create: {} },
					},
				})
			)
		)
	);

	console.log(chalk.green(`✅ Generated ${users.length} users successfully`));
	return users;
};

/**
 * Generates friendships between the demo user and other users.
 * Creates both the friend requests and the friendships in the database.
 *
 * @param demoUserId The ID of the demo user.
 * @param otherUserIds The list of other user IDs to create friendships with.
 */
const generateFriendships = async ({
	demoUserId,
	otherUserIds,
}: {
	demoUserId: string;
	otherUserIds: string[];
}) => {
	console.log(chalk.blue("🤝 Creating friendships..."));

	// Create friend requests for each user
	await prisma.friendRequest.createMany({
		data: otherUserIds.map((otherUserId) => ({
			senderId: demoUserId,
			receiverId: otherUserId,
			status: "accepted",
		})),
	});

	// Create friendships for each accepted friend request
	await Promise.all(
		otherUserIds.map((id) =>
			limit(() => {
				const senderId = demoUserId;
				const receiverId = id;
				const createdAt = getRandomDateInLastYear().toISOString();

				return prisma.friendship.createMany({
					data: [
						{ userId: senderId, friendId: receiverId, createdAt },
						{ userId: receiverId, friendId: senderId, createdAt },
					],
				});
			})
		)
	);

	console.log(chalk.green("✅ Friendships created successfully"));
};

/**
 * Generates conversations between the demo user and other users.
 * Each conversation is private (not a group chat), and each conversation has two members: the demo user and one other user.
 *
 * @param demoUserId The ID of the demo user.
 * @param otherUserIds The list of other user IDs to create conversations with.
 * @returns The list of created conversations.
 */
const generateConversations = async ({
	demoUserId,
	otherUserIds,
}: {
	demoUserId: string;
	otherUserIds: string[];
}) => {
	console.log(chalk.blue("💬 Creating conversations..."));

	// Create one conversation per other user
	const tasks = otherUserIds.map((otherUserId) =>
		limit(() =>
			prisma.conversation.create({
				data: {
					isGroup: false, // Private conversation (not a group chat)
					createdBy: demoUserId,
					members: {
						create: [{ userId: demoUserId }, { userId: otherUserId }],
					},
				},
			})
		)
	);

	const conversations = await Promise.all(tasks);
	console.log(chalk.green(`✅ Created ${conversations.length} conversations`));
	return conversations;
};

/**
 * Generates text messages for each conversation.
 * For each conversation, it generates a series of messages alternating between the demo user and the other user.
 *
 * @param demoUserId The ID of the demo user.
 * @param otherUserIds The list of other user IDs.
 * @param conversationIds The list of conversation IDs corresponding to each other user.
 */
const generateMessages = async ({
	demoUserId,
	otherUserIds,
	conversationIds,
}: {
	demoUserId: string;
	otherUserIds: string[];
	conversationIds: string[];
}) => {
	console.log(chalk.blue("📝 Generating messages..."));

	// Check if lengths of arrays match
	if (
		otherUserIds.length !== conversationIds.length ||
		otherUserIds.length !== data.messagesPerConversation.length
	) {
		console.error(chalk.red("❌ Array lengths must match."));
		return;
	}

	// Create messages for each conversation
	const tasks = conversationIds.map((conversationId, index) => {
		const otherUserId = otherUserIds[index];
		const messages = data.messagesPerConversation[index];

		return Promise.all(
			messages.map((msg, msgIdx) =>
				limit(() =>
					prisma.message.create({
						data: {
							type: "text",
							conversationId,
							senderId: msgIdx % 2 === 0 ? demoUserId : otherUserId,
							textMessage: { create: { content: msg } },
						},
					})
				)
			)
		);
	});

	await Promise.all(tasks);
	console.log(chalk.green("✅ Generated messages successfully"));
};

/**
 * The main seeding function that coordinates all other seeding steps.
 * It clears the database, generates the demo user, creates other users, generates friendships, conversations, and messages.
 */
const seed = async () => {
	console.log(chalk.blue("🌱 Seeding process started..."));

	try {
		// Clear the existing database entries
		await clearDB();

		// Create the demo user account
		const { id: demoUserId } = await createDemoAccount();
		console.log(chalk.green("✅ Created demo account successfully"));

		// Generate other users
		const generatedUsers = await generateUsers();
		const otherUserIds = generatedUsers.map(({ id }) => id);

		// Create friendships between the demo user and the other users
		await generateFriendships({ demoUserId, otherUserIds });

		// Create private conversations between the demo user and the other users
		const conversations = await generateConversations({ demoUserId, otherUserIds });

		// Generate messages for each conversation
		await generateMessages({
			demoUserId,
			otherUserIds,
			conversationIds: conversations.map(({ id }) => id),
		});

		console.log(chalk.green("🌱 Seeding completed successfully."));
	} catch (error) {
		console.error(chalk.red("❌ Seeding failed:", error));
	} finally {
		await prisma.$disconnect();
	}
};

// Start the seeding process
seed();
