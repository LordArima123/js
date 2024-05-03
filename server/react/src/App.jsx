//import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import RegisterForm from "./routes/RegisterForm";
import LoginForm from "./routes/LoginForm";
import Dashboard from "./routes/Dashboard";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
