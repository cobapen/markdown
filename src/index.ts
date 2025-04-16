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

export interface Configuration {
  /**
   * Set "true" to display the title (if specified) of the fenced code block.
   * The title is hidden by default, and user must explicitly override the style.
   */
  showCodeTitleByDefault: boolean;
}

export type Options = Partial<Configuration>;

const defaultOptions: Configuration = {
  showCodeTitleByDefault: false,
};

export class MarkdownConverter {
  private readonly _config: Configuration;
  private readonly _mj: MathjaxEngine;
  private readonly _md: markdownIt;

  constructor(option?: Options) {
    const config = { ...defaultOptions, ...option };

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

    this._config = config;
    this._mj = mj;
    this._md = md;
  }

  public render(text: string): string {
    const env = {...this._config}; // env object must s
    return this._md.render(text, env);
  }

  public mathcss(): string {
    return this._mj.stylesheet();
  }
}