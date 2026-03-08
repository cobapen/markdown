import { LanguageFn } from "highlight.js";
import hljs from "highlight.js/lib/core";

// Languages Import - pick manually f
import langaccesslog from "highlight.js/lib/languages/accesslog";
import langarduino from "highlight.js/lib/languages/arduino";
import langarmasm from "highlight.js/lib/languages/armasm";
import langasciidoc from "highlight.js/lib/languages/asciidoc";
import langavrasm from "highlight.js/lib/languages/avrasm";
import langawk from "highlight.js/lib/languages/awk";
import langbash from "highlight.js/lib/languages/bash";
import langbasic from "highlight.js/lib/languages/basic";
import langbnf from "highlight.js/lib/languages/bnf";
import langc from "highlight.js/lib/languages/c";
import langclojure from "highlight.js/lib/languages/clojure";
import langcmake from "highlight.js/lib/languages/cmake";
import langcoffeescript from "highlight.js/lib/languages/coffeescript";
import langcpp from "highlight.js/lib/languages/cpp";
import langcsharp from "highlight.js/lib/languages/csharp";
import langcss from "highlight.js/lib/languages/css";
import langd from "highlight.js/lib/languages/d";
import langdart from "highlight.js/lib/languages/dart";
import langdelphi from "highlight.js/lib/languages/delphi";
import langdiff from "highlight.js/lib/languages/diff";
import langdjango from "highlight.js/lib/languages/django";
import langdns from "highlight.js/lib/languages/dns";
import langdockerfile from "highlight.js/lib/languages/dockerfile";
import langdos from "highlight.js/lib/languages/dos";
import langebnf from "highlight.js/lib/languages/ebnf";
import langelixir from "highlight.js/lib/languages/elixir";
import langelm from "highlight.js/lib/languages/elm";
import langerb from "highlight.js/lib/languages/erb";
import langerlang from "highlight.js/lib/languages/erlang";
import langexcel from "highlight.js/lib/languages/excel";
import langfortran from "highlight.js/lib/languages/fortran";
import langglsl from "highlight.js/lib/languages/glsl";
import langgo from "highlight.js/lib/languages/go";
import langgradle from "highlight.js/lib/languages/gradle";
import langgraphql from "highlight.js/lib/languages/graphql";
import langhandlebars from "highlight.js/lib/languages/handlebars";
import langhaskell from "highlight.js/lib/languages/haskell";
import langhttp from "highlight.js/lib/languages/http";
import langini from "highlight.js/lib/languages/ini";
import langjava from "highlight.js/lib/languages/java";
import langjavascript from "highlight.js/lib/languages/javascript";
import langjson from "highlight.js/lib/languages/json";
import langjulia from "highlight.js/lib/languages/julia";
import langkotlin from "highlight.js/lib/languages/kotlin";
import langlatex from "highlight.js/lib/languages/latex";
import langlisp from "highlight.js/lib/languages/lisp";
import langllvm from "highlight.js/lib/languages/llvm";
import langlua from "highlight.js/lib/languages/lua";
import langmakefile from "highlight.js/lib/languages/makefile";
import langmarkdown from "highlight.js/lib/languages/markdown";
import langmatlab from "highlight.js/lib/languages/matlab";
import langmipsasm from "highlight.js/lib/languages/mipsasm";
import langnginx from "highlight.js/lib/languages/nginx";
import langnim from "highlight.js/lib/languages/nim";
import langnode from "highlight.js/lib/languages/node-repl";
import langobjectivec from "highlight.js/lib/languages/objectivec";
import langocaml from "highlight.js/lib/languages/ocaml";
import langperl from "highlight.js/lib/languages/perl";
import langphp from "highlight.js/lib/languages/php";
import langplaintext from "highlight.js/lib/languages/plaintext";
import langpowershell from "highlight.js/lib/languages/powershell";
import langprocessing from "highlight.js/lib/languages/processing";
import langprotobuf from "highlight.js/lib/languages/protobuf";
import langpython from "highlight.js/lib/languages/python";
import langqml from "highlight.js/lib/languages/qml";
import langr from "highlight.js/lib/languages/r";
import langruby from "highlight.js/lib/languages/ruby";
import langrust from "highlight.js/lib/languages/rust";
import langscala from "highlight.js/lib/languages/scala";
import langscheme from "highlight.js/lib/languages/scheme";
import langscss from "highlight.js/lib/languages/scss";
import langshell from "highlight.js/lib/languages/shell";
import langsmalltalk from "highlight.js/lib/languages/smalltalk";
import langsql from "highlight.js/lib/languages/sql";
import langswift from "highlight.js/lib/languages/swift";
import langtwig from "highlight.js/lib/languages/twig";
import langtypescript from "highlight.js/lib/languages/typescript";
import langvbnet from "highlight.js/lib/languages/vbnet";
import langvbscript from "highlight.js/lib/languages/vbscript";
import langverilog from "highlight.js/lib/languages/verilog";
import langvhdl from "highlight.js/lib/languages/vhdl";
import langvim from "highlight.js/lib/languages/vim";
import langwasm from "highlight.js/lib/languages/wasm";
import langx86asm from "highlight.js/lib/languages/x86asm";
import langxml from "highlight.js/lib/languages/xml";
import langyaml from "highlight.js/lib/languages/yaml";

const languages: Array<[name: string, language: LanguageFn]> = [
  ["accesslog", langaccesslog],
  ["arduino", langarduino],
  ["armasm", langarmasm],
  ["asciidoc", langasciidoc],
  ["avrasm", langavrasm],
  ["awk", langawk],
  ["bash", langbash],
  ["basic", langbasic],
  ["bnf", langbnf],
  ["c", langc],
  ["clojure", langclojure],
  ["cmake", langcmake],
  ["coffeescript", langcoffeescript],
  ["cpp", langcpp],
  ["csharp", langcsharp],
  ["css", langcss],
  ["d", langd],
  ["dart", langdart],
  ["delphi", langdelphi],
  ["diff", langdiff],
  ["django", langdjango],
  ["dns", langdns],
  ["dockerfile", langdockerfile],
  ["dos", langdos],
  ["ebnf", langebnf],
  ["elixir", langelixir],
  ["elm", langelm],
  ["erb", langerb],
  ["erlang", langerlang],
  ["excel", langexcel],
  ["fortran", langfortran],
  ["glsl", langglsl],
  ["go", langgo],
  ["gradle", langgradle],
  ["graphql", langgraphql],
  ["handlebars", langhandlebars],
  ["haskell", langhaskell],
  ["http", langhttp],
  ["ini", langini],
  ["java", langjava],
  ["javascript", langjavascript],
  ["json", langjson],
  ["julia", langjulia],
  ["kotlin", langkotlin],
  ["latex", langlatex],
  ["lisp", langlisp],
  ["llvm", langllvm],
  ["lua", langlua],
  ["makefile", langmakefile],
  ["markdown", langmarkdown],
  ["matlab", langmatlab],
  ["mipsasm", langmipsasm],
  ["nginx", langnginx],
  ["nim", langnim],
  ["node-repl", langnode],
  ["objectivec", langobjectivec],
  ["ocaml", langocaml],
  ["perl", langperl],
  ["php", langphp],
  ["plaintext", langplaintext],
  ["powershell", langpowershell],
  ["processing", langprocessing],
  ["protobuf", langprotobuf],
  ["python", langpython],
  ["qml", langqml],
  ["r", langr],
  ["ruby", langruby],
  ["rust", langrust],
  ["scala", langscala],
  ["scheme", langscheme],
  ["scss", langscss],
  ["shell", langshell],
  ["smalltalk", langsmalltalk],
  ["sql", langsql],
  ["swift", langswift],
  ["twig", langtwig],
  ["typescript", langtypescript],
  ["vbnet", langvbnet],
  ["vbscript", langvbscript],
  ["verilog", langverilog],
  ["vhdl", langvhdl],
  ["vim", langvim],
  ["wasm", langwasm],
  ["x86asm", langx86asm],
  ["xml", langxml],
  ["yaml", langyaml],
];

for (const [name, language] of languages) {
  hljs.registerLanguage(name, language);
}

export default hljs;