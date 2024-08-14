"use client";
import { useRef, useCallback } from "react";

// monaco.editor.defineTheme("zig-theme", {});

export function useEffectEvent<T extends (...args: any[]) => unknown>(
  fn: T,
): T {
  const ref = useRef(fn);
  // useInsertionEffect(() => {
  ref.current = fn;
  // }, [fn]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback((...args: Parameters<T>) => {
    return ref.current(...args);
  }, []) as T;
}
