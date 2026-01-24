import { performance, PerformanceObserver } from "node:perf_hooks";

const obs = new PerformanceObserver(items => {
  console.log("--- Performance Result ---");
  for(const entry of items.getEntries()) {
    console.log(`${entry.name}: ${entry.duration.toFixed(3)}ms`);
  }
});
obs.observe({ entryTypes: ["measure"], buffered: true });

function marker(name) {
  return [name + "-start", name + "-end"];
}

const START = 0;
const END = 1;
const importMark = marker("import");
const instMark = marker("inst");
const convMark = marker("conv");

performance.mark(importMark[START]);
const { CMarkdown } = await import("../../lib/index.js");
performance.mark(importMark[END]);

performance.mark(instMark[START]);
const converter = new CMarkdown({
  showCodeTitleByDefault: true,
  markdown: {},
  math: {}
});
performance.mark(instMark[END]);

const inputText = process.argv[2] || "No input";

performance.mark(convMark[START]);
const htmlOutput = converter.render(inputText);
performance.mark(convMark[END]);

performance.measure("Import Time\t", importMark[START], importMark[END]);
performance.measure("Inst. Time\t", instMark[START], instMark[END]);
performance.measure("Convert Time\t", convMark[START], convMark[END]);

console.log(htmlOutput);

