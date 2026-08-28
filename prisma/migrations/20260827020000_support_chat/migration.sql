ALTER TABLE "SupportTicket" ADD COLUMN "visitorToken" TEXT;
CREATE UNIQUE INDEX "SupportTicket_visitorToken_key" ON "SupportTicket"("visitorToken");
