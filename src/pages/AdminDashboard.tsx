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
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

import PortfolioManager from "../components/PortfolioManager";

interface Portfolio {
  id: string;
  imageUrl: string;
  title: string;
}

const AdminDashboard = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    null
  );
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

      if (querySnapshot.docs.length > 0) {
        setSelectedPortfolio({
          id: querySnapshot.docs[0].id,
          imageUrl: querySnapshot.docs[0].data().image_url,
          title: querySnapshot.docs[0].data().title,
        });
      }
    };

    fetchPortfolios();
  }, []);

  // Handle portfolio selection
  const handlePortfolioChange = (event: SelectChangeEvent) => {
    const selectedId = event.target.value;
    const portfolio = portfolios.find((p) => p.id === selectedId);
    setSelectedPortfolio(portfolio || null);
  };

  return (
    <div className={styles.adminDashboard}>
      {/* Header */}
      <Typography variant="h3">Admin Dashboard</Typography>
      <Button onClick={() => navigate("/")} variant="contained">
        Home
      </Button>

      {/* Portfolio Selection */}
      <Box sx={{ mt: 4 }}>
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
      </Box>

      {/* Portfolio Manager */}
      {selectedPortfolio && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4">{selectedPortfolio.title}</Typography>
          <PortfolioManager portfolioId={selectedPortfolio.id} />
        </Box>
      )}
    </div>
  );
};

export default AdminDashboard;
