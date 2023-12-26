import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MainPage from "./MainPage"; // Import your new MainPage component
import Heatmap from "./Heatmap";
// Import other components if necessary

function App() {
  return (
    <Router basename="/covid-tracker">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/heatmap" element={<Heatmap />} />
        {/* Define other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
