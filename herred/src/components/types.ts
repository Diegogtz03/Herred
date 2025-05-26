
export interface ConnectionType {
  id: number;
  shapeId: string;
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
  nodes: {
    id: number;
    neighbors: ConnectionType[];
  }[];
}
  
export interface NetworkContextType {
  selectedNode: NodeType | null;
  selectedConnection: ConnectionType | null;
  setSidePanelSelection: (type: 'general' | 'node' | 'connection', id?: string) => void;
  networkInfo: NetworkInfoType;
  addNode: (id: string) => void;
  addConnection: (id: string, startId: string, endId: string) => void;
  deleteNode: (id: string) => void;
  deleteConnection: (id: string, startId: string, endId: string) => void;
  updateNode: (id: string, updatedNode: NodeType) => void;
  updateConnection: (id: string, updatedConnection: ConnectionType) => void;
  updateNetworkInfo: (updatedNetworkInfo: NetworkInfoType) => void;
  formatNetworkInfo: () => NetworkInfoRequest;
  sidePanelType: 'general' | 'node' | 'connection';
};
  

/* TODO: Limpiar el codigo ya que se estanblezcan los tipos de los nodos
 y conexiones que coinciden con los del algoritmo 

Types del algoritmo:

export interface Layout {
    weights: SortingWeights;
    nodes: LayoutNode[];
    start: number;
    goal: number;
  }
  
  export interface SortingWeights {
    maxCapacity: number;
    jumps: number;
    connectionType: number;
  }
  a
  export interface LayoutNode {
    id: number;
    neighbors: Connection[];
  }
  
  export interface Connection {
    id: number;    
    capacity: number;
    microwave: boolean;
    opticFiber: boolean;
  }
*/