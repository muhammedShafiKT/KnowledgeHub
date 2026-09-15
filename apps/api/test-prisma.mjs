// test-prisma.mjs
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../api/src/generated/prisma/client.js"

const url = process.env.DATABASE_URL;
console.log("URL:", url?.replace(/:[^:@]+@/, ":****@"));

const pool = new Pool({ connectionString: url });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

try {
  const result = await prisma.$queryRaw`SELECT 1 as test`;
  console.log("Query OK:", result);
} catch (err) {
  console.error("Query failed:", err);
}