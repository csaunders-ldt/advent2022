import {
  filter,
  fromPairs,
  keys,
  map,
  mapValues,
  max,
  memoize,
  partial,
  reduce,
  split,
  sum,
  values,
} from 'lodash';
import { join } from 'path';
import { solve } from '../utils';

const types = ['geode', 'obsidean', 'clay', 'ore'] as const;
type Resource = typeof types[number];
type Resources = { [type in Resource]: number };
type Blueprint = { [type in Resource]: Resources };

function parser(input: string) {
  return map(split(input, '\n'), (line) => {
    const costs = map(line.match(/\d+/g), Number);
    const [, ore, clayOre, obsOre, obsClay, geoOre, geoObs] = costs;
    return {
      ore: { ore },
      clay: { ore: clayOre },
      obsidean: { ore: obsOre, clay: obsClay },
      geode: { ore: geoOre, obsidean: geoObs },
    };
  });
}

type State = {
  resources: Resources;
  robots: Resources;
  timeLeft: number;
  blueprint: Blueprint;
  maxCost: Resources;
  lastBuild?: Resource;
};

function timeToEarn(state: State, type: Resource, count: number) {
  if (state.resources[type] >= count) return 0;
  if (state.robots[type] === 0) return 99999;
  return Math.ceil((count - state.resources[type]) / state.robots[type]);
}

function timeToBuildRobot(state: State, robot: keyof Resources, count = 1) {
  const cost = state.blueprint[robot];
  const times = map(keys(cost), (resource: Resource) =>
    timeToEarn(state, resource, cost[resource]),
  );
  // TODO: How to figure this out.
  if (count > 1) {
    return (
      max(times) +
      1 +
      timeToBuildRobot(afterBuilding(state, robot), robot, count - 1)
    );
  }
  return max(times) + 1;
}

function canStart(state: State, type: keyof Resources) {
  const { robots, maxCost, timeLeft } = state;
  if (type === state.lastBuild) return false;
  if (robots[type] >= maxCost[type] && type !== 'geode') return false;
  return timeToBuildRobot(state, type) < timeLeft;
}

function afterBuilding(state: State, type: keyof Resources, n = 1) {
  const buildTime = timeToBuildRobot(state, type, n);
  const timeLeft = state.timeLeft - buildTime;
  const robots = { ...state.robots, [type]: state.robots[type] + n };

  const resources = mapValues(state.resources, (count, resource) => {
    const earned = buildTime * state.robots[resource] * ((n * (n + 1)) / 2);
    return count + earned - (state.blueprint[type][resource] || 0);
  });
  return { ...state, resources, robots, timeLeft, lastBuild: type };
}

function search(state: State): number {
  const { resources, timeLeft, robots } = state;

  let options = filter(types, partial(canStart, state));
  const score = robots.geode * timeLeft + resources.geode;

  if (options.length === 0) return score;

  return max(map(options, (type) => memoSearch(afterBuilding(state, type))));
}

const memoSearch = memoize(search, ({ resources, robots, timeLeft }: State) => {
  return join([...values(resources), ...values(robots), timeLeft].toString());
});

function quality(blueprint: Blueprint, timeLeft = 24) {
  const resources = fromPairs(map(types, (type) => [type, 0])) as Resources;
  const robots = { ...resources, ore: 1 };
  const maxCost = mapValues(resources, (_, type) =>
    max(map(types, (t2) => blueprint[t2][type] || 0)),
  );
  return search({ blueprint, resources, robots, timeLeft, maxCost });
}

function part1(blueprints: Blueprint[]) {
  return sum(map(blueprints, (b, i) => quality(b) * (i + 1)));
}

function part2(blueprints: Blueprint[]) {
  return reduce(
    blueprints.slice(0, 3),
    (score, blueprint) => quality(blueprint, 32) * score,
    1,
  );
}

solve({ part1, test1: 8, part2, test2: 62, parser });
