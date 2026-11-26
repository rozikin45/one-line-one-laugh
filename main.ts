import { writeFileSync, readFileSync, renameSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const LINE =
  "My smart fridge just emailed me: the milk has expired and, quote, it can no longer work under these conditions.";

// Competition gate: the entry must be a single line of 1-200 characters.
const MAX_CHARS = 200;

const OUTPUT_PATH = "/output/entry.txt";

function main(): void {
  if (LINE.length < 1 || LINE.length > MAX_CHARS) {
    throw new Error(
      `length check failed: line is ${LINE.length} characters, expected 1-${MAX_CHARS}`
    );
  }
  if (LINE.trim().length === 0) {
    throw new Error("whitespace check failed: line is empty or whitespace-only");
  }
  if (LINE.includes("\n") || LINE.includes("\r")) {
    throw new Error("single-line check failed: line contains a newline");
  }
  if (/[\u0000-\u001f]/.test(LINE)) {
    throw new Error(
      "control-character check failed: line contains a control character below U+0020"
    );
  }

  const dir = dirname(OUTPUT_PATH);
  const tmpPath = join(dir, `.entry-${process.pid}.tmp`);
  writeFileSync(tmpPath, LINE, "utf8");
  renameSync(tmpPath, OUTPUT_PATH);

  const written = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== LINE) {
    throw new Error("byte-for-byte check failed: written content differs from the line");
  }
  if (written.length < 1 || written.length > MAX_CHARS) {
    throw new Error(
      `length check failed: written content is ${written.length} characters, expected 1-${MAX_CHARS}`
    );
  }
  if (written.trim().length === 0) {
    throw new Error("whitespace check failed: written content is empty or whitespace-only");
  }
  if (written.includes("\n") || written.includes("\r")) {
    throw new Error("single-line check failed: written content contains a newline");
  }
  if (/[\u0000-\u001f]/.test(written)) {
    throw new Error(
      "control-character check failed: written content contains a control character below U+0020"
    );
  }
}

main();
