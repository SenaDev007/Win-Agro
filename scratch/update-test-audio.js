const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Update the test audio URL of Sèna T.'s testimonial
  const updated = await prisma.testimonial.updateMany({
    where: { name: "Sèna T." },
    data: {
      audioUrl: "https://www.w3schools.com/html/horse.mp3"
    }
  });
  console.log("Updated records:", updated.count);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
