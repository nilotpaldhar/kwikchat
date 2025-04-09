/* eslint-disable no-console */

import { PrismaClient } from "@prisma/client";
import chalk from "chalk";

import { users } from "@/lib/seeder/data";

const prisma = new PrismaClient();

// Utility function to get a random date within the last year
const getRandomDateInLastYear = () => {
	const now = new Date();
	const currentTime = now.getTime();
	const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).getTime();
	const randomTime = new Date(oneYearAgo + Math.random() * (currentTime - oneYearAgo));
	return randomTime;
};

// Function to generate friendships between users
const generateFriendships = async () => {
	console.log(chalk.yellow("🗑️ Deleting existing friend requests and friendships..."));

	// Delete all existing friend requests and friendships
	await prisma.friendRequest.deleteMany();
	await prisma.friendship.deleteMany();
	console.log(chalk.green("✅ All existing friend requests and friendships deleted successfully."));

	// Fetch the current user (assumed to be the first user in the list)
	const currentUser = await prisma.user.findUnique({
		where: { email: users[0].email },
	});

	// Fetch all users except the current user
	const otherUsers = await prisma.user.findMany({
		where: { id: { not: currentUser?.id } },
	});

	// Create friend requests for the first 20 users
	await Promise.all(
		otherUsers.slice(0, 20).map((user) => {
			const senderId = currentUser?.id;
			const receiverId = user.id;

			if (!senderId || !receiverId) return null;

			return prisma.friendRequest.create({
				data: { senderId, receiverId: receiverId, status: "accepted" },
			});
		})
	);

	// Create friendships for the first 20 users
	await Promise.all(
		otherUsers.slice(0, 20).map((user) => {
			const senderId = currentUser?.id;
			const receiverId = user.id;

			if (!senderId || !receiverId) return null;

			const createdAt = getRandomDateInLastYear().toISOString();
			return prisma.friendship.createMany({
				data: [
					{ userId: senderId, friendId: receiverId, createdAt },
					{ userId: receiverId, friendId: senderId, createdAt },
				],
			});
		})
	);
};

// Main seeding function
const seed = async () => {
	console.log(chalk.blue("🌱 Seeding process started..."));

	try {
		console.log(chalk.yellow("🗑️ Deleting existing user data..."));

		// Delete all existing users
		await prisma.user.deleteMany();
		console.log(chalk.green("✅ All existing users deleted successfully."));

		// Create new users from the provided data
		console.log(chalk.yellow("💾 Creating new users..."));
		await Promise.all(
			users.map((user, idx) =>
				prisma.user.create({
					data: {
						...user,
						isOnline: idx % 2 === 0,
						avatar: `/images/avatars/user-${idx + 1}.svg`,
						createdAt: getRandomDateInLastYear().toISOString(),
						updatedAt: getRandomDateInLastYear().toISOString(),
						userSettings: { create: {} },
					},
				})
			)
		);

		// Create friendships between the new users
		console.log(chalk.yellow("💾 Creating friendships..."));
		await generateFriendships();

		console.log(chalk.blue("🎉 Seeding process completed successfully!"));
	} catch (error) {
		console.log(chalk.red("❌ Seeding process failed. Error details:"));
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

seed();
