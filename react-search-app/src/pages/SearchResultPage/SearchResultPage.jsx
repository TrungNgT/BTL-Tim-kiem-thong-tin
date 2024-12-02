import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useLocation, useNavigate } from "react-router-dom";
import "./SearchResultPage.css";

const SearchResultPage = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("query") || ""; // Lấy từ khóa từ URL

  const navigate = useNavigate();

  // Hàm fetch kết quả tìm kiếm
  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:5000/api/search?query=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (searchTerm) {
      fetchResults();
    }
  }, [searchTerm]);

  // Xử lý tìm kiếm khi nhấn Enter hoặc click
  const handleSearch = () => {
    if (localSearchTerm.trim()) {
      navigate(`/search-result?query=${encodeURIComponent(localSearchTerm)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* AppBar - Thanh tìm kiếm */}
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="app-logo">
            <a href="/">
              <img src="/image.png" alt="app_logo" width="50" height="50" />
            </a>
          </IconButton>

          <TextField
            variant="outlined"
            placeholder="Type to search..."
            spellCheck="false"
            size="small"
            sx={{ ml: 2, flex: 1, background: "white", borderRadius: 1 }}
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <IconButton color="inherit" onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Nội dung kết quả */}
      <Box sx={{ padding: 2 }} className="search-results-container">
        <Typography variant="h5" gutterBottom>
          Search results for <strong><em>"{searchTerm}"</em></strong>
        </Typography>
        {isLoading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">Error: {error}</Typography>
        ) : results.length === 0 ? (
          <Typography>No results found for "{searchTerm}".</Typography>
        ) : (
          <Box className="results-container">
          {results.map((result, index) => (
            <Card className="result-card" key={index} variant="outlined">
              <CardContent>
                  <Typography className="result-title" variant="h6">
                      <a
                          href={result.link}
                          target="_blank"
                          rel="noopener noreferrer"
                      >
                          {result.title}
                      </a>
                  </Typography>
                  {/* New Link Section */}
                  <Typography className="result-link">
                      <a
                          href={result.link}
                          target="_blank"
                          rel="noopener noreferrer"
                      >
                          {result.link}
                      </a>
                  </Typography>
                  <Typography className="result-description" variant="body2">
                      {result.description}
                  </Typography>
                  <Typography className="result-content" variant="body2">
                      {result.content}
                  </Typography>
              </CardContent>
          </Card>

          ))}
      </Box>
      
        )}
      </Box>
    </Box>
  );
};

export default SearchResultPage;
