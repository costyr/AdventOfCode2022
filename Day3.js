const util = require('./Util.js');

let total = 0;

function ComputeScore(aItem) {
  if (aItem >='a' && aItem <= 'z')
    return aItem.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
  else 
    return aItem.charCodeAt(0) - 'A'.charCodeAt(0) + 27;
}

function ComputeGroupScore(aBags) {
  let total = 0;
  for (let i = 0; i < aBags.length; i++)
  {
    if (((i > 0) && ((i+1) % 3 == 0))) {
      for (let j = 0; j < aBags[i].length; j++) {
        let found = true;
        for (let k = i; k >= (i - 2); k--) 
          if (!aBags[k].includes(aBags[i][j])) {
            found = false;
            break;
          }
        if (found) {
          total += ComputeScore(aBags[i][j]);
          break;
        }
      }
    }
  }

  return total;
}

let bags = util.MapInput('./Day3Input.txt', (aElem) => {

  for (let i = 0; i < aElem.length/2; i++) {
    let found = false;
    for (let j = aElem.length/2; j < aElem.length; j++)
      if (aElem[i] == aElem[j]) {
        total += ComputeScore(aElem[i]);
        found = true;
        break;
      }
      if (found)
        break;
    }
  return aElem;
  }, '\r\n');

console.log(total);

console.log(ComputeGroupScore(bags));
