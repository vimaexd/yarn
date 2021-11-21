-- CreateTable
CREATE TABLE "GuildGiveaway" (
    "id" SERIAL NOT NULL,
    "winners" INTEGER NOT NULL,
    "item" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "guildId" TEXT NOT NULL,

    CONSTRAINT "GuildGiveaway_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GuildGiveaway" ADD CONSTRAINT "GuildGiveaway_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
