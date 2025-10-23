import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/register";
import Dashboard from "./components/dashboard";
import MySkills from "./components/myskills";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-skills" element={<MySkills />} />
      </Routes>
    </Router>
  );
}

export default App;
