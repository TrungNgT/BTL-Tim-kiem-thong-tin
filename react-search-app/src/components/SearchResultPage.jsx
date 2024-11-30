import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, CircularProgress, AppBar, Toolbar, IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"; // Icon tìm kiếm
import AppLogo from "./AppLogo"; // Giả sử AppLogo là component icon của bạn

const SearchResultPage = ({ searchTerm, onSearch }) => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/search?query=${searchTerm}`);
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

  const handleSearch = () => {
    if (onSearch) {
      onSearch(localSearchTerm); // Gửi giá trị tìm kiếm về component cha
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* AppBar: Thanh tìm kiếm */}
      <AppBar position="sticky" color="primary">
        <Toolbar>
          {/* App Icon */}
          <IconButton edge="start" color="inherit" aria-label="app-logo">
          <img src="/image.png" alt="heart_icon" width="50" height="50"/> {/* Component chứa logo của bạn */}
          </IconButton>
          
          {/* Search Bar */}
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            sx={{ ml: 2, flex: 1, background: "white", borderRadius: 1 }}
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
          />
          <IconButton color="inherit" onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Nội dung kết quả tìm kiếm */}
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Search Results for "{searchTerm}"
        </Typography>
        {isLoading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">Error: {error}</Typography>
        ) : results.length === 0 ? (
          <Typography>No results found for "{searchTerm}".</Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {results.map((result, index) => (
              <Card key={index} variant="outlined">
                <CardContent>
                  <Typography variant="h6">{result.title}</Typography>
                  <Typography>{result.description}</Typography>
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
