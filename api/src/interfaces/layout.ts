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
