import React from 'react'

const useSearch = () => {
  const [searchValue, setSearchValue] = React.useState("");

  const onSearch = (event) => {
    const value = event.target.value;
    setSearchValue(value);
  };

  return { searchValue, onSearch };
};

export default useSearch;