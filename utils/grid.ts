export function printGrid(grid: string[][]) {
  console.log(grid.map((row) => row.join('')).join(''));
}
