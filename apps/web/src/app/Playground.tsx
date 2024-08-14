"use client";
import {
  getNodesLength,
  getNodeTag,
  containerDeclRoot,
  AstfullContainerDecl,
  fullContainerDecl,
  getNodeTagLabel,
  fullFnProto,
  AstNodeTag,
  tokenizeLine,
  TokenTagMap,
  TokenTag,
  getNodeSource,
  tokenSlice,
  render,
  getMainToken,
  getNodeData,
  AstNodeIndex,
  getExtraDataSpan,
  fullVarDecl,
  getFirstToken,
  getTokenTag,
  getLastToken,
  getNodeExtraDataSubRange,
  getNodeExtraDataFnProtoOne,
  getNodeExtraDataFnProto,
  getTokenStart,
  assignDestructure,
  fullStructInit,
  fullArrayType,
  fullPtrType,
  TypePointerSize,
  fullArrayInit,
  fullCall,
  fullSlice,
  fullContainerField,
  tokenLocation,
  getTokenRange,
  getNodeRange,
  fullSwitchCase,
  whileFull,
  forFull,
  getTokensLength,
  AstfullWhile,
  ifFull,
  AstfullContainerField,
  asmFull,
  getNodeExtraDataAsm,
  fullAsm,
} from "@zig-devkit/lib";
import { Editor } from "./editor";
import memoize from "lodash-es/memoize";
import {
  experimental_useEffectEvent,
  PropsWithChildren,
  startTransition,
  useEffect,
  useInsertionEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import MonacoEditor, { useMonaco } from "@monaco-editor/react";
import { initVimMode } from "monaco-vim";
import { loader } from "@monaco-editor/react";
import { languages } from "monaco-editor/esm/vs/editor/editor.api";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { range } from "lodash-es";
import { ErrorBoundary } from "react-error-boundary";
// class State {
//   clone = () => new State();
//   equals = (other: languages.IState) => true;
// }
// export const TokenToScopeMap: Record<TokenTag, string> = {
//   [TokenTag.Invalid]: "invalid",
//   [TokenTag.InvalidPeriodasterisks]: "invalid",
//   [TokenTag.Identifier]: "variable",
//   [TokenTag.StringLiteral]: "string",
//   [TokenTag.MultilineStringLiteralLine]: "string",
//   [TokenTag.CharLiteral]: "string",
//   [TokenTag.Eof]: "invalid",
//   [TokenTag.Builtin]: "support.function",
//   [TokenTag.Bang]: "keyword.operator.logical",
//   [TokenTag.Pipe]: "keyword.operator.bitwise",
//   [TokenTag.PipePipe]: "keyword.operator.logical",
//   [TokenTag.PipeEqual]: "keyword.operator.assignment",
//   [TokenTag.Equal]: "keyword.operator.assignment",
//   [TokenTag.EqualEqual]: "keyword.operator.comparison",
//   [TokenTag.EqualAngleBracketRight]: "keyword.operator.assignment",
//   [TokenTag.BangEqual]: "keyword.operator.comparison",
//   [TokenTag.LParen]: "punctuation.section.parens.begin",
//   [TokenTag.RParen]: "punctuation.section.parens.end",
//   [TokenTag.Semicolon]: "punctuation.terminator",
//   [TokenTag.Percent]: "keyword.operator.arithmetic",
//   [TokenTag.PercentEqual]: "keyword.operator.assignment",
//   [TokenTag.LBrace]: "punctuation.section.braces.begin",
//   [TokenTag.RBrace]: "punctuation.section.braces.end",
//   [TokenTag.LBracket]: "punctuation.section.brackets.begin",
//   [TokenTag.RBracket]: "punctuation.section.brackets.end",
//   [TokenTag.Period]: "punctuation.accessor",
//   [TokenTag.PeriodAsterisk]: "punctuation.accessor",
//   [TokenTag.Ellipsis2]: "punctuation.definition.range",
//   [TokenTag.Ellipsis3]: "punctuation.definition.range",
//   [TokenTag.Caret]: "keyword.operator.bitwise",
//   [TokenTag.CaretEqual]: "keyword.operator.assignment",
//   [TokenTag.Plus]: "keyword.operator.arithmetic",
//   [TokenTag.PlusPlus]: "keyword.operator.increment",
//   [TokenTag.PlusEqual]: "keyword.operator.assignment",
//   [TokenTag.PlusPercent]: "keyword.operator.arithmetic",
//   [TokenTag.PlusPercentEqual]: "keyword.operator.assignment",
//   [TokenTag.PlusPipe]: "keyword.operator.bitwise",
//   [TokenTag.PlusPipeEqual]: "keyword.operator.assignment",
//   [TokenTag.Minus]: "keyword.operator.arithmetic",
//   [TokenTag.MinusEqual]: "keyword.operator.assignment",
//   [TokenTag.MinusPercent]: "keyword.operator.arithmetic",
//   [TokenTag.MinusPercentEqual]: "keyword.operator.assignment",
//   [TokenTag.MinusPipe]: "keyword.operator.bitwise",
//   [TokenTag.MinusPipeEqual]: "keyword.operator.assignment",
//   [TokenTag.Asterisk]: "keyword.operator.arithmetic",
//   [TokenTag.AsteriskEqual]: "keyword.operator.assignment",
//   [TokenTag.AsteriskAsterisk]: "keyword.operator.exponent",
//   [TokenTag.AsteriskPercent]: "keyword.operator.arithmetic",
//   [TokenTag.AsteriskPercentEqual]: "keyword.operator.assignment",
//   [TokenTag.AsteriskPipe]: "keyword.operator.bitwise",
//   [TokenTag.AsteriskPipeEqual]: "keyword.operator.assignment",
//   [TokenTag.Arrow]: "keyword.operator.arrow",
//   [TokenTag.Colon]: "punctuation.separator.key-value",
//   [TokenTag.Slash]: "keyword.operator.arithmetic",
//   [TokenTag.SlashEqual]: "keyword.operator.assignment",
//   [TokenTag.Comma]: "punctuation.separator",
//   [TokenTag.Ampersand]: "keyword.operator.bitwise",
//   [TokenTag.AmpersandEqual]: "keyword.operator.assignment",
//   [TokenTag.QuestionMark]: "punctuation.definition.ternary",
//   [TokenTag.AngleBracketLeft]: "keyword.operator.comparison",
//   [TokenTag.AngleBracketLeftEqual]: "keyword.operator.comparison",
//   [TokenTag.AngleBracketAngleBracketLeft]: "keyword.operator.shift",
//   [TokenTag.AngleBracketAngleBracketLeftEqual]: "keyword.operator.assignment",
//   [TokenTag.AngleBracketAngleBracketLeftPipe]: "keyword.operator.bitwise",
//   [TokenTag.AngleBracketAngleBracketLeftPipeEqual]:
//     "keyword.operator.assignment",
//   [TokenTag.AngleBracketRight]: "keyword.operator.comparison",
//   [TokenTag.AngleBracketRightEqual]: "keyword.operator.comparison",
//   [TokenTag.AngleBracketAngleBracketRight]: "keyword.operator.shift",
//   [TokenTag.AngleBracketAngleBracketRightEqual]: "keyword.operator.assignment",
//   [TokenTag.Tilde]: "keyword.operator.bitwise",
//   [TokenTag.NumberLiteral]: "constant.numeric",
//   [TokenTag.DocComment]: "comment.documentation",
//   [TokenTag.ContainerDocComment]: "comment.documentation",
//   [TokenTag.KeywordAddrspace]: "keyword",
//   [TokenTag.KeywordAlign]: "keyword",
//   [TokenTag.KeywordAllowzero]: "keyword",
//   [TokenTag.KeywordAnd]: "keyword.operator.logical",
//   [TokenTag.KeywordAnyframe]: "keyword",
//   [TokenTag.KeywordAnytype]: "keyword",
//   [TokenTag.KeywordAsm]: "keyword",
//   [TokenTag.KeywordAsync]: "keyword",
//   [TokenTag.KeywordAwait]: "keyword",
//   [TokenTag.KeywordBreak]: "keyword.control",
//   [TokenTag.KeywordCallconv]: "keyword",
//   [TokenTag.KeywordCatch]: "keyword.control",
//   [TokenTag.KeywordComptime]: "keyword",
//   [TokenTag.KeywordConst]: "storage.modifier",
//   [TokenTag.KeywordContinue]: "keyword.control",
//   [TokenTag.KeywordDefer]: "keyword.control",
//   [TokenTag.KeywordElse]: "keyword.control",
//   [TokenTag.KeywordEnum]: "keyword",
//   [TokenTag.KeywordErrdefer]: "keyword.control",
//   [TokenTag.KeywordError]: "keyword",
//   [TokenTag.KeywordExport]: "storage.modifier",
//   [TokenTag.KeywordExtern]: "storage.modifier",
//   [TokenTag.KeywordFn]: "keyword",
//   [TokenTag.KeywordFor]: "keyword.control",
//   [TokenTag.KeywordIf]: "keyword.control",
//   [TokenTag.KeywordInline]: "keyword",
//   [TokenTag.KeywordNoalias]: "keyword",
//   [TokenTag.KeywordNoinline]: "keyword",
//   [TokenTag.KeywordNosuspend]: "keyword",
//   [TokenTag.KeywordOpaque]: "keyword",
//   [TokenTag.KeywordOr]: "keyword.operator.logical",
//   [TokenTag.KeywordOrelse]: "keyword.control",
//   [TokenTag.KeywordPacked]: "keyword",
//   [TokenTag.KeywordPub]: "storage.modifier",
//   [TokenTag.KeywordResume]: "keyword.control",
//   [TokenTag.KeywordReturn]: "keyword.control",
//   [TokenTag.KeywordLinksection]: "keyword",
//   [TokenTag.KeywordStruct]: "keyword",
//   [TokenTag.KeywordSuspend]: "keyword.control",
//   [TokenTag.KeywordSwitch]: "keyword.control",
//   [TokenTag.KeywordTest]: "keyword",
//   [TokenTag.KeywordThreadlocal]: "keyword",
//   [TokenTag.KeywordTry]: "keyword.control",
//   [TokenTag.KeywordUnion]: "keyword",
//   [TokenTag.KeywordUnreachable]: "keyword.control",
//   [TokenTag.KeywordUsingnamespace]: "keyword",
//   [TokenTag.KeywordVar]: "storage.type",
//   [TokenTag.KeywordVolatile]: "keyword",
//   [TokenTag.KeywordWhile]: "keyword.control",
// };
// import * as monaco from "monaco-editor";
//
// monaco.languages.register({ id: "zig" });
// monaco.languages.setTokensProvider("zig", {
//   getInitialState: () => {
//     return new State();
//   },
//   tokenize(line, state) {
//     const tokens = tokenizeLine(line).map((token) => ({
//       startIndex: token.start,
//       scopes: TokenToScopeMap[token.tag],
//     }));
//     return {
//       tokens,
//       endState: state.clone(),
//     };
//   },
// });
//
// const Editor = () => {
//   const ref = useRef<HTMLDivElement>(null);
//   const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
//
//   const statusBarRef = useRef<HTMLDivElement>(null);
//   const { source, setSource, getAst, ast, active, setActive, hovered } =
//     useAst();
//
//   const save = useEffectEvent(() => {
//     startTransition(() => {
//       const rendered = render(ast);
//       const editor = editorRef.current;
//       if (!editor) return;
//       if (!rendered || rendered === source) return;
//       const model = editor.getModel();
//       if (!model) return;
//       model.pushEditOperations(
//         [],
//         [
//           {
//             range: model.getFullModelRange(),
//             text: rendered,
//           },
//         ],
//         () => null,
//       );
//     });
//   });
//   useLayoutEffect(() => {
//     if (!ref.current) return;
//     if (editorRef.current) return;
//
//     const editor = monaco.editor.create(ref.current, {
//       value: source,
//       language: "zig",
//       automaticLayout: true,
//       minimap: { enabled: false },
//       wordWrap: "on",
//       scrollBeyondLastLine: false,
//       tabSize: 4,
//       theme: "vs-dark",
//       fontSize: 16,
//     });
//
//     const vim = initVimMode(editor, statusBarRef.current);
//
//     editor.addAction({
//       id: "format-on-save",
//       label: "Format on Save",
//
//       keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
//       contextMenuGroupId: "navigation",
//       contextMenuOrder: 1.5,
//
//       run: function() {
//         save();
//       },
//     });
//     editor.getModel()?.onDidChangeContent(() => {
//       startTransition(() => {
//         setSource(editor.getValue());
//       });
//     });
//     editorRef.current = editor;
//     return () => {
//       editor.dispose();
//       vim.dispose();
//       editorRef.current = null;
//     };
//   }, []);
//
//   const highlight = useEffectEvent(
//     (
//       active: ActiveEntity,
//       decorationOptions: monaco.editor.IModelDecorationOptions,
//     ) => {
//       const editor = editorRef.current;
//       if (!editor) return;
//
//       if (!active) return;
//       const location =
//         active.kind === "token"
//           ? getTokenRange(ast, active.id)
//           : active.kind === "node"
//             ? getNodeRange(ast, active.id)
//             : null;
//
//       if (!location) return;
//
//       const range = new monaco.Range(
//         location.start_line + 1,
//         location.start_column + 1,
//         location.end_line + 1,
//         location.end_column + 1,
//       );
//
//       const decorations = editor.createDecorationsCollection([
//         // {
//         //   range: new monaco.Range(3, 1, 5, 1),
//         //   options: {
//         //     isWholeLine: true,
//         //     linesDecorationsClassName: "myLineDecoration",
//         //   },
//         // },
//         {
//           range,
//           options: decorationOptions,
//           // options: {
//           //
//           //   beforeContentClassName: "border-l border-1 border-yellow-500",
//           //   afterContentClassName: "border-r border-1 border-yellow-500",
//           //   inlineClassName: "bg-yellow-500 bg-opacity-20",
//           //   // inlineClassName: "editor-active",
//           //   // inlineClassName:
//           //   //   "outline outline-2 outline-yellow-500 bg-opacity-20 outline-offset-2 inline-block rounded-sm",
//           // },
//         },
//       ]);
//       // console.log(decorations);
//       return decorations;
//     },
//   );
//   useEffect(() => {
//     if (!active) return;
//     const decorations = highlight(active, {
//       // -5px 0px 0px 0px black
//       beforeContentClassName: "active-left shadow-yellow-500",
//       // beforeContentClassName: "border-l border-1 border-yellow-500",
//       afterContentClassName: "active-right shadow-yellow-500",
//       // inlineClassName: "bg-yellow-500 bg-opacity-20 brightness-125",
//       inlineClassName: "bg-yellow-500 bg-opacity-20 brightness-125",
//     });
//     return () => {
//       decorations?.clear();
//     };
//   }, [active]);
//   useEffect(() => {
//     if (!hovered) return;
//     if (active && active.id === hovered.id && active.kind === hovered.kind)
//       return;
//     const decorations = highlight(hovered, {
//       // beforeContentClassName: "border-l border-1 border-yellow-500",
//       // afterContentClassName: "border-r border-1 border-yellow-500",
//       inlineClassName: "bg-cyan-500 bg-opacity-20 brightness-125 ",
//     });
//     return () => {
//       decorations?.clear();
//     };
//   }, [hovered, active]);
//   return (
//     <div className="flex flex-col h-full shadow-[-2px_0_0_0_theme(colors.yellow)]">
//       <div ref={ref} className="h-full grow shadow-[-2px_0_0_0]" />
//       <div ref={statusBarRef} className="h-4" />
//     </div>
//   );
// };
export const defaultSource = `fn main() void {
    const x: i32 = 2;
    const y: i32 = 2;
    const z: i32 = x + y;
}
`;
import { CaretDownIcon } from "@radix-ui/react-icons";
import {
  useAst,
  ActiveEntity,
  AstProvider,
  isSameActiveEntity,
} from "./AstProvider";
import { useEffectEvent } from "./useEffectEvent";

const NodeDisplay = ({
  node,
  children,
}: PropsWithChildren<{ node: number }>) => {
  const { ast, active, setActive } = useAst();
  return (
    <div className="flex flex-col">
      <header
        className="py-1 px-1 flex items-center gap-2  text-xs"
        onClick={(e) => {
          e.stopPropagation();
          if (active && active.id === node) {
            setActive(null);
          }
          setActive({ kind: "node", id: node });
        }}
      >
        <button>
          <CaretDownIcon className="w-4 h-4" />
        </button>

        <div className="flex gap-2 items-center">
          <span>.{getNodeTagLabel(ast, node)}</span>
          <span className="text-xs opacity-50 border p-1 px-2 rounded-sm">
            Node #{node}
          </span>
        </div>
      </header>

      <div className="ml-3  border-l">{children}</div>
    </div>
  );
};
const StructInitBody = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const mainToken = getMainToken(ast, node);
  const data = getNodeData(ast, node);
  const structInit = fullStructInit(ast, node);
  const el: JSX.Element[] = [];
  // fn renderStructInit(
  //     r: *Render,
  //     struct_node: Ast.Node.Index,
  //     struct_init: Ast.full.StructInit,
  //     space: Space,
  // ) Error!void {
  //     const tree = r.tree;
  //     const ais = r.ais;
  //     const token_tags = tree.tokens.items(.tag);
  //     if (struct_init.ast.type_expr == 0) {
  //         try renderToken(r, struct_init.ast.lbrace - 1, .none); // .
  //     } else {
  //         try renderExpression(r, struct_init.ast.type_expr, .none); // T
  //     }
  if (structInit.ast.type_expr === 0) {
    el.push(<TokenDisplay token={structInit.ast.lbrace - 1} />);
  } else {
    el.push(<Expression node={structInit.ast.type_expr} />);
  }
  //     if (struct_init.ast.fields.len == 0) {
  //         ais.pushIndentNextLine();
  //         try renderToken(r, struct_init.ast.lbrace, .none); // lbrace
  //         ais.popIndent();
  //         return renderToken(r, struct_init.ast.lbrace + 1, space); // rbrace
  //     }
  if (structInit.ast.fields.length === 0) {
    el.push(<TokenDisplay token={structInit.ast.lbrace} />);
    el.push(<TokenDisplay token={structInit.ast.lbrace + 1} />);
  }
  //     const rbrace = tree.lastToken(struct_node);
  //     const trailing_comma = token_tags[rbrace - 1] == .comma;
  const rbrace = getLastToken(ast, node);
  //     if (trailing_comma or hasComment(tree, struct_init.ast.lbrace, rbrace)) {
  //         // Render one field init per line.
  //         ais.pushIndentNextLine();
  //         try renderToken(r, struct_init.ast.lbrace, .newline);
  //
  //         try renderToken(r, struct_init.ast.lbrace + 1, .none); // .
  //         try renderIdentifier(r, struct_init.ast.lbrace + 2, .space, .eagerly_unquote); // name
  //         // Don't output a space after the = if expression is a multiline string,
  //         // since then it will start on the next line.
  //         const nodes = tree.nodes.items(.tag);
  //         const field_node = struct_init.ast.fields[0];
  //         const expr = nodes[field_node];
  //         var space_after_equal: Space = if (expr == .multiline_string_literal) .none else .space;
  //         try renderToken(r, struct_init.ast.lbrace + 3, space_after_equal); // =
  //         try renderExpressionFixup(r, field_node, .comma);
  //
  //         for (struct_init.ast.fields[1..]) |field_init| {
  //             const init_token = tree.firstToken(field_init);
  //             try renderExtraNewlineToken(r, init_token - 3);
  //             try renderToken(r, init_token - 3, .none); // .
  //             try renderIdentifier(r, init_token - 2, .space, .eagerly_unquote); // name
  //             space_after_equal = if (nodes[field_init] == .multiline_string_literal) .none else .space;
  //             try renderToken(r, init_token - 1, space_after_equal); // =
  //             try renderExpressionFixup(r, field_init, .comma);
  //         }
  //
  //         ais.popIndent();
  //     } else {
  //         // Render all on one line, no trailing comma.
  //         try renderToken(r, struct_init.ast.lbrace, .space);
  //
  //
  //         for (struct_init.ast.fields) |field_init| {
  //             const init_token = tree.firstToken(field_init);
  //             try renderToken(r, init_token - 3, .none); // .
  //             try renderIdentifier(r, init_token - 2, .space, .eagerly_unquote); // name
  //             try renderToken(r, init_token - 1, .space); // =
  //             try renderExpressionFixup(r, field_init, .comma_space);
  //         }
  //     }
  el.push(<TokenDisplay token={structInit.ast.lbrace} />);
  for (const fieldInit of structInit.ast.fields) {
    const initToken = getFirstToken(ast, fieldInit);
    el.push(<TokenDisplay token={initToken - 3} />);
    el.push(<TokenDisplay token={initToken - 2} />);
    el.push(<TokenDisplay token={initToken - 1} />);
    el.push(<Expression node={fieldInit} />);
  }

  const trailingComma = getTokenTag(ast, rbrace - 1) === TokenTag.Comma;
  if (trailingComma) {
    el.push(<TokenDisplay token={rbrace - 1} />);
  }

  el.push(<TokenDisplay token={rbrace} />);

  return el;
};

const StructInit = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  return (
    <NodeDisplay node={node}>
      <ErrorBoundary fallbackRender={({ error }) => <pre>{error.message}</pre>}>
        <StructInitBody node={node} />
      </ErrorBoundary>
    </NodeDisplay>
  );
};

const ArrayTypeBody = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const mainToken = getMainToken(ast, node);
  const arrayType = fullArrayType(ast, node);
  // const tree = r.tree;
  // const ais = r.ais;
  // const rbracket = tree.firstToken(array_type.ast.elem_type) - 1;
  // const one_line = tree.tokensOnSameLine(array_type.ast.lbracket, rbracket);
  // const inner_space = if (one_line) Space.none else Space.newline;
  // ais.pushIndentNextLine();
  // try renderToken(r, array_type.ast.lbracket, inner_space); // lbracket
  // try renderExpression(r, array_type.ast.elem_count, inner_space);
  // if (array_type.ast.sentinel != 0) {
  //     try renderToken(r, tree.firstToken(array_type.ast.sentinel) - 1, inner_space); // colon
  //     try renderExpression(r, array_type.ast.sentinel, inner_space);
  // }
  // ais.popIndent();
  // try renderToken(r, rbracket, .none); // rbracket
  // return renderExpression(r, array_type.ast.elem_type, space);

  const rbracket = getFirstToken(ast, arrayType.ast.elem_type) - 1;
  const el: JSX.Element[] = [];
  el.push(<TokenDisplay token={arrayType.ast.lbracket} />);
  el.push(<Expression node={arrayType.ast.elem_count} />);
  if (arrayType.ast.sentinel !== 0) {
    el.push(
      <TokenDisplay token={getFirstToken(ast, arrayType.ast.sentinel) - 1} />,
    );
    el.push(<Expression node={arrayType.ast.sentinel} />);
  }
  el.push(<TokenDisplay token={rbracket} />);
  el.push(<Expression node={arrayType.ast.elem_type} />);

  return el;
};

const ArrayType = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  return (
    <NodeDisplay node={node}>
      <ErrorBoundary fallbackRender={({ error }) => <pre>{error.message}</pre>}>
        <ArrayTypeBody node={node} />
      </ErrorBoundary>
    </NodeDisplay>
  );
};

const PtrTypeBody = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const ptrType = fullPtrType(ast, node);
  const mainToken = getMainToken(ast, node);
  const el: JSX.Element[] = [];
  switch (ptrType.size) {
    //   const tree = r.tree;
    // switch (ptr_type.size) {
    //     .One => {
    //         // Since ** tokens exist and the same token is shared by two
    //         // nested pointer types, we check to see if we are the parent
    //         // in such a relationship. If so, skip rendering anything for
    //         // this pointer type and rely on the child to render our asterisk
    //         // as well when it renders the ** token.
    //         if (tree.tokens.items(.tag)[ptr_type.ast.main_token] == .asterisk_asterisk and
    //             ptr_type.ast.main_token == tree.nodes.items(.main_token)[ptr_type.ast.child_type])
    //         {
    //             return renderExpression(r, ptr_type.ast.child_type, space);
    //         }
    //         try renderToken(r, ptr_type.ast.main_token, .none); // asterisk
    //     },
    case TypePointerSize.One: {
      if (
        getTokenTag(ast, ptrType.ast.main_token) ===
          TokenTag.AsteriskAsterisk &&
        ptrType.ast.main_token === getMainToken(ast, ptrType.ast.child_type)
      ) {
        return <Expression node={ptrType.ast.child_type} />;
      }

      el.push(<TokenDisplay token={ptrType.ast.main_token} />);
    }
    //     .Many => {
    //         if (ptr_type.ast.sentinel == 0) {
    //             try renderToken(r, ptr_type.ast.main_token, .none); // lbracket
    //             try renderToken(r, ptr_type.ast.main_token + 1, .none); // asterisk
    //             try renderToken(r, ptr_type.ast.main_token + 2, .none); // rbracket
    //         } else {
    //             try renderToken(r, ptr_type.ast.main_token, .none); // lbracket
    //             try renderToken(r, ptr_type.ast.main_token + 1, .none); // asterisk
    //             try renderToken(r, ptr_type.ast.main_token + 2, .none); // colon
    //             try renderExpression(r, ptr_type.ast.sentinel, .none);
    //             try renderToken(r, tree.lastToken(ptr_type.ast.sentinel) + 1, .none); // rbracket
    //         }
    //     },
    case TypePointerSize.Many: {
      el.push(<TokenDisplay token={ptrType.ast.main_token} />);
      el.push(<TokenDisplay token={ptrType.ast.main_token + 1} />);
      el.push(<TokenDisplay token={ptrType.ast.main_token + 2} />);
      if (ptrType.ast.sentinel === 0) {
        el.push(<Expression node={ptrType.ast.sentinel} />);
        el.push(
          <TokenDisplay token={getLastToken(ast, ptrType.ast.sentinel) + 1} />,
        );
      }
    }
    //     .C => {
    //         try renderToken(r, ptr_type.ast.main_token, .none); // lbracket
    //         try renderToken(r, ptr_type.ast.main_token + 1, .none); // asterisk
    //         try renderToken(r, ptr_type.ast.main_token + 2, .none); // c
    //         try renderToken(r, ptr_type.ast.main_token + 3, .none); // rbracket
    //     },
    case TypePointerSize.C: {
      el.push(<TokenDisplay token={ptrType.ast.main_token} />);
      el.push(<TokenDisplay token={ptrType.ast.main_token + 1} />);
      el.push(<TokenDisplay token={ptrType.ast.main_token + 2} />);
      el.push(<TokenDisplay token={ptrType.ast.main_token + 3} />);
    }
    //     .Slice => {
    //         if (ptr_type.ast.sentinel == 0) {
    //             try renderToken(r, ptr_type.ast.main_token, .none); // lbracket
    //             try renderToken(r, ptr_type.ast.main_token + 1, .none); // rbracket
    //         } else {
    //             try renderToken(r, ptr_type.ast.main_token, .none); // lbracket
    //             try renderToken(r, ptr_type.ast.main_token + 1, .none); // colon
    //             try renderExpression(r, ptr_type.ast.sentinel, .none);
    //             try renderToken(r, tree.lastToken(ptr_type.ast.sentinel) + 1, .none); // rbracket
    //         }
    //     },
    case TypePointerSize.Slice: {
      el.push(<TokenDisplay token={ptrType.ast.main_token} />);
      el.push(<TokenDisplay token={ptrType.ast.main_token + 1} />);
      if (ptrType.ast.sentinel === 0) {
        el.push(<Expression node={ptrType.ast.sentinel} />);
        el.push(
          <TokenDisplay token={getLastToken(ast, ptrType.ast.sentinel) + 1} />,
        );
      }
    }
    // }
  }

  // if (ptr_type.allowzero_token) |allowzero_token| {
  //     try renderToken(r, allowzero_token, .space);
  // }
  if (ptrType.allowzero_token) {
    el.push(<TokenDisplay token={ptrType.allowzero_token} />);
  }
  // if (ptr_type.ast.align_node != 0) {
  //     const align_first = tree.firstToken(ptr_type.ast.align_node);
  //     try renderToken(r, align_first - 2, .none); // align
  //     try renderToken(r, align_first - 1, .none); // lparen
  //     try renderExpression(r, ptr_type.ast.align_node, .none);
  //     if (ptr_type.ast.bit_range_start != 0) {
  //         assert(ptr_type.ast.bit_range_end != 0);
  //         try renderToken(r, tree.firstToken(ptr_type.ast.bit_range_start) - 1, .none); // colon
  //         try renderExpression(r, ptr_type.ast.bit_range_start, .none);
  //         try renderToken(r, tree.firstToken(ptr_type.ast.bit_range_end) - 1, .none); // colon
  //         try renderExpression(r, ptr_type.ast.bit_range_end, .none);
  //         try renderToken(r, tree.lastToken(ptr_type.ast.bit_range_end) + 1, .space); // rparen
  //     } else {
  //         try renderToken(r, tree.lastToken(ptr_type.ast.align_node) + 1, .space); // rparen
  //     }
  // }
  if (ptrType.ast.align_node !== 0) {
    const alignFirst = getFirstToken(ast, ptrType.ast.align_node);
    el.push(<TokenDisplay token={alignFirst - 2} />);
    el.push(<TokenDisplay token={alignFirst - 1} />);
    el.push(<Expression node={ptrType.ast.align_node} />);
    if (ptrType.ast.bit_range_start !== 0) {
      el.push(
        <TokenDisplay
          token={getFirstToken(ast, ptrType.ast.bit_range_start) - 1}
        />,
      );
      el.push(<Expression node={ptrType.ast.bit_range_start} />);
      el.push(
        <TokenDisplay
          token={getFirstToken(ast, ptrType.ast.bit_range_end) - 1}
        />,
      );
      el.push(<Expression node={ptrType.ast.bit_range_end} />);
      el.push(
        <TokenDisplay
          token={getLastToken(ast, ptrType.ast.bit_range_end) + 1}
        />,
      );
    } else {
      el.push(
        <TokenDisplay token={getLastToken(ast, ptrType.ast.align_node) + 1} />,
      );
    }
  }
  // if (ptr_type.ast.addrspace_node != 0) {
  //     const addrspace_first = tree.firstToken(ptr_type.ast.addrspace_node);
  //     try renderToken(r, addrspace_first - 2, .none); // addrspace
  //     try renderToken(r, addrspace_first - 1, .none); // lparen
  //     try renderExpression(r, ptr_type.ast.addrspace_node, .none);
  //     try renderToken(r, tree.lastToken(ptr_type.ast.addrspace_node) + 1, .space); // rparen
  // }
  if (ptrType.ast.addrspace_node !== 0) {
    const addrspaceFirst = getFirstToken(ast, ptrType.ast.addrspace_node);
    el.push(<TokenDisplay token={addrspaceFirst - 2} />);
    el.push(<TokenDisplay token={addrspaceFirst - 1} />);
    el.push(<Expression node={ptrType.ast.addrspace_node} />);
    el.push(
      <TokenDisplay
        token={getLastToken(ast, ptrType.ast.addrspace_node) + 1}
      />,
    );
  }
  // if (ptr_type.const_token) |const_token| {
  //     try renderToken(r, const_token, .space);
  // }
  if (ptrType.const_token) {
    el.push(<TokenDisplay token={ptrType.const_token} />);
  }
  // if (ptr_type.volatile_token) |volatile_token| {
  //     try renderToken(r, volatile_token, .space);
  // }
  if (ptrType.volatile_token) {
    el.push(<TokenDisplay token={ptrType.volatile_token} />);
  }
  // try renderExpression(r, ptr_type.ast.child_type, space);
  el.push(<Expression node={ptrType.ast.child_type} />);
  //
  return el;
};

const PtrType = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  return (
    <NodeDisplay node={node}>
      <ErrorBoundary fallbackRender={({ error }) => <pre>{error.message}</pre>}>
        <PtrTypeBody node={node} />
      </ErrorBoundary>
    </NodeDisplay>
  );
};

// fn anythingBetween(tree: Ast, start_token: Ast.TokenIndex, end_token: Ast.TokenIndex) bool {
//     if (start_token + 1 != end_token) return true;
//     const token_starts = tree.tokens.items(.start);
//     const between_source = tree.source[token_starts[start_token]..token_starts[start_token + 1]];
//     for (between_source) |byte| switch (byte) {
//         '/' => return true,
//         else => continue,
//     };
//     return false;
// }
// fn hasMultilineString(tree: Ast, start_token: Ast.TokenIndex, end_token: Ast.TokenIndex) bool {
//     const token_tags = tree.tokens.items(.tag);
//
//     for (token_tags[start_token..end_token]) |tag| {
//         switch (tag) {
//             .multiline_string_literal_line => return true,
//             else => continue,
//         }
//     }
//
//     return false;
// }
const hasMultilineString = (
  ast: number,
  startToken: number,
  endToken: number,
) => {
  for (let i = startToken; i < endToken; i++) {
    if (getTokenTag(ast, i) === TokenTag.MultilineStringLiteralLine) {
      return true;
    }
  }
  return false;
};
const anythingBetween = (ast: number, startToken: number, endToken: number) => {
  if (startToken + 1 !== endToken) return true;
  // TODO: implement
  return false;
};
const ArrayInitBody = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const mainToken = getMainToken(ast, node);
  const arrayInit = fullArrayInit(ast, node);
  const el: JSX.Element[] = [];
  // const tree = r.tree;
  // const ais = r.ais;
  // const gpa = r.gpa;
  // const token_tags = tree.tokens.items(.tag);
  //
  // if (array_init.ast.type_expr == 0) {
  //     try renderToken(r, array_init.ast.lbrace - 1, .none); // .
  // } else {
  //     try renderExpression(r, array_init.ast.type_expr, .none); // T
  // }
  if (arrayInit.ast.type_expr === 0) {
    el.push(<TokenDisplay token={arrayInit.ast.lbrace - 1} />);
  } else {
    el.push(<Expression node={arrayInit.ast.type_expr} />);
  }
  // if (array_init.ast.elements.len == 0) {
  //     ais.pushIndentNextLine();
  //     try renderToken(r, array_init.ast.lbrace, .none); // lbrace
  //     ais.popIndent();
  //     return renderToken(r, array_init.ast.lbrace + 1, space); // rbrace
  // }
  if (arrayInit.ast.elements.length === 0) {
    el.push(<TokenDisplay token={arrayInit.ast.lbrace} />);
    el.push(<TokenDisplay token={arrayInit.ast.lbrace + 1} />);
    return el;
  }
  // const last_elem = array_init.ast.elements[array_init.ast.elements.len - 1];
  // const last_elem_token = tree.lastToken(last_elem);
  // const trailing_comma = token_tags[last_elem_token + 1] == .comma;
  // const rbrace = if (trailing_comma) last_elem_token + 2 else last_elem_token + 1;
  // assert(token_tags[rbrace] == .r_brace);
  const lastElem = arrayInit.ast.elements[arrayInit.ast.elements.length - 1];
  const lastElemToken = getLastToken(ast, lastElem);
  const trailingComma = getTokenTag(ast, lastElemToken + 1) === TokenTag.Comma;
  const rbrace = trailingComma ? lastElemToken + 2 : lastElemToken + 1;

  // if (array_init.ast.elements.len == 1) {
  //     const only_elem = array_init.ast.elements[0];
  //     const first_token = tree.firstToken(only_elem);
  //     if (token_tags[first_token] != .multiline_string_literal_line and
  //         !anythingBetween(tree, last_elem_token, rbrace))
  //     {
  //         try renderToken(r, array_init.ast.lbrace, .none);
  //         try renderExpression(r, only_elem, .none);
  //         return renderToken(r, rbrace, space);
  //     }
  // }
  if (arrayInit.ast.elements.length === 1) {
    const onlyElem = arrayInit.ast.elements[0];
    const firstToken = getFirstToken(ast, onlyElem);
    if (
      getTokenTag(ast, firstToken) !== TokenTag.MultilineStringLiteralLine &&
      !anythingBetween(ast, lastElemToken, rbrace)
    ) {
      el.push(<TokenDisplay token={arrayInit.ast.lbrace} />);
      el.push(<Expression node={onlyElem} />);
      el.push(<TokenDisplay token={rbrace} />);
      return el;
    }
  }
  // const contains_comment = hasComment(tree, array_init.ast.lbrace, rbrace);
  // const contains_multiline_string = hasMultilineString(tree, array_init.ast.lbrace, rbrace);
  // const containsMultiLineString = hasMultilineString(ast, arrayInit.ast.lbrace, rbrace);
  // if (!trailing_comma and !contains_comment and !contains_multiline_string) {
  //     // Render all on one line, no trailing comma.
  //     if (array_init.ast.elements.len == 1) {
  //         // If there is only one element, we don't use spaces
  //         try renderToken(r, array_init.ast.lbrace, .none);
  //         try renderExpression(r, array_init.ast.elements[0], .none);
  //     } else {
  //         try renderToken(r, array_init.ast.lbrace, .space);
  //         for (array_init.ast.elements) |elem| {
  //             try renderExpression(r, elem, .comma_space);
  //         }
  //     }
  //     return renderToken(r, last_elem_token + 1, space); // rbrace
  // }
  //TODO should check for multilinestring?
  // if (arrayInit.ast.elements.length === 1) {
  //   el.push(<TokenDisplay token={arrayInit.ast.lbrace} />);
  //   el.push(<Expression node={arrayInit.ast.elements[0]} />);
  // }  else {
  el.push(<TokenDisplay token={arrayInit.ast.lbrace} />);
  for (const elem of arrayInit.ast.elements) {
    el.push(<Expression node={elem} />);
    //TODO: add commas
  }

  // }
  return el;
  // ais.pushIndentNextLine();
  // try renderToken(r, array_init.ast.lbrace, .newline);
  //
  // var expr_index: usize = 0;
  // while (true) {
  //     const row_size = rowSize(tree, array_init.ast.elements[expr_index..], rbrace);
  //     const row_exprs = array_init.ast.elements[expr_index..];
  //     // A place to store the width of each expression and its column's maximum
  //     const widths = try gpa.alloc(usize, row_exprs.len + row_size);
  //     defer gpa.free(widths);
  //     @memset(widths, 0);
  //
  //     const expr_newlines = try gpa.alloc(bool, row_exprs.len);
  //     defer gpa.free(expr_newlines);
  //     @memset(expr_newlines, false);
  //
  //     const expr_widths = widths[0..row_exprs.len];
  //     const column_widths = widths[row_exprs.len..];
  //
  //     // Find next row with trailing comment (if any) to end the current section.
  //     const section_end = sec_end: {
  //         var this_line_first_expr: usize = 0;
  //         var this_line_size = rowSize(tree, row_exprs, rbrace);
  //         for (row_exprs, 0..) |expr, i| {
  //             // Ignore comment on first line of this section.
  //             if (i == 0) continue;
  //             const expr_last_token = tree.lastToken(expr);
  //             if (tree.tokensOnSameLine(tree.firstToken(row_exprs[0]), expr_last_token))
  //                 continue;
  //             // Track start of line containing comment.
  //             if (!tree.tokensOnSameLine(tree.firstToken(row_exprs[this_line_first_expr]), expr_last_token)) {
  //                 this_line_first_expr = i;
  //                 this_line_size = rowSize(tree, row_exprs[this_line_first_expr..], rbrace);
  //             }
  //
  //             const maybe_comma = expr_last_token + 1;
  //             if (token_tags[maybe_comma] == .comma) {
  //                 if (hasSameLineComment(tree, maybe_comma))
  //                     break :sec_end i - this_line_size + 1;
  //             }
  //         }
  //         break :sec_end row_exprs.len;
  //     };
  //     expr_index += section_end;
  //
  //     const section_exprs = row_exprs[0..section_end];
  //
  //     var sub_expr_buffer = std.ArrayList(u8).init(gpa);
  //     defer sub_expr_buffer.deinit();
  //
  //     const sub_expr_buffer_starts = try gpa.alloc(usize, section_exprs.len + 1);
  //     defer gpa.free(sub_expr_buffer_starts);
  //
  //     var auto_indenting_stream = Ais{
  //         .indent_delta = indent_delta,
  //         .underlying_writer = sub_expr_buffer.writer(),
  //     };
  //     var sub_render: Render = .{
  //         .gpa = r.gpa,
  //         .ais = &auto_indenting_stream,
  //         .tree = r.tree,
  //         .fixups = r.fixups,
  //     };
  //
  //     // Calculate size of columns in current section
  //     var column_counter: usize = 0;
  //     var single_line = true;
  //     var contains_newline = false;
  //     for (section_exprs, 0..) |expr, i| {
  //         const start = sub_expr_buffer.items.len;
  //         sub_expr_buffer_starts[i] = start;
  //
  //         if (i + 1 < section_exprs.len) {
  //             try renderExpression(&sub_render, expr, .none);
  //             const width = sub_expr_buffer.items.len - start;
  //             const this_contains_newline = mem.indexOfScalar(u8, sub_expr_buffer.items[start..], '\n') != null;
  //             contains_newline = contains_newline or this_contains_newline;
  //             expr_widths[i] = width;
  //             expr_newlines[i] = this_contains_newline;
  //
  //             if (!this_contains_newline) {
  //                 const column = column_counter % row_size;
  //                 column_widths[column] = @max(column_widths[column], width);
  //
  //                 const expr_last_token = tree.lastToken(expr) + 1;
  //                 const next_expr = section_exprs[i + 1];
  //                 column_counter += 1;
  //                 if (!tree.tokensOnSameLine(expr_last_token, tree.firstToken(next_expr))) single_line = false;
  //             } else {
  //                 single_line = false;
  //                 column_counter = 0;
  //             }
  //         } else {
  //             try renderExpression(&sub_render, expr, .comma);
  //             const width = sub_expr_buffer.items.len - start - 2;
  //             const this_contains_newline = mem.indexOfScalar(u8, sub_expr_buffer.items[start .. sub_expr_buffer.items.len - 1], '\n') != null;
  //             contains_newline = contains_newline or this_contains_newline;
  //             expr_widths[i] = width;
  //             expr_newlines[i] = contains_newline;
  //
  //             if (!contains_newline) {
  //                 const column = column_counter % row_size;
  //                 column_widths[column] = @max(column_widths[column], width);
  //             }
  //         }
  //     }
  //     sub_expr_buffer_starts[section_exprs.len] = sub_expr_buffer.items.len;
  //
  //     // Render exprs in current section.
  //     column_counter = 0;
  //     for (section_exprs, 0..) |expr, i| {
  //         const start = sub_expr_buffer_starts[i];
  //         const end = sub_expr_buffer_starts[i + 1];
  //         const expr_text = sub_expr_buffer.items[start..end];
  //         if (!expr_newlines[i]) {
  //             try ais.writer().writeAll(expr_text);
  //         } else {
  //             var by_line = std.mem.splitScalar(u8, expr_text, '\n');
  //             var last_line_was_empty = false;
  //             try ais.writer().writeAll(by_line.first());
  //             while (by_line.next()) |line| {
  //                 if (std.mem.startsWith(u8, line, "//") and last_line_was_empty) {
  //                     try ais.insertNewline();
  //                 } else {
  //                     try ais.maybeInsertNewline();
  //                 }
  //                 last_line_was_empty = (line.len == 0);
  //                 try ais.writer().writeAll(line);
  //             }
  //         }
  //
  //         if (i + 1 < section_exprs.len) {
  //             const next_expr = section_exprs[i + 1];
  //             const comma = tree.lastToken(expr) + 1;
  //
  //             if (column_counter != row_size - 1) {
  //                 if (!expr_newlines[i] and !expr_newlines[i + 1]) {
  //                     // Neither the current or next expression is multiline
  //                     try renderToken(r, comma, .space); // ,
  //                     assert(column_widths[column_counter % row_size] >= expr_widths[i]);
  //                     const padding = column_widths[column_counter % row_size] - expr_widths[i];
  //                     try ais.writer().writeByteNTimes(' ', padding);
  //
  //                     column_counter += 1;
  //                     continue;
  //                 }
  //             }
  //
  //             if (single_line and row_size != 1) {
  //                 try renderToken(r, comma, .space); // ,
  //                 continue;
  //             }
  //
  //             column_counter = 0;
  //             try renderToken(r, comma, .newline); // ,
  //             try renderExtraNewline(r, next_expr);
  //         }
  //     }
  //
  //     if (expr_index == array_init.ast.elements.len)
  //         break;
  // }
  //
  // ais.popIndent();
  // return renderToken(r, rbrace, space); // rbrace
  //
};

const ArrayInit = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  return (
    <NodeDisplay node={node}>
      <ErrorBoundary fallbackRender={({ error }) => <pre>{error.message}</pre>}>
        <ArrayInitBody node={node} />
      </ErrorBoundary>
    </NodeDisplay>
  );
};

const CallBody = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const call = fullCall(ast, node);
  const el: JSX.Element[] = [];

  // if (call.async_token) |async_token| {
  //     try renderToken(r, async_token, .space);
  // }
  // try renderExpression(r, call.ast.fn_expr, .none);
  // try renderParamList(r, call.ast.lparen, call.ast.params, space);
  if (call.async_token) {
    el.push(<TokenDisplay token={call.async_token} />);
  }
  el.push(<Expression node={call.ast.fn_expr} />);
  el.push(<ParamList lparen={call.ast.lparen} params={call.ast.params} />);

  return el;
};

const ParamList = ({
  lparen,
  params,
}: {
  lparen: number;
  params: number[];
}) => {
  const { ast } = useAst();
  //   const tree = r.tree;
  // const ais = r.ais;
  // const token_tags = tree.tokens.items(.tag);
  //
  // if (params.len == 0) {
  //     ais.pushIndentNextLine();
  //     try renderToken(r, lparen, .none);
  //     ais.popIndent();
  //     return renderToken(r, lparen + 1, space); // )
  // }
  if (params.length === 0) {
    return [
      <TokenDisplay token={lparen} />,
      <TokenDisplay token={lparen + 1} />,
    ];
  }
  const el: JSX.Element[] = [];

  // const last_param = params[params.len - 1];
  const lastParam = params[params.length - 1];
  const afterLastParamTok = getLastToken(ast, lastParam) + 1;
  // const after_last_param_tok = tree.lastToken(last_param) + 1;
  // if (token_tags[after_last_param_tok] == .comma) {
  //     ais.pushIndentNextLine();
  //     try renderToken(r, lparen, .newline); // (
  el.push(<TokenDisplay token={lparen} />);

  for (const param of params) {
    // if (i + 1 < params.length) {
    el.push(<Expression node={param} />);
    const comma = getLastToken(ast, param) + 1;
    if (getTokenTag(ast, comma) === TokenTag.Comma) {
      el.push(<TokenDisplay token={afterLastParamTok} />);
    }
  }

  el.push(<TokenDisplay token={afterLastParamTok + 1} />);
  return el;
  //     for (params, 0..) |param_node, i| {
  //         if (i + 1 < params.len) {
  //             try renderExpression(r, param_node, .none);
  //
  //             // Unindent the comma for multiline string literals.
  //             const is_multiline_string =
  //                 token_tags[tree.firstToken(param_node)] == .multiline_string_literal_line;
  //             if (is_multiline_string) ais.popIndent();
  //
  //             const comma = tree.lastToken(param_node) + 1;
  //             try renderToken(r, comma, .newline); // ,
  //
  //             if (is_multiline_string) ais.pushIndent();
  //
  //             try renderExtraNewline(r, params[i + 1]);
  //         } else {
  //             try renderExpression(r, param_node, .comma);
  //         }
  //     }
  //     ais.popIndent();
  //     return renderToken(r, after_last_param_tok + 1, space); // )
  // }
  //
  // try renderToken(r, lparen, .none); // (
  //
  // for (params, 0..) |param_node, i| {
  //     const first_param_token = tree.firstToken(param_node);
  //     if (token_tags[first_param_token] == .multiline_string_literal_line or
  //         hasSameLineComment(tree, first_param_token - 1))
  //     {
  //         ais.pushIndentOneShot();
  //     }
  //     try renderExpression(r, param_node, .none);
  //
  //     if (i + 1 < params.len) {
  //         const comma = tree.lastToken(param_node) + 1;
  //         const next_multiline_string =
  //             token_tags[tree.firstToken(params[i + 1])] == .multiline_string_literal_line;
  //         const comma_space: Space = if (next_multiline_string) .none else .space;
  //         try renderToken(r, comma, comma_space);
  //     }
  // }
  //
  // return renderToken(r, after_last_param_tok, space); // )
  //
  // throw new Error("ParamList not implemented");
};
const Call = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  return (
    <NodeDisplay node={node}>
      <ErrorBoundary fallbackRender={({ error }) => <pre>{error.message}</pre>}>
        <CallBody node={node} />
      </ErrorBoundary>
    </NodeDisplay>
  );
};

const SliceBody = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const slice = fullSlice(ast, node);
  const el: JSX.Element[] = [];
  // const tree = r.tree;
  // const node_tags = tree.nodes.items(.tag);
  // const after_start_space_bool = nodeCausesSliceOpSpace(node_tags[slice.ast.start]) or
  //     if (slice.ast.end != 0) nodeCausesSliceOpSpace(node_tags[slice.ast.end]) else false;
  // const after_start_space = if (after_start_space_bool) Space.space else Space.none;
  // const after_dots_space = if (slice.ast.end != 0)
  //     after_start_space
  // else if (slice.ast.sentinel != 0) Space.space else Space.none;
  //
  // try renderExpression(r, slice.ast.sliced, .none);
  // try renderToken(r, slice.ast.lbracket, .none); // lbracket
  el.push(<Expression node={slice.ast.sliced} />);
  el.push(<TokenDisplay token={slice.ast.lbracket} />);

  // const start_last = tree.lastToken(slice.ast.start);
  // try renderExpression(r, slice.ast.start, after_start_space);
  // try renderToken(r, start_last + 1, after_dots_space); // ellipsis2 ("..")
  el.push(<Expression node={slice.ast.start} />);
  el.push(<TokenDisplay token={getLastToken(ast, slice.ast.start) + 1} />);
  // if (slice.ast.end != 0) {
  //     const after_end_space = if (slice.ast.sentinel != 0) Space.space else Space.none;
  //     try renderExpression(r, slice.ast.end, after_end_space);
  // }
  if (slice.ast.end !== 0) {
    el.push(<Expression node={slice.ast.end} />);
  }
  // if (slice.ast.sentinel != 0) {
  //     try renderToken(r, tree.firstToken(slice.ast.sentinel) - 1, .none); // colon
  //     try renderExpression(r, slice.ast.sentinel, .none);
  // }
  //
  if (slice.ast.sentinel !== 0) {
    el.push(
      <TokenDisplay token={getFirstToken(ast, slice.ast.sentinel) - 1} />,
    );
    el.push(<Expression node={slice.ast.sentinel} />);
  }

  // try renderToken(r, tree.lastToken(slice_node), space); // rbracket
  el.push(<TokenDisplay token={getLastToken(ast, node)} />);

  return el;
};

const Slice = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  return (
    <NodeDisplay node={node}>
      <ErrorBoundary fallbackRender={({ error }) => <pre>{error.message}</pre>}>
        <SliceBody node={node} />
      </ErrorBoundary>
    </NodeDisplay>
  );
};

const ContainerDeclBody = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const containerDecl = fullContainerDecl(ast, node);
  const el: JSX.Element[] = [];
  // const tree = r.tree;
  // const ais = r.ais;
  // const token_tags = tree.tokens.items(.tag);
  //
  // if (container_decl.layout_token) |layout_token| {
  //     try renderToken(r, layout_token, .space);
  // }
  if (containerDecl.layout_token) {
    el.push(<TokenDisplay token={containerDecl.layout_token} />);
  }
  let container: ContainerType = "other";
  switch (getTokenTag(ast, containerDecl.ast.main_token)) {
    case TokenTag.KeywordEnum: {
      container = "enum";
      break;
    }
    case TokenTag.KeywordStruct: {
      for (const member of containerDecl.ast.members) {
        const field = fullContainerField(ast, member);
        if (!field.ast.tuple_like) {
          container = "tuple";
          break;
        }
      }
      break;
    }
  }

  // const container: Container = switch (token_tags[container_decl.ast.main_token]) {
  //     .keyword_enum => .@"enum",
  //     .keyword_struct => for (container_decl.ast.members) |member| {
  //         if (tree.fullContainerField(member)) |field| if (!field.ast.tuple_like) break .other;
  //     } else .tuple,
  //     else => .other,
  // };
  let lbrace: number;
  // var lbrace: Ast.TokenIndex = undefined;
  // if (container_decl.ast.enum_token) |enum_token| {
  //     try renderToken(r, container_decl.ast.main_token, .none); // union
  //     try renderToken(r, enum_token - 1, .none); // lparen
  //     try renderToken(r, enum_token, .none); // enum
  //     if (container_decl.ast.arg != 0) {
  //         try renderToken(r, enum_token + 1, .none); // lparen
  //         try renderExpression(r, container_decl.ast.arg, .none);
  //         const rparen = tree.lastToken(container_decl.ast.arg) + 1;
  //         try renderToken(r, rparen, .none); // rparen
  //         try renderToken(r, rparen + 1, .space); // rparen
  //         lbrace = rparen + 2;
  //     } else {
  //         try renderToken(r, enum_token + 1, .space); // rparen
  //         lbrace = enum_token + 2;
  //     }
  // } else if (container_decl.ast.arg != 0) {
  //     try renderToken(r, container_decl.ast.main_token, .none); // union
  //     try renderToken(r, container_decl.ast.main_token + 1, .none); // lparen
  //     try renderExpression(r, container_decl.ast.arg, .none);
  //     const rparen = tree.lastToken(container_decl.ast.arg) + 1;
  //     try renderToken(r, rparen, .space); // rparen
  //     lbrace = rparen + 1;
  // } else {
  //     try renderToken(r, container_decl.ast.main_token, .space); // union
  //     lbrace = container_decl.ast.main_token + 1;
  // }
  if (containerDecl.ast.enum_token) {
    el.push(<TokenDisplay token={containerDecl.ast.main_token} />);
    el.push(<TokenDisplay token={containerDecl.ast.enum_token - 1} />);
    el.push(<TokenDisplay token={containerDecl.ast.enum_token} />);
    if (containerDecl.ast.arg !== 0) {
      el.push(<TokenDisplay token={containerDecl.ast.enum_token + 1} />);
      el.push(<Expression node={containerDecl.ast.arg} />);
      const rparen = getLastToken(ast, containerDecl.ast.arg) + 1;
      el.push(<TokenDisplay token={rparen} />);
      el.push(<TokenDisplay token={rparen + 1} />);
      lbrace = rparen + 2;
    } else {
      el.push(<TokenDisplay token={containerDecl.ast.enum_token + 1} />);
      lbrace = containerDecl.ast.enum_token + 2;
    }
  } else if (containerDecl.ast.arg !== 0) {
    el.push(<TokenDisplay token={containerDecl.ast.main_token} />);
    el.push(<TokenDisplay token={containerDecl.ast.main_token + 1} />);
    el.push(<Expression node={containerDecl.ast.arg} />);
    const rparen = getLastToken(ast, containerDecl.ast.arg) + 1;
    el.push(<TokenDisplay token={rparen} />);
    lbrace = rparen + 1;
  } else {
    el.push(<TokenDisplay token={containerDecl.ast.main_token} />);
    lbrace = containerDecl.ast.main_token + 1;
  }

  const rbrace = getLastToken(ast, node);
  // const rbrace = tree.lastToken(container_decl_node);
  // if (container_decl.ast.members.len == 0) {
  //     ais.pushIndentNextLine();
  //     if (token_tags[lbrace + 1] == .container_doc_comment) {
  //         try renderToken(r, lbrace, .newline); // lbrace
  //         try renderContainerDocComments(r, lbrace + 1);
  //     } else {
  //         try renderToken(r, lbrace, .none); // lbrace
  //     }
  //     ais.popIndent();
  //     return renderToken(r, rbrace, space); // rbrace
  // }
  if (containerDecl.ast.members.length === 0) {
    el.push(<TokenDisplay token={lbrace} />);
    if (getTokenTag(ast, lbrace + 1) === TokenTag.ContainerDocComment) {
      el.push(<TokenDisplay token={lbrace + 1} />);
    }
    el.push(<TokenDisplay token={rbrace} />);
    return el;
  }

  // const src_has_trailing_comma = token_tags[rbrace - 1] == .comma;
  // if (!src_has_trailing_comma) one_line: {
  //     // We print all the members in-line unless one of the following conditions are true:
  //
  //     // 1. The container has comments or multiline strings.
  //     if (hasComment(tree, lbrace, rbrace) or hasMultilineString(tree, lbrace, rbrace)) {
  //         break :one_line;
  //     }
  //
  //     // 2. The container has a container comment.
  //     if (token_tags[lbrace + 1] == .container_doc_comment) break :one_line;
  //
  //     // 3. A member of the container has a doc comment.
  //     for (token_tags[lbrace + 1 .. rbrace - 1]) |tag| {
  //         if (tag == .doc_comment) break :one_line;
  //     }
  //
  //     // 4. The container has non-field members.
  //     for (container_decl.ast.members) |member| {
  //         if (tree.fullContainerField(member) == null) break :one_line;
  //     }
  //
  //     // Print all the declarations on the same line.
  //     try renderToken(r, lbrace, .space); // lbrace
  //     for (container_decl.ast.members) |member| {
  //         try renderMember(r, container, member, .space);
  //     }
  //     return renderToken(r, rbrace, space); // rbrace
  // }
  //
  // // One member per line.
  const srcHasTrailingComma = getTokenTag(ast, rbrace - 1) === TokenTag.Comma;

  // ais.pushIndentNextLine();
  el.push(<TokenDisplay token={lbrace} />);
  // try renderToken(r, lbrace, .newline); // lbrace
  // if (token_tags[lbrace + 1] == .container_doc_comment) {
  //     try renderContainerDocComments(r, lbrace + 1);
  // }
  if (getTokenTag(ast, lbrace + 1) === TokenTag.ContainerDocComment) {
    el.push(<TokenDisplay token={lbrace + 1} />);
  }

  // for (container_decl.ast.members, 0..) |member, i| {
  //     if (i != 0) try renderExtraNewline(r, member);
  //     switch (tree.nodes.items(.tag)[member]) {
  //         // For container fields, ensure a trailing comma is added if necessary.
  //         .container_field_init,
  //         .container_field_align,
  //         .container_field,
  //         => try renderMember(r, container, member, .comma),
  //
  //         else => try renderMember(r, container, member, .newline),
  //     }
  // }
  for (const member of containerDecl.ast.members) {
    switch (getNodeTag(ast, member)) {
      case AstNodeTag.ContainerFieldInit:
      case AstNodeTag.ContainerFieldAlign:
      case AstNodeTag.ContainerField: {
        el.push(<ContainerField node={member} />);
        break;
      }
      default: {
        el.push(<ContainerField node={member} />);
        break;
      }
    }
  }
  // ais.popIndent();
  //
  // return renderToken(r, rbrace, space); // rbrace
  el.push(<TokenDisplay token={rbrace} />);

  return el;
};

const ContainerDecl = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  return (
    <NodeDisplay node={node}>
      <ErrorBoundary fallbackRender={({ error }) => <pre>{error.message}</pre>}>
        <ContainerDeclBody node={node} />
      </ErrorBoundary>
    </NodeDisplay>
  );
};
const BuiltinCallBody = ({ node }: NodeComponent) => {
  // }
  // //         .builtin_call_two, .builtin_call_two_comma => {
  // //             if (datas[node].lhs == 0) {
  // //                 return renderBuiltinCall(r, main_tokens[node], &.{}, space);
  // //             } else if (datas[node].rhs == 0) {
  // //                 return renderBuiltinCall(r, main_tokens[node], &.{datas[node].lhs}, space);
  // //             } else {
  // //                 return renderBuiltinCall(r, main_tokens[node], &.{ datas[node].lhs, datas[node].rhs }, space);
  // //             }
  // //         },
  // case AstNodeTag.BuiltinCallTwo:
  // case AstNodeTag.BuiltinCallTwoComma: {
  //   throw new Error("BuiltinCallTwo not implemented");
  // }
  // //         .builtin_call, .builtin_call_comma => {
  // //             const params = tree.extra_data[datas[node].lhs..datas[node].rhs];
  // //             return renderBuiltinCall(r, main_tokens[node], params, space);
  // //         },
  const { ast } = useAst();
  const data = getNodeData(ast, node);
  const tag = getNodeTag(ast, node);
  const builtinToken = getMainToken(ast, node);
  const params = useMemo(() => {
    if (
      tag === AstNodeTag.BuiltinCallTwo ||
      tag === AstNodeTag.BuiltinCallTwoComma
    ) {
      const params: number[] = [];
      if (data.lhs) params.push(data.lhs);
      if (data.rhs) params.push(data.rhs);
      return params;
    }

    return getExtraDataSpan(ast, data.lhs, data.rhs);
  }, [ast, node]);
  const el: JSX.Element[] = [];

  // try renderToken(r, builtin_token, .none); // @name
  el.push(<TokenDisplay token={builtinToken} />);
  if (params.length === 0) {
    el.push(<TokenDisplay token={builtinToken + 1} />);
    el.push(<TokenDisplay token={builtinToken + 2} />);
    return el;
  }

  // if (params.len == 0) {
  //     try renderToken(r, builtin_token + 1, .none); // (
  //     return renderToken(r, builtin_token + 2, space); // )
  // }
  //
  // if (r.fixups.rebase_imported_paths) |prefix| {
  //     const slice = tree.tokenSlice(builtin_token);
  //     if (mem.eql(u8, slice, "@import")) f: {
  //         const param = params[0];
  //         const str_lit_token = main_tokens[param];
  //         assert(token_tags[str_lit_token] == .string_literal);
  //         const token_bytes = tree.tokenSlice(str_lit_token);
  //         const imported_string = std.zig.string_literal.parseAlloc(r.gpa, token_bytes) catch |err| switch (err) {
  //             error.OutOfMemory => return error.OutOfMemory,
  //             error.InvalidLiteral => break :f,
  //         };
  //         defer r.gpa.free(imported_string);
  //         const new_string = try std.fs.path.resolvePosix(r.gpa, &.{ prefix, imported_string });
  //         defer r.gpa.free(new_string);
  //
  //         try renderToken(r, builtin_token + 1, .none); // (
  //         try ais.writer().print("\"{}\"", .{std.zig.fmtEscapes(new_string)});
  //         return renderToken(r, str_lit_token + 1, space); // )
  //     }
  // }
  //
  // const last_param = params[params.len - 1];
  // const after_last_param_token = tree.lastToken(last_param) + 1;
  //
  // if (token_tags[after_last_param_token] != .comma) {
  //     // Render all on one line, no trailing comma.
  //     try renderToken(r, builtin_token + 1, .none); // (
  //
  //     for (params, 0..) |param_node, i| {
  //         const first_param_token = tree.firstToken(param_node);
  //         if (token_tags[first_param_token] == .multiline_string_literal_line or
  //             hasSameLineComment(tree, first_param_token - 1))
  //         {
  //             ais.pushIndentOneShot();
  //         }
  //         try renderExpression(r, param_node, .none);
  //
  //         if (i + 1 < params.len) {
  //             const comma_token = tree.lastToken(param_node) + 1;
  //             try renderToken(r, comma_token, .space); // ,
  //         }
  //     }
  //     return renderToken(r, after_last_param_token, space); // )
  // } else {
  //     // Render one param per line.
  //     ais.pushIndent();
  //     try renderToken(r, builtin_token + 1, Space.newline); // (
  //
  //     for (params) |param_node| {
  //         try renderExpression(r, param_node, .comma);
  //     }
  //     ais.popIndent();
  //
  //     return renderToken(r, after_last_param_token + 1, space); // )
  // }
  // return getExtraDataSpan(ast, data.lhs, data.rhs);
  //
  el.push(<TokenDisplay token={builtinToken + 1} />); // (

  for (const param of params) {
    el.push(<Expression node={param} />);
    const comma = getLastToken(ast, param) + 1;
    if (getTokenTag(ast, comma) === TokenTag.Comma) {
      el.push(<TokenDisplay token={comma} />);
    }
  }
  el.push(
    <TokenDisplay token={getLastToken(ast, params[params.length - 1]) + 1} />,
  ); // )

  return el;
};

const BuiltinCall = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  return (
    <NodeDisplay node={node}>
      <ErrorBoundary fallbackRender={({ error }) => <pre>{error.message}</pre>}>
        <BuiltinCallBody node={node} />
      </ErrorBoundary>
    </NodeDisplay>
  );
};

// fn hasComment(tree: Ast, start_token: Ast.TokenIndex, end_token: Ast.TokenIndex) bool {
//     const token_starts = tree.tokens.items(.start);
//
//     var i = start_token;
//     while (i < end_token) : (i += 1) {
//         const start = token_starts[i] + tree.tokenSlice(i).len;
//         const end = token_starts[i + 1];
//         if (mem.indexOf(u8, tree.source[start..end], "//") != null) return true;
//     }
//
//     return false;
// }
const hasComment = (
  ast: number,
  startToken: number,
  endToken: number,
  source: string,
) => {
  let i = startToken;
  while (i < endToken) {
    const start = getTokenStart(ast, i) + tokenSlice(ast, i).length;
    const end = getTokenStart(ast, i + 1);
    if (source.slice(start, end).indexOf("//") !== -1) return true;
  }
  return false;
};

const SwitchCaseBody = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const switchCase = fullSwitchCase(ast, node);
  const el: JSX.Element[] = [];
  //
  // const tree = r.tree;
  // const node_tags = tree.nodes.items(.tag);
  // const token_tags = tree.tokens.items(.tag);
  // const trailing_comma = token_tags[switch_case.ast.arrow_token - 1] == .comma;
  // const has_comment_before_arrow = blk: {
  //     if (switch_case.ast.values.len == 0) break :blk false;
  //     break :blk hasComment(tree, tree.firstToken(switch_case.ast.values[0]), switch_case.ast.arrow_token);
  // };
  // const hasCommentBeforeArrow = switchCase.ast.values.length === 0;
  // // render inline keyword
  // if (switch_case.inline_token) |some| {
  //     try renderToken(r, some, .space);
  // }
  if (switchCase.inline_token)
    el.push(<TokenDisplay token={switchCase.inline_token} />);

  // // Render everything before the arrow
  if (switchCase.ast.values.length === 0) {
    el.push(<TokenDisplay token={switchCase.ast.arrow_token - 1} />); // else keyword
  } else {
    for (const value of switchCase.ast.values) {
      el.push(<Expression node={value} />);
    }
  }
  // if (switch_case.ast.values.len == 0) {
  //     try renderToken(r, switch_case.ast.arrow_token - 1, .space); // else keyword
  // } else if (trailing_comma or has_comment_before_arrow) {
  //     // Render each value on a new line
  //     try renderExpressions(r, switch_case.ast.values, .comma);
  // } else {
  //     // Render on one line
  //     for (switch_case.ast.values) |value_expr| {
  //         try renderExpression(r, value_expr, .comma_space);
  //     }
  // }
  //
  // // Render the arrow and everything after it
  // const pre_target_space = if (node_tags[switch_case.ast.target_expr] == .multiline_string_literal)
  //     // Newline gets inserted when rendering the target expr.
  //     Space.none
  // else
  //     Space.space;
  // const after_arrow_space: Space = if (switch_case.payload_token == null) pre_target_space else .space;
  // try renderToken(r, switch_case.ast.arrow_token, after_arrow_space); // =>
  el.push(<TokenDisplay token={switchCase.ast.arrow_token} />);
  if (switchCase.payload_token) {
    el.push(<TokenDisplay token={switchCase.payload_token - 1} />);
    let ident = switchCase.payload_token;
    if (getTokenTag(ast, switchCase.payload_token) === TokenTag.Asterisk) {
      el.push(<TokenDisplay token={switchCase.payload_token} />);
      ident += 1;
    }
    el.push(<TokenDisplay token={ident} />);
    if (getTokenTag(ast, ident + 1) === TokenTag.Comma) {
      el.push(<TokenDisplay token={ident + 1} />);
      el.push(<TokenDisplay token={ident + 2} />);
      el.push(<TokenDisplay token={ident + 3} />);
    } else {
      el.push(<TokenDisplay token={ident + 1} />);
    }
  }

  el.push(<Expression node={switchCase.ast.target_expr} />);
  return el;
  // if (switch_case.payload_token) |payload_token| {
  //     try renderToken(r, payload_token - 1, .none); // pipe
  //     const ident = payload_token + @intFromBool(token_tags[payload_token] == .asterisk);
  //     if (token_tags[payload_token] == .asterisk) {
  //         try renderToken(r, payload_token, .none); // asterisk
  //     }
  //     try renderIdentifier(r, ident, .none, .preserve_when_shadowing); // identifier
  //     if (token_tags[ident + 1] == .comma) {
  //         try renderToken(r, ident + 1, .space); // ,
  //         try renderIdentifier(r, ident + 2, .none, .preserve_when_shadowing); // identifier
  //         try renderToken(r, ident + 3, pre_target_space); // pipe
  //     } else {
  //         try renderToken(r, ident + 1, pre_target_space); // pipe
  //     }
  // }
  //
  // try renderExpression(r, switch_case.ast.target_expr, space);
};

const SwitchCase = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  return (
    <NodeDisplay node={node}>
      <ErrorBoundary fallbackRender={({ error }) => <pre>{error.message}</pre>}>
        <SwitchCaseBody node={node} />
      </ErrorBoundary>
    </NodeDisplay>
  );
};
// fn nodeIsBlock(tag: Ast.Node.Tag) bool {
//     return switch (tag) {
//         .block,
//         .block_semicolon,
//         .block_two,
//         .block_two_semicolon,
//         => true,
//         else => false,
//     };
// }
const nodeIsBlock = (ast: number, node: number) => {
  const tag = getNodeTag(ast, node);
  return (
    tag === AstNodeTag.Block ||
    tag === AstNodeTag.BlockSemicolon ||
    tag === AstNodeTag.BlockTwo ||
    tag === AstNodeTag.BlockTwoSemicolon
  );
};
//
// fn nodeIsIfForWhileSwitch(tag: Ast.Node.Tag) bool {
//     return switch (tag) {
//         .@"if",
//         .if_simple,
//         .@"for",
//         .for_simple,
//         .@"while",
//         .while_simple,
//         .while_cont,
//         .@"switch",
//         .switch_comma,
//         => true,
//         else => false,
//     };
// }
const nodeIsIfForWhileSwitch = (ast: number, node: number) => {
  const tag = getNodeTag(ast, node);
  return (
    tag === AstNodeTag.If ||
    tag === AstNodeTag.IfSimple ||
    tag === AstNodeTag.For ||
    tag === AstNodeTag.ForSimple ||
    tag === AstNodeTag.While ||
    tag === AstNodeTag.WhileSimple ||
    tag === AstNodeTag.WhileCont ||
    tag === AstNodeTag.Switch ||
    tag === AstNodeTag.SwitchComma
  );
};
//
// const ThenElse = ({ node }: NodeComponent) => {
//   throw new Error("ThenElse not implemented");
// };
const WhileOrIf = ({
  full: whileNode,
  node,
}: {
  node: number;
  full: AstfullWhile;
}) => {
  const { ast } = useAst();
  const el: JSX.Element[] = [];
  if (whileNode.label_token) {
    el.push(<TokenDisplay token={whileNode.label_token} />);
    el.push(<TokenDisplay token={whileNode.label_token + 1} />);
  }
  if (whileNode.inline_token) {
    el.push(<TokenDisplay token={whileNode.inline_token} />);
  }
  el.push(<TokenDisplay token={whileNode.ast.while_token} />);
  el.push(<TokenDisplay token={whileNode.ast.while_token + 1} />);
  el.push(<Expression node={whileNode.ast.cond_expr} />);
  let lastPrefixToken = getLastToken(ast, whileNode.ast.cond_expr) + 1; //rparen

  if (whileNode.payload_token) {
    el.push(<TokenDisplay token={lastPrefixToken} />);
    el.push(<TokenDisplay token={whileNode.payload_token - 1} />);
    let ident = whileNode.payload_token;
    if (getTokenTag(ast, whileNode.payload_token) === TokenTag.Asterisk) {
      el.push(<TokenDisplay token={whileNode.payload_token} />);
      ident += 1;
    }
    el.push(<TokenDisplay token={ident} />);
    let pipe = ident + 1;
    if (getTokenTag(ast, ident + 1) === TokenTag.Comma) {
      el.push(<TokenDisplay token={ident + 1} />);
      el.push(<TokenDisplay token={ident + 2} />);
      pipe = ident + 3;
    }
    lastPrefixToken = pipe;
  }
  if (whileNode.ast.cont_expr != 0) {
    el.push(<TokenDisplay token={lastPrefixToken} />);
    const lparen = getFirstToken(ast, whileNode.ast.cont_expr) - 1;
    el.push(<TokenDisplay token={lparen - 1} />);
    el.push(<TokenDisplay token={lparen} />);
    el.push(<Expression node={whileNode.ast.cont_expr} />);
    lastPrefixToken = getLastToken(ast, whileNode.ast.cont_expr) + 1; // rparen
  }
  // THEN ELSE
  const thenExpr = whileNode.ast.then_expr;
  const elseToken = whileNode.else_token;
  const maybeErrorToken = whileNode.error_token;
  const elseExpr = whileNode.ast.else_expr;

  el.push(<TokenDisplay token={lastPrefixToken} />);
  if (elseExpr !== 0) {
    el.push(<Expression node={thenExpr} />);

    let lastElseToken = elseToken;

    if (maybeErrorToken) {
      el.push(<TokenDisplay token={elseToken} />);
      el.push(<TokenDisplay token={maybeErrorToken - 1} />);
      el.push(<TokenDisplay token={maybeErrorToken} />);
      lastElseToken = maybeErrorToken + 1;
    }
    el.push(<TokenDisplay token={lastElseToken} />);
    el.push(<Expression node={elseExpr} />);
  } else {
    if (thenExpr) el.push(<Expression node={thenExpr} />);
  }
  return el;
};

const WhileBody = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const whileNode = whileFull(ast, node);
  return <WhileOrIf full={whileNode} node={node} />;
  // const el: JSX.Element[] = [];
  // if (whileNode.label_token) {
  //   el.push(<TokenDisplay token={whileNode.label_token} />);
  //   el.push(<TokenDisplay token={whileNode.label_token + 1} />);
  // }
  // if (whileNode.inline_token) {
  //   el.push(<TokenDisplay token={whileNode.inline_token} />);
  // }
  // el.push(<TokenDisplay token={whileNode.ast.while_token} />);
  // el.push(<TokenDisplay token={whileNode.ast.while_token + 1} />);
  // el.push(<Expression node={whileNode.ast.cond_expr} />);
  // let lastPrefixToken = getLastToken(ast, whileNode.ast.cond_expr) + 1; //rparen
  //
  // if (whileNode.payload_token) {
  //   el.push(<TokenDisplay token={lastPrefixToken} />);
  //   el.push(<TokenDisplay token={whileNode.payload_token - 1} />);
  //   let ident = whileNode.payload_token;
  //   if (getTokenTag(ast, whileNode.payload_token) === TokenTag.Asterisk) {
  //     el.push(<TokenDisplay token={whileNode.payload_token} />);
  //     ident += 1;
  //   }
  //   el.push(<TokenDisplay token={ident} />);
  //   let pipe = ident + 1;
  //   if (getTokenTag(ast, ident + 1) === TokenTag.Comma) {
  //     el.push(<TokenDisplay token={ident + 1} />);
  //     el.push(<TokenDisplay token={ident + 2} />);
  //     pipe = ident + 3;
  //   }
  //   lastPrefixToken = pipe;
  // }
  //
  // while (whileNode.ast.cont_expr != 0) {
  //   el.push(<TokenDisplay token={lastPrefixToken} />);
  //   const lparen = getFirstToken(ast, whileNode.ast.cont_expr) - 1;
  //   el.push(<TokenDisplay token={lparen - 1} />);
  //   el.push(<TokenDisplay token={lparen} />);
  //   el.push(<Expression node={whileNode.ast.cont_expr} />);
  //   lastPrefixToken = getLastToken(ast, whileNode.ast.cont_expr) + 1; // rparen
  // }
  // // THEN ELSE
  // const thenExpr = whileNode.ast.then_expr;
  // const elseToken = whileNode.else_token;
  // const maybeErrorToken = whileNode.error_token;
  // const elseExpr = whileNode.ast.else_expr;
  //
  // el.push(<TokenDisplay token={lastPrefixToken} />);
  // if (elseExpr !== 0) {
  //   el.push(<Expression node={thenExpr} />);
  //
  //   let lastElseToken = elseToken;
  //
  //   if (maybeErrorToken) {
  //     el.push(<TokenDisplay token={elseToken} />);
  //     el.push(<TokenDisplay token={maybeErrorToken - 1} />);
  //     el.push(<TokenDisplay token={maybeErrorToken} />);
  //     lastElseToken = maybeErrorToken + 1;
  //   }
  //   el.push(<TokenDisplay token={lastElseToken} />);
  //   el.push(<Expression node={elseExpr} />);
  // } else {
  //   el.push(<Expression node={thenExpr} />);
  // }
  // return el;
};

const While = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  return (
    <NodeDisplay node={node}>
      <ErrorBoundary fallbackRender={({ error }) => <pre>{error.message}</pre>}>
        <WhileBody node={node} />
      </ErrorBoundary>
    </NodeDisplay>
  );
};

const ForBody = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const forNode = forFull(ast, node);
  const el = [];
  //
  // const tree = r.tree;
  // const ais = r.ais;
  // const token_tags = tree.tokens.items(.tag);

  // if (for_node.label_token) |label| {
  //     try renderIdentifier(r, label, .none, .eagerly_unquote); // label
  //     try renderToken(r, label + 1, .space); // :
  // }
  if (forNode.label_token) {
    el.push(<TokenDisplay token={forNode.label_token} />);
    el.push(<TokenDisplay token={forNode.label_token + 1} />);
  }
  // if (for_node.inline_token) |inline_token| {
  //     try renderToken(r, inline_token, .space); // inline
  // }
  if (forNode.inline_token) {
    el.push(<TokenDisplay token={forNode.inline_token} />);
  }
  // try renderToken(r, for_node.ast.for_token, .space); // if/for/while
  el.push(<TokenDisplay token={forNode.ast.for_token} />);
  // const lparen = for_node.ast.for_token + 1;
  // try renderParamList(r, lparen, for_node.ast.inputs, .space);
  const lparen = forNode.ast.for_token + 1;
  // var cur = for_node.payload_token;
  let cur = forNode.payload_token;
  // const pipe = std.mem.indexOfScalarPos(std.zig.Token.Tag, token_tags, cur, .pipe).?;
  const pipe = cur;
  const tokensLen = getTokensLength(ast);
  while (getTokenTag(ast, cur) !== TokenTag.Pipe || cur < tokensLen) {
    cur += 1;
  }

  // if (token_tags[pipe - 1] == .comma) {
  //     ais.pushIndentNextLine();
  //     try renderToken(r, cur - 1, .newline); // |
  el.push(<TokenDisplay token={cur - 1} />);
  while (true) {
    if (getTokenTag(ast, cur) === TokenTag.Asterisk) {
      el.push(<TokenDisplay token={cur} />);
      cur += 1;
    }
    el.push(<Expression node={cur} />);
    cur += 1;
    if (getTokenTag(ast, cur) === TokenTag.Comma) {
      el.push(<TokenDisplay token={cur} />);
      cur += 1;
    }
    if (getTokenTag(ast, cur) === TokenTag.Pipe) {
      break;
    }
  }
  //     while (true) {
  //         if (token_tags[cur] == .asterisk) {
  //             try renderToken(r, cur, .none); // *
  //             cur += 1;
  //         }
  //         try renderIdentifier(r, cur, .none, .preserve_when_shadowing); // identifier
  //         cur += 1;
  //         if (token_tags[cur] == .comma) {
  //             try renderToken(r, cur, .newline); // ,
  //             cur += 1;
  //         }
  //         if (token_tags[cur] == .pipe) {
  //             break;
  //         }
  //     }
  //     ais.popIndent();
  // } else {
  //     try renderToken(r, cur - 1, .none); // |
  //     while (true) {
  //         if (token_tags[cur] == .asterisk) {
  //             try renderToken(r, cur, .none); // *
  //             cur += 1;
  //         }
  //         try renderIdentifier(r, cur, .none, .preserve_when_shadowing); // identifier
  //         cur += 1;
  //         if (token_tags[cur] == .comma) {
  //             try renderToken(r, cur, .space); // ,
  //             cur += 1;
  //         }
  //         if (token_tags[cur] == .pipe) {
  //             break;
  //         }
  //     }
  // }
  //
  // try renderThenElse(
  //     r,
  //     cur,
  //     for_node.ast.then_expr,
  //     for_node.else_token,
  //     null,
  //     for_node.ast.else_expr,
  //     space,
  // );
  // THEN ELSE
  const lastPrefixToken = cur;
  const thenExpr = forNode.ast.then_expr;
  const elseToken = forNode.else_token;
  const elseExpr = forNode.ast.else_expr;

  el.push(<TokenDisplay token={lastPrefixToken} />);
  if (elseExpr !== 0) {
    el.push(<Expression node={thenExpr} />);

    let lastElseToken = elseToken;
    el.push(<TokenDisplay token={lastElseToken} />);
    el.push(<Expression node={elseExpr} />);
  } else {
    if (thenExpr) el.push(<Expression node={thenExpr} />);
  }

  return el;
};

const For = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  return (
    <NodeDisplay node={node}>
      <ErrorBoundary fallbackRender={({ error }) => <pre>{error.message}</pre>}>
        <ForBody node={node} />
      </ErrorBoundary>
    </NodeDisplay>
  );
};

const IfBody = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const ifNode = ifFull(ast, node);
  return (
    <WhileOrIf
      full={{
        // .ast = .{
        //     .while_token = if_node.ast.if_token,
        //     .cond_expr = if_node.ast.cond_expr,
        //     .cont_expr = 0,
        //     .then_expr = if_node.ast.then_expr,
        //     .else_expr = if_node.ast.else_expr,
        // },
        // .inline_token = null,
        // .label_token = null,
        // .payload_token = if_node.payload_token,
        // .else_token = if_node.else_token,
        // .error_token = if_node.error_token,

        ast: {
          while_token: ifNode.ast.if_token,
          cond_expr: ifNode.ast.cond_expr,
          cont_expr: 0,
          then_expr: ifNode.ast.then_expr,
          else_expr: ifNode.ast.else_expr,
        },
        inline_token: null,
        label_token: null,
        payload_token: ifNode.payload_token,
        else_token: ifNode.else_token,
        error_token: ifNode.error_token,
      }}
      node={node}
    />
  );
};

const If = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  return (
    <NodeDisplay node={node}>
      <ErrorBoundary fallbackRender={({ error }) => <pre>{error.message}</pre>}>
        <IfBody node={node} />
      </ErrorBoundary>
    </NodeDisplay>
  );
};

const AsmInput = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const data = getNodeData(ast, node);
  const symbolicName = getMainToken(ast, node);
  const el: JSX.Element[] = [];

  el.push(<TokenDisplay token={symbolicName - 1} />);
  el.push(<TokenDisplay token={symbolicName} />);
  el.push(<TokenDisplay token={symbolicName + 1} />);
  el.push(<TokenDisplay token={symbolicName + 2} />);
  el.push(<TokenDisplay token={symbolicName + 3} />);
  el.push(<Expression node={data.lhs} />);
  el.push(<TokenDisplay token={data.rhs} />);

  return <NodeDisplay node={node}>{el}</NodeDisplay>;

  // return el;
};
const AsmOutput = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const data = getNodeData(ast, node);
  const symbolicName = getMainToken(ast, node);
  const el: JSX.Element[] = [];

  // const tree = r.tree;
  // const token_tags = tree.tokens.items(.tag);
  // const node_tags = tree.nodes.items(.tag);
  // const main_tokens = tree.nodes.items(.main_token);
  // const datas = tree.nodes.items(.data);
  // assert(node_tags[asm_output] == .asm_output);
  // const symbolic_name = main_tokens[asm_output];
  //
  // try renderToken(r, symbolic_name - 1, .none); // lbracket
  // try renderIdentifier(r, symbolic_name, .none, .eagerly_unquote); // ident
  // try renderToken(r, symbolic_name + 1, .space); // rbracket
  // try renderToken(r, symbolic_name + 2, .space); // "constraint"
  // try renderToken(r, symbolic_name + 3, .none); // lparen
  //
  // if (token_tags[symbolic_name + 4] == .arrow) {
  //     try renderToken(r, symbolic_name + 4, .space); // ->
  //     try renderExpression(r, datas[asm_output].lhs, Space.none);
  //     return renderToken(r, datas[asm_output].rhs, space); // rparen
  // } else {
  //     try renderIdentifier(r, symbolic_name + 4, .none, .eagerly_unquote); // ident
  //     return renderToken(r, symbolic_name + 5, space); // rparen
  // }
  //
  el.push(<TokenDisplay token={symbolicName - 1} />);
  el.push(<TokenDisplay token={symbolicName} />);
  el.push(<TokenDisplay token={symbolicName + 1} />);
  el.push(<TokenDisplay token={symbolicName + 2} />);
  el.push(<TokenDisplay token={symbolicName + 3} />);
  if (getTokenTag(ast, symbolicName + 4) === TokenTag.Arrow) {
    el.push(<TokenDisplay token={symbolicName + 4} />);
    el.push(<Expression node={data.lhs} />);
    el.push(<TokenDisplay token={data.rhs} />);
  } else {
    el.push(<TokenDisplay token={symbolicName + 4} />);
    el.push(<TokenDisplay token={symbolicName + 5} />);
  }
  return <NodeDisplay node={node}>{el}</NodeDisplay>;
};
const AsmBody = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const asmNode = fullAsm(ast, node);
  const el: JSX.Element[] = [];

  // debugger
  //
  //   const tree = r.tree;
  //   const ais = r.ais;
  //   const token_tags = tree.tokens.items(.tag);
  //
  //   try renderToken(r, asm_node.ast.asm_token, .space); // asm
  el.push(<TokenDisplay token={asmNode.ast.asm_token} />);

  //   if (asm_node.volatile_token) |volatile_token| {
  //       try renderToken(r, volatile_token, .space); // volatile
  //       try renderToken(r, volatile_token + 1, .none); // lparen
  //   } else {
  //       try renderToken(r, asm_node.ast.asm_token + 1, .none); // lparen
  //   }
  if (asmNode.volatile_token) {
    el.push(<TokenDisplay token={asmNode.volatile_token} />);
    el.push(<TokenDisplay token={asmNode.volatile_token + 1} />);
  } else {
    el.push(<TokenDisplay token={asmNode.ast.asm_token + 1} />);
  }

  if (asmNode.ast.items.length === 0) {
    if (asmNode.first_clobber) {
      el.push(<Expression node={asmNode.ast.template} />);
      el.push(<TokenDisplay token={asmNode.first_clobber - 3} />);
      el.push(<TokenDisplay token={asmNode.first_clobber - 2} />);
      el.push(<TokenDisplay token={asmNode.first_clobber - 1} />);
      let tokI = asmNode.first_clobber;
      while (true) {
        el.push(<TokenDisplay token={tokI} />);
        tokI += 1;
        switch (getTokenTag(ast, tokI)) {
          case TokenTag.RParen: {
            el.push(<TokenDisplay token={tokI} />);
            return el;
          }
          case TokenTag.Comma: {
            if (getTokenTag(ast, tokI + 1) === TokenTag.RParen) {
              el.push(<TokenDisplay token={tokI + 1} />);
              return el;
            } else {
              el.push(<TokenDisplay token={tokI} />);
            }
          }
        }
        tokI += 1;
      }
    } else {
      el.push(<Expression node={asmNode.ast.template} />);
      el.push(<TokenDisplay token={asmNode.ast.rparen} />);

      return el;
    }
  }
  // Examples
  // asm ("foo" ::: "a", "b")
  // asm ("foo" ::: "a", "b",)
  //
  // const quo = asm(
  // \\divq % [v]
  //           : [_] "={rax}"(-> T),
  // [_] "={rdx}"(rem),
  //           : [v] "r"(v),
  // [_] "{rax}"(_u0),
  //   [_] "{rdx}"(_u1),
  // );
  //

  //   if (asm_node.ast.items.len == 0) {
  //       ais.pushIndent();
  //       if (asm_node.first_clobber) |first_clobber| {
  //           try renderExpression(r, asm_node.ast.template, .space);
  //           // Render the three colons.
  //           try renderToken(r, first_clobber - 3, .none);
  //           try renderToken(r, first_clobber - 2, .none);
  //           try renderToken(r, first_clobber - 1, .space);
  //
  //           var tok_i = first_clobber;
  //           while (true) : (tok_i += 1) {
  //               try renderToken(r, tok_i, .none);
  //               tok_i += 1;
  //               switch (token_tags[tok_i]) {
  //                   .r_paren => {
  //                       ais.popIndent();
  //                       return renderToken(r, tok_i, space);
  //                   },
  //                   .comma => {
  //                       if (token_tags[tok_i + 1] == .r_paren) {
  //                           ais.popIndent();
  //                           return renderToken(r, tok_i + 1, space);
  //                       } else {
  //                           try renderToken(r, tok_i, .space);
  //                       }
  //                   },
  //                   else => unreachable,
  //               }
  //           }
  //       } else {
  //           // asm ("foo")
  //           try renderExpression(r, asm_node.ast.template, .none);
  //           ais.popIndent();
  //           return renderToken(r, asm_node.ast.rparen, space); // rparen
  //       }
  //   }
  //
  //   ais.pushIndent();
  //   try renderExpression(r, asm_node.ast.template, .newline);
  //   ais.setIndentDelta(asm_indent_delta);
  //   const colon1 = tree.lastToken(asm_node.ast.template) + 1;
  el.push(<Expression node={asmNode.ast.template} />);
  let colon1 = getLastToken(ast, asmNode.ast.template) + 1;
  let colon2: number;
  if (asmNode.outputs.length === 0) {
    el.push(<TokenDisplay token={colon1} />);
    colon2 = colon1 + 1;
  } else
    colon2: {
      el.push(<TokenDisplay token={colon1} />);

      let i = 0;
      while (i < asmNode.outputs.length) {
        const asmOutput = asmNode.outputs[i];
        if (i + 1 < asmNode.outputs.length) {
          const nextAsmOutput = asmNode.outputs[i + 1];
          el.push(<AsmOutput node={asmOutput} />);
          const comma = getFirstToken(ast, nextAsmOutput) - 1;
          el.push(<TokenDisplay token={comma} />);
        } else if (
          asmNode.inputs.length === 0 &&
          asmNode.first_clobber === null
        ) {
          el.push(<AsmOutput node={asmOutput} />);
          el.push(<TokenDisplay token={asmNode.ast.rparen} />);
          return el;
        } else {
          el.push(<AsmOutput node={asmOutput} />);
          const commaOrColon = getLastToken(ast, asmOutput) + 1;
          if (getTokenTag(ast, commaOrColon) === TokenTag.Comma) {
            colon2 = commaOrColon + 1;
          } else {
            colon2 = commaOrColon;
          }
          break colon2;
        }
        i += 1;
      }
      throw new Error("unreachable");
    }
  //   const colon2 = if (asm_node.outputs.len == 0) colon2: {
  //       try renderToken(r, colon1, .newline); // :
  //       break :colon2 colon1 + 1;
  //   } else colon2: {
  //       try renderToken(r, colon1, .space); // :
  //
  //       ais.pushIndent();
  //       for (asm_node.outputs, 0..) |asm_output, i| {
  //           if (i + 1 < asm_node.outputs.len) {
  //               const next_asm_output = asm_node.outputs[i + 1];
  //               try renderAsmOutput(r, asm_output, .none);
  //
  //               const comma = tree.firstToken(next_asm_output) - 1;
  //               try renderToken(r, comma, .newline); // ,
  //               try renderExtraNewlineToken(r, tree.firstToken(next_asm_output));
  //           } else if (asm_node.inputs.len == 0 and asm_node.first_clobber == null) {
  //               try renderAsmOutput(r, asm_output, .comma);
  //               ais.popIndent();
  //               ais.setIndentDelta(indent_delta);
  //               ais.popIndent();
  //               return renderToken(r, asm_node.ast.rparen, space); // rparen
  //           } else {
  //               try renderAsmOutput(r, asm_output, .comma);
  //               const comma_or_colon = tree.lastToken(asm_output) + 1;
  //               ais.popIndent();
  //               break :colon2 switch (token_tags[comma_or_colon]) {
  //                   .comma => comma_or_colon + 1,
  //                   else => comma_or_colon,
  //               };
  //           }
  //       } else unreachable;
  //   };

  let colon3: number;
  if (asmNode.inputs.length === 0) {
    el.push(<TokenDisplay token={colon2} />);
    colon3 = colon2 + 1;
  } else {
    el.push(<TokenDisplay token={colon2} />);
    let i = 0;
    colon3: while (i < asmNode.inputs.length) {
      const asmInput = asmNode.inputs[i];
      if (i + 1 < asmNode.inputs.length) {
        const nextAsmInput = asmNode.inputs[i + 1];
        el.push(<AsmInput node={asmInput} />);
        const firstToken = getFirstToken(ast, nextAsmInput);
        el.push(<TokenDisplay token={firstToken - 1} />);
      } else if (asmNode.first_clobber === null) {
        el.push(<AsmInput node={asmInput} />);
        el.push(<TokenDisplay token={asmNode.ast.rparen} />);
        return el;
      } else {
        el.push(<AsmInput node={asmInput} />);
        const commaOrColon = getLastToken(ast, asmInput) + 1;
        if (getTokenTag(ast, commaOrColon) === TokenTag.Comma) {
          colon3 = commaOrColon + 1;
        } else {
          colon3 = commaOrColon;
        }
        break colon3;
      }
      i += 1;
    }
    throw new Error("unreachable");
  }
  //   const colon3 = if (asm_node.inputs.len == 0) colon3: {
  //       try renderToken(r, colon2, .newline); // :
  //       break :colon3 colon2 + 1;
  //   } else colon3: {
  //       try renderToken(r, colon2, .space); // :
  //       ais.pushIndent();
  //       for (asm_node.inputs, 0..) |asm_input, i| {
  //           if (i + 1 < asm_node.inputs.len) {
  //               const next_asm_input = asm_node.inputs[i + 1];
  //               try renderAsmInput(r, asm_input, .none);
  //
  //               const first_token = tree.firstToken(next_asm_input);
  //               try renderToken(r, first_token - 1, .newline); // ,
  //               try renderExtraNewlineToken(r, first_token);
  //           } else if (asm_node.first_clobber == null) {
  //               try renderAsmInput(r, asm_input, .comma);
  //               ais.popIndent();
  //               ais.setIndentDelta(indent_delta);
  //               ais.popIndent();
  //               return renderToken(r, asm_node.ast.rparen, space); // rparen
  //           } else {
  //               try renderAsmInput(r, asm_input, .comma);
  //               const comma_or_colon = tree.lastToken(asm_input) + 1;
  //               ais.popIndent();
  //               break :colon3 switch (token_tags[comma_or_colon]) {
  //                   .comma => comma_or_colon + 1,
  //                   else => comma_or_colon,
  //               };
  //           }
  //       }
  //       unreachable;
  //   };
  //   try renderToken(r, colon3, .space); // :
  el.push(<TokenDisplay token={colon3} />);
  //   const first_clobber = asm_node.first_clobber.?;
  const firstClobber = asmNode.first_clobber;
  if (!firstClobber) throw new Error("unreachable");

  //   var tok_i = first_clobber;
  //   while (true) {
  //       switch (token_tags[tok_i + 1]) {
  //           .r_paren => {
  //               ais.setIndentDelta(indent_delta);
  //               ais.popIndent();
  //               try renderToken(r, tok_i, .newline);
  //               return renderToken(r, tok_i + 1, space);
  //           },
  //           .comma => {
  //               switch (token_tags[tok_i + 2]) {
  //                   .r_paren => {
  //                       ais.setIndentDelta(indent_delta);
  //                       ais.popIndent();
  //                       try renderToken(r, tok_i, .newline);
  //                       return renderToken(r, tok_i + 2, space);
  //                   },
  //                   else => {
  //                       try renderToken(r, tok_i, .none);
  //                       try renderToken(r, tok_i + 1, .space);
  //                       tok_i += 2;
  //                   },
  //               }
  //           },
  //           else => unreachable,
  //       }
  //   }
  let tokI = firstClobber;

  while (true) {
    switch (getTokenTag(ast, tokI + 1)) {
      case TokenTag.RParen: {
        el.push(<TokenDisplay token={tokI} />);
        el.push(<TokenDisplay token={tokI + 1} />);
        return el;
      }
      case TokenTag.Comma: {
        el.push(<TokenDisplay token={tokI} />);
        el.push(<TokenDisplay token={tokI + 1} />);
        tokI += 2;
      }
    }
    throw new Error("Unreachable");
  }
};

const Asm = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  return (
    <NodeDisplay node={node}>
      <ErrorBoundary fallbackRender={({ error }) => <pre>{error.message}</pre>}>
        <AsmBody node={node} />
      </ErrorBoundary>
    </NodeDisplay>
  );
};

// pub fn convertToNonTupleLike(cf: *ContainerField, nodes: NodeList.Slice) void {
//     if (!cf.ast.tuple_like) return;
//     if (nodes.items(.tag)[cf.ast.type_expr] != .identifier) return;
//
//     cf.ast.type_expr = 0;
//     cf.ast.tuple_like = false;
// }
const convertToNonTupleLike = (ast: number, cf: AstfullContainerField) => {
  if (!cf.ast.tuple_like) return cf;
  if (getNodeTag(ast, cf.ast.type_expr) !== AstNodeTag.Identifier) return cf;
  cf.ast.type_expr = 0;
  cf.ast.tuple_like = false;
  return cf;
};
const ContainerFieldBody = ({
  node,
  container,
}: NodeComponent<{ container: ContainerType }>) => {
  const { ast } = useAst();
  const el: JSX.Element[] = [];
  let field = fullContainerField(ast, node);

  // const tree = r.tree;
  // const ais = r.ais;
  // var field = field_param;
  // if (container != .tuple) field.convertToNonTupleLike(tree.nodes);
  if (container !== "tuple") field = convertToNonTupleLike(ast, field);
  // const quote: QuoteBehavior = switch (container) {
  //     .@"enum" => .eagerly_unquote_except_underscore,
  //     .tuple, .other => .eagerly_unquote,
  // };
  //
  // if (field.comptime_token) |t| {
  //     try renderToken(r, t, .space); // comptime
  // }
  const renderExpressionComma = (
    el: JSX.Element[],
    ast: number,
    node: number,
  ) => {
    el.push(<Expression node={node} />);
    const comma = getLastToken(ast, node) + 1;
    if (getTokenTag(ast, comma) === TokenTag.Comma) {
      el.push(<TokenDisplay token={comma} />);
    }
  };
  const renderTokenComma = (el: JSX.Element[], ast: number, token: number) => {
    el.push(<TokenDisplay token={token} />);
    if (getTokenTag(ast, token) === TokenTag.Comma) {
      el.push(<TokenDisplay token={token} />);
    }
  };

  if (field.comptime_token) {
    el.push(<TokenDisplay token={field.comptime_token} />);
  }
  // if (field.ast.type_expr == 0 and field.ast.value_expr == 0) {
  //     if (field.ast.align_expr != 0) {
  //         try renderIdentifier(r, field.ast.main_token, .space, quote); // name
  //         const lparen_token = tree.firstToken(field.ast.align_expr) - 1;
  //         const align_kw = lparen_token - 1;
  //         const rparen_token = tree.lastToken(field.ast.align_expr) + 1;
  //         try renderToken(r, align_kw, .none); // align
  //         try renderToken(r, lparen_token, .none); // (
  //         try renderExpression(r, field.ast.align_expr, .none); // alignment
  //         return renderToken(r, rparen_token, .space); // )
  //     }
  //     return renderIdentifierComma(r, field.ast.main_token, space, quote); // name
  // }
  if (field.ast.type_expr === 0 && field.ast.value_expr === 0) {
    if (field.ast.align_expr !== 0) {
      el.push(<TokenDisplay token={field.ast.main_token} />);
      const lparen = getFirstToken(ast, field.ast.align_expr) - 1;
      const alignKw = lparen - 1;
      const rparen = getLastToken(ast, field.ast.align_expr) + 1;
      el.push(<TokenDisplay token={alignKw} />);
      el.push(<TokenDisplay token={lparen} />);
      el.push(<Expression node={field.ast.align_expr} />);
      el.push(<TokenDisplay token={rparen} />);
    }

    renderTokenComma(el, ast, field.ast.main_token);
    return el;
  }
  // if (field.ast.type_expr != 0 and field.ast.value_expr == 0) {
  //     if (!field.ast.tuple_like) {
  //         try renderIdentifier(r, field.ast.main_token, .none, quote); // name
  //         try renderToken(r, field.ast.main_token + 1, .space); // :
  //     }
  //
  //     if (field.ast.align_expr != 0) {
  //         try renderExpression(r, field.ast.type_expr, .space); // type
  //         const align_token = tree.firstToken(field.ast.align_expr) - 2;
  //         try renderToken(r, align_token, .none); // align
  //         try renderToken(r, align_token + 1, .none); // (
  //         try renderExpression(r, field.ast.align_expr, .none); // alignment
  //         const rparen = tree.lastToken(field.ast.align_expr) + 1;
  //         return renderTokenComma(r, rparen, space); // )
  //     } else {
  //         return renderExpressionComma(r, field.ast.type_expr, space); // type
  //     }
  // }

  if (field.ast.type_expr !== 0 && field.ast.value_expr === 0) {
    if (!field.ast.tuple_like) {
      el.push(<TokenDisplay token={field.ast.main_token} />);
      el.push(<TokenDisplay token={field.ast.main_token + 1} />);
    }
    if (field.ast.align_expr !== 0) {
      el.push(<Expression node={field.ast.type_expr} />);
      const alignToken = getFirstToken(ast, field.ast.align_expr) - 2;
      el.push(<TokenDisplay token={alignToken} />);
      el.push(<TokenDisplay token={alignToken + 1} />);
      el.push(<Expression node={field.ast.align_expr} />);
      const rparen = getLastToken(ast, field.ast.align_expr) + 1;
      renderTokenComma(el, ast, rparen);
    } else {
      renderExpressionComma(el, ast, field.ast.type_expr);
    }
    return el;
  }
  // if (field.ast.type_expr == 0 and field.ast.value_expr != 0) {
  //     try renderIdentifier(r, field.ast.main_token, .space, quote); // name
  //     if (field.ast.align_expr != 0) {
  //         const lparen_token = tree.firstToken(field.ast.align_expr) - 1;
  //         const align_kw = lparen_token - 1;
  //         const rparen_token = tree.lastToken(field.ast.align_expr) + 1;
  //         try renderToken(r, align_kw, .none); // align
  //         try renderToken(r, lparen_token, .none); // (
  //         try renderExpression(r, field.ast.align_expr, .none); // alignment
  //         try renderToken(r, rparen_token, .space); // )
  //     }
  //     try renderToken(r, field.ast.main_token + 1, .space); // =
  //     return renderExpressionComma(r, field.ast.value_expr, space); // value
  // }
  if (field.ast.type_expr === 0 && field.ast.value_expr !== 0) {
    el.push(<TokenDisplay token={field.ast.main_token} />);
    if (field.ast.align_expr !== 0) {
      const lparen = getFirstToken(ast, field.ast.align_expr) - 1;
      const alignKw = lparen - 1;
      const rparen = getLastToken(ast, field.ast.align_expr) + 1;
      el.push(<TokenDisplay token={alignKw} />);
      el.push(<TokenDisplay token={lparen} />);
      el.push(<Expression node={field.ast.align_expr} />);
      el.push(<TokenDisplay token={rparen} />);
    }
    el.push(<TokenDisplay token={field.ast.main_token + 1} />);
    renderExpressionComma(el, ast, field.ast.value_expr);
    return el;
  }
  // if (!field.ast.tuple_like) {
  //     try renderIdentifier(r, field.ast.main_token, .none, quote); // name
  //     try renderToken(r, field.ast.main_token + 1, .space); // :
  // }
  // try renderExpression(r, field.ast.type_expr, .space); // type
  if (!field.ast.tuple_like) {
    el.push(<TokenDisplay token={field.ast.main_token} />);
    el.push(<TokenDisplay token={field.ast.main_token + 1} />);
  }
  el.push(<Expression node={field.ast.type_expr} />);
  //
  // if (field.ast.align_expr != 0) {
  //     const lparen_token = tree.firstToken(field.ast.align_expr) - 1;
  //     const align_kw = lparen_token - 1;
  //     const rparen_token = tree.lastToken(field.ast.align_expr) + 1;
  //     try renderToken(r, align_kw, .none); // align
  //     try renderToken(r, lparen_token, .none); // (
  //     try renderExpression(r, field.ast.align_expr, .none); // alignment
  //     try renderToken(r, rparen_token, .space); // )
  // }
  if (field.ast.align_expr !== 0) {
    const lparen = getFirstToken(ast, field.ast.align_expr) - 1;
    const alignKw = lparen - 1;
    const rparen = getLastToken(ast, field.ast.align_expr) + 1;
    el.push(<TokenDisplay token={alignKw} />);
    el.push(<TokenDisplay token={lparen} />);
    el.push(<Expression node={field.ast.align_expr} />);
    el.push(<TokenDisplay token={rparen} />);
  }
  // const eq_token = tree.firstToken(field.ast.value_expr) - 1;
  const eqToken = getFirstToken(ast, field.ast.value_expr) - 1;
  // const eq_space: Space = if (tree.tokensOnSameLine(eq_token, eq_token + 1)) .space else .newline;
  // {
  //     ais.pushIndent();
  //     try renderToken(r, eq_token, eq_space); // =
  //     ais.popIndent();
  // }
  el.push(<TokenDisplay token={eqToken} />);
  // if (eq_space == .space)
  //     return renderExpressionComma(r, field.ast.value_expr, space); // value
  // el.push(<Expression node={field.ast.value_expr} />);
  renderExpressionComma(el, ast, field.ast.value_expr);
  return el;
  // const token_tags = tree.tokens.items(.tag);
  // const maybe_comma = tree.lastToken(field.ast.value_expr) + 1;
  //
  // if (token_tags[maybe_comma] == .comma) {
  //     ais.pushIndent();
  //     try renderExpression(r, field.ast.value_expr, .none); // value
  //     ais.popIndent();
  //     try renderToken(r, maybe_comma, .newline);
  // } else {
  //     ais.pushIndent();
  //     try renderExpression(r, field.ast.value_expr, space); // value
  //     ais.popIndent();
  // }
  // throw new Error("ContainerFieldBody not implemented");
};

const ContainerField = ({
  container,
  node,
}: NodeComponent<{ container: ContainerType }>) => {
  const { ast } = useAst();
  return (
    <NodeDisplay node={node}>
      <ErrorBoundary fallbackRender={({ error }) => <pre>{error.message}</pre>}>
        <ContainerFieldBody node={node} container={container} />
      </ErrorBoundary>
    </NodeDisplay>
  );
};
const ExpressionBody = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const mainToken = getMainToken(ast, node);
  const data = getNodeData(ast, node);
  //       const tree = r.tree;
  //     const ais = r.ais;
  //     const token_tags = tree.tokens.items(.tag);
  //     const main_tokens = tree.nodes.items(.main_token);
  //     const node_tags = tree.nodes.items(.tag);
  //     const datas = tree.nodes.items(.data);
  //     if (r.fixups.replace_nodes_with_string.get(node)) |replacement| {
  //         try ais.writer().writeAll(replacement);
  //         try renderOnlySpace(r, space);
  //         return;
  //     } else if (r.fixups.replace_nodes_with_node.get(node)) |replacement| {
  //         return renderExpression(r, replacement, space);
  //     }
  switch (getNodeTag(ast, node)) {
    //     switch (node_tags[node]) {
    //         .identifier => {
    //             const token_index = main_tokens[node];
    //             return renderIdentifier(r, token_index, space, .preserve_when_shadowing);
    //         },
    case AstNodeTag.Identifier:
      return <TokenDisplay token={mainToken} />;
    //
    //         .number_literal,
    //         .char_literal,
    //         .unreachable_literal,
    //         .anyframe_literal,
    //         .string_literal,
    //         => return renderToken(r, main_tokens[node], space),
    case AstNodeTag.NumberLiteral:
    case AstNodeTag.CharLiteral:
    case AstNodeTag.UnreachableLiteral:
    case AstNodeTag.AnyframeLiteral:
    case AstNodeTag.StringLiteral:
      return <TokenDisplay token={mainToken} />;

    //
    //         .multiline_string_literal => {
    //             var locked_indents = ais.lockOneShotIndent();
    //             try ais.maybeInsertNewline();
    //
    //             var i = datas[node].lhs;
    //             while (i <= datas[node].rhs) : (i += 1) try renderToken(r, i, .newline);
    //
    //             while (locked_indents > 0) : (locked_indents -= 1) ais.popIndent();
    //
    //             switch (space) {
    //                 .none, .space, .newline, .skip => {},
    //                 .semicolon => if (token_tags[i] == .semicolon) try renderToken(r, i, .newline),
    //                 .comma => if (token_tags[i] == .comma) try renderToken(r, i, .newline),
    //                 .comma_space => if (token_tags[i] == .comma) try renderToken(r, i, .space),
    //             }
    //         },

    case AstNodeTag.MultilineStringLiteral:
      return (
        <>
          {range(data.lhs, data.rhs).map((i) => (
            <TokenDisplay key={i} token={i} />
          ))}
        </>
      );
    //         .error_value => {
    //             try renderToken(r, main_tokens[node], .none);
    //             try renderToken(r, main_tokens[node] + 1, .none);
    //             return renderIdentifier(r, main_tokens[node] + 2, space, .eagerly_unquote);
    //         },
    case AstNodeTag.ErrorValue:
      return (
        <>
          <TokenDisplay token={mainToken} />
          <TokenDisplay token={mainToken + 1} />
          <TokenDisplay token={mainToken + 2} />
        </>
      );

    //
    //         .block_two,
    //         .block_two_semicolon,
    //         => {
    //             const statements = [2]Ast.Node.Index{ datas[node].lhs, datas[node].rhs };
    //             if (datas[node].lhs == 0) {
    //                 return renderBlock(r, node, statements[0..0], space);
    //             } else if (datas[node].rhs == 0) {
    //                 return renderBlock(r, node, statements[0..1], space);
    //             } else {
    //                 return renderBlock(r, node, statements[0..2], space);
    //             }
    //         },
    //         .block,
    //         .block_semicolon,
    //         => {
    //             const statements = tree.extra_data[datas[node].lhs..datas[node].rhs];
    //             return renderBlock(r, node, statements, space);
    //         },
    case AstNodeTag.BlockTwo:
    case AstNodeTag.BlockTwoSemicolon:
    case AstNodeTag.Block:
    case AstNodeTag.BlockSemicolon:
      return <BlockBody node={node} />;

    //         .@"errdefer" => {
    //             const defer_token = main_tokens[node];
    //             const payload_token = datas[node].lhs;
    //             const expr = datas[node].rhs;
    //
    //             try renderToken(r, defer_token, .space);
    //             if (payload_token != 0) {
    //                 try renderToken(r, payload_token - 1, .none); // |
    //                 try renderIdentifier(r, payload_token, .none, .preserve_when_shadowing); // identifier
    //                 try renderToken(r, payload_token + 1, .space); // |
    //             }
    //             return renderExpression(r, expr, space);
    //         },
    case AstNodeTag.Errdefer: {
      const deferToken = mainToken;
      const payloadToken = data.lhs;
      const expr = data.rhs;
      return (
        <>
          <TokenDisplay token={deferToken} />
          {payloadToken !== 0 && (
            <>
              <TokenDisplay token={payloadToken - 1} />
              <TokenDisplay token={payloadToken} />
              <TokenDisplay token={payloadToken + 1} />
            </>
          )}
          <Expression node={expr} />
        </>
      );
    }

    //
    //         .@"defer" => {
    //             const defer_token = main_tokens[node];
    //             const expr = datas[node].rhs;
    //             try renderToken(r, defer_token, .space);
    //             return renderExpression(r, expr, space);
    //         },
    case AstNodeTag.Defer: {
      const deferToken = mainToken;
      const expr = data.rhs;
      return (
        <>
          <TokenDisplay token={deferToken} />
          <Expression node={expr} />
        </>
      );
    }
    //         .@"comptime", .@"nosuspend" => {
    //             const comptime_token = main_tokens[node];
    //             const block = datas[node].lhs;
    //             try renderToken(r, comptime_token, .space);
    //             return renderExpression(r, block, space);
    //         },
    case AstNodeTag.Comptime:
    case AstNodeTag.Nosuspend: {
      const comptimeToken = mainToken;
      const block = data.lhs;
      return (
        <>
          <TokenDisplay token={comptimeToken} />
          <Expression node={block} />
        </>
      );
    }
    //         .@"suspend" => {
    //             const suspend_token = main_tokens[node];
    //             const body = datas[node].lhs;
    //             try renderToken(r, suspend_token, .space);
    //             return renderExpression(r, body, space);
    //         },
    case AstNodeTag.Suspend: {
      const suspendToken = mainToken;
      const body = data.lhs;
      return (
        <>
          <TokenDisplay token={suspendToken} />
          <Expression node={body} />
        </>
      );
    }
    //
    //         .@"catch" => {
    //             const main_token = main_tokens[node];
    //             const fallback_first = tree.firstToken(datas[node].rhs);
    //
    //             const same_line = tree.tokensOnSameLine(main_token, fallback_first);
    //             const after_op_space = if (same_line) Space.space else Space.newline;
    //
    //             try renderExpression(r, datas[node].lhs, .space); // target
    //
    //             if (token_tags[fallback_first - 1] == .pipe) {
    //                 try renderToken(r, main_token, .space); // catch keyword
    //                 try renderToken(r, main_token + 1, .none); // pipe
    //                 try renderIdentifier(r, main_token + 2, .none, .preserve_when_shadowing); // payload identifier
    //                 try renderToken(r, main_token + 3, after_op_space); // pipe
    //             } else {
    //                 assert(token_tags[fallback_first - 1] == .keyword_catch);
    //                 try renderToken(r, main_token, after_op_space); // catch keyword
    //             }
    //
    //             ais.pushIndentOneShot();
    //             try renderExpression(r, datas[node].rhs, space); // fallback
    //         },
    case AstNodeTag.Catch: {
      const fallbackFirst = getFirstToken(ast, data.rhs);

      if (getTokenTag(ast, fallbackFirst - 1) === TokenTag.Pipe) {
        return (
          <>
            <Expression node={data.lhs} />;
            <TokenDisplay token={mainToken} />
            <TokenDisplay token={mainToken + 1} />
            <TokenDisplay token={mainToken + 2} />
            <TokenDisplay token={mainToken + 3} />
            <Expression node={data.rhs} />
          </>
        );
      }
      return (
        <>
          <Expression node={data.lhs} />
          <TokenDisplay token={mainToken} />
          <Expression node={data.rhs} />
        </>
      );
    }
    //         .field_access => {
    //             const main_token = main_tokens[node];
    //             const field_access = datas[node];
    //
    //             try renderExpression(r, field_access.lhs, .none);
    //
    //             // Allow a line break between the lhs and the dot if the lhs and rhs
    //             // are on different lines.
    //             const lhs_last_token = tree.lastToken(field_access.lhs);
    //             const same_line = tree.tokensOnSameLine(lhs_last_token, main_token + 1);
    //             if (!same_line) {
    //                 if (!hasComment(tree, lhs_last_token, main_token)) try ais.insertNewline();
    //                 ais.pushIndentOneShot();
    //             }
    //
    //             try renderToken(r, main_token, .none); // .
    //
    //             // This check ensures that zag() is indented in the following example:
    //             // const x = foo
    //             //     .bar()
    //             //     . // comment
    //             //     zag();
    //             if (!same_line and hasComment(tree, main_token, main_token + 1)) {
    //                 ais.pushIndentOneShot();
    //             }
    //
    //             return renderIdentifier(r, field_access.rhs, space, .eagerly_unquote); // field
    //         },
    case AstNodeTag.FieldAccess: {
      const fieldAccess = data;
      return (
        <>
          <Expression node={fieldAccess.lhs} />
          <TokenDisplay token={mainToken} />
          <TokenDisplay token={fieldAccess.rhs} />
        </>
      );
    }
    //         .error_union,
    //         .switch_range,
    //         => {
    //             const infix = datas[node];
    //             try renderExpression(r, infix.lhs, .none);
    //             try renderToken(r, main_tokens[node], .none);
    //             return renderExpression(r, infix.rhs, space);
    //         },
    case AstNodeTag.ErrorUnion:
    case AstNodeTag.SwitchRange: {
      const infix = data;
      return (
        <>
          <Expression node={infix.lhs} />
          <TokenDisplay token={mainToken} />
          <Expression node={infix.rhs} />
        </>
      );
    }
    //         .for_range => {
    //             const infix = datas[node];
    //             try renderExpression(r, infix.lhs, .none);
    //             if (infix.rhs != 0) {
    //                 try renderToken(r, main_tokens[node], .none);
    //                 return renderExpression(r, infix.rhs, space);
    //             } else {
    //                 return renderToken(r, main_tokens[node], space);
    //             }
    //         },
    case AstNodeTag.ForRange: {
      const infix = data;
      return (
        <>
          <Expression node={infix.lhs} />
          {infix.rhs !== 0 ? (
            <>
              <TokenDisplay token={mainToken} />
              <Expression node={infix.rhs} />
            </>
          ) : (
            <TokenDisplay token={mainToken} />
          )}
        </>
      );
    }

    //         .add,
    //         .add_wrap,
    //         .add_sat,
    //         .array_cat,
    //         .array_mult,
    //         .assign,
    //         .assign_bit_and,
    //         .assign_bit_or,
    //         .assign_shl,
    //         .assign_shl_sat,
    //         .assign_shr,
    //         .assign_bit_xor,
    //         .assign_div,
    //         .assign_sub,
    //         .assign_sub_wrap,
    //         .assign_sub_sat,
    //         .assign_mod,
    //         .assign_add,
    //         .assign_add_wrap,
    //         .assign_add_sat,
    //         .assign_mul,
    //         .assign_mul_wrap,
    //         .assign_mul_sat,
    //         .bang_equal,
    //         .bit_and,
    //         .bit_or,
    //         .shl,
    //         .shl_sat,
    //         .shr,
    //         .bit_xor,
    //         .bool_and,
    //         .bool_or,
    //         .div,
    //         .equal_equal,
    //         .greater_or_equal,
    //         .greater_than,
    //         .less_or_equal,
    //         .less_than,
    //         .merge_error_sets,
    //         .mod,
    //         .mul,
    //         .mul_wrap,
    //         .mul_sat,
    //         .sub,
    //         .sub_wrap,
    //         .sub_sat,
    //         .@"orelse",
    //         => {
    //             const infix = datas[node];
    //             try renderExpression(r, infix.lhs, .space);
    //             const op_token = main_tokens[node];
    //             if (tree.tokensOnSameLine(op_token, op_token + 1)) {
    //                 try renderToken(r, op_token, .space);
    //             } else {
    //                 ais.pushIndent();
    //                 try renderToken(r, op_token, .newline);
    //                 ais.popIndent();
    //             }
    //             ais.pushIndentOneShot();
    //             return renderExpression(r, infix.rhs, space);
    //         },
    case AstNodeTag.Add:
    case AstNodeTag.AddWrap:
    case AstNodeTag.AddSat:
    case AstNodeTag.ArrayCat:
    case AstNodeTag.ArrayMult:
    case AstNodeTag.Assign:
    case AstNodeTag.AssignBitAnd:
    case AstNodeTag.AssignBitOr:
    case AstNodeTag.AssignShl:
    case AstNodeTag.AssignShlSat:
    case AstNodeTag.AssignShr:
    case AstNodeTag.AssignBitXor:
    case AstNodeTag.AssignDiv:
    case AstNodeTag.AssignSub:
    case AstNodeTag.AssignSubWrap:
    case AstNodeTag.AssignSubSat:
    case AstNodeTag.AssignMod:
    case AstNodeTag.AssignAdd:
    case AstNodeTag.AssignAddWrap:
    case AstNodeTag.AssignAddSat:
    case AstNodeTag.AssignMul:
    case AstNodeTag.AssignMulWrap:
    case AstNodeTag.AssignMulSat:
    case AstNodeTag.BangEqual:
    case AstNodeTag.BitAnd:
    case AstNodeTag.BitOr:
    case AstNodeTag.Shl:
    case AstNodeTag.ShlSat:
    case AstNodeTag.Shr:
    case AstNodeTag.BitXor:
    case AstNodeTag.BoolAnd:
    case AstNodeTag.BoolOr:
    case AstNodeTag.Div:
    case AstNodeTag.EqualEqual:
    case AstNodeTag.GreaterOrEqual:
    case AstNodeTag.GreaterThan:
    case AstNodeTag.LessOrEqual:
    case AstNodeTag.LessThan:
    case AstNodeTag.MergeErrorSets:
    case AstNodeTag.Mod:
    case AstNodeTag.Mul:
    case AstNodeTag.MulWrap:
    case AstNodeTag.MulSat:
    case AstNodeTag.Sub:
    case AstNodeTag.SubWrap:
    case AstNodeTag.SubSat:
    case AstNodeTag.Orelse: {
      const infix = data;
      return (
        <>
          <Expression node={infix.lhs} />
          <TokenDisplay token={mainToken} />
          <Expression node={infix.rhs} />
        </>
      );
    }

    //         .assign_destructure => {
    //             const full = tree.assignDestructure(node);
    //             if (full.comptime_token) |comptime_token| {
    //                 try renderToken(r, comptime_token, .space);
    //             }
    //
    //             for (full.ast.variables, 0..) |variable_node, i| {
    //                 const variable_space: Space = if (i == full.ast.variables.len - 1) .space else .comma_space;
    //                 switch (node_tags[variable_node]) {
    //                     .global_var_decl,
    //                     .local_var_decl,
    //                     .simple_var_decl,
    //                     .aligned_var_decl,
    //                     => {
    //                         try renderVarDecl(r, tree.fullVarDecl(variable_node).?, true, variable_space);
    //   },
    //                     else => try renderExpression(r, variable_node, variable_space),
    //                 }
    //             }
    //             if (tree.tokensOnSameLine(full.ast.equal_token, full.ast.equal_token + 1)) {
    //                 try renderToken(r, full.ast.equal_token, .space);
    //             } else {
    //                 ais.pushIndent();
    //                 try renderToken(r, full.ast.equal_token, .newline);
    //                 ais.popIndent();
    //             }
    //             ais.pushIndentOneShot();
    //             return renderExpression(r, full.ast.value_expr, space);
    //         },
    case AstNodeTag.AssignDestructure: {
      const full = assignDestructure(ast, node);
      const el: JSX.Element[] = [];
      if (full.comptime_token) {
        el.push(<TokenDisplay token={full.comptime_token} />);
      }
      let i = 0;
      for (const variables of full.ast.variables) {
        switch (getNodeTag(ast, variables)) {
          case AstNodeTag.GlobalVarDecl:
          case AstNodeTag.LocalVarDecl:
          case AstNodeTag.SimpleVarDecl:
          case AstNodeTag.AlignedVarDecl:
            el.push(<VarDeclBody node={variables} />);
            break;
          default:
            el.push(<Expression node={variables} />);
        }
        i += 1;
      }

      el.push(<TokenDisplay token={full.ast.equal_token} />);
      el.push(<Expression node={full.ast.value_expr} />);
      return el;
    }
    //         .bit_not,
    //         .bool_not,
    //         .negation,
    //         .negation_wrap,
    //         .optional_type,
    //         .address_of,
    //         => {
    //             try renderToken(r, main_tokens[node], .none);
    //             return renderExpression(r, datas[node].lhs, space);
    //         },
    case AstNodeTag.BitNot:
    case AstNodeTag.BoolNot:
    case AstNodeTag.Negation:
    case AstNodeTag.NegationWrap:
    case AstNodeTag.OptionalType:
    case AstNodeTag.AddressOf: {
      return (
        <>
          <TokenDisplay token={mainToken} />
          <Expression node={data.lhs} />
        </>
      );
    }
    //
    //         .@"try",
    //         .@"resume",
    //         .@"await",
    //         => {
    //             try renderToken(r, main_tokens[node], .space);
    //             return renderExpression(r, datas[node].lhs, space);
    //         },
    case AstNodeTag.Try:
    case AstNodeTag.Resume:
    case AstNodeTag.Await: {
      return (
        <>
          <TokenDisplay token={mainToken} />
          <Expression node={data.lhs} />
        </>
      );
    }

    //         .array_type,
    //         .array_type_sentinel,
    //         => return renderArrayType(r, tree.fullArrayType(node).?, space),
    case AstNodeTag.ArrayType:
    case AstNodeTag.ArrayTypeSentinel: {
      return <ArrayTypeBody node={node} />;
    }

    //         .ptr_type_aligned,
    //         .ptr_type_sentinel,
    //         .ptr_type,
    //         .ptr_type_bit_range,
    //         => return renderPtrType(r, tree.fullPtrType(node).?, space),
    case AstNodeTag.PtrTypeAligned:
    case AstNodeTag.PtrTypeSentinel:
    case AstNodeTag.PtrType:
    case AstNodeTag.PtrTypeBitRange: {
      return <PtrTypeBody node={node} />;
    }
    //         .array_init_one,
    //         .array_init_one_comma,
    //         .array_init_dot_two,
    //         .array_init_dot_two_comma,
    //         .array_init_dot,
    //         .array_init_dot_comma,
    //         .array_init,
    //         .array_init_comma,
    //         => {
    //             var elements: [2]Ast.Node.Index = undefined;
    //             return renderArrayInit(r, tree.fullArrayInit(&elements, node).?, space);
    //         },
    case AstNodeTag.ArrayInitOne:
    case AstNodeTag.ArrayInitOneComma:
    case AstNodeTag.ArrayInitDotTwo:
    case AstNodeTag.ArrayInitDotTwoComma:
    case AstNodeTag.ArrayInitDot:
    case AstNodeTag.ArrayInitDotComma:
    case AstNodeTag.ArrayInit:
    case AstNodeTag.ArrayInitComma: {
      return <ArrayInitBody node={node} />;
    }

    //         .struct_init_one,
    //         .struct_init_one_comma,
    //         .struct_init_dot_two,
    //         .struct_init_dot_two_comma,
    //         .struct_init_dot,
    //         .struct_init_dot_comma,
    //         .struct_init,
    //         .struct_init_comma,
    //         => {
    //             var buf: [2]Ast.Node.Index = undefined;
    //             return renderStructInit(r, node, tree.fullStructInit(&buf, node).?, space);
    //         },
    case AstNodeTag.StructInitOne:
    case AstNodeTag.StructInitOneComma:
    case AstNodeTag.StructInitDotTwo:
    case AstNodeTag.StructInitDotTwoComma:
    case AstNodeTag.StructInitDot:
    case AstNodeTag.StructInitDotComma:
    case AstNodeTag.StructInit:
    case AstNodeTag.StructInitComma: {
      return <StructInitBody node={node} />;
    }

    //         .call_one,
    //         .call_one_comma,
    //         .async_call_one,
    //         .async_call_one_comma,
    //         .call,
    //         .call_comma,
    //         .async_call,
    //         .async_call_comma,
    //         => {
    //             var buf: [1]Ast.Node.Index = undefined;
    //             return renderCall(r, tree.fullCall(&buf, node).?, space);
    //         },
    case AstNodeTag.CallOne:
    case AstNodeTag.CallOneComma:
    case AstNodeTag.AsyncCallOne:
    case AstNodeTag.AsyncCallOneComma:
    case AstNodeTag.Call:
    case AstNodeTag.CallComma:
    case AstNodeTag.AsyncCall:
    case AstNodeTag.AsyncCallComma: {
      return <CallBody node={node} />;
    }

    //         .array_access => {
    //             const suffix = datas[node];
    //             const lbracket = tree.firstToken(suffix.rhs) - 1;
    //             const rbracket = tree.lastToken(suffix.rhs) + 1;
    //             const one_line = tree.tokensOnSameLine(lbracket, rbracket);
    //             const inner_space = if (one_line) Space.none else Space.newline;
    //             try renderExpression(r, suffix.lhs, .none);
    //             ais.pushIndentNextLine();
    //             try renderToken(r, lbracket, inner_space); // [
    //             try renderExpression(r, suffix.rhs, inner_space);
    //             ais.popIndent();
    //             return renderToken(r, rbracket, space); // ]
    //         },
    case AstNodeTag.ArrayAccess: {
      const suffix = data;
      const lbracket = getFirstToken(ast, suffix.rhs) - 1;
      const rbracket = getLastToken(ast, suffix.rhs) + 1;
      // const oneLine = tokensOnSameLine(ast, lbracket, rbracket);
      // const innerSpace = oneLine ? Space.None : Space.Newline;
      return (
        <>
          <Expression node={suffix.lhs} />
          <TokenDisplay token={lbracket} />
          <Expression node={suffix.rhs} />
          <TokenDisplay token={rbracket} />
        </>
      );
    }
    //
    //         .slice_open, .slice, .slice_sentinel => return renderSlice(r, node, tree.fullSlice(node).?, space),
    case AstNodeTag.SliceOpen:
    case AstNodeTag.Slice:
    case AstNodeTag.SliceSentinel: {
      return <SliceBody node={node} />;
    }
    //
    //         .deref => {
    //             try renderExpression(r, datas[node].lhs, .none);
    //             return renderToken(r, main_tokens[node], space);
    //         },
    case AstNodeTag.Deref: {
      return (
        <>
          <Expression node={data.lhs} />
          <TokenDisplay token={mainToken} />
        </>
      );
    }
    //         .unwrap_optional => {
    //             try renderExpression(r, datas[node].lhs, .none);
    //             try renderToken(r, main_tokens[node], .none);
    //             return renderToken(r, datas[node].rhs, space);
    //         },
    case AstNodeTag.UnwrapOptional: {
      return (
        <>
          <Expression node={data.lhs} />
          <TokenDisplay token={mainToken} />
          <TokenDisplay token={data.rhs} />
        </>
      );
    }
    //         .@"break" => {
    //             const main_token = main_tokens[node];
    //             const label_token = datas[node].lhs;
    //             const target = datas[node].rhs;
    //             if (label_token == 0 and target == 0) {
    //                 try renderToken(r, main_token, space); // break keyword
    //             } else if (label_token == 0 and target != 0) {
    //                 try renderToken(r, main_token, .space); // break keyword
    //                 try renderExpression(r, target, space);
    //             } else if (label_token != 0 and target == 0) {
    //                 try renderToken(r, main_token, .space); // break keyword
    //                 try renderToken(r, label_token - 1, .none); // colon
    //                 try renderIdentifier(r, label_token, space, .eagerly_unquote); // identifier
    //             } else if (label_token != 0 and target != 0) {
    //                 try renderToken(r, main_token, .space); // break keyword
    //                 try renderToken(r, label_token - 1, .none); // colon
    //                 try renderIdentifier(r, label_token, .space, .eagerly_unquote); // identifier
    //                 try renderExpression(r, target, space);
    //             }
    //         },
    case AstNodeTag.Break: {
      const labelToken = data.lhs;
      const target = data.rhs;
      if (labelToken === 0 && target === 0) {
        return <TokenDisplay token={mainToken} />;
      } else if (labelToken === 0 && target !== 0) {
        return (
          <>
            <TokenDisplay token={mainToken} />
            <Expression node={target} />
          </>
        );
      } else if (labelToken !== 0 && target === 0) {
        return (
          <>
            <TokenDisplay token={mainToken} />
            <TokenDisplay token={labelToken - 1} />
            <TokenDisplay token={labelToken} />
          </>
        );
      } else if (labelToken !== 0 && target !== 0) {
        return (
          <>
            <TokenDisplay token={mainToken} />
            <TokenDisplay token={labelToken - 1} />
            <TokenDisplay token={labelToken} />
            <Expression node={target} />
          </>
        );
      }
    }
    //         .@"continue" => {
    //             const main_token = main_tokens[node];
    //             const label = datas[node].lhs;
    //             if (label != 0) {
    //                 try renderToken(r, main_token, .space); // continue
    //                 try renderToken(r, label - 1, .none); // :
    //                 return renderIdentifier(r, label, space, .eagerly_unquote); // label
    //             } else {
    //                 return renderToken(r, main_token, space); // continue
    //             }
    //         },
    case AstNodeTag.Continue: {
      const label = data.lhs;
      if (label !== 0) {
        return (
          <>
            <TokenDisplay token={mainToken} />
            <TokenDisplay token={label - 1} />
            <TokenDisplay token={label} />
          </>
        );
      } else {
        return <TokenDisplay token={mainToken} />;
      }
    }
    //         .@"return" => {
    //             if (datas[node].lhs != 0) {
    //                 try renderToken(r, main_tokens[node], .space);
    //                 try renderExpression(r, datas[node].lhs, space);
    //             } else {
    //                 try renderToken(r, main_tokens[node], space);
    //             }
    //         },
    case AstNodeTag.Return: {
      if (data.lhs !== 0) {
        return (
          <>
            <TokenDisplay token={mainToken} />
            <Expression node={data.lhs} />
          </>
        );
      } else {
        return <TokenDisplay token={mainToken} />;
      }
    }
    //         .grouped_expression => {
    //             try renderToken(r, main_tokens[node], .none); // lparen
    //             ais.pushIndentOneShot();
    //             try renderExpression(r, datas[node].lhs, .none);
    //             return renderToken(r, datas[node].rhs, space); // rparen
    //         },
    case AstNodeTag.GroupedExpression: {
      return (
        <>
          <TokenDisplay token={mainToken} />
          <Expression node={data.lhs} />
          <TokenDisplay token={data.rhs} />
        </>
      );
    }
    //         .container_decl,
    //         .container_decl_trailing,
    //         .container_decl_arg,
    //         .container_decl_arg_trailing,
    //         .container_decl_two,
    //         .container_decl_two_trailing,
    //         .tagged_union,
    //         .tagged_union_trailing,
    //         .tagged_union_enum_tag,
    //         .tagged_union_enum_tag_trailing,
    //         .tagged_union_two,
    //         .tagged_union_two_trailing,
    //         => {
    //             var buf: [2]Ast.Node.Index = undefined;
    //             return renderContainerDecl(r, node, tree.fullContainerDecl(&buf, node).?, space);
    //         },
    case AstNodeTag.ContainerDecl:
    case AstNodeTag.ContainerDeclTrailing:
    case AstNodeTag.ContainerDeclArg:
    case AstNodeTag.ContainerDeclArgTrailing:
    case AstNodeTag.ContainerDeclTwo:
    case AstNodeTag.ContainerDeclTwoTrailing:
    case AstNodeTag.TaggedUnion:
    case AstNodeTag.TaggedUnionTrailing:
    case AstNodeTag.TaggedUnionEnumTag:
    case AstNodeTag.TaggedUnionEnumTagTrailing:
    case AstNodeTag.TaggedUnionTwo:
    case AstNodeTag.TaggedUnionTwoTrailing: {
      return <ContainerDeclBody node={node} />;
    }
    //         .error_set_decl => {
    //             const error_token = main_tokens[node];
    //             const lbrace = error_token + 1;
    //             const rbrace = datas[node].rhs;
    //
    //             try renderToken(r, error_token, .none);
    //
    //             if (lbrace + 1 == rbrace) {
    //                 // There is nothing between the braces so render condensed: `error{}`
    //                 try renderToken(r, lbrace, .none);
    //                 return renderToken(r, rbrace, space);
    //             } else if (lbrace + 2 == rbrace and token_tags[lbrace + 1] == .identifier) {
    //                 // There is exactly one member and no trailing comma or
    //                 // comments, so render without surrounding spaces: `error{Foo}`
    //                 try renderToken(r, lbrace, .none);
    //                 try renderIdentifier(r, lbrace + 1, .none, .eagerly_unquote); // identifier
    //                 return renderToken(r, rbrace, space);
    //             } else if (token_tags[rbrace - 1] == .comma) {
    //                 // There is a trailing comma so render each member on a new line.
    //                 ais.pushIndentNextLine();
    //                 try renderToken(r, lbrace, .newline);
    //                 var i = lbrace + 1;
    //                 while (i < rbrace) : (i += 1) {
    //                     if (i > lbrace + 1) try renderExtraNewlineToken(r, i);
    //                     switch (token_tags[i]) {
    //                         .doc_comment => try renderToken(r, i, .newline),
    //                         .identifier => try renderIdentifier(r, i, .comma, .eagerly_unquote),
    //                         .comma => {},
    //                         else => unreachable,
    //                     }
    //                 }
    //                 ais.popIndent();
    //                 return renderToken(r, rbrace, space);
    //             } else {
    //                 // There is no trailing comma so render everything on one line.
    //                 try renderToken(r, lbrace, .space);
    //                 var i = lbrace + 1;
    //                 while (i < rbrace) : (i += 1) {
    //                     switch (token_tags[i]) {
    //                         .doc_comment => unreachable, // TODO
    //                         .identifier => try renderIdentifier(r, i, .comma_space, .eagerly_unquote),
    //                         .comma => {},
    //                         else => unreachable,
    //                     }
    //                 }
    //                 return renderToken(r, rbrace, space);
    //             }
    //         },
    case AstNodeTag.ErrorSetDecl: {
      const errorToken = mainToken;
      const lbrace = errorToken + 1;
      const rbrace = data.rhs;
      const el: Array<JSX.Element> = [];
      el.push(<TokenDisplay token={errorToken} />);
      if (lbrace + 1 === rbrace) {
        // There is nothing between the braces so render
        // condensed: `error{}`
        el.push(<TokenDisplay token={lbrace} />);
        el.push(<TokenDisplay token={rbrace} />);
        return el;
      } else if (
        lbrace + 2 === rbrace &&
        getTokenTag(ast, lbrace + 1) === TokenTag.Identifier
      ) {
        // There is exactly one member and no trailing comma or comments,
        // so render without surrounding spaces: `error{Foo}`
        el.push(<TokenDisplay token={lbrace} />);
        el.push(<TokenDisplay token={lbrace + 1} />);
        el.push(<TokenDisplay token={rbrace} />);
        return el;
      } else {
        el.push(<TokenDisplay token={lbrace} />);
        let i = lbrace + 1;
        while (i < rbrace) {
          switch (getTokenTag(ast, i)) {
            case TokenTag.DocComment:
              // try renderToken(r, i, .newline),
              break;
            case TokenTag.Identifier:
              el.push(<TokenDisplay token={i} />);
              break;
            case TokenTag.Comma:
              break;
            default:
              throw new Error("unreachable");
          }
          i += 1;
        }
        el.push(<TokenDisplay token={rbrace} />);
        return el;
      }
    }
    //         .builtin_call_two, .builtin_call_two_comma => {
    //             if (datas[node].lhs == 0) {
    //                 return renderBuiltinCall(r, main_tokens[node], &.{}, space);
    //             } else if (datas[node].rhs == 0) {
    //                 return renderBuiltinCall(r, main_tokens[node], &.{datas[node].lhs}, space);
    //             } else {
    //                 return renderBuiltinCall(r, main_tokens[node], &.{ datas[node].lhs, datas[node].rhs }, space);
    //             }
    //         },
    //         .builtin_call, .builtin_call_comma => {
    //             const params = tree.extra_data[datas[node].lhs..datas[node].rhs];
    //             return renderBuiltinCall(r, main_tokens[node], params, space);
    //         },
    case AstNodeTag.BuiltinCallTwo:
    case AstNodeTag.BuiltinCallTwoComma:
    case AstNodeTag.BuiltinCall:
    case AstNodeTag.BuiltinCallComma: {
      return <BuiltinCallBody node={node} />;
    }

    //
    //         .fn_proto_simple,
    //         .fn_proto_multi,
    //         .fn_proto_one,
    //         .fn_proto,
    //         => {
    //             var buf: [1]Ast.Node.Index = undefined;
    //             return renderFnProto(r, tree.fullFnProto(&buf, node).?, space);
    //         },
    case AstNodeTag.FnProtoSimple:
    case AstNodeTag.FnProtoMulti:
    case AstNodeTag.FnProtoOne:
    case AstNodeTag.FnProto: {
      return <FnProtoBody node={node} />;
    }

    //         .anyframe_type => {
    //             const main_token = main_tokens[node];
    //             if (datas[node].rhs != 0) {
    //                 try renderToken(r, main_token, .none); // anyframe
    //                 try renderToken(r, main_token + 1, .none); // ->
    //                 return renderExpression(r, datas[node].rhs, space);
    //             } else {
    //                 return renderToken(r, main_token, space); // anyframe
    //             }
    //         },
    case AstNodeTag.AnyframeType: {
      const rhs = data.rhs;
      if (rhs !== 0) {
        return (
          <>
            <TokenDisplay token={mainToken} />
            <TokenDisplay token={mainToken + 1} />
            <Expression node={rhs} />
          </>
        );
      } else {
        return <TokenDisplay token={mainToken} />;
      }
    }
    //         .@"switch",
    //         .switch_comma,
    //         => {
    //             const switch_token = main_tokens[node];
    //             const condition = datas[node].lhs;
    //             const extra = tree.extraData(datas[node].rhs, Ast.Node.SubRange);
    //             const cases = tree.extra_data[extra.start..extra.end];
    //             const rparen = tree.lastToken(condition) + 1;
    //
    //             try renderToken(r, switch_token, .space); // switch keyword
    //             try renderToken(r, switch_token + 1, .none); // lparen
    //             try renderExpression(r, condition, .none); // condition expression
    //             try renderToken(r, rparen, .space); // rparen
    //
    //             ais.pushIndentNextLine();
    //             if (cases.len == 0) {
    //                 try renderToken(r, rparen + 1, .none); // lbrace
    //             } else {
    //                 try renderToken(r, rparen + 1, .newline); // lbrace
    //                 try renderExpressions(r, cases, .comma);
    //             }
    //             ais.popIndent();
    //             return renderToken(r, tree.lastToken(node), space); // rbrace
    //         },
    case AstNodeTag.Switch:
    case AstNodeTag.SwitchComma: {
      const switchToken = mainToken;
      const condition = data.lhs;
      const extra = getNodeExtraDataSubRange(ast, data.rhs);
      const cases = getExtraDataSpan(ast, extra.start, extra.end);
      const rparen = getLastToken(ast, condition) + 1;
      const el: Array<JSX.Element> = [];
      el.push(<TokenDisplay token={switchToken} />);
      el.push(<TokenDisplay token={switchToken + 1} />);
      el.push(<Expression node={condition} />);
      el.push(<TokenDisplay token={rparen} />);
      el.push(<TokenDisplay token={rparen + 1} />);
      if (cases.length !== 0) {
        for (const c of cases) {
          el.push(<Expression node={c} />);
        }
      }

      el.push(<TokenDisplay token={getLastToken(ast, node)} />);

      return el;
    }

    //         .switch_case_one,
    //         .switch_case_inline_one,
    //         .switch_case,
    //         .switch_case_inline,
    //         => return renderSwitchCase(r, tree.fullSwitchCase(node).?, space),
    case AstNodeTag.SwitchCaseOne:
    case AstNodeTag.SwitchCaseInlineOne:
    case AstNodeTag.SwitchCase:
    case AstNodeTag.SwitchCaseInline: {
      return <SwitchCaseBody node={node} />;
    }
    //         .while_simple,
    //         .while_cont,
    //         .@"while",
    //         => return renderWhile(r, tree.fullWhile(node).?, space),
    case AstNodeTag.WhileSimple:
    case AstNodeTag.WhileCont:
    case AstNodeTag.While: {
      return <WhileBody node={node} />;
    }

    //         .for_simple,
    //         .@"for",
    //         => return renderFor(r, tree.fullFor(node).?, space),
    case AstNodeTag.ForSimple:
    case AstNodeTag.For: {
      return <ForBody node={node} />;
    }

    //         .if_simple,
    //         .@"if",
    //         => return renderIf(r, tree.fullIf(node).?, space),
    case AstNodeTag.IfSimple:
    case AstNodeTag.If: {
      return <IfBody node={node} />;
    }

    //         .asm_simple,
    //         .@"asm",
    //         => return renderAsm(r, tree.fullAsm(node).?, space),
    case AstNodeTag.AsmSimple:
    case AstNodeTag.Asm: {
      return <AsmBody node={node} />;
    }
    //         .enum_literal => {
    //             try renderToken(r, main_tokens[node] - 1, .none); // .
    //             return renderIdentifier(r, main_tokens[node], space, .eagerly_unquote); // name
    //         },
    case AstNodeTag.EnumLiteral: {
      return (
        <>
          <TokenDisplay token={mainToken - 1} />
          <TokenDisplay token={mainToken} />
        </>
      );
    }

    //         .fn_decl => unreachable,
    //         .container_field => unreachable,
    //         .container_field_init => unreachable,
    //         .container_field_align => unreachable,
    //         .root => unreachable,
    //         .global_var_decl => unreachable,
    //         .local_var_decl => unreachable,
    //         .simple_var_decl => unreachable,
    //         .aligned_var_decl => unreachable,
    //         .@"usingnamespace" => unreachable,
    //         .test_decl => unreachable,
    //         .asm_output => unreachable,
    //         .asm_input => unreachable,
    //     }
    // }
    //
    case AstNodeTag.FnDecl:
    case AstNodeTag.ContainerField:
    case AstNodeTag.ContainerFieldInit:
    case AstNodeTag.ContainerFieldAlign:
    case AstNodeTag.Root:
    case AstNodeTag.GlobalVarDecl:
    case AstNodeTag.LocalVarDecl:
    case AstNodeTag.SimpleVarDecl:
    case AstNodeTag.AlignedVarDecl:
    case AstNodeTag.Usingnamespace:
    case AstNodeTag.TestDecl:
    case AstNodeTag.AsmOutput:
    case AstNodeTag.AsmInput:
      throw new Error("unreachable");
  }
  throw new Error("unreachable");
};
const Expression = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  return (
    <NodeDisplay node={node}>
      {/* <span>{getNodeSource(ast, node)}</span> */}
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <div className="bg-red-500/50">{error.message}</div>
        )}
      >
        <ExpressionBody node={node} />
      </ErrorBoundary>
    </NodeDisplay>
  );
};
type NodeComponent<T = {}> = PropsWithChildren<T & { node: number }>;
const MemberBody = ({
  node,
  container,
}: NodeComponent<{ container: ContainerType }>) => {
  const { ast } = useAst();
  const data = getNodeData(ast, node);
  const mainToken = getMainToken(ast, node);
  const decl = node;

  //   fn renderMember(
  //     r: *Render,
  //     container: Container,
  //     decl: Ast.Node.Index,
  //     space: Space,
  // ) Error!void {
  //     const tree = r.tree;
  //     const ais = r.ais;
  //     const node_tags = tree.nodes.items(.tag);
  //     const token_tags = tree.tokens.items(.tag);
  //     const main_tokens = tree.nodes.items(.main_token);
  //     const datas = tree.nodes.items(.data);
  //     if (r.fixups.omit_nodes.contains(decl)) return;
  //     try renderDocComments(r, tree.firstToken(decl));
  //     switch (tree.nodes.items(.tag)[decl]) {
  switch (getNodeTag(ast, decl)) {
    //         .fn_decl => {
    //             // Some examples:
    //             // pub extern "foo" fn ...
    //             // export fn ...
    //             const fn_proto = datas[decl].lhs;
    //             const fn_token = main_tokens[fn_proto];
    //             // Go back to the first token we should render here.
    //             var i = fn_token;
    //             while (i > 0) {
    //                 i -= 1;
    //                 switch (token_tags[i]) {
    //                     .keyword_extern,
    //                     .keyword_export,
    //                     .keyword_pub,
    //                     .string_literal,
    //                     .keyword_inline,
    //                     .keyword_noinline,
    //                     => continue,
    //
    //                     else => {
    //                         i += 1;
    //                         break;
    //                     },
    //                 }
    //             }
    //             while (i < fn_token) : (i += 1) {
    //                 try renderToken(r, i, .space);
    //             }
    //             switch (tree.nodes.items(.tag)[fn_proto]) {
    //                 .fn_proto_one, .fn_proto => {
    //                     const callconv_expr = if (tree.nodes.items(.tag)[fn_proto] == .fn_proto_one)
    //                         tree.extraData(datas[fn_proto].lhs, Ast.Node.FnProtoOne).callconv_expr
    //                     else
    //                         tree.extraData(datas[fn_proto].lhs, Ast.Node.FnProto).callconv_expr;
    //                     if (callconv_expr != 0 and tree.nodes.items(.tag)[callconv_expr] == .enum_literal) {
    //                         if (mem.eql(u8, "Inline", tree.tokenSlice(main_tokens[callconv_expr]))) {
    //                             try ais.writer().writeAll("inline ");
    //                         }
    //                     }
    //                 },
    //                 .fn_proto_simple, .fn_proto_multi => {},
    //                 else => unreachable,
    //             }
    //             assert(datas[decl].rhs != 0);
    //             try renderExpression(r, fn_proto, .space);
    //             const body_node = datas[decl].rhs;
    //             if (r.fixups.gut_functions.contains(decl)) {
    //                 ais.pushIndent();
    //                 const lbrace = tree.nodes.items(.main_token)[body_node];
    //                 try renderToken(r, lbrace, .newline);
    //                 try discardAllParams(r, fn_proto);
    //                 try ais.writer().writeAll("@trap();");
    //                 ais.popIndent();
    //                 try ais.insertNewline();
    //                 try renderToken(r, tree.lastToken(body_node), space); // rbrace
    //             } else if (r.fixups.unused_var_decls.count() != 0) {
    //                 ais.pushIndentNextLine();
    //                 const lbrace = tree.nodes.items(.main_token)[body_node];
    //                 try renderToken(r, lbrace, .newline);
    //
    //                 var fn_proto_buf: [1]Ast.Node.Index = undefined;
    //                 const full_fn_proto = tree.fullFnProto(&fn_proto_buf, fn_proto).?;
    //                 var it = full_fn_proto.iterate(&tree);
    //                 while (it.next()) |param| {
    //                     const name_ident = param.name_token.?;
    //                     assert(token_tags[name_ident] == .identifier);
    //                     if (r.fixups.unused_var_decls.contains(name_ident)) {
    //                         const w = ais.writer();
    //                         try w.writeAll("_ = ");
    //                         try w.writeAll(tokenSliceForRender(r.tree, name_ident));
    //                         try w.writeAll(";\n");
    //                     }
    //                 }
    //                 var statements_buf: [2]Ast.Node.Index = undefined;
    //                 const statements = switch (node_tags[body_node]) {
    //                     .block_two,
    //                     .block_two_semicolon,
    //                     => b: {
    //                         statements_buf = .{ datas[body_node].lhs, datas[body_node].rhs };
    //                         if (datas[body_node].lhs == 0) {
    //                             break :b statements_buf[0..0];
    //                         } else if (datas[body_node].rhs == 0) {
    //                             break :b statements_buf[0..1];
    //                         } else {
    //                             break :b statements_buf[0..2];
    //                         }
    //                     },
    //                     .block,
    //                     .block_semicolon,
    //                     => tree.extra_data[datas[body_node].lhs..datas[body_node].rhs],
    //
    //                     else => unreachable,
    //                 };
    //                 return finishRenderBlock(r, body_node, statements, space);
    //             } else {
    //                 return renderExpression(r, body_node, space);
    //             }
    //         },
    case AstNodeTag.FnDecl: {
      const fnProto = data.lhs;
      const fnToken = mainToken;
      let i = fnToken;
      while (i > 0) {
        i -= 1;
        switch (getTokenTag(ast, i)) {
          case TokenTag.KeywordExtern:
          case TokenTag.KeywordExport:
          case TokenTag.KeywordPub:
          case TokenTag.StringLiteral:
          case TokenTag.KeywordInline:
          case TokenTag.KeywordNoinline:
            continue;
          default:
            i += 1;
            break;
        }
      }
      const el: Array<JSX.Element> = [];
      while (i < fnToken) {
        el.push(<TokenDisplay token={i} />);
        i += 1;
      }
      switch (getNodeTag(ast, fnProto)) {
        case AstNodeTag.FnProtoOne:
        case AstNodeTag.FnProto: {
          const callconvExpr =
            getNodeExtraDataFnProtoOne(ast, fnProto).callconv_expr ??
            getNodeExtraDataFnProto(ast, fnProto).callconv_expr;
          // if (callconvExpr !== 0) {
          //   if (
          //     getTokenSlice(ast, callconvExpr) === "Inline" &&
          //     getTokenTag(ast, callconvExpr) === TokenTag.EnumLiteral
          //   ) {
          //     el.push(<span>inline </span>);
          //   }
          // }
        }
        case AstNodeTag.FnProtoSimple:
        case AstNodeTag.FnProtoMulti:
          break;
        default: {
          throw new Error("unreachable");
        }
      }

      el.push(<Expression node={fnProto} />);
      const bodyNode = data.rhs;
      el.push(<Expression node={bodyNode} />);
      return el;
    }

    //         .fn_proto_simple,
    //         .fn_proto_multi,
    //         .fn_proto_one,
    //         .fn_proto,
    //         => {
    //             // Extern function prototypes are parsed as these tags.
    //             // Go back to the first token we should render here.
    //             const fn_token = main_tokens[decl];
    //             var i = fn_token;
    //             while (i > 0) {
    //                 i -= 1;
    //                 switch (token_tags[i]) {
    //                     .keyword_extern,
    //                     .keyword_export,
    //                     .keyword_pub,
    //                     .string_literal,
    //                     .keyword_inline,
    //                     .keyword_noinline,
    //                     => continue,
    //
    //                     else => {
    //                         i += 1;
    //                         break;
    //                     },
    //                 }
    //             }
    //             while (i < fn_token) : (i += 1) {
    //                 try renderToken(r, i, .space);
    //             }
    //             try renderExpression(r, decl, .none);
    //             return renderToken(r, tree.lastToken(decl) + 1, space); // semicolon
    //         },
    case AstNodeTag.FnProtoSimple:
    case AstNodeTag.FnProtoMulti:
    case AstNodeTag.FnProtoOne:
    case AstNodeTag.FnProto: {
      const fnToken = mainToken;
      let i = fnToken;
      while (i > 0) {
        i -= 1;
        switch (getTokenTag(ast, i)) {
          case TokenTag.KeywordExtern:
          case TokenTag.KeywordExport:
          case TokenTag.KeywordPub:
          case TokenTag.StringLiteral:
          case TokenTag.KeywordInline:
          case TokenTag.KeywordNoinline:
            continue;
          default:
            i += 1;
            break;
        }
      }
      const el: Array<JSX.Element> = [];
      while (i < fnToken) {
        el.push(<TokenDisplay token={i} />);
        i += 1;
      }
      el.push(<Expression node={decl} />);
      return el;
    }
    //         .@"usingnamespace" => {
    //             const main_token = main_tokens[decl];
    //             const expr = datas[decl].lhs;
    //             if (main_token > 0 and token_tags[main_token - 1] == .keyword_pub) {
    //                 try renderToken(r, main_token - 1, .space); // pub
    //             }
    //             try renderToken(r, main_token, .space); // usingnamespace
    //             try renderExpression(r, expr, .none);
    //             return renderToken(r, tree.lastToken(expr) + 1, space); // ;
    //         },
    case AstNodeTag.Usingnamespace: {
      const expr = data.lhs;
      const el: Array<JSX.Element> = [];
      if (
        mainToken > 0 &&
        getTokenTag(ast, mainToken - 1) === TokenTag.KeywordPub
      ) {
        el.push(<TokenDisplay token={mainToken - 1} />);
      }
      el.push(<TokenDisplay token={mainToken} />);
      el.push(<Expression node={expr} />);
      el.push(<TokenDisplay token={getLastToken(ast, expr) + 1} />);
      return el;
    }
    //         .global_var_decl,
    //         .local_var_decl,
    //         .simple_var_decl,
    //         .aligned_var_decl,
    //         => return renderVarDecl(r, tree.fullVarDecl(decl).?, false, .semicolon),
    case AstNodeTag.GlobalVarDecl:
    case AstNodeTag.LocalVarDecl:
    case AstNodeTag.SimpleVarDecl:
    case AstNodeTag.AlignedVarDecl: {
      return <VarDeclBody node={decl} />;
    }
    //         .test_decl => {
    //             const test_token = main_tokens[decl];
    //             try renderToken(r, test_token, .space);
    //             const test_name_tag = token_tags[test_token + 1];
    //             switch (test_name_tag) {
    //                 .string_literal => try renderToken(r, test_token + 1, .space),
    //                 .identifier => try renderIdentifier(r, test_token + 1, .space, .preserve_when_shadowing),
    //                 else => {},
    //             }
    //             try renderExpression(r, datas[decl].rhs, space);
    //         },

    case AstNodeTag.TestDecl: {
      const testToken = mainToken;
      const testNameTag = getTokenTag(ast, testToken + 1);
      const el: Array<JSX.Element> = [];
      el.push(<TokenDisplay token={testToken} />);
      switch (testNameTag) {
        case TokenTag.StringLiteral:
          el.push(<TokenDisplay token={testToken + 1} />);
          break;
        case TokenTag.Identifier:
          el.push(<TokenDisplay token={testToken + 1} />);
          break;
        default:
          break;
      }
      el.push(<Expression node={data.rhs} />);
      return el;
    }

    //         .container_field_init,
    //         .container_field_align,
    //         .container_field,
    //         => return renderContainerField(r, container, tree.fullContainerField(decl).?, space),
    //
    //         .@"comptime" => return renderExpression(r, decl, space),
    //
    //         .root => unreachable,
    //         else => unreachable,
    //     }
    //
    case AstNodeTag.ContainerFieldInit:
    case AstNodeTag.ContainerFieldAlign:
    case AstNodeTag.ContainerField: {
      return <ContainerField node={decl} container={container} />;
    }
    case AstNodeTag.Comptime: {
      return <Expression node={decl} />;
    }

    default: {
      throw new Error("Decl not implemented");
    }
  }
};
type ContainerType = "enum" | "tuple" | "other";
const Member = ({
  node,
  container,
}: NodeComponent<{ container: ContainerType }>) => {
  const { ast } = useAst();

  //
  // switch (getNodeTag(ast, node)) {
  //   case AstNodeTag.FnDecl:
  //     return <FnDecl key={node} node={node} />;
  //   default:
  //     return (
  //       <NodeDisplay node={node}>
  //         <span>{getNodeSource(ast, node)}</span>
  //       </NodeDisplay>
  //     );
  // }

  return (
    <NodeDisplay node={node}>
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <div className="bg-red-500/50">{error.message}</div>
        )}
      >
        <MemberBody node={node} container={container} />
      </ErrorBoundary>
    </NodeDisplay>
  );
};
const VarDeclBody = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const varDecl = fullVarDecl(ast, node);
  const data = getNodeData(ast, node);
  const el: Array<JSX.Element> = [];
  //   const tree = r.tree;
  // const ais = r.ais;
  //
  // if (var_decl.visib_token) |visib_token| {
  //     try renderToken(r, visib_token, Space.space); // pub
  // }
  if (varDecl.visib_token) {
    el.push(<TokenDisplay token={varDecl.visib_token} />);
  }
  // if (var_decl.extern_export_token) |extern_export_token| {
  //     try renderToken(r, extern_export_token, Space.space); // extern
  //
  //     if (var_decl.lib_name) |lib_name| {
  //         try renderToken(r, lib_name, Space.space); // "lib"
  //     }
  // }
  if (varDecl.extern_export_token) {
    el.push(<TokenDisplay token={varDecl.extern_export_token} />);
    if (varDecl.lib_name) {
      el.push(<TokenDisplay token={varDecl.lib_name} />);
    }
  }
  // if (var_decl.threadlocal_token) |thread_local_token| {
  //     try renderToken(r, thread_local_token, Space.space); // threadlocal
  // }
  if (varDecl.threadlocal_token) {
    el.push(<TokenDisplay token={varDecl.threadlocal_token} />);
  }
  //
  // if (!ignore_comptime_token) {
  //     if (var_decl.comptime_token) |comptime_token| {
  //         try renderToken(r, comptime_token, Space.space); // comptime
  //     }
  // }
  if (varDecl.comptime_token) {
    el.push(<TokenDisplay token={varDecl.comptime_token} />);
  }
  // try renderToken(r, var_decl.ast.mut_token, .space); // var
  el.push(<TokenDisplay token={varDecl.ast.mut_token} />);
  // if (var_decl.ast.type_node != 0 or var_decl.ast.align_node != 0 or
  //     var_decl.ast.addrspace_node != 0 or var_decl.ast.section_node != 0 or
  //     var_decl.ast.init_node != 0)
  // {
  //     const name_space = if (var_decl.ast.type_node == 0 and
  //         (var_decl.ast.align_node != 0 or
  //         var_decl.ast.addrspace_node != 0 or
  //         var_decl.ast.section_node != 0 or
  //         var_decl.ast.init_node != 0))
  //         Space.space
  //     else
  //         Space.none;
  //
  //     try renderIdentifier(r, var_decl.ast.mut_token + 1, name_space, .preserve_when_shadowing); // name
  // } else {
  //     return renderIdentifier(r, var_decl.ast.mut_token + 1, space, .preserve_when_shadowing); // name
  // }
  if (
    varDecl.ast.type_node !== 0 ||
    varDecl.ast.align_node !== 0 ||
    varDecl.ast.addrspace_node !== 0 ||
    varDecl.ast.section_node !== 0 ||
    varDecl.ast.init_node !== 0
  ) {
    el.push(<TokenDisplay token={varDecl.ast.mut_token + 1} />);
  } else {
    el.push(<TokenDisplay token={varDecl.ast.mut_token + 1} />);
    return el;
  }
  // if (var_decl.ast.type_node != 0) {
  //     try renderToken(r, var_decl.ast.mut_token + 2, Space.space); // :
  //     if (var_decl.ast.align_node != 0 or var_decl.ast.addrspace_node != 0 or
  //         var_decl.ast.section_node != 0 or var_decl.ast.init_node != 0)
  //     {
  //         try renderExpression(r, var_decl.ast.type_node, .space);
  //     } else {
  //         return renderExpression(r, var_decl.ast.type_node, space);
  //     }
  // }
  if (varDecl.ast.type_node !== 0) {
    el.push(<TokenDisplay token={varDecl.ast.mut_token + 2} />);
    el.push(<Expression node={varDecl.ast.type_node} />);
  }
  // if (var_decl.ast.align_node != 0) {
  //     const lparen = tree.firstToken(var_decl.ast.align_node) - 1;
  //     const align_kw = lparen - 1;
  //     const rparen = tree.lastToken(var_decl.ast.align_node) + 1;
  //     try renderToken(r, align_kw, Space.none); // align
  //     try renderToken(r, lparen, Space.none); // (
  //     try renderExpression(r, var_decl.ast.align_node, Space.none);
  //     if (var_decl.ast.addrspace_node != 0 or var_decl.ast.section_node != 0 or
  //         var_decl.ast.init_node != 0)
  //     {
  //         try renderToken(r, rparen, .space); // )
  //     } else {
  //         return renderToken(r, rparen, space); // )
  //     }
  // }
  if (varDecl.ast.align_node !== 0) {
    const lparen = getFirstToken(ast, varDecl.ast.align_node) - 1;
    const alignKw = lparen - 1;
    const rparen = getLastToken(ast, varDecl.ast.align_node) + 1;
    el.push(<TokenDisplay token={alignKw} />);
    el.push(<TokenDisplay token={lparen} />);
    el.push(<Expression node={varDecl.ast.align_node} />);
    if (
      varDecl.ast.addrspace_node !== 0 ||
      varDecl.ast.section_node !== 0 ||
      varDecl.ast.init_node !== 0
    ) {
      el.push(<TokenDisplay token={rparen} />);
    } else {
      el.push(<TokenDisplay token={rparen} />);
      return el;
    }
  }
  // if (var_decl.ast.addrspace_node != 0) {
  //     const lparen = tree.firstToken(var_decl.ast.addrspace_node) - 1;
  //     const addrspace_kw = lparen - 1;
  //     const rparen = tree.lastToken(var_decl.ast.addrspace_node) + 1;
  //     try renderToken(r, addrspace_kw, Space.none); // addrspace
  //     try renderToken(r, lparen, Space.none); // (
  //     try renderExpression(r, var_decl.ast.addrspace_node, Space.none);
  //     if (var_decl.ast.section_node != 0 or var_decl.ast.init_node != 0) {
  //         try renderToken(r, rparen, .space); // )
  //     } else {
  //         try renderToken(r, rparen, .none); // )
  //         return renderToken(r, rparen + 1, Space.newline); // ;
  //     }
  // }
  if (varDecl.ast.addrspace_node !== 0) {
    const lparen = getFirstToken(ast, varDecl.ast.addrspace_node) - 1;
    const addrspaceKw = lparen - 1;
    const rparen = getLastToken(ast, varDecl.ast.addrspace_node) + 1;
    el.push(<TokenDisplay token={addrspaceKw} />);
    el.push(<TokenDisplay token={lparen} />);
    el.push(<Expression node={varDecl.ast.addrspace_node} />);
    if (varDecl.ast.section_node !== 0 || varDecl.ast.init_node !== 0) {
      el.push(<TokenDisplay token={rparen} />);
    } else {
      el.push(<TokenDisplay token={rparen} />);
      el.push(<TokenDisplay token={rparen + 1} />);
      return el;
    }
  }
  // if (var_decl.ast.section_node != 0) {
  //     const lparen = tree.firstToken(var_decl.ast.section_node) - 1;
  //     const section_kw = lparen - 1;
  //     const rparen = tree.lastToken(var_decl.ast.section_node) + 1;
  //     try renderToken(r, section_kw, Space.none); // linksection
  //     try renderToken(r, lparen, Space.none); // (
  //     try renderExpression(r, var_decl.ast.section_node, Space.none);
  //     if (var_decl.ast.init_node != 0) {
  //         try renderToken(r, rparen, .space); // )
  //     } else {
  //         return renderToken(r, rparen, space); // )
  //     }
  // }
  if (varDecl.ast.section_node !== 0) {
    const lparen = getFirstToken(ast, varDecl.ast.section_node) - 1;
    const sectionKw = lparen - 1;
    const rparen = getLastToken(ast, varDecl.ast.section_node) + 1;
    el.push(<TokenDisplay token={sectionKw} />);
    el.push(<TokenDisplay token={lparen} />);
    el.push(<Expression node={varDecl.ast.section_node} />);
    if (varDecl.ast.init_node !== 0) {
      el.push(<TokenDisplay token={rparen} />);
    } else {
      el.push(<TokenDisplay token={rparen} />);
      return el;
    }
  }
  // assert(var_decl.ast.init_node != 0);
  //
  // const eq_token = tree.firstToken(var_decl.ast.init_node) - 1;
  // const eq_space: Space = if (tree.tokensOnSameLine(eq_token, eq_token + 1)) .space else .newline;
  // {
  //     ais.pushIndent();
  //     try renderToken(r, eq_token, eq_space); // =
  //     ais.popIndent();
  const eqToken = getFirstToken(ast, varDecl.ast.init_node) - 1;
  el.push(<TokenDisplay token={eqToken} />);
  // ais.pushIndentOneShot();
  // return renderExpression(r, var_decl.ast.init_node, space); // ;
  el.push(<Expression node={varDecl.ast.init_node} />);
  return el;
};
const VarDecl = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  return (
    <NodeDisplay node={node}>
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <div className="bg-red-500/50">{error.message}</div>
        )}
      >
        <VarDeclBody node={node} />
      </ErrorBoundary>
    </NodeDisplay>
  );
};
const someMembersAreNotTupleLike = (ast: number, members: Array<number>) =>
  members.some((member) => {
    return fullContainerField(ast, member)?.ast.tuple_like ?? true;
  });

const Members = ({ children, node }: NodeComponent) => {
  const { ast } = useAst();
  const decl = containerDeclRoot(ast);
  if (decl.ast.members.length === 0) {
    return null;
  }
  const container: ContainerType = someMembersAreNotTupleLike(
    ast,
    decl.ast.members,
  )
    ? "other"
    : "tuple";

  return (
    <NodeDisplay node={node}>
      {decl.ast.members.map((member) => (
        <Member node={member} container={container} />
      ))}
    </NodeDisplay>
  );
};

const TokenDisplay = ({ token }: { token: number }) => {
  const { ast, setActive, active } = useAst();
  const tag = getTokenTag(ast, token);
  return (
    <div
      className=" px-4 text-xs flex gap-2  py-1"
      onClick={() => {
        if (active?.kind === "token" && active.id === token) {
          setActive(null);
          return;
        }
        setActive({
          kind: "token",
          id: token,
        });
      }}
    >
      <span className="text-gray-400">
        .{TokenTagMap[tag]} "{tokenSlice(ast, token)}"
      </span>
      <span className="text-xs opacity-50 border p-1 px-2 rounded-sm">
        Tok #{token}
      </span>
    </div>
  );
};

const FnProtoBody = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const data = getNodeData(ast, node);
  const mainToken = getMainToken(ast, node);
  const fnProto = fullFnProto(ast, node);

  //   fn renderFnProto(r: *Render, fn_proto: Ast.full.FnProto, space: Space) Error!void {
  //     const tree = r.tree;
  //     const ais = r.ais;
  //     const token_tags = tree.tokens.items(.tag);
  //     const token_starts = tree.tokens.items(.start);
  //
  //     const after_fn_token = fn_proto.ast.fn_token + 1;

  const el: Array<JSX.Element> = [];
  const afterFnToken = fnProto.ast.fn_token + 1;
  let lparen: number;
  if (getTokenTag(ast, afterFnToken) === TokenTag.Identifier) {
    lparen = afterFnToken + 1;
    el.push(<TokenDisplay token={fnProto.ast.fn_token} />);
    el.push(<TokenDisplay token={afterFnToken} />);
  } else {
    lparen = afterFnToken;
    el.push(<TokenDisplay token={fnProto.ast.fn_token} />);
  }

  el.push(<TokenDisplay token={lparen} />);
  //     const lparen = if (token_tags[after_fn_token] == .identifier) blk: {
  //         try renderToken(r, fn_proto.ast.fn_token, .space); // fn
  //         try renderIdentifier(r, after_fn_token, .none, .preserve_when_shadowing); // name
  //         break :blk after_fn_token + 1;
  //     } else blk: {
  //         try renderToken(r, fn_proto.ast.fn_token, .space); // fn
  //         break :blk fn_proto.ast.fn_token + 1;
  //     };
  //     assert(token_tags[lparen] == .l_paren);
  //
  //     const maybe_bang = tree.firstToken(fn_proto.ast.return_type) - 1;

  //     const rparen = blk: {
  //         // These may appear in any order, so we have to check the token_starts array
  //         // to find out which is first.
  //         var rparen = if (token_tags[maybe_bang] == .bang) maybe_bang - 1 else maybe_bang;
  //         var smallest_start = token_starts[maybe_bang];
  //         if (fn_proto.ast.align_expr != 0) {
  //             const tok = tree.firstToken(fn_proto.ast.align_expr) - 3;
  //             const start = token_starts[tok];
  //             if (start < smallest_start) {
  //                 rparen = tok;
  //                 smallest_start = start;
  //             }
  //         }
  //         if (fn_proto.ast.addrspace_expr != 0) {
  //             const tok = tree.firstToken(fn_proto.ast.addrspace_expr) - 3;
  //             const start = token_starts[tok];
  //             if (start < smallest_start) {
  //                 rparen = tok;
  //                 smallest_start = start;
  //             }
  //         }
  //         if (fn_proto.ast.section_expr != 0) {
  //             const tok = tree.firstToken(fn_proto.ast.section_expr) - 3;
  //             const start = token_starts[tok];
  //             if (start < smallest_start) {
  //                 rparen = tok;
  //                 smallest_start = start;
  //             }
  //         }
  //         if (fn_proto.ast.callconv_expr != 0) {
  //             const tok = tree.firstToken(fn_proto.ast.callconv_expr) - 3;
  //             const start = token_starts[tok];
  //             if (start < smallest_start) {
  //                 rparen = tok;
  //                 smallest_start = start;
  //             }
  //         }
  //         break :blk rparen;
  //     };
  const maybeBang = getFirstToken(ast, fnProto.ast.return_type) - 1;

  const rparen = useMemo(() => {
    let rparen = maybeBang;
    let smallestStart = getTokenStart(ast, maybeBang);
    if (fnProto.ast.align_expr !== 0) {
      const tok = getFirstToken(ast, fnProto.ast.align_expr) - 3;
      const start = getTokenStart(ast, tok);
      if (start < smallestStart) {
        rparen = tok;
        smallestStart = start;
      }
    }
    if (fnProto.ast.addrspace_expr !== 0) {
      const tok = getFirstToken(ast, fnProto.ast.addrspace_expr) - 3;
      const start = getTokenStart(ast, tok);
      if (start < smallestStart) {
        rparen = tok;
        smallestStart = start;
      }
    }
    if (fnProto.ast.section_expr !== 0) {
      const tok = getFirstToken(ast, fnProto.ast.section_expr) - 3;
      const start = getTokenStart(ast, tok);
      if (start < smallestStart) {
        rparen = tok;
        smallestStart = start;
      }
    }
    if (fnProto.ast.callconv_expr !== 0) {
      const tok = getFirstToken(ast, fnProto.ast.callconv_expr) - 3;
      const start = getTokenStart(ast, tok);
      if (start < smallestStart) {
        rparen = tok;
        smallestStart = start;
      }
    }
    return rparen;
  }, [ast, fnProto]);

  //     assert(token_tags[rparen] == .r_paren);
  //
  //     // The params list is a sparse set that does *not* include anytype or ... parameters.
  //
  //     const trailing_comma = token_tags[rparen - 1] == .comma;
  const trailingComma = getTokenTag(ast, rparen - 1) === TokenTag.Comma;
  let param_i = 0;
  let lastParamToken = lparen;
  while (true) {
    lastParamToken += 1;
    const tag = getTokenTag(ast, lastParamToken);
    if (tag === TokenTag.DocComment || tag === TokenTag.Ellipsis3) {
      el.push(<TokenDisplay token={lastParamToken} />);
      continue;
    } else if (
      tag === TokenTag.KeywordNoalias ||
      tag === TokenTag.KeywordComptime
    ) {
      el.push(<TokenDisplay token={lastParamToken} />);
      lastParamToken += 1;
    } else if (tag === TokenTag.Identifier) {
    } else if (tag === TokenTag.KeywordAnytype) {
      el.push(<TokenDisplay token={lastParamToken} />);
      continue;
    } else if (tag === TokenTag.RParen) {
      break;
    } else if (tag === TokenTag.Comma) {
      el.push(<TokenDisplay token={lastParamToken} />);
      continue;
    }

    if (tag === TokenTag.Identifier) {
      el.push(<TokenDisplay token={lastParamToken} />);
      lastParamToken += 1;
      if (getTokenTag(ast, lastParamToken) === TokenTag.Colon) {
        el.push(<TokenDisplay token={lastParamToken} />);
        lastParamToken += 1;
      }
    }
    if (getTokenTag(ast, lastParamToken) === TokenTag.KeywordAnytype) {
      el.push(<TokenDisplay token={lastParamToken} />);
      continue;
    }

    const param = fnProto.ast.params[param_i];
    param_i += 1;
    el.push(<Expression node={param} />);
    lastParamToken = getLastToken(ast, param);
  }

  //     if (!trailing_comma and !hasComment(tree, lparen, rparen)) {
  //         // Render all on one line, no trailing comma.
  //         try renderToken(r, lparen, .none); // (
  //
  //         var param_i: usize = 0;
  //         var last_param_token = lparen;
  //         while (true) {
  //             last_param_token += 1;
  //             switch (token_tags[last_param_token]) {
  //                 .doc_comment => {
  //                     try renderToken(r, last_param_token, .newline);
  //                     continue;
  //                 },
  //                 .ellipsis3 => {
  //                     try renderToken(r, last_param_token, .none); // ...
  //                     break;
  //                 },
  //                 .keyword_noalias, .keyword_comptime => {
  //                     try renderToken(r, last_param_token, .space);
  //                     last_param_token += 1;
  //                 },
  //                 .identifier => {},
  //                 .keyword_anytype => {
  //                     try renderToken(r, last_param_token, .none); // anytype
  //                     continue;
  //                 },
  //                 .r_paren => break,
  //                 .comma => {
  //                     try renderToken(r, last_param_token, .space); // ,
  //                     continue;
  //                 },
  //                 else => {}, // Parameter type without a name.
  //             }
  //             if (token_tags[last_param_token] == .identifier and
  //                 token_tags[last_param_token + 1] == .colon)
  //             {
  //                 try renderIdentifier(r, last_param_token, .none, .preserve_when_shadowing); // name
  //                 last_param_token += 1;
  //                 try renderToken(r, last_param_token, .space); // :
  //                 last_param_token += 1;
  //             }
  //             if (token_tags[last_param_token] == .keyword_anytype) {
  //                 try renderToken(r, last_param_token, .none); // anytype
  //                 continue;
  //             }
  //             const param = fn_proto.ast.params[param_i];
  //             param_i += 1;
  //             try renderExpression(r, param, .none);
  //             last_param_token = tree.lastToken(param);
  //         }
  //     } else {
  //         // One param per line.
  //         ais.pushIndent();
  //         try renderToken(r, lparen, .newline); // (
  //
  //         var param_i: usize = 0;
  //         var last_param_token = lparen;
  //         while (true) {
  //             last_param_token += 1;
  //             switch (token_tags[last_param_token]) {
  //                 .doc_comment => {
  //                     try renderToken(r, last_param_token, .newline);
  //                     continue;
  //                 },
  //                 .ellipsis3 => {
  //                     try renderToken(r, last_param_token, .comma); // ...
  //                     break;
  //                 },
  //                 .keyword_noalias, .keyword_comptime => {
  //                     try renderToken(r, last_param_token, .space);
  //                     last_param_token += 1;
  //                 },
  //                 .identifier => {},
  //                 .keyword_anytype => {
  //                     try renderToken(r, last_param_token, .comma); // anytype
  //                     if (token_tags[last_param_token + 1] == .comma)
  //                         last_param_token += 1;
  //                     continue;
  //                 },
  //                 .r_paren => break,
  //                 else => {}, // Parameter type without a name.
  //             }
  //             if (token_tags[last_param_token] == .identifier and
  //                 token_tags[last_param_token + 1] == .colon)
  //             {
  //                 try renderIdentifier(r, last_param_token, .none, .preserve_when_shadowing); // name
  //                 last_param_token += 1;
  //                 try renderToken(r, last_param_token, .space); // :
  //                 last_param_token += 1;
  //             }
  //             if (token_tags[last_param_token] == .keyword_anytype) {
  //                 try renderToken(r, last_param_token, .comma); // anytype
  //                 if (token_tags[last_param_token + 1] == .comma)
  //                     last_param_token += 1;
  //                 continue;
  //             }
  //             const param = fn_proto.ast.params[param_i];
  //             param_i += 1;
  //             try renderExpression(r, param, .comma);
  //             last_param_token = tree.lastToken(param);
  //             if (token_tags[last_param_token + 1] == .comma) last_param_token += 1;
  //         }
  //         ais.popIndent();
  //     }
  //
  //     try renderToken(r, rparen, .space); // )
  el.push(<TokenDisplay token={rparen} />);
  //
  //     if (fn_proto.ast.align_expr != 0) {
  //         const align_lparen = tree.firstToken(fn_proto.ast.align_expr) - 1;
  //         const align_rparen = tree.lastToken(fn_proto.ast.align_expr) + 1;
  //
  //         try renderToken(r, align_lparen - 1, .none); // align
  //         try renderToken(r, align_lparen, .none); // (
  //         try renderExpression(r, fn_proto.ast.align_expr, .none);
  //         try renderToken(r, align_rparen, .space); // )
  //     }
  if (fnProto.ast.align_expr !== 0) {
    const alignLparen = getFirstToken(ast, fnProto.ast.align_expr) - 1;
    const alignRparen = getLastToken(ast, fnProto.ast.align_expr) + 1;
    el.push(<TokenDisplay token={alignLparen - 1} />);
    el.push(<TokenDisplay token={alignLparen} />);
    el.push(<Expression node={fnProto.ast.align_expr} />);
    el.push(<TokenDisplay token={alignRparen} />);
  }

  //     if (fn_proto.ast.addrspace_expr != 0) {
  //         const align_lparen = tree.firstToken(fn_proto.ast.addrspace_expr) - 1;
  //         const align_rparen = tree.lastToken(fn_proto.ast.addrspace_expr) + 1;
  //
  //         try renderToken(r, align_lparen - 1, .none); // addrspace
  //         try renderToken(r, align_lparen, .none); // (
  //         try renderExpression(r, fn_proto.ast.addrspace_expr, .none);
  //         try renderToken(r, align_rparen, .space); // )
  //     }
  if (fnProto.ast.addrspace_expr !== 0) {
    const addrspaceLparen = getFirstToken(ast, fnProto.ast.addrspace_expr) - 1;
    const addrspaceRparen = getLastToken(ast, fnProto.ast.addrspace_expr) + 1;
    el.push(<TokenDisplay token={addrspaceLparen - 1} />);
    el.push(<TokenDisplay token={addrspaceLparen} />);
    el.push(<Expression node={fnProto.ast.addrspace_expr} />);
    el.push(<TokenDisplay token={addrspaceRparen} />);
  }
  //     if (fn_proto.ast.section_expr != 0) {
  //         const section_lparen = tree.firstToken(fn_proto.ast.section_expr) - 1;
  //         const section_rparen = tree.lastToken(fn_proto.ast.section_expr) + 1;
  //
  //         try renderToken(r, section_lparen - 1, .none); // section
  //         try renderToken(r, section_lparen, .none); // (
  //         try renderExpression(r, fn_proto.ast.section_expr, .none);
  //         try renderToken(r, section_rparen, .space); // )
  //     }
  if (fnProto.ast.section_expr !== 0) {
    const sectionLparen = getFirstToken(ast, fnProto.ast.section_expr) - 1;
    const sectionRparen = getLastToken(ast, fnProto.ast.section_expr) + 1;
    el.push(<TokenDisplay token={sectionLparen - 1} />);
    el.push(<TokenDisplay token={sectionLparen} />);
    el.push(<Expression node={fnProto.ast.section_expr} />);
    el.push(<TokenDisplay token={sectionRparen} />);
  }

  const isCallconvInline =
    tokenSlice(ast, fnProto.ast.callconv_expr) === "Inline";
  const isDeclaration = fnProto.name_token !== null;
  if (fnProto.ast.callconv_expr !== 0 && !(isDeclaration && isCallconvInline)) {
    const callconvLparen = getFirstToken(ast, fnProto.ast.callconv_expr) - 1;
    const callconvRparen = getLastToken(ast, fnProto.ast.callconv_expr) + 1;

    el.push(<TokenDisplay token={callconvLparen - 1} />);
    el.push(<TokenDisplay token={callconvLparen} />);
    el.push(<Expression node={fnProto.ast.callconv_expr} />);
    el.push(<TokenDisplay token={callconvRparen} />);
  }
  //     const is_callconv_inline = mem.eql(u8, "Inline", tree.tokenSlice(tree.nodes.items(.main_token)[fn_proto.ast.callconv_expr]));
  //     const is_declaration = fn_proto.name_token != null;
  //     if (fn_proto.ast.callconv_expr != 0 and !(is_declaration and is_callconv_inline)) {
  //         const callconv_lparen = tree.firstToken(fn_proto.ast.callconv_expr) - 1;
  //         const callconv_rparen = tree.lastToken(fn_proto.ast.callconv_expr) + 1;
  //
  //         try renderToken(r, callconv_lparen - 1, .none); // callconv
  //         try renderToken(r, callconv_lparen, .none); // (
  //         try renderExpression(r, fn_proto.ast.callconv_expr, .none);
  //         try renderToken(r, callconv_rparen, .space); // )
  //     }
  //
  //     if (token_tags[maybe_bang] == .bang) {
  //         try renderToken(r, maybe_bang, .none); // !
  //     }
  if (getTokenTag(ast, maybeBang) === TokenTag.Bang) {
    el.push(<TokenDisplay token={maybeBang} />);
  }
  //     return renderExpression(r, fn_proto.ast.return_type, space);
  // }
  el.push(<Expression node={fnProto.ast.return_type} />);
  //
  return el;
};
const FnProto = ({ node }: NodeComponent) => {
  const { ast } = useAst();

  return (
    <NodeDisplay node={node}>
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <div className="bg-red-500/50">{error.message}</div>
        )}
      >
        <FnProtoBody node={node} />
      </ErrorBoundary>
    </NodeDisplay>
  );
};

const NodeRef = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  return (
    <span
      className="inline-block border p-1 rounded"
      title={getNodeSource(ast, node)}
    >
      #Node {node} "{getNodeTagLabel(ast, node)}"
    </span>
  );
};
const BlockBody = ({ node }: NodeComponent) => {
  //   const tree = r.tree;
  // const ais = r.ais;
  // const token_tags = tree.tokens.items(.tag);
  // const lbrace = tree.nodes.items(.main_token)[block_node];
  //
  // if (token_tags[lbrace - 1] == .colon and
  //     token_tags[lbrace - 2] == .identifier)
  // {
  //     try renderIdentifier(r, lbrace - 2, .none, .eagerly_unquote); // identifier
  //     try renderToken(r, lbrace - 1, .space); // :
  // }
  // ais.pushIndentNextLine();
  // if (statements.len == 0) {
  //     try renderToken(r, lbrace, .none);
  //     ais.popIndent();
  //     try renderToken(r, tree.lastToken(block_node), space); // rbrace
  //     return;
  // }
  // try renderToken(r, lbrace, .newline);
  // return finishRenderBlock(r, block_node, statements, space);
  //
  const { ast } = useAst();

  const nodeData = getNodeData(ast, node);
  const statements: AstNodeIndex[] = useMemo(() => {
    switch (getNodeTag(ast, node)) {
      case AstNodeTag.BlockTwo:
      case AstNodeTag.BlockTwoSemicolon: {
        const statements = [];
        if (nodeData.lhs > 0) statements.push(nodeData.lhs);
        if (nodeData.rhs > 0) statements.push(nodeData.rhs);
        return statements;
      }
      case AstNodeTag.Block:
      case AstNodeTag.BlockSemicolon: {
        return getExtraDataSpan(ast, nodeData.lhs, nodeData.rhs);
      }
      default:
        throw new Error("Invalid block node");
    }
  }, [ast, node]);
  const el: Array<JSX.Element> = [];
  const lbrace = getMainToken(ast, node);
  el.push(<TokenDisplay token={lbrace} />);

  if (
    getTokenTag(ast, lbrace - 1) === TokenTag.Colon &&
    getTokenTag(ast, lbrace - 2) === TokenTag.Identifier
  ) {
    el.push(<TokenDisplay token={lbrace - 2} />);
    el.push(<TokenDisplay token={lbrace - 1} />);
  }
  if (statements.length === 0) {
    el.push(<TokenDisplay token={lbrace} />);
    el.push(<TokenDisplay token={getLastToken(ast, node)} />);
    return el;
  }

  // const tree = r.tree;
  // const node_tags = tree.nodes.items(.tag);
  // const ais = r.ais;
  // for (statements, 0..) |stmt, i| {
  //     if (i != 0) try renderExtraNewline(r, stmt);
  //     if (r.fixups.omit_nodes.contains(stmt)) continue;
  //     switch (node_tags[stmt]) {
  //         .global_var_decl,
  //         .local_var_decl,
  //         .simple_var_decl,
  //         .aligned_var_decl,
  //         => try renderVarDecl(r, tree.fullVarDecl(stmt).?, false, .semicolon),
  //
  //         else => try renderExpression(r, stmt, .semicolon),
  //     }
  // }
  // ais.popIndent();
  //
  // try renderToken(r, tree.lastToken(block_node), space); // rbrace
  for (const statement of statements) {
    switch (getNodeTag(ast, statement)) {
      case AstNodeTag.GlobalVarDecl:
      case AstNodeTag.LocalVarDecl:
      case AstNodeTag.SimpleVarDecl:
      case AstNodeTag.AlignedVarDecl: {
        console.log("var decl", statement);
        el.push(<VarDecl node={statement} />);
        break;
      }
      default:
        el.push(<Expression node={statement} />);
    }
    const afterLastToken = getLastToken(ast, statement) + 1;
    if (getTokenTag(ast, afterLastToken) === TokenTag.Semicolon) {
      el.push(<TokenDisplay token={afterLastToken} />);
    }
  }

  el.push(<TokenDisplay token={getLastToken(ast, node)} />);
  return el;
};
const Block = ({ node }: NodeComponent) => {
  // const { ast } = useAst();
  // const nodeData = getNodeData(ast, node);
  // const statements: AstNodeIndex[] = useMemo(() => {
  //   switch (getNodeTag(ast, node)) {
  //     case AstNodeTag.BlockTwo:
  //     case AstNodeTag.BlockTwoSemicolon: {
  //       const statements = [];
  //       if (nodeData.lhs > 0) statements.push(nodeData.lhs);
  //       if (nodeData.rhs > 0) statements.push(nodeData.rhs);
  //       return statements;
  //     }
  //     case AstNodeTag.Block:
  //     case AstNodeTag.BlockSemicolon: {
  //       return getExtraDataSpan(ast, nodeData.lhs, nodeData.rhs);
  //     }
  //     default:
  //       throw new Error("Invalid block node");
  //   }
  // }, [ast, node]);
  //
  // console.log(nodeData, statements);
  // return (
  //   <NodeDisplay node={node}>
  //     <span>{getNodeSource(ast, node)}</span>
  //     statements:
  //     {statements.map((statement) => {
  //       switch (getNodeTag(ast, statement)) {
  //         case AstNodeTag.GlobalVarDecl:
  //         case AstNodeTag.LocalVarDecl:
  //         case AstNodeTag.SimpleVarDecl:
  //         case AstNodeTag.AlignedVarDecl: {
  //           return <VarDecl node={statement} key={statement} />;
  //         }
  //         default:
  //           return <Expression node={statement} key={statement} />;
  //       }
  //     })}
  //   </NodeDisplay>
  // );
  //
  return (
    <NodeDisplay node={node}>
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <div className="bg-red-500/50">{error.message}</div>
        )}
      >
        <BlockBody node={node} />
      </ErrorBoundary>
    </NodeDisplay>
  );
};
export const Playground = () => {
  return (
    <div className="h-full overflow-y-hidden">
      <AstProvider>
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          header
        </header>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>
            <div className="h-full">
              <Editor />
            </div>
          </ResizablePanel>
          <ResizableHandle />

          <ResizablePanel>
            <div className="flex flex-col text-sm h-full overflow-y-auto no-scrollbar">
              <Members node={0} />
            </div>
          </ResizablePanel>
          <ResizableHandle />

          <ResizablePanel>
            <div className="flex flex-col font-mono h-full text-sm overflow-y-auto">
              <FlatNodes />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </AstProvider>
    </div>
  );
};

const FlatNodes = () => {
  const { ast, active, setActive, setHovered } = useAst();
  const nodesLength = getNodesLength(ast);
  const tagIds: number[] = [];
  for (let i = 0; i < nodesLength; i++) {
    tagIds.push(i);
  }

  // console.log(tagIds)
  return (
    <div>
      {tagIds.map((node) => (
        <div
          key={node}
          className="border p-1"
          title={getNodeSource(ast, node)}
          onClick={(e) => {
            e.stopPropagation();
            setActive((active) => {
              if (isSameActiveEntity(active, { kind: "node", id: node }))
                return null;

              return { kind: "node", id: node };
            });
          }}
          onMouseEnter={() => {
            setHovered({ kind: "node", id: node });
          }}
          onMouseLeave={() => {
            setHovered((hovered) => {
              if (hovered?.id !== node || hovered?.kind !== "node")
                return hovered;
              return null;
            });
          }}
        >
          <span>{node}</span>
          <span>.{getNodeTagLabel(ast, node)}</span>
        </div>
      ))}
    </div>
  );
};
