import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import axios from "axios";

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {
  const location = useLocation();
  const { message } = location.state || {};
  const [formInput, setFormInput] = useState({
    email: "",
    password: "",
  });
  const [errorEmail, setErrorEmail] = useState("");
  const [responsemessage, setResponsemessage] = useState("");
  const navigate = useNavigate();

  const handleInput = (name, value) => {
    setFormInput({
      ...formInput,
      [name]: value,
    });
    if (name === "email") {
      validate(value);
    }
  };

  const validate = (value) => {
    let errorE = !/\S+@\S+\.\S+/.test(value) ? "Invalid email address" : "";
    setErrorEmail(errorE);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errorEmail) return;
    try {
      const res = await axios.post(
        "http://localhost:8000/api/login",
        formInput,
        {
          withCredentials: true,
        }
      );
      if (res.status >= 200 && res.status < 300) {
        console.log("Request succeeded:", res.status);

        const sessionID = await res.data.sessionID;
        localStorage.setItem("sessionID", sessionID);

        navigate("/Dashboard");
      } else {
        console.log("Unexpected status:", res.status);
        // Handle other unexpected statuses
      }
    } catch (err) {
      if (err.response) {
        console.log("Server Error", err.response.status);
        console.log("Server response:", err.response.data);
        return setResponsemessage(err.response.data.err);
      } else {
        console.error(err);
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {message && <Alert severity="success">{message}</Alert>}
          {responsemessage && <Alert severity="error">{responsemessage}</Alert>}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            {!errorEmail ? (
              <TextField
                onChange={({ target }) => {
                  handleInput(target.name, target.value);
                }}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
            ) : (
              <TextField
                error
                helperText={errorEmail}
                onChange={({ target }) => {
                  handleInput(target.name, target.value);
                }}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
            )}

            <TextField
              onChange={({ target }) => {
                handleInput(target.name, target.value);
              }}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
