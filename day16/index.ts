import {
  cloneDeep,
  filter,
  forEach,
  join,
  keys,
  map,
  max,
  memoize,
  reverse,
  sortBy,
} from 'lodash';
import { solve } from '../utils';

type Valve = {
  name: string;
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
    forEach(keys(valves), (to) => {
      if (name === to || valves[to].flowRate === 0) return;
      valves[name].distanceTo[to] = distance(valves[name], to, valves);
    });
  });
}

function parser(input: string): Valves {
  const valveByName: Valves = input.split('\n').reduce((acc, line) => {
    const [name, ...neighbours] = [...line.match(/[A-Z]{2}/g)];
    const flowRate = +line.match(/\d+/)[0];
    return { ...acc, [name]: { flowRate, neighbours, distanceTo: {}, name } };
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

type Player = {
  at: Valve;
  timeLeft: number;
};

function getElephantScore(
  players: [Player, Player],
  valves: Valves,
  seen?: Set<string>,
): number {
  const [{ at, timeLeft }] = players;
  let opts = filter(keys(at.distanceTo), (n) => !seen || !seen.has(n));
  let paths = filter(opts, (n) => at.distanceTo[n] + 1 <= timeLeft);
  const heuristic = (n: string) => valves[n].flowRate / at.distanceTo[n];
  paths = paths.sort((a, b) => heuristic(b) - heuristic(a)).slice(0, 5);

  const scores = paths.flatMap((n) => {
    const newSeen = new Set([...(seen ?? []), n]);
    const timeAfter = timeLeft - at.distanceTo[n] - 1;
    const score = valves[n].flowRate * timeAfter;
    const p2 = { at: valves[n], timeLeft: timeAfter };
    return getElephantScore([players[1], p2], valves, newSeen) + score;
  });

  return max([...scores, 0]);
}

function part2(valves: Valves) {
  const player = { at: valves['AA'], timeLeft: 26 };
  return getElephantScore([player, cloneDeep(player)], valves);
}

solve({ part1, test1: 1651, part2, test2: 1707, parser });
