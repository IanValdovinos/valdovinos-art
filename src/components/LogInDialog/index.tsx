import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

interface LogInDialogProps {
  open: boolean;
  onClose: () => void;
}

const LogInDialog: React.FC<LogInDialogProps> = ({ open, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    alert("Logging In");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      {/* Dialog Title */}
      <DialogTitle>Log In</DialogTitle>

      <DialogContent>
        {/* Dialog Description */}
        <DialogContentText>
          Please enter your email address and password to enter the admin
          portal.
        </DialogContentText>

        {/* Form */}
        <form onSubmit={handleSubmit} id="subscription-form">
          {/* Email Field */}
          <TextField
            autoFocus
            required
            margin="dense"
            id="email"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
          {/* Password Field */}
          <TextField
            required
            margin="dense"
            id="password"
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            variant="standard"
          />
          {/* Show Password Checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={showPassword}
                onChange={(event) => setShowPassword(event.target.checked)}
              />
            }
            label="Show password"
          />
        </form>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" form="subscription-form" variant="contained">
          Log In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogInDialog;
