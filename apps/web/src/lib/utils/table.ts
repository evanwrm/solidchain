export const calculateRowBounds = (pageIndex: number, pageSize: number, totalRows: number) => {
    const start = pageIndex * pageSize + 1;
    const end = Math.min(pageIndex * pageSize + pageSize, totalRows);
    return { start, end, total: totalRows };
};
