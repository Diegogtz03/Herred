import { Request, Response } from "express";
import { Layout, Connection, LayoutNode } from "../interfaces/layout";

export const routeCalc = (req: Request, res: Response) => {
  const layout: Layout = JSON.parse(JSON.stringify(req.body));
  const adjList = getAdjacencyList(layout);

  const result = bfsGetPath(adjList, layout.start, layout.goal);
  console.log(result);

  res.send(result);
};

interface AdjacencyList {
  [nodeId: number]: number[];
}

const bfsGetPath = (adjList: AdjacencyList, start: number, goal: number) => {
  const queue = [[start]];
  const visited = new Set();

  while (queue.length > 0) {
    const path = queue.shift()!;
    const node = path[path.length - 1];

    if (node === goal) {
      return path;
    }

    if (!visited.has(node)) {
      visited.add(node);
      for (const neighbor of adjList[node] || []) {
        queue.push([...path, neighbor]);
      }
    }
  }

  return null;
};

const getAdjacencyList = (layout: Layout) => {
  const adjList: AdjacencyList = {};
  for (let node of layout.nodes) {
    adjList[node.id] = node.neighbors.map((neighbor) => neighbor.id);
  }

  return adjList;
};
