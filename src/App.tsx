import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Documents from "./pages/Documents";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/documents" element={<Documents />} />
            <Route
              path="/skills"
              element={<div>Skills Page - Coming Soon</div>}
            />
            <Route
              path="/socials"
              element={<div>Socials Page - Coming Soon</div>}
            />
            <Route
              path="/contact"
              element={<div>Contact Page - Coming Soon</div>}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
