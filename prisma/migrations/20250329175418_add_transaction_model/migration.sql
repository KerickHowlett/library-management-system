-- CreateEnum
CREATE TYPE "TransactionAction" AS ENUM ('CheckedOut', 'Returned');

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL,
    "action" "TransactionAction" NOT NULL,
    "timestamp" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,
    "bookId" UUID NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "transaction_timestamp" ON "transactions"("timestamp");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transaction_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transaction_book" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
