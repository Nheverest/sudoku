const GROUP_SIZE=3
const ROW_LENGTH = GROUP_SIZE*GROUP_SIZE;
const MAX_CELL_ID = ROW_LENGTH * ROW_LENGTH;
var grid = new Array(MAX_CELL_ID);

function initGrid() {
  for (let i = 0; i < MAX_CELL_ID; i++) {
    grid[i] = document.getElementById(i).value;
  }
}

function solve() {
      var startTime = new Date().getTime();
  initGrid();

  if (processCell(0)) {
    if ( console ) {
        console.log("Duration: " + (new Date().getTime()-startTime) +"ms");
    }
    displayResult();
  } else {
    // no solution
    alert("No solution found :-(")
  }
}

function processCell(cellId) {
  if (grid[cellId] === "") {
    let found = false;
    for (let i = 1; i <= ROW_LENGTH; i++) {
      if (isValueValidForCell(cellId, i)) {
        found = true;
        grid[cellId] = i;
        // /!\ Heavy load on memory use with caution!
        //show_console(cellId);
        if (cellId == MAX_CELL_ID - 1) {
          return true;
        }
        found = processCell(cellId + 1);
      }
    }
    if (!found) {
      grid[cellId] = "";
    }
    return found;
  } else if (cellId == MAX_CELL_ID - 1) {
    return true;
  } else {
    return processCell(cellId + 1);
  }
}

function show_console(max_val) {
  if ( ! console ) {
    return;
  }
  let str = "";
  for (let k = 0; k < max_val + 1; k++) {
    str += grid[k]
    if ((k + 1) % ROW_LENGTH == 0) {
      str += '\n';
    }
  }
  console.log(str);

}

function displayResult() {
  // display result
  for (let i = 0; i < MAX_CELL_ID; i++) {
    document.getElementById(i).value = grid[i];
  }
  if (!checkResult()) {
    alert("Something went wrong. Check console logs")
  }
}

function checkResult() {
  initGrid();

  let result = true;
  // check rows
  for (let i = 0; i < ROW_LENGTH; i++) {
    let sum = 0;
    let usage = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let j = 0; j < ROW_LENGTH; j++) {
      let currentValue = Number(grid[i * ROW_LENGTH + j]);
      sum += currentValue;
      if (usage[currentValue - 1] === 0) {
        usage[currentValue - 1] = 1;
      } else {
        console.log("Number " + currentValue + " has been used more than once in row " + (i + 1));
        result = false;
      }
    }
    if (sum !== ROW_LENGTH * (ROW_LENGTH + 1) / 2) {
      console.log("Sum for row " + (i + 1) + " is " + sum);
      result = false;
    }
  }

  // check columns
  for (let i = 0; i < ROW_LENGTH; i++) {
    let sum = 0;
    let usage = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let j = 0; j < ROW_LENGTH; j++) {
      let currentValue = Number(grid[i + j * ROW_LENGTH]);
      sum += currentValue;

      if (usage[currentValue - 1] === 0) {
        usage[currentValue - 1] = 1;
      } else {
        console.log("Number " + currentValue + " has been used more than once in column " + (i + 1));
        result = false;
      }
    }
    if (sum !== ROW_LENGTH * (ROW_LENGTH + 1) / 2) {
      console.log("Sum for col " + (i + 1) + " is " + sum);
      result = false;
    }
  }
  return result;
}


function getColumn(cellId) {
  if (cellId < 0 || cellId >= MAX_CELL_ID) {
    return -1
  }
  return cellId % ROW_LENGTH;
}

function getRow(cellId) {
  if (cellId < 0 || cellId >= MAX_CELL_ID) {
    return -1
  }
  return Math.floor(cellId / ROW_LENGTH);
}

function isValueValidForCell(cellId, value) {
  let col = getColumn(cellId);
  let row = getRow(cellId);
  // search on columns
  for (let j = 0; j < ROW_LENGTH; j++) {
    if (grid[row * ROW_LENGTH + j] == value) {
      return false;
    }
  }
  // search on rows
  for (let j = 0; j < ROW_LENGTH; j++) {
    if (grid[j * ROW_LENGTH + col] == value) {
      return false;
    }
  }

  // search in neighbours
  let groupNumber = getGroupNumber(row, col);
  for (let i = 0; i < neighbours[groupNumber].length; i++) { 
    if ( grid[neighbours[groupNumber][i]] == value) {
      return false;
    }
  }

  return true;
}

function getGroupNumber(row, col) {
  let groupRow = Math.floor(row / GROUP_SIZE);
  let groupCol = Math.floor(col / GROUP_SIZE);
  let group = groupRow*GROUP_SIZE + groupCol;
  return group;
}


const neighbours = [
  [0, 1, 2, 9, 10, 11, 18, 19, 20],
  [3, 4, 5, 12, 13, 14, 21, 22, 23],
  [6, 7, 8, 15, 16, 17, 24, 25, 26],
  [27, 28, 29, 36, 37, 38, 45, 46, 47],
  [30, 31, 32, 39, 40, 41, 48, 49, 50],
  [33, 34, 35, 42, 43, 44, 51, 52, 53],
  [54, 55, 56, 63, 64, 65, 72, 73, 74],
  [57, 58, 59, 66, 67, 68, 75, 76, 77],
  [60, 61, 62, 69, 70, 71, 78, 79, 80]
];