import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

import LogInContent from "./LogInContent";

import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  DialogContentText,
} from "@mui/material";

interface LogInDialogProps {
  open: boolean;
  onClose: () => void;
}

const LogInDialog: React.FC<LogInDialogProps> = ({ open, onClose }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Listen for authentication state changes
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      setLoggedIn(true);
    } else {
      // User is signed out
      setLoggedIn(false);
    }
  });

  const handleLogOut = () => {
    auth.signOut();
    setLoggedIn(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      {/* Dialog Title */}
      <DialogTitle>Log In</DialogTitle>

      {/* Dialog Content */}
      {!loggedIn ? (
        <LogInContent onClose={onClose} />
      ) : (
        <DialogContent>
          <DialogContentText>You are logged in.</DialogContentText>
        </DialogContent>
      )}

      {/* Dialog Actions */}
      <DialogActions>
        {!loggedIn ? (
          <>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" form="subscription-form" variant="contained">
              Log In
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onClose}>Close</Button>
            <Button onClick={handleLogOut}>Log Out</Button>
            <Button
              onClick={() => {
                navigate("/admin");
                onClose();
              }}
              variant="contained"
            >
              Admin Dashboard
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default LogInDialog;
