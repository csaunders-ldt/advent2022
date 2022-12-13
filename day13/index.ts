import { findIndex, isArray, reduce, zip } from 'lodash';
import { getGridParser, solve } from '../utils';

type Tuple = number | Tuple[];

function compare(a?: Tuple, b?: Tuple): number {
  if (!Array.isArray(a) && !Array.isArray(b)) {
    return a === undefined ? -1 : a - (b ?? -1);
  }
  if (isArray(a) && isArray(b)) {
    const firstPair = zip(a, b).find(([a, b]) => compare(a, b));
    return firstPair ? compare(...firstPair) : -compare(a.length, b.length);
  }
  return isArray(a) ? compare(a, [b]) : compare([a], b);
}

function part1(pairs: Tuple[][]) {
  return reduce(
    pairs,
    (acc, [a, b], i) => (compare(a, b) < 0 ? acc + i + 1 : acc),
    0,
  );
}

function part2(pairs: Tuple[][][]) {
  const tuples = [...pairs.flat(1), [[2]], [[6]]].sort(compare);
  return (
    (findIndex(tuples, (t) => t.toString() === '2') + 1) *
    (findIndex(tuples, (t) => t.toString() === '6') + 1)
  );
}

const parser = getGridParser({
  separator: '\n\n',
  rowSeparator: '\n',
  mapFn: (l) => JSON.parse(l),
});
solve({ part1, test1: 13, part2, test2: 140, parser });
