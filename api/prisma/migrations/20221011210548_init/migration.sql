-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('MAIN', 'GOAL');

-- CreateTable
CREATE TABLE "AnonymisedUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnonymisedUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ReminderType" NOT NULL DEFAULT 'MAIN',
    "timeHours" INTEGER NOT NULL DEFAULT 0,
    "timeMinutes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReminderDaysOfWeek" (
    "id" TEXT NOT NULL,
    "reminderId" TEXT NOT NULL,
    "sunday" BOOLEAN NOT NULL DEFAULT false,
    "monday" BOOLEAN NOT NULL DEFAULT false,
    "tuesday" BOOLEAN NOT NULL DEFAULT false,
    "wednesday" BOOLEAN NOT NULL DEFAULT false,
    "thursday" BOOLEAN NOT NULL DEFAULT false,
    "friday" BOOLEAN NOT NULL DEFAULT false,
    "saturday" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ReminderDaysOfWeek_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Reminder_type_idx" ON "Reminder" USING HASH ("type");

-- CreateIndex
CREATE INDEX "Reminder_timeHours_timeMinutes_idx" ON "Reminder"("timeHours", "timeMinutes");

-- CreateIndex
CREATE UNIQUE INDEX "ReminderDaysOfWeek_reminderId_key" ON "ReminderDaysOfWeek"("reminderId");

-- CreateIndex
CREATE INDEX "ReminderDaysOfWeek_sunday_idx" ON "ReminderDaysOfWeek" USING HASH ("sunday");

-- CreateIndex
CREATE INDEX "ReminderDaysOfWeek_monday_idx" ON "ReminderDaysOfWeek" USING HASH ("monday");

-- CreateIndex
CREATE INDEX "ReminderDaysOfWeek_tuesday_idx" ON "ReminderDaysOfWeek" USING HASH ("tuesday");

-- CreateIndex
CREATE INDEX "ReminderDaysOfWeek_wednesday_idx" ON "ReminderDaysOfWeek" USING HASH ("wednesday");

-- CreateIndex
CREATE INDEX "ReminderDaysOfWeek_thursday_idx" ON "ReminderDaysOfWeek" USING HASH ("thursday");

-- CreateIndex
CREATE INDEX "ReminderDaysOfWeek_friday_idx" ON "ReminderDaysOfWeek" USING HASH ("friday");

-- CreateIndex
CREATE INDEX "ReminderDaysOfWeek_saturday_idx" ON "ReminderDaysOfWeek" USING HASH ("saturday");

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AnonymisedUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReminderDaysOfWeek" ADD CONSTRAINT "ReminderDaysOfWeek_reminderId_fkey" FOREIGN KEY ("reminderId") REFERENCES "Reminder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
