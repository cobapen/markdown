/**
 * highlight.ts
 * 2023-11-20
 * provides a custom highlighter for MarkdownIt
 */
// import hljs from "highlight.js";
import hljs from "./highlight-custom.js"; // lightweight version.
import { InfoString } from "./info-string.js";

function _debuglog(..._args: any[]) {
  // if (_debuglog.caller.name !== "") return;
  // console.log(...args);
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
 * Highlight function with line number support
 *
 * @param code
 * @param lang
 * @param linestart
 * @returns
 */
export function highlightWithLineNumber(code: string, lang: string, linestart?: number) {
  try {
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
      if (linestart !== undefined) {
        const lines = htmlLines.split("\n");
        const elWidth = numDigits(linestart + lines.length) * 0.8;
        const elStyle =
          "display:inline-block;" +
          "user-select:none;" +
          `width: ${niceDec(elWidth)}em;`;
        lines.forEach((line, i, lines) => {
          lines[i] =
            "<div class=\"line\">" +
            `<span class="line-no" style="${elStyle}">${
              linestart + i
            }</span>${line}` +
            "</div>";
        });
        _debuglog(lines);

        htmlLines = lines.join("");
      }
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
export function highlighterForMarkdownIt(str: string, lang: string, attrs: string) {
  _debuglog(lang ? lang : "(lang is empty or undefined)");
  const info = new InfoString(lang + " " + attrs);
  _debuglog(info);
  return highlightWithLineNumber(str, info.lang, info.linestart);
}

