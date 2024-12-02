import { useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from "./pages/MainPage/MainPage";
import SearchResultPage from "./pages/SearchResultPage/SearchResultPage"
import "./App.css";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/search-result" element={<SearchResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
