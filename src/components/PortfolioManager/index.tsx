import React, { useEffect, useState } from "react";

import { db } from "../../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const handleDeletePortfolio = () => {
    // Implement portfolio deletion logic here
    alert("Portfolio deleted successfully!");
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Button
        sx={{ mt: 2 }}
        variant="outlined"
        color="error"
        style={{ marginBottom: 20 }}
        onClick={() => setDeleteDialogOpen(true)}
      >
        Delete Portfolio
      </Button>

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

      {/* Delete Portfolio Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen} // Replace with state to control dialog visibility
        onClose={() => setDeleteDialogOpen(false)} // Replace with handler to close dialog
      >
        <DialogTitle>Delete "{portfolioId}"</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{portfolioId}"? This action cannot
            be undone. All art works within this portfolio will also be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeletePortfolio}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PortfolioManager;
