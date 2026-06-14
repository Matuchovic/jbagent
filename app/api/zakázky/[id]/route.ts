import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const zakázka = await prisma.zakázka.findUnique({
    where: { id },
    include: { zákazník: true, pracovnik: { select: { id: true, name: true, phone: true } }, faktury: true, fotky: true, dokumenty: true }
  })
  if (!zakázka) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(zakázka)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const data = await req.json()
  const zakázka = await prisma.zakázka.update({
    where: { id },
    data: {
      ...(data.nazev !== undefined && { nazev: data.nazev }),
      ...(data.popis !== undefined && { popis: data.popis }),
      ...(data.adresa !== undefined && { adresa: data.adresa }),
      ...(data.stav !== undefined && { stav: data.stav }),
      ...(data.typ !== undefined && { typ: data.typ }),
      ...(data.cena !== undefined && { cena: parseFloat(data.cena) }),
      ...(data.postup !== undefined && { postup: parseInt(data.postup) }),
      ...(data.pracovnikId !== undefined && { pracovnikId: data.pracovnikId }),
      ...(data.zakaznikId !== undefined && { zakaznikId: data.zakaznikId }),
      ...(data.datumZahajeni !== undefined && { datumZahajeni: data.datumZahajeni ? new Date(data.datumZahajeni) : null }),
      ...(data.datumDokonceni !== undefined && { datumDokonceni: data.datumDokonceni ? new Date(data.datumDokonceni) : null }),
    },
    include: { zákazník: true, pracovnik: true, fotky: true, faktury: true, dokumenty: true }
  })
  return NextResponse.json(zakázka)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.zakázka.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
