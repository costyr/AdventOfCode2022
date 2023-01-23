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

function FindValidPresure(aNodeMap) {

  let gg = [];
  for (let [key, value] of aNodeMap.entries()) {
    if (value[0] > 0)
      gg.push(key);
  }

  return gg;
}

function ComputePresure(aNodeMap, aDistCache, aOpenValves, aMaxTime) {

  let time = 0;
  let presure = 0;
  for (let i = 0; i < aOpenValves.length; i++) {

    let first = (i == 0) ? "AA" : aOpenValves[i - 1];
    let second = aOpenValves[i];

    let dist = aDistCache.get(first + "_" + second);

    time += dist + 1;

    let pp = aNodeMap.get(aOpenValves[i]);

    let s = (aMaxTime - time);

    if (s <= 0)
      break;

    presure += s * pp[0];
  }

  return presure;
}

function FindNextValid(aNodeMap, aDistCache, aValid, aMaxTime, aOpen, aFound) {
  for (let i = 0; i < aValid.length; i++) {
    let nn = aValid[i];

    if (aFound.find((aa) => { return aa == nn; }))
      continue;

    let found = true;
    for (let j = 0; j < aValid.length; j++) {
      if (i == j || aFound.find((aa) => { return aa == aValid[j]; }))
        continue;

      let t1 = [...aOpen];
      t1.push(nn);
      t1.push(aValid[j]);

      let t2 = [...aOpen];
      t2.push(aValid[j]);
      t2.push(nn);

      let s1 = ComputePresure(aNodeMap, aDistCache, t1, aMaxTime);
      let s2 = ComputePresure(aNodeMap, aDistCache, t2, aMaxTime);

      if (s2 > s1) {
        found = false;
        break;
      }

    }

    if (found)
      return nn;
  }

  return "AA";
}

function FindMaxPresure(aNodeMap, aDistCache, aValid, aMaxTime) {
  let mm = [];

  for (let i = 0; i < aValid.length; i++)
    mm.push([aValid[i]]);

  while (1) {

    if (mm[0].length == aValid.length) {

      let max = 0;
      let index = -1;
      for (let i = 0; i < mm.length; i++) {
        let nn = ComputePresure(aNodeMap, aDistCache, mm[i], aMaxTime);
        if (nn > max) {
          max = nn;
          index = i;
        }
      }

      return max;
    }

    let oo = [];
    for (let i = 0; i < mm.length; i++) {
      let nn = FindNextValid(aNodeMap, aDistCache, aValid, aMaxTime, mm[i], mm[i]);
      oo.push([...mm[i], nn]);
    }

    mm = oo;

  }
  return 0;
}

function FindMaxPresureWithHelp(aNodeMap, aDistCache, aValid) {
  let all = [];

  let midLength = Math.floor(aValid.length / 2);

  for (const c of util.CombinationN(aValid, midLength))
    all.push(c);

  let max = 0;
  let s1 = 0;
  let s2 = 0;
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      let found = false;
      for (let k = 0; k < all[i].length; k++)
        if (all[j].find((aa) => { return aa.localeCompare(all[i][k]) == 0; })) {
          found = true;
          break;
        }

      if (!found) {
        let y1 = FindMaxPresure(aNodeMap, aDistCache, all[i], 26);
        let y2 = FindMaxPresure(aNodeMap, aDistCache, all[j], 26);

        let total = y1 + y2;

        if (total > max) {
          max = total;

          s1 = i;
          s2 = j;

          console.log(i + " " + j + ": " + all[i] + "    " + all[j] + " " + max);
        }
      }
    }
  }

  console.log(all[s1] + "   " + all[s2]);

  return max;
}

function ComputeMinDistCache(aNodeMap, aValid) {

  let mm = new Map();

  let gg = ["AA", ...aValid];
  for (let i = 0; i < gg.length; i++)
    for (let j = 0; j < gg.length; j++) {
      if (i == j)
        continue;

      let dist = FindShortesDist(aNodeMap, gg[i], gg[j]);

      mm.set(gg[i] + "_" + gg[j], dist);
    }

  return mm;
}

let nodeMap = new Map();

let map = util.MapInput('./Day16Input.txt', (aElem) => {
  let tokens = aElem.split(/Valve | has flow rate=|; tunnels lead to valves |; tunnel leads to valve /).splice(1);

  let flatNodes = [tokens[0], parseInt(tokens[1]), tokens[2].split(',').map((aa) => { return aa.trim(); })];

  nodeMap.set(tokens[0], [parseInt(tokens[1]), tokens[2].split(',').map((aa) => { return aa.trim(); })]);

  return flatNodes;

}, '\r\n');

console.log(nodeMap);

let valid = FindValidPresure(nodeMap);

let distCache = ComputeMinDistCache(nodeMap, valid);

console.log(FindMaxPresure(nodeMap, distCache, valid, 30));

console.log(FindMaxPresureWithHelp(nodeMap, distCache, valid));
