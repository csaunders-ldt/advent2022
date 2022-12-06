import { find, identity, range } from 'lodash';
import { solve } from '../utils';

function part1(stream: string) {
  return find(
    range(stream.length),
    (i) => new Set(stream.slice(i - 4, i)).size === 4,
  );
}

function part2(stream: string) {
  return find(
    range(stream.length),
    (i) => new Set(stream.slice(i - 14, i)).size === 14,
  );
}

solve({ part1, test1: 6, part2, parser: identity });
