const ROW_LENGTH = 9
const MAX_CELL_ID = ROW_LENGTH * ROW_LENGTH;
var grid = new Array(MAX_CELL_ID);

function solve() {
  initGrid();
  for (let cellId = 0; cellId < MAX_CELL_ID; cellId++) {
    processCell(cellId);
  }
}
function initGrid() {
  for (let i = 0; i < MAX_CELL_ID; i++) {
    grid[i] = document.getElementById(i).value;
  }
}

function processCell(cellId) {
  if (grid[cellId] === "") {
    let found = false;
    for (let i = 1; i <= ROW_LENGTH; i++) {
      if (isValueValidForCell(cellId, i)) {
        found = true;
        grid[cellId] = i;
        // debug: temporarily display the value assigned
        //document.getElementById(i).value = grid[i];
        if (cellId == MAX_CELL_ID - 1) {
          displayResult();
          return true;
        } else {
          processCell(cellId + 1);
        }
      }
    }
  } else if (cellId == MAX_CELL_ID - 1) {
    displayResult();
  } else {
    processCell(cellId + 1);
  }
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

function displayResult() {
  let solved = true;
  for (let i = 0; i < MAX_CELL_ID; i++) {
    document.getElementById(i).value = grid[i];
    if (grid[i] === "") {
      solved = false;
    }
  }
  if (!solved) {
    alert("No solution found :-(")
  }
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
  document.getElementById('fill-sample').addEventListener('click', () => {
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
    for (let r = 0; r < ROW_LENGTH; r++) {
      for (let c = 0; c < ROW_LENGTH; c++) {
        const ch = sample[r][c];
        const input = tbody.children[r].children[c].firstElementChild;
        input.value = (ch === '.' ? '' : ch);
      }
    }
    focusAt(0, 0);
  });

}