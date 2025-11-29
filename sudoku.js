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

function isValueValidForCell(cellId, value) {
  let col = cellId % ROW_LENGTH;
  let row = Math.floor(cellId / ROW_LENGTH);
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

function initDisplay() {
  const tbody = document.querySelector('.sudoku tbody');
  for (let r = 0; r < ROW_LENGTH; r++) {
    const tr = document.createElement('tr');
    for (let c = 0; c < ROW_LENGTH; c++) {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'cell';
      input.maxLength = 1;
      input.inputMode = 'numeric';
      // assign sequential id 1..81
      input.id = (r * ROW_LENGTH + c).toString();
      input.setAttribute('aria-label', `row ${r + 1} column ${c + 1}`);
      // allow only digits 1-9
      input.addEventListener('input', (e) => {
        let v = input.value.replace(/[^0-9]/g, '');
        if (v.length > 1) v = v.slice(-1);
        if (v && !/^[1-9]$/.test(v)) v = '';
        input.value = v;
      });
      // keyboard navigation: arrows and backspace left
      input.addEventListener('keydown', (e) => {
        const key = e.key;
        const pos = getPosition(input);
        if (key === 'ArrowRight') { e.preventDefault(); focusAt(pos.r, pos.c + 1); }
        else if (key === 'ArrowLeft') { e.preventDefault(); focusAt(pos.r, pos.c - 1); }
        else if (key === 'ArrowDown') { e.preventDefault(); focusAt(pos.r + 1, pos.c); }
        else if (key === 'ArrowUp') { e.preventDefault(); focusAt(pos.r - 1, pos.c); }
        else if (key === 'Backspace' && input.value === '') { e.preventDefault(); focusAt(pos.r, pos.c - 1); }
      });
      // prevent pasting non-conforming content
      input.addEventListener('paste', (e) => {
        const t = (e.clipboardData || window.clipboardData).getData('text');
        if (!/^[1-9]$/.test(t.trim())) e.preventDefault();
      });

      td.appendChild(input);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }

  function getPosition(el) {
    const td = el.closest('td');
    const tr = td.parentElement;
    const r = Array.from(tbody.children).indexOf(tr);
    const c = Array.from(tr.children).indexOf(td);
    return { r, c };
  }

  function focusAt(r, c) {
    if (r < 0 || r > 8 || c < 0 || c > 8) return;
    const input = tbody.children[r].children[c].firstElementChild;
    input.focus();
    input.select();
  }

  document.getElementById('clear').addEventListener('click', () => {
    document.querySelectorAll('.cell').forEach(i => i.value = '');
    document.querySelector('.cell').focus();
  });

  // small sample fill for demo
  document.getElementById('fill-fast-sample').addEventListener('click', () => {
    const sample = [
      '..86....1',
      '47.5.....',
      '......495',
      '....847..',
      '7..9.6..2',
      '..671....',
      '917......',
      '.....5.27',
      '2....98..'
    ];
    fill(sample);
  });

  // small sample fill for demo
  document.getElementById('fill-slow-sample').addEventListener('click', () => {
    const sample = [
      '53..7....',
      '6..195...',
      '.98....6.',
      '8...6...3',
      '4..8.3..1',
      '7...2...6',
      '.6....28.',
      '...419..5',
      '....8..79'
    ];
    fill(sample);
  });

  document.getElementById('fill-test-sample').addEventListener('click', () => {
    const sample = [
      '..6891453', // . instead of 2, . instead of 7
      '1.3425678', // . instead of 9
      '845637219',
      '762519384',
      '931748562',
      '458362791',
      '689274135',
      '527183946',
      '314956827'
    ];
    fill(sample);
  });

  function fill(sample) {
    for (let r = 0; r < ROW_LENGTH; r++) {
      for (let c = 0; c < ROW_LENGTH; c++) {
        const ch = sample[r][c];
        const input = tbody.children[r].children[c].firstElementChild;
        input.value = (ch === '.' ? '' : ch);
        input.disabled = (ch !== '.');
      }
    }
    focusAt(0, 0);
  }
}