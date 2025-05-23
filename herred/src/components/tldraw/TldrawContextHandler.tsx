import { useContext, useEffect } from "react";
import { NetworkContext } from "../Context";
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

          console.log("Current tool", editor.getCurrentTool());

          if (selected) {
            if (editor.getCurrentTool().id === "select") {
              const allShapes = editor.getCurrentPageShapes();

              const addedNode = allShapes.find(
                (shape) =>
                  !networkInfo.nodes.some((node) => node.shapeId === shape.id)
              )?.id;

              const addedConnection = allShapes.find(
                (shape) =>
                  !networkInfo.connections.some(
                    (connection) => connection.shapeId === shape.id
                  )
              )?.id;

              if (addedNode) {
                addNode(addedNode);
              } else if (addedConnection) {
                console.log("Added connection", addedConnection);
                if (addedConnection) {
                  const shape = editor.getShape(addedConnection as TLShapeId);
                  const bindings = editor.getBindingsFromShape(
                    shape as TLShape,
                    "arrow"
                  );

                  if (bindings.length > 0) {
                    addConnection(
                      addedConnection,
                      bindings[0].fromId,
                      bindings[0].toId
                    );
                  }
                }
              }

              if (selected.type === "node") {
                setSidePanelSelection("node", selected.id);
              } else if (selected.type === "arrow") {
                setSidePanelSelection("connection", selected.id);
              }
            }
          } else {
            if (editor.getCurrentTool().id === "delete-tool") {
              console.log("Delete tool");

              // Find deleted shape, found in networkInfo.nodes or networkInfo.connections but not in allShapes
              const allShapes = editor.getCurrentPageShapes();

              console.log("All shapes", allShapes);

              const deletedNode = networkInfo.nodes.find(
                (node) => !allShapes.some((shape) => shape.id === node.shapeId)
              )?.shapeId;

              console.log("Deleted node", deletedNode);

              const deletedConnection = networkInfo.connections.find(
                (connection) =>
                  !allShapes.some((shape) => shape.id === connection.shapeId)
              )?.shapeId;

              console.log("Deleted connection", deletedConnection);

              if (deletedNode) {
                const connections = networkInfo.nodes.find(
                  (node) => node.shapeId == deletedNode
                )?.neighbours;

                console.log("Connections", connections);

                connections?.forEach((connection) => {
                  editor.deleteShape(connection.shapeId as TLShapeId);
                  deleteConnection(connection.shapeId);
                });

                deleteNode(deletedNode);
              }

              if (deletedConnection) {
                deleteConnection(deletedConnection);
              }
            }

            setSidePanelSelection("general");
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
