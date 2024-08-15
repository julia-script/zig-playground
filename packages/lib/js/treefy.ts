import {
  getFirstToken,
  getLastToken,
  getNodesLength,
  getNodeSource,
  tokenSlice,
} from "./bindings";

export type NodeRef = {
  parent?: NodeRef;
  kind: "node";
  index: number;
  children: NodeRef[];
  slice: string;
  start: number;
  end: number;
};
const isInside = (a: NodeRef, maybeParent: NodeRef) => {
  return a.start >= maybeParent.start && a.end <= maybeParent.end;
};
const isSame = (a: NodeRef, b: NodeRef) => {
  return a.start === b.start && a.end === b.end;
};
const isSiblings = (a: NodeRef, b: NodeRef) => {
  return b.start > a.end || b.end < a.start;
};
export const treefy = (ast: number) => {
  const flat: NodeRef[] = [];
  for (let i = 0; i < getNodesLength(ast); i++) {
    flat.push({
      kind: "node",
      slice: getNodeSource(ast, i),
      index: i,
      children: [],
      start: getFirstToken(ast, i),
      end: getLastToken(ast, i),
    });
  }

  flat.sort((a, b) => {
    if (isInside(b, a)) {
      return -1;
    }
    if (isInside(a, b)) {
      return 1;
    }
    return a.start - b.start;
  });
  const root = flat[0];
  let parent = root;

  for (let i = 1; i < flat.length; i++) {
    const next = flat[i];
    while (!isInside(next, parent)) {
      if (!parent.parent) {
        throw new Error(`No parent found for ${parent.index}`);
      }
      parent = parent.parent;
    }
    parent.children.push(next);
    next.parent = parent;
    parent = next;
  }

  return root;
};
