DROP TABLE "public"."Tournament" CASCADE;
DROP TABLE "public"."Comment" CASCADE;
DROP TABLE "public"."Tag" CASCADE;

CREATE TABLE "public"."Tournament" (
  id SERIAL PRIMARY KEY NOT NULL,
  "eventDate" VARCHAR(255) UNIQUE NOT NULL,
  "stockInfo" TEXT NOT NULL
);
CREATE TABLE "public"."Comment" (
  id SERIAL PRIMARY KEY NOT NULL,
  author VARCHAR(255),
  message TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "tournamentId" INTEGER NOT NULL,
  FOREIGN KEY ("tournamentId") REFERENCES "public"."Tournament"(id)
);
CREATE TABLE "public"."Tag" (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  "commentId" INTEGER NOT NULL,
  FOREIGN KEY ("commentId") REFERENCES "public"."Comment"(id)
);