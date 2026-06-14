import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const faktury = await prisma.faktura.findMany({
    include: { zakázka: { select: { id: true, nazev: true, adresa: true } }, vystavil: { select: { name: true } } },
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

  const faktura = await prisma.faktura.create({
    data: {
      cislo,
      castka: parseFloat(data.castka),
      dph: data.dph ? parseFloat(data.dph) : 21,
      stav: data.stav || 'NOVA',
      splatnost: data.splatnost ? new Date(data.splatnost) : null,
      zakazkaId: data.zakazkaId || null,
      userId: session.user.id,
    },
    include: { zakázka: true }
  })

  return NextResponse.json(faktura, { status: 201 })
}
