export const trycatch = <T,>(fn: () => T) => {
  try {
    return [null, fn()] as const;
  } catch (e) {
    console.warn(e);
    return [e as Error, undefined] as const;
  }
};
