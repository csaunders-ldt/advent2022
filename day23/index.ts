import { filter, flatMap, map, split } from 'lodash';
import { solve } from '../utils';

type Point = [x: number, y: number];
type State = {
  grid: string[][];
  elves: Point[];
};

function parser(input: string) {
  const grid = map(split(input, '\n'), (l) => split(l, ''));
  const maybeElves = flatMap(grid, (row, y) =>
    map(row, (cell, x) => (cell === '#' ? [x, y] : undefined)),
  );
  const elves = filter(maybeElves, (e) => e !== undefined);
  return { grid, elves };
}

function part1(state: State) {
  return 'part1';
}

function part2(state: State) {
  return 'part2';
}

solve({ part1, part2, parser });
