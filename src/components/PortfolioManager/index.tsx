import React, { useEffect, useState } from "react";

import { storage } from "../../firebase";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import type { SnackbarCloseReason } from "@mui/material/Snackbar";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";

// Import utilities
import { compressImage } from "../../utils/image_utils";

// Import components
import WorkItemDialog from "../WorkItemDialog";

interface PortfolioManagerProps {
  portfolioId: string;
  onPortfolioDeleted: (portfolioId: string) => void;
}

const PortfolioManager: React.FC<PortfolioManagerProps> = ({
  portfolioId,
  onPortfolioDeleted,
}) => {
  const [works, setWorks] = useState<Record<string, string>[]>([]);
  const [parameters, setParameters] = useState<string[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

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

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleWorkAdded = async (
    parameterMap: Record<string, string>,
    imageFile: File
  ) => {
    setLoading(true);
    try {
      // Upload art work image to Firestore
      const compressedImage = await compressImage(imageFile, "good");
      const [originalImageStorageRef, thumbnailImageStorageRef] = [
        ref(storage, `Collection Images/${portfolioId}/${imageFile.name}`),
        ref(
          storage,
          `Collection Images/${portfolioId}/thumbnails/${imageFile.name}`
        ),
      ];
      await uploadBytes(thumbnailImageStorageRef, compressedImage);
      await uploadBytes(originalImageStorageRef, compressedImage);
      const originalImageUrl = await getDownloadURL(originalImageStorageRef);
      const thumbnailImageUrl = await getDownloadURL(thumbnailImageStorageRef);

      // Save work data to Firestore
      const workData = {
        ...parameterMap,
        image_url: originalImageUrl,
        thumbnail_url: thumbnailImageUrl,
      };

      await setDoc(
        doc(db, "portfolios", portfolioId, "works", parameterMap["title"]),
        workData
      );

      // Update local state
      const workDataWithId = {
        id: parameterMap["title"], // Use title as the id (same as the document ID)
        ...workData,
      };
      setWorks((prevWorks) => [...prevWorks, workDataWithId]);

      setSnackbarMessage("Work added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage(`Error adding work: ${(error as Error).message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    setLoading(false);
    setDialogOpen(false);
  };

  const handleDeletePortfolio = async () => {
    setLoading(true);
    try {
      // First, delete all documents in the works subcollection
      const worksSnapshot = await getDocs(
        collection(db, "portfolios", portfolioId, "works")
      );

      // Delete Storage files associated with each work
      const deleteStoragePromises = worksSnapshot.docs.map(async (workDoc) => {
        // Delete art work images from Storage
        const imageUrl = workDoc.data().image_url;
        const thumbnailUrl = workDoc.data().thumbnail_url;
        console.log("Deleting images:", imageUrl, thumbnailUrl);
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
        const thumbnailRef = ref(storage, thumbnailUrl);
        await deleteObject(thumbnailRef);
      });
      await Promise.all(deleteStoragePromises);

      // Delete each work document
      const deletePromises = worksSnapshot.docs.map((workDoc) =>
        deleteDoc(workDoc.ref)
      );
      await Promise.all(deletePromises);

      // Then delete the portfolio document itself
      await deleteDoc(doc(db, "portfolios", portfolioId));

      onPortfolioDeleted(portfolioId);
    } catch (error) {
      setSnackbarMessage(
        `Error deleting portfolio: ${(error as Error).message}`
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
    setLoading(false);
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
        loading={loading}
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
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            color="inherit"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeletePortfolio}
            color="error"
            variant="contained"
            loading={loading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};

export default PortfolioManager;
