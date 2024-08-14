import { memoize } from "lodash-es";
import bytes from "./bin/zig-devkit-wasm-base64";
import {
  type Exports,
  type AstNodeIndex,
  type AstTokenIndex,
  type AstfullContainerDecl,
  type AstNodeTag,
  type AstfullContainerField,
  AstNodeTagMap,
  TokenTagMap,
  TokenTag,
  type AstfullFnProto,
  type AstSpan,
  type AstNodeArrayTypeSentinel,
  type AstNodeAsm,
  type AstNodeContainerField,
  type AstNodeFnProto,
  type AstNodeFnProtoOne,
  type AstNodeGlobalVarDecl,
  type AstNodeIf,
  type AstNodeLocalVarDecl,
  type AstNodePtrType,
  type AstNodePtrTypeBitRange,
  type AstNodeSlice,
  type AstNodeSliceSentinel,
  type AstNodeSubRange,
  type AstNodeWhile,
  type AstNodeWhileCont,
  type AstfullIf,
  type AstfullAsm,
  type AstfullWhile,
  type AstfullFor,
  type AstfullCall,
  type AstfullVarDecl,
  type AstfullStructInit,
  type AstfullArrayInit,
  type AstfullArrayType,
  type AstfullPtrType,
  type AstfullSlice,
  type AstfullSwitchCase,
  type AstfullAssignDestructure,
} from "./bin/types";
export * from "./bin/types";
export { AstNodeTag } from "./bin/types";
export const memory = new WebAssembly.Memory({ initial: 17 });
let exports: Exports;

let logMem: string = "";
let timeout: Timer | null = null;
export const promise = WebAssembly.instantiate(bytes, {
  env: {
    hostThrow(pointer: number, length: number): never {
      throw new Error(decodeString(memory, pointer, length));
    },
    hostWrite(pointer: number, length: number) {
      if (timeout) clearTimeout(timeout);
      const str = decodeString(memory, pointer, length);
      if (typeof window === "undefined") {
        process.stdout.write(str);
        return;
      }
      for (const c of str.split("")) {
        if (c === "\n") {
          console.log(logMem);
          logMem = "";
          continue;
        }
        logMem += c;
      }
      timeout = setTimeout(() => {
        console.log(logMem);
        logMem = "";
      }, 1000);
    },

    memory,
  },
}).then((result) => {
  exports = result.instance.exports as unknown as Exports;
});

const decoder = new TextDecoder();
const encoder = new TextEncoder();

export const decodeString = (
  memory: WebAssembly.Memory,
  pointer: number,
  length: number,
) => {
  const slice = new Uint8Array(memory.buffer, pointer, length);
  return decoder.decode(slice);
};

export const decodeNullTerminatedString = (
  memory: WebAssembly.Memory,
  pointer: number,
) => {
  const view = new Uint8Array(memory.buffer);
  const start = pointer;
  let end = pointer;
  while (view[end] !== 0) {
    end++;
  }
  const len = end - start;
  const decoded = decodeString(memory, start, len);
  exports.wasmFreeU8Z(start, len);

  return decoded;
};
export const deallocNullTerminatedString = (
  pointer: number,
  length: number,
) => {
  exports.wasmFree(pointer, length + 1);
};

export const encodeStringInto = (
  memory: WebAssembly.Memory,
  ptr: number,
  str: string,
) => {
  return encoder.encodeInto(str, new Uint8Array(memory.buffer, ptr));
};
//
// export const encodeString = (
//   memory: WebAssembly.Memory,
//   ptr: number,
//   str: string,
// ) => {
//   const buffer = new Uint8Array(memory.buffer);
//   const encoded = encoder.encode(str);
//   buffer.set(encoded, ptr);
//   return encoded.length;
// };

// class NullTerminatedString {
//   constructor(
//     public ptr: number,
//     public byteLength: number,
//   ) {}
//
//   static from(str: string) {
//     const bytes = encoder.encode(str);
//     const length = bytes.length;
//     const ptr = exports.wasmAllocZ(length);
//     const slice = new Uint8Array(memory.buffer, ptr, length);
//     slice.set(bytes);
//     return new NullTerminatedString(ptr, length);
//   }
//   dispose() {
//     exports.wasmFreeU8Z(this.ptr, this.byteLength + 1);
//   }
//   [Symbol.dispose]() {
//     this.dispose();
//     // exports.wasmFree(this.ptr, this.byteLength + 1);
//   }
// }
const encodeString = (str: string) => {
  const encoded = encoder.encode(str);
  const ptr = exports.wasmAllocZ(encoded.length + 1);
  const buffer = new Uint8Array(memory.buffer, ptr);

  buffer.set(encoded);
  buffer[encoded.length] = 0;

  return {
    length: encoded.length,
    buffer,
    ptr,
    dispose() {
      exports.wasmFreeU8Z(ptr, encoded.length);
    },
  };
};
export const parseAstFromSource = (source: string) => {
  const encoded = encodeString(source);
  const ast = exports.parseAstFromSource(encoded.ptr, encoded.length);
  console.log("[ast] create", typeof window, ast);
  return ast;
};

export const getNodesLength = (ast: number) => {
  return exports.getNodesLength(ast);
};

export const getNodeTag = (ast: number, index: AstNodeIndex) => {
  assertNode(ast, index);
  return exports.getNodeTag(ast, index) as AstNodeTag;
};

export const getTokenTag = (ast: number, index: AstTokenIndex) => {
  assertToken(ast, index);
  return exports.getTokenTag(ast, index) as TokenTag;
};

export const getTokenStart = (ast: number, index: AstTokenIndex) => {
  assertToken(ast, index);
  return exports.getTokenStart(ast, index);
};
export const getMainToken = (ast: number, index: AstNodeIndex) => {
  return exports.getMainToken(ast, index);
};

export const getFirstToken = (ast: number, index: AstNodeIndex) => {
  return exports.getFirstToken(ast, index);
};

export const getLastToken = (ast: number, index: AstNodeIndex) => {
  return exports.getLastToken(ast, index);
};
export const tokenLocation = (
  ast: number,
  byteOffset: number,
  tokenIndex: AstTokenIndex,
) => {
  const pointer = exports.tokenLocation(ast, byteOffset, tokenIndex);
  const buff = new Uint32Array(memory.buffer, pointer);
  const data = {
    line: buff[0],
    column: buff[1],
    line_start: buff[2],
    line_end: buff[3],
  };
  exports.wasmFreeU32Z(pointer, 4);
  return data;
};

export const getTokenRange = (ast: number, index: AstTokenIndex) => {
  const pointer = exports.getTokenRange(ast, index);
  const buff = new Uint32Array(memory.buffer, pointer);
  const data = {
    start_line: buff[0],
    start_column: buff[1],
    end_line: buff[2],
    end_column: buff[3],
  };
  exports.wasmFreeU32Z(pointer, 4);
  return data;
};
export const getNodeRange = (ast: number, index: AstNodeIndex) => {
  const pointer = exports.getNodeRange(ast, index);
  const buff = new Uint32Array(memory.buffer, pointer);
  const data = {
    start_line: buff[0],
    start_column: buff[1],
    end_line: buff[2],
    end_column: buff[3],
  };
  exports.wasmFreeU32Z(pointer, 4);
  return data;
};

export const getNodeData = (ast: number, index: AstNodeIndex) => {
  const pointer = exports.getNodeData(ast, index);
  const buff = new Uint32Array(memory.buffer, pointer);
  const data = {
    lhs: buff[0],
    rhs: buff[1],
  };
  exports.wasmFreeU32Z(pointer, 2);
  return data;
};

export const getExtraDataSpan = (
  ast: number,
  lhs: AstNodeIndex,
  rhs: AstNodeIndex,
) => {
  const pointer = exports.getExtraDataSpan(ast, lhs, rhs);
  const len = rhs - lhs;
  const buff = new Uint32Array(memory.buffer, pointer);
  const out = [...buff.slice(0, len)];
  exports.wasmFreeU32Z(pointer, len);
  return out;
};

export const getTokensLength = (ast: number) => {
  return exports.getTokensLength(ast);
};
export const getNodeTagLabel = (ast: number, index: AstNodeIndex) => {
  return AstNodeTagMap[getNodeTag(ast, index)];
};

export const destroyAst = (ast: number) => {
  console.log(`[ast] destroy`, typeof window, ast);
  exports.destroyAst(ast);
};

const decodeJson = <T>(ptr: number) => {
  const str = decodeNullTerminatedString(memory, ptr);
  const parsed = JSON.parse(str) as T;
  return parsed;
};

export const containerDeclRoot = (ast: number) => {
  assertNode(ast, 0);
  return decodeJson<AstfullContainerDecl>(exports.containerDeclRoot(ast));
};

const assertNode = (ast: number, index: AstNodeIndex) => {
  if (index >= exports.getNodesLength(ast)) {
    throw new Error(
      `Index out of bounds ${index} of ${exports.getNodesLength(ast)} from ${ast}`,
    );
  }
};
const assertToken = (ast: number, index: AstTokenIndex) => {
  if (index >= exports.getTokensLength(ast)) {
    throw new Error(
      `Index out of bounds ${index} of ${exports.getTokensLength(ast)} from ${ast}`,
    );
  }
};

export const getNodeSource = (ast: number, index: AstNodeIndex) => {
  assertNode(ast, index);
  return decodeNullTerminatedString(memory, exports.getNodeSource(ast, index));
  // return decodeNullTerminatedString(memory, exports.getNodeSource(ast, index));
};
export const nodeToSpan = (ast: number, index: AstNodeIndex): AstSpan => {
  assertNode(ast, index);
  const span = exports.nodeToSpan(ast, index);
  const [start, end, main] = new Uint32Array(memory.buffer, span);
  exports.wasmFreeU32Z(span, 3);
  return {
    start,
    end,
    main,
  };
};

export const tokenSlice = (ast: number, index: AstTokenIndex) => {
  assertToken(ast, index);
  return decodeNullTerminatedString(memory, exports.tokenSlice(ast, index));
};

export const tokenizeLine = (source: string) => {
  const encoded = encodeString(source);
  const pointer = exports.tokenizeLine(encoded.ptr, encoded.length);
  encoded.dispose();

  const view = new Uint32Array(memory.buffer, pointer);
  let end = 0;
  var max = 100;
  const tokens: {
    tag: TokenTag;
    start: number;
    end: number;
  }[] = [];
  while (view[end] !== 0) {
    max--;
    tokens.push({
      tag: view[end] as TokenTag,
      start: view[end + 1],
      end: view[end + 2],
    });

    end += 3;
  }
  exports.wasmFreeU32Z(pointer, end);

  return tokens;
};

export const render = (ast: number) => {
  return decodeNullTerminatedString(memory, exports.render(ast));
};

export const getNodeExtraDataArrayTypeSentinel = (
  ast: number,
  node: number,
) => {
  assertNode(ast, node);
  return decodeJson<AstNodeArrayTypeSentinel>(
    exports.getNodeExtraDataArrayTypeSentinel(ast, node),
  );
};
export const getNodeExtraDataAsm = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstNodeAsm>(exports.getNodeExtraDataAsm(ast, node));
};
export const getNodeExtraDataContainerField = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstNodeContainerField>(
    exports.getNodeExtraDataContainerField(ast, node),
  );
};
export const getNodeExtraDataFnProto = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstNodeFnProto>(exports.getNodeExtraDataFnProto(ast, node));
};
export const getNodeExtraDataFnProtoOne = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstNodeFnProtoOne>(
    exports.getNodeExtraDataFnProtoOne(ast, node),
  );
};
export const getNodeExtraDataGlobalVarDecl = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstNodeGlobalVarDecl>(
    exports.getNodeExtraDataGlobalVarDecl(ast, node),
  );
};
export const getNodeExtraDataIf = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstNodeIf>(exports.getNodeExtraDataIf(ast, node));
};
export const getNodeExtraDataLocalVarDecl = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstNodeLocalVarDecl>(
    exports.getNodeExtraDataLocalVarDecl(ast, node),
  );
};
export const getNodeExtraDataPtrType = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstNodePtrType>(exports.getNodeExtraDataPtrType(ast, node));
};
export const getNodeExtraDataPtrTypeBitRange = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstNodePtrTypeBitRange>(
    exports.getNodeExtraDataPtrTypeBitRange(ast, node),
  );
};
export const getNodeExtraDataSlice = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstNodeSlice>(exports.getNodeExtraDataSlice(ast, node));
};
export const getNodeExtraDataSliceSentinel = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstNodeSliceSentinel>(
    exports.getNodeExtraDataSliceSentinel(ast, node),
  );
};
export const getNodeExtraDataSubRange = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstNodeSubRange>(
    exports.getNodeExtraDataSubRange(ast, node),
  );
};
export const getNodeExtraDataWhile = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstNodeWhile>(exports.getNodeExtraDataWhile(ast, node));
};
export const getNodeExtraDataWhileCont = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstNodeWhileCont>(
    exports.getNodeExtraDataWhileCont(ast, node),
  );
};

// full data
export const fullContainerDecl = (ast: number, index: AstNodeIndex) => {
  assertNode(ast, index);
  return decodeJson<AstfullContainerDecl>(
    exports.fullContainerDecl(ast, index),
  );
};

export const ifFull = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstfullIf>(exports.ifFull(ast, node));
};
export const asmFull = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstfullAsm>(exports.asmFull(ast, node));
};
export const whileFull = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstfullWhile>(exports.whileFull(ast, node));
};
export const forFull = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstfullFor>(exports.forFull(ast, node));
};
export const callFull = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstfullCall>(exports.callFull(ast, node));
};
export const fullVarDecl = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstfullVarDecl>(exports.fullVarDecl(ast, node));
};

export const fullContainerField = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstfullContainerField>(
    exports.fullContainerField(ast, node),
  );
};
export const fullFnProto = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstfullFnProto>(exports.fullFnProto(ast, node));
};
export const fullStructInit = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstfullStructInit>(exports.fullStructInit(ast, node));
};
export const fullArrayInit = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstfullArrayInit>(exports.fullArrayInit(ast, node));
};
export const fullArrayType = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstfullArrayType>(exports.fullArrayType(ast, node));
};
export const fullPtrType = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstfullPtrType>(exports.fullPtrType(ast, node));
};
export const fullSlice = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstfullSlice>(exports.fullSlice(ast, node));
};
export const fullSwitchCase = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstfullSwitchCase>(exports.fullSwitchCase(ast, node));
};
export const fullAsm = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstfullAsm>(exports.fullAsm(ast, node));
};
export const fullCall = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstfullCall>(exports.fullCall(ast, node));
};

export const assignDestructure = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstfullAssignDestructure>(
    exports.assignDestructure(ast, node),
  );
};
export const globalVarDecl = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstfullVarDecl>(exports.globalVarDecl(ast, node));
};

export const localVarDecl = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstfullVarDecl>(exports.localVarDecl(ast, node));
};

export const simpleVarDecl = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstfullVarDecl>(exports.simpleVarDecl(ast, node));
};

export const alignedVarDecl = (ast: number, node: number) => {
  assertNode(ast, node);
  return decodeJson<AstfullVarDecl>(exports.alignedVarDecl(ast, node));
};
