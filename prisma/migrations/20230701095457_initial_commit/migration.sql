-- CreateTable
CREATE TABLE "Shop" (
    "id" TEXT NOT NULL,
    "myshopifyDomain" TEXT NOT NULL,
    "shopifyId" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shop_myshopifyDomain_key" ON "Shop"("myshopifyDomain");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_shopifyId_key" ON "Shop"("shopifyId");
