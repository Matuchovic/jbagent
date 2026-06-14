import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const items = await prisma.skladItem.findMany({ orderBy: { nazev: 'asc' } })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const item = await prisma.skladItem.create({
    data: { nazev: data.nazev, jednotka: data.jednotka || 'ks', mnozstvi: parseFloat(data.mnozstvi) || 0, minMnozstvi: parseFloat(data.minMnozstvi) || 0, cena: data.cena ? parseFloat(data.cena) : null }
  })
  return NextResponse.json(item, { status: 201 })
}
