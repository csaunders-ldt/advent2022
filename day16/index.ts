import { filter, forEach, map, max, times, values } from 'lodash';
import { solve } from '../utils';

type Valve = {
  name: string;
  flowRate: number;
  neighbours: Valve[];
};

function parser(input: string): Record<string, Valve> {
  const valveByName: Record<string, Valve> = {};
  input.split('\n').forEach((line) => {
    const [name, ...neighbourNames] = [...line.match(/[A-Z]{2}/g)];
    const flowRate = +line.match(/\d+/)[0];
    const possibleNeighbours = map(neighbourNames, (n) => valveByName[n]);
    const neighbours = filter(possibleNeighbours, (n) => !!n);
    const valve = { name, flowRate, neighbours };
    valveByName[name] = valve;
    forEach(neighbours, (neighbour) => neighbour?.neighbours.push(valve));
  });
  return valveByName;
}

type State = {
  position: Valve;
  activeValves: Valve[];
  flowRate: number;
};

function hashState({ activeValves, position }: State): string {
  return `${activeValves.map((v) => v.name).sort()}${position.name}`;
}

function nextFlowRate({ flowRate, activeValves }: State) {
  return flowRate + activeValves.reduce((acc, v) => acc + v.flowRate, 0);
}

function nextState(state: State) {
  return { ...state, flowRate: nextFlowRate(state) };
}

function moves(state: State): State[] {
  const { position, activeValves } = state;
  const next = nextState(state);
  const options = position.neighbours.map((v) => ({ ...next, position: v }));
  if (!activeValves.includes(position) && position.flowRate > 0) {
    options.push({ ...next, activeValves: [...activeValves, position] });
  }
  return options;
}

function part1(valves: Record<string, Valve>) {
  const position = valves['AA'];
  const state: State = { position, activeValves: [], flowRate: 0 };
  let states = [state];
  times(30, (i) => {
    const bestState: Record<string, State> = {};
    states = states.flatMap(moves);
    forEach(states, (s) => {
      const hash = hashState(s);
      if (s.flowRate === 0 && i > 8) return;
      if (!bestState[hash] || bestState[hash].flowRate < s.flowRate) {
        bestState[hash] = s;
      }
    });
    states = values(bestState);
  });
  return max(map(states, (s) => s.flowRate));
}

function part2(valves: Record<string, Valve>) {
  return 'part2';
}

solve({ part1, test1: 1651, part2, parser });
