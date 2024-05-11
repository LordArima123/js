import { Container, StyledEngineProvider } from "@mui/material";
import "../components/Dashboard.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BoxToDo from "../components/BoxToDo";
import Header from "../components/Header";

function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [list1, setList1] = useState([]);
  const [list2, setList2] = useState([]);
  const [list3, setList3] = useState([]);
  const [list4, setList4] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchData = async () => {
    setLoading(true);
    await axios
      .get("http://localhost:8000/todos", {
        withCredentials: true,
      })
      .then((res) => {
        setList1([]);
        setList2([]);
        setList3([]);
        setList4([]);

        res.data.todos.forEach((item) => {
          switch (item.piority) {
            case 1:
              setList1((prev) => [...prev, item]);
              break;
            case 2:
              setList2((prev) => [...prev, item]);
              break;
            case 3:
              setList3((prev) => [...prev, item]);
              break;
            case 4:
              setList4((prev) => [...prev, item]);
              break;
            default:
              break;
          }
        });
      })
      .catch((err) => {
        if (err.response) {
          console.log("Error Code", err.response.status);
          console.log(err.response.data.message);
          const errorMessage = err.response.data.message;
          localStorage.setItem("errorMessage", errorMessage);
          return navigate(`/error/${err.response.status}`);
        } else {
          console.log(err);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const setLoad = () => {
    setLoading(true);
  };

  useEffect(() => {
    if (loading) {
      fetchData();
    }
  }, [fetchData, loading]);

  return (
    <StyledEngineProvider injectFirst>
      <Container
        component="main"
        className="backgroundContainer"
        sx={{
          padding: "0px",
          alignItems: "center",
        }}
      >
        <Header name="To Do List" />
        <Container
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <BoxToDo
            className="ToDo-box"
            data={list1}
            name="Must Do"
            piority={1}
            changeLoading={setLoad}
          />
          <BoxToDo
            className="ToDo-box"
            data={list2}
            name="Should Do"
            piority={2}
            changeLoading={setLoad}
          />
          <BoxToDo
            className="ToDo-box"
            data={list3}
            name="Could Do"
            piority={3}
            changeLoading={setLoad}
          />
          <BoxToDo
            className="ToDo-box"
            data={list4}
            name="If I Could Do"
            piority={4}
            changeLoading={setLoad}
          />
        </Container>
      </Container>
    </StyledEngineProvider>
  );
}
export default Dashboard;
