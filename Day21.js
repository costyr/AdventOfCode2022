const exp = require('constants');
const util = require('./Util.js');

function ComputeExp(aExpMap) {
  let gg = aExpMap.get("root");

  for (;;) {
    let found = false;
  for (let key of aExpMap.keys()) {
    let nn = gg.replaceAll(key, "(" + aExpMap.get(key) + ")");

    if (nn != gg) {
      gg = nn;
      found = true;
    }
  }

  if (!found)
    break;
}

console.log(gg);

let hh = gg.split("=");

for (let X = 0; X < Number.MAX_SAFE_INTEGER; X++)
  {
    if (eval(hh[0]) == eval(hh[1]))
      return X;
  }


return 0;
}

let expMap = new Map();

util.MapInput('./Day21TestInput.txt', (aElem) => {
  let tokens = aElem.split(': ');

  expMap.set(tokens[0], tokens[1]);
  }, '\r\n');

console.log(expMap);

console.log(ComputeExp(expMap));
