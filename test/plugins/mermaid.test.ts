import markdownIt from "markdown-it";
import { describe, expect, it } from "vitest";
import { mermaidPlugin } from "../../src/plugins/mermaid";

describe("Mermaid plugin", () => {
  it("renders mermaid fences as mermaid blocks", () => {
    const md = markdownIt().use(mermaidPlugin());
    const text = `
~~~mermaid
graph TD;
    A-->B;
~~~
`;

    const html = md.render(text);
    const idMatch = html.match(/id="(mermaid-[^"]+)"/);

    expect(idMatch).not.toBeNull();
    expect(html).toContain("class=\"mermaid\"");
    expect(html).toContain(">graph TD;\n    A-->B;</pre>");
  });
});
