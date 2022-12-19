const util = require('./Util.js');

function Simulate(aBluePrints) {

  for (let k = 0; k < aBluePrints.length; k++) {

    let count = [0, 0, 0, 0];
    let robots = [1, 0, 0, 0]; 
    for (let i = 0; i < 24; i++)
    {
      for (let j = 0; j < robots.length; j++)
        count[j] += robots[j];

      if (aBluePrints[k][3][0] <= count[0] && aBluePrints[k][3][1] <= count[2]) {
        count[0] -= aBluePrints[k][3][0];
        count[2] -= aBluePrints[k][3][1];
        robots[3] += 1;
      }
      else if (aBluePrints[k][2][0] <= count[0] && aBluePrints[k][2][1] <= count[1]) {
        count[0] -= aBluePrints[k][2][0];
        count[1] -= aBluePrints[k][2][1];
        robots[2] += 1;
      }
      else if (aBluePrints[k][1][0] <= count[0]) {
        count[0] -= aBluePrints[k][1][0];
        robots[1] += 1;
      }
      else if (aBluePrints[k][0][0] <= count[0])
      {
        count[0] -= aBluePrints[k][0][0];
        robots[0] += 1;  
      }

      console.log(k + " => " + i + ": " + count + " " + robots);
    }
  }
}

let bluePrints = util.MapInput('./Day19TestInput.txt', (aElem) => {
  return aElem.split(/\: |\. /).slice(1).map((bb)=> {

    let tt = bb.split(' ');

    if (tt.length == 6)
      return [ parseInt(tt[4])];
    else 
      return [ parseInt(tt[4]), parseInt(tt[7])];

})}, '\r\n');

console.log(bluePrints);

Simulate(bluePrints);
