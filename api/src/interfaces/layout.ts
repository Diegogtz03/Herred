export interface Layout {
  nodes: LayoutNode[];
  start: number;
  goal: number;
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
