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
  assignDestructure,
  fullStructInit,
  fullArrayType,
  fullPtrType,
  TypePointerSize,
  fullArrayInit,
  fullCall,
  fullSlice,
  fullContainerField,
  fullIf,
  fullSwitchCase,
  getTokensLength,
  AstfullWhile,
  AstfullContainerField,
  fullAsm,
  AstNodeTagMap,
  fullFor,
  fullWhile,
  NodeRef,
} from "@zig-devkit/lib";

import { Editor, EditorReadOnly } from "./editor";
import { ComponentProps, PropsWithChildren, useMemo, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { range } from "lodash-es";
import { ErrorBoundary } from "react-error-boundary";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export const defaultSource = `fn main() void {
    const x: i32 = 2;
    const y: i32 = 2;
    const z: i32 = x + y;
}
`;
import {
  CaretDownIcon,
  CaretRightIcon,
  DotFilledIcon,
  DotIcon,
} from "@radix-ui/react-icons";
import { useAst, AstProvider, isSameActiveEntity } from "./AstProvider";
import { cn } from "@/lib/utils";
import assert from "assert";
import Image from "next/image";

const NodeDisplay = ({
  node,
  children,
}: PropsWithChildren<{ node: number }>) => {
  const { ast, active, hovered, setActive, setHovered } = useAst();

  const isActive = isSameActiveEntity(active, { kind: "node", id: node });
  return (
    <div className="flex flex-col">
      <header
        className={cn(
          "px-4 text-xs flex gap-2  py-1 items-center hover:brightness-110 cursor-pointer text-zinc-200 font-semibold",
          {
            "bg-zinc-900/50 text-cyan-500": isActive,
          },
        )}
        onClick={(e) => {
          e.stopPropagation();
          if (active?.kind === "node" && active.id === node) {
            setActive(null);
            return;
          }
          setActive({
            kind: "node",
            id: node,
          });
        }}
        onMouseEnter={() => {
          setHovered({
            kind: "node",
            id: node,
          });
        }}
        onMouseLeave={() => {
          setHovered((prev) => {
            if (isSameActiveEntity(prev, { kind: "node", id: node })) {
              return null;
            }
            return prev;
          });
        }}
      >
        <button>
          <CaretDownIcon className="w-4 h-4" />
        </button>

        <div className="flex gap-2">.{getNodeTagLabel(ast, node)}</div>
        <Badge className="hover:text-cyan-500">Node #{node}</Badge>
      </header>

      <div className="ml-3  border-l">
        <ErrorBoundary
          resetKeys={[node, ast]}
          fallbackRender={({ error }) => (
            <div className="bg-red-500/50">{error.message}</div>
          )}
        >
          {children}
        </ErrorBoundary>
      </div>
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

const ArrayTypeBody = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const arrayType = fullArrayType(ast, node);

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

const anythingBetween = (ast: number, startToken: number, endToken: number) => {
  if (startToken + 1 !== endToken) return true;
  // TODO: implement
  return false;
};
const ArrayInitBody = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const arrayInit = fullArrayInit(ast, node);
  const el: JSX.Element[] = [];
  if (arrayInit.ast.type_expr === 0) {
    el.push(<TokenDisplay token={arrayInit.ast.lbrace - 1} />);
  } else {
    el.push(<Expression node={arrayInit.ast.type_expr} />);
  }
  if (arrayInit.ast.elements.length === 0) {
    el.push(<TokenDisplay token={arrayInit.ast.lbrace} />);
    el.push(<TokenDisplay token={arrayInit.ast.lbrace + 1} />);
    return el;
  }
  const lastElem = arrayInit.ast.elements[arrayInit.ast.elements.length - 1];
  const lastElemToken = getLastToken(ast, lastElem);
  const trailingComma = getTokenTag(ast, lastElemToken + 1) === TokenTag.Comma;
  const rbrace = trailingComma ? lastElemToken + 2 : lastElemToken + 1;

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
  el.push(<TokenDisplay token={arrayInit.ast.lbrace} />);
  for (const elem of arrayInit.ast.elements) {
    el.push(<Expression node={elem} />);
    //TODO: add commas
  }

  return el;
};

const CallBody = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const call = fullCall(ast, node);
  const el: JSX.Element[] = [];

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
  el.push(<TokenDisplay token={lparen} />);

  for (const param of params) {
    el.push(<Expression node={param} />);
    const comma = getLastToken(ast, param) + 1;
    if (getTokenTag(ast, comma) === TokenTag.Comma) {
      el.push(<TokenDisplay token={afterLastParamTok} />);
    }
  }

  el.push(<TokenDisplay token={afterLastParamTok + 1} />);
  return el;
};

const SliceBody = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const slice = fullSlice(ast, node);
  const el: JSX.Element[] = [];
  el.push(<Expression node={slice.ast.sliced} />);
  el.push(<TokenDisplay token={slice.ast.lbracket} />);
  el.push(<Expression node={slice.ast.start} />);
  el.push(<TokenDisplay token={getLastToken(ast, slice.ast.start) + 1} />);
  if (slice.ast.end !== 0) {
    el.push(<Expression node={slice.ast.end} />);
  }
  if (slice.ast.sentinel !== 0) {
    el.push(
      <TokenDisplay token={getFirstToken(ast, slice.ast.sentinel) - 1} />,
    );
    el.push(<Expression node={slice.ast.sentinel} />);
  }
  el.push(<TokenDisplay token={getLastToken(ast, node)} />);

  return el;
};

const ContainerDeclBody = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const containerDecl = fullContainerDecl(ast, node);
  const el: JSX.Element[] = [];
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
  let lbrace: number;
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
  if (containerDecl.ast.members.length === 0) {
    el.push(<TokenDisplay token={lbrace} />);
    if (getTokenTag(ast, lbrace + 1) === TokenTag.ContainerDocComment) {
      el.push(<TokenDisplay token={lbrace + 1} />);
    }
    el.push(<TokenDisplay token={rbrace} />);
    return el;
  }

  el.push(<TokenDisplay token={lbrace} />);
  if (getTokenTag(ast, lbrace + 1) === TokenTag.ContainerDocComment) {
    el.push(<TokenDisplay token={lbrace + 1} />);
  }

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
  el.push(<TokenDisplay token={rbrace} />);

  return el;
};

const BuiltinCallBody = ({ node }: NodeComponent) => {
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

  el.push(<TokenDisplay token={builtinToken} />);
  if (params.length === 0) {
    el.push(<TokenDisplay token={builtinToken + 1} />);
    el.push(<TokenDisplay token={builtinToken + 2} />);
    return el;
  }
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

const SwitchCaseBody = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const switchCase = fullSwitchCase(ast, node);
  const el: JSX.Element[] = [];
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
const nodeIsBlock = (ast: number, node: number) => {
  const tag = getNodeTag(ast, node);
  return (
    tag === AstNodeTag.Block ||
    tag === AstNodeTag.BlockSemicolon ||
    tag === AstNodeTag.BlockTwo ||
    tag === AstNodeTag.BlockTwoSemicolon
  );
};
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
  const whileNode = fullWhile(ast, node);
  return <WhileOrIf full={whileNode} node={node} />;
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
  const forNode = fullFor(ast, node);
  const el = [];
  if (forNode.label_token) {
    el.push(<TokenDisplay token={forNode.label_token} />);
    el.push(<TokenDisplay token={forNode.label_token + 1} />);
  }
  if (forNode.inline_token) {
    el.push(<TokenDisplay token={forNode.inline_token} />);
  }
  el.push(<TokenDisplay token={forNode.ast.for_token} />);
  const lparen = forNode.ast.for_token + 1;
  let cur = forNode.payload_token;
  const pipe = cur;
  const tokensLen = getTokensLength(ast);
  while (getTokenTag(ast, cur) !== TokenTag.Pipe || cur < tokensLen) {
    cur += 1;
  }

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

const IfBody = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const ifNode = fullIf(ast, node);
  return (
    <WhileOrIf
      full={{
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
};
const AsmOutput = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const data = getNodeData(ast, node);
  const symbolicName = getMainToken(ast, node);
  const el: JSX.Element[] = [];

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
  el.push(<TokenDisplay token={asmNode.ast.asm_token} />);
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
  el.push(<TokenDisplay token={colon3} />);
  const firstClobber = asmNode.first_clobber;
  if (!firstClobber) throw new Error("unreachable");
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
  if (container !== "tuple") field = convertToNonTupleLike(ast, field);
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
  if (!field.ast.tuple_like) {
    el.push(<TokenDisplay token={field.ast.main_token} />);
    el.push(<TokenDisplay token={field.ast.main_token + 1} />);
  }
  el.push(<Expression node={field.ast.type_expr} />);
  if (field.ast.align_expr !== 0) {
    const lparen = getFirstToken(ast, field.ast.align_expr) - 1;
    const alignKw = lparen - 1;
    const rparen = getLastToken(ast, field.ast.align_expr) + 1;
    el.push(<TokenDisplay token={alignKw} />);
    el.push(<TokenDisplay token={lparen} />);
    el.push(<Expression node={field.ast.align_expr} />);
    el.push(<TokenDisplay token={rparen} />);
  }
  const eqToken = getFirstToken(ast, field.ast.value_expr) - 1;
  el.push(<TokenDisplay token={eqToken} />);
  renderExpressionComma(el, ast, field.ast.value_expr);
  return el;
};

const ContainerField = ({
  container,
  node,
}: NodeComponent<{ container: ContainerType }>) => {
  const { ast } = useAst();
  return (
    <NodeDisplay node={node}>
      <ErrorBoundary
        resetKeys={[ast, node]}
        fallbackRender={({ error }) => <pre>{error.message}</pre>}
      >
        <ContainerFieldBody node={node} container={container} />
      </ErrorBoundary>
    </NodeDisplay>
  );
};
const ExpressionBody = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const mainToken = getMainToken(ast, node);
  const data = getNodeData(ast, node);
  switch (getNodeTag(ast, node)) {
    case AstNodeTag.Identifier:
      return <TokenDisplay token={mainToken} />;
    case AstNodeTag.NumberLiteral:
    case AstNodeTag.CharLiteral:
    case AstNodeTag.UnreachableLiteral:
    case AstNodeTag.AnyframeLiteral:
    case AstNodeTag.StringLiteral:
      return <TokenDisplay token={mainToken} />;
    case AstNodeTag.MultilineStringLiteral:
      return (
        <>
          {range(data.lhs, data.rhs).map((i) => (
            <TokenDisplay key={i} token={i} />
          ))}
        </>
      );
    case AstNodeTag.ErrorValue:
      return (
        <>
          <TokenDisplay token={mainToken} />
          <TokenDisplay token={mainToken + 1} />
          <TokenDisplay token={mainToken + 2} />
        </>
      );
    case AstNodeTag.BlockTwo:
    case AstNodeTag.BlockTwoSemicolon:
    case AstNodeTag.Block:
    case AstNodeTag.BlockSemicolon:
      return <BlockBody node={node} />;
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
    case AstNodeTag.ArrayType:
    case AstNodeTag.ArrayTypeSentinel: {
      return <ArrayTypeBody node={node} />;
    }
    case AstNodeTag.PtrTypeAligned:
    case AstNodeTag.PtrTypeSentinel:
    case AstNodeTag.PtrType:
    case AstNodeTag.PtrTypeBitRange: {
      return <PtrTypeBody node={node} />;
    }
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
    case AstNodeTag.ArrayAccess: {
      const suffix = data;
      const lbracket = getFirstToken(ast, suffix.rhs) - 1;
      const rbracket = getLastToken(ast, suffix.rhs) + 1;
      return (
        <>
          <Expression node={suffix.lhs} />
          <TokenDisplay token={lbracket} />
          <Expression node={suffix.rhs} />
          <TokenDisplay token={rbracket} />
        </>
      );
    }
    case AstNodeTag.SliceOpen:
    case AstNodeTag.Slice:
    case AstNodeTag.SliceSentinel: {
      return <SliceBody node={node} />;
    }
    case AstNodeTag.Deref: {
      return (
        <>
          <Expression node={data.lhs} />
          <TokenDisplay token={mainToken} />
        </>
      );
    }
    case AstNodeTag.UnwrapOptional: {
      return (
        <>
          <Expression node={data.lhs} />
          <TokenDisplay token={mainToken} />
          <TokenDisplay token={data.rhs} />
        </>
      );
    }
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
    case AstNodeTag.GroupedExpression: {
      return (
        <>
          <TokenDisplay token={mainToken} />
          <Expression node={data.lhs} />
          <TokenDisplay token={data.rhs} />
        </>
      );
    }
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
    case AstNodeTag.BuiltinCallTwo:
    case AstNodeTag.BuiltinCallTwoComma:
    case AstNodeTag.BuiltinCall:
    case AstNodeTag.BuiltinCallComma: {
      return <BuiltinCallBody node={node} />;
    }

    case AstNodeTag.FnProtoSimple:
    case AstNodeTag.FnProtoMulti:
    case AstNodeTag.FnProtoOne:
    case AstNodeTag.FnProto: {
      return <FnProtoBody node={node} />;
    }
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
    case AstNodeTag.SwitchCaseOne:
    case AstNodeTag.SwitchCaseInlineOne:
    case AstNodeTag.SwitchCase:
    case AstNodeTag.SwitchCaseInline: {
      return <SwitchCaseBody node={node} />;
    }
    case AstNodeTag.WhileSimple:
    case AstNodeTag.WhileCont:
    case AstNodeTag.While: {
      return <WhileBody node={node} />;
    }

    case AstNodeTag.ForSimple:
    case AstNodeTag.For: {
      return <ForBody node={node} />;
    }

    case AstNodeTag.IfSimple:
    case AstNodeTag.If: {
      return <IfBody node={node} />;
    }

    case AstNodeTag.AsmSimple:
    case AstNodeTag.Asm: {
      return <AsmBody node={node} />;
    }
    case AstNodeTag.EnumLiteral: {
      return (
        <>
          <TokenDisplay token={mainToken - 1} />
          <TokenDisplay token={mainToken} />
        </>
      );
    }

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
};
const Expression = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  return (
    <NodeDisplay node={node}>
      <ExpressionBody node={node} />
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
  switch (getNodeTag(ast, decl)) {
    case AstNodeTag.FnDecl: {
      const fnProto = data.lhs;
      const fnToken = getMainToken(ast, fnProto);
      let i = fnToken;
      let b = 100;
      while (i > 0 || b === 0) {
        b--;
        i -= 1;
        if (
          [
            TokenTag.KeywordExtern,
            TokenTag.KeywordExport,
            TokenTag.KeywordPub,
            TokenTag.StringLiteral,
            TokenTag.KeywordInline,
            TokenTag.KeywordNoinline,
          ].includes(getTokenTag(ast, i))
        ) {
          continue;
        } else {
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
      console.log("fnToken", decl, fnToken, i);
      const el: Array<JSX.Element> = [];
      while (i < fnToken) {
        el.push(<TokenDisplay token={i} />);
        i += 1;
      }
      el.push(<Expression node={decl} />);
      return el;
    }
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
    case AstNodeTag.GlobalVarDecl:
    case AstNodeTag.LocalVarDecl:
    case AstNodeTag.SimpleVarDecl:
    case AstNodeTag.AlignedVarDecl: {
      return <VarDeclBody node={decl} />;
    }

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
  const el: Array<JSX.Element> = [];
  if (varDecl.visib_token) {
    el.push(<TokenDisplay token={varDecl.visib_token} />);
  }
  if (varDecl.extern_export_token) {
    el.push(<TokenDisplay token={varDecl.extern_export_token} />);
    if (varDecl.lib_name) {
      el.push(<TokenDisplay token={varDecl.lib_name} />);
    }
  }
  if (varDecl.threadlocal_token) {
    el.push(<TokenDisplay token={varDecl.threadlocal_token} />);
  }
  if (varDecl.comptime_token) {
    el.push(<TokenDisplay token={varDecl.comptime_token} />);
  }
  el.push(<TokenDisplay token={varDecl.ast.mut_token} />);
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
  if (varDecl.ast.type_node !== 0) {
    el.push(<TokenDisplay token={varDecl.ast.mut_token + 2} />);
    el.push(<Expression node={varDecl.ast.type_node} />);
  }
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
  const eqToken = getFirstToken(ast, varDecl.ast.init_node) - 1;
  el.push(<TokenDisplay token={eqToken} />);
  el.push(<Expression node={varDecl.ast.init_node} />);
  return el;
};
const VarDecl = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  return (
    <NodeDisplay node={node}>
      <VarDeclBody node={node} />
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
  const { ast, setActive, setHovered, active, hovered } = useAst();
  const tag = getTokenTag(ast, token);
  const isActive = isSameActiveEntity(active, { kind: "token", id: token });
  return (
    <div
      className={cn(
        "px-4 text-xs flex gap-2  py-1 items-center hover:brightness-110 cursor-pointer text-zinc-400",
        {
          "bg-zinc-900/50 text-yellow-500": isActive,
        },
      )}
      onClick={(e) => {
        e.stopPropagation();
        if (active?.kind === "token" && active.id === token) {
          setActive(null);
          return;
        }
        setActive({
          kind: "token",
          id: token,
        });
      }}
      onMouseEnter={() => {
        setHovered({
          kind: "token",
          id: token,
        });
      }}
      onMouseLeave={() => {
        setHovered((prev) => {
          if (isSameActiveEntity(prev, { kind: "token", id: token })) {
            return null;
          }
          return prev;
        });
      }}
    >
      <span className="">
        .{TokenTagMap[tag]} "{tokenSlice(ast, token)}"
      </span>
      <Badge className="hover:text-yellow-500">Tok #{token}</Badge>
    </div>
  );
};
const Badge = ({ children, className, ...rest }: ComponentProps<"div">) => {
  return (
    <div
      className={cn("bg-zinc-900  text-xs rounded-sm p-1 px-2", className)}
      {...rest}
    >
      {children}
    </div>
  );
};

const FnProtoBody = ({ node }: NodeComponent) => {
  const { ast } = useAst();
  const fnProto = fullFnProto(ast, node);

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
  let maybeBang = getFirstToken(ast, fnProto.ast.return_type) - 1;
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

  assert(
    getTokenTag(ast, lastParamToken) === TokenTag.RParen,
    "Expected RParen",
  );
  el.push(<TokenDisplay token={lastParamToken} />);

  if (fnProto.ast.align_expr !== 0) {
    const alignLparen = getFirstToken(ast, fnProto.ast.align_expr) - 1;
    const alignRparen = getLastToken(ast, fnProto.ast.align_expr) + 1;
    el.push(<TokenDisplay token={alignLparen - 1} />);
    el.push(<TokenDisplay token={alignLparen} />);
    el.push(<Expression node={fnProto.ast.align_expr} />);
    el.push(<TokenDisplay token={alignRparen} />);
  }
  if (fnProto.ast.addrspace_expr !== 0) {
    const addrspaceLparen = getFirstToken(ast, fnProto.ast.addrspace_expr) - 1;
    const addrspaceRparen = getLastToken(ast, fnProto.ast.addrspace_expr) + 1;
    el.push(<TokenDisplay token={addrspaceLparen - 1} />);
    el.push(<TokenDisplay token={addrspaceLparen} />);
    el.push(<Expression node={fnProto.ast.addrspace_expr} />);
    el.push(<TokenDisplay token={addrspaceRparen} />);
  }
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
  if (getTokenTag(ast, maybeBang) === TokenTag.Bang) {
    el.push(<TokenDisplay token={maybeBang} />);
  }
  // bellow only happens with invalid syntax, when a fn proto has a return type
  // ex `fn foo() {}`
  // This is invalid in zig, but we display it anyway
  if (fnProto.ast.return_type !== 0) {
    el.push(<Expression node={fnProto.ast.return_type} />);
  }
  return el;
};

const BlockBody = ({ node }: NodeComponent) => {
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

  for (const statement of statements) {
    switch (getNodeTag(ast, statement)) {
      case AstNodeTag.GlobalVarDecl:
      case AstNodeTag.LocalVarDecl:
      case AstNodeTag.SimpleVarDecl:
      case AstNodeTag.AlignedVarDecl: {
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

export const Playground = () => {
  return (
    <div className="h-full overflow-y-hidden">
      <AstProvider>
        <header className="sticky top-0 flex h-16 items-center gap-2 border-b bg-background px-4 text-xs font-bold md:px-6">
          <Image src="/zig-logo-light.svg" alt="Zig" width={40} height={20} />AST Viewer 
        </header>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>
            <div className="h-full">
              <Editor />
            </div>
          </ResizablePanel>
          <ResizableHandle />

          <ResizablePanel>
            <Tree />
            {/* <Members node={0} /> */}
          </ResizablePanel>
          <ResizableHandle />

          {/* <ResizablePanel> */}
          {/*   <div className="grid grid-cols-2 h-full text-xs overflow-y-auto"> */}
          {/*     <FlatNodes /> */}
          {/*     <FlatTokens /> */}
          {/*   </div> */}
          {/* </ResizablePanel> */}

          <ResizablePanel>
            <SelectionDetails />
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
          <span> {getMainToken(ast, node)}</span>
        </div>
      ))}
    </div>
  );
};

const FlatTokens = () => {
  const { ast, active, setActive, setHovered } = useAst();
  const tokensLength = getTokensLength(ast);
  const tagIds: number[] = [];
  for (let i = 0; i < tokensLength; i++) {
    tagIds.push(i);
  }

  return (
    <div>
      {tagIds.map((token) => (
        <div
          key={token}
          className="border p-1"
          title={tokenSlice(ast, token)}
          onClick={(e) => {
            e.stopPropagation();
            setActive((active) => {
              if (isSameActiveEntity(active, { kind: "token", id: token }))
                return null;

              return { kind: "token", id: token };
            });
          }}
          onMouseEnter={() => {
            setHovered({ kind: "token", id: token });
          }}
          onMouseLeave={() => {
            setHovered((hovered) => {
              if (hovered?.id !== token || hovered?.kind !== "token")
                return hovered;
              return null;
            });
          }}
        >
          <span>{token}</span>
          <span>.{TokenTagMap[getTokenTag(ast, token)]}</span>
        </div>
      ))}
    </div>
  );
};

const TokenDetails = ({ token }: { token: number }) => {
  const { ast } = useAst();
  const tag = getTokenTag(ast, token);
  const tokenStart = getFirstToken(ast, token);
  const slice = tokenSlice(ast, token);
  const tableRows: [React.ReactNode, React.ReactNode][] = [
    [`Token`, `#${token}`],

    [
      `Tag`,
      <pre>
        <span className="text-zinc-400">Token</span>.
        <span className="text-zinc-400">Tag</span>.
        <span className="text-yellow-500">{`${TokenTagMap[tag]}`}</span>
      </pre>,
    ],
    [`Start`, tokenStart],
    [`End`, tokenStart + slice.length],
    [`Source`, <pre className="text-yellow-400">`{slice}`</pre>],
  ];
  return (
    <div className="p-4">
      <header>
        <h2 className="font-bold">Token Details</h2>
      </header>
      <Table>
        <TableBody>
          {tableRows.map(([col1, col2], i) => (
            <TableRow key={i} className="text-xs">
              <TableCell className="font-medium">{col1}</TableCell>
              <TableCell className="text-right">{col2}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const NodeDetails = ({ node }: { node: number }) => {
  const { ast } = useAst();
  const tag = getNodeTag(ast, node);
  const data = getNodeData(ast, node);
  const mainToken = getMainToken(ast, node);
  const firstToken = getFirstToken(ast, node);
  const lastToken = getLastToken(ast, node);
  const source = getNodeSource(ast, node);
  const sourceLines = source.split("\n");
  let sourceDisplay = "";
  const full = useMemo(() => {
    const tag = getNodeTag(ast, node);
    switch (tag) {
      case AstNodeTag.GlobalVarDecl:
      case AstNodeTag.LocalVarDecl:
      case AstNodeTag.SimpleVarDecl:
      case AstNodeTag.AlignedVarDecl: {
        return ["full.VarDecl", fullVarDecl(ast, node)] as const;
      }
      case AstNodeTag.IfSimple:
      case AstNodeTag.If: {
        return ["full.If", fullIf(ast, node)] as const;
      }
      case AstNodeTag.WhileSimple:
      case AstNodeTag.WhileCont:
      case AstNodeTag.While: {
        return ["full.While", fullWhile(ast, node)] as const;
      }
      case AstNodeTag.ForSimple:
      case AstNodeTag.For: {
        return ["full.For", fullFor(ast, node)] as const;
      }
      case AstNodeTag.ContainerField:
      case AstNodeTag.ContainerFieldInit:
      case AstNodeTag.ContainerFieldAlign: {
        return ["full.ContainerField", fullContainerField(ast, node)] as const;
      }
      case AstNodeTag.FnProto:
      case AstNodeTag.FnProtoMulti:
      case AstNodeTag.FnProtoOne:
      case AstNodeTag.FnProtoSimple:
      case AstNodeTag.FnDecl: {
        return ["full.FnProto", fullFnProto(ast, node)] as const;
      }
      case AstNodeTag.StructInitComma:
      case AstNodeTag.StructInitOne:
      case AstNodeTag.StructInitDotTwo:
      case AstNodeTag.StructInitDotTwoComma:
      case AstNodeTag.StructInitDot:
      case AstNodeTag.StructInitDotComma:
      case AstNodeTag.StructInit:
      case AstNodeTag.StructInitComma: {
        return ["full.StructInit", fullStructInit(ast, node)] as const;
      }
      case AstNodeTag.ArrayInitOne:
      case AstNodeTag.ArrayInitComma:
      case AstNodeTag.ArrayInitDotTwo:
      case AstNodeTag.ArrayInitDotTwoComma:
      case AstNodeTag.ArrayInitDot:
      case AstNodeTag.ArrayInitDotComma:
      case AstNodeTag.ArrayInit:
      case AstNodeTag.ArrayInitComma: {
        return ["full.ArrayInit", fullArrayInit(ast, node)] as const;
      }
      case AstNodeTag.ArrayType:
      case AstNodeTag.ArrayTypeSentinel: {
        return ["full.ArrayType", fullArrayType(ast, node)] as const;
      }
      case AstNodeTag.PtrTypeAligned:
      case AstNodeTag.PtrTypeSentinel:
      case AstNodeTag.PtrType:
      case AstNodeTag.PtrTypeBitRange: {
        return ["full.PtrType", fullPtrType(ast, node)] as const;
      }
      case AstNodeTag.SliceOpen:
      case AstNodeTag.Slice:
      case AstNodeTag.SliceSentinel: {
        return ["full.Slice", fullSlice(ast, node)] as const;
      }
      case AstNodeTag.Root:
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
        return ["full.ContainerDecl", fullContainerDecl(ast, node)] as const;
      }
      case AstNodeTag.SwitchCaseOne:
      case AstNodeTag.SwitchCaseInlineOne:
      case AstNodeTag.SwitchCase:
      case AstNodeTag.SwitchCaseInline: {
        return ["full.SwitchCase", fullSwitchCase(ast, node)] as const;
      }

      case AstNodeTag.AsmSimple:
      case AstNodeTag.Asm: {
        return ["full.Asm", fullAsm(ast, node)] as const;
      }
      case AstNodeTag.Call:
      case AstNodeTag.CallComma:
      case AstNodeTag.AsyncCall:
      case AstNodeTag.AsyncCallComma:
      case AstNodeTag.CallOne:
      case AstNodeTag.CallOneComma:
      case AstNodeTag.AsyncCallOne:
      case AstNodeTag.AsyncCallOneComma: {
        return ["full.Call", fullCall(ast, node)] as const;
      }
      default:
        return null;
    }
  }, [ast, node]);
  const compactSource = useMemo(() => {
    const sourceLines = source.split("\n");
    if (sourceLines[sourceLines.length - 1]?.trim() === "") {
      sourceLines.pop();
    }
    const out: React.ReactNode[] = [];

    for (let i = 0; i < Math.min(4, sourceLines.length); i++) {
      // out.push(<span className="text-yellow-400 mr-2">{i + 1}</span>);
      out.push(<span>{sourceLines[i]}</span>, <br />);
    }

    if (sourceLines.length < 4) return <pre className="text-left">{out}</pre>;
    if (sourceLines.length > 6) out.push(<span>...</span>, <br />);

    for (let i = sourceLines.length - 2; i < sourceLines.length; i++) {
      // out.push(<span className="text-yellow-400 mr-2">{i + 1}</span>);
      out.push(<span>{sourceLines[i]}</span>, <br />);
    }

    return <pre className="text-left">{out}</pre>;
  }, [source]);

  const tableRows: [React.ReactNode, React.ReactNode][] = [
    [`Node`, `#${node}`],
    [
      `Tag`,
      <pre>
        <span className="text-zinc-400">Ast</span>.
        <span className="text-zinc-400">Node</span>.
        <span className="text-yellow-500">{`${AstNodeTagMap[tag]}`}</span>
      </pre>,
    ],
    [`Main Token`, `#${mainToken}`],
    [`First Token`, `#${firstToken}`],
    [`Last Token`, `#${lastToken}`],
  ];
  const secondaryTableRows: [React.ReactNode, React.ReactNode][] = [
    [`Source`, compactSource],
    [`Data`, <pre className="text-left">{JSON.stringify(data, null, 2)}</pre>],
  ];
  if (full) {
    secondaryTableRows.push([
      full[0],
      <pre className="text-left">{JSON.stringify(full[1], null, 2)}</pre>,
    ]);
  }

  return (
    <div className="p-4">
      <header>
        <h2 className="font-bold">Node Details</h2>
      </header>
      <Table>
        <TableBody>
          {tableRows.map(([col1, col2], i) => (
            <TableRow key={i} className="text-xs">
              <TableCell className="font-medium">{col1}</TableCell>
              <TableCell className="text-right">{col2}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {secondaryTableRows.map(([col1, col2], i) => (
        <div key={i} className="p-2 text-xs text-zinc-400">
          <h3 className="font-bold py-2 text-zinc-100">{col1}</h3>
          {col2}
        </div>
      ))}
    </div>
  );
};

const SelectionDetails = () => {
  let { ast, active, hovered } = useAst();
  // active = { kind: "node", id: 0 };
  if (!active)
    return (
      <div className="flex h-full items-center justify-center text-center">
        <h2 className="text-zinc-300">Select a node or a token</h2>
      </div>
    );

  if (active.kind === "token") {
    return <TokenDetails token={active.id} />;
  }
  return <NodeDetails node={active.id} />;
};

const _Leaf = ({ nodeRef }: { nodeRef: NodeRef }) => {
  const { ast, active, setActive, hovered, setHovered } = useAst();
  const [collapsed, setCollapsed] = useState(false);
  const node = nodeRef.index;
  const tag = getNodeTag(ast, node);
  const path = useMemo(() => {
    let parent = nodeRef.parent;
    const path: number[] = [];
    while (parent) {
      path.push(parent.index);
      parent = parent.parent;
    }
    return path;
  }, [ast, node]);
  const children = useMemo(() => {
    const children: (NodeRef | { kind: "tag"; index: number })[] = [];
    let i = nodeRef.start;
    for (const child of nodeRef.children) {
      while (i < child.start) {
        children.push({ kind: "tag", index: i });
        i++;
      }
      children.push(child);
      i = child.end;
    }
    while (i < nodeRef.end) {
      children.push({ kind: "tag", index: i });
      i++;
    }
    return children;
  }, [ast, node]);
  const isActive = isSameActiveEntity(active, { kind: "node", id: node });
  const isHovered = isSameActiveEntity(hovered, { kind: "node", id: node });

  return (
    <section className="flex flex-col">
      <header
        className={cn("flex cursor-pointer ", {
          "bg-zinc-900/50": isHovered,
          "bg-zinc-900 text-yellow-500": isActive,
        })}
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
          setHovered((prev) => {
            if (prev?.kind === "node" && prev.id === node) {
              return null;
            }
            return prev;
          });
        }}
      >
        <IndentGuides indent={path.length} />
        <h2 className="flex gap-1 items-center py-1">
          {!!children.length && (
            <button
              onClick={(e) => setCollapsed((collapsed) => !collapsed)}
              className="text-zinc-600 hover:text-zinc-400"
            >
              {!collapsed ? (
                <CaretDownIcon className="w-4 h-4" />
              ) : (
                <CaretRightIcon className="w-4 h-4" />
              )}
            </button>
          )}
          {!children.length && (
            <DotFilledIcon className="w-4 h-4 text-zinc-600" />
          )}
          <TypeBadge kind={"node"} index={node} />
          <span>.{AstNodeTagMap[tag]}</span>
        </h2>
      </header>
      {!collapsed && !!nodeRef.children.length && (
        <main>
          {children.map((child) => {
            const key = `${child.kind}-${child.index}`;
            if (child.kind === "node")
              return <Leaf key={key} nodeRef={child} />;
            return <Token key={key} token={child.index} path={path} />;
            // return
          })}
        </main>
      )}
    </section>
  );
};
const Leaf = (props: { nodeRef: NodeRef }) => {
  const { ast } = useAst();
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => {
        return <div className="text-red-500">Error: {error.message}</div>;
      }}
      resetKeys={[props.nodeRef.index, ast]}
    >
      <_Leaf {...props} />
    </ErrorBoundary>
  );
};
const IndentGuides = ({ indent }: { indent: number }) => {
  return (
    <div className="flex">
      {new Array(indent).fill(0).map((_, i) => (
        <span className="w-4 border-r block first:w-2" key={i} />
      ))}
    </div>
  );
};
const TypeBadge = ({
  kind,
  index,
}: {
  kind: "token" | "node";
  index: number;
}) => {
  return (
    <span className="text-[0.8em] ">
      {kind === "token" ? `T[` : "N["}
      {index}
      {"]"}
    </span>
  );
};

const Token = ({ token, path }: { token: number; path: number[] }) => {
  const { ast, active, setActive, hovered, setHovered } = useAst();
  const tag = getTokenTag(ast, token);
  const isActive = isSameActiveEntity(active, { kind: "token", id: token });
  const isHovered = isSameActiveEntity(hovered, { kind: "token", id: token });
  return (
    <div
      className={cn("flex cursor-pointer  text-zinc-400", {
        "bg-zinc-900/50": isHovered,
        "bg-zinc-900 text-yellow-500": isActive,
      })}
      onClick={(e) => {
        e.stopPropagation();
        setActive((active) => {
          if (isSameActiveEntity(active, { kind: "token", id: token }))
            return null;
          return { kind: "token", id: token };
        });
      }}
      onMouseEnter={() => {
        setHovered({ kind: "token", id: token });
      }}
      onMouseLeave={() => {
        setHovered((prev) => {
          if (prev?.kind === "token" && prev.id === token) {
            return null;
          }
          return prev;
        });
      }}
    >
      <IndentGuides indent={path.length + 1} />
      <h2 className="flex gap-1 items-center py-1 pl-1">
        <TypeBadge kind={"token"} index={token} />.{TokenTagMap[tag]}
      </h2>
    </div>
  );
};
const Tree = () => {
  const { tree, ast } = useAst();

  return (
    <section className="flex flex-col gap-2 text-xs overflow-y-auto h-full no-scrollbar">
      <Leaf nodeRef={tree} />
    </section>
  );
};
