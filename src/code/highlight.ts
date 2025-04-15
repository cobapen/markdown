/**
 * highlight.ts
 * 2023-11-20
 * provides a custom highlighter for the MarkdownIt (supports by default)
 */
import hljs from "highlight.js";

function _debuglog(..._args: any[]) {
  // if (_debuglog.caller.name !== "") return;
  // console.log(...args);
}

/** Parses int but returns "undefined" on error */
function toInt(n: string): number | undefined {
  const x = parseInt(n, 10);
  return isNaN(x) ? undefined : x;
}

/** Get digits of the number. e.g. 1000 => 4 */
function numDigits(n: number) {
  return Math.floor(n).toString().length;
}

/** Print a decimal nicely */
function niceDec(n: number) {
  return n.toFixed(3);
}

/**
 * Parse markdown language and languageAttributes.
 *
 * CustomSpec: languageAttrs format is "{filename:lineNo}"
 *
 * @param {string} lang
 * @param {string} attrs
 * @returns
 */
export function parseMarkdownLang(lang: string, attrs: string) {
  const base = {
    lang,
    title: "",
    line: "",
  };
  if (!attrs) return { ...base };

  const r1 = /\{?(.*?):(\d*)\}?/.exec(attrs);

  if (r1 === null) {
    return { ...base };
  } else {
    return {
      ...base,
      lang,
      title: r1[1],
      line: r1[2],
    };
  }
}

/**
 * Highlight function with line number support
 *
 * @param code
 * @param args
 * @returns
 */
export function highlightWithLineNumber(
  code: string,
  args: { [x: string]: string },
) {
  try {
    args = args ?? {};
    const lang = args.lang;
    const lstart = toInt(args.line);

    /** convert if lang is specified + supported by highlight.js */
    if (lang && hljs.getLanguage(lang)) {
      /** do conversion */
      let htmlLines = hljs.highlight(code, { language: lang }).value;

      /**
       * Attach the line number if specified.
       *
       * The given code is rendered in <pre><code>, so each line is terminated by '\n'.
       * Split the input, wrap them by <div class="line">.
       * At the beginning of each line, <span class="line-no"> is added.
       *
       * default styles are embedded so that the text is readable
       * even if css was not applied.
       *
       * default-styles:
       * - display: inline-block
       * - user-select: none
       * - width: ${numDigits}em
       */
      if (lstart !== undefined) {
        const lines = htmlLines.split("\n");
        const elWidth = numDigits(lstart + lines.length) * 0.8;
        const elStyle =
          "display:inline-block;" +
          "user-select:none;" +
          `width: ${niceDec(elWidth)}em;`;
        lines.forEach((line, i, lines) => {
          lines[i] =
            "<div class=\"line\">" +
            `<span class="line-no" style="${elStyle}">${
              lstart + i
            }</span>${line}` +
            "</div>";
        });
        _debuglog(lines);

        htmlLines = lines.join("");
      }

      /**
       * Filename (Title) is currently unsupported.
       *
       * This function returns the string for this part:
       * <pre><code> HERE </code></pre>
       *            ~~~~~~
       *
       * but the title element should be be placed:
       * <pre><code>...</code> <div> HERE </div> </pre>
       *                            ~~~~~~
       * or elsewhere, which
       */
      return htmlLines;
    } else {
      // no language , no highlighting.
      // If you want line numbers without highlighting, set language to
      // "nohighlight" or "text"
      return "";
    }
  } catch (_) {
    return "";
  }
}

/**
 * Exported function for markdown-it
 *
 * @param str
 * @param lang
 * @param attrs
 * @returns
 */
export function highlighterForMarkdownIt(
  str: string,
  lang: string,
  attrs: string,
) {
  _debuglog(lang ? lang : "(lang is empty or undefined)");
  const hlArgs = parseMarkdownLang(lang, attrs);
  _debuglog(hlArgs);
  return highlightWithLineNumber(str, hlArgs);
}

const runTest = false;
if (runTest) {
  _debuglog(toInt("1"));
  _debuglog(toInt("10"));
  _debuglog(toInt("100"));
  _debuglog(toInt("100x"));
  _debuglog(toInt("100x"));
  _debuglog(toInt("10x0"));

  _debuglog(numDigits(1));
  _debuglog(numDigits(10));
  _debuglog(numDigits(100));
  _debuglog(numDigits(999));

  _debuglog(parseMarkdownLang("cpp", ""));
  _debuglog(parseMarkdownLang("cpp", "{main.cpp:10}"));
  _debuglog(parseMarkdownLang("cpp", "{abc.cpp:10"));
  _debuglog(parseMarkdownLang("cpp", "{:20}"));
  _debuglog(parseMarkdownLang("cpp", "{hello world.cpp:30}"));

  _debuglog(hljs.highlight("#include <iostream>", { language: "cpp" }).value);
}
