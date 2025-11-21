import { useState } from "react";
import {
  DialogContent,
  DialogContentText,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
interface LogInContentProps {
  onClose: () => void;
}

const LogInContent = ({ onClose }: LogInContentProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Sign in with Firebase Authentication
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user.toJSON();
        onClose();
        navigate("/admin");
      })
      .catch((error) => {
        alert(
          `Error logging in. Verify your email and password and try again.`
        );
      });
  };

  return (
    <DialogContent>
      {/* Dialog Description */}
      <DialogContentText>
        Please enter your email address and password to enter the admin portal.
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
  );
};

export default LogInContent;
