"use client";
// import { useLocalStorage } from "@uidotdev/usehooks";
import {
  destroyAst,
  destroyZir,
  Diagnostic,
  generateZir,
  getAstErrors,
  getZirErrors,
  NodeRef,
  parseAstFromSource,
  promise,
  treefy,
} from "@zig-devkit/lib";
import { LRUCache } from "lru-cache";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  PropsWithChildren,
  use,
  useState,
  useMemo,
} from "react";
import { useEffectEvent } from "./useEffectEvent";
import { trycatch } from "./trycatch";
export const defaultSource = `const std = @import("std");

pub fn main() !void {
    const stdout = std.io.getStdOut().writer();
    try stdout.print("Hello, {s}!\\n", .{"world"});
}
`;
const AstContext = createContext<{
  getAst: () => number;
  ast: number;
  getZir: () => number | null;
  zir: number | null;
  tree: NodeRef;
  source: string;
  setSource: Dispatch<SetStateAction<string>>;
  active: ActiveEntity | null;
  setActive: Dispatch<SetStateAction<ActiveEntity | null>>;
  hovered: ActiveEntity | null;
  setHovered: Dispatch<SetStateAction<ActiveEntity | null>>;
  diagnostics: Diagnostic[];
} | null>(null);
export const useAst = () => {
  const context = useContext(AstContext);
  if (!context) {
    throw new Error("useAst must be used within a AstProvider");
  }
  return context;
};

const cache = new LRUCache<
  string,
  {
    ast: number;
    zir: number | null;
  }
>({
  max: 10,
  dispose: ({ ast, zir }) => {
    destroyAst(ast);
    if (zir) destroyZir(zir);
  },
});

const parseSource = (source: string) => {
  const cached = cache.get(source);
  if (cached) return cached;
  const [, ast = 0] = trycatch(() => parseAstFromSource(source));
  const [, zir = null] = trycatch(() => generateZir(ast));
  const result = { ast, zir };
  cache.set(source, result);
  return result;
};

export type ActiveEntity = {
  kind: "node" | "token" | "instruction";
  id: number;
};

export const isSameActiveEntity = (
  a: ActiveEntity | null,
  b: ActiveEntity | null,
) => {
  if (!a || !b) return false;
  return a.id === b.id && a.kind === b.kind;
};

export const AstProvider = (props: PropsWithChildren) => {
  use(promise);
  // const [source, setSource] = useLocalStorage("zig.src", defaultSource);
  const [source, setSource] = useState(defaultSource);
  const [hovered, setHovered] = useState<ActiveEntity | null>(null);
  const [active, setActive] = useState<ActiveEntity | null>(null);

  const getAst = useEffectEvent(() => {
    return parseSource(source).ast;
  });
  const getZir = useEffectEvent(() => {
    return parseSource(source).zir;
  });

  const tree = useMemo((): NodeRef => {
    try {
      return treefy(getAst());
    } catch (e) {
      return {
        children: [],
        start: 0,
        end: 0,
        slice: source,
        kind: "node",
        index: 0,
      };
    }
  }, [source]);
  const diagnostics = useMemo(() => {
    const ast = getAst();
    const zir = getZir();
    const [, astErrors = []] = trycatch(() => getAstErrors(ast));
    const [, zirErrors = []] = trycatch(() =>
      zir ? getZirErrors(zir, ast) : [],
    );
    return [...astErrors, ...zirErrors];
  }, [source]);

  return (
    <AstContext.Provider
      value={{
        getAst,
        ast: getAst(),
        getZir,
        zir: getZir(),
        tree,
        source,
        setSource,
        active,
        setActive,
        hovered,
        setHovered,
        diagnostics,
      }}
      {...props}
    />
  );
};
