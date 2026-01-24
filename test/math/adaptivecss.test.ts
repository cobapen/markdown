import fs from "node:fs/promises";
import path from "node:path";
import { expect, test } from "vitest";
import { MathjaxEngine } from "../../src/math/mathjax.js";

const outputPath = path.join(__dirname, "./math-full.css");

test("Generate full math css (adaptive-css disabled)", async () => {

  const mathjax = new MathjaxEngine({
    noAsyncLoad: false,
    output: {
      font: "mathjax-newcm"
    },
    chtml: {
      adaptiveCSS: false,
    }
  });

  await mathjax.waitInit();

  const html = await mathjax.convert("E=mc^2");
  expect(html).toContain("E=mc");

  const css = mathjax.stylesheet();
  expect(css.length).toBeGreaterThan(0);
  await fs.writeFile(outputPath, css, { encoding: "utf-8" });
});