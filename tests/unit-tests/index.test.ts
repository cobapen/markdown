import { describe, expect, it } from "vitest";
import { MarkdownConverter } from "../../src/index.js";

describe("Basic conversion", () => {
  it("test", () => {
    const converter = new MarkdownConverter();
    const text = "# Hello World";
    const result = converter.render(text);
    expect(result).toBe(
      "<h1 id=\"hello-world\" tabindex=\"-1\">Hello World</h1>\n"
    );
  });
});