import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const faktury = await prisma.faktura.findMany({
    include: {
      zakázka: { select: { id: true, nazev: true, adresa: true } },
      vystavil: { select: { name: true } },
      polozky: true,
    },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(faktury)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const count = await prisma.faktura.count()
  const cislo = `F-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`
  const castka = (data.polozky || []).reduce((s: number, p: any) => s + (parseFloat(p.mnozstvi) * parseFloat(p.cenaJednotka)), 0)
  const faktura = await prisma.faktura.create({
    data: {
      cislo,
      castka,
      dph: data.dph ? parseFloat(data.dph) : 21,
      stav: data.stav || 'ODESLANA',
      datumVystaveni: new Date(),
      splatnost: data.splatnost ? new Date(data.splatnost) : null,
      dodFirma: data.dodFirma || null,
      dodIco: data.dodIco || null,
      dodDic: data.dodDic || null,
      dodAdresa: data.dodAdresa || null,
      dodUcet: data.dodUcet || null,
      dodBanka: data.dodBanka || null,
      odbJmeno: data.odbJmeno || null,
      odbIco: data.odbIco || null,
      odbDic: data.odbDic || null,
      odbAdresa: data.odbAdresa || null,
      zpusobPlatby: data.zpusobPlatby || 'převodem',
      variabilniSymbol: data.variabilniSymbol || cislo.replace('F-', '').replace('-', ''),
      poznamka: data.poznamka || null,
      zakazkaId: data.zakazkaId || null,
      userId: session.user.id,
      polozky: {
        create: (data.polozky || []).map((p: any) => ({
          popis: p.popis,
          mnozstvi: parseFloat(p.mnozstvi) || 1,
          jednotka: p.jednotka || 'ks',
          cenaJednotka: parseFloat(p.cenaJednotka) || 0,
          dph: parseFloat(p.dph) || 21,
        }))
      }
    },
    include: { zakázka: true, polozky: true }
  })
  return NextResponse.json(faktura, { status: 201 })
}
