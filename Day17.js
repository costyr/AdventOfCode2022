const util = require('./Util.js');
const mm = require('./Matrix.js');

const kShapes2 = [ [[2, 0], [3, 0], [4, 0], [5, 0]],
                   [[3, 0], [2, 1], [3, 1], [4, 1], [3, 2]],
                   [[4, 0], [4, 1], [2, 2], [3, 2], [4, 2]],
                   [[2, 0], [2, 1], [2, 2], [2, 3]] ]; 

function PrintShape(aShape, aX, aY) {
  let map = new mm.Matrix(7, 7, '.');
  
  for (let i = 0; i < aShape.length; i++)
    map.SetValue(aY + aShape[i][1], aX + aShape[i][0], '@');

  map.PrintReverse('');
}

function MoveLeftRight(aShape, aLeft) {
  for (let i = 0; i < aShape.length; i++)
    aLeft ? aShape[i][0]-- : aShape[i][0]++;
}

function MoveDown(aShape) {
  for (let i = 0; i < aShape.length; i++)
    aShape[i][1]--;
}

function CanMoveRight(aShape, aMax) {
  for (let i = 0; i < aShape.length; i++)
    if (aShape[i][0] + 1 > aMax)
      return false;
  return true;
}

function CanMoveLeft(aShape) {
  for (let i = 0; i < aShape.length; i++)
    if (aShape[i][0] - 1 < 0)
      return false;
  return true;
}

function CanMoveDown(aShape, aMin) {
  for (let i = 0; i < aShape.length; i++)
    if (aShape[i][1] - 1 < aMin)
      return false;
  return true;
}


function Transform(aRockShape, aJets) {

  let shape = util.CopyObject(aRockShape);

  for (let k = 0; k < aJets.length; k++) {

    let dir = aJets[k];

    let moveLR = (dir == '>') ? CanMoveRight(shape, 6) : CanMoveLeft(shape);

    let moveDown = CanMoveDown(shape, -3);

    if (!moveDown)
      return;
       
    if (moveLR)
      MoveLeftRight(shape, dir == '<');

    if (moveDown)
      MoveDown(shape);

    console.log("--------------------------");

    PrintShape(shape, 0, 7);

    if (!moveDown)
      break;
  }      
}

let jets = util.MapInput('./Day17TestInput.txt', (aElem) => {
  return aElem;
  }, '');

console.log(jets);

Transform(kShapes2[0], jets);
