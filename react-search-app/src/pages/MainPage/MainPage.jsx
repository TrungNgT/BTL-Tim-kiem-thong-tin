import { useState } from "react";

import "./MainPage.css";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { SearchResultsList } from "../../components/SearchResultsList/SearchResultsList";

function MainPage() {
  const [results, setResults] = useState([]);

  return (
    <div className="MainPage">
      <div className="search-bar-container">
        
        <h1><span><img src="/image.png" alt="heart_icon" width="50" height="50"/></span> Thông tin sức khỏe</h1>
        <SearchBar setResults={setResults} />
        {results && results.length > 0 && <SearchResultsList results={results} />}
      </div>
    </div>
  );
}

export default MainPage;