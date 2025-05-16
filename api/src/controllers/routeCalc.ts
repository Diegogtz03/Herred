import { Request, Response } from "express";
import { Layout, Connection, LayoutNode } from "../interfaces/layout";

export const routeCalc = (req: Request, res: Response) => {
  const layout: Layout = JSON.parse(JSON.stringify(req.body));
  const adjList = getAdjacencyList(layout);

  const result = bfsGetPath(adjList, layout.start, layout.goal);
  console.log(result);

  res.send(result);
};

interface AdjacencyNode {
  nodeId: number;
  capacity: number;
}

interface AdjacencyList {
  [node: number]: AdjacencyNode[];
}

interface Path {
  path: AdjacencyNode[];
  maxCapacity: number;
}

const bfsGetPath = (adjList: AdjacencyList, start: number, goal: number) => {
  const queue: AdjacencyNode[][] = [[{ nodeId: start, capacity: Infinity }]];
  const paths: Path[] = [];
  let maxCapacity = 0;

  while (queue.length > 0) {
    const path = queue.shift()!;
    const node = path[path.length - 1];

    if (node.nodeId === goal) {
      const maxCapacity = path.reduce((min, node) => {
        return Math.min(min, node.capacity);
      }, Infinity);
      paths.push({ path, maxCapacity });
      continue;
    }

    const visitedInPath = new Set(path.map((n) => n.nodeId));

    for (const neighbor of adjList[node.nodeId] || []) {
      if (!visitedInPath.has(neighbor.nodeId)) {
        queue.push([...path, neighbor]);
      }
    }
  }

  return paths;
};

const getAdjacencyList = (layout: Layout) => {
  const adjList: AdjacencyList = {};
  for (let node of layout.nodes) {
    adjList[node.id] = node.neighbors.map((neighbor) => {
      const newNode: AdjacencyNode = {
        nodeId: neighbor.id,
        capacity: neighbor.capacity,
      };
      return newNode;
    });
  }

  return adjList;
};
