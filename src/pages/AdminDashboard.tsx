import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";

import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

import {
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import type { SnackbarCloseReason } from "@mui/material/Snackbar";
import type { SelectChangeEvent } from "@mui/material";

import PortfolioManager from "../components/PortfolioManager";
import PortfolioDialog from "../components/PortfolioDialog";

export interface Portfolio {
  id: string;
  imageUrl: string;
  title: string;
}

const AdminDashboard = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const navigate = useNavigate();

  // Fetch portfolios from Firestore
  useEffect(() => {
    const fetchPortfolios = async () => {
      const querySnapshot = await getDocs(collection(db, "portfolios"));

      setPortfolios(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          imageUrl: doc.data().image_url,
          title: doc.data().title,
        }))
      );
    };

    fetchPortfolios();
  }, []);

  // Handle portfolio selection
  const handlePortfolioChange = (event: SelectChangeEvent) => {
    const selectedId = event.target.value;
    const portfolio = portfolios.find((p) => p.id === selectedId);
    setSelectedPortfolio(portfolio || null);
  };

  const handleSnackbarClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleDialogSave = (newPortfolio: Portfolio) => {
    setPortfolios((prevPortfolios) => [...prevPortfolios, newPortfolio]);
    setSelectedPortfolio(newPortfolio);
    setSnackbarMessage("Portfolio created successfully!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    setDialogOpen(false);
  };

  const handlePortfolioDeleted = (deletedPortfolioId: string) => {
    setPortfolios((prevPortfolios) =>
      prevPortfolios.filter((p) => p.id !== deletedPortfolioId)
    );
    if (selectedPortfolio?.id === deletedPortfolioId) {
      setSelectedPortfolio(null);
    }
    setSnackbarMessage("Portfolio deleted successfully!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  return (
    <div className={styles.adminDashboard}>
      {/* Header */}
      <Typography variant="h3">Admin Dashboard</Typography>
      <Button onClick={() => navigate("/")}>Home</Button>

      {/* Portfolio Selection */}
      <Box sx={{ mt: 4, display: "flex", gap: 2, alignItems: "center" }}>
        <FormControl>
          <InputLabel id="portfolio-select-label">Portfolio</InputLabel>
          <Select
            labelId="portfolio-select-label"
            id="portfolio-select"
            value={selectedPortfolio ? selectedPortfolio.id : ""}
            label="Portfolio"
            onChange={handlePortfolioChange}
            sx={{ minWidth: 300 }}
          >
            {portfolios.map((portfolio) => (
              <MenuItem key={portfolio.id} value={portfolio.id}>
                {portfolio.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={() => setDialogOpen(true)}>
          New Portfolio
        </Button>
      </Box>

      {/* Portfolio Manager */}
      {selectedPortfolio && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4">{selectedPortfolio.title}</Typography>
          <PortfolioManager
            portfolioId={selectedPortfolio.id}
            onPortfolioDeleted={handlePortfolioDeleted}
          />
        </Box>
      )}

      {/* Portfolio Dialog */}
      <PortfolioDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleDialogSave}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminDashboard;
