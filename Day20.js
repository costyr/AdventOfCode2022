const util = require('./Util.js');
const ll = require('./LinkedList.js');

function Transform(aNumbers) {

  let nn = util.CopyObject(aNumbers);
  for (let i = 0; i < aNumbers.length; i++) {
    let hh = aNumbers[i];

    let index = nn.indexOf(hh);

    let ii = (index + hh + (hh >= 0 ? 1 : 0)) % aNumbers.length;
    if (ii < 0)
      ii = aNumbers.length + ii;
    else if (ii == 0)
      ii = aNumbers.length;

    if (ii == index)
      continue;

    nn.splice(ii, 0, hh);

    if (ii < index)
      index ++;
    nn.splice(index, 1);

    //console.log(JSON.stringify(nn));
  }

  for (let i = 0; i < aNumbers.length; i++)
   if (nn.indexOf(aNumbers[i]) == -1)
     console.log("Not found: " + aNumbers[i]);

  let yy = nn.indexOf(0);

  let d1 = nn[(yy + 1000) % aNumbers.length];
  let d2 = nn[(yy + 2000) % aNumbers.length];
  let d3 = nn[(yy + 3000) % aNumbers.length];

  console.log(d1 + " " + d2 + " " + d3);

  return d1 + d2 + d3;
}

function Transform2(aNumbers) {
  let list = new ll.LinkedList();
  
  let nodes = [];
  for (let i = 0; i < aNumbers.length; i++)
    nodes.push(list.AddTail(aNumbers[i]));

  for (let k = 0; k < 10; k++) {
  for (let i = 0; i < nodes.length; i++)
  {
    let node = nodes[i];

    if (node.mValue > 0) {

      let n = node.mNext;
        if (n == null)
          n = list.mHead;
      list.RemoveNode(node);
      let nth = list.GetNodeNthPosFromNode(n, (node.mValue - 1) % list.mSize);

      //if (nth != node) {
        list.AddNodeAfter(nth, node);
      //}
      //else
      //{
      //  console.log(nth.mValue + " " + node.mValue);
     // }
    } 
    else if (node.mValue < 0)
    {
      let n = node.mPrev;
        if (n == null)
          n = list.mTail;
      list.RemoveNode(node);
      let nth = list.GetNodeNthPosBackFromNode(n, Math.abs(node.mValue) % list.mSize);
      
      //if (nth != node) {
        list.AddNodeAfter(nth, node);
      //}
      //else
     // {
       // console.log(nth.mValue + " " + node.mValue);
     // }
    }      

    //console.log(node.mValue + " => " + list.ToString());
  }
  console.log(k);
}

  let node = list.GetNodeWithValue(0);

  let d1 = list.GetNodeNthPosFromNode(node, 1000).mValue;
  let d2 = list.GetNodeNthPosFromNode(node, 2000).mValue;
  let d3 = list.GetNodeNthPosFromNode(node, 3000).mValue;

  console.log(d1 + " " + d2 + " " + d3);

  return d1 + d2 + d3;
}

let numbers = util.MapInput('./Day20Input.txt', (aElem) => {
  return parseInt(aElem) * 811589153;
  }, '\r\n');

//console.log(numbers);

//console.log(Transform(numbers));

console.log(Transform2(numbers));
