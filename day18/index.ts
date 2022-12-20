import {
  cloneDeep,
  countBy,
  every,
  filter,
  flatMap,
  forEach,
  keyBy,
  map,
  split,
  sum,
  uniqBy,
} from 'lodash';
import { solve } from '../utils';

type Point = [x: number, y: number, z: number];

function digits(line: string) {
  return map([...line.match(/(-?\d+)/g)], Number);
}

function parser(input: string): Point[] {
  return map(split(input, '\n'), digits) as Point[];
}

function neighbours(axis: Point): Point[] {
  return flatMap(axis, (dim, i) => [
    [...axis.slice(0, i), dim - 1, ...axis.slice(i + 1)],
    [...axis.slice(0, i), dim + 1, ...axis.slice(i + 1)],
  ]) as Point[];
}

function part1(points: Point[]) {
  const names = new Set(map(points, String));
  const exists = (v: Point) => names.has(v.toString());
  const faces = (point: Point) => 6 - filter(neighbours(point), exists).length;
  return sum(map(points, faces));
}

function validNeighbours(point: Point) {
  return filter(neighbours(point), (p) => every(p, (v) => v >= 0 && v <= 25));
}

function floodFill(searchSpace: Set<Point>, seen: Set<string>) {
  if (searchSpace.size === 0) return seen;
  const allNeighbours = flatMap([...searchSpace], validNeighbours);
  const next = uniqBy(
    filter(allNeighbours, (v) => !seen.has(String(v))),
    String,
  );

  return floodFill(new Set(next), new Set(map([...seen, ...next], String)));
}

function part2(points: Point[]) {
  const names = new Set(map(points, String));
  const exists = (v: Point) => names.has(v.toString());
  const faces = (point: Point) => 6 - filter(neighbours(point), exists).length;
  const visiblePoints = floodFill(
    new Set([points[0]]),
    new Set(map(points, String)),
  );
  console.log(visiblePoints);
  return sum(map(visiblePoints, faces));
}

solve({ part1, test1: 66, part2, test2: 58, parser });
