import { randomBytes, scryptSync } from "node:crypto";
import readline from "node:readline/promises";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
console.log(
  "Run this in a private terminal. The password input is visible locally.",
);
const password = await rl.question(
  "Choose an admin password (at least 16 characters): ",
);
rl.close();
if (password.length < 16) {
  console.error("Use at least 16 characters.");
  process.exit(1);
}
const salt = randomBytes(24).toString("hex");
console.log(
  `ADMIN_PASSWORD_HASH=${salt}:${scryptSync(password, salt, 64).toString("hex")}`,
);
console.log(`SESSION_SECRET=${randomBytes(48).toString("hex")}`);
