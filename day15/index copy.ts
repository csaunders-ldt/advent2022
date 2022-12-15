import { map, reduce, split, sum } from 'lodash';
import { parseLines, solve } from '../utils';

type Position = [x: number, y: number];
type Beacon = { location: Position; width: number };

function manhattanDistance([x1, y1]: Position, [x2, y2]: Position) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function parser(input: string): Beacon[] {
  return map(split(input, '\n'), (line) => {
    const [x, y, closeX, closeY] = [...line.match(/\d+/g)].map(Number);
    const width = manhattanDistance([x, y], [closeX, closeY]);
    return { location: [x, y], width };
  });
}

function scannerSize({ width }: Beacon) {
  return (width / 2) * (width + 1) * 4; // Add one for center, subtract one for beacon
}

function overlapSize(
  { location: [x, y], width }: Beacon,
  { location: [x2, y2], width: w2 }: Beacon,
): number {
  const widthOverlap = Math.max(
    0,
    Math.min(x + width, x2 + w2) - Math.max(x, x2),
  );
  const heightOverlap = Math.max(
    0,
    Math.min(y + width, y2 + w2) - Math.max(y, y2),
  );
  return widthOverlap * heightOverlap;
}

function part1(beacons: Beacon[]) {
  return reduce(
    beacons,
    (totalTiles, beacon) => {
      const overlaps = map(beacons, (b) => overlapSize(beacon, b));
      console.log(scannerSize(beacon));
      return totalTiles + scannerSize(beacon) * 2 - sum(overlaps);
    },
    0,
  );
}

function part2(beacons: Beacon[]) {
  return 'part2';
}

solve({ part1, test1: 26, part2, parser });
