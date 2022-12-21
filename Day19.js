const util = require('./Util.js');

function Simulate(aBluePrints) {

  for (let k = 0; k < aBluePrints.length; k++) {

    let ss = [ { c: [0, 0, 0, 0], r: [1, 0, 0, 0] }]; 
    for (let i = 0; i < 24; i++)
    {
      let nn = null;
      for (let m = 0; m < ss.length; m++) {

      let oo = ss[m];
      for (let j = 0; j < oo.r.length; j++)
        oo.c[j] += oo.r[j];

      if (aBluePrints[k][3][0] <= oo.c[0] && aBluePrints[k][3][1] <= oo.c[2]) {

        nn = util.CopyObject(oo);

        nn.c[0] -= aBluePrints[k][3][0];
        nn.c[2] -= aBluePrints[k][3][1];
        nn.r[3] += 1;

        
      }
      else if (aBluePrints[k][2][0] <= oo.c[0] && aBluePrints[k][2][1] <= oo.c[1]) {

        nn = util.CopyObject(oo);

        nn.c[0] -= aBluePrints[k][2][0];
        nn.c[1] -= aBluePrints[k][2][1];
        nn.r[2] += 1;

        
      }
      else if (aBluePrints[k][1][0] <= oo.c[0]) {
        
        nn = util.CopyObject(oo);

        nn.c[0] -= aBluePrints[k][1][0];
        nn.r[1] += 1;
      }
      else if (aBluePrints[k][0][0] <= oo.c[0])
      {
        nn = util.CopyObject(oo);

        nn.c[0] -= aBluePrints[k][0][0];
        nn.r[0] += 1;
        
      
      }

    }

    let max = 0;
    let index = 0;
    for (let m = 0; m < ss.length; m++)
    {
      if (ss[m].c[3] > max)
      {
        max = ss[m].c[3];
        index = m;
      }
    }

    if (nn)
      ss.push(nn);

    console.log(i + " " + ss.length + " " + max + " " + ss[index].r);
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
