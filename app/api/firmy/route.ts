import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const firmy = await prisma.firma.findMany({ orderBy: { nazev: 'asc' } })
  return NextResponse.json(firmy)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const firma = await prisma.firma.create({
    data: {
      nazev: data.nazev,
      ico: data.ico || null,
      dic: data.dic || null,
      adresa: data.adresa || null,
      ucet: data.ucet || null,
      banka: data.banka || null,
      email: data.email || null,
      telefon: data.telefon || null,
    }
  })
  return NextResponse.json(firma, { status: 201 })
}
