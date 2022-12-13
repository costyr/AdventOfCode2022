const util = require('./Util.js');

function Compare(aElem1, aElem2) {

  if (Array.isArray(aElem1) && Array.isArray(aElem2))
  {
    if (aElem1.length == 0 && aElem2.length == 0)
      return 0;

    if (aElem1.length == 0)
      return 1;

    if (aElem2.length == 0)
      return -1;
    
    for (let i = 0; i < Math.max(aElem1.length, aElem2.length); i++) {
      let ret = Compare(aElem1[i], aElem2[i]);

      if (ret == -1 || ret == 1)
        return ret;
    }

    return 0;
  }
  if (Array.isArray(aElem1))
  {
    if (aElem1.length == 0 && aElem2 == undefined)
      return 0;

    if (aElem1.length == 0)
      return 1;

    if (aElem2 == undefined)
      return -1;

    let elem2 = [aElem2];

    return Compare(aElem1, elem2);
  } else if (Array.isArray(aElem2))
  {
    if (aElem1 == undefined && aElem2.length == 0)
      return 0;

    if (aElem1 == undefined)
      return 1;

    if (aElem2.length == 0)
      return -1;

    let elem1 = [aElem1];

    return Compare(elem1, aElem2);
  } 
  else {
    if (aElem1 == undefined)
      return 1;

    if (aElem2 == undefined)
      return -1;

    if (aElem1 < aElem2)
      return 1;
    else if (aElem1 > aElem2)
      return -1;
    else
      return 0;
  }
}

function CompareAll(aPackets) {

  let count = 0;
  for (let i = 0; i < aPackets.length; i++)
    if (Compare(aPackets[i][0], aPackets[i][1]) == 1)
      count += (i + 1);

  return count;
}

function FindDecoderKey(aPackets) {
  let all = [[[2]], [[6]]];
  for (let i = 0; i < aPackets.length; i++)
  {
    all.push(aPackets[i][0]);
    all.push(aPackets[i][1]);
  }

  all.sort((a,b)=>{ 
    let ret = Compare(a, b);
    
    if (ret == -1)
      return 1;
    else if (ret == 1)
      return -1;
    else
      return 0;
  });

  let key = 1;
  for (let i = 0; i < all.length; i++)
    if (JSON.stringify(all[i]) == "[[2]]") 
      key *= i + 1;
    else if (JSON.stringify(all[i]) == "[[6]]")
      key *= i + 1;      

  return key;
}

let packets = util.MapInput('./Day13Input.txt', (aElem) => {
  return aElem.split("\r\n").map((yy)=>{ return JSON.parse(yy);});
  }, '\r\n\r\n');

console.log(CompareAll(packets));

console.log(FindDecoderKey(packets));
