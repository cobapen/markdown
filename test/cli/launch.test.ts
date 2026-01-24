/// Execute index.mjs in local environment.
/// Make sure to run `npm run build` before execution
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const indexMjsPath = join(__dirname, "index.mjs");
const libraryMain = join(__dirname, "../../lib/index.js");

type TestCb = (code: number|null, stdout: string, stderr: string) => void;

function launchProcess(inputText: string, cb: TestCb) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn("node", [indexMjsPath, inputText], {
      cwd: __dirname
    });

    let stdout = "";
    let stderr = "";

    child.stdout?.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr?.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      try {
        cb(code, stdout, stderr);
        console.log(stdout);
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    child.on("error", (error) => {
      reject(error);
    });
  });
}

test("import and launch", async () => {

  if (!existsSync(libraryMain)) {
    expect.fail("library not built. run `npm run build` first.");
  }

  await launchProcess("# Test Markdown", (code, stdout, stderr) => {
    expect(code).toBe(0);
    expect(stdout).toBeTruthy();
    expect(stdout).toContain("Test Markdown");
    expect(stdout).toContain("<h1");
    expect(stdout).toContain("</h1>");
    expect(stderr).toBeFalsy();
  });

  await launchProcess("$$\\pi$$", (code, stdout, stderr) => {
    expect(code).toBe(0);
    expect(stdout).toBeTruthy();
    expect(stdout).toContain("<mjx");
    expect(stdout).toContain("<p>");
    expect(stdout).toContain("</p>");
    expect(stdout).toContain("");
    expect(stderr).toBeFalsy();
  });
  
});