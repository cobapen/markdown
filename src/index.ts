import markdownIt, { Options as MarkdownOptions } from "markdown-it";
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
import { MathjaxEngine, Options as MathOptions } from "./math/mathjax.js";
import { mdmath } from "./math/mdmath.js";
import { fence_custom } from "./code/fence-custom.js";

export interface Config {
  /**
   * Set "true" to display the title (if specified) of the fenced code block.
   * The title is hidden by default, and user must explicitly override the style.
   */
  showCodeTitleByDefault: boolean;

  /**
   * MarkdownIt options
   */
  markdown: Partial<MarkdownOptions>;

  /**
   * MathJax options
   */
  math: Partial<MathOptions>;
}

export type Options = Partial<Config>;

const defaultOptions: Config = {
  showCodeTitleByDefault: false,
  markdown: {
    html: true,
    linkify: true,
    highlight: highlighterForMarkdownIt,
  },
  math: {
    tex: {
      macros: {
        bm: ["\\boldsymbol{#1}", 1],
      },
    },
  }
};

export class MarkdownConverter {
  private readonly _config: Config;
  private readonly _mj: MathjaxEngine;
  private readonly _md: markdownIt;

  constructor(option?: Options) {
    const config = { ...defaultOptions, ...option };
    const mj = new MathjaxEngine(config.math);
    const md = markdownIt(config.markdown);

    this._config = config;
    this._mj = mj;
    this._md = md;

    this.setup(md);
  }

  /**
   * Install plugins and renderers to the markdown-it instance.
   * 
   * @param md The instance
   */
  public setup(md: markdownIt) {
    md.renderer.rules.fence = fence_custom;
    md.use(anchor)
      .use(cjkbreaks)
      .use(footnote)
      .use(deflist)
      .use(mdmath(this._mj))
      .use(toc, {
        includeLevel: [2, 3],
      });
  }

  /**
   * Render html from markdown.
   * 
   * @param text markdown text
   * @returns html text
   */
  public render(text: string): string {
    const env = {...this._config}; // env object must s
    return this._md.render(text, env);
  }

  /**
   * Returns the MathJax CSS.
   * @returns 
   */
  public mathcss(): string {
    return this._mj.stylesheet();
  }
}