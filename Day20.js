const util = require('./Util.js');

function Transform(aNumbers) {

  for (let i = 0; i < aNumbers.length; i++) {
    let hh = aNumbers[i];
    let ii = (i + hh) % aNumbers.length;
    if (ii < 0)
      ii = aNumbers.length + ii;

    let tmp = aNumbers[ii];
    aNumbers[ii] = hh;
    aNumbers[i] = tmp;

    console.log(aNumbers);
  }

  return aNumbers;
}

let numbers = util.MapInput('./Day20TestInput.txt', (aElem) => {
  return parseInt(aElem);
  }, '\r\n');

console.log(numbers);

console.log(Transform(numbers));
