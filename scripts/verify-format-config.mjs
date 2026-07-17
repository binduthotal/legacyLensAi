import { existsSync } from "node:fs";

const requiredFiles = [".editorconfig", ".prettierrc.json", "eslint.config.mjs"];
const missingFiles = requiredFiles.filter((file) => !existsSync(file));

if (missingFiles.length > 0) {
  console.error(`Missing formatting config: ${missingFiles.join(", ")}`);
  process.exit(1);
}

console.log("Formatting and lint configuration files are present.");
