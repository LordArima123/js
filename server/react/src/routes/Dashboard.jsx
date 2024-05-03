import {
  Container,
  Typography,
  Box,
  StyledEngineProvider,
  Checkbox,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import "../components/Dashboard.css";
import { useState, useEffect } from "react";
import axios from "axios";

import coverRed from "../assets/background-red.jpg";
import coverBlue from "../assets/background-blue.jpg";
import coverGreen from "../assets/background-green.jpg";
import coverYellow from "../assets/background-yellow.jpg";

function Dashboard() {
  const sessionId = localStorage.getItem("sessionId");
  console.log(sessionId);
  const [add, setAdd] = useState({ add1: "", add2: "", add3: "", add4: "" });
  const [data, setData] = useState([]);

  const fetchData = async () => {
    await axios
      .post("http://localhost:8000/todos", { sessionId: sessionId })
      .then((res) => {
        setData(res.data.todos);
        console.log(res.data.todos);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = (id) => {
    setData((prevData) =>
      prevData.map((data) =>
        data._id === id ? { ...data, done: !data.done } : data
      )
    );
  };

  const handleRemove = (id) => {
    setData((prevData) => prevData.filter((data) => data._id !== id));
  };

  const handleAddInput = (name, value) => {
    setAdd({ ...add, [name]: value });
  };

  const handleAddItem = (title, piority) => {
    if (title) {
      setData((prevData) => [
        ...prevData,
        { title: title, piority: piority, done: false, userid: sessionId },
      ]);
    }
    //const addnum  = ``
    setAdd({ ...add, [`add${piority}`]: "" });
  };

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
              {data.map(
                (data) =>
                  data.piority === 1 && (
                    <li key={data._id}>
                      <Checkbox
                        className="checkBox"
                        size="large"
                        checked={data.done}
                        onChange={() => {
                          handleStatusChange(data._id);
                        }}
                      />

                      <Typography
                        variant="body1"
                        gutterBottom
                        className="typo"
                        sx={{
                          color: "navy",
                          fontFamily: "monospace,sans-serif",
                          fontSize: "1em",
                        }}
                      >
                        {data.done ? (
                          <del>{data.title}</del>
                        ) : (
                          <span>{data.title}</span>
                        )}
                      </Typography>
                      <IconButton
                        aria-label="delete"
                        size="large"
                        className="del"
                        onClick={() => handleRemove(data._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </li>
                  )
              )}
            </ol>
            <Grid className="gridBox">
              <TextField
                value={add.add1}
                name="add1"
                inputProps={{ maxLength: 25 }}
                required
                id="add1"
                label="Add ToDo Piority 1"
                sx={{ width: "50%" }}
                onChange={({ target }) =>
                  handleAddInput(target.name, target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddItem(e.target.value, 1);
                  }
                }}
              />
              <IconButton
                aria-label="add"
                size="large"
                className="del"
                onClick={() => handleAddItem(add.add1, 1)}
              >
                <AddIcon />
              </IconButton>
            </Grid>
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
              {data.map(
                (data) =>
                  data.piority === 2 && (
                    <li key={data._id}>
                      <Checkbox
                        className="checkBox"
                        size="large"
                        checked={data.done}
                        onChange={() => {
                          handleStatusChange(data._id);
                        }}
                      />

                      <Typography
                        variant="body1"
                        gutterBottom
                        className="typo"
                        sx={{
                          color: "white",
                          fontFamily: "monospace,sans-serif",
                          fontSize: "1em",
                        }}
                      >
                        {data.done ? (
                          <del>{data.title}</del>
                        ) : (
                          <span>{data.title}</span>
                        )}
                      </Typography>
                      <IconButton
                        aria-label="delete"
                        size="large"
                        className="del"
                        onClick={() => handleRemove(data._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </li>
                  )
              )}
            </ol>
            <Grid className="gridBox">
              <TextField
                value={add.add2}
                name="add2"
                inputProps={{ maxLength: 25 }}
                required
                id="add2"
                label="Add ToDo Piority 2"
                sx={{ width: "50%", backgroundColor: "white" }}
                onChange={({ target }) =>
                  handleAddInput(target.name, target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddItem(e.target.value, 2);
                  }
                }}
              />
              <IconButton
                aria-label="add"
                size="large"
                className="del"
                onClick={() => handleAddItem(add.add2, 2)}
              >
                <AddIcon />
              </IconButton>
            </Grid>
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
              {data.map(
                (data) =>
                  data.piority === 3 && (
                    <li key={data._id}>
                      <Checkbox
                        className="checkBox"
                        size="large"
                        checked={data.done}
                        onChange={() => {
                          handleStatusChange(data._id);
                        }}
                      />

                      <Typography
                        variant="body1"
                        gutterBottom
                        className="typo"
                        sx={{
                          color: "navy",
                          fontFamily: "monospace,sans-serif",
                          fontSize: "1em",
                        }}
                      >
                        {data.done ? (
                          <del>{data.title}</del>
                        ) : (
                          <span>{data.title}</span>
                        )}
                      </Typography>
                      <IconButton
                        aria-label="delete"
                        size="large"
                        className="del"
                        onClick={() => handleRemove(data._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </li>
                  )
              )}
            </ol>
            <Grid className="gridBox">
              <TextField
                value={add.add3}
                name="add3"
                inputProps={{ maxLength: 25 }}
                required
                id="add3"
                label="Add ToDo Piority 3"
                sx={{ width: "50%" }}
                onChange={({ target }) =>
                  handleAddInput(target.name, target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddItem(e.target.value, 3);
                  }
                }}
              />
              <IconButton
                aria-label="add"
                size="large"
                className="del"
                onClick={() => handleAddItem(add.add3, 3)}
              >
                <AddIcon />
              </IconButton>
            </Grid>
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
              {data.map(
                (data) =>
                  data.piority === 4 && (
                    <li key={data._id}>
                      <Checkbox
                        className="checkBox"
                        size="large"
                        checked={data.done}
                        onChange={() => {
                          handleStatusChange(data._id);
                        }}
                      />

                      <Typography
                        variant="body1"
                        gutterBottom
                        className="typo"
                        sx={{
                          color: "navy",
                          fontFamily: "monospace,sans-serif",
                          fontSize: "1em",
                        }}
                      >
                        {data.done ? (
                          <del>{data.title}</del>
                        ) : (
                          <span>{data.title}</span>
                        )}
                      </Typography>
                      <IconButton
                        aria-label="delete"
                        size="large"
                        className="del"
                        onClick={() => handleRemove(data._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </li>
                  )
              )}
            </ol>
            <Grid className="gridBox">
              <TextField
                value={add.add4}
                name="add4"
                inputProps={{ maxLength: 25 }}
                required
                id="add4"
                label="Add ToDo Piority 4"
                sx={{ width: "50%" }}
                onChange={({ target }) =>
                  handleAddInput(target.name, target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddItem(e.target.value, 4);
                  }
                }}
              />
              <IconButton
                aria-label="add"
                size="large"
                className="del"
                onClick={() => handleAddItem(add.add4, 4)}
              >
                <AddIcon />
              </IconButton>
            </Grid>
          </Box>
        </Container>
      </Container>
    </StyledEngineProvider>
  );
}
export default Dashboard;
