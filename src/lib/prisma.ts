import { PrismaClient } from "@prisma/client";

let client: PrismaClient;

export function getPrisma() {
  if (!client) {
    client = new PrismaClient();
  }

  return client;
}
