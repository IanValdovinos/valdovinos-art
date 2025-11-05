import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Documents from "./pages/Documents";
import "./App.css";
import PortfolioList from "./components/PortfolioList";

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />}>
              <Route index element={<PortfolioList />} />
            </Route>

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
