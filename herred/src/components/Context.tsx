import React, { createContext, useState, ReactNode } from "react";
import {
  ConnectionType,
  NetworkContextType,
  NetworkInfoType,
  NodeType,
} from "./types";

const defaultNetworkInfo: NetworkInfoType = {
  name: "Red de San Luis",
  umbral: 80,
  nodes: [],
  numberOfNodes: 0,
  connections: [],
};

const defaultNetworkContextInfo: NetworkContextType = {
  selectedNode: null,
  selectedConnection: null,
  setSidePanelSelection: () => {},
  networkInfo: defaultNetworkInfo,
  addNode: () => {},
  addConnection: () => {},
  deleteNode: () => {},
  deleteConnection: () => {},
  updateNode: () => {},
  updateConnection: () => {},
  updateNetworkInfo: () => {},
  sidePanelType: "general",
};

export const NetworkContext = createContext<NetworkContextType>(
  defaultNetworkContextInfo
);

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [networkInfo, setNetworkInfo] =
    useState<NetworkInfoType>(defaultNetworkInfo);
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [sidePanelType, setSidePanelType] = useState<
    "general" | "node" | "connection"
  >("general");
  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null);
  const [connections, setConnections] = useState<ConnectionType[]>([]);
  const [selectedConnection, setSelectedConnection] =
    useState<ConnectionType | null>(null);
  const [numberOfNodes, setNumberOfNodes] = useState<number>(0);

  const addNode = (id: string) => {
    const newNode: NodeType = {
      shapeId: id,
      id: numberOfNodes,
      name: `Nodo ${numberOfNodes + 1}`,
      type: "central",
      status: "",
      description: "",
      umbral: 0,
      neighbours: [],
    };

    setNodes((prev) => [...prev, newNode]);
    setNumberOfNodes((prev) => prev + 1);

    setNetworkInfo((prev) => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
      numberOfNodes: prev.numberOfNodes + 1,
    }));

    setSelectedNode(newNode);
  };

  const addConnection = (id: string, startId: string, endId: string, connectionType: 'fiber' | 'microwave', capacity: number) => {
    const isMicrowave = connectionType === 'microwave';
    const newConn: ConnectionType = {
      id: connections.length,
      shapeId: id,
      name: `Conexión ${connections.length + 1}`,
      source: startId,
      target: endId,
      type: "directed",
      weight: 0,
      capacity: capacity,
      microwave: isMicrowave,
      opticFiber: !isMicrowave,
    };

    console.log("New connection", newConn, startId, endId);

    setConnections((prevConns) => [...prevConns, newConn]);

    setNetworkInfo((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) =>
        node.shapeId === startId || node.shapeId === endId
          ? { ...node, neighbours: [...node.neighbours, newConn] }
          : node
      ),
      connections: [...prev.connections, newConn],
    }));
    
    setSelectedConnection(newConn);
  };

  const deleteNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.shapeId !== id));
    
    setNumberOfNodes((prev) => Math.max(0, prev - 1));

    setNetworkInfo((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((node) => node.shapeId !== id),
      numberOfNodes: prev.numberOfNodes - 1,
    }));
  };

  const deleteConnection = (id: string, startId: string, endId: string) => {
    setConnections((prev) => prev.filter((n) => n.shapeId !== id));

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.shapeId === startId || node.shapeId === endId
          ? {
              ...node,
              neighbours: node.neighbours.filter((n) => n.shapeId !== id),
            }
          : node
      )
    );

    setNetworkInfo((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) =>
        node.shapeId === startId || node.shapeId === endId
          ? {
              ...node,
              neighbours: node.neighbours.filter((n) => n.shapeId !== id),
            }
          : node
      ),
      connections: prev.connections.filter((n) => n.shapeId !== id),
    }));
  };

  const setSidePanelSelection = (
    type: "general" | "node" | "connection",
    id?: string
  ) => {
    setSidePanelType(type);

    if (type === "node" && id) {
      const node = nodes.find((n) => n.shapeId === id);
      if (node) {
        setSelectedNode(node);
      }
    } if (type === "connection" && id) {
      const conn = connections.find((n) => n.shapeId === id);
      setSelectedConnection(conn || null);
      if (conn) setSelectedConnection(conn);
    } 
  };

  const updateNode = (id: string, updatedNode: NodeType) => {

    setNodes((prev) =>
      prev.map((node) => (node.shapeId === id ? updatedNode : node))
    );

    setNetworkInfo((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) =>
        node.shapeId === id ? updatedNode : node
      ),
    }))
  };

  const updateConnection = (id: string, updatedConnection: ConnectionType) => {
    setConnections((prev) =>
      prev.map((conn) => (conn.shapeId === id ? updatedConnection : conn)));

    setNetworkInfo((prev) => ({
      ...prev,
      connections: prev.connections.map((conn) => 
        conn.shapeId === id ? updatedConnection : conn
      ),
    }));

    setSelectedConnection(updatedConnection);
  };

  const updateNetworkInfo = (info : NetworkInfoType) => {
    setNetworkInfo(info);
  };

  return (
    <NetworkContext.Provider
      value={{
        networkInfo,
        updateNetworkInfo,
        selectedNode,
        addNode,
        addConnection,
        deleteNode,
        deleteConnection,
        updateNode,
        selectedConnection,
        updateConnection,
        sidePanelType,
        setSidePanelSelection,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};
