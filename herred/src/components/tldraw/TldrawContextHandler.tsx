import { useContext, useEffect } from "react";
import { NetworkContext } from "../Context";
import { myConnectionStyle } from "../tools/CustomStylePanel";
import { TLEventInfo, TLShape, TLShapeId, useEditor } from "tldraw";

export default function TldrawContextHandler() {
  const {
    setSidePanelSelection,
    addNode,
    addConnection,
    deleteNode,
    deleteConnection,
    networkInfo,
  } = useContext(NetworkContext);
  const editor = useEditor();

  useEffect(() => {
    function handlePointerDown(event: TLEventInfo) {
      if (event.name === "pointer_down") {
        if (event.target === "canvas") {
          const selected = editor.getSelectedShapes()[0];

          console.log("Selected", selected);
          console.log("Current tool", editor.getCurrentTool());

          if (selected && editor.getCurrentTool().id !== "delete-tool") {
            if (editor.getCurrentTool().id === "select") {
              if (selected.type === "node") {
                console.log("Selected node", selected.id);

                const existingNode = networkInfo.nodes.find(node => node.shapeId === selected.id);
                if (!existingNode){
                  addNode(selected.id);
                }
                setSidePanelSelection("node", selected.id);
              } else if (selected.type === "arrow") {
                console.log("Selected connection", selected.id);

                const existingConnection = networkInfo.connections.find(conn => conn.shapeId === selected.id);
                if (!existingConnection) {
                  const shape = editor.getShape(selected.id as TLShapeId);

                  const bindings = editor.getBindingsFromShape(
                    shape as TLShape,
                    "arrow"
                  );

                  if (bindings.length === 2) {
                    const sharedStyles = editor.getSharedStyles();
                    const activeConnectionType = sharedStyles.get(myConnectionStyle) || 'fiber';
                    addConnection(
                      selected.id,
                      bindings[0].toId,
                      bindings[1].toId,
                      activeConnectionType as 'fiber' | 'microwave',
                      0
                    );
                  }
                }
                setSidePanelSelection("connection", selected.id);
              }
            }
          } else {
            if (editor.getCurrentTool().id === "delete-tool") {
              console.log("Delete tool");
              // Find deleted shape, found in networkInfo.nodes or networkInfo.connections but not in allShapes
              const allShapes = editor.getCurrentPageShapes();

              const deletedNode = networkInfo.nodes.find(
                (node) => !allShapes.some((shape) => shape.id === node.shapeId)
              )?.shapeId;

              console.log("Deleted node 1:", deletedNode);

              const deletedConnection = networkInfo.connections.find(
                (connection) =>
                  !allShapes.some((shape) => shape.id === connection.shapeId)
              )?.shapeId;

              console.log("Deleted connection 1:", deletedConnection);

              if (deletedNode) {
                const connections = networkInfo.nodes.find(
                  (node) => node.shapeId == deletedNode
                )?.neighbours;

                console.log("Connections", connections);

                connections?.forEach((connection) => {
                  editor.deleteShape(connection.shapeId as TLShapeId);
                  deleteConnection(
                    connection.shapeId,
                    connection.source,
                    connection.target
                  );
                });

                deleteNode(deletedNode);
              }

              if (deletedConnection) {
                const connection = networkInfo.connections.find(
                  (connection) => connection.shapeId == deletedConnection
                );

                if (connection) {
                  deleteConnection(
                    deletedConnection,
                    connection.source,
                    connection.target
                  );
                }
              }
            }

            setSidePanelSelection("general");

            console.log("Network info", networkInfo);
          }
        }
      }
    }
    editor.on("event", handlePointerDown);

    return () => {
      editor.off("event", handlePointerDown);
    };
  }, [editor, setSidePanelSelection]);

  return <></>;
}
