import { flatten, forEach, map, max, min, range, repeat, split } from 'lodash';
import { parseLines, solve } from '../utils';

type Direction = 'U' | 'D' | 'L' | 'R';
type Position = [number, number];

function parser(input: string) {
  return flatten(
    map(split(input, /\r?\n/), (l) => {
      const [dir, count] = split(l, ' ');
      return map(range(+count), () => dir);
    }),
  );
}

const moves: Record<Direction, Position> = {
  U: [0, 1],
  L: [-1, 0],
  R: [1, 0],
  D: [0, -1],
};

function sumPositions(a: Position, b: Position): Position {
  return [a[0] + b[0], a[1] + b[1]];
}

function getTail(head: Position, tail: Position): Position {
  const diff = [head[0] - tail[0], head[1] - tail[1]];
  const absDiff = [Math.abs(diff[0]), Math.abs(diff[1])];
  if (absDiff[0] <= 1 && absDiff[1] <= 1) {
    return tail;
  }
  if (diff[0] + diff[1] === 4) {
    return [tail[0] + diff[0] / 2, tail[1] + diff[1] / 2];
  }
  if (absDiff[0] === 2) {
    return [tail[0] + diff[0] / 2, head[1]];
  }

  return [head[0], tail[1] + diff[1] / 2];
}

function part1(input: Direction[]) {
  let head: Position = [0, 0];
  let tail: Position = [0, 0];
  const seen = new Set<string>();
  forEach(input, (dir) => {
    head = sumPositions(head, moves[dir]);
    tail = getTail(head, tail);
    seen.add(tail.toString());
  });
  return seen.size;
}

function part2(input: Direction[]) {
  let bits = map(range(10), () => [0, 0] as Position);
  const seen = new Set<string>();
  forEach(input, (dir) => {
    bits[0] = sumPositions(bits[0], moves[dir]);
    forEach(range(9), (i) => (bits[i + 1] = getTail(bits[i], bits[i + 1])));
    seen.add(bits[9].toString());
  });
  return seen.size;
}

solve({ part1, test1: 13, part2, test2: 36, parser });
