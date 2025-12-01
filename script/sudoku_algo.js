const ROW_LENGTH = 9
const MAX_CELL_ID = ROW_LENGTH * ROW_LENGTH;
var grid = new Array(MAX_CELL_ID);

function initGrid() {
  for (let i = 0; i < MAX_CELL_ID; i++) {
    grid[i] = document.getElementById(i).value;
  }
}

function solve() {
  initGrid();
  if (processCell(0)) {
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
        show_console(cellId);
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
      console.log("Sum for row " + (i+1) + " is " + sum);
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
      console.log("Sum for col " + (i+1) + " is " + sum);
      result = false;
    }
  }
  return result;
}


function getColumn(cellId) {
  if ( cellId < 0 || cellId >= MAX_CELL_ID ) {
    return -1
  }
  return cellId % ROW_LENGTH;
}

function getRow(cellId) {
  if ( cellId < 0 || cellId >= MAX_CELL_ID ) {
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
  
  return true;
}
