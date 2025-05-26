import { Request, Response } from "express";
import {
  Layout,
  Connection,
  LayoutNode,
  SortingWeights,
  Thresholds,
} from "../interfaces/layout";
import {
  AdjacencyNode,
  AdjacencyList,
  Path,
  AnalyzedPath,
  NodeRequirements,
} from "../interfaces/algorithm";

export const routeCalc = (req: Request, res: Response) => {
  const layout: Layout = JSON.parse(JSON.stringify(req.body));

  const weights: SortingWeights = layout.weights;
  const thresholds: Thresholds = layout.thresholds;
  const adjList = getAdjacencyList(layout);
  const result = bfsGetPath(adjList, layout.start, layout.goal);
  const sortedResult = sortPaths(result, weights);
  const nuancedResult = analyzePaths(sortedResult, thresholds, layout);

  res.send({ result: nuancedResult });
};

const analyzePaths = (
  sortedResult: Path[],
  thresholds: Thresholds,
  layout: Layout
): AnalyzedPath[] => {
  return sortedResult.map((path) => {
    let bottleneckNodeId: number = 1;
    let minCapacity: number = Infinity;
    let results: NodeRequirements[] = path.path.map(
      (node): NodeRequirements => {
        let dangerFlag: boolean = false;
        let warningFlag: boolean = false;
        if (node.capacity < minCapacity) {
          bottleneckNodeId = node.nodeId;
          minCapacity = node.capacity;
        }

        let possibleCapacity =
          node.maxCapacity - node.capacity + layout.goalCapacity;

        let dangerThreshold =
          (node.maxCapacity * thresholds.thresholdDanger) / 100;
        let warningThreshold =
          (node.maxCapacity * thresholds.thresholdWarning) / 100;

        if (possibleCapacity > dangerThreshold) {
          dangerFlag = true;
        }
        if (possibleCapacity > warningThreshold) {
          warningFlag = true;
        }

        return { id: node.nodeId, dangerFlag, warningFlag };
      }
    );

    return {
      bottleneckNode: bottleneckNodeId,
      nodeRequirements: results,
      path: path,
    };

    // const maxCapacity = path.reduce((min, node) => {
    //   return Math.min(min, node.capacity);
    // }, Infinity);
  });
};

const sortPaths = (result: Path[], weights: SortingWeights): Path[] => {
  const scoreRatio = (
    primary: number,
    secondary: number,
    weight: number
  ): [number, number] => {
    if (primary === secondary) return [weight, weight];

    const max = Math.max(primary, secondary);
    const min = Math.min(primary, secondary);

    const scaledMin = (min * weight) / max;
    const adjustedMin = scaledMin;

    return primary > secondary ? [weight, adjustedMin] : [adjustedMin, weight];
  };

  return result.sort((a, b) => {
    // Composite score for connection type (fiber counts double)
    const aConn = a.opticFiber / a.microwave;
    const bConn = b.opticFiber / b.microwave;

    const [aCapacity, bCapacity] = scoreRatio(
      a.maxCapacity,
      b.maxCapacity,
      weights.maxCapacity
    );
    const [aLength, bLength] = scoreRatio(
      a.path.length - 1,
      b.path.length - 1,
      weights.jumps
    ); // fewer jumps is better
    const [aConnScore, bConnScore] = scoreRatio(
      aConn,
      bConn,
      weights.connectionType
    ); // higher connScore is better

    const aTotal = aCapacity - aLength + aConnScore;
    console.log(
      "aCapacity: %d - aLength: %d + aConnScore: %d = aTotal: %d",
      aCapacity,
      aLength,
      aConnScore,
      aTotal
    );
    const bTotal = bCapacity - bLength + bConnScore;
    console.log(
      "bCapacity: %d - bLength: %d + bConnScore: %d = bTotal: %d",
      bCapacity,
      bLength,
      bConnScore,
      bTotal
    );

    return bTotal - aTotal;
  });
};

const bfsGetPath = (adjList: AdjacencyList, start: number, goal: number) => {
  const queue: AdjacencyNode[][] = [
    [
      {
        nodeId: start,
        capacity: Infinity,
        maxCapacity: Infinity,
        connection: 0,
      },
    ],
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
        capacity: neighbor.bandwith - neighbor.usage,
        maxCapacity: neighbor.bandwith,
        connection: neighbor.opticFiber ? 2 : 1,
      };
      return newNode;
    });
  }

  return adjList;
};
