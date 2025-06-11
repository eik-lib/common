import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const schema = JSON.parse(
	readFileSync(join(__dirname, "./eikjson.schema.json"), "utf8"),
);

export default schema;
