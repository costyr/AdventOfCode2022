const util = require('./Util.js');

let elvesFood = util.MapInput('./Day1Input.txt', (aElem) => {
  let total = 0;
  return aElem.split('\r\n').reduce((aTotal, aa)=>{return aTotal + parseInt(aa);}, total);
  }, '\r\n\r\n');

console.log(Math.max(...elvesFood));
elvesFood.sort().reverse();
console.log(elvesFood[0] + elvesFood[1] + elvesFood[2]);
