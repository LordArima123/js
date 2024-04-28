import { useEffect, useState } from "react";

import "./App.css";
import Logo from "./components/Logo";
import Navbar from "./components/Navbar";
import { Container } from "@mui/material";
import axios from "axios";
function App() {
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(1);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log(show);

  const fetchData = async () => {
    setLoading(true);
    await axios
      .get("http://localhost:8000/todos")
      .then((response) => {
        console.log(response.data);
        setTodos(response.data.todos);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const doubleCount = (input) => {
    const double = input * 2;
    setCount(double);
  };

  return (
    <Container maxWidth={true} id="Container">
      <Navbar />
      {show && <Logo />}
      <h1>Vite + React</h1>
      <button onClick={() => setShow(!show)}>
        Status: {show ? "True" : "False"}
      </button>
      <div className="card">
        <button onClick={() => doubleCount(count)}>count is {count}</button>
      </div>

      <div>
        {loading ? <p>Loading....</p> : <p>Numbers of todos: {todos.length}</p>}
      </div>
    </Container>
  );
}

export default App;
