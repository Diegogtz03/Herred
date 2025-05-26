export interface Layout {
  weights: SortingWeights;
  thresholds: Thresholds;
  nodes: LayoutNode[];
  start: number;
  goal: number;
  goalCapacity: number;
}

export interface SortingWeights {
  maxCapacity: number;
  jumps: number;
  connectionType: number;
}

export interface Thresholds {
  thresholdWarning: number;
  thresholdDanger: number;
}

export interface LayoutNode {
  id: number;
  consumption: number;
  neighbors: Connection[];
}

export interface Connection {
  id: number;
  bandwith: number;
  usage: number;
  microwave: boolean;
  opticFiber: boolean;
}
