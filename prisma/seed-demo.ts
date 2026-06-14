import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.findFirst({ where: { email: 'admin@jbagent.cz' } })
  if (admin) await prisma.user.update({ where: { id: admin.id }, data: { name: 'Jan Baran' } })

  const p1 = await prisma.user.upsert({ where: { email: 'martin.k@jbagent.cz' }, update: {}, create: { name: 'Martin Kratochvíl', email: 'martin.k@jbagent.cz', password: 'x', role: 'WORKER', phone: '776 123 456' } })
  const p2 = await prisma.user.upsert({ where: { email: 'petr.v@jbagent.cz' }, update: {}, create: { name: 'Petr Veselý', email: 'petr.v@jbagent.cz', password: 'x', role: 'WORKER', phone: '602 987 654' } })
  const p3 = await prisma.user.upsert({ where: { email: 'tomas.b@jbagent.cz' }, update: {}, create: { name: 'Tomáš Beneš', email: 'tomas.b@jbagent.cz', password: 'x', role: 'MANAGER', phone: '736 555 111' } })

  const z1 = await prisma.zákazník.upsert({ where: { id: 'demo-z1' }, update: {}, create: { id: 'demo-z1', jmeno: 'Novák Jiří', telefon: '777 123 456', email: 'novak@email.cz', adresa: 'Ostrava-Poruba, Hlavní 14' } })
  const z2 = await prisma.zákazník.upsert({ where: { id: 'demo-z2' }, update: {}, create: { id: 'demo-z2', jmeno: 'Kovář s.r.o.', telefon: '602 987 654', email: 'info@kovar.cz', adresa: 'Ostrava-Hrabůvka, Závodní 88' } })
  const z3 = await prisma.zákazník.upsert({ where: { id: 'demo-z3' }, update: {}, create: { id: 'demo-z3', jmeno: 'Bílková Anna', telefon: '736 555 111', email: 'bilkova@gmail.com', adresa: 'Opava, Ratibořská 22' } })
  const z4 = await prisma.zákazník.upsert({ where: { id: 'demo-z4' }, update: {}, create: { id: 'demo-z4', jmeno: 'Horák Pavel', telefon: '605 444 222', email: 'horak@firma.cz', adresa: 'Frýdek-Místek, Příční 5' } })
  const z5 = await prisma.zákazník.upsert({ where: { id: 'demo-z5' }, update: {}, create: { id: 'demo-z5', jmeno: 'Správa bytů Ostrava', telefon: '596 111 222', email: 'info@sprava.cz', adresa: 'Ostrava, Sídlištní 44' } })

  const zakList = [
    { id: 'zak1', nazev: 'Čištění komína', adresa: 'Ostrava-Poruba, Hlavní 14', stav: 'PROBIHA' as const, typ: 'KOMINSTVI' as const, cena: 4800, postup: 65, zakaznikId: z1.id, pracovnikId: p1.id },
    { id: 'zak2', nazev: 'Rekonstrukce střechy', adresa: 'Ostrava-Hrabůvka, Závodní 88', stav: 'CEKA' as const, typ: 'STAVBA' as const, cena: 38500, postup: 20, zakaznikId: z2.id, pracovnikId: p2.id },
    { id: 'zak3', nazev: 'Revize průduchu', adresa: 'Opava, Ratibořská 22', stav: 'NOVA' as const, typ: 'REVIZE' as const, cena: 2200, postup: 0, zakaznikId: z3.id },
    { id: 'zak4', nazev: 'Zdění komínové hlavy', adresa: 'Frýdek-Místek, Příční 5', stav: 'FAKTURACE' as const, typ: 'KOMINSTVI' as const, cena: 12400, postup: 100, zakaznikId: z4.id, pracovnikId: p3.id },
    { id: 'zak5', nazev: 'Montáž krbové vložky', adresa: 'Ostrava, Karasova 3', stav: 'PROBIHA' as const, typ: 'MONTAZ' as const, cena: 18900, postup: 40, pracovnikId: p1.id },
    { id: 'zak6', nazev: 'Oprava fasády', adresa: 'Opava, Nákladní 7', stav: 'HOTOVO' as const, typ: 'STAVBA' as const, cena: 55000, postup: 100, zakaznikId: z1.id, pracovnikId: p2.id },
    { id: 'zak7', nazev: 'Čištění topidla', adresa: 'Hlučín, Dlouhá 12', stav: 'ZAPLACENO' as const, typ: 'KOMINSTVI' as const, cena: 3200, postup: 100, zakaznikId: z2.id },
    { id: 'zak8', nazev: 'Revizní zpráva komínů', adresa: 'Ostrava, Sídlištní 44', stav: 'NOVA' as const, typ: 'REVIZE' as const, cena: 1800, postup: 0, zakaznikId: z5.id },
    { id: 'zak9', nazev: 'Výstavba komínového tělesa', adresa: 'Bohumín, Nádražní 8', stav: 'PROBIHA' as const, typ: 'KOMINSTVI' as const, cena: 28000, postup: 55, pracovnikId: p3.id },
    { id: 'zak10', nazev: 'Zateplení střechy', adresa: 'Karviná, Masarykovo nám. 2', stav: 'CEKA' as const, typ: 'STAVBA' as const, cena: 42000, postup: 10, zakaznikId: z4.id },
  ]
  for (const z of zakList) {
    await prisma.zakázka.upsert({ where: { id: z.id }, update: z, create: z })
  }

  const adminId = admin?.id
  const fakList = [
    { id: 'fak1', cislo: 'F-2026-0001', castka: 3200, dph: 21, stav: 'ZAPLACENA' as const, zakazkaId: 'zak7', userId: adminId, splatnost: new Date('2026-05-30') },
    { id: 'fak2', cislo: 'F-2026-0002', castka: 12400, dph: 21, stav: 'ODESLANA' as const, zakazkaId: 'zak4', userId: adminId, splatnost: new Date('2026-06-30') },
    { id: 'fak3', cislo: 'F-2026-0003', castka: 55000, dph: 21, stav: 'PO_SPLATNOSTI' as const, zakazkaId: 'zak6', userId: adminId, splatnost: new Date('2026-06-01') },
  ]
  for (const f of fakList) {
    await prisma.faktura.upsert({ where: { id: f.id }, update: f, create: f })
  }

  const skladList = [
    { id: 'sk1', nazev: 'Komínový kartáč 200mm', jednotka: 'ks', mnozstvi: 8, minMnozstvi: 3, cena: 450 },
    { id: 'sk2', nazev: 'Flexibilní tyč 1m', jednotka: 'ks', mnozstvi: 2, minMnozstvi: 5, cena: 280 },
    { id: 'sk3', nazev: 'Těsnicí tmel', jednotka: 'kg', mnozstvi: 12, minMnozstvi: 4, cena: 180 },
    { id: 'sk4', nazev: 'Žáruvzdorná malta', jednotka: 'kg', mnozstvi: 45, minMnozstvi: 10, cena: 95 },
    { id: 'sk5', nazev: 'Vložka nerezová 150mm', jednotka: 'ks', mnozstvi: 3, minMnozstvi: 2, cena: 2800 },
    { id: 'sk6', nazev: 'Komínová krycí deska', jednotka: 'ks', mnozstvi: 6, minMnozstvi: 2, cena: 650 },
    { id: 'sk7', nazev: 'Minerální vlna 5cm', jednotka: 'balení', mnozstvi: 0, minMnozstvi: 3, cena: 890 },
  ]
  for (const s of skladList) {
    await prisma.skladItem.upsert({ where: { id: s.id }, update: s, create: s })
  }

  console.log('✅ Full demo data přidána!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
