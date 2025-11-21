import React, { useEffect, useState } from "react";

import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";

interface Work {
  id: string;
  imageUrl: string;
  title: string;
  info?: string;
  date?: string;
  measurements?: string;
  technique?: string;
}

interface PortfolioManagerProps {
  portfolioId: string;
}

const PortfolioManager: React.FC<PortfolioManagerProps> = ({ portfolioId }) => {
  const [works, setWorks] = useState<Work[]>([]);

  // Fetch works from a specific portfolio
  useEffect(() => {
    const fetchWorks = async () => {
      const querySnapshot = await getDocs(
        collection(db, "portfolios", portfolioId, "works")
      );

      setWorks(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          imageUrl: doc.data().image_url,
          title: doc.data().title,
          info: doc.data().info,
          date: doc.data().date,
          measurements: doc.data().measurements,
          technique: doc.data().technique,
        }))
      );
    };

    fetchWorks();
  }, [portfolioId]);

  // Define columns for the DataGrid based on the Work interface
  const columns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 200 },
    { field: "info", headerName: "Info", width: 300 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "measurements", headerName: "Measurements", width: 150 },
    { field: "technique", headerName: "Technique", width: 150 },
  ];

  return (
    <>
      {/* Data Grid for Works */}
      <div style={{ height: 300, width: "100%" }}>
        <DataGrid rows={works} columns={columns} />
      </div>

      {/* New Work Button */}
      <Button variant="contained" color="primary" style={{ marginTop: "20px" }}>
        Add New Work
      </Button>
    </>
  );
};

export default PortfolioManager;
