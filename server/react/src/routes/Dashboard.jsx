import {
  Container,
  Typography,
  Box,
  StyledEngineProvider,
  Checkbox,
  Grid,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import "../components/Dashboard.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import coverRed from "../assets/background-red.jpg";
import coverBlue from "../assets/background-blue.jpg";
import coverGreen from "../assets/background-green.jpg";
import coverYellow from "../assets/background-yellow.jpg";

function Dashboard() {
  const sessionId = localStorage.getItem("sessionId");
  const navigate = useNavigate();
  console.log(sessionId);
  const [add, setAdd] = useState({ add1: "", add2: "", add3: "", add4: "" });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchData = async () => {
    setLoading(true);
    await axios
      .get("http://localhost:8000/todos", {
        headers: { Authorization: sessionId },
      })
      .then((res) => {
        setData(res.data.todos);
        console.log(res.data.todos);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };

  const sendAddData = async (data) => {
    await axios
      .post("http://localhost:8000/add-todo", data, {
        headers: { Authorization: sessionId },
      })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };

  const sendDel = async (id) => {
    await axios
      .delete(`http://localhost:8000/remove-todo/${id}`, {
        headers: {
          Authorization: `${sessionId}`,
        },
      })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };

  const sendChange = async (id) => {
    await axios
      .get(`http://localhost:8000/toggle-todo/${id}`, {
        headers: { Authorization: sessionId },
      })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (loading && data.length === 0) {
      fetchData();
    }
  }, [data.length, fetchData, loading]);

  const handleStatusChange = (id) => {
    setData((prevData) =>
      prevData.map((data) =>
        data._id === id ? { ...data, done: !data.done } : data
      )
    );
    sendChange(id);
  };

  const handleRemove = (id) => {
    setData((prevData) => prevData.filter((data) => data._id !== id));
    sendDel(id);
  };

  const handleAddInput = (name, value) => {
    setAdd({ ...add, [name]: value });
  };

  const handleAddItem = async (title, piority) => {
    const newData = {
      title: title,
      piority: piority,
      done: false,
    };
    if (title) {
      setData((prevData) => [...prevData, newData]);
      sendAddData(newData);
    }

    setAdd({ ...add, [`add${piority}`]: "" });
  };

  const logOut = () => {
    localStorage.removeItem("sessionId");
    return navigate("/");
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
        <Box sx={{}}>
          <Typography
            variant="h1"
            sx={{
              fontFamily: "cursive,sans-serif",
              display: "flex",
              justifyContent: "center",
            }}
          >
            To Do List
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
