import "dotenv/config";
import { config } from "dotenv";
config({ path: ".env.local" });

import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import crypto from "node:crypto";

async function main() {
  const rl = readline.createInterface({ input, output });
  const user = (await rl.question("Admin user: ")).trim() || "admin";
  const password = (await rl.question("Admin password: ")).trim();
  rl.close();

  if (!password) {
    console.error("\n❌ A senha não pode ser vazia.");
    process.exit(1);
  }

  const secret = crypto.randomBytes(32).toString("hex");

  console.log("\n✅ Cole as linhas abaixo no seu .env.local:\n");
  console.log(`ADMIN_USER="${user}"`);
  console.log(`ADMIN_PASSWORD="${password}"`);
  console.log(`SESSION_SECRET="${secret}"`);
  console.log("");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
