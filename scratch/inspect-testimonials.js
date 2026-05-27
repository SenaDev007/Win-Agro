const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const testimonials = await prisma.testimonial.findMany();
  console.log("--- TESTIMONIALS ---");
  console.log(JSON.stringify(testimonials.map(t => ({ id: t.id, name: t.name, text: t.text, audioUrl: t.audioUrl })), null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
