/**
 * mdmath.ts
 *
 * MarkdownIt extension for math equation processing
 */

import { MathJaxEngine } from "@cobapen/math";
import type { PluginSimple } from "markdown-it";
import type Token from "markdown-it/lib/token.mjs";
import { math_block, math_inline } from "./mdparser.js";

/**
 * Returns a MarkdownIt renderer to render inline/block TeX into HTML.
 *
 * @param mathjax   mathjax engine
 * @returns
 */
function getRenderers(mathjax: MathJaxEngine) {
  function renderInlineMath(tex: string): string {
    try {
      return mathjax.convert(tex, { inline: true });
    } catch (err) {
      console.error(err);
      return tex;
    }
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
export function mdmath(math: MathJaxEngine): PluginSimple {
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
