/**
 * mathjax.ts
 *
 * Server-Side Mathjax converter (TeX to CHTML).
 *
 * see official examples for more information
 * https://github.com/mathjax/MathJax-demos-node
 * 
 * changes from v3
 * https://docs.mathjax.org/en/v4.1/upgrading/whats-new-4.0.html
 * https://docs.mathjax.org/en/v4.1/upgrading/whats-new-4.0/breaking.html
*/
import { MathJaxNewcmFont } from "@mathjax/mathjax-newcm-font/mjs/chtml.js";
import { MathJaxStix2Font } from "@mathjax/mathjax-stix2-font/mjs/chtml.js";
// @ts-ignore: no d.ts file
import { source as mjsource } from "@mathjax/src/components/mjs/source.js";
import { type LiteDocument } from "@mathjax/src/js/adaptors/lite/Document.js";
import { LiteElement } from "@mathjax/src/js/adaptors/lite/Element.js";
import { type LiteText } from "@mathjax/src/js/adaptors/lite/Text.js";
import { type LiteAdaptor, liteAdaptor} from "@mathjax/src/js/adaptors/liteAdaptor.js";
import { DOMAdaptor } from "@mathjax/src/js/core/DOMAdaptor.js";
import { type MathDocument } from "@mathjax/src/js/core/MathDocument.js";
import { type MathItem } from "@mathjax/src/js/core/MathItem.js";
import { RegisterHTMLHandler } from "@mathjax/src/js/handlers/html.js";
import { TeX } from "@mathjax/src/js/input/tex.js";
import { mathjax } from "@mathjax/src/js/mathjax.js";
import { CHTML } from "@mathjax/src/js/output/chtml.js";
import { type DeepPartial, merge } from "../utils/merge.js";

// Import Font

// Import the needed TeX Packages
import "@mathjax/src/js/input/tex/base/BaseConfiguration.js";
import "@mathjax/src/js/input/tex/ams/AmsConfiguration.js";
import "@mathjax/src/js/input/tex/newcommand/NewcommandConfiguration.js";
import "@mathjax/src/js/input/tex/noundefined/NoundefinedConfiguration.js";

// Import all TeX extensions
import "@mathjax/src/js/input/tex/action/ActionConfiguration.js";
import "@mathjax/src/js/input/tex/ams/AmsConfiguration.js";
import "@mathjax/src/js/input/tex/amscd/AmscdConfiguration.js";
import "@mathjax/src/js/input/tex/autoload/AutoloadConfiguration.js";
import "@mathjax/src/js/input/tex/base/BaseConfiguration.js";
import "@mathjax/src/js/input/tex/bbm/BbmConfiguration.js";
import "@mathjax/src/js/input/tex/bboldx/BboldxConfiguration.js";
import "@mathjax/src/js/input/tex/bbox/BboxConfiguration.js";
import "@mathjax/src/js/input/tex/begingroup/BeginGroupConfiguration.js";
import "@mathjax/src/js/input/tex/boldsymbol/BoldsymbolConfiguration.js";
import "@mathjax/src/js/input/tex/braket/BraketConfiguration.js";
import "@mathjax/src/js/input/tex/bussproofs/BussproofsConfiguration.js";
import "@mathjax/src/js/input/tex/cancel/CancelConfiguration.js";
import "@mathjax/src/js/input/tex/cases/CasesConfiguration.js";
import "@mathjax/src/js/input/tex/centernot/CenternotConfiguration.js";
import "@mathjax/src/js/input/tex/color/ColorConfiguration.js";
import "@mathjax/src/js/input/tex/colortbl/ColortblConfiguration.js";
import "@mathjax/src/js/input/tex/colorv2/ColorV2Configuration.js";
import "@mathjax/src/js/input/tex/configmacros/ConfigMacrosConfiguration.js";
import "@mathjax/src/js/input/tex/dsfont/DsFontConfiguration.js";
import "@mathjax/src/js/input/tex/empheq/EmpheqConfiguration.js";
import "@mathjax/src/js/input/tex/enclose/EncloseConfiguration.js";
import "@mathjax/src/js/input/tex/extpfeil/ExtpfeilConfiguration.js";
import "@mathjax/src/js/input/tex/gensymb/GensymbConfiguration.js";
import "@mathjax/src/js/input/tex/html/HtmlConfiguration.js";
import "@mathjax/src/js/input/tex/mathtools/MathtoolsConfiguration.js";
import "@mathjax/src/js/input/tex/mhchem/MhchemConfiguration.js";
import "@mathjax/src/js/input/tex/newcommand/NewcommandConfiguration.js";
import "@mathjax/src/js/input/tex/noerrors/NoerrorsConfiguration.js";
import "@mathjax/src/js/input/tex/noundefined/NoundefinedConfiguration.js";
import "@mathjax/src/js/input/tex/physics/PhysicsConfiguration.js";
import "@mathjax/src/js/input/tex/require/RequireConfiguration.js";
import "@mathjax/src/js/input/tex/setoptions/SetOptionsConfiguration.js";
import "@mathjax/src/js/input/tex/tagformat/TagFormatConfiguration.js";
import "@mathjax/src/js/input/tex/texhtml/TexHtmlConfiguration.js";
import "@mathjax/src/js/input/tex/textcomp/TextcompConfiguration.js";
import "@mathjax/src/js/input/tex/textmacros/TextMacrosConfiguration.js";
import "@mathjax/src/js/input/tex/unicode/UnicodeConfiguration.js";
import "@mathjax/src/js/input/tex/units/UnitsConfiguration.js";
import "@mathjax/src/js/input/tex/upgreek/UpgreekConfiguration.js";
import "@mathjax/src/js/input/tex/verb/VerbConfiguration.js";

// 
type N = LiteElement;
type T = LiteText;
type D = LiteDocument;

// MathJax v4 font support -----------------------------------------------
const fontNames = <const>[
  "mathjax-newcm",
  "mathjax-stix2"
];
type FontName = typeof fontNames[number];
function isFontName(name: string): name is FontName {
  return fontNames.includes(name as FontName);
}
const fontDataMap: { [key in FontName]: object } = {
  "mathjax-newcm": MathJaxNewcmFont,
  "mathjax-stix2": MathJaxStix2Font,
};

// ----------------------------------------------------------------------
interface AnyObject {
  [x: string]: any;
}

export interface Options {
  loader?: DeepPartial<LoaderOptions>;
  tex?: DeepPartial<TexInputOptions>;
  output?: DeepPartial<OutputOptions>;
  chtml?: DeepPartial<CHTMLOptions>;
}

interface LoaderOptions {
  load: string[];
  paths: {
    mathjax?: { [x: string]: string };
    fonts?: string;
  }
}

/// http://docs.mathjax.org/en/4.1/options/input/tex.html
interface TexInputOptions {
  packages: string | [string] | AnyObject;
  inlineMath: [[string, string]];
  displayMath: [[string, string]];
  processEscapes: boolean;
  processEnvironments: boolean;
  processRefs: boolean;
  digits: RegExp;
  tags: string;
  tagSide: string;
  tagIndent: string;
  useLabelIds: boolean;
  multlineWidth: string;
  maxMacros: number;
  maxBuffer: number;
  baseURL: string;
  formatError: (jax: object, err: Error) => void;

  // TeX Extension Options
  // https://docs.mathjax.org/en/4.1/options/input/tex.html#tex-extension-options
  macros: AnyObject;
}

/// https://docs.mathjax.org/en/4.1/options/output/index.html
interface OutputOptions {
  scale: number;
  minScale: number;
  matchFontHeight: boolean;
  mtextInheritFont: boolean;
  merrorInheritFont: boolean;
  mtextFont: string;
  merrorFont: string;
  mathmlspacing: boolean;
  skipAttributes: AnyObject;
  exFactor: number;
  displayAlign: string;
  displayIndent: number | string;
  linebreaks: {
    inline: boolean;
    width: number | string;
    lineleading: number;
  }

  // Set MathJax Font.
  // Available fonts: mathjax-newcm, mathjax-stix2
  // 
  // Since MathJax v4, fonts are provided as separate packages.
  // The font name is used by the MathJax Loader. It fetches the fontdata
  // asynchronously, either from the CDN or local filesystem. 
  // 
  // Our implementation do not use the loader, so all scripts are bundled
  // in advance. The WOFF2 files needs to be distributed separately. This 
  // requires two parameters: `fontData` and `fontURL`
  // 
  // `font`,`fontPath`,`fontExtensions` are options for the Loader, so it has
  // no effect. For convenience, we alter the original behavior and use the 
  // font name to set appropriate fontData and fontURL values.
  font: FontName;
  fontPath: string;
  fontExtensions: string[];
  
  htmlHDW: "auto" | "use" | "force" | "ignore";
  preFilters: string[],
  postFilters: string[],

  // Developer Options
  // https://docs.mathjax.org/en/4.1/options/output/#developer-options
  fontData: object;

  [x: string]: any;
}

/// https://docs.mathjax.org/en/4.1/options/output/chtml.html
interface CHTMLOptions  {
  matchFontHeight: boolean;
  fontURL: string;
  dynamicPrefix: string
  adaptiveCSS: boolean;
}

export interface ConvertOptions {
  inline: boolean;
  em: number;
  ex: number;
  width: number;
}

// List all TeX extensions available
const texExtensions = Object.keys(mjsource)
  .filter(name => name.substring(0,6) === "[tex]/")
  .map(name => name.substring(6))
  .sort();

const packageList = [
  "base",
  "ams",
  "newcommand",
  "noundefined",
].concat(texExtensions);

// The base part of default font URL. (path: {base}/*.woff2)
const MATHJAX_DEFAULT_FONT_URL = (name: FontName) => 
  `https://cdn.jsdelivr.net/npm/@mathjax/${name}-font@4/chtml/woff2`;

const defaultMathOption: Options = {
  tex: {
    packages: packageList,
  },
  output: {
    scale: 1.21, // magic # chosen which look nice for me
    exFactor: 5,
    font: "mathjax-newcm",
  },
  chtml: {
    adaptiveCSS: true,
  },
};

const defaultConvertOption: ConvertOptions = {
  inline: false,
  em: 16,
  ex: 8,
  width: 80 * 16,
};

/**
 * Initialize and encapsulate mathjax instance to generate
 * CommonHTML from TeX input.
 *
 * There are 2 important methods. One converts the input.
 * The other returns a stylesheet document. The stylesheet must be included
 * in your HTML document to render the equation properly.
 */
export class MathjaxEngine {
  option: Options;
  adaptor: LiteAdaptor;
  tex: TeX<N, T, D>;
  chtml: CHTML<N, T, D>;
  html: MathDocument<N, T, D>;

  constructor(option?: Partial<Options>) {
    this.option = initOption(option);

    this.adaptor = liteAdaptor();
    RegisterHTMLHandler(this.adaptor as DOMAdaptor<N, T, D>);

    const tex = new TeX<N, T, D>(this.option.tex);
    const chtml = new CHTML<N, T, D>({
      ...this.option.output,
      ...this.option.chtml,
    });
    const html = mathjax.document("", {
      InputJax: tex,
      OutputJax: chtml,
    });

    html.addRenderAction("typeset", 155, renderDoc, renderMath);

    this.tex = tex;
    this.chtml = chtml;
    this.html = html;

    function renderDoc(_doc: MathDocument<N, T, D>) {}
    function renderMath(math: MathItem<N, T, D>, doc: MathDocument<N, T, D>) {
      const adaptor = doc.adaptor;
      const text = adaptor.node("mjx-copytext", { "aria-hidden": true }, [
        adaptor.text(math.math),
      ]);
      adaptor.setStyle(text, "position", "absolute");
      adaptor.setStyle(text, "display", "none");
      adaptor.setStyle(text, "width", "0");
      adaptor.setStyle(math.typesetRoot, "position", "relative");
      adaptor.append(math.typesetRoot, text);
    }
  }

  /**
   * convert TeX input to CHTML.
   *
   * @param tex       input string
   * @param override  parameter to override the defaults, if you wish to
   * @returns
   */
  convert(tex: string, override?: Partial<ConvertOptions>): string {
    const node = this.html.convert(tex, {
      display: !(override?.inline ?? defaultConvertOption.inline),
      em: override?.em ?? defaultConvertOption.em,
      ex: override?.ex ?? defaultConvertOption.ex,
      containerWidth: override?.width ?? defaultConvertOption.width,
      scale: 1.0,
    });
    if (node instanceof LiteElement) {
      return this.adaptor.outerHTML(node);
    } else {
      return "ERROR";
    }
  }

  /**
   * returns adaptive css (stylesheet for the processed equations only),
   * or the full mathjax css (if configured)
   *
   * @returns css content
   */
  stylesheet(): string {
    return this.adaptor.textContent(this.chtml.styleSheet(this.html));
  }
}


/** Merge user options with default options */
function initOption(opt?: Partial<Options>): Options {
  const option = merge(defaultMathOption, opt);
  const packages = option?.tex?.packages;
  // Set default packages list
  if (typeof packages === "string") {
    option.tex = option.tex ?? {};
    option.tex.packages = packages.split(/\s*,\s*/);
  }
  // set default fontData and fontURL
  if (option.output?.font !== undefined && typeof option.output.font === "string") {
    let name = option.output.font.trim();
    if (name === "default") {
      name = "mathjax-newcm";
    }
    if (isFontName(name)) {
      if (option.output!.fontData === undefined) {
        option.output!.fontData = fontDataMap[name];
      }
      if (option.chtml?.fontURL === undefined) {
        option.chtml = option.chtml ?? {};
        option.chtml.fontURL = MATHJAX_DEFAULT_FONT_URL(name);
      }
    }
  }
  return option;
}