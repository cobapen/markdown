import { PluginWithOptions } from "markdown-it";
import { StateCore } from "markdown-it/index.js";
import { RuleCore } from "markdown-it/lib/parser_core.mjs";
import Token from "markdown-it/lib/token.mjs";

type ReplaceHandler = (link: string, env: any, token: Token) => string;

interface Options {
  replace: ReplaceHandler;
}

function defaultHandler(link: string, _env: any, _token: Token): string {
  console.log(link);
  if (!link.startsWith("http") && link.endsWith(".md")) {
    return link.replace(/\.md$/, ".html");
  } else {
    return link;
  }
}

function replaceAttr(token: Token, attrName: string, handler: ReplaceHandler, env: any) {
  token.attrs?.forEach(attr => {
    if (attr[0] === attrName) {
      attr[1] = handler(attr[1], env, token);
    }
  });
}


function getHandler(option?: Options): RuleCore {
  const replaceFn = option?.replace || defaultHandler;

  function handler(state: StateCore) {
    state.tokens.forEach(token => {
      if (token.type === "inline" && token.children !== null) {
        token.children.forEach(childToken => {
          if (childToken.type == "link_open") {
            replaceAttr(childToken, "href", replaceFn, state.env);
          }
          else if (childToken.type == "image") {
            replaceAttr(childToken, "src", replaceFn, state.env);
          }
        });
      }
    });
  };

  return handler;
}


export const replacelink: PluginWithOptions<Options> = (md, option) => {
  const handler = getHandler(option);
  md.core.ruler.after("linkify", "replace_link", handler);
};

export default replacelink;