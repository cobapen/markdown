import process from "process";
import { CMarkdown } from "@cobapen/markdown";

const converter = new CMarkdown({
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