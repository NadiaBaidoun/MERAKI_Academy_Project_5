import "./App.css";
import { Route, Routes } from "react-router-dom";
import Register from "./components/Register";

import CreatPost from "./components/Createpost";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create/post" element={<CreatPost />} />
        <Route path="/home" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
