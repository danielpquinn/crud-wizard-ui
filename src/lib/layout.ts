
export const getNumColumns = (containerWidth: number, maxItemWidth: number, numItems: number): number => {
  const maxColumns = Math.floor(containerWidth / maxItemWidth);
  let columns = maxColumns;
  let minRows = Infinity;

  for (let i = maxColumns; i > 0; i -= 1) {
    const rows = Math.ceil(numItems / i);
    if (rows <= minRows) {
      minRows = rows;
      columns = i;
    }
  }

  return columns;
};
