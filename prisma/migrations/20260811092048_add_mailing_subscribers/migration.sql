-- CreateTable
CREATE TABLE "MailingSubscriber" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playerName" TEXT NOT NULL,
    "playerPosition" TEXT NOT NULL,
    "playerBirthYear" INTEGER NOT NULL,
    "mostRecentTeam" TEXT NOT NULL,
    "parentGuardianEmail" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "MailingSubscriber_parentGuardianEmail_key" ON "MailingSubscriber"("parentGuardianEmail");
