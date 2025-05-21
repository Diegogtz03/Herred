import { useContext, useEffect } from "react";
import { NetworkContext } from "../Context";
import { TLEventInfo, useEditor } from "tldraw";

export default function TldrawContextHandler(): void {
  const { setSidePanelSelection } = useContext(NetworkContext);
  const editor = useEditor();

  useEffect(() => {
    
    function handlePointerDown(event: TLEventInfo) {
      if (event.name === "pointer_down") {
        if (event.target === "canvas") {
          const selected = editor.getSelectedShapes()[0];
          if (selected) {
          if (selected.type === "node") {
            setSidePanelSelection('node', selected.id);
          } else if (selected.type === "arrow") {
            setSidePanelSelection('connection', selected.id);
          } 
        } else {
          setSidePanelSelection('general');
          }
        }
      }
    };
    editor.on("event", handlePointerDown)

    return () => {
      editor.off("event", handlePointerDown)
    }
  }, [editor, setSidePanelSelection]);

}
