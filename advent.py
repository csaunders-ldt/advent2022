from glob import glob
from re import match
from importlib import import_module

files = glob('day*/solve.py')
files.sort(key=lambda f: match(r'day(\d+)[\\\/]*solve.py', f).group(1))
print(files)

module = import_module(files[0][:-3].replace('\\', '.').replace('/', '.'))

part1Answer = open(files[0][:-8] + 'solutions.txt').read().splitlines()[-1]
part1 = module.part1(open(files[0][:-8] + 'input.txt').read()[:-1])
assert part1Answer == str(part1), 'Part 1 failed'
print('Part 1 passed')

part2Answer = open(files[-1][:-8] + 'solutions2.txt').read().splitlines()[-1]
part2 = module.part2(open(files[-1][:-8] + 'input.txt').read()[:-1])
assert part2Answer == str(part2), 'Part 2 failed'
print('Part 2 passed')