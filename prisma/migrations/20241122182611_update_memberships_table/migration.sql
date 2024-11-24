/*
  Warnings:

  - You are about to drop the column `end_name` on the `memberships` table. All the data in the column will be lost.
  - Added the required column `last_name` to the `memberships` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "memberships" DROP COLUMN "end_name",
ADD COLUMN     "last_name" VARCHAR(100) NOT NULL;
