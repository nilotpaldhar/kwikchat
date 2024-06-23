/*
  Warnings:

  - You are about to drop the column `created_at` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `provider_account_id` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `display_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email_verified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `color_theme` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `two_factor_enabled` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `UserSettings` table. All the data in the column will be lost.
  - Added the required column `providerAccountId` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UserSettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "created_at",
DROP COLUMN "provider_account_id",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "providerAccountId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "created_at",
DROP COLUMN "display_name",
DROP COLUMN "email_verified",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UserSettings" DROP COLUMN "color_theme",
DROP COLUMN "created_at",
DROP COLUMN "two_factor_enabled",
DROP COLUMN "updated_at",
ADD COLUMN     "colorTheme" "ThemeOptions" NOT NULL DEFAULT 'light',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
