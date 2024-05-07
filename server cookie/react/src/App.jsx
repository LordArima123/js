//import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import RegisterForm from "./routes/RegisterForm";
import LoginForm from "./routes/LoginForm";
import Dashboard from "./routes/Dashboard";
import ToDoID from "./routes/ToDoID";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/ToDo/:id" element={<ToDoID />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
