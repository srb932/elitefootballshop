CREATE TYPE "SupportTicketStatus" AS ENUM ('OPEN', 'ANSWERED', 'CLOSED');
CREATE TABLE "SupportTicket" ("id" TEXT NOT NULL, "name" TEXT NOT NULL, "email" TEXT NOT NULL, "subject" TEXT NOT NULL, "status" "SupportTicketStatus" NOT NULL DEFAULT 'OPEN', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id"));
CREATE INDEX "SupportTicket_status_updatedAt_idx" ON "SupportTicket"("status", "updatedAt");
CREATE TABLE "SupportMessage" ("id" TEXT NOT NULL, "ticketId" TEXT NOT NULL, "authorId" TEXT, "body" TEXT NOT NULL, "isAdmin" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "SupportMessage_pkey" PRIMARY KEY ("id"));
CREATE INDEX "SupportMessage_ticketId_createdAt_idx" ON "SupportMessage"("ticketId", "createdAt");
ALTER TABLE "SupportMessage" ADD CONSTRAINT "SupportMessage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "SupportTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SupportMessage" ADD CONSTRAINT "SupportMessage_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE TABLE "NewsletterSubscriber" ("id" TEXT NOT NULL, "email" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");
