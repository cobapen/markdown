import fs from "node:fs";
import path from "node:path";
import { CMarkdown } from "../../dist/index.js";
const __dirname = import.meta.dirname;

const inputFilePath = path.join(__dirname, "input.md");
const outputFilePath = path.join(__dirname, "output.html");
const inputFile = fs.readFileSync(inputFilePath, "utf-8");

const converter = new CMarkdown();
const html = converter.render(inputFile);

fs.writeFileSync(outputFilePath, html, "utf-8");
console.log(path.basename(outputFilePath));
