import React from 'react'

const useTableSorting = (initialField = "", initialOrder = "asc") => {
  const [sortField, setSortField] = React.useState(initialField);
  const [sortOrder, setSortOrder] = React.useState(initialOrder);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortField(field);
    setSortOrder(isAsc ? "desc" : "asc");
  };

  return { sortField, sortOrder, handleSort };
};

export default useTableSorting;