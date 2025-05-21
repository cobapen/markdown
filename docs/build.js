import fs from "node:fs";
import path from "node:path";
import Mustache from "mustache";
import { CMarkdown } from "../lib/index.js";
// use node v21 or higher
const __dirname = import.meta.dirname;

const sourceDir = path.join(__dirname, "source");
const outputDir = path.join(__dirname, "public");
const templateFile = path.join(__dirname, "template.html");
const mathcssFile = path.join(outputDir, "css/math.css");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(path.dirname(mathcssFile))) {
  fs.mkdirSync(path.dirname(mathcssFile), { recursive: true});
}
if (!fs.existsSync(templateFile)) {
  console.error(`template file not found: ${templateFile}`);
  process.exit(1);
}
const template = fs.readFileSync(templateFile, "utf8");

// use node v20.6/v18.19 or higher 
const inputFiles = fs.readdirSync(sourceDir, {
  recursive: true,
  withFileTypes: true,
})
  .filter(x => x.isFile() && x.name.endsWith(".md"));

const converter = new CMarkdown();

inputFiles.forEach(file => {
  const filepath = path.join(file.parentPath, file.name);
  const content = fs.readFileSync(filepath, "utf8");

  const html = converter.render(content);
  const renderedHtml = Mustache.render(template, { 
    title: file.name,
    content: html
  });

  const outputName = file.name.replace(".md", ".html");
  const outputFilePath = path.join(outputDir, outputName);

  fs.writeFileSync(outputFilePath, renderedHtml, "utf8");
  console.log(`Generated: ${outputFilePath}`);
});


const stylesheet = converter.mathcss();
fs.writeFileSync(path.join(outputDir, "css/math.css"), stylesheet, "utf8");