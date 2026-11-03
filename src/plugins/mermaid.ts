/**
 * Mermaid plugin
 */
import type { MarkdownIt, MarkdownItOptions, Renderer, Token } from "markdown-it";

function hashCode(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
};

function getHashCodeId(code: string): string {
  return `mermaid-${hashCode(code)}`;
};

// function base64Encode(str: string): string {
//   return Buffer.from(str).toString("base64");
// };

function mermaidChart(id: string, code: string): string {
  // return `<pre id="${id}" class="mermaid" data-mermaid-code="${base64Encode(code)}">${code}</pre>`;
  return `<pre id="${id}" class="mermaid">${code}</pre>`;
};

export function mermaidPlugin() {
  return (md: MarkdownIt) => {
    const original = md.renderer.rules.fence ||
        function (tokens, idx, options, _env, self) {
          return self.renderToken(tokens, idx, options);
        };

    md.renderer.rules.fence = (
      tokens: Token[],
      idx: number,
      options: Required<MarkdownItOptions>,
      env: any,
      self: Renderer
    ) => {
      const token = tokens[idx];
      if (token.info === "mermaid") {
        const code = token.content.trim();
        const id = getHashCodeId(code);
        return mermaidChart(id, code);
      }

      return original(tokens, idx, options, env, self);
    };
  };
}

export default mermaidPlugin;