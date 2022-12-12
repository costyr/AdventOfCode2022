const util = require('./Util.js');

function Transform(aMonkeys, aRoundCount, aPart2, aFactor) {

  let bb = [];

  for (let k = 0; k < aRoundCount; k++) {
    for (let i = 0; i < aMonkeys.length; i++) {
      if (bb[i] == undefined)
        bb[i] = aMonkeys[i].items.length;
      else
        bb[i] += aMonkeys[i].items.length;
      for (let j = 0; j < aMonkeys[i].items.length; j++) {
        let old = aMonkeys[i].items[j];
        let newValue = eval(aMonkeys[i].op);

        if (!aPart2)
          newValue = Math.floor(newValue / 3);

        let index = 0;

        if (newValue % aMonkeys[i].test == 0)
          index = aMonkeys[i].ifTrue;
        else
          index = aMonkeys[i].ifFalse;

        
        aMonkeys[index].items.push(aPart2 ? newValue % aFactor : newValue);
      }
      aMonkeys[i].items = [];
    }
  }

  bb.sort((a, b) => {return b - a;});
  return bb[0] * bb[1];
}

let factor = 1;

let monkeys = util.MapInput('./Day11Input.txt', (aElem) => {
  let tokens = aElem.split('\r\n');

  let items = tokens[1].split(/Starting items: |, /).splice(1).map((aa) => {return parseInt(aa);});
  let op = tokens[2].split("Operation: new = ")[1];
  let test = parseInt(tokens[3].split(" ")[5]);

  factor *= test;

  let ifTrue = tokens[4].split(" ")[9];
  let ifFalse = tokens[5].split(" ")[9];

  return {items: items, op: op, test: test, ifTrue: parseInt(ifTrue), ifFalse: parseInt(ifFalse)};

  }, '\r\n\r\n');

let initialMonkeys = util.CopyObject(monkeys);

console.log(Transform(monkeys, 20));

console.log(Transform(initialMonkeys, 10000, true, factor));
