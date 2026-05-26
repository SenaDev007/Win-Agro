import { prisma } from "../lib/prisma";

async function check() {
  try {
    const services = await prisma.service.findMany();
    console.log("Services in DB:", services);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
