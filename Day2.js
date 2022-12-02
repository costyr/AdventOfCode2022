const util = require('./Util.js');

const kScoreMap = new Map([["A X", 4], ["A Y", 8], ["A Z", 3], 
                           ["B X", 1], ["B Y", 5], ["B Z", 9], 
                           ["C X", 7], ["C Y", 2], ["C Z", 6]]);

const kMaxScoreMap = new Map([["A X", 3], ["A Y", 4], ["A Z", 8], 
                              ["B X", 1], ["B Y", 5], ["B Z", 9], 
                              ["C X", 2], ["C Y", 6], ["C Z", 7]]);

let total = { part1: 0, part2: 0 };

util.ReduceInput('./Day2Input.txt', (aTotal, aElem) => {
    
    aTotal.part1 += kScoreMap.get(aElem);

    aTotal.part2 += kMaxScoreMap.get(aElem);

    return aTotal;

  }, total ,'\r\n');

console.log(total.part1);
console.log(total.part2);
