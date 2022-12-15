const util = require('./Util.js');
const mm = require('./Matrix.js');

function ComputeKey(aPos) {
  return aPos.x + "#" + aPos.y;
}

function ComputeDist(aPos1, aPos2) {
  return Math.abs(aPos2.x - aPos1.x) + Math.abs(aPos2.y - aPos1.y);
}

function IsNear(aPos1, aPos2) {
  let dist = ComputeDist(aPos1, aPos2);
  return ((aPos1.x == aPos2.x) || (aPos1.y == aPos2.y)) ? (dist <= 1) : (dist <= 2);
}

function UpdateKnotPos(aKnot, aHead, aIsTail, aDir, aPath) {
  UpdateKnot(aKnot, aHead, aDir);

  if (aIsTail) {
    let key = ComputeKey(aKnot);
    if (aPath[key] == undefined)
      aPath[key] = 1;
    else
      aPath[key]++;
  }
}

function CopyNode(aNode1, aNode2) {
  aNode1.x = aNode2.x;
  aNode1.y = aNode2.y;
}

function UpdateKnot(aKnot, aHead, aDir) {

  if (aHead) {

    let moveDiag = (aKnot.x != aHead.x && aKnot.y != aHead.y);
    if (moveDiag) {
    const tt = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  
    let hh = 1;
    for (;;) { 
    for (let i = 0; i < tt.length; i++) {
      let x = aKnot.x + tt[i][0];
      let y = aKnot.y + tt[i][1];

      let dist = ComputeDist({ x: x, y: y }, aHead);

      if (dist == hh) {
        aKnot.x = x;
        aKnot.y = y;

        return;
      }
    }
    hh++;
    }
  }
  else {
    const tt = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    for (let i = 0; i < tt.length; i++) {
      let x = aKnot.x + tt[i][0];
      let y = aKnot.y + tt[i][1];

      let dist = ComputeDist({ x: x, y: y }, aHead);

      if (dist == 1) {
        aKnot.x = x;
        aKnot.y = y;

        return;
      }
    }
  }
  }
  else {
    if (aDir == 'R')
      aKnot.x++;
    else if (aDir == 'L')
      aKnot.x--;
    else if (aDir == 'U')
      aKnot.y++;
    else
      aKnot.y--;
  }
}

function MoveKnots(aKnots, aDir, aCount, aTailPath) {
  for (let j = 0; j < aCount; j++) {

   // if (aDir == 'R' && aCount == 17)
    //  PrintKnots(aKnots);

    UpdateKnot(aKnots[0], null, aDir);

    for (let k = 1; k < aKnots.length; k++) {
      if (!IsNear(aKnots[k], aKnots[k - 1])) {
        UpdateKnotPos(aKnots[k], aKnots[k - 1], (k == (aKnots.length - 1)), aDir, aTailPath);
      }
    }
  }
}

function PrintKnots(aKnots) {
  let grid = new mm.Matrix(50, 50, '.');

  let x = 10;
  let y = 10;
  for (let i = aKnots.length - 1; i >= 0 ; i--) {
    grid.SetValue(aKnots[i].y + y, aKnots[i].x + x, i == 0 ? 'H' : i.toString());
  }

  grid.PrintReverse('');
}

function ComputePath(aMoves, aKnotCount) {

  let tailPath = [];

  let knots = [];
  for (let i = 0; i < aKnotCount; i++)
    knots.push({ x: 0, y: 0 });

  tailPath["0#0"] = 1;
  for (let i = 0; i < aMoves.length; i++) {
    console.log("\n == " + aMoves[i].dir + " " + aMoves[i].count + " == \n");

    MoveKnots(knots, aMoves[i].dir, aMoves[i].count, tailPath);
    //PrintKnots(knots);
  }

  return tailPath;
}

let bb = util.MapInput('./Day9Input.txt', (aElem) => {
  let dd = aElem.split(' ');
  return { dir: dd[0], count: parseInt(dd[1]) };
}, '\r\n');

console.log(bb);

let tailPath = ComputePath(bb, 10);

console.log(util.ComputeMapSize(tailPath));
