import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface WorkItemDialogProps {
  open: boolean;
  onClose: () => void;
  onWorkAdded: (
    parameterMap: Record<string, string>,
    imageFile: File
  ) => Promise<void>;
  parameters?: string[];
  loading?: boolean;
  initialValues?: Record<string, string>;
}

const WorkItemDialog: React.FC<WorkItemDialogProps> = ({
  open,
  onClose,
  onWorkAdded,
  parameters,
  loading,
  initialValues,
}) => {
  const isEditMode = Boolean(initialValues);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string>("");

  useEffect(() => {
    // Initialize form values when parameters change
    const formValues: Record<string, string> = {};
    const initialErrors: Record<string, string> = {};

    (parameters || []).forEach((param) => {
      // Use initial values if in edit mode, otherwise use empty string
      formValues[param] = isEditMode ? initialValues?.[param] || "" : "";
      initialErrors[param] = "";
    });

    setFormValues(formValues);
    setFormErrors(initialErrors);

    // Clear image file when switching modes or parameters change
    if (!isEditMode) {
      setImageFile(null);
      setImageError("");
    }
  }, [parameters, initialValues, isEditMode]);

  // Handle input changes
  const handleInputChange =
    (paramName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormValues((prev) => ({
        ...prev,
        [paramName]: value,
      }));

      // Clear error when user starts typing
      if (formErrors[paramName]) {
        setFormErrors((prev) => ({
          ...prev,
          [paramName]: "",
        }));
      }
    };

  // Handle image file selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setImageError(
          "Please select a valid image file (JPEG, PNG, GIF, or WebP)"
        );
        setImageFile(null);
        return;
      }

      setImageFile(file);
      setImageError("");
    }
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    (parameters || []).forEach((param) => {
      const value = formValues[param]?.trim();
      if (!value) {
        errors[param] = `${
          param.charAt(0).toUpperCase() + param.slice(1)
        } is required`;
        isValid = false;
      }
    });

    // Validate image file (only required for new works, not edits)
    if (!isEditMode && !imageFile) {
      setImageError("Please select an image file");
      isValid = false;
    } else if (imageError) {
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSave = async () => {
    if (validateForm()) {
      // For edit mode, don't pass imageFile since image editing is not allowed
      // For create mode, imageFile is required and validated
      const fileToPass = isEditMode
        ? new File([], "", { type: "image/jpeg" })
        : imageFile!;
      await onWorkAdded(formValues, fileToPass);
      handleClose();
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormValues({});
    setFormErrors({});
    setImageFile(null);
    setImageError("");
    onClose();
  };

  const isFormValid =
    Object.values(formValues).every((value) => value.trim() !== "") &&
    (isEditMode || imageFile);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEditMode ? "Edit Art Work" : "Art Work Details"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isEditMode
            ? "Update the details for the art work."
            : "Enter the details for the art work."}
        </DialogContentText>
        <form autoComplete="off">
          {(parameters || []).map((param, index) => (
            <TextField
              key={index}
              autoFocus={index === 0}
              required
              margin="dense"
              id={param}
              name={param}
              label={param.charAt(0).toUpperCase() + param.slice(1)}
              type="text"
              fullWidth
              variant="standard"
              value={formValues[param] || ""}
              onChange={handleInputChange(param)}
              error={!!formErrors[param]}
              helperText={formErrors[param]}
            />
          ))}

          {/* Image file input - only show in create mode */}
          {!isEditMode && (
            <TextField
              required
              margin="dense"
              id="image-upload"
              name="image"
              label="Select Image"
              type="file"
              fullWidth
              variant="standard"
              onChange={handleImageChange}
              error={!!imageError}
              helperText={
                imageError ||
                (imageFile
                  ? `Selected: ${imageFile.name}`
                  : "Choose an image file")
              }
              slotProps={{
                htmlInput: {
                  accept: "image/*",
                },
              }}
            />
          )}
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={handleClose}
          disabled={loading ? true : false}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={handleSave}
          disabled={!isFormValid}
          loading={loading ? true : false}
        >
          {isEditMode ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkItemDialog;
