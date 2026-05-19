/*
  Warnings:

  - Added the required column `cvv` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiry` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullNumber` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Card` ADD COLUMN `cvv` VARCHAR(4) NOT NULL,
    ADD COLUMN `expiry` VARCHAR(5) NOT NULL,
    ADD COLUMN `fullNumber` VARCHAR(19) NOT NULL;

-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `bankAccountId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `BankAccount` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `institutionId` VARCHAR(191) NOT NULL,
    `institutionName` VARCHAR(191) NOT NULL,
    `logoColor` VARCHAR(191) NOT NULL,
    `logoLetter` VARCHAR(2) NOT NULL,
    `accountType` ENUM('CHECKING', 'SAVINGS') NOT NULL DEFAULT 'CHECKING',
    `lastFour` VARCHAR(4) NOT NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BankAccount_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Transaction_bankAccountId_idx` ON `Transaction`(`bankAccountId`);

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_bankAccountId_fkey` FOREIGN KEY (`bankAccountId`) REFERENCES `BankAccount`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BankAccount` ADD CONSTRAINT `BankAccount_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
