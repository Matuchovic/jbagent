-- AlterTable
ALTER TABLE "Faktura" ADD COLUMN     "datumVystaveni" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dodAdresa" TEXT,
ADD COLUMN     "dodBanka" TEXT,
ADD COLUMN     "dodDic" TEXT,
ADD COLUMN     "dodFirma" TEXT,
ADD COLUMN     "dodIco" TEXT,
ADD COLUMN     "dodUcet" TEXT,
ADD COLUMN     "odbAdresa" TEXT,
ADD COLUMN     "odbDic" TEXT,
ADD COLUMN     "odbIco" TEXT,
ADD COLUMN     "odbJmeno" TEXT,
ADD COLUMN     "poznamka" TEXT,
ADD COLUMN     "variabilniSymbol" TEXT,
ADD COLUMN     "zpusobPlatby" TEXT DEFAULT 'převodem';

-- CreateTable
CREATE TABLE "FakturaPolozka" (
    "id" TEXT NOT NULL,
    "fakturaId" TEXT NOT NULL,
    "popis" TEXT NOT NULL,
    "mnozstvi" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "jednotka" TEXT NOT NULL DEFAULT 'ks',
    "cenaJednotka" DOUBLE PRECISION NOT NULL,
    "dph" DOUBLE PRECISION NOT NULL DEFAULT 21,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FakturaPolozka_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FakturaPolozka" ADD CONSTRAINT "FakturaPolozka_fakturaId_fkey" FOREIGN KEY ("fakturaId") REFERENCES "Faktura"("id") ON DELETE CASCADE ON UPDATE CASCADE;
