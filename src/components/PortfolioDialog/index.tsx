import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Box,
} from "@mui/material";

interface PortfolioDialogProps {
  open: boolean;
  onClose: () => void;
}

const PortfolioDialog: React.FC<PortfolioDialogProps> = ({ open, onClose }) => {
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setTitle("");
      setCoverImage(null);
    }
  }, [open]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverImage(file);
    }
  };

  const handleSave = () => {
    // Validate required fields
    if (!title.trim()) {
      alert("Please enter a portfolio title");
      return;
    }
    if (!coverImage) {
      alert("Please select a cover image");
      return;
    }

    // Placeholder for save functionality
    console.log("Saving portfolio:", {
      title: title.trim(),
      coverImage: coverImage.name,
    });

    // TODO: Implement Firebase save functionality
    alert(
      `Portfolio "${title}" would be saved with image "${coverImage.name}"`
    );

    onClose();
  };

  const isFormValid = title.trim() && coverImage;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Portfolio Details</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Fill in the details below to create a new portfolio.
        </DialogContentText>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl fullWidth>
            <TextField
              label="Portfolio Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
              variant="outlined"
              placeholder="Enter portfolio title..."
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              required
              id="image-upload"
              name="image"
              label="Cover Image"
              type="file"
              fullWidth
              variant="standard"
              onChange={handleImageChange}
              slotProps={{
                htmlInput: {
                  accept: "image/*",
                },
              }}
            />
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!isFormValid}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default PortfolioDialog;
