const util = require('./Util.js');
const mm = require('./Matrix.js');
const dijkstra = require('./Dijkstra.js');

const kNeighboursTransform = [[0, 1], [0, -1], [1, 0], [-1, 0]];

function CreateGraph(aRawRiskMap) {

  let graph = new dijkstra.Graph();

  for (let i = 0; i < aRawRiskMap.length; i++)
    for (let j = 0; j < aRawRiskMap[i].length; j++) {

      let nodeCost = aRawRiskMap[i][j].charCodeAt(0);

      for (let k = 0; k < kNeighboursTransform.length; k++) {
        let x = j + kNeighboursTransform[k][0];
        let y = i + kNeighboursTransform[k][1];
        let neighbourId = x + "_" + y;        

        if (x >= 0 && x < aRawRiskMap[i].length && y >= 0 && y < aRawRiskMap.length) {

          let neighbourCost = aRawRiskMap[y][x].charCodeAt(0);

          if ((neighbourCost - nodeCost) <= 1)
          {
            let nodeId = j + "_" + i;
            graph.AddNeighbour(nodeId, { id: neighbourId, cost: neighbourCost });
          }
        }
      }
    }
  return graph;
}

function FindShortestPath(aGraph, aStart, aEnd) {
  let dijsk = new dijkstra.Dijkstra(aGraph);

  let startNodeId = aStart.x + "_" + aStart.y;

  let endNodeId = aEnd.x + "_" + aEnd.y;

  let ret = dijsk.FindShortestPath(startNodeId, endNodeId);
  return ret.path;
}

function PrepareMap(aMap) {

  let start = { x: 0, y: 0 };
  let end = {x : 0, y: 0 };
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++) {
      if (aMap[i][j] == 'S')
      {
        start.x = j;
        start.y = i;
        aMap[i][j] = 'a';
      }
      else if (aMap[i][j] == 'E')
      {
        end.x = j;
        end.y = i;
        aMap[i][j] = 'z';
      }
    }
  
  return { start: start, end: end };
}

function FindShortestPathFromAnyStart(aMap, aGraph, aEnd) {

  let minStepsPath= Number.MAX_SAFE_INTEGER;

  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++) {
      if (aMap[i][j] == 'a')
      {
        let result = FindShortestPath(aGraph, { x: j, y: i }, aEnd);

        if (result.length == 0)
          continue;

        let count = util.ComputeMapSize(result) - 1;

        if (count < minStepsPath)
          minStepsPath = count;
      }
    }
    
  return minStepsPath;
}

let map = util.MapInput('./Day12Input.txt', (aElem) => {
  return aElem.split('');
}, '\r\n');

let startEnd = PrepareMap(map);

let graph = CreateGraph(map);

let result = FindShortestPath(graph, startEnd.start, startEnd.end);

console.log(util.ComputeMapSize(result) - 1);

console.log(FindShortestPathFromAnyStart(map, graph, startEnd.end));
