//import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import RegisterForm from "./routes/RegisterForm";
import LoginForm from "./routes/LoginForm";
import Dashboard from "./routes/Dashboard";
import ToDoID from "./routes/ToDoID";
import Error from "./routes/Error";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route errorElement={<Error />} path="/" element={<LoginForm />} />
          <Route
            errorElement={<Error />}
            path="/register"
            element={<RegisterForm />}
          />
          <Route
            errorElement={<Error />}
            path="/Dashboard"
            element={<Dashboard />}
          />
          <Route
            errorElement={<Error />}
            path="/ToDo/:id"
            element={<ToDoID />}
          />
          <Route path="/error/:id" element={<Error />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
