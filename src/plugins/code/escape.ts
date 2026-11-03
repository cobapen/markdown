/// From [markdown-it]/src/common/utils.ts
import { decodeHTMLStrict } from "entities";

/** Checks whether a code point can be decoded from a numeric HTML entity. */
function isValidEntityCode (c: number) {
  // broken sequence
  if (c >= 0xD800 && c <= 0xDFFF) { return false; }
  // never used
  if (c >= 0xFDD0 && c <= 0xFDEF) { return false; }
  if ((c & 0xFFFF) === 0xFFFF || (c & 0xFFFF) === 0xFFFE) { return false; }
  // control codes
  if (c >= 0x00 && c <= 0x08) { return false; }
  if (c === 0x0B) { return false; }
  if (c >= 0x0E && c <= 0x1F) { return false; }
  if (c >= 0x7F && c <= 0x9F) { return false; }
  // out of range
  if (c > 0x10FFFF) { return false; }
  return true;
}

/**
 * Converts a Unicode code point to a string, like `String.fromCodePoint()`,
 * but does not throw for invalid input.
 */
function fromCodePoint (c: number) {
  /* eslint no-bitwise:0 */
  if (c > 0xffff) {
    c -= 0x10000;
    const surrogate1 = 0xd800 + (c >> 10);
    const surrogate2 = 0xdc00 + (c & 0x3ff);

    return String.fromCharCode(surrogate1, surrogate2);
  }
  return String.fromCharCode(c);
}

const UNESCAPE_MD_RE = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g;
const ENTITY_RE = /&([a-z#][a-z0-9]{1,31});/gi;
const UNESCAPE_ALL_RE = new RegExp(`${UNESCAPE_MD_RE.source}|${ENTITY_RE.source}`, "gi");

const DIGITAL_ENTITY_TEST_RE = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;

function replaceEntityPattern (match: string, name: string) {
  if (name.charCodeAt(0) === 0x23/* # */ && DIGITAL_ENTITY_TEST_RE.test(name)) {
    const code = name[1].toLowerCase() === "x"
      ? parseInt(name.slice(2), 16)
      : parseInt(name.slice(1), 10);

    if (isValidEntityCode(code)) {
      return fromCodePoint(code);
    }

    return match;
  }

  const decoded = decodeHTMLStrict(match);
  if (decoded !== match) {
    return decoded;
  }

  return match;
}

/** Decodes Markdown backslash escapes. */
function unescapeMd (str: string) {
  if (str.indexOf("\\") < 0) { return str; }
  return str.replace(UNESCAPE_MD_RE, "$1");
}

/**
 * Decodes Markdown backslash escapes and HTML character references in link
 * destinations, link titles, and fenced code info strings.
 */
function unescapeAll (str: string) {
  if (str.indexOf("\\") < 0 && str.indexOf("&") < 0) { return str; }

  return str.replace(UNESCAPE_ALL_RE, function (match, escaped, entity) {
    if (escaped) { return escaped; }
    return replaceEntityPattern(match, entity);
  });
}

const HTML_ESCAPE_TEST_RE = /[&<>"]/;
const HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
const HTML_REPLACEMENTS = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;"
};

function replaceUnsafeChar (ch: string): string {
  return HTML_REPLACEMENTS[ch as keyof typeof HTML_REPLACEMENTS];
}

/** Escapes HTML special characters in a string. */
function escapeHtml (str: string) {
  if (HTML_ESCAPE_TEST_RE.test(str)) {
    return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
  }
  return str;
}


export {
  escapeHtml,
  unescapeAll,
  unescapeMd
};