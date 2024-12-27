/*
  Warnings:

  - You are about to drop the column `uuid` on the `card` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Card_uuid_key` ON `card`;

-- AlterTable
ALTER TABLE `card` DROP COLUMN `uuid`;
