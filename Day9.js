const util = require('./Util.js');

function ComputeKey(aPos) {
  return aPos.x + "#" + aPos.y;
}

function ComputePath(aMoves, aPath, aPos) {
  for (let i = 0; i < aMoves.length; i++)
  {
    if (aMoves[i].dir == 'R')
    {
      aPos +=      
    }
  }
}

let bb = util.MapInput('./Day9TestInput.txt', (aElem) => {
  let dd = aElem.split(' ');
  return { dir: dd[0], count: parseInt(dd[1])};
  }, '\r\n');

console.log(bb);
