-- CreateEnum
CREATE TYPE "StavZakazky" AS ENUM ('NOVA', 'CEKA', 'PROBIHA', 'HOTOVO', 'FAKTURACE', 'ZAPLACENO');

-- CreateEnum
CREATE TYPE "TypPrace" AS ENUM ('KOMINSTVI', 'STAVBA', 'REVIZE', 'MONTAZ', 'OPRAVA');

-- CreateEnum
CREATE TYPE "StavFaktury" AS ENUM ('NOVA', 'ODESLANA', 'ZAPLACENA', 'PO_SPLATNOSTI', 'STORNO');

-- CreateEnum
CREATE TYPE "TypDokumentu" AS ENUM ('REVIZNI_ZPRAVA', 'SMLOUVA', 'PROTOKOL', 'BOZP', 'FAKTURA', 'OSTATNI');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "Zákazník" (
    "id" TEXT NOT NULL,
    "jmeno" TEXT NOT NULL,
    "email" TEXT,
    "telefon" TEXT,
    "adresa" TEXT,
    "poznamka" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Zákazník_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Objekt" (
    "id" TEXT NOT NULL,
    "adresa" TEXT NOT NULL,
    "typ" TEXT,
    "poznamka" TEXT,
    "zakaznikId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Objekt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zakázka" (
    "id" TEXT NOT NULL,
    "cislo" SERIAL NOT NULL,
    "nazev" TEXT NOT NULL,
    "popis" TEXT,
    "stav" "StavZakazky" NOT NULL DEFAULT 'NOVA',
    "typ" "TypPrace" NOT NULL DEFAULT 'KOMINSTVI',
    "adresa" TEXT NOT NULL,
    "cena" DOUBLE PRECISION,
    "datumZahajeni" TIMESTAMP(3),
    "datumDokonceni" TIMESTAMP(3),
    "postup" INTEGER NOT NULL DEFAULT 0,
    "zakaznikId" TEXT,
    "pracovnikId" TEXT,
    "objektId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Zakázka_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fotka" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "nazev" TEXT,
    "zakazkaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fotka_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faktura" (
    "id" TEXT NOT NULL,
    "cislo" TEXT NOT NULL,
    "castka" DOUBLE PRECISION NOT NULL,
    "dph" DOUBLE PRECISION NOT NULL DEFAULT 21,
    "stav" "StavFaktury" NOT NULL DEFAULT 'NOVA',
    "splatnost" TIMESTAMP(3),
    "zakazkaId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Faktura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dokument" (
    "id" TEXT NOT NULL,
    "nazev" TEXT NOT NULL,
    "typ" "TypDokumentu" NOT NULL DEFAULT 'OSTATNI',
    "url" TEXT,
    "obsah" TEXT,
    "zakazkaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dokument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkladItem" (
    "id" TEXT NOT NULL,
    "nazev" TEXT NOT NULL,
    "jednotka" TEXT NOT NULL DEFAULT 'ks',
    "mnozstvi" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "minMnozstvi" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cena" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkladItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Faktura_cislo_key" ON "Faktura"("cislo");

-- AddForeignKey
ALTER TABLE "Objekt" ADD CONSTRAINT "Objekt_zakaznikId_fkey" FOREIGN KEY ("zakaznikId") REFERENCES "Zákazník"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zakázka" ADD CONSTRAINT "Zakázka_zakaznikId_fkey" FOREIGN KEY ("zakaznikId") REFERENCES "Zákazník"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zakázka" ADD CONSTRAINT "Zakázka_pracovnikId_fkey" FOREIGN KEY ("pracovnikId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zakázka" ADD CONSTRAINT "Zakázka_objektId_fkey" FOREIGN KEY ("objektId") REFERENCES "Objekt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fotka" ADD CONSTRAINT "Fotka_zakazkaId_fkey" FOREIGN KEY ("zakazkaId") REFERENCES "Zakázka"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faktura" ADD CONSTRAINT "Faktura_zakazkaId_fkey" FOREIGN KEY ("zakazkaId") REFERENCES "Zakázka"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faktura" ADD CONSTRAINT "Faktura_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dokument" ADD CONSTRAINT "Dokument_zakazkaId_fkey" FOREIGN KEY ("zakazkaId") REFERENCES "Zakázka"("id") ON DELETE SET NULL ON UPDATE CASCADE;
