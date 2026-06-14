import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@jbagent.cz' },
    update: {},
    create: {
      email: 'admin@jbagent.cz',
      name: 'Jakub Beneš',
      password,
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created:', admin.email)
  console.log('📧 Email: admin@jbagent.cz')
  console.log('🔑 Heslo: admin123')
  console.log('\n⚠️  Změňte heslo po prvním přihlášení!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
