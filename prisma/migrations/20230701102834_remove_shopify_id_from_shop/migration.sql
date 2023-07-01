/*
  Warnings:

  - You are about to drop the column `shopifyId` on the `Shop` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Shop_shopifyId_key";

-- AlterTable
ALTER TABLE "Shop" DROP COLUMN "shopifyId";
