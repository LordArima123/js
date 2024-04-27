import { useState } from "react";

import "./App.css";
import Logo from "./components/Logo";
import Navbar from "./components/Navbar";
import { Container } from "@mui/material";

function App() {
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(1);
  console.log(show);

  const doubleCount = (input) => {
    const double = input * 2;
    setCount(double);
  };

  return (
    <Container maxWidth={false}>
      <Navbar />
      {show && <Logo />}
      <h1>Vite + React</h1>
      <button onClick={() => setShow(!show)}>
        Status: {show ? "True" : "False"}
      </button>
      <div className="card">
        <button onClick={() => doubleCount(count)}>count is {count}</button>
      </div>
    </Container>
  );
}

export default App;
