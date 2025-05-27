import React, { createContext, useState, ReactNode } from "react";
import {
  ConnectionType,
  NetworkContextType,
  NetworkInfoRequest,
  NetworkInfoResponse,
  NetworkInfoType,
  NodeType,
  RequestNode,
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
  formatNetworkInfo: () => {
    return {
      start: 0,
      goal: 0,
      goalCapacity: 0,
      thresholds: {
        thresholdWarning: 0,
        thresholdDanger: 0,
      },
      weights: {
        maxCapacity: 50,
        jumps: 30,
        connectionType: 20,
      },
      nodes: [],
    };
  },
  algorithmResponse: null,
  setAlgorithmResponse: () => {},
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
    "general" | "node" | "connection" | "suggestion"
  >("general");
  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null);
  const [connections, setConnections] = useState<ConnectionType[]>([]);
  const [algorithmResponse, setAlgorithmResponseInternal] =
    useState<NetworkInfoResponse | null>(null);
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
      goal: 0,
      umbral: 0,
      consumption: 0,
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

  const addConnection = (
    id: string,
    startId: string,
    endId: string,
    connectionType: "fiber" | "microwave",
    capacity: number
  ) => {
    const isMicrowave = connectionType === "microwave";

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

    const startNode = nodes.find((n) => n.shapeId === startId);
    const endNode = nodes.find((n) => n.shapeId === endId);
    const connectionForStartNode = {
      ...newConn,
      id: endNode?.id || 0,
    };

    const connectionForEndNode = {
      ...newConn,
      id: startNode?.id || 0,
    };

    setNodes((prev) =>
      prev.map((node) => {
        if (node.shapeId === startId) {
          return {
            ...node,
            neighbours: [...node.neighbours, connectionForStartNode],
          };
        } else if (node.shapeId === endId) {
          return {
            ...node,
            neighbours: [...node.neighbours, connectionForEndNode],
          };
        } else {
          return node;
        }
      })
    );

    setConnections((prevConns) => [...prevConns, newConn]);

    setNetworkInfo((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) => {
        if (node.shapeId === startId) {
          return {
            ...node,
            neighbours: [...node.neighbours, connectionForStartNode],
          };
        } else if (node.shapeId === endId) {
          return {
            ...node,
            neighbours: [...node.neighbours, connectionForEndNode],
          };
        } else {
          return node;
        }
      }),
      connections: [...prev.connections, newConn],
    }));

    setSelectedConnection(newConn);
  };

  const deleteNode = (id: string) => {
    const nodeToDelete = nodes.find((n) => n.shapeId === id);
    if (!nodeToDelete) return;

    const affectedConnections = connections.filter(
      (conn) => conn.source === id || conn.target === id
    );
    const affectedConnectionIds = affectedConnections.map(
      (conn) => conn.shapeId
    );

    setConnections((prev) =>
      prev.filter((conn) => !affectedConnectionIds.includes(conn.shapeId))
    );

    setNodes((prevNodes) =>
      prevNodes
        .filter((n) => n.shapeId !== id)
        .map((node) => ({
          ...node,
          neighbours: node.neighbours.filter(
            (neigh) => neigh.source !== id && neigh.target !== id
          ),
        }))
    );
    setNumberOfNodes((prev) => Math.max(0, prev - 1));

    setNetworkInfo((prev) => ({
      ...prev,
      nodes: prev.nodes
        .filter((n) => n.shapeId !== id)
        .map((node) => ({
          ...node,
          neighbours: node.neighbours.filter(
            (neigh) => neigh.source !== id && neigh.target !== id
          ),
        })),
      connections: prev.connections.filter(
        (conn) => !affectedConnectionIds.includes(conn.shapeId)
      ),
      numberOfNodes: prev.numberOfNodes - 1,
    }));
  };

  const deleteConnection = (id: string, startId?: string, endId?: string) => {
    const connToDelete = connections.find((c) => c.shapeId === id);
    if (!connToDelete) return;

    const sId = startId || connToDelete.source;
    const eId = endId || connToDelete.target;

    setConnections((prev) => prev.filter((n) => n.shapeId !== id));

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.shapeId === sId || node.shapeId === eId
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
        node.shapeId === sId || node.shapeId === eId
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
    type: "general" | "node" | "connection" | "suggestion",
    id?: string
  ) => {
    setSidePanelType(type);

    if (type === "node" && id) {
      const node =
        nodes.find((n) => n.shapeId === id) ||
        networkInfo.nodes.find((n) => n.shapeId === id);
      setSelectedNode(node || null);
      if (!node) setSelectedConnection(null);
    } else if (type === "suggestion" && id) {
      const node =
        nodes.find((n) => n.shapeId === id) ||
        networkInfo.nodes.find((n) => n.shapeId === id);
      setSelectedNode(node || null);
      if (!node) setSelectedConnection(null);
    } else if (type === "connection" && id) {
      const conn =
        connections.find((n) => n.shapeId === id) ||
        networkInfo.connections.find((n) => n.shapeId === id);
      setSelectedConnection(conn || null);
      if (!conn) setSelectedNode(null);
    } else {
      setSelectedNode(null);
      setSelectedConnection(null);
    }
  };

  const updateNode = (id: string, updatedNode: Partial<NodeType>) => {
    let fullUpdatedNode: NodeType | undefined;
    setNodes((prev) =>
      prev.map((node) => {
        if (node.shapeId === id) {
          fullUpdatedNode = { ...node, ...updatedNode };
          return fullUpdatedNode;
        }
        return node;
      })
    );
    if (fullUpdatedNode) {
      setSelectedNode(fullUpdatedNode);
    }

    setNetworkInfo((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) =>
        node.shapeId === id ? { ...node, ...updatedNode } : node
      ),
    }));
  };

  const updateConnection = (
    id: string,
    startId: string,
    endId: string,
    updatedConnectionPartial: Partial<ConnectionType>
  ) => {
    let fullUpdatedConnection: ConnectionType | undefined;

    setConnections((prev) =>
      prev.map((conn) => {
        if (conn.shapeId === id) {
          fullUpdatedConnection = { ...conn, ...updatedConnectionPartial };
          return fullUpdatedConnection;
        }
        return conn;
      })
    );

    if (fullUpdatedConnection) {
      setSelectedConnection(fullUpdatedConnection);
    }

    setNetworkInfo((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) =>
        n.shapeId === startId || n.shapeId === endId
          ? {
              ...n,
              neighbours: n.neighbours.map((c) =>
                c.shapeId === id
                  ? {
                      ...c,
                      ...updatedConnectionPartial,
                      id: c.id,
                    }
                  : c
              ),
            }
          : n
      ),
      connections: prev.connections.map((c) =>
        c.shapeId === id ? { ...c, ...updatedConnectionPartial } : c
      ),
    }));

    console.log("Updated network info", networkInfo);

    console.log("Updated connection", fullUpdatedConnection);
  };

  const updateNetworkInfo = (info: Partial<NetworkInfoType>) => {
    setNetworkInfo((prev) => ({ ...prev, ...info }));
  };

  const formatNetworkInfo = (): NetworkInfoRequest => {
    if (!selectedNode) {
      return defaultNetworkContextInfo.formatNetworkInfo();
    }

    const formatedNodes: RequestNode[] = networkInfo.nodes.map((node) => ({
      id: node.id,
      consumption: node.consumption,
      neighbors: node.neighbours.map((neighbour) => ({
        id: neighbour.id,
        bandwith: neighbour.capacity,
        usage: neighbour.weight,
        microwave: neighbour.microwave,
        opticFiber: neighbour.opticFiber,
      })),
    }));

    const request: NetworkInfoRequest = {
      start: networkInfo.nodes.find((n) => n.type === "central")?.id || 0,
      goal: selectedNode.id,
      goalCapacity: selectedNode.goal - selectedNode.consumption,
      thresholds: {
        thresholdWarning: 50,
        thresholdDanger: networkInfo.umbral,
      },
      weights: {
        maxCapacity: 50,
        jumps: 30,
        connectionType: 20,
      },
      nodes: formatedNodes,
    };

    return request;
  };

  const setAlgorithmResponse = (response: NetworkInfoResponse) => {
    setAlgorithmResponseInternal(response);
    //TODO ESTO FALLA PORQ NO SON EL MISMO DATO, SE FRESEA LA PAGINA
    // setNetworkInfo((prev) => ({
    //   ...prev,
    //   algorithmResponse: response,
    // }));
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
        formatNetworkInfo,
        algorithmResponse,
        setAlgorithmResponse,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};
