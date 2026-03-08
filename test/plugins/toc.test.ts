import markdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
// @ts-ignore
import toc from "markdown-it-table-of-contents";
import { describe, expect, it } from "vitest";
import { CMarkdown } from "../../src";

function mdText(marker: string) {
  return `
# Title

${marker}

## Alpha 2

### Beta 3

#### Gamma 4
`;
}

describe("TOC plugin", () => {
  it("render TOC with markdown-it", () => {
    const md = markdownIt()
      .use(anchor)
      .use(toc, {
        includeLevel: [2, 3],
      });

    const text = mdText("[[toc]]");
    const html = md.render(text);

    expect(html).toContain("table-of-contents");
    expect(html).toContain("href=\"#alpha-2\"");
    expect(html).toContain(">Alpha 2</a>");
    expect(html).toContain("href=\"#beta-3\"");
    expect(html).toContain(">Beta 3</a>");
    expect(html).not.toContain("href=\"#gamma-4\"");
    expect(html).not.toContain(">Gamma 4</a>");
  });

  describe("CMarkdown TOC plugin", () => {
    
    it("render TOC with CMarkdown", () => {
      const md = new CMarkdown();
      const text = mdText("[[toc]]");
      const html = md.render(text);

      expect(html).toContain("table-of-contents");
      expect(html).not.toContain("href=\"#title\"");
      expect(html).toContain("href=\"#alpha-2\"");
      expect(html).toContain(">Alpha 2</a>");
      expect(html).toContain("href=\"#beta-3\"");
      expect(html).toContain(">Beta 3</a>");
      expect(html).not.toContain("href=\"#gamma\"");
    });

    describe("markers", () => {
      const md = new CMarkdown();

      it("[[toc]]", () => {
        const text = mdText("[[toc]]");
        const html = md.render(text);
        expect(html).toContain("table-of-contents");
      });

      it("[[TOC]]", () => {
        const text = mdText("[[TOC]]");
        const html = md.render(text);
        expect(html).toContain("table-of-contents");
      });

      it("[[_toc_]]", () => {
        const text = mdText("[[_toc_]]");
        const html = md.render(text);
        expect(html).toContain("table-of-contents");
      });

      it("[[_TOC_]]", () => {
        const text = mdText("[[_TOC_]]");
        const html = md.render(text);
        expect(html).toContain("table-of-contents");
      });
    });

    it("Change level", () => {
      const md = new CMarkdown({
        tocLevel: [3, 4],
      });
      const text = mdText("[[toc]]");
      const html = md.render(text);
      expect(html).toContain("table-of-contents");
      expect(html).not.toContain("href=\"#alpha-2\"");
      expect(html).toContain("href=\"#beta-3\"");
      expect(html).toContain("href=\"#gamma-4\"");
    });

    it("Change level (single value)", () => {
      const md = new CMarkdown({
        tocLevel: 4,
      });
      const text = mdText("[[toc]]");
      const html = md.render(text);
      expect(html).toContain("table-of-contents");
      expect(html).not.toContain("href=\"#title\"");
      expect(html).toContain("href=\"#alpha-2\"");
      expect(html).toContain("href=\"#beta-3\"");
      expect(html).toContain("href=\"#gamma-4\"");
    });
  });
});
