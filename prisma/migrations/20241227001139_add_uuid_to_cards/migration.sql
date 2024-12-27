/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Card` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuid` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `card` ADD COLUMN `uuid` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Card_uuid_key` ON `Card`(`uuid`);
