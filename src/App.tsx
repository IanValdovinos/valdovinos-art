import { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useAtom } from "jotai";
import { logInDialogAtom } from "./atoms/logInDialogAtom";

import Home from "./pages/Home";
import About from "./pages/About";
import Documents from "./pages/Documents";
import AdminDashboard from "./pages/AdminDashboard";

import LogInDialog from "./components/LogInDialog";
import Header from "./components/Header";
import PortfolioList from "./components/PortfolioList";
import Portfolio from "./components/Portfolio";

function App() {
  const [logInDialogOpen, setLogInDialogOpen] = useAtom(logInDialogAtom);

  const handleLogInClose = () => {
    setLogInDialogOpen(false);
  };

  // Add global keyboard shortcut for opening the Log In dialog
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd+L (Mac) or Ctrl+L (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "l") {
        event.preventDefault(); // Prevent default browser behavior
        setLogInDialogOpen(true);
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setLogInDialogOpen]);

  return (
    <Router>
      <div className="app">
        <LogInDialog open={logInDialogOpen} onClose={handleLogInClose} />

        <Routes>
          {/* Admin route without Header */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* All other routes with Header */}
          <Route
            path="*"
            element={
              <>
                <Header />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />}>
                      <Route index element={<PortfolioList />} />
                      <Route path="/portfolio/:pid" element={<Portfolio />} />
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
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
