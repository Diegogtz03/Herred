import React, { createContext, useState, ReactNode } from 'react';

export interface NodeInfoType {
  name: string;
  id: string;
  type: string;
  status: string;
  description: string;
  umbral: number;
}

export interface NetworkInfoType {
  name: string;
  nodes: NodeInfoType[];
  sidePanelInfo: 'general' | 'node' | 'conection';
  numberOfNodes: number;
  umbral: number;
  addNode: (node: NodeInfoType) => void;
  deleteNode: (id: string) => void;
  setName: (name: string) => void;
  setUmbral: (umbral: number) => void;
  setNumberOfNodes: (n: number) => void;
}

const defaultNetworkInfo: NetworkInfoType = {
  name: 'Red de San Luis',
  umbral: 80,
  nodes: [],
  sidePanelInfo: 'general',
  numberOfNodes: 0,
  addNode: () => {},
  deleteNode: () => {},
  setName: () => {},
  setUmbral: () => {},
  setNumberOfNodes: () => {},
};

export const NetworkContext = createContext<NetworkInfoType>(defaultNetworkInfo);

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [name, setName] = useState<string>('Red de San Luis');
  const [umbral, setUmbral] = useState<number>(80);
  const [nodes, setNodes] = useState<NodeInfoType[]>([]);
  const [sidePanelInfo, setSidePanelInfo] = useState<'general' | 'node' | 'conection'>('general');
  const [numberOfNodes, setNumberOfNodes] = useState<number>(0);

  const addNode = (node: NodeInfoType) => {
    setNodes(prev => [...prev, node]);
    setNumberOfNodes(prev => prev + 1);
  };

  const deleteNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setNumberOfNodes(prev => Math.max(0, prev - 1));
  };

  return (
    <NetworkContext.Provider
      value={{
        name,
        umbral,
        nodes,
        sidePanelInfo,
        numberOfNodes,
        addNode,
        deleteNode,
        setName,
        setUmbral,
       setNumberOfNodes,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};
