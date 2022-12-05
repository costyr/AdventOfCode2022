const { off } = require('process');
const util = require('./Util.js');

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

let state = 0;

let stacks= [['1'],
             ['2'],
             ['3'],
             ['4'],
             ['5'],
             ['6'],
             ['7'],
             ['8'],
             ['9']];
let moves = [];

let gg = util.MapInput('./Day5Input.txt', (aElem) => {

  if (state == 0) {
    if (aElem.startsWith(" 1"))
    {
      state = 1;
    }
    else
    {
      let offset = 0;
      for (let i = 0; i < aElem.length; i++)
       if (isLetter(aElem[i]))
       {
         if ( i > 4)
         {
           offset += 3;
           console.log(aElem[i] + " " + stacks[i - offset] + " " + (i - offset) + " " + offset);

           stacks[i - offset].push(aElem[i]);  
         }
         else
         {
           stacks[0].push(aElem[i]);
           offset += 1;
         }  
       }         
    }    
  }
  else {
    
  }

  return aElem;
  }, '\r\n');

console.log(stacks);
