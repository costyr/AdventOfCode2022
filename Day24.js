const util = require('./Util.js');
const mm = require('./Matrix.js');

const kNeighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function PrintMap(aMap) {
  mm.CreateMatrix(aMap).Print('');
}

function PrintWinds(aMap, aWinds) {
  let bb = new mm.Matrix(aMap[0].length, aMap.length, '.');

  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++)
      if (aMap[i][j] == '#')
        bb.SetValue(i, j, '#');

  for (let i = 0; i < aWinds.length; i++)
  {
    let wind = aWinds[i];
    let val = bb.GetValue(wind.row, wind.col);

    if (val == '.')
      val = wind.w;
    else if (val == '<' || val == '>' || val == '^' || val == 'v')
      val = '2';
    else
      val = (parseInt(val) + 1).toString();

    bb.SetValue(wind.row, wind.col, val);
  }

  bb.Print('');
}

function ExtractWinds(aMap) {
  let winds = [];
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++) {
      let value = aMap[i][j];
      if (value == '<' || value == '>' || value == '^' || value == 'v')
        winds.push({ w: value, row: i, col: j});
    }
  return winds;
}

function MoveWinds(aMap, aWinds) {
  for (let i = 0; i < aWinds.length; i++)
  {
    let wind = aWinds[i];

    if (wind.w == '<')
    {
      wind.col -= 1;

      if (wind.col < 1)
        wind.col = aMap[0].length - 2;
    }
    else if (wind.w == '>')
    {
      wind.col += 1;
      if (wind.col > aMap[0].length - 2)
        wind.col = 1;
    }
    else if (wind.w == '^')
    {
      wind.row -= 1;

      if (wind.row < 1)
        wind.row = aMap.length - 2;
    }
    else if (wind.w == 'v')
    {
      wind.row += 1;

      if (wind.row > aMap.length - 2)
        wind.row = 1;
    }
  }
}

function IsWindPos(aRow, aCol, aWinds) {
  for (let i = 0; i < aWinds.length; i++)
    if (aWinds[i].row == aRow && aWinds[i].col == aCol)
      return true;
  return false;
}

function IsValidPos(aMap, aRow, aCol) {
  if (aRow >= 0 && aRow < aMap.length && aCol >= 0 && aCol <= aMap[0].length && aMap[aRow][aCol] != '#')
    return true;
  return false;
}

function FindShortestPath(aMap, aWinds, aStart, aEnd) {
  let elfPos = [[...aStart]];

for (let i = 0; i < 100000; i++)
{
  MoveWinds(aMap, aWinds);

  let newElfPos = [];
  let found = false;
  for (let j = 0; j < elfPos.length; j++)
  {
    if (!IsWindPos(elfPos[j][0], elfPos[j][1], winds))
      newElfPos.push(elfPos[j]);
    for (let k = 0; k < kNeighbours.length; k++)
    {
      let row = elfPos[j][0] + kNeighbours[k][0];
      let col = elfPos[j][1] + kNeighbours[k][1];

      if (row == aStart[0] && col == aStart[1])
        continue;

      if (row == aEnd[0] && col == aEnd[1]) {
        found = true;
        break;
      }

      if (IsValidPos(aMap, row, col) && !IsWindPos(row, col, aWinds) && !newElfPos.find((aa)=>{ return aa[0] == row && aa[1] == col;}))
        newElfPos.push([row, col]);
    }
    
    if (found)
      break;
  }

  if (found)
  {
    //console.log(i + 1);
    return i + 1;
  }
  
  if (newElfPos.length > 0) {
    elfPos = newElfPos;

    elfPos.sort((a, b)=>{ let dist1 = Math.abs(a[0] - aEnd[0]) + Math.abs(a[1] - aEnd[1]);
                          let dist2 = Math.abs(b[0] - aEnd[0]) + Math.abs(b[1] - aEnd[1]);
                        return dist1 < dist2; });
  }

  //console.log("\nMinute: " + (i + 1));
  //console.log(elfPos);

  //PrintWinds(aMap, aWinds);
}
}

let map = util.MapInput('./Day24Input.txt', (aElem) => {
  return aElem.split('');
  }, '\r\n');

//PrintMap(map);

let winds = ExtractWinds(map);

let start = [0, 1];
let end = [map.length - 1, map[0].length - 2];

let d1 = FindShortestPath(map, winds, start, end);
let d2 = FindShortestPath(map, winds, end, start);
let d3 = FindShortestPath(map, winds, start, end);

console.log(d1);
console.log(d1 + d2 + d3);
