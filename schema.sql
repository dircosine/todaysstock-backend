-- DROP TABLE "public"."Tournament" CASCADE;
-- DROP TABLE "public"."Comment" CASCADE;
-- DROP TABLE "public"."Tag" CASCADE;
-- DROP TABLE "public"."User" CASCADE;
-- DROP TABLE "public"."TournamentResult" CASCADE;

CREATE TABLE "public"."Tournament" (
  id SERIAL PRIMARY KEY NOT NULL,
  "eventDate" VARCHAR(255) UNIQUE NOT NULL,
  "turnCount" INTEGER NOT NULL,
  "stockInfo" TEXT NOT NULL,
  scores TEXT NOT NULL,
  "marketStat" TEXT NOT NULL 
);
CREATE TABLE "public"."User" (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL
);
CREATE TABLE "public"."Comment" (
  id SERIAL PRIMARY KEY NOT NULL,
  message TEXT NOT NULL,
  tags VARCHAR(50)[],
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "tournamentId" INTEGER NOT NULL,
  "userId" INTEGER,
  FOREIGN KEY ("tournamentId") REFERENCES "public"."Tournament"(id),
  FOREIGN KEY ("userId") REFERENCES "public"."User"(id)
);
CREATE TABLE "public"."TournamentResult" (
  id SERIAL PRIMARY KEY NOT NULL,
  "rank" VARCHAR(50)[] NOT NULL,
  "market" TEXT NOT NULL,
  "tournamentId" INTEGER NOT NULL,
  "userId" INTEGER,
  FOREIGN KEY ("tournamentId") REFERENCES "public"."Tournament"(id),
  FOREIGN KEY ("userId") REFERENCES "public"."User"(id)
);


-- ALTER TABLE "public"."User" DROP COLUMN "noticeDate";
-- ALTER TABLE "public"."User" ADD COLUMN "noticeDate" VARCHAR(20);