import markdownIt from "markdown-it";
import { highlighterForMarkdownIt } from "./code/highlight.js";
import anchor from "markdown-it-anchor";
// @ts-ignore
import cjkbreaks from "markdown-it-cjk-breaks";
// @ts-ignore
import deflist from "markdown-it-deflist";
// @ts-ignore
import toc from "markdown-it-table-of-contents";
// @ts-ignore
import footnote from "markdown-it-footnote";
import { MathjaxEngine } from "./math/mathjax.js";
import { mdmath } from "./math/mdmath.js";
import { fence_custom } from "./code/fence-custom.js";

export class MarkdownConverter {
  private readonly _mj: MathjaxEngine;
  private readonly _md: markdownIt;

  constructor() {
    const mj = new MathjaxEngine({
      tex: {
        macros: {
          bm: ["\\boldsymbol{#1}", 1],
        },
      },
    });
    const md = markdownIt({
      html: true,
      linkify: true,
      highlight: highlighterForMarkdownIt,
    });

    md.renderer.rules.fence = fence_custom;
  
    md.use(anchor)
      .use(cjkbreaks)
      .use(footnote)
      .use(deflist)
      .use(mdmath(mj))
      .use(toc, {
        includeLevel: [2, 3],
      });

    this._mj = mj;
    this._md = md;
  }

  public render(text: string): string {
    return this._md.render(text);
  }

  public mathcss(): string {
    return this._mj.stylesheet();
  }
}