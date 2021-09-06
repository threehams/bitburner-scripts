export const makeTable = (table: string[][]) => {
  const lengths: number[] = [];
  for (const row of table) {
    for (const [index, col] of row.entries()) {
      if (index === row.length - 1) {
        continue;
      }
      lengths[index] = Math.max(lengths[index] ?? 0, col.length);
    }
  }

  return table.map((row) => {
    return row
      .map((col, index) => {
        return col.padStart(lengths[index], " ");
      })
      .join("  ");
  });
};
