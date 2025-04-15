/**
 * mdmath.ts
 *
 * MarkdownIt extension for math equation processing
 */

import katex from "katex";
import { PluginSimple } from "markdown-it";
import Token from "markdown-it/lib/token.mjs";
import { MathjaxEngine } from "./mathjax.js";
import { math_block, math_inline } from "./mdparser.js";

/**
 * Returns a MarkdownIt renderer to render inline/block TeX into HTML.
 * `KaTeX` is used for inline math, `MathJax` is used for block math.
 *
 * @param mathjax   mathjax engine (used for block math processing)
 * @returns
 */
function getRenderers(mathjax: MathjaxEngine) {
  function renderInlineMath(tex: string): string {
    return katex.renderToString(tex, {
      throwOnError: false,
      strict: (code: string, _msg: string, _token: katex.Token) => {
        switch (code) {
          case "unicodeTextInMathMode":
            return "ignore";
          default:
            return "warn";
        }
      },
    });
  }

  function renderBlockMath(tex: string): string {
    try {
      const math = mathjax.convert(tex);
      return "<p>" + math + "</p>";
    } catch (err) {
      console.error(err);
      return tex;
    }
  }

  function inlineRenderer(tokens: Token[], index: number) {
    return renderInlineMath(tokens[index].content);
  }

  function blockRenderer(tokens: Token[], index: number) {
    return renderBlockMath(tokens[index].content + "\n");
  }

  return {
    inlineRenderer,
    blockRenderer,
  };
}

/**
 * returns a Markdown-It plugin
 *
 * @param math    mathjax Engine to use
 * @returns
 */
export function mdmath(math: MathjaxEngine): PluginSimple {
  const renderer = getRenderers(math);

  return (md) => {
    md.inline.ruler.after("escape", "math_inline", math_inline);
    md.block.ruler.after("blockquote", "math_block", math_block, {
      alt: ["paragraph", "reference", "blockquote", "list"],
    });
    md.renderer.rules.math_inline = renderer.inlineRenderer;
    md.renderer.rules.math_block = renderer.blockRenderer;
  };
}
