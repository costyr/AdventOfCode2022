const util = require('./Util.js');
const ll = require('./LinkedList.js');

function Transform(aNumbers, aMixCount, aFactor) {
  let list = new ll.LinkedList();

  let nodes = [];
  for (let i = 0; i < aNumbers.length; i++)
    nodes.push(list.AddTail(aNumbers[i] * aFactor));

  for (let k = 0; k < aMixCount; k++) {
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i];

      if (node.mValue > 0) {

        let n = node.mNext;
        if (n == null)
          n = list.mHead;
        list.RemoveNode(node);
        let nth = list.GetNodeNthPosFromNode(n, (node.mValue - 1) % list.mSize);

        list.AddNodeAfter(nth, node);

      }
      else if (node.mValue < 0) {
        let n = node.mPrev;
        if (n == null)
          n = list.mTail;
        list.RemoveNode(node);
        let nth = list.GetNodeNthPosBackFromNode(n, Math.abs(node.mValue) % list.mSize);

        list.AddNodeAfter(nth, node);
      }
    }
  }

  let node = list.GetNodeWithValue(0);

  let d1 = list.GetNodeNthPosFromNode(node, 1000).mValue;
  let d2 = list.GetNodeNthPosFromNode(node, 2000).mValue;
  let d3 = list.GetNodeNthPosFromNode(node, 3000).mValue;

  return d1 + d2 + d3;
}

let numbers = util.MapInput('./Day20Input.txt', (aElem) => {
  return parseInt(aElem);
}, '\r\n');

console.log(Transform(numbers, 1, 1));

console.log(Transform(numbers, 10, 811589153));
