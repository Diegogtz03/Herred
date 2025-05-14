import {
  useIsToolSelected,
  DefaultToolbar,
  TldrawUiMenuItem,
  useTools,
} from "tldraw";

// Custom component for toolbar
export function CustomToolbar() {
  const tools = useTools();
  const isNodeToolSelected = useIsToolSelected(tools["node"]);

  return (
    <DefaultToolbar>
      <TldrawUiMenuItem {...tools["node"]} isSelected={isNodeToolSelected} />
    </DefaultToolbar>
  );
}
