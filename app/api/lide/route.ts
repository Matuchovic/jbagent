import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const lide = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true,
      zakázky: { select: { id: true, stav: true } }
    },
    orderBy: { name: 'asc' }
  })

  return NextResponse.json(lide)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await req.json()
  const hashed = await bcrypt.hash(data.password || 'heslo123', 12)

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
      role: data.role || 'WORKER',
      phone: data.phone || null,
    }
  })

  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role }, { status: 201 })
}
