import { filter, forEach, keys, map, max } from 'lodash';
import { solve } from '../utils';

type Valve = {
  flowRate: number;
  neighbours: string[];
  distanceTo: Record<string, number>;
};
type Valves = Record<string, Valve>;

function distance(from: Valve, to: string, valves: Valves): number {
  let searchSet = from.neighbours;
  let distance = 0;
  while (!searchSet.includes(to)) {
    distance++;
    searchSet = searchSet.flatMap((v) => valves[v].neighbours);
  }
  return distance + 1;
}

function findDistances(valves: Valves) {
  forEach(keys(valves), (name) => {
    const valve = valves[name];
    forEach(keys(valves), (otherName) => {
      if (name === otherName || valves[otherName].flowRate === 0) return;
      valve.distanceTo[otherName] = distance(valve, otherName, valves);
    });
  });
}

function parser(input: string): Valves {
  const valveByName: Valves = input.split('\n').reduce((acc, line) => {
    const [name, ...neighbours] = [...line.match(/[A-Z]{2}/g)];
    const flowRate = +line.match(/\d+/)[0];
    return { ...acc, [name]: { flowRate, neighbours, distanceTo: {} } };
  }, {});
  findDistances(valveByName);
  return valveByName;
}

function bestPath(
  from: Valve,
  valves: Valves,
  timeLeft: number,
  seen?: Set<string>,
): number {
  const options = filter(keys(from.distanceTo), (n) => !seen || !seen.has(n));
  const nearby = filter(options, (n) => from.distanceTo[n] + 1 <= timeLeft);
  const scores = nearby.flatMap((n) => {
    const newSeen = new Set([...(seen ?? []), n]);
    const timeAfter = timeLeft - from.distanceTo[n] - 1;
    const score = valves[n].flowRate * timeAfter;
    return bestPath(valves[n], valves, timeAfter, newSeen) + score;
  });
  return max([...scores, 0]);
}

function part1(valves: Valves) {
  return bestPath(valves['AA'], valves, 30);
}

function getElephantScore(
  youFrom: Valve,
  eleFrom: Valve,
  valves: Valves,
  youTimeLeft: number,
  eleTimeLeft: number,
  seen?: Set<string>,
): number {
  const youOpts = filter(
    keys(youFrom.distanceTo),
    (n) => !seen || !seen.has(n),
  );
  const eleOpts = filter(
    keys(eleFrom.distanceTo),
    (n) => !seen || !seen.has(n),
  );
  const youPaths = filter(
    youOpts,
    (n) => youFrom.distanceTo[n] + 1 <= youTimeLeft,
  );
  const elePaths = filter(
    eleOpts,
    (n) => eleFrom.distanceTo[n] + 1 <= eleTimeLeft,
  );

  const youScores = youPaths.flatMap((n) => {
    const newSeen = new Set([...(seen ?? []), n]);
    const timeAfter = youTimeLeft - youFrom.distanceTo[n] - 1;
    const score = valves[n].flowRate * timeAfter;
    return (
      getElephantScore(
        valves[n],
        eleFrom,
        valves,
        timeAfter,
        eleTimeLeft,
        newSeen,
      ) + score
    );
  });

  const eleScores = elePaths.flatMap((n) => {
    const newSeen = new Set([...(seen ?? []), n]);
    const timeAfter = eleTimeLeft - eleFrom.distanceTo[n] - 1;
    const score = valves[n].flowRate * timeAfter;
    return (
      getElephantScore(
        youFrom,
        valves[n],
        valves,
        youTimeLeft,
        timeAfter,
        newSeen,
      ) + score
    );
  });

  return max([...youScores, ...eleScores, 0]);
}

function part2(valves: Valves) {
  return getElephantScore(valves['AA'], valves['AA'], valves, 26, 26);
}

solve({ part1, test1: 1651, part2, test2: 1707, parser });
