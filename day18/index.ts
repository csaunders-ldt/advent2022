import {
  cloneDeep,
  every,
  filter,
  flatMap,
  forEach,
  keyBy,
  map,
  split,
  sum,
} from 'lodash';
import { solve } from '../utils';

type Point = [x: number, y: number, z: number];

function parser(input: string): Point[] {
  return map(split(input, '\n'), (line) =>
    map([...line.match(/(-?\d+)/g)], Number),
  ) as Point[];
}
function neighbours(axis: Point): Point[] {
  return flatMap(axis, (dim, i) => [
    [...axis].splice(1, i, dim - 1),
    [...axis].splice(1, i, dim + 1),
  ]) as Point[];
}

function part1(points: Point[]) {
  const names = new Set(map(points, String));
  const byString = keyBy(points, String);
  const shared = filter(flatMap(points, neighbours), (v) =>
    names.has(v.toString()),
  );

  const withNeighbours = map(points, (point) => ({ point, neighbours: [] }));
  forEach(withNeighbours, (point) => {
    forEach(neighbours(point.point), (neighbour) => {
      const neighbourPoint = byString[neighbour.toString()];
      if (neighbourPoint) {
        point.neighbours.push(neighbour);
      }
    });
  });
  const score = map(withNeighbours, (point) => 6 - point.neighbours.length);

  return sum(score);
}

function part2(points: Point[]) {
  const withNeighbours = map(points, (point) => ({ point, neighbours: [] }));
  const byString = keyBy(withNeighbours, (v) => v.point.toString());

  forEach(withNeighbours, (point) => {
    forEach(neighbours(point.point), (neighbour) => {
      const neighbourPoint = byString[neighbour.toString()];
      if (neighbourPoint) {
        point.neighbours.push(neighbour);
      }
    });
  });

  const seen = new Set<string>();
  const seenCubes = new Set<string>();
  const todo: Point[] = [[-1, -1, -1]];
  while (todo.length) {
    const point = todo.pop()!;
    const pointString = point.toString();
    console.log(`Flooding at ${pointString}`);
    if (seen.has(pointString)) continue;
    seen.add(pointString);
    forEach(neighbours(point), (neighbour) => {
      if (every(neighbour, (n) => n < 26 && n >= -1)) {
        if (byString[neighbour.toString()]) {
          seenCubes.add(neighbour.toString());
        } else if (!seen.has(neighbour.toString())) {
          todo.push(neighbour);
        }
      }
    });
  }

  console.log({
    seen: seen.size,
    seenCubes: seenCubes.size,
    points: points.length,
  });
  console.log(seenCubes.size - points.length);
  return part1(points) - 6 * (points.length - seenCubes.size);
  const unseen = seenCubes.size - points.length;

  const score = map(withNeighbours, (point) => 6 - point.neighbours.length);
  console.log(sum(score));

  return sum(score) - 6 * unseen;
}

solve({ part1, test1: 64, part2, test2: 58, parser });
