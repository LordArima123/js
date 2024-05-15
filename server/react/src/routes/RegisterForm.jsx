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
import axios from "axios";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp() {
  const [formInput, setFormInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    responsemessage: "",
  });
  const [responseMessage, setResponsemessage] = useState("");
  const navigate = useNavigate();

  const handleInput = (name, value) => {
    checkError(name, value);
    setFormInput({
      ...formInput,
      [name]: value,
    });
  };

  const validateInput = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "firstName":
        errorMessage = value.trim() === "" ? "Must fill this field" : "";
        break;
      case "lastName":
        errorMessage = value.trim() === "" ? "Must fill this field" : "";
        break;
      case "username":
        errorMessage =
          value.length < 3 ? "Username must be at least 3 characters long" : "";
        break;
      case "email":
        errorMessage = !/\S+@\S+\.\S+/.test(value)
          ? "Invalid email address"
          : "";

        break;
      case "password":
        errorMessage =
          value.length < 6 ? "Password must be at least 6 characters long" : "";

        break;
      case "confirmPassword":
        errorMessage =
          value !== formInput.password
            ? "Password and Confirm Password must match"
            : "";

        break;
      default:
        break;
    }
    return errorMessage;
  };

  const checkError = (name, value) => {
    const error = validateInput(name, value);
    setFormError((fe) => ({
      ...fe,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = [];
    Object.keys(formInput).map((key) => {
      const error = validateInput(key, formInput[key]);
      if (error !== "") {
        errors.push(error);
      }
    });
    const hasErrors = errors.length > 0;

    if (hasErrors) {
      console.log("Errors: ", errors.join("\n"));
      return;
    } else {
      const data = {
        firstName: formInput.firstName,
        lastName: formInput.lastName,
        email: formInput.email,
        password: formInput.password,
      };

      try {
        const res = await axios.post(
          "http://localhost:8000/api/register",
          data
        );
        console.log("data", res.data);

        if (res.status >= 200 && res.status < 300) {
          console.log("Request succeeded:", res.data);
          return navigate("/", { state: { message: "User Created!" } });
        } else {
          console.log("Unexpected status:", res.status);
          // Handle other unexpected statuses
        }
      } catch (error) {
        if (error.response) {
          console.log("Server error:", error.response.status);
          console.log("Server response:", error.response.data);
          return setResponsemessage(error.response.data.error);
        } else if (error.request) {
          // The request was made but no response was received
          console.log("No response received");
          // Handle network errors or timeouts
        } else {
          // Something else happened while setting up the request
          console.error("Error:", error.message);
          // Handle other errors
        }
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
            Sign up
          </Typography>
          {responseMessage ? (
            <Alert severity="error">{responseMessage}</Alert>
          ) : (
            ""
          )}
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {!formError.firstName ? (
                  <TextField
                    autoComplete="given-name"
                    value={formInput.firstName}
                    onChange={({ target }) => {
                      handleInput(target.name, target.value);
                    }}
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                  />
                ) : (
                  <TextField
                    error
                    helperText={formError.firstName}
                    autoComplete="given-name"
                    value={formInput.firstName}
                    onChange={({ target }) => {
                      handleInput(target.name, target.value);
                    }}
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {!formError.lastName ? (
                  <TextField
                    required
                    fullWidth
                    value={formInput.lastName}
                    onChange={({ target }) => {
                      handleInput(target.name, target.value);
                    }}
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                ) : (
                  <TextField
                    error
                    helperText={formError.lastName}
                    required
                    fullWidth
                    value={formInput.lastName}
                    onChange={({ target }) => {
                      handleInput(target.name, target.value);
                    }}
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                {!formError.email ? (
                  <TextField
                    required
                    fullWidth
                    value={formInput.email}
                    onChange={({ target }) => {
                      handleInput(target.name, target.value);
                    }}
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                ) : (
                  <TextField
                    error
                    helperText={formError.email}
                    required
                    fullWidth
                    value={formInput.email}
                    onChange={({ target }) => {
                      handleInput(target.name, target.value);
                    }}
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                {!formError.password ? (
                  <TextField
                    required
                    fullWidth
                    onChange={({ target }) => {
                      handleInput(target.name, target.value);
                    }}
                    defaultValue={""}
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                ) : (
                  <TextField
                    error
                    helperText={formError.password}
                    required
                    fullWidth
                    onChange={({ target }) => {
                      handleInput(target.name, target.value);
                    }}
                    defaultValue={""}
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                {!formError.confirmPassword ? (
                  <TextField
                    required
                    fullWidth
                    defaultValue={""}
                    onChange={({ target }) => {
                      handleInput(target.name, target.value);
                    }}
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                  />
                ) : (
                  <TextField
                    error
                    helperText={formError.confirmPassword}
                    required
                    fullWidth
                    defaultValue={""}
                    onChange={({ target }) => {
                      handleInput(target.name, target.value);
                    }}
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                  />
                )}
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              type="submit"
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
