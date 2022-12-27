const util = require('./Util.js');

function FindOperand(aExp) {
  let stack = [];
  let operand = [];
  for (let i = 0; i < aExp.length; i++) {
    operand.push(aExp[i]);
    if (aExp[i] == '(')
      stack.push('(');
    else if (aExp[i] == ')') {
      stack.pop();

      if ((i > 0) && (stack.length == 0))
        return operand;
    }
  }
  return [];
}

function ExpToString(aExp) {
  let exp = "";
  for (let i = 0; i < aExp.length; i++)
    exp += aExp[i];

  return exp;
}

function SplitOp(aExp) {

  aExp.splice(0, 1);
  aExp.splice(aExp.length - 1, 1);

  let l1 = [];
  let op = '';
  let l2 = [];
  if (aExp[0] == '(') {
    l1 = FindOperand(aExp);
    op = aExp[l1.length];
    l2 = aExp.slice(l1.length + 1);
  }
  else {
    l1 = [aExp[0]];
    op = aExp[1];
    l2 = aExp.slice(2);
  }

  return { l1: l1, op: op, l2: l2 };
}

function ComputeOp(aLeft, aOp, aRight) {
  if (aOp == '+')
    return aLeft + aRight;
  else if (aOp == '-')
    return aLeft - aRight;
  else if (aOp == '*')
    return aLeft * aRight;
  else
    return aLeft / aRight;
}

function SolveEcuation(aLeft, aRight) {

  let left = util.CopyObject(aLeft);

  let right = eval(ExpToString(aRight));

  for (; ;) {
    let ret = SplitOp(left);

    let newOp = '-';
    if (ret.op == '/')
      newOp = '*';
    else if (ret.op == '*')
      newOp = '/';
    else if (ret.op == '-')
      newOp = '+';

    if (Array.isArray(ret.l1) && ret.l1.indexOf('X') >= 0) {
      left = ret.l1;

      let rVal = eval(ExpToString(ret.l2));

      right = ComputeOp(right, newOp, rVal);
    }
    else {
      left = ret.l2;

      let rVal = eval(ExpToString(ret.l1));

      if (ret.op == '-' || ret.op == '/')
        right = ComputeOp(rVal, ret.op, right);
      else
        right = ComputeOp(right, newOp, rVal);
    }

    if (ret.l1 == 'X' || ret.l2 == 'X') {
      return right;
    }
  }

  return 0;
}

function ComputeExp(aExpMap) {
  let gg = util.CopyObject(aExpMap.get("root"));

  for (; ;) {
    let found = false;
    for (let key of aExpMap.keys()) {

      let op = util.CopyObject(aExpMap.get(key));

      let j = gg.indexOf(key);

      if (j >= 0) {
        if (op.length > 1)
          gg.splice(j, 1, '(', ...op, ')');
        else
          gg.splice(j, 1, op);
      }

      if (j > 0) {
        found = true;
      }
    }

    if (!found)
      break;
  }

  return gg;
}

function Evaluate(aExp) {
  let ii = aExp.indexOf('=');

  let left = aExp.slice(ii + 1);
  let right = aExp.splice(0, ii);

  let toSolve = left;
  let toMove = right;
  if (right.indexOf('X') >= 0) {
    toSolve = right;
    toMove = left;
  }

  return SolveEcuation(toSolve, [eval(ExpToString(toMove))]);
}

let expMap = new Map();

util.MapInput('./Day21Input.txt', (aElem) => {
  let tokens = aElem.split(': ');

  let hh = tokens[1].split(' ');

  expMap.set(tokens[0], (hh.length > 1) ? [hh[0], hh[1], hh[2]] : tokens[1] == 'X' ? 'X' : parseInt(tokens[1]));
}, '\r\n');

let exp = ComputeExp(expMap);

console.log(eval(ExpToString(exp)));

let rr = expMap.get("root");
rr[1] = '=';
expMap.set("root", rr);
expMap.set("humn", 'X');

let newExp = ComputeExp(expMap);

console.log(Evaluate(newExp));
