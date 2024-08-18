import { describe, expect, it } from "bun:test";
import { treefy } from "./treefy";
import {
  getNodesLength,
  getNodeSource,
  parseAstFromSource,
  promise,
  exports,
  generateZir,
  printZir,
  getZirErrors,
} from "./bindings";
import { inspect } from "bun";

await promise;
// export const source = `fn main() void {
//     const z: i32 = x + y;
// }
// `;
const source2 = `fn main() void {
    const x: i32 = 2;
    const y: i32 = 2;
    cons
}`;
const source = `
fn main() void {
    const z: i32 = 2 + 2
}
`;
describe("treefy", () => {
  it("should work", () => {
    const ast = parseAstFromSource(source2);
    try {
      const zir = generateZir(ast);
      const zirError = getZirErrors(zir, ast);
      console.log(printZir(zir, ast));
    } catch (e) {
      console.log(e);
      console.log("Failed to generate ZIR");
    }
    // console.log(printZir(zir, ast));
    // console.log('rendered')
    // console.log(exports.debugZir(ast));
    // const len = getNodesLength(ast);
    // for (let i = 0; i < len; i++) {
    //   console.log(`${i} ${getNodeSource(ast, i)}`);
    // }
    // console.log(inspect(treefy(ast), { colors: true, depth: 10 }));
    // expect(true).toBe(true);
  });
});
