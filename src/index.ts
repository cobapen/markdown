import markdownIt, { Options as MarkdownOptions } from "markdown-it";
import advTable from "markdown-it-adv-table";
import anchor from "markdown-it-anchor";
// @ts-ignore
import deflist from "markdown-it-deflist";
// @ts-ignore
import footnote from "markdown-it-footnote";
// @ts-ignore
import toc from "markdown-it-table-of-contents";
import { cjk_break } from "./cjk-break/cjk-break.js";
import { fence_custom } from "./code/fence-custom.js";
import { highlighterForMarkdownIt } from "./code/highlight.js";
import { replacelink } from "./link/replacelink.js";
import { MathjaxEngine, Options as MathOptions } from "./math/mathjax.js";
import { mdmath } from "./math/mdmath.js";

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
    output: {
      font: "mathjax-newcm"
    },
    tex: {
      macros: {
        bm: ["\\boldsymbol{#1}", 1],
      },
    },
  }
};

export class CMarkdown {
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
      .use(cjk_break)
      .use(footnote)
      .use(deflist)
      .use(replacelink)
      .use(advTable)
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
   * Wait for MathJax to finish initialization.
   * (For normal usage, this can be skipped)
   **/
  async waitMathInit(): Promise<void> {
    return this._mj.waitInit();
  }

  /**
   * Returns the MathJax CSS.
   * @returns 
   */
  public mathcss(): string {
    return this._mj.stylesheet();
  }
}