const util = require('./Util.js');

function Collect(aState) {
  for (let j = 0; j < aState.r.length; j++)
    aState.c[j] += aState.r[j];

}

function GetKey(aState) {
  let key = '';
  for (let i = 0; i < aState.c.length; i++) {
    if (key.length > 0)
      key += '_';
    key += aState.c[i];
  }

  for (let i = 0; i < aState.r.length; i++) {
    key += '_';
    key += aState.r[i];
  }

  return key;
}

function DecodeKey(aKey) {
  let ss = aKey.split('_').map((aa) => { return parseInt(aa);});

  return { c: ss.slice(0, 4), r: ss.slice(4) };
}

function Simulate(aBluePrints, aCount, aMinutes) {

  let total = 0;
  let total2 = 1
  for (let k = 0; k < aCount; k++) {

    //if (k == 4 || k == 19)
    //  continue;

    console.log("\nBlueprint " + (k + 1) + ": " )

    let bp = aBluePrints[k];
    let ss = new Map();
    let maxO = 0;
    let maxG = 0;
    ss.set(GetKey({ c: [0, 0, 0, 0], r: [1, 0, 0, 0] }), 1);
    for (let i = 0; i < aMinutes; i++) {
      let hh = [];
      for (let key of ss.keys()) {

        let oo = DecodeKey(key);

        ss.delete(key);

        let nn1 = util.CopyObject(oo);
        let nn2 = util.CopyObject(oo);
        let nn3 = util.CopyObject(oo);
        let nn4 = util.CopyObject(oo);

        if (bp[3][0] <= oo.c[0] && bp[3][1] <= oo.c[2]) {

          nn1.c[0] -= bp[3][0];
          nn1.c[2] -= bp[3][1];
          Collect(nn1);
          nn1.r[3] += 1;

          hh.push(nn1);
        }

        if (bp[2][0] <= oo.c[0] && bp[2][1] <= oo.c[1]) {

          nn2.c[0] -= bp[2][0];
          nn2.c[1] -= bp[2][1];
          Collect(nn2);
          nn2.r[2] += 1;

          hh.push(nn2);
        }

        if (bp[1][0] <= oo.c[0]) {

          nn3.c[0] -= bp[1][0];

          Collect(nn3);
          nn3.r[1] += 1;

          hh.push(nn3);
        }

        if (bp[0][0] <= oo.c[0]) {

          nn4.c[0] -= bp[0][0];
          Collect(nn4);
          nn4.r[0] += 1;

          hh.push(nn4);
        }

        Collect(oo);

        hh.push(oo);

      }
      for (let j = 0; j < hh.length; j++)
        ss.set(GetKey(hh[j]), 1);

      let maxO = 0;
      let maxC = 0;
      let maxGState = null;
      let maxOState = null;
      let maxCState = null;
      for (let key of ss.keys()) {
        let nn = DecodeKey(key);
        
        if (nn.c[1] > maxC)
        {
          maxCState = nn;
          maxC = nn.c[1];
        }

        if (nn.c[2] > maxO)
        {
          maxOState = nn;
          maxO = nn.c[2];
        }

       if (nn.c[3] > maxG)
       {
         maxGState = nn;
         maxG = nn.c[3];
       }
      }

      if (maxG > 0)
        for (let key of ss.keys()) {
          let oo = DecodeKey(key);

          if (oo.c[3] < maxG && (oo.r[3] < maxGState.r[3]))
            ss.delete(key);
        }
      else if (maxO > 0)
      {
        for (let key of ss.keys()) {
          let oo = DecodeKey(key);

          if (oo.c[2] < maxO && (oo.r[2] < maxOState.r[2]) && (oo.r[1] < maxOState.r[1]) && (oo.r[0] < maxCState.r[0]))
            ss.delete(key);
        }
      } 
      else if (maxC > 0)
      {
        for (let key of ss.keys()) {
          let oo = DecodeKey(key);

          if (oo.c[1] < maxC && (oo.r[1] < maxCState.r[1]) && (oo.r[0] < maxCState.r[0]))
            ss.delete(key);
        }
      }   

      console.log(i + " " + ss.size + " " + maxO + " " + maxG);
    }

    total += (k + 1) * maxG;
    total2 *= maxG;
  }

  return [total, total2];
}

let bluePrints = util.MapInput('./Day19Input.txt', (aElem) => {
  return aElem.split(/\: |\. /).slice(1).map((bb) => {

    let tt = bb.split(' ');

    if (tt.length == 6)
      return [parseInt(tt[4])];
    else
      return [parseInt(tt[4]), parseInt(tt[7])];

  })
}, '\r\n');

console.log(bluePrints);

let part1 = Simulate(bluePrints, bluePrints.length, 24)[0];
let part2 = Simulate(bluePrints, 3, 32)[1];

console.log(part1 + "\n" + part2);
