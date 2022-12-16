const util = require('./Util.js');
const dijkstra = require('./Dijkstra.js');

class SpecialGraph {
  constructor(aNodeMap) {
    this.mGraph = aNodeMap;
  }

  GetNeighbours(aNodeId) {

    let tt = aNodeId.split('#');

    let time = parseInt(tt[0]);

    if (time == 1)
      return [];

    let id = tt[1];

    let nodeValue = this.mGraph.get(id);

    let neighbours = [];
    for (let i = 0; i < nodeValue[1].length; i++) {

      let neighbourValue = this.mGraph.get(nodeValue[1][i]);

      for (let j = 1; j < 3; j++) {
        let newTime = time - j;

        if (newTime == 0)
          continue;

        let cost = j > 1 ? neighbourValue[0] * newTime : 0;
      
        let neighbourId = newTime.toString() + "#" + nodeValue[1][i];

        neighbours.push({ id: neighbourId, cost: cost});
      }
    }

    console.log(neighbours);

    return neighbours;
  }
}

function FindBestCost(aGraph, aStart, aEnd) {
  let dijsk = new dijkstra.Dijkstra(aGraph);

  let startNodeId = 30 + "#" + aStart;
  let endNodeId = 1 + "#" + aEnd;

  let ret = dijsk.FindShortestPath(startNodeId, endNodeId);
  return ret.dist;
}

let nodeMap = new Map();

let map = util.MapInput('./Day16TestInput.txt', (aElem) => {
  let tokens = aElem.split(/Valve | has flow rate=|; tunnels lead to valves |; tunnel leads to valve /).splice(1);

  let flatNodes = [tokens[0], parseInt(tokens[1]), tokens[2].split(',').map((aa)=> {return aa.trim();})];

  nodeMap.set(tokens[0], [parseInt(tokens[1]), tokens[2].split(',').map((aa)=> {return aa.trim();})]);

  return flatNodes;

  }, '\r\n');

console.log(nodeMap);

let gg = new SpecialGraph(nodeMap);

for (let i = 0; i < map.length; i++) {
  if (map[i][0] != 'AA') {

    console.log("AA => " + map[i][0]);
    console.log(FindBestCost(gg, "AA", map[i][0]));
  }
}
