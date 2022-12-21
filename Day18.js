const { count } = require('console');
const util = require('./Util.js');

function ComputeDist(aCube1, aCube2) {
  return Math.abs(aCube1[0] - aCube2[0]) + Math.abs(aCube1[1] - aCube2[1]) + Math.abs(aCube1[2] - aCube2[2]);
}

function CountConnected(aCubes, aCube) {
  let uu = 0;
      for (let j = 0; j < aCubes.length; j++) {

        let dist = ComputeDist(aCube, aCubes[j]);
        if (dist == 1)
          uu++;

      }

  return uu;
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

      if (uu == 0)
        console.log(aCubes[i]);

      count += 6 - uu;
          
    }

    return count;
}

function RemoveAir(aCubes) {

  let cubes = util.CopyObject(aCubes);

  for(;;) {

  for (let i = 0; i < cubes.length; i++) {
      
    let uu = 0;
    for (let j = 0; j < cubes.length; j++) {

      if (i == j)
        continue;

      let dist = ComputeDist(cubes[i], cubes[j]);
      if (dist == 1)
        uu++;

    }

    if (uu < 6) {
      cubes.splice(i, 1);
      break;
    }
  }

  let airCount = CountAir(cubes);

  if (airCount == 0)
    return CountNoConnected(cubes);
  else
    console.log(airCount);
        
  }

  return 0;
}

function IsInner(aCubes, aCube) {

  let yy = [0, 0, 0];
  let hh = [0, 0, 0];
  for (let i = 0; i < aCubes.length; i++)
  {
    if (aCube[1] == aCubes[i][1] && aCube[2] == aCubes[i][2])
    if (aCube[0] >= aCubes[i][0])
      yy[0] = 1;
    else 
      hh[0] = 1;

      if (aCube[0] == aCubes[i][0] && aCube[2] == aCubes[i][2])
    if (aCube[1] >= aCubes[i][1])
      yy[1] = 1;
    else
      hh[1] = 1;

    if (aCube[1] == aCubes[i][1] && aCube[0] == aCubes[i][0])
    if (aCube[2] >= aCubes[i][2])
      yy[2] = 1;
    else 
      hh[2] = 1;
  }  

  if (yy[0] == 1 && yy[1] == 1 && yy[2] == 1 && 
      hh[0] == 1 && hh[1] == 1 && hh[2] == 1)
      return true;
  return false;
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
  
  let count = 0;
  for (;;) {
  let newCubes = [];
  for (let i = minX; i <= maxX; i++)
    for (let j = minY; j <= maxY; j++)
      for (let k = minZ; k <= maxZ; k++)
      {
        if (!IsInner(aCubes, [i, j, k]))
          continue;

        //let oo = CountConnected(cubes, [i, j, k]);
        if (/*oo > 0 && */!cubes.find((aa) => { return aa[0] == i && aa[1] == j && aa[2] == k;})) {
          //console.log(i + " " + j + " " + k);
          //count += oo;
          newCubes.push([i, j, k]);
        }
      }
      
  if (newCubes.length > 0)
  {
    console.log(newCubes.length + " " + count);
    for (let i = 0; i < newCubes.length; i++)
      cubes.push(newCubes[i]);
  }
  else
    break;
    
  }

  return CountNoConnected(cubes);
}

let cubes = util.MapInput('./Day18Input.txt', (aElem) => {
  return aElem.split(',').map((aa)=>{return parseInt(aa);});
  }, '\r\n');

console.log(cubes);

//let total = CountNoConnected(cubes);

//console.log(total);

console.log(CountAir(cubes));