import { sumBy } from 'lodash';
import { solve } from '../utils/solve';

function parser(input: string): [number, number][] {
  return input
    .replace(/[AX]/g, '1')
    .replace(/[BY]/g, '2')
    .replace(/[CZ]/g, '3')
    .split('\n')
    .slice(0, -1)
    .map((l) => l.split(' ').map(Number) as [number, number]);
}

function getRoundScore(them: number, you: number): number {
  if (you === them) return 3;
  if (you - them === 1 || you - them === -2) {
    return 6;
  }
  return 0;
}

function part1(lines: [number, number][]) {
  return sumBy(lines, ([them, you]) => getRoundScore(them, you) + you);
}

function getTargetShape(them: number, expectedResult: number): number {
  if (expectedResult === 2) return them;
  if (expectedResult === 1) return ((them + 1) % 3) + 1;
  return (them % 3) + 1;
}

function part2(lines: [number, number][]) {
  return sumBy(lines, ([them, expected]) => {
    const you = getTargetShape(them, expected);
    return getRoundScore(them, you) + you;
  });
}

solve({ part1, test1: '15', part2, test2: '12', parser });
