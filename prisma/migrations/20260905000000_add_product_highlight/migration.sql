-- CreateEnum
CREATE TYPE "ProductSection" AS ENUM ('vedette', 'tendance', 'nouveau', 'promo');

-- CreateTable
CREATE TABLE "ProductHighlight" (
    "productId" TEXT NOT NULL,
    "section" "ProductSection",
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductHighlight_pkey" PRIMARY KEY ("productId")
);
