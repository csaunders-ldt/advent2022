import {
  filter,
  find,
  findIndex,
  flatMap,
  forEach,
  groupBy,
  map,
  partial,
  range,
  split,
  times,
} from 'lodash';
import { solve } from '../utils';

type Cell = {
  x: number;
  y: number;
  isFilled: boolean;
  next: State[];
};
type State = { cell: Cell; facing: number };
type Input = { cells: Cell[]; instructions: string[] };

function parser(input: string): Input {
  const [grid, lines] = split(input, '\n\n');
  const maybeCells = flatMap(split(grid, '\n'), (row, y) =>
    map(split(row, ''), (cell, x) => ({ x, y, cell, next: [] })),
  );
  const items = filter(maybeCells, ({ cell }) => cell !== ' ');
  const cells = map(items, ({ cell, ...c }) => ({
    ...c,
    isFilled: cell === '#',
  }));
  const instructions = lines.match(/([A-Z]+|\d+)/g);
  return { cells, instructions };
}

function move(state: State, distance: number): State {
  if (distance === 0) return state;
  const next = state.cell.next[state.facing];
  // console.log([state.cell.x, state.cell.y]);
  return next.cell.isFilled ? state : move(next, distance - 1);
}

function execute(input: Input, state: State) {
  forEach(input.instructions, (instruction) => {
    if (instruction === 'L' || instruction === 'R') {
      state.facing = (state.facing + (instruction === 'L' ? -1 : 1) + 4) % 4;
      return;
    }
    state = move(state, +instruction);

    // console.log(state);
  });
  return (state.cell.y + 1) * 1000 + (state.cell.x + 1) * 4 + state.facing;
}

function makeLoop({ cells }: Input) {
  const cols = groupBy(cells, 'x');
  const rows = groupBy(cells, 'y');
  forEach(cells, (cell) => {
    const col = cols[cell.x];
    const row = rows[cell.y];
    cell.next = [
      { cell: row[findIndex(row, cell) + 1] || row[0], facing: 0 },
      { cell: col[findIndex(col, cell) + 1] || col[0], facing: 1 },
      { cell: row[findIndex(row, cell) - 1] || row.last, facing: 2 },
      { cell: col[findIndex(col, cell) - 1] || col.last, facing: 3 },
    ];
  });
}

function part1(input: Input) {
  makeLoop(input);
  return execute(input, { facing: 0, cell: input.cells[0] });
}

function isCorner({ next }: Cell, i: number, j: number) {
  return next[i] && !next[i].cell.next[j] && next[j] && !next[j].cell.next[i];
}

function attach(l: Cell, r: Cell, lFacing: number, rFacing: number, depth = 6) {
  if (depth === 0) {
    console.log('2deep');
    return;
  }
  // console.log(`Folding ${l.x}, ${l.y} and ${r.x}, ${r.y}`);
  l.next[(lFacing + 1) % 4] = { cell: r, facing: (rFacing + 1) % 4 };
  r.next[(rFacing + 3) % 4] = { cell: l, facing: (lFacing + 3) % 4 };

  if (!l.next[lFacing]) {
    if (!r.next[rFacing]) return;
    console.log('rotating left');
    lFacing = (lFacing + 3) % 4;
    depth--;
    console.log(depth);
  } else {
    l = l.next[lFacing].cell;
  }
  if (!r.next[rFacing]) {
    console.log('rotating right');
    rFacing = (rFacing + 1) % 4;
    depth--;
    console.log(depth);
  } else {
    r = r.next[rFacing].cell;
  }

  if (
    l === r ||
    filter(l.next, (v) => v).length === 4 ||
    filter(r.next, (v) => v).length === 4
  ) {
    return;
    console.log(`Failed to fold ${l.x}, ${l.y} and ${r.x}, ${r.y}`);
    process.exit(1);
  }
  attach(l, r, lFacing, rFacing, depth);
}

function fold(cell: Cell) {
  let lFacing = find(range(4), (i) => isCorner(cell, i, (i + 1) % 4));
  if (!lFacing) return;

  console.log(`folding ${cell.x}, ${cell.y}`);
  let rFacing = (lFacing + 1) % 4;
  attach(cell.next[lFacing].cell, cell.next[rFacing].cell, lFacing, rFacing);
  console.log('done');
}

function makeLoopSimple({ cells }: Input) {
  const cols = groupBy(cells, 'x');
  const rows = groupBy(cells, 'y');
  forEach(cells, (cell) => {
    const col = cols[cell.x];
    const row = rows[cell.y];
    const next = [
      row[findIndex(row, cell) + 1],
      col[findIndex(col, cell) + 1],
      row[findIndex(row, cell) - 1],
      col[findIndex(col, cell) - 1],
    ];
    cell.next = map(next, (position, facing) =>
      position
        ? {
            cell: position,
            facing,
          }
        : null,
    );
  });
}

function wrap({ cells, ...rest }: Input) {
  // Assuming top left is a gap.
  makeLoopSimple({ cells, ...rest }); // Good place to start;
  forEach(cells, (cell) => fold(cell));
  // times(1, () => forEach(filter(cells, isFold), fold));
}

function part2(input: Input) {
  wrap(input);
  return execute(input, { facing: 0, cell: input.cells[0] });
}

solve({ part1, test1: 6032, part2, test2: 5031, parser });
