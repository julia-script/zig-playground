import * as monaco from "monaco-editor";
// bg-zinc-50	background-color: rgb(250 250 250);
// bg-zinc-100	background-color: rgb(244 244 245);
// bg-zinc-200	background-color: rgb(228 228 231);
// bg-zinc-300	background-color: rgb(212 212 216);
// bg-zinc-400	background-color: rgb(161 161 170);
// bg-zinc-500	background-color: rgb(113 113 122);
// bg-zinc-600	background-color: rgb(82 82 91);
// bg-zinc-700	background-color: rgb(63 63 70);
// bg-zinc-800	background-color: rgb(39 39 42);
// bg-zinc-900	background-color: rgb(24 24 27);
// bg-zinc-950	background-color: rgb(9 9 11);
const tw = {
  zinc: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
    950: "#09090b",
  },
};
const zigThemeColor = "#f7a41d";
const themeColors = {
  zig: "#f7a41d",
  red: "#ea4a5a",
  yellow: "#f7a41d",
  // yellow: "#fb8532",
};
export const theme: monaco.editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    {
      background: "24292e",
      token: "",
    },
    {
      foreground: "959da5",
      token: "comment",
    },
    {
      foreground: "959da5",
      token: "punctuation.definition.comment",
    },
    {
      foreground: "959da5",
      token: "string.comment",
    },
    {
      foreground: "c8e1ff",
      token: "constant",
    },
    {
      foreground: "c8e1ff",
      token: "entity.name.constant",
    },
    {
      foreground: "c8e1ff",
      token: "variable.other.constant",
    },
    {
      foreground: "c8e1ff",
      token: "variable.language",
    },
    {
      foreground: "b392f0",
      token: "entity",
    },
    {
      foreground: "b392f0",
      token: "entity.name",
    },
    {
      foreground: "f6f8fa",
      token: "variable.parameter.function",
    },
    {
      foreground: "7bcc72",
      token: "entity.name.tag",
    },
    {
      foreground: themeColors.red,
      // foreground: "ea4a5a",
      token: "keyword",
    },
    {
      // foreground: "ea4a5a",
      foreground: themeColors.red,

      token: "storage",
    },
    {
      foreground: themeColors.red,
      // foreground: "ea4a5a",
      token: "storage.type",
    },
    {
      foreground: "f6f8fa",
      token: "storage.modifier.package",
    },
    {
      foreground: "f6f8fa",
      token: "storage.modifier.import",
    },
    {
      foreground: "f6f8fa",
      token: "storage.type.java",
    },
    {
      foreground: "79b8ff",
      token: "string",
    },
    {
      foreground: "79b8ff",
      token: "punctuation.definition.string",
    },
    {
      foreground: "79b8ff",
      token: "string punctuation.section.embedded source",
    },
    {
      foreground: "c8e1ff",
      token: "support",
    },
    {
      foreground: "c8e1ff",
      token: "meta.property-name",
    },
    {
      // foreground: "fb8532",
      foreground: themeColors.yellow,
      token: "variable",
    },
    {
      foreground: "f6f8fa",
      token: "variable.other",
    },
    {
      foreground: "d73a49",
      fontStyle: "bold italic underline",
      token: "invalid.broken",
    },
    {
      foreground: "d73a49",
      fontStyle: "bold italic underline",
      token: "invalid.deprecated",
    },
    {
      foreground: "fafbfc",
      background: "d73a49",
      fontStyle: "italic underline",
      token: "invalid.illegal",
    },
    {
      foreground: "fafbfc",
      background: "d73a49",
      fontStyle: "italic underline",
      token: "carriage-return",
    },
    {
      foreground: "d73a49",
      fontStyle: "bold italic underline",
      token: "invalid.unimplemented",
    },
    {
      foreground: "d73a49",
      token: "message.error",
    },
    {
      foreground: "f6f8fa",
      token: "string source",
    },
    {
      foreground: "c8e1ff",
      token: "string variable",
    },
    {
      foreground: "79b8ff",
      token: "source.regexp",
    },
    {
      foreground: "79b8ff",
      token: "string.regexp",
    },
    {
      foreground: "79b8ff",
      token: "string.regexp.character-class",
    },
    {
      foreground: "79b8ff",
      token: "string.regexp constant.character.escape",
    },
    {
      foreground: "79b8ff",
      token: "string.regexp source.ruby.embedded",
    },
    {
      foreground: "79b8ff",
      token: "string.regexp string.regexp.arbitrary-repitition",
    },
    {
      foreground: "7bcc72",
      fontStyle: "bold",
      token: "string.regexp constant.character.escape",
    },
    {
      foreground: "c8e1ff",
      token: "support.constant",
    },
    {
      foreground: "c8e1ff",
      token: "support.variable",
    },
    {
      foreground: "c8e1ff",
      token: "meta.module-reference",
    },
    {
      // foreground: "fb8532",
      foreground: themeColors.yellow,
      token: "markup.list",
    },
    {
      foreground: "0366d6",
      fontStyle: "bold",
      token: "markup.heading",
    },
    {
      foreground: "0366d6",
      fontStyle: "bold",
      token: "markup.heading entity.name",
    },
    {
      foreground: "c8e1ff",
      token: "markup.quote",
    },
    {
      foreground: "f6f8fa",
      fontStyle: "italic",
      token: "markup.italic",
    },
    {
      foreground: "f6f8fa",
      fontStyle: "bold",
      token: "markup.bold",
    },
    {
      foreground: "c8e1ff",
      token: "markup.raw",
    },
    {
      foreground: "b31d28",
      background: "ffeef0",
      token: "markup.deleted",
    },
    {
      foreground: "b31d28",
      background: "ffeef0",
      token: "meta.diff.header.from-file",
    },
    {
      foreground: "b31d28",
      background: "ffeef0",
      token: "punctuation.definition.deleted",
    },
    {
      foreground: "176f2c",
      background: "f0fff4",
      token: "markup.inserted",
    },
    {
      foreground: "176f2c",
      background: "f0fff4",
      token: "meta.diff.header.to-file",
    },
    {
      foreground: "176f2c",
      background: "f0fff4",
      token: "punctuation.definition.inserted",
    },
    {
      foreground: "b08800",
      background: "fffdef",
      token: "markup.changed",
    },
    {
      foreground: "b08800",
      background: "fffdef",
      token: "punctuation.definition.changed",
    },
    {
      foreground: "2f363d",
      background: "959da5",
      token: "markup.ignored",
    },
    {
      foreground: "2f363d",
      background: "959da5",
      token: "markup.untracked",
    },
    {
      foreground: "b392f0",
      fontStyle: "bold",
      token: "meta.diff.range",
    },
    {
      foreground: "c8e1ff",
      token: "meta.diff.header",
    },
    {
      foreground: "0366d6",
      fontStyle: "bold",
      token: "meta.separator",
    },
    {
      foreground: "0366d6",
      token: "meta.output",
    },
    {
      foreground: "ffeef0",
      token: "brackethighlighter.tag",
    },
    {
      foreground: "ffeef0",
      token: "brackethighlighter.curly",
    },
    {
      foreground: "ffeef0",
      token: "brackethighlighter.round",
    },
    {
      foreground: "ffeef0",
      token: "brackethighlighter.square",
    },
    {
      foreground: "ffeef0",
      token: "brackethighlighter.angle",
    },
    {
      foreground: "ffeef0",
      token: "brackethighlighter.quote",
    },
    {
      foreground: "d73a49",
      token: "brackethighlighter.unmatched",
    },
    {
      foreground: "d73a49",
      token: "sublimelinter.mark.error",
    },
    {
      // foreground: "fb8532",
      foreground: themeColors.yellow,
      token: "sublimelinter.mark.warning",
    },
    {
      foreground: "6a737d",
      token: "sublimelinter.gutter-mark",
    },
    {
      foreground: "79b8ff",
      fontStyle: "underline",
      token: "constant.other.reference.link",
    },
    {
      foreground: "79b8ff",
      fontStyle: "underline",
      token: "string.other.link",
    },
  ],
  colors: {
    "editor.foreground": tw.zinc[50],
    // "editor.foreground": "#f6f8fa",
    // "editor.background": "#24292e",
    "editor.background": tw.zinc[950],
    "editor.lineHighlightBackground": tw.zinc[900],
    "editor.selectionBackground": tw.zinc[900],
    // "editor.selectionBackground": "#4c2889",
    "editor.inactiveSelectionBackground": "#444d56",
    "editorCursor.foreground": tw.zinc[100],
    "editorWhitespace.foreground": tw.zinc[700],
    // "editorWhitespace.foreground": "#6a737d",

    // "editorIndentGuide.background": "#6a737d",
    // "editorIndentGuide.activeBackground": "#f6f8fa",
    "editorIndentGuide.background1": tw.zinc[800],
    "editorIndentGuide.activeBackground1": tw.zinc[700],
    "editor.selectionHighlightBorder": "#444d56",
    "editor.wordHighlightBackground": tw.zinc[800],
  },
};
