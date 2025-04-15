import { Options } from "markdown-it/index.mjs";
import { escapeHtml, unescapeAll } from "markdown-it/lib/common/utils.mjs";
import Renderer from "markdown-it/lib/renderer.mjs";
import Token from "markdown-it/lib/token.mjs";
import { InfoString } from "./info-string.js";

/**
 * Custom fence renderer for markdown-it.
 * 
 * see: markdown-it/lib/renderer.mjs
 */
export function fence_custom(tokens: Token[], idx: number, options: Options, _env: any, slf: Renderer) {
  const token = tokens[idx];
  const info_str = token.info ? unescapeAll(token.info).trim() : "";
  
  const info = new InfoString(info_str);
  const langName = info.lang;
  const langAttrs = info.attrs.join(" ");

  let highlighted;
  if (options.highlight) {
    highlighted = options.highlight(token.content, langName, langAttrs) || escapeHtml(token.content);
  } else {
    highlighted = escapeHtml(token.content);
  }

  if (highlighted.indexOf("<pre") === 0) {
    return highlighted + "\n";
  }

  // If language exists, inject class gently, without modifying original token.
  // May be, one day we will add .deepClone() for token and simplify this part, but
  // now we prefer to keep things local.
  if (info.hasLang) {
    const i = token.attrIndex("class");
    const tmpAttrs = token.attrs ? token.attrs.slice() : [];

    if (i < 0) {
      tmpAttrs.push(["class", options.langPrefix + langName]);
    } else {
      tmpAttrs[i] = tmpAttrs[i].slice() as [string, string];
      tmpAttrs[i][1] += " " + options.langPrefix + langName;
    }

    // Fake token just to render attributes
    const tmpToken = {
      attrs: tmpAttrs
    } as Token;


    if (info.title.length > 0) {
      return `<pre><code${slf.renderAttrs(tmpToken)}>${highlighted}</code><span class="title">${info.title}</span></pre>\n`;
    }

    return `<pre><code${slf.renderAttrs(tmpToken)}>${highlighted}</code></pre>\n`;
  }

  return `<pre><code${slf.renderAttrs(token)}>${highlighted}</code></pre>\n`;
}