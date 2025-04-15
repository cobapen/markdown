import fs from "node:fs";
import path from "node:path";
import { test, expect } from "vitest";
import { MarkdownConverter } from "../../src/index.js";
import Mustache from "mustache";

const inputFolder = path.resolve(__dirname, "./input");
const outputFolder = path.resolve(__dirname, "./output");

const templateFilePath = path.join(inputFolder, "template.html");
const mathcssOutputPath = path.join(outputFolder, "./css/math.css");

test("Convert all markdown files in input folder", () => {
  
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  // Check if basic template file exists (used for all inputs if unspecified)
  const template = fs.readFileSync(templateFilePath, "utf-8");
  expect(fs.existsSync(templateFilePath)).toBe(true);

  const md = new MarkdownConverter();

  const files = fs
    .readdirSync(inputFolder)
    .filter(file => file.endsWith(".md"));

  files.forEach(file => {
    const inputFilePath = path.join(inputFolder, file);
    const outputFilePath = path.join(outputFolder, file.replace(/\.md$/, ".html"));

    const mdtext = fs.readFileSync(inputFilePath, "utf-8");
    const html = md.render(mdtext);

    const renderedHtml = Mustache.render(template, { 
      title: file,
      content: html
    });

    fs.writeFileSync(outputFilePath, renderedHtml, "utf-8");
    expect(fs.existsSync(outputFilePath)).toBe(true);
  });

  fs.writeFileSync(mathcssOutputPath, md.mathcss());
  expect(fs.existsSync(mathcssOutputPath)).toBe(true);

});