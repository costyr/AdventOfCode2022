const util = require('./Util.js');

function ComputeDirSize(aFilesMap, aDirSizeMap, aDirName) {
  let entries = aFilesMap[aDirName];

  let size = 0;
  for (let key in entries) {
    let value = entries[key];
    if (value.type == 0)
      size += value.size;
    else {
      if (value.size == -1) {
        let dirPath = aDirName;
        if (dirPath.length > 0)
          dirPath += "\\";
        dirPath += key;
        let dirSize = aDirSizeMap[dirPath];

        if ((dirSize == undefined) || (dirSize == -1)) {
          return -1;
        }
        else
          size += dirSize;
      }
      else
        size += value.size;
    }
  }

  return size;
}

function ComputeDirSizes(aFilesMap, aDirSizeMap) {

  for (; ;) {
    let computed = true;
    for (let key in aFilesMap) {
      if (dirSizeMap[key] > 0)
        continue;

      let dirSize = ComputeDirSize(aFilesMap, aDirSizeMap, key);

      if (dirSize == -1) {
        computed = false;
        aDirSizeMap[key] = -1;
      }
      else
        aDirSizeMap[key] = dirSize;
    }

    if (computed)
      break;
  }

  let total = 0;
  for (let key in aDirSizeMap) {
    let dirSize = aDirSizeMap[key];

    if (dirSize < 100000)
      total += dirSize;
  }

  return total;
}

function ComputePath(aPath) {
  let flatPath = "";
  for (let i = 0; i < aPath.length; i++) {
    if (flatPath.length > 0)
      flatPath += "\\";
    flatPath += aPath[i];
  }

  return flatPath;
}

function FindSmallestFileSize(aDirSizeMap) {
  
  let fileSizes = [];
  for (let key in aDirSizeMap) {
    let size = aDirSizeMap[key];
    fileSizes.push(size);
  }

  fileSizes.sort((a, b) => { return a - b; });

  let total = aDirSizeMap[""];

  for (let i = 0; i < fileSizes.length; i++) {
    if ((70000000 - total + fileSizes[i]) > 30000000) {
      return fileSizes[i];
    }
  }
  return 0;
}

let currentPath = [];

let filesMap = [];

util.MapInput('./Day7Input.txt', (aElem) => {

  if (aElem.startsWith("$")) {
    let tokens = aElem.split(' ');
    if (tokens[1] == "cd") {
      if ((tokens[2] == '/')) {
        currentPath = [];
      }
      else if (tokens[2] == "..") {
        currentPath.pop();
      }
      else {
        currentPath.push(tokens[2]);
      }
    }
    else if (tokens[1] == "ls") {
    }
  }
  else if (aElem.startsWith("dir")) {
    let flatPath = ComputePath(currentPath);

    let tokens = aElem.split(' ');

    if (filesMap[flatPath] == undefined)
      filesMap[flatPath] = [];

    filesMap[flatPath][tokens[1]] = { type: 1, size: -1 };
  }
  else {
    let flatPath = ComputePath(currentPath);

    let tokens = aElem.split(' ');

    if (filesMap[flatPath] == undefined)
      filesMap[flatPath] = [];

    filesMap[flatPath][tokens[1]] = { type: 0, size: parseInt(tokens[0]) };
  }

  return aElem;
}, '\r\n');

let dirSizeMap = [];

console.log(ComputeDirSizes(filesMap, dirSizeMap));

console.log(FindSmallestFileSize(dirSizeMap));
