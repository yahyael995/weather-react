// src/components/SearchBar.jsx
import React from 'react';

const SearchBar = ({ city, onCityChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={city}
        onChange={(e) => onCityChange(e.target.value)}
        placeholder="Search for a city..."
      />
    </div>
  );
};

export default SearchBar;
