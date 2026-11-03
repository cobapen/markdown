import type { MarkdownIt, StateCore, Token } from "markdown-it";

// `RuleCore` is not exported, since v15
type RuleCore = Parameters<typeof MarkdownIt.prototype.core.ruler.after>[2];

export type RewriteHandler = (link: string, env: unknown, token: Token) => string;

export interface Options {
  rewrite?: RewriteHandler;
}

export function defaultHandler(link: string, _env: unknown, _token: Token): string {
  if (!link.startsWith("http") && link.endsWith(".md")) {
    return link.replace(/\.md$/, ".html");
  } else {
    return link;
  }
}

function replaceAttr(token: Token, attrName: string, handler: RewriteHandler, env: unknown) {
  token.attrs?.forEach(attr => {
    if (attr[0] === attrName) {
      attr[1] = handler(attr[1].toString(), env, token);
    }
  });
}

function replaceHtmlAttr(token: Token, handler: RewriteHandler, env: unknown) {
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


export function rewriteLink(md: MarkdownIt, option?: Options) {
  const handler = getHandler(option);
  md.core.ruler.after("linkify", "rewrite_link", handler);
};

export default rewritelink;