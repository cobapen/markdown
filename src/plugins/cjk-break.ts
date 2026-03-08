/// markdown-it-cjk-break | 2.0.0 | MIT License
/// https://github.com/markdown-it/markdown-it-cjk-breaks
///
/// Modified and ported to TS by Yamavol for bugfix.
import type { PluginSimple, StateCore, Token  } from "markdown-it/index.js";
import { getEAWOfCodePoint } from "meaw";

function is_surrogate (c1: number, c2: number) {
  return c1 >= 0xD800 && c1 <= 0xDBFF && c2 >= 0xDC00 && c2 <= 0xDFFF;
}

function is_hangul (c: string) {
  // require('unicode-10.0.0/Script/Hangul/regex')
  return /[\u1100-\u11FF\u302E\u302F\u3131-\u318E\u3200-\u321E\u3260-\u327E\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/.test(c);
}

function is_fwh(codepoint: number): boolean {
  // Check fullWidth, wide, or halfWidth
  const eaw = getEAWOfCodePoint(codepoint) || "A";
  return /^[FWH]/.test(eaw);
}
  

function process_inlines (tokens: Token[]) {
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type !== "softbreak") continue;

    // default last/next character to space
    let last = " ";
    let next = " ";

    for (let j = i - 1; j >= 0; j--) {
      if (tokens[j].type !== "text") continue;
      if (tokens[j].content.length === 0) continue;

      const c1 = tokens[j].content.charCodeAt(tokens[j].content.length - 2);
      const c2 = tokens[j].content.charCodeAt(tokens[j].content.length - 1);

      last = tokens[j].content.slice(is_surrogate(c1, c2) ? -2 : -1);
      break;
    }

    for (let j = i + 1; j < tokens.length; j++) {
      if (tokens[j].type !== "text") continue;
      if (tokens[j].content.length === 0) continue;

      const c1 = tokens[j].content.charCodeAt(0);
      const c2 = tokens[j].content.charCodeAt(1);

      next = tokens[j].content.slice(0, is_surrogate(c1, c2) ? 2 : 1);
      break;
    }

    let remove_break = false;

    // remove newline if it's adjacent to ZWSP
    if (last === "\u200b" || next === "\u200b") remove_break = true;

    // remove newline if both characters are fullwidth (F), wide (W) or
    // halfwidth (H), but not Hangul
    if (is_fwh(last.codePointAt(0)!) && is_fwh(next.codePointAt(0)!)) {
      if (!is_hangul(last) && !is_hangul(next)) remove_break = true;
    }

    if (remove_break) {
      tokens[i].type    = "text";
      tokens[i].content = "";
    }
  }
}

function handler(state: StateCore) {
  for (let blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
    if (state.tokens[blkIdx].type !== "inline") continue;

    process_inlines(state.tokens[blkIdx].children || []);
  }
}

export const cjk_break: PluginSimple = (md) => {
  md.core.ruler.push("cjk_breaks", handler);
};

export default cjk_break;