import React from "react";

const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = React.useState(initialPage);
  const [limit, setLimit] = React.useState(initialLimit);
  const handlePageChange = (newPage) => setPage(newPage);
  const handleLimitChange = (newLimit) => setLimit(newLimit);
  return {
    page,
    limit,
    setPage,
    setLimit,
    handlePageChange,
    handleLimitChange,
  };
};

export default usePagination;