import React, { useState, useEffect } from "react";
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

interface PortfolioDialogProps {
  open: boolean;
  onClose: () => void;
}

const PortfolioDialog: React.FC<PortfolioDialogProps> = ({ open, onClose }) => {
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [parameterCount, setParameterCount] = useState(0);
  const [parameters, setParameters] = useState<string[]>([]);
  const [titleError, setTitleError] = useState("");
  const [imageError, setImageError] = useState("");

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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setImageError(""); // Clear error when valid file is selected
    }
  };

  const handleParameterChange = (index: number, value: string) => {
    const updatedParameters = [...parameters];
    updatedParameters[index] = value;
    setParameters(updatedParameters);
  };

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

  const handleSubmit = () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Filter out empty parameters and format them (lowercase, spaces to underscores)
    const validParameters = parameters
      .filter((param) => param.trim() !== "")
      .map((param) => param.trim().toLowerCase().replace(/\s+/g, "_"));

    // Create portfolio data object
    const portfolioData = {
      title: title.trim(),
      coverImage: {
        name: coverImage!.name,
        size: coverImage!.size,
        type: coverImage!.type,
      },
      parameters: validParameters,
      createdAt: new Date().toISOString(),
    };

    // Log the data for debugging
    console.log("Portfolio Data:", portfolioData);

    // Show alert with portfolio details
    const parameterText =
      validParameters.length > 0
        ? `\nParameters: ${validParameters.join(", ")}`
        : "\nNo parameters added";

    alert(
      `Portfolio Created Successfully!\n\n` +
        `Title: ${portfolioData.title}\n` +
        `Cover Image: ${portfolioData.coverImage.name} (${(
          portfolioData.coverImage.size / 1024
        ).toFixed(2)} KB)` +
        parameterText +
        `\n\nCreated: ${new Date(portfolioData.createdAt).toLocaleString()}`
    );

    // TODO: Implement Firebase save functionality here
    // Example: await savePortfolioToFirebase(portfolioData);

    onClose();
  };

  const isFormValid = title.trim().length >= 3 && coverImage;

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
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isFormValid}
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default PortfolioDialog;
