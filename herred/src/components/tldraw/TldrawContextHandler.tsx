import { useContext, useEffect } from "react";
import { NetworkContext } from "../Context";
import { useEditor } from "tldraw";

export default function TldrawContextHandler() {
  const context = useContext(NetworkContext);
  const editor = useEditor();

  useEffect(() => {
    editor.on("event", (event) => {
      if (event.name === "pointer_down") {
        const selected = editor.getSelectedShapeIds();
        if (selected.length > 0) {
          context.setName("Node selected!");
        }
      }
    });
  }, [editor, context]);

  return <></>;
}
