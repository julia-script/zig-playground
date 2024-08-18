import {
  getNodeRange,
  tokenizeLine,
  render,
  getTokenRange,
} from "@zig-devkit/lib";
import * as monaco from "monaco-editor";
import { startTransition, useEffect, useLayoutEffect, useRef } from "react";
import { ActiveEntity, useAst } from "../AstProvider";
import { useEffectEvent } from "../useEffectEvent";
import { TokenToScopeMap } from "./TokenToScopeMap";
import { theme } from "./theme";
import { trycatch } from "../trycatch";
// import { initVimMode } from "monaco-vim";

class State {
  clone = () => new State();
  equals = (other: monaco.languages.IState) => true;
}
monaco.editor.defineTheme("zig-theme", theme);

monaco.languages.register({ id: "zig", extensions: ["zig"] });
monaco.languages.setTokensProvider("zig", {
  getInitialState: () => {
    return new State();
  },
  tokenize(line, state) {
    const [, tokens = []] = trycatch(() =>
      tokenizeLine(line).map((token) => ({
        startIndex: token.start,
        scopes: TokenToScopeMap[token.tag],
      })),
    );
    return {
      tokens,
      endState: state.clone(),
    };
  },
});
monaco.languages.setLanguageConfiguration("zig", {
  comments: {
    lineComment: "//",
  },
});

export const Editor = () => {
  const ref = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const statusBarRef = useRef<HTMLDivElement>(null);
  const { source, setSource, ast, active, hovered, diagnostics } = useAst();

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
      // wordWrap: "on",
      scrollBeyondLastLine: false,
      tabSize: 4,
      theme: "zig-theme",
      fontSize: 12,
    });

    // const vim = initVimMode(editor, statusBarRef.current);

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
      // vim.dispose();
      editorRef.current = null;
    };
  }, []);
  useEffect(() => {
    if (!editorRef.current) return;
    const model = editorRef.current.getModel();
    if (!model) return;
    if (!diagnostics?.length) {
      monaco.editor.setModelMarkers(model, "astErrors", []);
      return;
    }

    monaco.editor.setModelMarkers(
      model,
      "astErrors",
      diagnostics.map((diagnostic) => {
        const position = model.getPositionAt(diagnostic.pos);

        return {
          severity: monaco.MarkerSeverity.Error,
          message: diagnostic.message,
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column + diagnostic.len,
        };
      }),
    );
  }, [diagnostics]);

  const highlight = useEffectEvent(
    (
      active: ActiveEntity,
      decorationOptions: monaco.editor.IModelDecorationOptions,
    ) => {
      const editor = editorRef.current;
      if (!editor) return;

      if (!active) return;
      const [, location] = trycatch(() => {
        if (active.kind === "token") {
          return getTokenRange(ast, active.id);
        }
        return getNodeRange(ast, active.id);
      });
      if (!location) return;
      if (!location) return;

      const range = new monaco.Range(
        location.start_line + 1,
        location.start_column + 1,
        location.end_line + 1,
        location.end_column + 1,
      );

      const decorations = editor.createDecorationsCollection([
        {
          range,
          options: decorationOptions,
        },
      ]);
      return decorations;
    },
  );
  useEffect(() => {
    if (!active) return;
    const decorations = highlight(active, {
      beforeContentClassName: "active-left shadow-yellow-500",
      afterContentClassName: "active-right shadow-yellow-500",
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
      inlineClassName: "bg-cyan-500 bg-opacity-20 brightness-125 ",
    });
    return () => {
      decorations?.clear();
    };
  }, [hovered, active]);
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div ref={ref} className="grow" />
      <div ref={statusBarRef} className="h-4" />
    </div>
  );
};
