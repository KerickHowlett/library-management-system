-- CreateTable
CREATE TABLE "books" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "edition" VARCHAR(50),
    "author" VARCHAR(255) NOT NULL,
    "genre" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(0) NOT NULL,
    "userId" UUID,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(0) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "books_title_edition_author_key" ON "books"("title", "edition", "author");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "checked_out_by" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
