export const getProgressPercent = (done: number, total: number) => {
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
};
