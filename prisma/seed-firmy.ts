import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const f1 = await prisma.firma.upsert({
    where: { id: 'firma-kominictvi' },
    update: {},
    create: {
      id: 'firma-kominictvi',
      nazev: 'PROFI KOMINICTVÍ S.R.O.',
      ico: '12345678',
      dic: 'CZ12345678',
      adresa: 'Komínová 15, 110 00 Praha 1',
      ucet: '1234567890/0800',
      banka: 'Česká spořitelna',
      email: 'info@profikominictvi.cz',
      telefon: '+420 777 123 456',
    }
  })

  const f2 = await prisma.firma.upsert({
    where: { id: 'firma-alfastav' },
    update: {},
    create: {
      id: 'firma-alfastav',
      nazev: 'ALFA STAV GROUP S.R.O.',
      ico: '87654321',
      dic: 'CZ87654321',
      adresa: 'Stavební 42, 130 00 Praha 3',
      ucet: '9876543210/0300',
      banka: 'ČSOB',
      email: 'info@alfastavgroup.cz',
      telefon: '+420 777 654 321',
    }
  })

  // Přiřaď admina k první firmě
  await prisma.user.updateMany({
    where: { email: 'admin@jbagent.cz' },
    data: { firmaId: f1.id }
  })

  console.log('✅ Firmy vytvořeny:', f1.nazev, f2.nazev)
}

main().catch(console.error).finally(() => prisma.$disconnect())
