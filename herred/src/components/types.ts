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
  goal: number;
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

export const dummyResponse: NetworkInfoResponse = {
  result : [
    {
      bottleneckNode: 3,
      nodeRequirements: [
        {
          id: 1,
          dangerFlag: false,
          warningFlag: false
        },
        {
          id: 5,
          dangerFlag: false,
          warningFlag: true
        },
        {
          id: 4,
          dangerFlag: false,
          warningFlag: true
        },
        {
          id: 2,
          dangerFlag: true,
          warningFlag: true
        },
        {
          id: 3,
          dangerFlag: true,
          warningFlag: true
        }
      ],
      path: {
        path: [
          {
            nodeId: 1,
            capacity: null,
            maxCapacity: null,
            connection: 0
          },
          {
            nodeId: 5,
            capacity: 400,
            maxCapacity: 1000,
            connection: 2
          },
          {
            nodeId: 4,
            capacity: 300,
            maxCapacity: 600,
            connection: 2
          },
          {
            nodeId: 2,
            capacity: 100,
            maxCapacity: 300,
            connection: 2
          },
          {
            nodeId: 3,
            capacity: 50,
            maxCapacity: 200,
            connection: 1
          }
        ],
        maxCapacity: 50,
        jumps: 5,
        opticFiber: 3,
        microwave: 1
      }
    },
    {
      bottleneckNode: 3,
      nodeRequirements: [
        {
          id: 1,
          dangerFlag: false,
          warningFlag: false
        },
        {
          id: 2,
          dangerFlag: true,
          warningFlag: true
        },
        {
          id: 3,
          dangerFlag: true,
          warningFlag: true
        }
      ],
      path: {
        path: [
          {
            nodeId: 1,
            capacity: null,
            maxCapacity: null,
            connection: 0
          },
          {
            nodeId: 2,
            capacity: 100,
            maxCapacity: 400,
            connection: 1
          },
          {
            nodeId: 3,
            capacity: 50,
            maxCapacity: 200,
            connection: 1
          }
        ],
        maxCapacity: 50,
        jumps: 3,
        opticFiber: 0,
        microwave: 2
      }
    }
  ]
};
  
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