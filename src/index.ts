import { MathJaxEngine, Options as MathOptions } from "@cobapen/math";
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
import { ReplaceHandler, replacelink } from "./link/replacelink.js";
import { mdmath } from "./math/mdmath.js";

await MathJaxEngine.loadExtensions();

export interface Config {
  /**
   * Set "true" to display the title (if specified) of the fenced code block.
   * The title is hidden by default, and user must explicitly override the style.
   */
  showCodeTitleByDefault: boolean;

  /** custom handler to rewrite links */
  linkRewrite?: ReplaceHandler;

  /** MarkdownIt options */
  markdown: Partial<MarkdownOptions>;

  /** MathJax options */
  math: Partial<MathOptions>;
}

export interface RenderOptions {
  /* Set origin of the markdown file, if it has one. */
  file: string;
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
  private readonly _mj: MathJaxEngine;
  private readonly _md: markdownIt;

  constructor(option?: Options) {
    const config = { ...defaultOptions, ...option };
    const mj = new MathJaxEngine(config.math);
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
      .use(replacelink, { 
        replace: this._config.linkRewrite,
      })
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
  public render(text: string, opt?: Partial<RenderOptions>): string {
    const env = { ...opt }; // create new env per call
    return this._md.render(text, env);
  }

  /** Return the MathJax CSS. */
  public mathcss(): string {
    return this._mj.stylesheet();
  }
}