const util = require('./Util.js');

function RunProgram(aInsts) {
  let regState = [];

  let regX = 1;
  for (let i = 0; i < aInsts.length; i++)
  {
    if (aInsts[i].inst == "noop")
    {
      regState.push(regX);
    }
    else if (aInsts[i].inst == "addx")
    {
      regState.push(regX);
      regState.push(regX);
      regX += aInsts[i].op;
    }
  }

  return regState[19] * 20 + 
         regState[59] * 60 + 
         regState[99] * 100 + 
         regState[139] * 140 + 
         regState[179] * 180 + 
         regState[219] * 220;
}

function GetPixel(aCicle, aRegX) {
   return ((aCicle >= (aRegX - 1)) && (aCicle <= (aRegX + 1))) ? '#' : ' ';
}

function DrawCRT(aInsts) {
  let pixels = [];

  let regX = 1;
  let cicle = -1;
  for (let i = 0; i < aInsts.length; i++)
  {
    if (aInsts[i].inst == "noop")
    {
      cicle++;
      pixels.push(GetPixel(cicle % 40, regX));
    }
    else if (aInsts[i].inst == "addx")
    {
      cicle++;
      pixels.push(GetPixel(cicle % 40, regX));
      cicle++;
      pixels.push(GetPixel(cicle % 40, regX));
      regX += aInsts[i].op;
    }
  }

  console.log(pixels.slice(0, 39).join(''));
  console.log(pixels.slice(40, 79).join(''));
  console.log(pixels.slice(80, 119).join(''));
  console.log(pixels.slice(120, 159).join(''));
  console.log(pixels.slice(160, 199).join(''));
  console.log(pixels.slice(200, 239).join(''));
}

let insts = util.MapInput('./Day10Input.txt', (aElem) => {
  let rawInst = aElem.split(' ');
  return { inst: rawInst[0], op: parseInt((rawInst[1] == undefined) ? 0 : rawInst[1])};
  }, '\r\n');

console.log(RunProgram(insts));
DrawCRT(insts);
