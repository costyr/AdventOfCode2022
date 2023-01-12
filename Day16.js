const util = require('./Util.js');
const dijkstra = require('./Dijkstra.js');

class SpecialGraph {
  constructor(aNodeMap) {
    this.mGraph = aNodeMap;
  }

  GetNeighbours(aNodeId) {

    let nodeValue = this.mGraph.get(aNodeId);

    let neighbours = [];

    for (let i = 0; i < nodeValue[1].length; i++) {

      neighbours.push({ id: nodeValue[1][i], cost: 1 });
    }

    return neighbours;
  }
}

function FindShortesDist(aNodeMap, aStart, aEnd) {

  let graph = new SpecialGraph(aNodeMap);

  let dijsk = new dijkstra.Dijkstra(graph);

  let ret = dijsk.FindShortestPath(aStart, aEnd);
  return ret.dist;
}

function Explore(aNodeMap, aCount) {

  let gg = [{ id: 'AA', open: [], pressure: 0 }];

  let max = 0;
  let maxOpen = "";
  for (let k = 0; k < aCount; k++) {

    let nn = [];
    for (let i = 0; i < gg.length; i++) {
      let id = gg[i].id;

      let open = util.CopyObject(gg[i].open);

      let pressure = gg[i].pressure;

      let value = aNodeMap.get(id);

      if (value[0] > 0 && !open.find((aa) => { return (aa == id); })) {
        open.push(id);
        open.sort((a, b) => { return a.localeCompare(b); });

        let valvePresure = (30 - k - 1) * value[0];

        nn.push({ id: id, open: open, pressure: pressure + valvePresure });
      }

      for (let j = 0; j < value[1].length; j++) {

        let neighbourId = value[1][j];

        nn.push({ id: neighbourId, open: util.CopyObject(gg[i].open), pressure: pressure });
      }
    }

    gg = nn;

    for (let i = 0; i < gg.length; i++)
      if (gg[i].pressure > max) {
        max = gg[i].pressure;
        maxOpen = JSON.stringify(gg[i].open);
        console.log(k + " " + gg[i].open + " " + gg.length + " " + max);
      }

    for (let i = gg.length - 1; i >= 0; i--) {
      if (gg[i].pressure < max && JSON.stringify(gg[i].open) == maxOpen)
        gg.splice(i, 1);
    }
  }
}

function FindValidPresure(aNodeMap) {

  let gg = [];
  for (let [key, value] of aNodeMap.entries()) {
    if (value[0] > 0)
      gg.push(key);
  }

  return gg;
}

function ComputePresure(aNodeMap, aOpenValves) {

  let time = 0;
  let presure = 0;
  for (let i = 0; i < aOpenValves.length; i++) {
    let dist = FindShortesDist(aNodeMap, (i == 0) ? "AA" : aOpenValves[i - 1], aOpenValves[i]);

    time += dist + 1;

    let pp = aNodeMap.get(aOpenValves[i]);

    let s = (30 - time);

    if (s <= 0)
      break;

    presure += s * pp[0];
  }

  return presure;
}

function GenerateAll(aValid) {

  let cc = [];

  for (let i = 0; i < aValid.length; i++)
    cc.push([aValid[i]]);

  while (1) {

    let newCC = [];
    for (let i = 0; i < cc.length; i++) {

      for (let j = 0; j < aValid.length; j++) {
        let gg = [...cc[i]];
        if (!gg.find((aa) => {
          return aa.localeCompare(aValid[j]) == 0;
        })) {
          gg.push(aValid[j]);

          newCC.push(gg);
        }
      }
    }

    cc = newCC;

    console.log(cc[0].length);

    if (cc[0].length == aValid.length)
      break;
  }

  return cc;
}

function FindMax(aNodeMap, aValid) {
  let mm = [];

  while (1) {

    if (mm.length == aValid.length) {
      console.log(mm);
      return ComputePresure(aNodeMap, mm);
    }

    for (let i = 0; i < aValid.length; i++) {
      let nn = aValid[i];

      if (mm.find((aa) => { return aa == nn; }))
        continue;

      let found = true;
      for (let j = 0; j < aValid.length; j++) {
        if (i == j || mm.find((aa) => { return aa == aValid[j]; }))
          continue;

        let t1 = [...mm];
        t1.push(nn);
        t1.push(aValid[j]);

        let t2 = [...mm];
        t2.push(aValid[j]);
        t2.push(nn);

        let s1 = ComputePresure(aNodeMap, t1);
        let s2 = ComputePresure(aNodeMap, t2);

        if (s2 > s1) {
          found = false;
          break;
        }

      }

      if (found)
        mm.push(nn);
    }
  }
  return 0;
}

let nodeMap = new Map();

let map = util.MapInput('./Day16Input.txt', (aElem) => {
  let tokens = aElem.split(/Valve | has flow rate=|; tunnels lead to valves |; tunnel leads to valve /).splice(1);

  let flatNodes = [tokens[0], parseInt(tokens[1]), tokens[2].split(',').map((aa) => { return aa.trim(); })];

  nodeMap.set(tokens[0], [parseInt(tokens[1]), tokens[2].split(',').map((aa) => { return aa.trim(); })]);

  return flatNodes;

}, '\r\n');

console.log(nodeMap);

console.log(FindShortesDist(nodeMap, "AA", "CC"));

let valid = FindValidPresure(nodeMap);

/*let all = GenerateAll(valid);

let max = 0;
for (let i = 0; i < all.length; i++) {

  console.log(i);

  max = Math.max(max, ComputePresure(nodeMap, all[i]));
}

console.log(max);*/

console.log(FindMax(nodeMap, valid)); 
