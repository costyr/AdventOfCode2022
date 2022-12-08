const util = require('./Util.js');

function isVisible(aMap, aX, aY) {

  let isVisible = true;
  for (let i = 0; i < aX; i++) {
    if (aMap[i][aY] >= aMap[aX][aY]) {
      isVisible = false;
      break;
    }
  }

  if (isVisible)
    return true;

  isVisible = true;
  for (let i = aX + 1; i < aMap.length; i++) {
    if (aMap[i][aY] >= aMap[aX][aY]) {
      isVisible = false;
      break;
    }
  }

  if (isVisible)
    return true;

  isVisible = true;
  for (let i = 0; i < aY; i++) {
    if (aMap[aX][i] >= aMap[aX][aY]) {
      isVisible = false;
      break;
    }
  }

  if (isVisible)
    return true;

  isVisible = true;
  for (let i = aY + 1; i < aMap[aX].length; i++) {
    if (aMap[aX][i] >= aMap[aX][aY]) {
      isVisible = false;
      break;
    }
  }

  if (isVisible)
    return true;

  return false;
}

function ComputeTreeScore(aMap, aX, aY) {

  let score0 = 0;
  for (let i = aX - 1; i >= 0; i--) {
    score0++;
    if (aMap[i][aY] >= aMap[aX][aY]) {
      break;
    }
  }


  let score1 = 0;
  for (let i = aX + 1; i < aMap.length; i++) {
    score1++;
    if (aMap[i][aY] >= aMap[aX][aY]) {
      break;
    }
  }


  let score2 = 0;
  for (let i = aY - 1; i >= 0; i--) {
    score2++;
    if (aMap[aX][i] >= aMap[aX][aY]) {
      break;
    }
  }


  let score3 = 0;
  for (let i = aY + 1; i < aMap[aX].length; i++) {
    score3++;
    if (aMap[aX][i] >= aMap[aX][aY]) {
      break;
    }
  }

  return score0 * score1 * score2 * score3;
}

function CountVisible(aMap) {

  let count = 0;
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++)
      if (isVisible(aMap, i, j)) {
        count++;
      }

  return count;
}

function ComputeMaxScore(aMap) {

  let maxScore = 0;
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++) {
      let score = ComputeTreeScore(aMap, i, j);
      if (score > maxScore)
        maxScore = score;
    }

  return maxScore;
}

let treeMap = util.MapInput('./Day8Input.txt', (aElem) => {
  return aElem.split('').map((aa) => { return parseInt(aa); });
}, '\r\n');

console.log(CountVisible(treeMap));
console.log(ComputeMaxScore(treeMap));
