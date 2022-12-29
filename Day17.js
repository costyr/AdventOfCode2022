const util = require('./Util.js');
const mm = require('./Matrix.js');

const kShapes = [[[2, 0], [3, 0], [4, 0], [5, 0]],
[[3, 0], [2, 1], [3, 1], [4, 1], [3, 2]],
[[4, 0], [4, 1], [2, 0], [3, 0], [4, 2]],
[[2, 0], [2, 1], [2, 2], [2, 3]],
[[2, 0], [3, 0], [2, 1], [3, 1]]];

function PrintShape(aBoard, aShape, aTop) {
  let map = new mm.Matrix(7, aTop + 10, '.');

  if (aShape)
    for (let i = 0; i < aShape.length; i++)
      map.SetValue(aShape[i][1], aShape[i][0], '@');

  for (let i = 0; i < aBoard.length; i++)
    map.SetValue(aBoard[i][1], aBoard[i][0], 'x');

  map.PrintReverse('');
}

function FindFullLine(aBoard) {

  let count = new Map();
  for (let i = aBoard.length - 1; i >= 0; i--)
    if (!count.has(aBoard[i][1]))
      count.set(aBoard[i][1], 1);
    else {
      let nn = count.get(aBoard[i][1]);
      nn++;

      if (nn == 7)
        return aBoard[i][1];
      count.set(aBoard[i][1], nn);
    }
  return 0;
}

function GetTop(aBoard) {

  if (aBoard.length == 0)
    return 0;

  let max = 0;
  for (let i = 0; i < aBoard.length; i++)
    max = Math.max(max, aBoard[i][1]);

  return max + 1;
}

function PrepareStart(aShape, aBottom) {
  for (let i = 0; i < aShape.length; i++)
    aShape[i][1] += aBottom + 3;
}

function MoveLeftRight(aShape, aLeft) {
  for (let i = 0; i < aShape.length; i++)
    aLeft ? aShape[i][0]-- : aShape[i][0]++;
}

function MoveDown(aShape) {
  for (let i = 0; i < aShape.length; i++)
    aShape[i][1]--;
}

function CanMoveRight(aBoard, aShape, aMax) {
  for (let i = 0; i < aShape.length; i++) {
    let pt = aShape[i];
    if (aBoard.find((aa) => {
      return (aa[0] == pt[0] + 1) && (aa[1] == pt[1]);
    }) || aShape[i][0] + 1 > aMax)
      return false;
  }
  return true;
}

function CanMoveLeft(aBoard, aShape) {
  for (let i = 0; i < aShape.length; i++) {
    let pt = aShape[i];
    if (aBoard.find((aa) => {
      return (aa[0] == pt[0] - 1) && (aa[1] == pt[1]);
    }) || aShape[i][0] - 1 < 0)
      return false;
  }
  return true;
}

function CanMoveDown(aBoard, aShape, aMin) {
  for (let i = 0; i < aShape.length; i++) {
    let pt = aShape[i];
    if (aBoard.find((aa) => {
      return (aa[0] == pt[0]) && (aa[1] == pt[1] - 1);
    }) || aShape[i][1] - 1 < aMin)
      return false;
  }
  return true;
}

function Transform(aJets, aStart, aStartJet, aCount) {

  let board = [];
  let bottom = 0;
  let k = aStartJet;
  let prevFullLine = 0;
  let prevS = 0;
  let prevI = 0;
  let firstI = 0;
  let prevDiff = 0;
  let firstFullLine = -1;
  for (let i = 0; i < aCount; i++) {

    let shape = util.CopyObject(kShapes[(i + aStart) % kShapes.length]);

    let max = GetTop(board);

    PrepareStart(shape, max);

    //console.log("--------------------------");

    //PrintShape(board, shape, bottom + 3);

    while (true) {

      if (k >= aJets.length)
        k = 0;
      let dir = aJets[k++];

      let moveLR = (dir == '>') ? CanMoveRight(board, shape, 6) : CanMoveLeft(board, shape);

      if (moveLR)
        MoveLeftRight(shape, dir == '<');

      let moveDown = CanMoveDown(board, shape, 0);

      if (!moveDown) {
        for (let j = 0; j < shape.length; j++) {
          board.push(shape[j]);
          bottom = Math.max(bottom, shape[j][1]);
        }

        let fullLine = FindFullLine(board);
        if (fullLine > prevFullLine) {
          let nextS = (i + 1) % kShapes.length;

          max = GetTop(board);

          if ((max - 1) == fullLine) {
           // console.log(fullLine + " " + prevFullLine + " " + (fullLine - prevFullLine) + " " + nextS + " " + k + " " + i);

            if (prevDiff == (fullLine - prevFullLine) && (nextS == prevS)) {
              let rr = 1000000000000;

              let nn = firstI + 1;
              let freq = i - prevI;
              let yy = Math.floor((rr - nn) / freq);
              let hh = (rr - nn) % freq;

              return yy * prevDiff + firstFullLine + Transform(jets, 1, k, hh);
            }

            prevDiff = fullLine - prevFullLine;
            prevFullLine = fullLine;
            prevS = nextS;
            prevI = i;
            if (firstFullLine == -1)
              firstFullLine = fullLine + 1;
            if (firstI == 0)
              firstI = i;
          }
        }
        break;
      }


      MoveDown(shape);
    }

    //console.log("\n");

    //PrintShape(board, null, bottom + 3);

    bottom++;
  }

  let max = GetTop(board);

  //PrintShape(board, null, max);

  return max;
}

let jets = util.MapInput('./Day17Input.txt', (aElem) => {
  return aElem;
}, '');

console.log(jets);

console.log(Transform(jets, 0, 0, 2022));

console.log(Transform(jets, 0, 0, 1000000000000));
