/**
 * Rewrite Link
 * 
 * Modifies links in markdown
 */
import type { PluginWithOptions } from "markdown-it";
import type { RuleCore } from "markdown-it/lib/parser_core.mjs";
import type StateCore from "markdown-it/lib/rules_core/state_core.mjs";
import type Token from "markdown-it/lib/token.mjs";

export type RewriteHandler = (link: string, env: any, token: Token) => string;

export interface Options {
  rewrite: RewriteHandler;
}

export function defaultHandler(link: string, _env: any, _token: Token): string {
  if (!link.startsWith("http") && link.endsWith(".md")) {
    return link.replace(/\.md$/, ".html");
  } else {
    return link;
  }
}

function replaceAttr(token: Token, attrName: string, handler: RewriteHandler, env: any) {
  token.attrs?.forEach(attr => {
    if (attr[0] === attrName) {
      attr[1] = handler(attr[1], env, token);
    }
  });
}

function replaceHtmlAttr(token: Token, handler: RewriteHandler, env: any) {
  // List of attributes that may contain URIs.
  // https://html.spec.whatwg.org/multipage/indices.html#attributes-1
  // https://stackoverflow.com/questions/2725156/
  const attrs = [
    "href", "src", "action", "formaction", "poster", "cite", "data",
    "manifest", "srcset", "imgsrcset", "ping", "content", "usemap"
  ].join("|");
    
  const regex = new RegExp(`(${attrs})\\s*=\\s*["']([^"']+)["']`, "g");

  const rewriteFn = (_match: string, attr: string, value: string) => {
    if (attr === "srcset" || attr === "imgsrcset") {
      const replaced = value.split(",")
        .map(part => part
          .split(" ")
          .map(text => handler(text, env, token))
          .join(" "))
        .join(",");
      return `${attr}="${replaced}"`;
    }
    else {
      const replaced = handler(value, env, token);
      return `${attr}="${replaced}"`;
    }
  };
  
  const content = token.content.replace(regex, rewriteFn);
  token.content = content;
}

function getHandler(option?: Options): RuleCore {
  const rewriteFn = option?.rewrite || defaultHandler;

  function handler(state: StateCore) {
    state.tokens.forEach(token => {
      if (token.type === "inline" && token.children !== null) {
        token.children.forEach(childToken => {
          if (childToken.type == "link_open") {
            replaceAttr(childToken, "href", rewriteFn, state.env);
          }
          else if (childToken.type == "image") {
            replaceAttr(childToken, "src", rewriteFn, state.env);
          }
          else if (childToken.type == "html_inline") {
            replaceHtmlAttr(childToken, rewriteFn, state.env);
          }
        });
      }
      else if (token.type === "html_block") {
        replaceHtmlAttr(token, rewriteFn, state.env);
      }
    });
  };

  return handler;
}


export const rewritelink: PluginWithOptions<Options> = (md, option) => {
  const handler = getHandler(option);
  md.core.ruler.after("linkify", "rewrite_link", handler);
};

export default rewritelink;