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