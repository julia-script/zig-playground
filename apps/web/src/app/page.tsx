import Image from "next/image";
import {
  getNodesLength,
  getNodeTag,
  getNodeTags,
  parseAstFromSource,
} from "@zig-devkit/lib";
import { useMemo } from "react";
import { Playground } from "./Playground";

export default function Page(): JSX.Element {
  return <Playground />;
}
