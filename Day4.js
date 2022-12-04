const util = require('./Util.js');

function Intersect(aItems) {
  let total = 0;
 return aItems.reduce((aTotal, aElem)=>{ 
    if ((aElem[0] >= aElem[2]) && (aElem[1] <= aElem[3]) || 
        (aElem[2] >= aElem[0]) && (aElem[3] <= aElem[1]))
        return aTotal + 1;
    return aTotal;
  }, total);
}

function Intersect2(aItems) {
  let total = 0;
 return aItems.reduce((aTotal, aElem)=>{ 
    for (let i = aElem[0]; i <= aElem[1]; i++)
      for (let j = aElem[2]; j <= aElem[3]; j++)
        if (i == j) {
          return aTotal + 1;
        }
    return aTotal;
  }, total);
}

let groups = util.MapInput('./Day4Input.txt', (aElem) => {
  return aElem.split(/,|-/).map((yy)=>{return parseInt(yy);});
  }, '\r\n');

console.log(Intersect(groups));
console.log(Intersect2(groups));