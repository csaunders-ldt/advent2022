import { readFileSync, existsSync, appendFile, writeFileSync } from 'fs';
import { config } from 'dotenv';
import { dirname } from 'path';
import caller from 'caller';
config();

type SolveArgs<T> = {
  part1: (input: T) => { toString: () => string } | undefined;
  part2: (input: T) => { toString: () => string } | undefined;
  test1?: string;
  test2?: string;
  parser: (input: string) => T;
};

export async function solve<T = string[]>({
  part1,
  test1,
  part2,
  test2,
  parser,
}: SolveArgs<T>) {
  const dir = dirname(caller());
  const day = dir.replace(/.*day/, '');

  const part1Solved = existsSync(`${dir}/input2.txt`);
  const part = part1Solved ? 2 : 1;

  const [solver, file, solutionsFile, test, testFile] = part1Solved
    ? [part2, 'input2.txt', 'solutions2.txt', test2, 'test2.txt']
    : [part1, 'input.txt', 'solutions.txt', test1, 'test.txt'];

  if (test) {
    const testInput = parser(
      readFileSync(`${dir}/${testFile}`, 'utf8').replace(/\n$/, ''),
    );
    const testOutput = solver(testInput)?.toString();
    if (testOutput !== test) {
      console.error(
        `Test failed for day ${day} part ${part}: expected ${test}, got ${testOutput}`,
      );
      process.exit(1);
    }
    console.log(`Test passed for day ${day}`);
  }

  const fileName = `${dir}/${file}`;
  const input = parser(readFileSync(fileName, 'utf8').replace(/\n$/, ''));
  const answer = solver(input)?.toString();
  console.log(`Attempting ${answer}`);
  const solutions = readFileSync(`${dir}/${solutionsFile}`, 'utf8').split('\n');
  if (solutions.includes(answer || '')) {
    console.log('Solution already attempted!');
    return;
  }
  appendFile(`${dir}/${solutionsFile}`, `${answer}\n`, () => {});
  const result = await fetch(
    `https://adventofcode.com/2022/day/${day}/answer`,
    {
      method: 'POST',
      headers: {
        cookie: `session=${process.env.SESSION}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `level=${part}&answer=${answer}`,
    },
  );
  const body = await result.text();
  if (body.includes('not the right answer')) {
    console.log('Wrong answer!');
  } else {
    console.log('Correct answer!');
    if (part === 2) return;

    writeFileSync(`${dir}/solutions2.txt`, '');
    fetch(`https://adventofcode.com/2022/day/${day}/input`, {
      headers: {
        cookie: `session=${process.env.SESSION}`,
      },
    })
      .then((res) => res.text())
      .then((text) => writeFileSync(`${dir}/input2.txt`, text));
  }
}
