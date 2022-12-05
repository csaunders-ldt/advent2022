import { filter, forEach, join, map, reverse, split, times, zip } from 'lodash';
import { solve } from '../utils';

type Input = {
  columns: string[][];
  moves: {
    count: number;
    from: number;
    to: number;
  }[];
};

function parser(input: string) {
  const [table, instructions] = split(input, '\n\n');
  const grid = map(split(table, '\n'), (l) => split(l, ''));
  const lines = filter(zip(...grid), (_, i) => i % 4 == 1);
  const columns = map(lines, (line) =>
    filter(reverse(line).slice(1), (v) => v !== ' '),
  );

  const moves = map(split(instructions, '\n'), (line) => {
    const [count, from, to] = map(line.match(/\d+/g), Number);
    return { count, from, to };
  });
  return { columns, moves };
}

function part1({ columns, moves }: Input) {
  forEach(moves, ({ count, from, to }) => {
    times(count, () => {
      columns[to - 1].push(columns[from - 1].pop());
    });
  });
  return join(
    columns.map((c) => c.pop()),
    '',
  );
}

function part2({ columns, moves }: Input) {
  forEach(moves, ({ count, from, to }) => {
    const moved = [];
    times(count, () => {
      moved.unshift(columns[from - 1].pop());
    });
    columns[to - 1] = columns[to - 1].concat(moved);
  });
  return join(
    columns.map((c) => c.pop()),
    '',
  );
}

solve({ part1, test1: 'CMZ', part2, test2: 'MCD', parser });
