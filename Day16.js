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

function ComputePresure(aNodeMap, aOpenValves, aMaxTime) {

  let time = 0;
  let presure = 0;
  for (let i = 0; i < aOpenValves.length; i++) {
    let dist = FindShortesDist(aNodeMap, (i == 0) ? "AA" : aOpenValves[i - 1], aOpenValves[i]);

    time += dist + 1;

    let pp = aNodeMap.get(aOpenValves[i]);

    let s = (aMaxTime - time);

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

function FindNextValid(aNodeMap, aValid, aMaxTime, aOpen, aFound) {
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

      let s1 = ComputePresure(aNodeMap, t1, aMaxTime);
      let s2 = ComputePresure(aNodeMap, t2, aMaxTime);

      if (s2 > s1) {
        found = false;
        break;
      }

    }

    if (found)
      return nn;
  }

  return null;
}

function FindMax(aNodeMap, aValid, aMaxTime) {
  let mm = [];

  while (1) {

    if (mm.length == aValid.length) {
      console.log(mm);
      return ComputePresure(aNodeMap, mm, aMaxTime);
    }

    let nn = FindNextValid(aNodeMap, aValid, aMaxTime, mm, mm);

    /*for (let i = 0; i < aValid.length; i++) {
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

      }*/

      if (nn != null)
        mm.push(nn);
    }
  return 0;
}

function FindMax2(aNodeMap, aValid, aMaxTime) {
  let mm = [];
  let ee = [];

  while (1) {

    console.log(mm);
    console.log(ee);

    if ((mm.length + ee.length) == aValid.length) {

      let y1 = ComputePresure(aNodeMap, mm, aMaxTime);
      let y2 = ComputePresure(aNodeMap, ee, aMaxTime);

      console.log(mm + " " + y1);
      console.log(ee + " " + y2);
      return y1 + y2;
    }

    let visited = [...mm, ...ee];

    let s1 = 0;
    let s2 = 0;
    let max = 0;
    for (let i = 0; i < aValid.length; i++)
      for (let j = 0; j < aValid.length; j++)
      {
        if (i == j)
          continue;

        if (visited.find((aa) => { return aa == aValid[i] || aa == aValid[j]; }))
          continue;

        let t1 = [...mm];
        t1.push(aValid[i]);

        let t2 = [...ee];
        t2.push(aValid[j]);

        let y1 = ComputePresure(aNodeMap, t1, aMaxTime);
        let y2 = ComputePresure(aNodeMap, t2, aMaxTime);

        let total = y1 + y2;

        if (total > max)
        {
          s1 = i;
          s2 = j; 
          max = total;
        }

        let t3 = [...mm];
        t3.push(aValid[j]);

        let t4 = [...ee];
        t4.push(aValid[i]);

        y1 = ComputePresure(aNodeMap, t3, aMaxTime);
        y2 = ComputePresure(aNodeMap, t4, aMaxTime);

        total = y1 + y2;

        if (total > max)
        {
          s1 = j;
          s2 = i; 
          max = total;
        }
      }

      if (max == 0) {
        for (let i = 0; i < aValid.length; i++)
          if (!visited.find((aa) => { return aa == aValid[i]; })) {
            ee.push(aValid[i]);
            break;
          }
      }
      else 
      {
        mm.push(aValid[s1]);
        ee.push(aValid[s2]);
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

let valid = FindValidPresure(nodeMap);

/*let all = GenerateAll(valid);

let max = 0;
for (let i = 0; i < all.length; i++) {

  console.log(i);

  max = Math.max(max, ComputePresure(nodeMap, all[i]));
}

console.log(max);*/

/*let y1 = ComputePresure(nodeMap, ["JJ", "BB", "CC"], 26);
let y12 = ComputePresure(nodeMap, ["BB", "JJ", "CC"], 26);
let y2 = ComputePresure(nodeMap, ["DD", "HH", "EE"], 26);

console.log(y1 + " " + y12 + " " + y2);*/

console.log(FindMax(nodeMap, valid, 30)); 

console.log(FindMax2(nodeMap, valid, 26)); 
