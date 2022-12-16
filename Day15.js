const util = require('./Util.js');

function ComputeDist(aPt) {
  return Math.abs(aPt[2] - aPt[0]) + Math.abs(aPt[3] - aPt[1]);
}

function IsBeaconPos(aSensors, aX, aY) {
  for (let i = 0; i < aSensors.length; i++) {

    let dist1 = ComputeDist(aSensors[i]);
    let dist2 = ComputeDist([aSensors[i][0], aSensors[i][1], aX, aY]);
    if (dist2 <= dist1)
      return false;
  }
  return true;
}

function FindBeaconPos(aSensors, aMin, aMax) {

  const tt = [[-1, -1], [-1, 1], [-1, 1], [1, 1]];

  for (let k = 0; k < aSensors.length; k++) {

    let dist = ComputeDist(aSensors[k]);

    let sX = aSensors[k][0];
    let sY = aSensors[k][1];

    const corners = [[sX + dist + 1, sY], [sX, sY - dist - 1], [sX - dist - 1, sY], [sX, sY + dist + 1]];

    for (let i = 0; i < corners.length; i++) {

      let x = corners[i][0]; 
      let y = corners[i][1];

      for (let j = 0; j < dist; j++) {

        x += tt[i][0];
        y += tt[i][1];

        if ((x >= aMin && x <= aMax && y >= aMin && y <= aMax) && IsBeaconPos(aSensors, x, y))
          return x * aMax + y;
      }
    }
  }
  return -1;
}

function FindNonBeaconPosition(aSensors, aMinX, aMaxX, aY) {

  let pp = new Map();
  for (let k = aMinX; k <= aMaxX; k++) {
    for (let i = 0; i < aSensors.length; i++) {

      if (aSensors[i][3] == aY && aSensors[i][2] == k)
        break;

      let dist1 = ComputeDist(aSensors[i]);
      let dist2 = ComputeDist([aSensors[i][0], aSensors[i][1], k, aY]);
      if (dist2 <= dist1) {
        if (!pp.has(k))
          pp.set(k, 1);
        break;
      }

    }
  }

  return pp.size;
}

let minX = Number.MAX_SAFE_INTEGER;
let maxX = 0;
let maxDist = 0;

let sensors = util.MapInput('./Day15Input.txt', (aElem) => {
  let yy = aElem.split(/Sensor at x=|, y=|: closest beacon is at x=|, y=/).splice(1).map((aa) => { return parseInt(aa); });

  let min = Math.min(yy[0], yy[2]);

  if (min < minX)
    minX = min;

  let max = Math.max(yy[0], yy[2]);

  if (max > maxX)
    maxX = max;

  let dist = ComputeDist(yy);
  
  if (dist > maxDist)
    maxDist = dist;

  return yy;

}, '\r\n');

console.log(FindNonBeaconPosition(sensors, minX - maxDist, maxX + maxDist, 2000000));

console.log(FindBeaconPos(sensors, 0, 4000000));
