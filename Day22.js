const util = require('./Util.js');
const mm = require('./Matrix.js');

const kDir = [[0, 1], [1, 0], [0, -1], [-1, 0]];
const kRight = 0;
const kDown = 1;
const kLeft = 2;
const kUp = 3;

const kSides = [ [1 , 9], [ 5, 1 ], [5, 5], [ 5, 9], [ 9, 9], [ 9, 13] ];
const kSides2 = [ [1 , 51], [ 1, 101 ], [51, 51], [ 101, 1], [ 101, 51], [ 151, 1] ];

function PrintMap(aMap) {
  mm.CreateMatrix(aMap).Print('');
}

function SkipSpace(aMap, aRow, aColumn, aDir) {

  while (1) {

    if (aMap[aRow][aColumn] == '.' || aMap[aRow][aColumn] == '#') {
      break;
    }

    aRow += aDir[0];
    aColumn += aDir[1];
  }

  return [aRow, aColumn];
}

function WrapAround(aMap, aRow, aColumn, aDir) {

  let newRow = aRow;
  let newColumn = aColumn;

  if (aDir == kRight)
    newColumn = 0;
  else if (aDir == kLeft)
    newColumn = aMap[0].length - 1;
  else if (aDir == kDown)
    newRow = 0;
  else
    newRow = aMap.length - 1;

  if (aMap[newRow][newColumn] == '#')
    return [false, 0, 0];

  [newRow, newColumn] = SkipSpace(aMap, newRow, newColumn, kDir[aDir]);

  if (aMap[newRow][newColumn] == '#')
    return [false, 0, 0, 0];

  return [true, newRow, newColumn, aDir];
}

function CreateSideMap(aSides, aMap, aSideSize) {
  let sideMap = [];
  let total = 0;
  let count = 0;
  for (let i = 0; i < aMap.length; i++)
  {
    if (sideMap[i] == undefined)
      sideMap[i] = [];
    
    for (let j = 0; j < aMap[i].length; j++) {
      if (aMap[i][j] == '.' || aMap[i][j] == '#') {
        sideMap[i][j] = GetSide(i, j, aSides, aSideSize);

        total += 1;

        if (total % (aSideSize * aSideSize) == 0)
          count++;
      }
      else
       sideMap[i][j] = ' ';
    }
  }

  return sideMap;
}

function MapToSide(aRow, aColumn, aSide, kSides) {
  let row = aRow - kSides[aSide - 1][0];
  let column = aColumn - kSides[aSide - 1][1];

  return [row, column];
}

function SideToMap(aRow, aColumn, aSide, kSides) {
  let row = aRow + kSides[aSide - 1][0];
  let column = aColumn + kSides[aSide - 1][1];

  return [row, column];
}

function GetSide(aRow, aColumn, aSides, aSideSize) {
  for (let i = 0; i < aSides.length; i++)
    if (aRow >= aSides[i][0] && aRow < (aSides[i][0] + aSideSize) &&
        aColumn >= aSides[i][1] && aColumn < (aSides[i][1] + aSideSize))
          return i + 1;
  return 0;
}

function ConnectSide(aMap, aRow, aColumn, aSide, aDir) {
  let ret = SideToMap(aRow, aColumn, aSide, kSides2);

  if (aMap[ret[0]][ret[1]] == '#')
    return [false, 0, 0, 0];
      
  return [true, ret[0], ret[1], aDir];
}

function WrapAround3DTest(aMap, aRow, aColumn, aDir) {

  let row = aRow - kDir[aDir][0];
  let column = aColumn - kDir[aDir][1];

  let side = GetSide(row, column, kSides, kSideSize);
  let ret = MapToSide(row, column, side, kSides);

  let last = kSideSize - 1;

  if (side == 1) {
    if (aDir == kUp)
      return ConnectSide(aMap, ret[0], ret[1], 2, kDown);
    else if (aDir == kLeft)
      return ConnectSide(aMap, 0, ret[0], 3, kDown);
    else if (aDir == kRight)
      return ConnectSide(aMap, ret[0], last, 6, kLeft);
  }
  else if (side == 4) {
    if (aDir == kRight)
      return ConnectSide(aMap, 0, last - ret[0], 6, kDown);
  }
  else if (side == 2) {
    if (aDir == kLeft)
      return ConnectSide(aMap, ret[1], last - ret[0], 6, kUp);
    else if (aDir == kUp)
      return ConnectSide(aMap, ret[0], ret[1], 1, kDown);
    else if (aDir == kDown)
      return ConnectSide(aMap, last, last - ret[1], 5, kDown);
  } 
  else if (side == 5)
  {
    if (aDir == kDown)
      return ConnectSide(aMap, last, last - ret[1], 2, kUp);
    else if (aDir == kLeft)
      return ConnectSide(aMap, last, last - ret[0], 3, kUp);
  }
  else if (side == 3)
  {
    if (aDir == kUp)
      return ConnectSide(aMap, ret[1], 0, 1, kLeft);
    else if (aDir == kDown)
      return ConnectSide(aMap, ret[1], 0, 5, kRight);
  }
  else if (side == 6)
  {
    if (aDir == kUp)
      return ConnectSide(aMap, last - ret[1], 0, 4, kLeft);
    else if (aDir == kDown)
      return ConnectSide(aMap, last - ret[1], 0, 2, kRight);
    else if (aDir == kRight)
      return ConnectSide(aMap, ret[0], 3, 1, kLeft);
  }
}

function WrapAround3D(aMap, aRow, aColumn, aDir) {

  let row = aRow - kDir[aDir][0];
  let column = aColumn - kDir[aDir][1];

  let side = GetSide(row, column, kSides2, kSideSize);
  let ret = MapToSide(row, column, side, kSides2);

  let last = kSideSize - 1;

  //console.log("WrapAround3D: " + side + " " + aDir);

  if (side == 1) {
    if (aDir == kUp)
      return ConnectSide(aMap, ret[1], ret[0], 6, kRight);
    else if (aDir == kLeft)
      return ConnectSide(aMap, last - ret[0], ret[1], 4, kRight);
  }
  else if (side == 4) {
    if (aDir == kUp)
      return ConnectSide(aMap, ret[1], ret[0], 3, kRight);
    else if (aDir == kLeft)
      return ConnectSide(aMap, last - ret[0], ret[1], 1, kRight);
  }
  else if (side == 2) {
    if (aDir == kUp)
      return ConnectSide(aMap, last, ret[1], 6, kUp);
    else if (aDir == kRight)
      return ConnectSide(aMap, last - ret[0], ret[1], 5, kLeft);
    else if (aDir == kDown)
      return ConnectSide(aMap, ret[1], ret[0], 3, kLeft);
  } 
  else if (side == 5)
  {
    if (aDir == kDown)
      return ConnectSide(aMap, ret[1], ret[0], 6, kLeft);
    else if (aDir == kRight)
      return ConnectSide(aMap, last - ret[0], ret[1], 2, kLeft);
  }
  else if (side == 3)
  {
    if (aDir == kLeft)
      return ConnectSide(aMap, ret[1], ret[0], 4, kDown);
    else if (aDir == kRight)
      return ConnectSide(aMap, ret[1], ret[0], 2, kUp);
  }
  else if (side == 6)
  {
    if (aDir == kLeft)
      return ConnectSide(aMap, 0, ret[0], 1, kDown);
    else if (aDir == kRight)
      return ConnectSide(aMap, ret[1], ret[0], 5, kUp);
    else if (aDir == kDown)
      return ConnectSide(aMap, 0, ret[1], 2, kDown);
  }
}

function MoveOnPath(aMap, aPath, aWrapAroundFunc) {
  let dir = kRight;

  let row = 1
  let column = 0;

  for (column; column < aMap[0].length; column++)
    if (aMap[1][column] == '.')
      break;

  for (let i = 0; i < aPath.length; i++) {
    if (aPath[i] == 'R') {
      if (dir == kRight)
        dir = kDown;
      else if (dir == kLeft)
        dir = kUp;
      else if (dir == kDown)
        dir = kLeft;
      else
        dir = kRight;
    }
    else if (aPath[i] == 'L') {
      if (dir == kRight)
        dir = kUp;
      else if (dir == kLeft)
        dir = kDown;
      else if (dir == kDown)
        dir = kRight;
      else
        dir = kLeft;
    }
    else {
      for (let j = 0; j < aPath[i]; j++) {
        let newRow = row + kDir[dir][0];
        let newColumn = column + kDir[dir][1];
        if (aMap[newRow][newColumn] == '#')
          break;
        else if (aMap[newRow][newColumn] == ' ') {
          let ret = aWrapAroundFunc(aMap, newRow, newColumn, dir);

          if (!ret[0])
            break;
          
          row = ret[1];
          column = ret[2];
          dir = ret[3];
        }
        else {
          row = newRow;
          column = newColumn;
        }
      }
    }
  }

  //console.log(row + " " + column);

  return 1000 * (row) + 4 * (column) + dir;
}

let map = [];
let path = [];

util.MapInput('./Day22Input.txt', (aElem, aIndex) => {
  if (aIndex == 0) {
    map = aElem.split('\r\n').map((aa) => { return aa.split(''); });
  }
  else {
    path = aElem.split(/(R|L)/).map((aa) => {
      if (aa != 'R' && aa != 'L')
        return parseInt(aa);
      else
        return aa;
    });
  }
}, '\r\n\r\n');

let kSideSize = 50;

//PrintMap(map);

//console.log(path);

console.log(MoveOnPath(map, path, WrapAround));

let sideMap = CreateSideMap(kSides2, map, kSideSize);

//PrintMap(sideMap);

console.log(MoveOnPath(map, path, WrapAround3D));
