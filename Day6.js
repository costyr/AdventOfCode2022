const util = require('./Util.js');

function FindStartPacketMarker(aSignal, aSize) {
  for (let i = 0; i < aSignal.length; i++) {

    let yy = [];
    let found = true;
    for (let j = i; j < Math.min(i + aSize, aSignal.length); j++)
    {
      if (yy[aSignal[j]] != undefined) {
        yy[aSignal[j]] ++;
        found = false;
      }
      else
        yy[aSignal[j]] = 0;
    }

    if (found)
      return i + aSize;
  }
  return -1;    
}

let signal = util.MapInput('./Day6Input.txt', (aElem) => {
  return aElem;
  }, '');

console.log(FindStartPacketMarker(signal, 4));
console.log(FindStartPacketMarker(signal, 14));
