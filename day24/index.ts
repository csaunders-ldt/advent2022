import {
  countBy,
  filter,
  find,
  flatMap,
  forEach,
  map,
  partial,
  range,
  split,
  uniqBy,
} from 'lodash';
import { solve } from '../utils';

type Point = [x: number, y: number];
type Blizzard = {
  char: '<' | '>' | '^' | 'v';
  position: Point;
};
type Grid = {
  height: number;
  width: number;
  blizzards: Blizzard[];
  hash: Set<string>;
};

type State = [x: number, y: number, time: number];

function hash(blizzards: Blizzard[]) {
  return new Set<string>(map(blizzards, 'position').map(String));
}

function parser(input: string): Grid {
  const blizzards = [];
  forEach(split(input, '\n').slice(1, -1), (line, y) => {
    forEach(split(line, '').slice(1, -1), (char, x) => {
      if (char !== '.') blizzards.push({ char, position: [x, y] });
    });
  });
  const height = countBy(input, (char) => char === '\n').true - 1;
  const width = input.indexOf('\n') - 2;
  return { height, width, blizzards, hash: hash(blizzards) };
}

function wrapTo(height: number, width: number, [x, y]: Point): Point {
  return [((x % width) + width) % width, ((y % height) + height) % height];
}

function getGridAt({ blizzards, height, width }: Grid, time: number): Grid {
  const wrap = partial(wrapTo, height, width);
  const newBlizzards = map(blizzards, ({ position: [x, y], char }) => {
    switch (char) {
      case '<':
        return { char, position: wrap([x - time, y]) };
      case '>':
        return { char, position: wrap([x + time, y]) };
      case '^':
        return { char, position: wrap([x, y - time]) };
      case 'v':
        return { char, position: wrap([x, y + time]) };
    }
  });
  return { height, width, blizzards: newBlizzards, hash: hash(newBlizzards) };
}

function pointsAround([x, y]: Point, height: number, width: number) {
  const opts = flatMap([-1, 1], (d) => [
    [x + d, y],
    [x, y + d],
  ]).concat([[x, y]]);
  return filter(
    opts,
    ([x, y]) =>
      (x >= 0 && y >= 0 && x < width && y < height) ||
      (x === width - 1 && y === height),
  );
}

function getSiblings(
  hashes: Set<String>[],
  width: number,
  height: number,
  [x, y, time]: State,
): State[] {
  const gridHash = hashes[time];
  const candidates = pointsAround([x, y], height, width);
  const points = filter(candidates, (point) => !gridHash.has(String(point)));
  return map(points, ([x, y]) => [x, y, time + 1]);
}

function timeTaken(grid: Grid, states: State[], end: Point, start = 0) {
  const grids = map(range(1000), (time) => getGridAt(grid, time + 1).hash);
  const siblings = partial(getSiblings, grids, grid.width, grid.height);

  for (let time = start; time < 1000; time++) {
    states = uniqBy(flatMap(states, siblings), String);
    if (find(states, ([x, y]) => x == end[0] && y === end[1])) return time + 1;
  }
  throw new Error('Not found');
}

function part1(grid: Grid) {
  return timeTaken(grid, [[0, -1, 0]], [grid.width - 1, grid.height], 0);
}

function part2(grid: Grid) {
  const end: Point = [grid.width - 1, grid.height];
  const there = timeTaken(grid, [[0, -1, 0]], end);
  console.log(there);
  const back = timeTaken(grid, [[...end, 0]], [0, -1], there);
  return timeTaken(grid, [[0, -1, 0]], end, there + back);
}

solve({ part1, test1: 18, part2, test2: 54, parser });
