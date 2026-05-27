const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const all = await prisma.testimonial.findMany();
  all.forEach(t => {
    console.log(`id=${t.id} | name=${t.name} | isActive=${t.isActive} | audioUrl=${t.audioUrl}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
