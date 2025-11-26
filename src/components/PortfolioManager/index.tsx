import React, { useEffect, useState } from "react";

import { db } from "../../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";

// Import components
import WorkItemDialog from "../WorkItemDialog";

interface PortfolioManagerProps {
  portfolioId: string;
}

const PortfolioManager: React.FC<PortfolioManagerProps> = ({ portfolioId }) => {
  const [works, setWorks] = useState<Record<string, string>[]>([]);
  const [parameters, setParameters] = useState<string[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch work data from Firestore
  useEffect(() => {
    const fetchWorks = async () => {
      // Fetch work parameters
      const portfolioSnapshot = await getDoc(
        doc(db, "portfolios", portfolioId)
      );
      const parameters = portfolioSnapshot.data()?.parameters;
      setParameters(parameters);
      setColumns(
        parameters.map((param: string) => ({
          field: param,
          headerName: param.charAt(0).toUpperCase() + param.slice(1),
          width: 150,
        }))
      );

      // Fetch works in the selected portfolio
      const worksSnapshot = await getDocs(
        collection(db, "portfolios", portfolioId, "works")
      );

      // Extract the values in the parameters constant for each work
      const worksData = worksSnapshot.docs.map((doc) => {
        const data = doc.data();
        const workEntry: Record<string, string> = {
          id: doc.id,
          image_url: data.image_url,
        };
        parameters.forEach((param: string) => {
          workEntry[param] = data[param] || "";
        });
        return workEntry;
      });

      setWorks(worksData);
    };

    fetchWorks();
  }, [portfolioId]);

  const handleWorkAdded = () => {
    alert("Work item added successfully!");
    setDialogOpen(false);
  };

  return (
    <>
      {/* Data Grid for Works */}
      <div style={{ height: 300, width: "100%" }}>
        <DataGrid rows={works} columns={columns} />
      </div>

      {/* New Work Button */}
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "20px" }}
        onClick={() => setDialogOpen(true)}
      >
        Add New Work
      </Button>

      {/* Work Item Dialog */}
      <WorkItemDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onWorkAdded={handleWorkAdded}
        parameters={parameters}
      />
    </>
  );
};

export default PortfolioManager;
