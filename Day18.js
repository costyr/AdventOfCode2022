const util = require('./Util.js');
const mm = require('./Matrix.js');

const kNeighbours = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];

function ComputeDist(aCube1, aCube2) {
  return Math.abs(aCube1[0] - aCube2[0]) + Math.abs(aCube1[1] - aCube2[1]) + Math.abs(aCube1[2] - aCube2[2]);
}

function Print(aCubes, aZ) {
  let map = new mm.Matrix(20, 20, '.');

  for (let i = 0; i < aCubes.length; i++)
    if (aCubes[i][2] == aZ) 
      map.SetValue(aCubes[i][1], aCubes[i][0], '#');
  
  map.Print('');
}

function CountNoConnected(aCubes) {
  let count = 0;
  for (let i = 0; i < aCubes.length; i++) {
      
      let uu = 0;
      for (let j = 0; j < aCubes.length; j++) {

        if (i == j)
          continue;

        let dist = ComputeDist(aCubes[i], aCubes[j]);
        if (dist == 1)
          uu++;

      }

      count += 6 - uu;
          
    }

    return count;
}

function IsInner(aCubes, aCube, aMinX, aMaxX, aMinY, aMaxY, aMinZ, aMaxZ) {
  
  let nn = [aCube];
  let visited = [];

  for (;;) {
   
    if (nn.length == 0)
      return { ret: true, inners: visited };

  let cc = nn.pop();

  for (let i = 0; i < kNeighbours.length; i++)
  {
    let x = cc[0] + kNeighbours[i][0];
    let y = cc[1] + kNeighbours[i][1];
    let z = cc[2] + kNeighbours[i][2];

    if (aCubes.find((aa) => { return aa[0] == x && aa[1] == y && aa[2] == z;}))
      continue;

    if (x < aMinX || x > aMaxX ||
        y < aMinY || y > aMaxY ||
        z < aMinZ || z > aMaxZ)
      return { ret: false, inners: [] };

    if (!visited.find((aa) => { return aa[0] == x && aa[1] == y && aa[2] == z;}) && 
        !nn.find((aa) => { return aa[0] == x && aa[1] == y && aa[2] == z;}))
      nn.push([x, y, z]);
  }
  visited.push(cc);
}

}

function CountAir(aCubes) {

  let minX = Number.MAX_SAFE_INTEGER;
  let maxX = 0;

  let minY = Number.MAX_SAFE_INTEGER;
  let maxY = 0;

  let minZ = Number.MAX_SAFE_INTEGER;
  let maxZ = 0;

  for (let i = 0; i < aCubes.length; i++) {
    minX = Math.min(minX, aCubes[i][0]);
    maxX = Math.max(maxX, aCubes[i][0]);

    minY = Math.min(minY, aCubes[i][1]);
    maxY = Math.max(maxY, aCubes[i][1]);

    minZ = Math.min(minZ, aCubes[i][2]);
    maxZ = Math.max(maxZ, aCubes[i][2]);
  }

  let cubes = util.CopyObject(aCubes);
  
  let newCubes = [];
  for (let i = minX; i <= maxX; i++)
    for (let j = minY; j <= maxY; j++)
      for (let k = minZ; k <= maxZ; k++)
      {
        //console.log(i + " " + j + " " + k);

        if (newCubes.find((aa) => { return aa[0] == i && aa[1] == j && aa[2] == k;})) {
          continue;
        }

        let inner = IsInner(aCubes, [i, j, k], minX, maxX, minY, maxY, minZ, maxZ);

        //if (inner != inner2)
        //  console.log([i, j, k]);

        if (cubes.find((aa) => { return aa[0] == i && aa[1] == j && aa[2] == k;}) || 
            !inner.ret)
          continue;

        
        for (let m = 0; m < inner.inners.length; m++) {
          let inr = inner.inners[m];
        if (!newCubes.find((aa) => { return aa[0] == inr[0] && aa[1] == inr[1] && aa[2] == inr[2];})) {
          newCubes.push(inr);
        }
      }
      }
  
  if (newCubes.length > 0)
  {
    for (let i = 0; i < newCubes.length; i++)
      cubes.push(newCubes[i]);
  }

  /*for (let z = 0; z < 20; z++) {
    console.log(z + ": ");
    Print(cubes, z);
  }*/

  return CountNoConnected(cubes);
}

let cubes = util.MapInput('./Day18Input.txt', (aElem) => {
  return aElem.split(',').map((aa)=>{return parseInt(aa);});
  }, '\r\n');

//console.log(cubes);

let total = CountNoConnected(cubes);

console.log(total);

console.log(CountAir(cubes));
