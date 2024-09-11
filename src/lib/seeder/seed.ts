/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */

import { PrismaClient } from "@prisma/client";
import chalk from "chalk";

import { users } from "@/lib/seeder/data";

const prisma = new PrismaClient();

function getRandomDateInLastYear(): Date {
	const now = new Date();
	const currentTime = now.getTime();
	const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).getTime();
	const randomTime = new Date(oneYearAgo + Math.random() * (currentTime - oneYearAgo));
	return randomTime;
}

const seed = async () => {
	console.log(chalk.blue("🌱 Seeding process started..."));

	try {
		console.log(chalk.yellow("🗑️ Deleting existing user data..."));
		await prisma.user.deleteMany();
		console.log(chalk.green("✅ All existing users deleted successfully."));

		// Creating new users
		console.log(chalk.yellow("💾 Creating new users..."));
		await Promise.all(
			users.map((user) =>
				prisma.user.create({
					data: {
						...user,
						createdAt: getRandomDateInLastYear().toISOString(),
						updatedAt: getRandomDateInLastYear().toISOString(),
						userSettings: { create: {} },
					},
				})
			)
		);

		console.log(chalk.blue("🎉 Seeding process completed successfully!"));
	} catch (error) {
		console.log(chalk.red("❌ Seeding process failed. Error details:"));
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
};

seed();
