export interface ConnectionType {
  id: number;
  shapeId: string;
  name?: string;
  source: string;
  target: string;
  type: 'directed' | 'undirected';
  weight: number;
  capacity: number;
  microwave: boolean;
  opticFiber: boolean;
}

export interface RequestConnection {
  id: number;
  bandwith: number;
  usage: number;
  microwave: boolean;
  opticFiber: boolean;
}

export interface NodeType {
  name: string;
  shapeId: string;
  id: number;
  type: string;
  status: string;
  description: string;
  umbral: number;
  neighbours: ConnectionType[];
  consumption: number;
}


export interface NetworkInfoType {
  name: string;
  umbral: number;
  nodes: NodeType[];
  numberOfNodes: number;
  connections: ConnectionType[];
}

export interface RequestNode {
  id: number;
  consumption: number;
  neighbors: RequestConnection[];
}

export interface NetworkInfoRequest {
  start: number;
  goal: number;
  goalCapacity: number;
  thresholds: {
    thresholdWarning: number;
    thresholdDanger: number;
  };
  weights: {
    maxCapacity: number;
    jumps: number;
    connectionType: number;
  };
  nodes: RequestNode[];
}

export interface NetworkInfoResponse {
  result: {
    bottleneckNode: number;
    nodeRequirements: {
      id: number;
      dangerFlag: boolean;
      warningFlag: boolean;
    }[];
    path: {
      path: {
        nodeId: number;
        capacity: number | null;
        maxCapacity: number | null;
        connection: number;
      }[];
      maxCapacity: number;
      jumps: number;
      opticFiber: number;
      microwave: number;
    };
  }[];
}
  
export interface NetworkContextType {
  selectedNode: NodeType | null;
  selectedConnection: ConnectionType | null;
  setSidePanelSelection: (type: 'general' | 'node' | 'connection'| 'suggestion', id?: string) => void;
  networkInfo: NetworkInfoType;
  addNode: (id: string) => void;
  addConnection: (id: string, startId: string, endId: string, connectionType: 'fiber' | 'microwave', capacity: number) => void;
  deleteNode: (id: string) => void;
  deleteConnection: (id: string, startId: string, endId: string) => void;
  updateNode: (id: string, updatedNode: NodeType) => void;
  updateConnection: (id: string, startId: string, endId: string, updatedConnection: ConnectionType) => void;
  updateNetworkInfo: (updatedNetworkInfo: NetworkInfoType) => void;
  formatNetworkInfo: () => NetworkInfoRequest;
  algorithmResponse: NetworkInfoResponse | null;
  setAlgorithmResponse: (response: NetworkInfoResponse) => void;
  sidePanelType: 'general' | 'node' | 'connection' | 'suggestion';
};