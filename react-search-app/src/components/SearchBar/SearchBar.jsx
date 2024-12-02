import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import "./SearchBar.css";

export const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");
  const navigate = useNavigate(); // Khởi tạo navigate

  const fetchData = (value) => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((json) => {
        const results = json.filter((user) => {
          return (
            value &&
            user &&
            user.name &&
            user.name.toLowerCase().includes(value.toLowerCase())
          );
        });
        setResults(results);
      });
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  const handleSearch = () => {
    // Điều hướng đến trang SearchResultPage và truyền từ khóa tìm kiếm qua query param
    navigate(`/search-result?query=${input}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Nhấn Enter để tìm kiếm
    }
  };

  return (
    <div className="input-wrapper">
      <input
        placeholder="Type to search..."
        spellCheck="false"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        onKeyPress={handleKeyPress} // Xử lý sự kiện nhấn phím Enter
      />
      <FaSearch id="search-icon" onClick={handleSearch} /> {/* Click vào biểu tượng tìm kiếm */}
    </div>
  );
};
