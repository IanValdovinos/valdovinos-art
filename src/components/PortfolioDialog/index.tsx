import React, { useState, useEffect } from "react";

// Import MUI components
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Box,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

// Import Firebase
import { storage } from "../../firebase";
import { db } from "../../firebase";
import { setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Import utilities
import { compressImage } from "../../utils/image_utils";

import { type Portfolio } from "../../pages/AdminDashboard";

interface PortfolioDialogProps {
  open: boolean;
  onClose: () => void;
  onSave?: (newPortfolio: Portfolio) => void;
}

const PortfolioDialog: React.FC<PortfolioDialogProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [parameterCount, setParameterCount] = useState(0);
  const [parameters, setParameters] = useState<string[]>([]);
  const [titleError, setTitleError] = useState("");
  const [imageError, setImageError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setTitle("");
      setCoverImage(null);
      setParameterCount(0);
      setParameters([]);
      setTitleError("");
      setImageError("");
    }
  }, [open]);

  // Handle image file selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setImageError(""); // Clear error when valid file is selected
    }
  };

  // Handle parameter input change
  const handleParameterChange = (index: number, value: string) => {
    const updatedParameters = [...parameters];
    updatedParameters[index] = value;
    setParameters(updatedParameters);
  };

  // Validate form inputs
  const validateForm = () => {
    let isValid = true;

    // Validate title
    if (!title.trim()) {
      setTitleError("Portfolio title is required");
      isValid = false;
    } else if (title.trim().length < 3) {
      setTitleError("Portfolio title must be at least 3 characters");
      isValid = false;
    } else {
      setTitleError("");
    }

    // Validate cover image
    if (!coverImage) {
      setImageError("Cover image is required");
      isValid = false;
    } else {
      setImageError("");
    }

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true);
    // Validate form
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Filter out empty parameters and format them (lowercase, spaces to underscores)
      const validParameters = parameters
        .filter((param) => param.trim() !== "")
        .map((param) => param.trim().toLowerCase().replace(/\s+/g, "_"));
      validParameters.unshift("title");

      // Upload cover image to Firebase Storage
      const storageRef = ref(storage, `Portfolio Covers/${coverImage!.name}`);
      const compressedImage = await compressImage(coverImage!, "good");
      await uploadBytes(storageRef, compressedImage);
      const image_url = await getDownloadURL(storageRef);

      // Save portfolio data to Firestore
      const portfolioData = {
        title: title.trim(),
        image_url: image_url,
        parameters: validParameters,
      };

      await setDoc(doc(db, "portfolios", title.trim()), portfolioData);

      if (onSave) {
        onSave({
          id: title.trim(),
          imageUrl: image_url,
          title: title.trim(),
        });
      }
    } catch (error) {
      alert(`Error saving portfolio: ${(error as Error).message}`);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* Title */}
      <DialogTitle>Portfolio Details</DialogTitle>

      {/* Content */}
      <DialogContent>
        {/* Form Fields */}
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl fullWidth>
            <TextField
              label="Portfolio Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError(""); // Clear error on input
              }}
              required
              fullWidth
              variant="outlined"
              placeholder="Enter portfolio title..."
              error={!!titleError}
              helperText={titleError}
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
              error={!!imageError}
              helperText={
                imageError || (coverImage ? `Selected: ${coverImage.name}` : "")
              }
              slotProps={{
                htmlInput: {
                  accept: "image/*",
                },
              }}
            />
          </FormControl>

          {/* Work Parameter Input */}
          <Typography variant="h6">Work Description Parameters</Typography>
          {Array.from({ length: parameterCount }, (_, i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                label={`Parameter ${i + 1}`}
                type="text"
                fullWidth
                variant="outlined"
                placeholder={`e.g., Technique, Date, Size`}
                value={parameters[i] || ""}
                onChange={(e) => handleParameterChange(i, e.target.value)}
              />
              <DeleteOutlineIcon
                color="error"
                fontSize="large"
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  const newParams = parameters.filter(
                    (_, index) => index !== i
                  );
                  setParameters(newParams);
                  setParameterCount((prev) => prev - 1);
                }}
              />
            </Box>
          ))}

          <Button
            variant="outlined"
            onClick={() => {
              setParameterCount((prev) => prev + 1);
              setParameters((prev) => [...prev, ""]);
            }}
            disabled={parameterCount >= 10} // Limit to 10 parameters
          >
            Add Parameter{" "}
            {parameterCount < 10
              ? `(${10 - parameterCount} remaining)`
              : "(Max reached)"}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          loading={isLoading ? true : false}
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default PortfolioDialog;
