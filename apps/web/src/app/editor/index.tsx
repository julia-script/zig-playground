import { initVimMode } from "monaco-vim";

import {
  getNodeRange,
  tokenizeLine,
  render,
  getTokenRange,
} from "@zig-devkit/lib";
import * as monaco from "monaco-editor";
import {
  ComponentProps,
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { ActiveEntity, useAst } from "../AstProvider";
import { useEffectEvent } from "../useEffectEvent";
import { TokenToScopeMap } from "./TokenToScopeMap";
import { theme } from "./theme";
import { cn } from "@/lib/utils";

class State {
  clone = () => new State();
  equals = (other: monaco.languages.IState) => true;
}
monaco.editor.defineTheme("zig-theme", theme);

monaco.languages.register({ id: "zig" });
monaco.languages.setTokensProvider("zig", {
  getInitialState: () => {
    return new State();
  },
  tokenize(line, state) {
    const tokens = tokenizeLine(line).map((token) => ({
      startIndex: token.start,
      scopes: TokenToScopeMap[token.tag],
    }));
    return {
      tokens,
      endState: state.clone(),
    };
  },
});

export const Editor = () => {
  const ref = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const statusBarRef = useRef<HTMLDivElement>(null);
  const { source, setSource, getAst, ast, active, setActive, hovered } =
    useAst();

  const save = useEffectEvent(() => {
    startTransition(() => {
      const rendered = render(ast);
      const editor = editorRef.current;
      if (!editor) return;
      if (!rendered || rendered === source) return;
      const model = editor.getModel();
      if (!model) return;
      model.pushEditOperations(
        [],
        [
          {
            range: model.getFullModelRange(),
            text: rendered,
          },
        ],
        () => null,
      );
    });
  });
  useLayoutEffect(() => {
    if (!ref.current) return;
    if (editorRef.current) return;

    const editor = monaco.editor.create(ref.current, {
      value: source,
      language: "zig",
      automaticLayout: true,
      minimap: { enabled: false },
      wordWrap: "on",
      scrollBeyondLastLine: false,
      tabSize: 4,
      theme: "zig-theme",
      fontSize: 16,
    });

    const vim = initVimMode(editor, statusBarRef.current);

    editor.addAction({
      id: "format-on-save",
      label: "Format on Save",

      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      contextMenuGroupId: "navigation",
      contextMenuOrder: 1.5,

      run: function () {
        save();
      },
    });
    editor.getModel()?.onDidChangeContent(() => {
      startTransition(() => {
        setSource(editor.getValue());
      });
    });
    editorRef.current = editor;
    return () => {
      editor.dispose();
      vim.dispose();
      editorRef.current = null;
    };
  }, []);

  const highlight = useEffectEvent(
    (
      active: ActiveEntity,
      decorationOptions: monaco.editor.IModelDecorationOptions,
    ) => {
      const editor = editorRef.current;
      if (!editor) return;

      if (!active) return;
      const location =
        active.kind === "token"
          ? getTokenRange(ast, active.id)
          : active.kind === "node"
            ? getNodeRange(ast, active.id)
            : null;

      if (!location) return;

      const range = new monaco.Range(
        location.start_line + 1,
        location.start_column + 1,
        location.end_line + 1,
        location.end_column + 1,
      );

      const decorations = editor.createDecorationsCollection([
        // {
        //   range: new monaco.Range(3, 1, 5, 1),
        //   options: {
        //     isWholeLine: true,
        //     linesDecorationsClassName: "myLineDecoration",
        //   },
        // },
        {
          range,
          options: decorationOptions,
          // options: {
          //
          //   beforeContentClassName: "border-l border-1 border-yellow-500",
          //   afterContentClassName: "border-r border-1 border-yellow-500",
          //   inlineClassName: "bg-yellow-500 bg-opacity-20",
          //   // inlineClassName: "editor-active",
          //   // inlineClassName:
          //   //   "outline outline-2 outline-yellow-500 bg-opacity-20 outline-offset-2 inline-block rounded-sm",
          // },
        },
      ]);
      // console.log(decorations);
      return decorations;
    },
  );
  useEffect(() => {
    if (!active) return;
    const decorations = highlight(active, {
      // -5px 0px 0px 0px black
      beforeContentClassName: "active-left shadow-yellow-500",
      // beforeContentClassName: "border-l border-1 border-yellow-500",
      afterContentClassName: "active-right shadow-yellow-500",
      // inlineClassName: "bg-yellow-500 bg-opacity-20 brightness-125",
      inlineClassName: "bg-yellow-500 bg-opacity-20 brightness-125",
    });
    return () => {
      decorations?.clear();
    };
  }, [active]);
  useEffect(() => {
    if (!hovered) return;
    if (active && active.id === hovered.id && active.kind === hovered.kind)
      return;
    const decorations = highlight(hovered, {
      // beforeContentClassName: "border-l border-1 border-yellow-500",
      // afterContentClassName: "border-r border-1 border-yellow-500",
      inlineClassName: "bg-cyan-500 bg-opacity-20 brightness-125 ",
    });
    return () => {
      decorations?.clear();
    };
  }, [hovered, active]);
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div ref={ref} className="grow" />
      <div ref={statusBarRef} className="h-4" />
    </div>
  );
};

export const EditorReadOnly = ({
  source,
  className,
  ...rest
}: ComponentProps<"div"> & { source: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (editorRef.current) return;

    const editor = monaco.editor.create(ref.current, {
      language: "zig",
      // automaticLayout: true,
      value: source,

      minimap: { enabled: false },
      wordWrap: "on",
      lineNumbers: "off",
      readOnly: true,
      scrollBeyondLastLine: false,
      tabSize: 4,
      theme: "zig-theme",
      fontSize: 16,
    });

    editorRef.current = editor;
    console.log(editor);
    return () => {
      editor.dispose();
      editorRef.current = null;
    };
  }, []);

  return <div ref={ref} className={cn("h-36 w-full", className)} {...rest} />;
};
