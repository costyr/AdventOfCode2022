const util = require('./Util.js');

function EvaluateExp(aExp, aMod) {
  let tt = aExp.split(' ');

  let p1 = (tt[0] == "old") ? aOld : parseInt(tt[0]);
  let p2 = (tt[2] == "old") ? aOld : parseInt(tt[2]);
  if (tt[1] == '+') {
    return ((p1 % aMod) + (p2 % aMod)) % aMod;
  }
  else
    return ((p1 % aMod) * (p2 % aMod)) % aMod;
}

function Transform(aMonkeys, aRoundCount) {

  let bb = [];

  for (let k = 0; k < aRoundCount; k++) {
    for (let i = 0; i < aMonkeys.length; i++) {
      if (bb[i] == undefined)
        bb[i] = aMonkeys[i].items.length;
      else
        bb[i] += aMonkeys[i].items.length;
      for (let j = 0; j < aMonkeys[i].items.length; j++) {
        let old = aMonkeys[i].items[j];
        let yy = aMonkeys[i].op.replace(/old/g, "(" + aMonkeys[i].items[j] + ")");

        //console.log(yy);
        let newValue = eval(aMonkeys[i].op);

        //console.log(newValue);
        let index = 0;

        let oo = ") % " + aMonkeys[i].test;

        //let pp = yy.replace(/\)/g, oo);
        //console.log(pp);
        if (/*eval( "(" + pp + ") % " + aMonkeys[i].test)*/newValue % aMonkeys[i].test == 0)
          index = aMonkeys[i].ifTrue;
        else
          index = aMonkeys[i].ifFalse;

        
        aMonkeys[index].items.push(newValue % 9699690);
      }
      aMonkeys[i].items = [];
    }
    console.log("\nRound "+ (k + 1));
    //PrintItems(aMonkeys);
    console.log(bb);
  }

  bb.sort((a, b) => {return b - a;});

  console.log(bb);

  return bb[0] * bb[1];
}

function PrintItems(aMonkeys) {
  for (let i = 0; i < aMonkeys.length; i++) 
    console.log("Monkey " + i + ": " + aMonkeys[i].items);
}

let monkeys = util.MapInput('./Day11Input.txt', (aElem) => {
  let tokens = aElem.split('\r\n');

  let items = tokens[1].split(/Starting items: |, /).splice(1).map((aa) => {return parseInt(aa);});
  let op = tokens[2].split("Operation: new = ")[1];
  let test = tokens[3].split(" ")[5];

  console.log(test);
  let ifTrue = tokens[4].split(" ")[9];
  let ifFalse = tokens[5].split(" ")[9];

  return {items: items, op: op, test: parseInt(test), ifTrue: parseInt(ifTrue), ifFalse: parseInt(ifFalse)};

  }, '\r\n\r\n');

console.log(monkeys);

console.log(Transform(monkeys, 10000));

//PrintItems(monkeys);
