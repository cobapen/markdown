/**
 * InfoString parses info_string from fenced code block.
 */
export class InfoString {

  private readonly _lang: string;
  private readonly _attrs: string[];
  private readonly _title: string;
  private readonly _linestart: number | undefined;

  constructor(info: string) {
    if (info.length > 0) {
      const arr = InfoString.parseInfoString(info);
      this._lang = arr[0];
      this._attrs = arr.slice(1);
      this._title = InfoString.getTitle(this._attrs);
      this._linestart = InfoString.getLineStart(this._attrs);
    } else {
      this._lang = "";
      this._attrs = [];
      this._title = "";
      this._linestart = undefined;
    }
  }

  get lang(): string {
    return this._lang;
  }

  get attrs(): string[] {
    return this._attrs;
  }

  get title(): string {
    return this._title; 
  }

  get linestart(): number | undefined {
    return this._linestart;
  }

  get hasLang(): boolean {
    return this._lang.length > 0;
  }

  /** Parse info_string into an array of strings. All quotes are removed*/
  public static parseInfoString(info: string): string[] {
    // There are 4 possible tokens, but it can be reduced to 2 patterns.
    // arg, "arg quoted", key=value, key="value quoted"
    // 
    // This function returns a quote-removed string. 
    // 
    // const regex = /([^\s]+=)?(?:"([^"]*)"|'([^']*)'|([^\s]+))/g;
    //                 ~~~~~~~~     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
    //                 key=         "value" 'value' value
    //
    // The regex above does not support escape letters. The next regex
    // is escape char aware. 
    // 
    // NOTE: This class is designed to handle escape letters. However, tools 
    // might decide to unescape info_string before used (e.g. markdown-it). 
    // In such case, you might need to use double-escaped quotes.
    // 
    const dq = "[^\"\\\\]*(?:\\\\.|[^\"\\\\]*)*";   // [^"]*
    const sq = "[^\'\\\\]*(?:\\\\.|[^\'\\\\]*)*";   // [^']*
    //          ~~~~~~~~~~   ~~~~~ ~~~~~~~~~~
    //          char seq   ( escape  char seq )*
    // 
    const ptn = `([^\\s]+=)?(?:"(${dq})"|'(${sq})'|([^\\s]+))`;
    //           ~~~~~~~~~~    ~~~~~~~~~ ~~~~~~~~~ ~~~~~~~~~
    //           key=          "value"   'value'   value
    const regex = new RegExp(ptn, "g");
    const result: string[] = [];
    let match;
    while ((match = regex.exec(info)) !== null) {
      let text = (match[1] || "") + (match[2] || match[3] || match[4] || "");
      text = unescape(text).trim();
      result.push(text);
    }
    return result;
  }

  /** Parse metadata notation "{filename:line, ...}"" */
  public static parseMetaNotation(text: string): { filename: string; line: number } | undefined {
    const match = text.match(/^\{\s*([^:]+):(\d+)\s*\}$/);
    if (match) {
      return {
        filename: match[1],
        line: parseInt(match[2], 10),
      };
    }
    return undefined;
  }

  /** From attributes list, return title metadata */
  public static getTitle(attr: string[]): string {
    const titleAttr = attr.find(x => x.startsWith("title=")) ?? "";
    if (titleAttr.length > 0) {
      const match = titleAttr.match(/^title=(.*)$/);

      if (match) {
        let value = match[1].trim();
        if (value.startsWith("\"") && value.endsWith("\"")) {
          value = value.slice(1, -1);
          value = unescape(value).trim();
        }
        return value;
      } else {
        throw new Error("Must not fail. Check impl.");
      }
    }

    if (attr.length > 0) {
      const meta = InfoString.parseMetaNotation(attr[0]);
      if (meta && meta.filename.length > 0) {
        return meta.filename;
      }
    }
    return "";
  }

  /** From attributes list, return line number if defined */
  public static getLineStart(attr: string[]): number | undefined {
    const lineAttr = attr.find(x => x.startsWith("linestart=")) ?? "";
    if (lineAttr.length > 0) {
      return parseInt(lineAttr.split("=")[1].trim());
    }
    if (attr.length > 0) {
      const meta = InfoString.parseMetaNotation(attr[0]);
      if (meta && meta.line > 0) {
        return meta.line;
      }
    }
    
    return undefined;
  }
}


function unescape(text: string): string {
  return text.replaceAll(/\\\"/g, "\"").replaceAll(/\\\'/g, "'");
}