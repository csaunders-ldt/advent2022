import { map, max, slice, sortBy, sum } from 'lodash';
import { parseLines } from '../utils/parse';
import { solve } from '../utils/solve';

function sumElf(elf: string) {
  return sum(elf.split('\n').map(Number));
}

function part1(elves: string[]) {
  return max(map(elves, sumElf));
}

function part2(elves: string[]) {
  const sortedElves = sortBy(map(elves, sumElf));
  return sum(slice(sortedElves, -3));
}

solve({ part1, part2, parser: parseLines({ separator: '\n\n' }) });
