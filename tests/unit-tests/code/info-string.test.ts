import { describe, expect, it } from "vitest";
import { InfoString } from "../../../src/code/info-string";

describe("InfoString infoStringParsing", () => {
  it("parse info string", () => {
    const arr = InfoString.parseInfoString("cpp a b c");
    expect(arr.length).toBe(4);
    expect(arr[0]).toBe("cpp");
    expect(arr[1]).toBe("a");
    expect(arr[2]).toBe("b");
    expect(arr[3]).toBe("c");
  });

  it("parse compex string", () => {
    const arr = InfoString.parseInfoString(
      "cpp a b c=d e='f  ' g=\"h\" i='' j=\"\\\"xxx\\\"\" title=\"My Title\""
    );
    expect(arr.length).toBe(9);
    expect(arr[0]).toBe("cpp");
    expect(arr[1]).toBe("a");
    expect(arr[2]).toBe("b");
    expect(arr[3]).toBe("c=d");
    expect(arr[4]).toBe("e=f");
    expect(arr[5]).toBe("g=h");
    expect(arr[6]).toBe("i=");
    expect(arr[7]).toBe("j=\"xxx\"");
    expect(arr[8]).toBe("title=My Title");
  });
});


describe("InfoString titleParsing", () => {
  it("parse title", () => {
    const attr = ["title=abc"];
    const title = InfoString.getTitle(attr);
    expect(title).toBe("abc");
  });

  it("parse title with quotes", () => {
    const attr = ["title=\"  abc \\\" def  \""];
    const title = InfoString.getTitle(attr);
    expect(title).toBe("abc \" def");
  });
});

describe("InfoString parses", () => {
  it("parse info string", () => {
    const info = new InfoString("cpp a b c");
    expect(info.lang).toBe("cpp");
    expect(info.attrs).toEqual(["a", "b", "c"]);
  });

  it("parse info string with quotes", () => {
    const info = new InfoString("cpp \"a b\" c");
    expect(info.lang).toBe("cpp");
    expect(info.attrs).toEqual(["a b", "c"]);
  });

  it("parse info string with single quotes", () => {
    const info = new InfoString("cpp 'a b' c");
    expect(info.lang).toBe("cpp");
    expect(info.attrs).toEqual(["a b", "c"]);
  });

  it("parse info string with empty string", () => {
    const info = new InfoString("");
    expect(info.lang).toBe("");
    expect(info.attrs).toEqual([]);
  });

  it("parse info string with empty attributes", () => {
    const info = new InfoString("cpp");
    expect(info.lang).toBe("cpp");
    expect(info.attrs).toEqual([]);
  });

  it("parse info string with spaces", () => {
    const info = new InfoString("cpp a b c");
    expect(info.lang).toBe("cpp");
    expect(info.attrs).toEqual(["a", "b", "c"]);
  });

  it("parse info string with mixed quotes", () => {
    const info = new InfoString("cpp \"a b\" 'c'");
    expect(info.lang).toBe("cpp");
    expect(info.attrs).toEqual(["a b", "c"]);
  });


  it("parse info string with title", () => {
    const info = new InfoString("bash a b c title=/etc/passwd");
    expect(info.lang).toBe("bash");
    expect(info.attrs.length).toBe(4);
    expect(info.title).toBe("/etc/passwd");
  });

  it("parse info string with title (with quotes)", () => {
    const info = new InfoString("cpp a b c title=\"My Title\"");
    expect(info.lang).toBe("cpp");
    expect(info.title).toBe("My Title");
  });
});

describe("Check JavaScript String", () => {
  
  it ("regex check 0", () => {
    let regex = /\\./g;
    expect(regex.test("\\\"")).toBe(true);
    expect(regex.test("\"")).toBe(false); // false, a single ctrl-char does not start with backslash
    
    regex = /[^"\\]+/g;
    expect(regex.test("a")).toBe(true);
    expect(regex.test("\0")).toBe(false); // false, length of control char is 0
    expect(regex.test("\n")).toBe(true);
    expect(regex.test("\"")).toBe(false);
    expect("a\0".length).toBe(2); 
    expect("a\n".length).toBe(2); 
    expect("a\"".length).toBe(2); 
  });

  it ("simple match test 1", () => {
    // Loop unwrapped implementation of ([^"\\]|\\.)*  
    // Allows sequence of any letter, including escaped letter, until dquote "
    const regex = /[^"\\]*(?:\\.|[^"\\]*)*/;
    expect(regex.test("a")).toBe(true);
    expect(regex.test("abc")).toBe(true);
    expect(regex.test("abc\\\"abc")).toBe(true);
    expect(regex.test("abc\\\"\\\"abc")).toBe(true);
    expect(regex.test("123")).toBe(true);
    expect(regex.test("\n")).toBe(true);
    expect(regex.test("\"abc\"")).toBe(true); 
    expect(regex.test("\"\\\"\"")).toBe(true);

    regex.lastIndex = 0;
    const match = regex.exec("abc\\\"def");
    expect(match).toBeTruthy();
    expect(match![0]).toBe("abc\\\"def");
  });

  it ("simple match test 2", () => {
    const regex = /[^"\\]*(?:\\.|[^"\\]*)*/;
    let match = regex.exec("\\\"a");
    expect(match).toBeTruthy();
    if (match !== null) {
      expect(match[0]).toBe("\\\"a");
    }
  });

  it ("simple match test 3", () => {
    const regex = /"([^"\\]*(?:\\.|[^"\\]*)*)"/;
    let match = regex.exec("\"\\\"a\"\"\"\"\"\""); // "\"a"""""""
    expect(match).toBeTruthy();
    if (match !== null) {
      expect(match[0]).toBe("\"\\\"a\""); // "\"a" (rest symbols are ignored)
    }
  });

  const dq = "[^\"\\\\]*(?:\\\\.|[^\"\\\\]*)*";
  const ptn = `(?:"(${dq})"\\s*|([^\\s]+))`;

  it("regex preserves backslash", () => {
    const regex = new RegExp(ptn, "");
    let match = regex.exec("\"\\\"a b \\\"c d\"");
    expect(match).toBeTruthy();
    if (match !== null) {
      expect(match[0]).toBe("\"\\\"a b \\\"c d\"");
      expect(match[1]).toBe("\\\"a b \\\"c d");
      expect(match[2]).toBeUndefined();
    }
  });

  it("input starts with backslash", () => {
    // Input is \\"a"
    const regex = new RegExp(ptn, "");
    let match = regex.exec("\\\"a\"");
    expect(match).toBeTruthy();
    if (match !== null) {
      expect(match[0]).toBe("\\\"a\"");
      expect(match[1]).toBeUndefined(); // because input does not start with "
      expect(match[2]).toBe("\\\"a\""); 
    }
  });


  it("do not remove quote if escaped", () => {
    const regex = new RegExp(ptn, "");
    let match = regex.exec("\\\"12345\\\"");
    expect(match).toBeTruthy();
    if (match !== null) {
      console.log(match);
      expect(match[0]).toBe("\\\"12345\\\"");
      expect(match[1]).toBeUndefined();
      expect(match[2]).toBe("\\\"12345\\\"");
    }
  });

  it("key and quoted value", () => {
    // let match = regex.exec("key=\"value with space\"");
    // if (match != null) {
    //   expect(match[0]).toBe("key=\"value with space\"");
    //   expect(match[1]).toBe("key=");
    //   expect(match[2]).toBe("value with space");
    // }

    // let match = regex.exec("key=\"\\\"And then there were none\\\"\"");
    // if (match != null) {
    //   console.log(match);
    //   // expect(match[0]).toBe("key=\"And then there were none\"");
    //   expect(match[1]).toBe("key=");
    //   expect(match[2]).toBe("And then there were none");
    // }
  });
});