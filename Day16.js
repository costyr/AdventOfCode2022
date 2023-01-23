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

function GenerateAll(aValid, aK) {

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

    //console.log(cc[0].length);

    if (cc[0].length == aK)
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

  return "AA";
}

function FindMaxPresure(aNodeMap, aValid, aMaxTime) {
  let mm = [];

  for (let i = 0; i < aValid.length; i++)
    mm.push([aValid[i]]);

  while (1) {

    if (mm[0].length == aValid.length) {
     
      let max = 0;
      let index = -1;
      for (let i = 0; i < mm.length; i++) {
        let nn = ComputePresure(aNodeMap, mm[i], aMaxTime);
        //console.log(mm[i] + " " + nn);

        if (nn > max)
        {
          max = nn;
          index = i;
        }
      }

      //console.log(mm[index]);
      return max;
    }

    let oo = [];
    for (let i = 0; i < mm.length; i++) {
      let nn = FindNextValid(aNodeMap, aValid, aMaxTime, mm[i], mm[i]);
      oo.push([...mm[i], nn]);
    }

    mm = oo;
    
    }
  return 0;
}

function FindMaxPresureWithHelp(aNodeMap, aValid) {
  let all = [];

for (const c of combinationN(aValid, 7))
  all.push(c);

console.log(all.length);

let max = 0;
let s1 = 0;
let s2 = 0;
for (let i = 0; i < all.length; i++) {
  
  let tt = 0;
  for (let k = 0; k < all[i].length; k++)
    tt += aNodeMap.get(all[i][k])[0];

 for (let j = i + 1; j < all.length; j++)
 {
   let found = false;
   for (let k = 0; k < all[i].length; k++)
     if (all[j].find((aa) => { return aa.localeCompare(all[i][k]) == 0; })) {
       found = true;
       break;
     }

  if (!found)
  {
    let tt2 = 0;
    for (let k = 0; k < all[j].length; k++)
      tt2 += aNodeMap.get(all[j][k])[0];

    if (Math.abs(tt - tt2) > 5)
      continue;

    let y1 = FindMaxPresure(nodeMap, all[i], 26);
    let y2 = FindMaxPresure(nodeMap, all[j], 26);

    s1 = i;
    s2 = j;

    let total = y1 + y2;

    if (total > max) {
      max = total;

     console.log(i + " " + j + ": " + all[i] + "    " + all[j] + " " + max);
    }
  }
 }
}

console.log(all[s1] + "    " + all[s2]);

return max;
}

function FindMaxPresureWithHelp2(aNodeMap, aValid) {
  let all = [];

  for (const c of combinationN(aValid, 2))
    all.push( {e: [c[0]], n: [c[1]] });

  for (let i = 0; i < all.length; i++)
  {
    let e = all[i].e;
    let n = all[i].n;
    while (1)
    {
      let nn1 = FindNextValid(aNodeMap, aValid, 26, all[i].e, [...e, ...n]);
      e.push(nn1);
      let nn2 = FindNextValid(aNodeMap, aValid, 26, all[i].n, [...e, ...n]);
      n.push(nn2);

      let y1 = ComputePresure(aNodeMap, e, 26);
      let y2 = ComputePresure(aNodeMap, n, 26);

      let t1 = y1 + y2;
      
      e.splice(-1);
      n.splice(-1);
      
      let nn3 = FindNextValid(aNodeMap, aValid, 26, all[i].n, [...e, ...n]);
      n.push(nn3);
      let nn4 = FindNextValid(aNodeMap, aValid, 26, all[i].e, [...e, ...n]);
      e.push(nn4);

      y1 = ComputePresure(aNodeMap, e, 26);
      y2 = ComputePresure(aNodeMap, n, 26);

      let t2 = y1 + y2;

      if (t1 > t2)
      {
        e.splice(-1);
        n.splice(-1);
        
        e.push(nn1);
        n.push(nn2);
      }

      //console.log(e.length);
      if (e.length == 7)
        break;
    }
  }

  let max = 0;
  for (let i = 0; i < all.length; i++)
  {
    let y1 = ComputePresure(aNodeMap, all[i].e, 26);
    let y2 = ComputePresure(aNodeMap, all[i].n, 26);

    let tt = y1 + y2;

    if (tt > max)
    {
      max = tt;
    }
  }

  return max;
}

function* combinationN(array, n) {
  if (n === 1) {
    for (const a of array) {
      yield [a];
    }
    return;
  }

  for (let i = 0; i <= array.length - n; i++) {
    for (const c of combinationN(array.slice(i + 1), n - 1)) {
      yield [array[i], ...c];
    }
  }
}

function SplitEqual(aNodeMap, aValid) {
  aValid.sort((a, b)=>{ return aNodeMap.get(a)[0] - aNodeMap.get(b)[0];});

  let nn = [];
  let ee = [];
  for (let i = 0; i < aValid.length; i++)
    if (i % 2 != 0)
      nn.push(aValid[i]);
    else
      ee.push(aValid[i]);
  
  return { e: ee, n: nn };
}

function ToPresure(aNodeMap, aValves) {

  let pp = [];
  let total = 0;
  for (let i = 0; i < aValves.length; i++) {
    let oo = aNodeMap.get(aValves[i])[0];
    total += oo;
    pp.push(oo);
  }

  return { v: pp, t: total };
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

console.log(FindMaxPresure(nodeMap, valid, 30));

console.log(FindMaxPresureWithHelp(nodeMap, valid));

/*console.log(ToPresure(nodeMap, ["OT", "WI", "OM", "YW", "HV", "GB", "VX"]));
console.log(ToPresure(nodeMap, ["IS", "QQ", "ZL", "NG", "DG", "MX", "IC"]));

let ret = SplitEqual(nodeMap, valid);

console.log(ToPresure(nodeMap, ret.e));
console.log(ToPresure(nodeMap, ret.n));*/

//console.log(FindMaxPresure(nodeMap, ret.e, 26) + FindMaxPresure(nodeMap, ret.n, 26));


