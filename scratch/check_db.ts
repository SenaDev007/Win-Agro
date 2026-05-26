import { localStore } from "../lib/db";
import { prisma } from "../lib/prisma";

async function check() {
  try {
    console.log("Checking DB connection...");
    const statsCount = await prisma.stat.count();
    console.log("Stats count:", statsCount);
    
    const formConfigs = await localStore.getFormConfigs();
    console.log("Form configs in DB:", formConfigs);

    if (formConfigs.length === 0) {
      console.log("Form configs are empty. Initializing DB...");
      await localStore.initDb();
      const recheck = await localStore.getFormConfigs();
      console.log("After initialization:", recheck);
    }
  } catch (error) {
    console.error("Error checking DB:", error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
