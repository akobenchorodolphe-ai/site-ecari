import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.RECTORAT_SEED_EMAIL;
  const password = process.env.RECTORAT_SEED_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "RECTORAT_SEED_EMAIL et RECTORAT_SEED_PASSWORD doivent être définis.",
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: {
      email: email.toLowerCase(),
    },
    update: {
      passwordHash,
    },
    create: {
      email: email.toLowerCase(),
      passwordHash,
      role: "RECTORAT",
    },
  });

  console.log(`Compte Rectorat prêt pour ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
