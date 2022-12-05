const util = require('./Util.js');

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

function Transform(aStacks, aMoves) {
  for (let i = 0; i < aMoves.length; i++)
  {
    for (let j = 0; j < aMoves[i][0]; j++)
      aStacks[aMoves[i][2] - 1].push(aStacks[aMoves[i][1] - 1].pop());
  }
  
  let tops = [];
  for (let i = 0; i < aStacks.length; i++)
    tops.push(aStacks[i][aStacks[i].length - 1]);
    
  return tops.join('');
}

function Transform2(aStacks, aMoves) {
  for (let i = 0; i < aMoves.length; i++)
  {
    let temp = [];
    for (let j = 0; j < aMoves[i][0]; j++)
      temp.push(aStacks[aMoves[i][1] - 1].pop());

    for (let k = temp.length - 1; k >= 0; k--) 
      aStacks[aMoves[i][2] - 1].push(temp[k]);
  }
  
  let tops = [];
  for (let i = 0; i < aStacks.length; i++)
    tops.push(aStacks[i][aStacks[i].length - 1]);
    
  return tops.join('');
}

let state = 0;

let stacks= [];
let moves = [];

util.MapInput('./Day5Input.txt', (aElem) => {

  if (state == 0) {
    if (aElem.startsWith(" 1"))
    {
      state = 1;
    }
    else
    {
      for (let i = 0; i < aElem.length; i++)
       if (isLetter(aElem[i]))
       {
         if ( i > 1)
         {
           let index = (i - 1) / 4;
           for (let j = stacks.length - 1; j < index; j++ )
             stacks.push([]);     
           stacks[index].splice(0, 0, aElem[i]);  
         }
         else
         {
           if (stacks.length == 0)
             stacks.push([]);
           stacks[0].splice(0, 0, aElem[i]);
         }  
       }         
    }    
  }
  else {
    if (aElem.length > 0)
      moves.push(aElem.replace("move ", "").replace(" from ", ",").replace(" to ", ",").split(",").map((yy)=>{
        return parseInt(yy);
      }));
  }

  return aElem;
  }, '\r\n');

let stacks0 = util.CopyObject(stacks);

console.log(Transform(stacks, moves));
console.log(Transform2(stacks0, moves));
