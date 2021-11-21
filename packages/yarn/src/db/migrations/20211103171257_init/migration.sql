-- CreateTable
CREATE TABLE "GuildRoleMenuOption" (
    "id" SERIAL NOT NULL,
    "guildId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "GuildRoleMenuOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GuildRoleMenuOption" ADD CONSTRAINT "GuildRoleMenuOption_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
