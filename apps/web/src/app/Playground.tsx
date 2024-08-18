"use client";
import {
  getNodeTag,
  fullContainerDecl,
  fullFnProto,
  AstNodeTag,
  TokenTagMap,
  getNodeSource,
  tokenSlice,
  getMainToken,
  getNodeData,
  fullVarDecl,
  getFirstToken,
  getTokenTag,
  getLastToken,
  fullStructInit,
  fullArrayType,
  fullPtrType,
  fullArrayInit,
  fullCall,
  fullSlice,
  fullContainerField,
  fullIf,
  fullSwitchCase,
  fullAsm,
  AstNodeTagMap,
  fullFor,
  fullWhile,
  NodeRef,
  printZir,
} from "@zig-devkit/lib";

import { Editor } from "./editor";
import { useId, useMemo, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ErrorBoundary } from "react-error-boundary";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  CaretDownIcon,
  CaretRightIcon,
  DotFilledIcon,
} from "@radix-ui/react-icons";
import { useAst, AstProvider, isSameActiveEntity } from "./AstProvider";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { trycatch } from "./trycatch";

export const Playground = () => {
  return (
    <div className="h-full overflow-y-hidden">
      <AstProvider>
        <header className="sticky top-0 flex h-16 items-center gap-2 border-b bg-background px-4 text-xs font-bold md:px-6">
          <Image src="/zig-logo-light.svg" alt="Zig" width={40} height={20} />
          Playground
        </header>
        <Panels />
      </AstProvider>
    </div>
  );
};
const Panels = () => {
  const { active } = useAst();
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={40} minSize={5}>
        <div className="h-full">
          <Editor />
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel minSize={5}>
        <Tree />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel minSize={5}>
        <Zir />
      </ResizablePanel>

      {active && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={5}>
            <SelectionDetails />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};

const TokenDetails = ({ token }: { token: number }) => {
  const { ast, diagnostics: allDiagnostics } = useAst();

  const diagnostics = useMemo(() => {
    return allDiagnostics?.filter((d) => d.token === token) ?? [];
  }, [allDiagnostics, token]);
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
    <div>
      <h2 className="border-b p-2 text-lg font-semibold">Token Details</h2>

      {diagnostics.length > 0 &&
        diagnostics.map((d, i) => (
          <div
            key={i}
            className="my-2 rounded-sm border border-red-400 p-2 font-mono text-xs text-red-400"
          >
            {d.message}
          </div>
        ))}
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
    const out: string[] = [];
    let i = 0;
    for (; i < Math.min(4, sourceLines.length); i++) {
      out.push(sourceLines[i]);
    }

    if (sourceLines.length < 4)
      return (
        <pre key={i++} className="text-left">
          {out.join("\n")}
        </pre>
      );
    if (sourceLines.length > 6) out.push("...");

    for (let i = sourceLines.length - 2; i < sourceLines.length; i++) {
      out.push(sourceLines[i]);
    }

    return (
      <pre key={"final"} className="text-left">
        {out.join("\n")}
      </pre>
    );
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
    <div className="">
      <h2 className="border-b p-2 text-lg font-semibold">Node Details</h2>
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
          <h3 className="py-2 font-bold text-zinc-100">{col1}</h3>
          {col2}
        </div>
      ))}
    </div>
  );
};

const SelectionDetails = () => {
  let { active } = useAst();
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
      for (; i < child.start; i++) {
        children.push({ kind: "tag", index: i });
      }
      children.push(child);
      i = child.end + 1;
    }
    while (i <= nodeRef.end) {
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
        className={cn("flex cursor-pointer", {
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
        <h2 className="flex items-center gap-1 py-1">
          {!!children.length && (
            <button
              onClick={(e) => setCollapsed((collapsed) => !collapsed)}
              className="text-zinc-600 hover:text-zinc-400"
            >
              {!collapsed ? (
                <CaretDownIcon className="h-4 w-4" />
              ) : (
                <CaretRightIcon className="h-4 w-4" />
              )}
            </button>
          )}
          {!children.length && (
            <DotFilledIcon className="h-4 w-4 text-zinc-600" />
          )}
          <TypeBadge kind={"node"} index={node} />
          <span>.{AstNodeTagMap[tag]}</span>
        </h2>
      </header>
      {!collapsed && !!children.length && (
        <main>
          {children.map((child) => {
            const key = `${child.kind}-${child.index}`;
            if (child.kind === "node")
              return <Leaf key={key} nodeRef={child} />;
            return <Token key={key} token={child.index} path={path} />;
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
        <span className="block w-4 border-r first:w-2" key={i} />
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
    <span className="text-[0.8em]">
      {kind === "token" ? `T[` : "N["}
      {index}
      {"]"}
    </span>
  );
};

const Token = ({ token, path }: { token: number; path: number[] }) => {
  const {
    ast,
    active,
    setActive,
    hovered,
    setHovered,
    diagnostics: allDiagnostics,
  } = useAst();
  const tag = getTokenTag(ast, token);
  const isActive = isSameActiveEntity(active, { kind: "token", id: token });
  const isHovered = isSameActiveEntity(hovered, { kind: "token", id: token });
  const diagnostics = useMemo(() => {
    return allDiagnostics?.filter((d) => d.token === token) ?? [];
  }, [allDiagnostics, token]);
  const id = useId();
  return (
    <div
      className={cn("flex cursor-pointer text-zinc-400", {
        "bg-zinc-900/50": isHovered,
        "bg-zinc-900 text-yellow-500": isActive,
        // "bg-red-500/50": diagnostics.length > 0,
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
      <h2
        className={cn("flex items-center gap-1 py-1 pl-1", {
          "underline decoration-red-400 decoration-wavy":
            diagnostics.length > 0,
        })}
      >
        <TypeBadge kind={"token"} index={token} />.{TokenTagMap[tag]}
      </h2>
    </div>
  );
};
const Tree = () => {
  const { tree, ast } = useAst();

  return (
    <section className="no-scrollbar flex h-full flex-col gap-2 overflow-y-auto text-xs">
      <h2 className="border-b p-2 text-lg font-semibold">AST</h2>
      <Leaf nodeRef={tree} />
    </section>
  );
};

const Zir = () => {
  const { zir, ast, source, diagnostics } = useAst();
  const rendered = useMemo(() => {
    if (!zir) return null;
    if (diagnostics.length > 0) return null;
    const [, rendered = null] = trycatch(() => printZir(zir, ast));

    return rendered;
  }, [zir, ast]);
  return (
    <div className="no-scrollbar overflow-auto text-xs">
      <h2 className="border-b p-2 text-lg font-semibold">ZIR</h2>
      {diagnostics.map((d, i) => (
        <div
          key={i}
          className="my-2 rounded-sm border border-red-400 p-2 font-mono text-xs text-red-400"
        >
          {d.message}
        </div>
      ))}
      {rendered && <pre className="p-4">{rendered}</pre>}
    </div>
  );
};
