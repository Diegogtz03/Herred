export interface ConnectionType {
  id: number;
  shapeId: string;
  name: string;
  source: string;
  target: string;
  type: 'directed' | 'undirected';
  weight: number;
  capacity: number;
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
  
export interface NetworkContextType {
  selectedNode: NodeType | null;
  selectedConnection: ConnectionType | null;
  setSidePanelSelection: (type: 'general' | 'node' | 'connection', id?: string) => void;
  networkInfo: NetworkInfoType;
  addNode: (id: string) => void;
  addConnection: (id: string, startId: string, endId: string, connectionType: 'fiber' | 'microwave', capacity: number) => void;
  deleteNode: (id: string) => void;
  deleteConnection: (id: string, startId: string, endId: string) => void;
  updateNode: (id: string, updatedNode: NodeType) => void;
  updateConnection: (id: string, updatedConnection: ConnectionType) => void;
  updateNetworkInfo: (updatedNetworkInfo: NetworkInfoType) => void;
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