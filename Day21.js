const exp = require('constants');
const util = require('./Util.js');

function ComputeExp(aExpMap) {
  let gg = aExpMap.get("root");

  for (;;) {
    let found = false;
  for (let key of aExpMap.keys()) {

    let op = aExpMap.get(key);

    let j = gg.indexOf(key);

    if (j >= 0) 
    {
      if (op.length > 1)
        gg.splice(j, 1, '(', ...op, ')');
      else
        gg.splice(j, 1, op);
    }

    if (j > 0) {
      found = true;
    }

    console.log(JSON.stringify(gg));
  }

  if (!found)
    break;
}

console.log(JSON.stringify(gg));

let ii = gg.indexOf('=');

let left = gg.slice(ii + 1);
let right = gg.splice(0, ii);

console.log(JSON.stringify(left));
console.log(JSON.stringify(right));

let toSolve = left;
let toMove = right;
if (right.indexOf('X') >= 0) {
  toSolve = right;
  toMove = left;
}

let stack = [];

toSolve.splice(0, 1);
toSolve.splice(toSolve.length - 1, 1);

for (let i = 0; i < toSolve.length; i++)
{
  let token = toSolve[i];
  if (token == '(')
    stack.push('(');
  else if (token == ')')
  {
    
  }
}

/*let hh = gg.split("=");

let h1 = hh[0].indexOf('X') > 0 ? hh[0] : eval(hh[0]);
let h2 = hh[1].indexOf('X') > 0 ? hh[1] : eval(hh[1]);

console.log(h1 + " = " + h2);

/*for (let X = 0; X < Number.MAX_SAFE_INTEGER; X++)
  {
    if (eval(hh[0]) == eval(hh[1]))
      return X;
  }
  */


return 0;
}

let expMap = new Map();

util.MapInput('./Day21TestInput.txt', (aElem) => {
  let tokens = aElem.split(': ');

  let hh = tokens[1].split(' ');

  expMap.set(tokens[0], (hh.length > 1) ? [ hh[0], hh[1], hh[2]] : tokens[1] == 'X' ? 'X' : parseInt(tokens[1]));
  }, '\r\n');

console.log(expMap);

console.log(ComputeExp(expMap));
