const util = require('./Util.js');
const mm = require('./Matrix.js');
const nth = require('./NthMatrix.js');
const { V4MAPPED } = require('dns');

const kNorth = [[-1, 0], [-1, 1], [-1, -1]];
const kSouth = [[1, 0], [1, 1], [1, -1]];
const kWest = [[0, -1], [-1, -1], [1, -1]];
const kEst = [[0, 1], [-1, 1], [1, 1]];

function GetKey(aRow, aCol) {
  return aRow + "_" + aCol;
}

function DecodeKey(aKey) {
  return aKey.split('_').map((aa) => { return parseInt(aa); });
}

function PrintMap(aMap) {
  mm.CreateMatrix(aMap).Print('');
}

function IsEmpty(aMap, aRow, aCol, aDir) {
  for (let i = 0; i < aDir.length; i++) {
    let ff = aDir[i];
    let row = aRow + ff[0];
    let col = aCol + ff[1];
    if (aMap[row][col] == '#')
      return false;
  }

  return true;
}

function HasBorderElves(aMap) {
  for (let i = 0; i < aMap[0].length; i++)
    if (aMap[0][i] == '#')
      return true;

  for (let i = 0; i < aMap[0].length; i++)
    if (aMap[aMap.length - 1][i] == '#')
      return true;

  for (let i = 0; i < aMap.length; i++)
    if (aMap[i][0] == '#')
      return true;

  for (let i = 0; i < aMap.length; i++)
    if (aMap[i][aMap[0].length - 1] == '#')
      return true;
  return false;
}

function FindPossible(aMap, aMoveMap, aRow, aCol, aTryOrder) {

  let emptyPos = [];

  for (let i = 0; i < aTryOrder.length; i++)
    if (IsEmpty(aMap, aRow, aCol, aTryOrder[i]))
      emptyPos.push(i);

  if (emptyPos.length == 4 || emptyPos.length == 0)
    return;

  let tt = aTryOrder[emptyPos[0]][0];
  aMoveMap.set(GetKey(aRow, aCol), tt);
  let movePos = GetKey(aRow + tt[0], aCol + tt[1]);

  if (!aMoveMap.has(movePos))
    aMoveMap.set(movePos, 1);
  else {
    let value = aMoveMap.get(movePos);
    aMoveMap.set(movePos, value + 1);
  }
}

function Transform(aMap, aMaxRound) {

  let tryOrder = [kNorth, kSouth, kWest, kEst];

  let lastRound = 0;

  for (let k = 0; k < aMaxRound; k++) {

    let moveMap = new Map();
    for (let i = 0; i < aMap.length; i++)
      for (let j = 0; j < aMap[i].length; j++) {
        if (aMap[i][j] == '#')
          FindPossible(aMap, moveMap, i, j, tryOrder);
      }

    if (moveMap.size == 0) {
      lastRound = k + 1;
      break;
    }

    for (let key of moveMap.keys()) {
      let pos = DecodeKey(key);

      let value = moveMap.get(key);

      if (Array.isArray(value)) {
        let row = pos[0];
        let col = pos[1];

        let moveRow = row + value[0];
        let moveCol = col + value[1];

        if (moveMap.get(GetKey(moveRow, moveCol)) == 1) {
          aMap[moveRow][moveCol] = '#';
          aMap[row][col] = '.';
        }
      }
    }

    let first = tryOrder.splice(0, 1);
    tryOrder.push(...first);

    if (HasBorderElves(aMap))
      nth.Extend2DMatrix(aMap, '.');
  }

  let minRow = Number.MAX_SAFE_INTEGER;
  let minCol = Number.MAX_SAFE_INTEGER;

  let maxRow = 0;
  let maxCol = 0;

  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++) {
      if (aMap[i][j] == '#') {
        minRow = Math.min(minRow, i);
        minCol = Math.min(minCol, j);

        maxRow = Math.max(maxRow, i);
        maxCol = Math.max(maxCol, j);
      }
    }

  let count = 0;
  for (let i = minRow; i <= maxRow; i++)
    for (let j = minCol; j <= maxCol; j++) {
      if (aMap[i][j] == '.')
        count++;
    }

    return [ count, lastRound];
  }

  let map = util.MapInput('./Day23Input.txt', (aElem) => {
    return aElem.split('');
  }, '\r\n');

  nth.Extend2DMatrix(map, '.');

  let inputMap = util.CopyObject(map);

  console.log(Transform(map, 10)[0]);

  console.log(Transform(inputMap, 10000)[1]);
