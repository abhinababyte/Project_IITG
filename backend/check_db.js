const prisma = require('./prismaClient');

async function checkDatabase() {
  const users = await prisma.user.findMany();
  console.log("USERS IN DATABASE:");
  console.table(users.map(u => ({ id: u.id, name: u.name, email: u.email, hostel: u.hostel, coins: u.eco_coins })));
  
  const audits = await prisma.audit.findMany();
  console.log("\nAUDITS IN DATABASE:");
  console.table(audits.map(a => ({ id: a.id, userId: a.userId, mode: a.commuteMode, co2Saved: a.co2Saved })));
}

checkDatabase()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
