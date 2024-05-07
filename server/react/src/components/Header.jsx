import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, StyledEngineProvider } from "@mui/material";
import PropTypes from "prop-types";
Header.propTypes = { name: PropTypes.string.isRequired };
export default function Header(props) {
  const navigate = useNavigate();
  const logOut = () => {
    localStorage.removeItem("sessionID");
    return navigate("/");
  };
  return (
    <StyledEngineProvider injectFirst>
      <Box sx={{}}>
        <Typography
          variant="h1"
          sx={{
            fontFamily: "cursive,sans-serif",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {props.name}
        </Typography>
      </Box>
      <Button
        variant="outlined"
        sx={{
          position: "absolute",
          top: "50px",
          right: "50px",
          transform: "translate(0, -50%)",
        }}
        onClick={logOut}
      >
        Log Out
      </Button>
    </StyledEngineProvider>
  );
}
