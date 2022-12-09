const util = require('./Util.js');

function ComputeKey(aPos) {
  return aPos.x + "#" + aPos.y;
}

function IsNear(aPos1, aPos2) {
  let dist = Math.abs(aPos2.x - aPos1.x) + Math.abs(aPos2.y - aPos1.y);
  return ((aPos1.x == aPos2.x) || (aPos1.y == aPos2.y))  ? (dist <= 1) : (dist <= 2);
}

function UpdateKnotPos(aKnot, aNewPos, aPath) {
  aKnot.x = aNewPos.x;
  aKnot.y = aNewPos.y;

  let key = ComputeKey(aKnot);
  if (aPath[key] == undefined)
    aPath[key] = 1;
  else
    aPath[key]++;
}

function ComputePath(aMoves, aKnotCount) {

  let tailPath = [];
  let headPos = { x: 0, y: 0 };
  let tailPos = { x: 0, y: 0 };

  let knots = [];
  for (let i = 0; i < aKnotCount; i++)
    knots.push({ x: 0, y: 0 });

  tailPath["0#0"] = 1;
  for (let i = 0; i < aMoves.length; i++) {
    if (aMoves[i].dir == 'R') {
      for (let j = 0; j < aMoves[i].count; j++) {
        let prevHead = {x: headPos.x, y: headPos.y };
        headPos.x++;

        for (let k = 1; k < knots.length; k++) {

          let prev = (k == 1) ? prevHead : knots[k - 1];

          if (!IsNear(headPos, tailPos)) 
            UpdateKnotPos(tailPos, prevHead, tailPath);
        }
    }
    }
    else if (aMoves[i].dir == 'L') {
      for (let j = 0; j < aMoves[i].count; j++) {

        let prevHead = {x: headPos.x, y: headPos.y };

        headPos.x--;

        if (!IsNear(headPos, tailPos))
          UpdateKnotPos(tailPos, prevHead, tailPath);
      }
    }
    else if (aMoves[i].dir == 'U') {
      for (let j = 0; j < aMoves[i].count; j++) {

        let prevHead = {x: headPos.x, y: headPos.y };

        headPos.y++;

        if (!IsNear(headPos, tailPos))
          UpdateKnotPos(tailPos, prevHead, tailPath);
      }
    }
    else if (aMoves[i].dir == 'D') {
      for (let j = 0; j < aMoves[i].count; j++) {

        let prevHead = {x: headPos.x, y: headPos.y };

        headPos.y--;

        if (!IsNear(headPos, tailPos))
          UpdateKnotPos(tailPos, prevHead, tailPath);
      }
    }
  }

  return tailPath;
}

let bb = util.MapInput('./Day9Input.txt', (aElem) => {
  let dd = aElem.split(' ');
  return { dir: dd[0], count: parseInt(dd[1]) };
}, '\r\n');

console.log(bb);

let tailPath = ComputePath(bb);

console.log(util.ComputeMapSize(tailPath));
