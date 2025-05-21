export interface AdjacencyNode {
  nodeId: number;
  capacity: number;
  connection: number; // 0: no connection 1: optic fiber, 2: microwave
}

export interface AdjacencyList {
  [node: number]: AdjacencyNode[];
}

export interface Path {
  path: AdjacencyNode[];
  maxCapacity: number;
  jumps: number;
  opticFiber: number;
  microwave: number;
}
