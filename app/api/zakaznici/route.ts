import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const zakaznici = await prisma.zákazník.findMany({
    include: { zakázky: { select: { id: true, stav: true, cena: true } }, objekty: true },
    orderBy: { jmeno: 'asc' }
  })

  return NextResponse.json(zakaznici)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await req.json()
  const zakaznik = await prisma.zákazník.create({
    data: { jmeno: data.jmeno, email: data.email, telefon: data.telefon, adresa: data.adresa, poznamka: data.poznamka }
  })

  return NextResponse.json(zakaznik, { status: 201 })
}
