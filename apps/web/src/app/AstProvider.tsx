"use client";
import { useLocalStorage } from "@uidotdev/usehooks";
import { destroyAst, parseAstFromSource, promise } from "@zig-devkit/lib";
import { LRUCache } from "lru-cache";
import { createContext, Dispatch, SetStateAction, useContext, PropsWithChildren, use, useState, useCallback, useEffect } from "react";
import { useEffectEvent } from "./useEffectEvent";
export const defaultSource = `fn main() void {
    const x: i32 = 2;
    const y: i32 = 2;
    const z: i32 = x + y;
}
`;

const AstContext = createContext<{
    getAst: () => number;
    ast: number;
    source: string;
    setSource: Dispatch<SetStateAction<string>>;
    active: ActiveEntity | null;
    setActive: Dispatch<SetStateAction<ActiveEntity | null>>;
    hovered: ActiveEntity | null;
    setHovered: Dispatch<SetStateAction<ActiveEntity | null>>;
} | null>(null);
export const useAst = () => {
    const context = useContext(AstContext);
    if (!context) {
        throw new Error("useAst must be used within a AstProvider");
    }
    return context;
};
const memoParseAst = () => {
    const cache = new LRUCache<string, number>({
        max: 10,
        dispose: (value) => {
            destroyAst(value);
        },
    });

    function parse(source: string) {
        if (cache.has(source)) {
            return cache.get(source) as number;
        }
        const ast = parseAstFromSource(source);
        cache.set(source, ast);
        return ast;
    }
    parse.cache = cache;
    return parse;
};
export type ActiveEntity = {
    kind: "node" | "token" | "instruction";
    id: number;
};
export const isSameActiveEntity = (a: ActiveEntity | null, b: ActiveEntity | null) => {
    if (!a || !b) return false;
    return a.id === b.id && a.kind === b.kind;
};
export const AstProvider = (props: PropsWithChildren) => {
    use(promise);
    const [source, setSource] = useLocalStorage("zig.src", defaultSource);
    const [hovered, setHovered] = useState<ActiveEntity | null>(null);
    const [active, setActive] = useState<ActiveEntity | null>(null);
    const getAstFromSource = useCallback(memoParseAst(), []);

    const getAst = useEffectEvent(() => {
        return getAstFromSource(source);
    });

    const ast = getAst();
    useEffect(() => {
        getAst();
        return () => {
            getAstFromSource.cache.clear();
        };
    }, [getAst]);

    return (
        <AstContext.Provider
            value={{
                getAst,
                ast,
                source,
                setSource,
                active,
                setActive,
                hovered,
                setHovered,
            }}
            {...props} />
    );
};

