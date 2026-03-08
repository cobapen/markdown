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
import { cjk_break } from "./plugins/cjk-break.js";
import { fence_custom } from "./plugins/code/fence-custom.js";
import { highlighterForMarkdownIt } from "./plugins/code/highlight.js";
import { mdmath } from "./plugins/math/mdmath.js";
import { RewriteHandler, rewritelink } from "./plugins/rewritelink.js";

await MathJaxEngine.loadExtensions();

export interface Config {
  /**
   * Set "true" to display the title (if specified) of the fenced code block.
   * The title is hidden by default, and user must explicitly override the style.
   */
  showCodeTitleByDefault: boolean;

  /** custom handler to rewrite links */
  rewriteLink?: RewriteHandler;

  /** toc depth or range  */
  tocLevel: number|[number, number];

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

const defaultOptions = {
  showCodeTitleByDefault: false,
  markdown: {
    html: true,
    linkify: true,
    highlight: highlighterForMarkdownIt,
  },
  tocLevel: [2, 3],
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
} satisfies Config;

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
      .use(rewritelink, { 
        rewrite: this._config.rewriteLink,
      })
      .use(advTable)
      .use(mdmath(this._mj))
      .use(toc, {
        markderPattern: /^\[\[(toc|_toc_)\]\]/im,
        includeLevel: fmtTocLevel(this._config.tocLevel),
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


function fmtTocLevel(level: number|[number, number]): [number, number] {
  if (typeof level === "number") {
    return [2, Math.max(2, level)];
  }
  else {
    return level;
  }
}