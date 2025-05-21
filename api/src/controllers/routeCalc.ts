import { Request, Response } from "express";
import {
  Layout,
  Connection,
  LayoutNode,
  SortingWeights,
} from "../interfaces/layout";
import { AdjacencyNode, AdjacencyList, Path } from "../interfaces/algorithm";

export const routeCalc = (req: Request, res: Response) => {
  const layout: Layout = JSON.parse(JSON.stringify(req.body));

  const weights: SortingWeights = layout.weights;
  const adjList = getAdjacencyList(layout);
  const result = bfsGetPath(adjList, layout.start, layout.goal);
  const sortedResult = sortPaths(result, weights);

  res.send(sortedResult);
};

const sortPaths = (result: Path[], weights: SortingWeights) => {
  return result.sort((a, b) => {
    const aConnectionScore = a.opticFiber * 2 + a.microwave;
    const bConnectionScore = b.opticFiber * 2 + b.microwave;
    const aLength = a.path.length;
    const bLength = b.path.length;
    let aCapacityPoints = 0,
      bCapacityPoints = 0;
    let aLengthPoints = 0,
      bLengthPoints = 0;
    let aConnectionPoints = 0,
      bConnectionPoints = 0;

    if (a.maxCapacity > b.maxCapacity) {
      aCapacityPoints = weights.maxCapacity;
      bCapacityPoints = (b.maxCapacity * weights.maxCapacity) / a.maxCapacity;
    } else {
      bCapacityPoints = weights.maxCapacity;
      aCapacityPoints = (a.maxCapacity * weights.maxCapacity) / b.maxCapacity;
    }

    if (aLength < bLength) {
      aLengthPoints = weights.jumps;
      bLengthPoints = (bLength * weights.jumps) / aLength;
      bLengthPoints %= weights.jumps;
    } else {
      bLengthPoints = weights.jumps;
      aLengthPoints = (aLength * weights.jumps) / bLength;
      aLengthPoints %= weights.jumps;
    }

    if (aConnectionScore < bConnectionScore) {
      aConnectionPoints = weights.connectionType;
      bConnectionPoints =
        (bConnectionScore * weights.connectionType) / aConnectionScore;
      bConnectionPoints %= weights.connectionType;
    } else {
      bConnectionPoints = weights.connectionType;
      aConnectionPoints =
        (aConnectionScore * weights.connectionType) / bConnectionScore;
      aConnectionPoints %= weights.connectionType;
    }

    const aGeneralScore = aCapacityPoints + aConnectionPoints + aLengthPoints;
    const bGeneralScore = bCapacityPoints + bConnectionPoints + bLengthPoints;

    console.log(
      "aCapacityPoints: %d aConnectionPoints: %d aLengthPoints: %d\n",
      aCapacityPoints,
      aConnectionPoints,
      aLengthPoints
    );
    console.log(
      "bCapacityPoints: %d bConnectionPoints: %d bLengthPoints: %d\n",
      bCapacityPoints,
      bConnectionPoints,
      bLengthPoints
    );

    return bGeneralScore - aGeneralScore;
  });
};

const bfsGetPath = (adjList: AdjacencyList, start: number, goal: number) => {
  const queue: AdjacencyNode[][] = [
    [{ nodeId: start, capacity: Infinity, connection: 0 }],
  ];
  const paths: Path[] = [];
  let maxCapacity = 0;

  while (queue.length > 0) {
    const path = queue.shift()!;
    const node = path[path.length - 1];

    if (node.nodeId === goal) {
      const maxCapacity = path.reduce((min, node) => {
        return Math.min(min, node.capacity);
      }, Infinity);
      const opticFiber = path.reduce((OFConnections, node) => {
        return node.connection == 2 ? (OFConnections += 1) : OFConnections;
      }, 0);
      paths.push({
        path,
        maxCapacity,
        jumps: path.length,
        opticFiber,
        microwave: path.length - opticFiber - 1,
      });
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
        connection: neighbor.opticFiber ? 2 : 1,
      };
      return newNode;
    });
  }

  return adjList;
};
