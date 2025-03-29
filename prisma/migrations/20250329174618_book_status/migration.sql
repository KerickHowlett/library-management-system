-- CreateEnum
CREATE TYPE "BookStatus" AS ENUM ('CheckedOut', 'OnShelf');

-- AlterTable
ALTER TABLE "books" ADD COLUMN     "status" "BookStatus" NOT NULL DEFAULT 'OnShelf';
