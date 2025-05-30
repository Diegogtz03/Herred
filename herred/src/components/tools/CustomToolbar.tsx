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
  const isConnectionToolSelected = useIsToolSelected(tools["connection"]);
  const isDeleteToolSelected = useIsToolSelected(tools["delete"]);

  return (
    <DefaultToolbar>
      <TldrawUiMenuItem {...tools["node"]} isSelected={isNodeToolSelected} />
      <TldrawUiMenuItem
        {...tools["connection"]}
        isSelected={isConnectionToolSelected}
      />
      <TldrawUiMenuItem
        {...tools["delete"]}
        isSelected={isDeleteToolSelected}
      />
    </DefaultToolbar>
  );
}
