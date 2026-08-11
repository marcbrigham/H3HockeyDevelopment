-- PostgreSQL baseline migration for Supabase.
CREATE SCHEMA IF NOT EXISTS "public";

CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MailingSubscriber" (
    "id" SERIAL NOT NULL,
    "playerName" TEXT NOT NULL,
    "playerPosition" TEXT NOT NULL,
    "playerBirthYear" INTEGER NOT NULL,
    "mostRecentTeam" TEXT NOT NULL,
    "parentGuardianEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MailingSubscriber_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "playerName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "position" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LessonSignup" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LessonSignup_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Clinic" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "maxPlayers" INTEGER NOT NULL DEFAULT 20,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Clinic_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClinicSignup" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "clinicId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClinicSignup_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");
CREATE UNIQUE INDEX "MailingSubscriber_parentGuardianEmail_key" ON "MailingSubscriber"("parentGuardianEmail");
CREATE UNIQUE INDEX "LessonSignup_playerId_key" ON "LessonSignup"("playerId");
CREATE UNIQUE INDEX "ClinicSignup_playerId_clinicId_key" ON "ClinicSignup"("playerId", "clinicId");

ALTER TABLE "LessonSignup" ADD CONSTRAINT "LessonSignup_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClinicSignup" ADD CONSTRAINT "ClinicSignup_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClinicSignup" ADD CONSTRAINT "ClinicSignup_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
