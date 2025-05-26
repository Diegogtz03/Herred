export interface AdjacencyNode {
  nodeId: number;
  capacity: number;
  maxCapacity: number;
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

export interface AnalyzedPaths {
  paths: AnalyzedPath[];
}

export interface AnalyzedPath {
  path: Path;
  bottleneckNode: number;
  nodeRequirements: NodeRequirements[];
}

export interface NodeRequirements {
  id: number;
  warningFlag: boolean;
  dangerFlag: boolean;
}
