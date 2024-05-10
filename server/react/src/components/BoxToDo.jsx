import {
  Typography,
  Box,
  StyledEngineProvider,
  Checkbox,
  Grid,
  Button,
} from "@mui/material";
import "../components/Dashboard.css";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import "../components/Dashboard.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

BoxToDo.propTypes = {
  name: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  piority: PropTypes.number.isRequired,
  changeLoading: PropTypes.func.isRequired,
};

function BoxToDo({ name, data, piority, changeLoading }) {
  const [add, setAdd] = useState("");
  const navigate = useNavigate();

  const sendAddData = async (data) => {
    await axios
      .post("http://localhost:8000/add-todo", data, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        changeLoading();
      })
      .catch((err) => {
        if (err.response) {
          console.log("Error Code", err.response.status);
          console.log(err.response.data.message);
        } else {
          console.log(err);
        }
      });
  };

  const sendDel = async (id) => {
    await axios
      .delete(`http://localhost:8000/remove-todo/${id}`, {
        headers: {
          Authorization: `${sessionId}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        changeLoading();
      })
      .catch((err) => {
        if (err.response) {
          console.log("Error Code", err.response.status);
          console.log(err.response.data.message);
        } else {
          console.log(err);
        }
      });
  };

  const sendChange = async (id) => {
    await axios
      .get(`http://localhost:8000/toggle-todo/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        changeLoading();
      })
      .catch((err) => {
        if (err.response) {
          console.log("Error Code", err.response.status);
          console.log(err.response.data.message);
        } else {
          console.log(err);
        }
      });
  };

  const handleAddInput = (value) => {
    setAdd(value);
  };

  const handleAddItem = async (title, piority) => {
    if (title) {
      const newData = {
        title: title,
        piority: piority,
        done: false,
      };
      sendAddData(newData);
    }

    setAdd("");
  };

  const handleStatusChange = (id) => {
    sendChange(id);
  };

  const handleRemove = (id) => {
    sendDel(id);
  };

  return (
    <StyledEngineProvider injectFirst>
      <Box
        className={`ToDo-box${piority}`}
        sx={{
          width: "calc(50% - 25px)" /* 50% width minus margin */,
          marginBottom: "20px",
          overflow: "hidden",
          display: "inline-block",
          padding: "10px",
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
          {name}
        </Typography>
        <ol>
          {data.map((data, index) => (
            <li key={index}>
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
                  fontFamily: "monospace,sans-serif",
                  fontSize: "1em",
                  marginTop: "5px",
                }}
              >
                <Button
                  variant="text"
                  className="buttonLink"
                  onClick={() => navigate(`/ToDo/${data._id}`)}
                >
                  {data.done ? (
                    <del>{data.title}</del>
                  ) : (
                    <span>{data.title}</span>
                  )}
                </Button>
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
          ))}
        </ol>
        <Grid className="gridBox">
          <TextField
            className="textField"
            value={add}
            name="add"
            inputProps={{ maxLength: 25 }}
            required
            id="add"
            label={`Add ToDo Piority ${piority}`}
            sx={{ width: "50%" }}
            onChange={({ target }) => handleAddInput(target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddItem(e.target.value, piority);
              }
            }}
          />
          <IconButton
            aria-label="add"
            size="large"
            className="del"
            onClick={() => handleAddItem(add, piority)}
          >
            <AddIcon />
          </IconButton>
        </Grid>
      </Box>
    </StyledEngineProvider>
  );
}

export default BoxToDo;
