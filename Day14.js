const util = require('./Util.js');
const mm = require('./Matrix.js');

function GetKey(aX, aY) {
  return aX + "#" + aY;
}

function GetPt(aKey) {
  let uu = aKey.split('#');
  return { x: parseInt(uu[0]), y: parseInt(uu[1]) };
}

function PrintMap(aMap, aOrigin) {
  let gg = new mm.Matrix(10, 10, '.');

  for (let key in aMap) {
    let pt = GetPt(key);

    gg.SetValue(pt.y - aOrigin.y, pt.x - aOrigin.x, aMap[key]);
  }

  gg.Print('');
}

function CreateRockMap(aRockLines) {
  let map = new Map();
  for (let i = 0; i < aRockLines.length; i++) {
    for (let j = 0; j < aRockLines[i].length - 1; j++) {
      let pt1 = aRockLines[i][j];
      let pt2 = aRockLines[i][j + 1];

      if (pt1.x == pt2.x)
        for (let k = Math.min(pt1.y, pt2.y); k <= Math.max(pt1.y, pt2.y); k++)
          map.set(GetKey(pt1.x, k), '#');
      else {
        for (let k = Math.min(pt1.x, pt2.x); k <= Math.max(pt1.x, pt2.x); k++)
          map.set(GetKey(k, pt1.y), '#');
      }
    }
  }

  return map;
}

function GetMapValue(aMap, aMaxDepth, aPt) {

  if ((aMaxDepth > 0) && (aPt.y == (aMaxDepth + 2)))
    return '#';

  let key = GetKey(aPt.x, aPt.y);

  if (!aMap.has(key))
    return '.';

  let vv = aMap.get(key);
  return vv;
}

function PourSand(aMap, aMaxDepth, aSandOrigin, aPart2) {

  for (; ;) {
    let pt = { x: aSandOrigin.x, y: aSandOrigin.y };

    for (; ;) {

      let left = GetMapValue(aMap, aPart2 ? aMaxDepth : 0, { x: pt.x - 1, y: pt.y });
      let mid = GetMapValue(aMap, aPart2 ? aMaxDepth : 0, pt);
      let right = GetMapValue(aMap, aPart2 ? aMaxDepth : 0, { x: pt.x + 1, y: pt.y });

      if (mid == '.')
        pt.y++;
      else if (mid == '#' || mid == 'o') {

        if (left != '.' && right != '.') {
          aMap.set(GetKey(pt.x, pt.y - 1), 'o');
          break;
        }
        else if (left == '.')
          pt.x--;
        else if (right == '.')
          pt.x++;
      }

      if (!aPart2 && (pt.y > aMaxDepth))
        break;
    }

    let count = 0;
    for(const value of aMap.values())
      if (value == 'o')
        count ++;

    if (aPart2) {
      if (aMap.get("500#0") == 'o')
        return count;
    }
    else {
      if (pt.y > aMaxDepth)
        return count;
    }
  }
}

let maxDepth = 0;

let rockLines = util.MapInput('./Day14Input.txt', (aElem) => {
  return aElem.split(' -> ').map((aa) => {
    let tt = aa.split(',');

    let depth = parseInt(tt[1]);

    if (depth > maxDepth)
      maxDepth = depth;

    return { x: parseInt(tt[0]), y: depth };
  });
}, '\r\n');

let rockMap = CreateRockMap(rockLines);

console.log(PourSand(rockMap, maxDepth, { x: 500, y: 0}, false));

console.log(PourSand(rockMap, maxDepth, { x: 500, y: 0}, true));
