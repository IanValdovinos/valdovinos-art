import React from "react";

import {
  Magnifier,
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION,
} from "react-image-magnifiers";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogContentText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface WorkInspectorProps {
  open: boolean;
  onClose: () => void;
  workData?: Record<string, string>;
}

const WorkInspector: React.FC<WorkInspectorProps> = ({
  open,
  onClose,
  workData,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{workData?.title || "Work Inspector"}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <DialogContentText>
          Click/tap on the image to magnify.
        </DialogContentText>
        {workData ? (
          <Magnifier
            imageSrc={workData?.image_url}
            imageAlt={workData?.title}
            largeImageSrc={workData?.image_url}
            mouseActivation={MOUSE_ACTIVATION.SINGLE_CLICK}
            touchActivation={TOUCH_ACTIVATION.SINGLE_TAP}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default WorkInspector;
