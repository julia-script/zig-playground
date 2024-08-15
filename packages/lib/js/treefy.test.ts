import { describe, expect, it } from "bun:test";
import { treefy } from "./treefy";
import {
  getNodesLength,
  getNodeSource,
  parseAstFromSource,
  promise,
} from "./bindings";
import { inspect } from "bun";

await promise;
export const source = `fn main() void {
    const z: i32 = x + y;
}
`;
const source2 = `
const a = 1 + 2 + 3;
const b = 4 * 5 + 6;
`;
describe("treefy", () => {
  it("should work", () => {
    const ast = parseAstFromSource(source);
    const len = getNodesLength(ast);
    for (let i = 0; i < len; i++) {
      console.log(`${i} ${getNodeSource(ast, i)}`);
    }
    console.log(inspect(treefy(ast), { colors: true, depth: 10 }));
    expect(true).toBe(true);
  });
});
