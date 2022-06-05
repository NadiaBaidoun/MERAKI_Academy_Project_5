import "./App.css";
import { Route, Routes } from "react-router-dom";
import Register from "./components/Register";

import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Profile from "./components/Profile";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />

        <Route path="/home" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      
      </Routes>
    </div>
  );
}

export default App;
