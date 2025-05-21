import React, { createContext, useState, ReactNode } from 'react';
import { ConnectionType, NetworkContextType, NetworkInfoType, NodeType } from './types';

const defaultNetworkInfo: NetworkInfoType = {
  name: 'Red de San Luis',
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
  updateNode: () => {},
  updateConnection: () => {},
  updateNetworkInfo: () => {},
  sidePanelType: 'general',
};



export const NetworkContext = createContext<NetworkContextType>(defaultNetworkContextInfo);

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfoType>(defaultNetworkInfo);
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [sidePanelType, setSidePanelType] = useState<'general' | 'node' | 'connection'>('general');
  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null);
  const [connections, setConnections] = useState<ConnectionType[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<ConnectionType | null>(null);
  const [numberOfNodes, setNumberOfNodes] = useState<number>(0);

  const addNode = (node: NodeType) => {
    setNodes(prev => [...prev, node]);
    setNumberOfNodes(prev => prev + 1);
  };

  const deleteNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.shapeId !== id));
    setNumberOfNodes(prev => Math.max(0, prev - 1));
  };

  const setSidePanelSelection = (type: "general" | "node" | "connection", id?: string) => {
    setSidePanelType(type);
    if (type === 'node' && id) {
      const node = nodes.find(n => n.shapeId === id);
      if (node) {
        setSelectedNode(node);
      } else {
        const newNode:NodeType = { shapeId: id, id:22,  name: 'Nuevo Nodo', type: 'leaf', status: '', description: '', umbral: 0, neighbours: [] }
        addNode(newNode);
        setSelectedNode(newNode);
      }    
    }
    if (type === 'connection' && id) {
      const conn = connections.find(n => n.shapeId === id);
      if (conn) {
        setSelectedConnection(conn);
      } else {
        const newConn:ConnectionType = { id:22, shapeId:id, source: '', target: '',  type: "directed", weight: 0, capacity: 0, microwave: true, opticFiber: false }
        setConnections([...connections, newConn]);
        setSelectedConnection(newConn);
      }  
    }
  };

  const updateNode = (id: string, updatedNode: NodeType) => {
    setNodes(prev => prev.map(node => (node.shapeId === id ? updatedNode : node)));
  };

  const updateConnection = (id: string, updatedConnection: ConnectionType) => {
    setConnections(prev => prev.map(conn => (conn.shapeId === id ? updatedConnection : conn)));
  };

  const updateNetworkInfo = (info:NetworkInfoType) => {
    setNetworkInfo(info);
  };

  return (
    <NetworkContext.Provider
      value={{
        networkInfo,
        updateNetworkInfo,
        selectedNode, 
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

