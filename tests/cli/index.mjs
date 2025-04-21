import { CpMarkdown } from "@cobapen/markdown";
import process from "process";

const converter = new CpMarkdown({
  showCodeTitleByDefault: true,
  markdown: {
  },
  math: {
  }
});

const inputText = process.argv[2];

if (!inputText) {
  console.error("Error: No input text.");
  process.exit(1);
}

const htmlOutput = converter.render(inputText);
console.log(htmlOutput);