import path from "node:path/posix";
import { describe, expect, it, vi } from "vitest";
import { CMarkdown } from "../../src";
import { defaultHandler, ReplaceHandler } from "../../src/link/replacelink";

describe("Replace link", () => {

  const _ign = expect.anything();

  it("relative .md is replaced to .html by default", () => {
    const md = new CMarkdown();
    const text = "[Link](./example.md)";
    const html = md.render(text);
    expect(html).contains("./example.html");
    console.log(html);
  });

  it("repalace img link", () => {
    const mockReplace = vi.fn(defaultHandler);
    const md = new CMarkdown({ linkRewrite: mockReplace });
    const text = "![Image](./hello.png)";
    md.render(text);
    expect(mockReplace).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("./hello.png", _ign, _ign);
  });

  it("repalace html_inline", () => {
    const mockReplace = vi.fn(defaultHandler);
    const md = new CMarkdown({ linkRewrite: mockReplace });
    const text = `
# Title
<a href=\"./test.md\">link</a>`;
    const html = md.render(text);
    expect(mockReplace).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("./test.md", _ign, _ign);
    expect(html).contains("./test.html");
  });

  it("replace html block", () => {
    const mockReplace = vi.fn(defaultHandler);
    const md = new CMarkdown({ linkRewrite: mockReplace });
    const text = `
<head>
  <link rel="stylesheet" href="./style.css">
  <script src="https://example.com/script.js" defer></script>
</head>
<body>
  <a href=\"./test.md\">link</a>
</body>`;
    const html = md.render(text);
    expect(mockReplace).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledTimes(3);
    expect(mockReplace).toHaveBeenCalledWith("./style.css", _ign, _ign);
    expect(mockReplace).toHaveBeenCalledWith("./test.md", _ign, _ign);
    expect(mockReplace).toHaveBeenCalledWith("https://example.com/script.js", _ign, _ign);
    expect(html).contains("./test.html");
  });

  it("cwd path resolver (Example)", () => {
    // For this test, use __dirname instead of process.cwd()
    const cwd = __dirname;
    const inputFile = path.join(cwd, "docs", "example.md");

    const mockReplace = vi.fn<ReplaceHandler>((link, _env, _token) => {
      
      // Return relative path from the file to the link, under cwd.
      if (link.startsWith("@/")) {
        if (_env && _env.file) {
          const targetFile = path.relative(cwd, link.slice(2));
          return path.relative(_env.file, targetFile);
        } else {
          return "./" + link.slice(2);
        }
      }
      return link;
    });
    const md = new CMarkdown({ linkRewrite: mockReplace });
    const text = "[Link](@/style.css)";
    const html = md.render(text, {
      file: inputFile,
    });
    expect(mockReplace).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("@/style.css", _ign, _ign);
    expect(html).contains("../../style.css");
  });


});