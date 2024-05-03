import {
  Container,
  Typography,
  Box,
  StyledEngineProvider,
} from "@mui/material";
import "../components/Dashboard.css";

import coverRed from "../assets/background-red.jpg";
import coverBlue from "../assets/background-blue.jpg";
import coverGreen from "../assets/background-green.jpg";
import coverYellow from "../assets/background-yellow.jpg";

function Dashboard() {
  //const sessionId = localStorage.getItem("sessionId");
  const data = [
    {
      _id: {
        $oid: "6634fac56c0c9d40f0f7bdee",
      },
      title: "12",
      done: false,
      piority: 5,
      userid: "662ba8ec74bb0870f8949887",
      __v: 0,
    },
    {
      _id: {
        $oid: "662cce6aa73a1f1c9538fd1e",
      },
      title: "123",
      done: false,
      piority: 5,
      userid: "662cce3ea73a1f1c9538fd19",
      __v: 0,
    },
  ];

  return (
    <StyledEngineProvider injectFirst>
      <Container
        component="main"
        maxWidth="{true}"
        className="backgroundContainer"
        sx={{
          padding: "0px",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "grid", placeContent: "center" }}>
          <Typography
            variant="h1"
            sx={{
              fontFamily: "cursive,sans-serif",
              display: "inline-block",
              justifyContent: "center",
            }}
          >
            To Do List
          </Typography>
        </Box>

        <Container
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Box
            className="ToDo-box"
            sx={{
              width: "calc(50% - 30px)" /* 50% width minus margin */,
              marginBottom: "20px",
              border: "2px solid",
              display: "inline-block",
              padding: "10px",
              backgroundImage: `url(${coverRed})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <Typography
              variant="h3"
              gutterBottom
              fontWeight="950"
              sx={{
                color: "navy",
                fontFamily: "monospace,sans-serif",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Must Do
            </Typography>
            <ol>
              {data.map((data) => (
                <li key={data.id}>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                      color: "navy",
                      fontFamily: "monospace,sans-serif",
                      fontSize: "1em",
                    }}
                  >
                    {data.title}
                  </Typography>
                </li>
              ))}
            </ol>
          </Box>
          <Box
            className="ToDo-box"
            sx={{
              width: "calc(50% - 30px)" /* 50% width minus margin */,
              marginBottom: "20px",
              border: "2px solid",
              display: "inline-block",
              padding: "10px",
              backgroundImage: `url(${coverBlue})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <Typography
              variant="h3"
              gutterBottom
              fontWeight="950"
              sx={{
                color: "white",
                fontFamily: "monospace,sans-serif",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Should Do
            </Typography>
            <ol>
              {data.map((data) => (
                <li key={data.id}>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                      color: "white",
                      fontFamily: "monospace,sans-serif",
                      fontSize: "1em",
                    }}
                  >
                    {data.title}
                  </Typography>
                </li>
              ))}
            </ol>
          </Box>
          <Box
            className="ToDo-box"
            sx={{
              width: "calc(50% - 30px)" /* 50% width minus margin */,
              marginBottom: "20px",
              border: "2px solid",
              display: "inline-block",
              padding: "10px",
              backgroundImage: `url(${coverYellow})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <Typography
              variant="h3"
              gutterBottom
              fontWeight="950"
              sx={{
                fontFamily: "monospace,sans-serif",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Could Do
            </Typography>
            <ol>
              {data.map((data) => (
                <li key={data.id}>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                      fontFamily: "monospace,sans-serif",
                      fontSize: "1em",
                    }}
                  >
                    {data.title}
                  </Typography>
                </li>
              ))}
            </ol>
          </Box>
          <Box
            className="ToDo-box"
            sx={{
              width: "calc(50% - 30px)" /* 50% width minus margin */,
              marginBottom: "20px",
              border: "2px solid",
              display: "inline-block",
              padding: "10px",
              backgroundImage: `url(${coverGreen})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <Typography
              variant="h3"
              gutterBottom
              fontWeight="950"
              sx={{
                fontFamily: "monospace,sans-serif",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              If I Could
            </Typography>
            <ol>
              {data.map((data) => (
                <li key={data.id}>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                      fontFamily: "monospace,sans-serif",
                      fontSize: "1em",
                    }}
                  >
                    {data.title}
                  </Typography>
                </li>
              ))}
            </ol>
          </Box>
        </Container>
      </Container>
    </StyledEngineProvider>
  );
}
export default Dashboard;
