import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Container,
  Button,
  Typography,
  Input,
  NativeSelect,
  Grid,
} from "@mui/material";
import axios from "axios";
import Header from "../components/Header";
import { useTodoStore } from "../stores/todo-stores";

export default function ToDoID() {
  const params = useParams();

  const navigate = useNavigate();
  let { id } = params;
  const [data, setData] = useState({});
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const { setErrorMsg } = useTodoStore();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchData = async () => {
    setLoading(true);
    axios
      .get(`http://localhost:8000/api/todo/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        setData(res.data.todo);
        setTitle(res.data.todo.title);

        console.log("Status: ", res.status);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response) {
          console.log("Status: ", err.response.status);
          const errorMessage = err.response.data.message;
          console.log("message: ", errorMessage);

          setErrorMsg(errorMessage);

          return navigate(`/error/${err.response.status}`);
        } else {
          console.log(err);
        }
      });
  };
  useEffect(() => {
    if (loading) {
      fetchData();
    }
  }, [fetchData, loading]);

  const handleChange = (value) => {
    setTitle(value);
  };

  const submitChange = async (value) => {
    axios
      .put(
        "http://localhost:8000/api/update-todo",
        { id: id, title: value },
        { withCredentials: true }
      )
      .then((res) => {
        console.log("status", res.status);
        console.log("message:", res.data.message);
        setLoading(true);
      })
      .catch((err) => {
        if (err.response) {
          console.log("Status: ", err.response.status);
          console.log("message: ", err.response.data.message);
          const errorMessage = err.response.data.message;
          setErrorMsg(errorMessage);
          return navigate(`/error/${err.response.status}`);
        } else {
          console.log(err);
        }
      })
      .finally(() => {
        setTitle("");
      });
  };

  const submitPiority = async (value) => {
    axios
      .put(
        "http://localhost:8000/api/piority",
        { id: id, piority: value },
        { withCredentials: true }
      )
      .then((res) => {
        console.log("status: ", res.status);
        console.log("msg: ", res.data.message);
        setLoading(true);
      })
      .catch((err) => {
        if (err.response) {
          console.log("Status: ", err.response.status);
          console.log("message: ", err.response.data.message);
          const errorMessage = err.response.data.message;
          setErrorMsg(errorMessage);
          return navigate(`/error/${err.response.status}`);
        } else {
          console.log(err);
        }
      });
  };

  return (
    <Container
      component="main"
      sx={{
        padding: "0px",
      }}
    >
      <Button
        variant="outlined"
        sx={{
          position: "absolute",
          top: "50px",
          left: "50px",
          transform: "translate(0, -50%)",
          color: "black",
          border: "1px solid black",
        }}
        onClick={() => {
          navigate("/Dashboard");
        }}
      >
        Go Back
      </Button>
      <Header name="To Do" />

      <Typography
        sx={{
          fontSize: "2em",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {data.title}
      </Typography>
      <Typography
        sx={{
          fontSize: "2em",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Status: {data.status ? "Finish" : "On Going"}
      </Typography>
      <Grid
        sx={{
          fontSize: "2em",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: "1em" }}>Piority:</Typography>
        <NativeSelect
          value={data.piority}
          inputProps={{
            name: "piority",
            id: "piority",
          }}
          sx={{
            fontSize: "0.8em",
            paddingLeft: "5px",
            marginTop: "5px",
          }}
          onChange={(e) => {
            submitPiority(e.target.value);
          }}
        >
          <option value={1}>Must Do</option>
          <option value={2}>Should Do</option>
          <option value={3}>Could Do</option>
          <option value={4}>If I Could</option>
        </NativeSelect>
      </Grid>

      <Grid
        sx={{
          fontSize: "2em",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: "1em" }}>Change Title:</Typography>
        <Input
          sx={{
            fontSize: "0.8em",
            paddingLeft: "5px",
            marginTop: "5px",
          }}
          inputProps={{ maxLength: 25 }}
          value={title}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value) {
              submitChange(e.target.value);
            }
          }}
        />
        {title ? (
          <Button variant="outlined" onClick={() => submitChange(title)}>
            Change
          </Button>
        ) : (
          <Button variant="outlined" disabled>
            Change
          </Button>
        )}
      </Grid>
    </Container>
  );
}
