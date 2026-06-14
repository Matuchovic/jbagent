import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const stav = searchParams.get('stav')
  const search = searchParams.get('search')

  const zakázky = await prisma.zakázka.findMany({
    where: {
      ...(stav && stav !== 'all' ? { stav: stav as any } : {}),
      ...(search ? {
        OR: [
          { nazev: { contains: search } },
          { adresa: { contains: search } },
          { zákazník: { jmeno: { contains: search } } },
        ]
      } : {})
    },
    include: {
      zákazník: true,
      pracovnik: { select: { id: true, name: true } },
      faktury: true,
      fotky: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json(zakázky)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await req.json()

  const zakázka = await prisma.zakázka.create({
    data: {
      nazev: data.nazev,
      popis: data.popis,
      adresa: data.adresa,
      typ: data.typ || 'KOMINSTVI',
      stav: data.stav || 'NOVA',
      cena: data.cena ? parseFloat(data.cena) : null,
      datumZahajeni: data.datumZahajeni ? new Date(data.datumZahajeni) : null,
      datumDokonceni: data.datumDokonceni ? new Date(data.datumDokonceni) : null,
      zakaznikId: data.zakaznikId || null,
      pracovnikId: data.pracovnikId || null,
    },
    include: { zákazník: true, pracovnik: true }
  })

  return NextResponse.json(zakázka, { status: 201 })
}
