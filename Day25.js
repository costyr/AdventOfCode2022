const util = require('./Util.js');

function Decode(aNumber) {
  let number = 0;
  for (let i = 0; i < aNumber.length; i++) {
    let nn = 0;
    if (aNumber[i] == '-')
      nn = -1;
    else if (aNumber[i] == '=')
      nn = -2;
    else
      nn = parseInt(aNumber[i]);
    number += nn * Math.pow(5, aNumber.length - i - 1);
  }

  return number;
}

function Transform(aNumbers) {
  let total = 0;
  for (let i = 0; i < aNumbers.length; i++) {
    let nr = Decode(aNumbers[i]);
    total += nr;
  }

  return total;
}

function Encode(aNumber) {

  let gg = "";
  while (aNumber > 0) {
    gg = aNumber % 5 + gg;
    aNumber = Math.floor(aNumber / 5);
  }

  let oo = [];
  for (let i = 0; i < gg.length; i++) {
    if (gg[i] < 3)
      oo.push(gg[i])
    else if (gg[i] == 3)
    {
      if (oo.length == 0)
      {
        oo.push('1');
        oo.push('=');
      }
      else
      {
        let last = oo.pop();

        if (last == '-')
        {
          oo.push('0');
          oo.push('=');  
        }
        else if (last == '=')
        {
          oo.push('-');
          oo.push('=');
        } 
        else {
          let lastNr = Number.parseInt(last);

          oo.push((lastNr + 1).toString());
          oo.push('=');
        }
      }
    }
    else if (gg[i] == 4)
    {
      if (oo.length == 0)
      {
        oo.push('1');
        oo.push('-');
      }
      else
      {
        let last = oo.pop();

        if (last == '-')
        {
          oo.push('0');
          oo.push('-');  
        }
        else if (last == '=')
        {
          oo.push('-');
          oo.push('-');
        } 
        else {
          let lastNr = Number.parseInt(last);

          oo.push((lastNr + 1).toString());
          oo.push('-');
        }
      }       
    }
  }

  let snfu = "";
  for (let i = 0; i < oo.length; i++)
    snfu += oo[i]; 

  return snfu;
}

let numbers = util.MapInput('./Day25Input.txt', (aElem) => {
  return aElem.split('');
}, '\r\n');

let sum = Transform(numbers);

console.log(Encode(sum));
