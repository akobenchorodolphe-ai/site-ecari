import { prisma } from "@/lib/prisma";

export async function findAdminByEmail(email: string) {
  return prisma.adminUser.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });
}
