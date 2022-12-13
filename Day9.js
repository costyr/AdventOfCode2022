const util = require('./Util.js');
const mm = require('./Matrix.js');

function ComputeKey(aPos) {
  return aPos.x + "#" + aPos.y;
}

function IsNear(aPos1, aPos2) {
  let dist = Math.abs(aPos2.x - aPos1.x) + Math.abs(aPos2.y - aPos1.y);
  return ((aPos1.x == aPos2.x) || (aPos1.y == aPos2.y))  ? (dist <= 1) : (dist <= 2);
}

function UpdateKnotPos(aKnot, aIsTail, aNewPos, aDir, aPath) {
  
  let oo = (aKnot.x != aNewPos.x) && (aKnot.y != aNewPos.y);
  UpdateKnot(aKnot, aDir, oo, aNewPos);

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

function UpdateKnot(aKnot, aDir, aMoveDiag, aHead) {
  if (aDir == 'R') {
    aKnot.x++;
    if (aMoveDiag)
      (aKnot.y < aHead.y) ? aKnot.y-- : aKnot.y++;
  }
  else if (aDir == 'L') {
    aKnot.x--;
    if (aMoveDiag)
      (aKnot.y < aHead.y) ? aKnot.y++ : aKnot.y--;
  }
  else if (aDir == 'U') {
    aKnot.y++;
    if (aMoveDiag)
      (aKnot.x < aHead.x) ? aKnot.x++ : aKnot.x--;
  }
  else {
    aKnot.y--;
    if (aMoveDiag)
      (aKnot.x < aHead.x) ? aKnot.x-- : aKnot.x++;
  }
}

function MoveKnots(aKnots, aDir, aCount, aTailPath) {
  for (let j = 0; j < aCount; j++) {

    if (aDir == 'L' && aCount == 8)
      PrintKnots(aKnots);

    UpdateKnot(aKnots[0], aDir, false, null);

    for (let k = 1; k < aKnots.length; k++) {
      if (!IsNear(aKnots[k], aKnots[k - 1])) {
        UpdateKnotPos(aKnots[k], (k == (aKnots.length - 1)), aKnots[k - 1], aDir, aTailPath);
      }
    }
  }  
}

function PrintKnots(aKnots) {
   let grid = new mm.Matrix(30, 30, '.');
   
   let x = 10;
   let y = 10;
   for (let i = 0; i < aKnots.length; i++)
   {
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
    PrintKnots(knots);
  }

  return tailPath;
}

let bb = util.MapInput('./Day9TestInput2.txt', (aElem) => {
  let dd = aElem.split(' ');
  return { dir: dd[0], count: parseInt(dd[1]) };
}, '\r\n');

console.log(bb);

let tailPath = ComputePath(bb, 10);

console.log(util.ComputeMapSize(tailPath));
