-- AlterTable
ALTER TABLE "Faktura" ADD COLUMN     "firmaId" TEXT;

-- AlterTable
ALTER TABLE "SkladItem" ADD COLUMN     "firmaId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firmaId" TEXT;

-- AlterTable
ALTER TABLE "Zakázka" ADD COLUMN     "firmaId" TEXT;

-- CreateTable
CREATE TABLE "Firma" (
    "id" TEXT NOT NULL,
    "nazev" TEXT NOT NULL,
    "ico" TEXT,
    "dic" TEXT,
    "adresa" TEXT,
    "ucet" TEXT,
    "banka" TEXT,
    "email" TEXT,
    "telefon" TEXT,
    "aktivni" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Firma_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_firmaId_fkey" FOREIGN KEY ("firmaId") REFERENCES "Firma"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zakázka" ADD CONSTRAINT "Zakázka_firmaId_fkey" FOREIGN KEY ("firmaId") REFERENCES "Firma"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faktura" ADD CONSTRAINT "Faktura_firmaId_fkey" FOREIGN KEY ("firmaId") REFERENCES "Firma"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkladItem" ADD CONSTRAINT "SkladItem_firmaId_fkey" FOREIGN KEY ("firmaId") REFERENCES "Firma"("id") ON DELETE SET NULL ON UPDATE CASCADE;
