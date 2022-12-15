import { filter, flatten, map, reduce, sortBy, split } from 'lodash';
import { solve } from '../utils';

type Position = [x: number, y: number];
type Sensor = [startX: number, endX: number];
type Data = { sensors: Sensor[]; beaconCount: number };

function manhattanDistance([x1, y1]: Position, [x2, y2]: Position) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function parser(input: string): Data {
  const targetY = input.split('\n').length < 100 ? 10 : 2000000;
  const beacons = new Set<string>();
  const maybeSensors = map(split(input, '\n'), (line) => {
    const [x, y, beaconX, beaconY] = [...line.match(/\d+/g)].map(Number);
    if (beaconY === targetY) beacons.add(`${beaconX},${beaconY}`);
    const width = manhattanDistance([x, y], [beaconX, beaconY]);
    const diff = width - Math.abs(y - targetY);
    return diff > 0 ? [x - diff, x + diff] : undefined;
  });
  const sensors = filter(maybeSensors, (b) => b !== undefined) as Sensor[];
  return { sensors, beaconCount: beacons.size };
}

function netflix(sensors: Sensor[]) {
  const points = map(sensors, ([startX, endX]) => [
    { pos: startX, isStart: true },
    { pos: endX, isStart: false },
  ]);
  const sortedPoints = sortBy(flatten(points), [
    ({ pos }) => pos,
    ({ isStart }) => (isStart ? 1 : -1),
  ]);
  console.log(sortedPoints);
  return reduce(
    sortedPoints,
    ({ count, active, lastPos }, { pos, isStart }) => {
      if (isStart && active === 0) {
        console.log(lastPos);
        lastPos = pos;
      }
      if (!isStart && active === 0) {
        count += pos - lastPos;
      }
      return { lastPos, count, active };
    },
    { count: 0, active: 0, lastPos: 0 },
  ).count;
}

function part1({ sensors, beaconCount }: Data) {
  console.log(sensors);
  return netflix(sensors);
}

function part2({ sensors, beaconCount }: Data) {
  return 'part2';
}

solve({ part1, test1: 26, part2, parser });
